using GenshinOrchestra.Client.App.Extensions;
using GenshinOrchestra.Client.App.Models;

namespace GenshinOrchestra.Client.App.Services
{
    public class AppApi()
    {
        public Task Ping() => Task.CompletedTask;
        public string GetTest(int id) => $"Test aaaa + {id}"; // Для тестирования
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

        public async Task TestInput()
        {
            long now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            long scheduledStartTime = now + 1500;

            var track = TrackData.GetMockTrack(scheduledStartTime);
            await Start(track, 0);
        }
    }
}
