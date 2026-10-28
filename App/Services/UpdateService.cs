using GenshinOrchestra.Client.App.Contracts;
using GenshinOrchestra.Client.App.Dto;
using GenshinOrchestra.Client.App.Extensions;
using GenshinOrchestra.Client.App.Models;
using Photino.NET;
using System.Diagnostics;
using System.Reflection;

namespace GenshinOrchestra.Client.App.Services
{
    public class UpdateService(IMainApi mainApi, HttpClient httpClient)
    {
        private readonly IMainApi _mainApi = mainApi;
        private readonly HttpClient _httpClient = httpClient;
        private const string iconTitle = "Genshin Orchestra – Обновление...";
        public Version CurrentVersion => Assembly.GetExecutingAssembly().GetName().Version ?? new Version(9, 9, 9);

        /// <summary>
        /// Проверяет наличие обновления и, если оно есть, автоматически показывает 
        /// окно Photino с прогресс-баром и выполняет установку.
        /// </summary>
        /// <returns>True - если обновление найдено и окно было запущено. False - если обновлений нет.</returns>
        public async Task<bool> RunUpdateUIIfAvailableAsync(PhotinoReflectionDispatcher dispatcher, string iconPath, string address)
        {
            var updateInfo = await CheckForUpdatesAsync();
            if (updateInfo == null) return false;

            var window = new PhotinoWindow()
                .SetTitle(iconTitle)
                .SetIconFile(iconPath)
                .SetUseOsDefaultSize(false)
                .SetUseOsDefaultLocation(false)
                .SetSize(640, 480)
                .Center()
                .SetChromeless(false)
                .SetResizable(false)
                .RegisterWebMessageReceivedHandler(dispatcher.HandleMessage);
#if DEBUG
            window.Load("http://localhost:5173/updating.html");
#else
            window.SetDevToolsEnabled(false).Load($"{address}/updating.html");
#endif

            if (!string.IsNullOrEmpty(iconPath) && File.Exists(iconPath))
                window.SetIconFile(iconPath);

            _ = Task.Run(async () =>
            {
#if DEBUG
                await Task.Delay(500);
#endif
                try
                {
                    window.SendToReact("UpdateProgress", new ProgressPayload(0, "Подготовка к загрузке..."));

                    await DownloadAndApplyUpdateAsync(updateInfo, payload =>
                    {
                        window.SendToReact("UpdateProgress", new ProgressPayload(
                            Percent: payload.Percent,
                            Message: payload.Message,
                            BytesDownloaded: payload.BytesDownloaded,
                            TotalBytes: payload.TotalBytes,
                            BytesPerSecond: payload.BytesPerSecond,
                            SecondsRemaining: payload.SecondsRemaining
                        ));
                    });
                }
                catch (Exception ex)
                {
                    window.SendToReact("UpdateProgress", new ProgressPayload(
                        Percent: -1,
                        Message: "Ошибка при обновлении",
                        Error: ex.Message
                    ));
                    throw;
                }
            });

            window.WaitForClose();

            return true;
        }

        /// <summary>
        /// Проверяет наличие обновления в mainApi.
        /// </summary>
        /// <returns>
        /// В случае выхода новой версии возвращает UpdateInfo. <br/> Если обновления не нашлось возвращает null.
        /// </returns>
        public async Task<UpdateInfoResponse?> CheckForUpdatesAsync(CancellationToken ct = default)
        {
            var updateInfo = await _mainApi.GetLatestVerAsync(ct);
            if (updateInfo == null) return null;

            if (Version.TryParse(updateInfo.Version, out var remoteVersion))
            {
                if (remoteVersion > CurrentVersion)
                    return updateInfo;
            }

            return null;
        }


