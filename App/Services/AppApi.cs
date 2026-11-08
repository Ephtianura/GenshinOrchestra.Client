using GenshinOrchestra.Client.App.Extensions;
using GenshinOrchestra.Client.App.Models;

namespace GenshinOrchestra.Client.App.Services
{
    public class AppApi()
    {
        public Task Ping() => Task.CompletedTask;

        // Для тестирования
        public string GetTest(int id) => $"aaaa+ {id}";
        public bool TestBool() => true;

        public string GetHwid() => AuthService.GenerateHwid();


        private CancellationTokenSource? _cts;

        public async Task Start(TrackData track)
        {
            await Stop();

            _cts = new CancellationTokenSource();

            try
            {
                await PrecisionPlaybackEngine.PlayAsync(track, serverDeltaMs: 0, _cts.Token);
            }
            catch (OperationCanceledException)
            {
            }
            catch (Exception ex)
            {
                AppLogger.LogError(ex);
            }
            finally
            {
                _cts.Dispose();
                _cts = null;
            }
        }

        public async Task Stop()
        {
            if (_cts is null)
                return;

            await _cts.CancelAsync();
        }
        public async Task TestInput(CancellationToken ct = default)
        {
            for (int i = 1; i > 0; i--)
            {
                Console.WriteLine($"Старт через {i} сек...");
                await Task.Delay(1000);
            }

            // Эмуляция: старт трека планируется через 500 мс от текущего момента
            long nowUtc = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            long scheduledStartTime = nowUtc + 500;

            // Загружаем тестовый JSON-объект
            var track = TrackData.GetMockTrack(scheduledStartTime);

            // Запуск движка
            await PrecisionPlaybackEngine.PlayAsync(track, serverDeltaMs: 0, ct);

            Console.WriteLine("\nТест успешно завершен.");
        }
    }
}
