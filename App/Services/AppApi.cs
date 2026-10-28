using GenshinOrchestra.Client.App.Models;

namespace GenshinOrchestra.Client.App.Services
{
    public class AppApi()
    {
        private CancellationTokenSource? _cts;

        public static Task Ping() => Task.CompletedTask;


        // Для тестирования
        public static string GetTest(int id) => $"aaaa+ {id}";
        public static bool TestBool() => true;

        public static string GetHwid() => AuthService.GenerateHwid();

        public async Task Stop()
        {

        }
      
        public static async Task Start(CancellationToken ct = default)
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
            TrackData track = TrackData.GetMockTrack(scheduledStartTime);

            // Запуск движка
            var engine = new PrecisionPlaybackEngine();
            await engine.PlayAsync(track, serverDeltaMs: 0);

            Console.WriteLine("\nТест успешно завершен.");
        }
    }
}