        /// <summary>
        /// Скачивает установщик и запускает обновление.
        /// </summary>
        /// <returns>
        /// Прогресс в процентах или ошибку.
        /// </returns>
        public async Task DownloadAndApplyUpdateAsync(UpdateInfoResponse updateInfo, Action<ProgressPayload>? onProgress, CancellationToken ct = default)
        {
            var tempPath = Path.Combine(Path.GetTempPath(), $"GenshinOrchestraSetup_{Guid.NewGuid():N}.exe");

            try
            {
                using var response = await _httpClient.GetAsync(updateInfo.DownloadUrl, HttpCompletionOption.ResponseHeadersRead, ct);
                response.EnsureSuccessStatusCode();

                var totalBytes = response.Content.Headers.ContentLength ?? -1L;

                using (var stream = await response.Content.ReadAsStreamAsync(ct))
                using (var fileStream = new FileStream(tempPath, FileMode.Create, FileAccess.Write, FileShare.None, 81920, true))
                {
                    var buffer = new byte[81920];
                    var totalRead = 0L;
                    int bytesRead;
                    int lastReportedProgress = -1;

                    // Таймеры для расчета скорости
                    var stopwatch = Stopwatch.StartNew();
                    var speedStopwatch = Stopwatch.StartNew();

                    long bytesAtLastSpeedCheck = 0;
                    double currentSpeed = 0;

                    while ((bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length, ct)) > 0)
                    {
                        await Task.Delay(5);
                        await fileStream.WriteAsync(buffer, 0, bytesRead, ct);
                        totalRead += bytesRead;

                        // Обновление скорости раз в 500мс
                        if (speedStopwatch.ElapsedMilliseconds >= 500)
                        {
                            long bytesDelta = totalRead - bytesAtLastSpeedCheck;
                            double secondsDelta = speedStopwatch.Elapsed.TotalSeconds;

                            if (secondsDelta > 0)
                            {
                                currentSpeed = bytesDelta / secondsDelta; // байт в секунду
                            }

                            bytesAtLastSpeedCheck = totalRead;
                            speedStopwatch.Restart();
                        }

                        // Расчет оставшегося времени
                        double secondsRemaining = 0;
                        if (currentSpeed > 0 && totalBytes > 0)
                        {
                            long bytesRemaining = totalBytes - totalRead;
                            secondsRemaining = bytesRemaining / currentSpeed;
                        }

                        if (totalBytes > 0)
                        {
                            int currentProgress = (int)((double)totalRead / totalBytes * 100);

                            // Отправляем, если изменился процент ИЛИ прошла хотя бы секунда с последнего обновления
                            if (currentProgress != lastReportedProgress || speedStopwatch.ElapsedMilliseconds >= 1000)
                            {
                                lastReportedProgress = currentProgress;

                                onProgress?.Invoke(new ProgressPayload(
                                    Percent: currentProgress,
                                    Message: "Загрузка обновления...",
                                    Error: null,
                                    BytesDownloaded: totalRead,
                                    TotalBytes: totalBytes,
                                    BytesPerSecond: currentSpeed,
                                    SecondsRemaining: secondsRemaining
                                ));
                            }
                        }
                        else
                        {
                            // Если общий размер неизвестен
                            onProgress?.Invoke(new ProgressPayload(
                                Percent: 0,
                                Message: "Загрузка обновления...",
                                Error: null,
                                BytesDownloaded: totalRead,
                                TotalBytes: 0,
                                BytesPerSecond: currentSpeed,
                                SecondsRemaining: 0
                            ));
                        }
                    }
                }
                onProgress?.Invoke(new ProgressPayload(100, "Загрузка завершена"));

                await Task.Delay(5000);
                Process.Start(new ProcessStartInfo
                {
                    FileName = tempPath,
                    Arguments = "/VERYSILENT /SUPPRESSMSGBOXES /NORESTART /RUN",
                    UseShellExecute = true
                });

                Environment.Exit(0);
            }
            catch (OperationCanceledException)
            {
                onProgress?.Invoke(new ProgressPayload(
                    Percent: 0,
                    Message: "Загрузка была отменена",
                    Error: "Operation cancelled"
                ));
                throw;
            }
            catch (Exception ex)
            {
                if (File.Exists(tempPath))
                {
                    try { File.Delete(tempPath); } catch { }
                }
                onProgress?.Invoke(new ProgressPayload(
                    Percent: 0,
                    Message: "Произошла ошибка во время скачивания",
                    Error: ex.Message
                ));
                throw;
            }
        }
    }
}

