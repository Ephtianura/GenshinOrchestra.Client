using GenshinOrchestra.Client.App.Models;
using System.Diagnostics;

namespace GenshinOrchestra.Client.App
{

    public class PrecisionPlaybackEngine
    {
        /// <summary>
        /// Запускает воспроизведение партитуры с высокоточной синхронизацией.
        /// </summary>
        /// <param name="track">Загруженный трек</param>
        /// <param name="serverDeltaMs">Смещение часов: ServerTime - LocalTime</param>
        /// <param name="cancellationToken">Токен отмены</param>
        public async Task PlayAsync(TrackData track, long serverDeltaMs = 0, CancellationToken cancellationToken = default)
        {
            var sortedEvents = track.Events.OrderBy(e => e.TimeOffsetMs).ToList();
            if (sortedEvents.Count == 0) return;

            Console.WriteLine($"[Engine] Подготовка трека '{track.TrackId}'. Событий: {sortedEvents.Count}");

            // Вычисляем целевое локальное время старта
            long targetStartLocalUtcMs = track.StartTimeUtcMs - serverDeltaMs;
            long currentLocalUtcMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            long delayToStart = targetStartLocalUtcMs - currentLocalUtcMs;

            if (delayToStart > 0)
            {
                Console.WriteLine($"[Engine] Ожидание старта трека: {delayToStart} мс...");
                await Task.Delay((int)delayToStart, cancellationToken);
            }

            Stopwatch stopwatch = Stopwatch.StartNew();

            foreach (var ev in sortedEvents)
            {
                cancellationToken.ThrowIfCancellationRequested();

                long targetTimeMs = ev.TimeOffsetMs;

                // Гибридный планировщик: Task.Delay для длинного паузы + SpinWait для точности
                while (stopwatch.ElapsedMilliseconds < targetTimeMs)
                {
                    long remainingMs = targetTimeMs - stopwatch.ElapsedMilliseconds;

                    if (remainingMs > 5)
                    {
                        await Task.Delay((int)(remainingMs - 2), cancellationToken);
                    }
                    else
                    {
                        // Активный SpinWait за 2 мс до наступления кванта времени
                        Thread.SpinWait(100);
                    }
                }

                // Выполнение события
                long actualTimeMs = stopwatch.ElapsedMilliseconds;
                Console.WriteLine($"[{actualTimeMs,5} ms] [Target: {targetTimeMs} ms] Action: {ev.Action,-7} Keys: [{string.Join(", ", ev.Keys)}]");

                foreach (string keyStr in ev.Keys)
                {
                    if (!string.IsNullOrEmpty(keyStr))
                    {
                        WindowsInput.SendKey(keyStr[0], ev.Action);
                    }
                }
            }

            stopwatch.Stop();
            Console.WriteLine($"[Engine] Воспроизведение трека завершено за {stopwatch.ElapsedMilliseconds} мс.");
        }
    }
}
