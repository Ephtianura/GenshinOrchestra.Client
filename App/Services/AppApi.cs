using GenshinOrchestra.Client.App.Extensions;
using GenshinOrchestra.Client.App.Models;

namespace GenshinOrchestra.Client.App.Services
{
    public class AppApi()
    {
        public Task Ping() => Task.CompletedTask;

        // Для тестирования
        public string GetTest(int id) => $"Test aaaa + {id}";

        public string GetHwid() => AuthService.GenerateHwid();


        private CancellationTokenSource? _cts;
        private readonly object _lock = new();

        public async Task Start(TrackData track, int serverDeltaMs)
        {
            CancellationTokenSource cts;

            lock (_lock)
            {
                _cts?.Cancel();

                cts = new CancellationTokenSource();
                _cts = cts;
            }

            try
            {
                await PrecisionPlaybackEngine.PlayAsync(
                    track,
                    serverDeltaMs,
                    cts.Token
                );
            }
            catch (OperationCanceledException) { }
            catch (Exception ex)
            {
                AppLogger.LogError(ex);
            }
            finally
            {
                lock (_lock)
                {
                    if (_cts == cts)
                        _cts = null;
                }

                cts.Dispose();
            }
        }

        public void Stop()
        {
            lock (_lock)
            {
                _cts?.Cancel();
            }
        }

        public async Task TestInput(CancellationToken ct = default)
        {
            long nowUtc = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            long scheduledStartTime = nowUtc + 1000;

            var track = TrackData.GetMockTrack(scheduledStartTime);
            await PrecisionPlaybackEngine.PlayAsync(track, 0, ct);
        }
    }
}
