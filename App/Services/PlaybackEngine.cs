using GenshinOrchestra.Client.App.Models;
using System.Diagnostics;

namespace GenshinOrchestra.Client.App.Services
{
    public static class PrecisionPlaybackEngine
    {
        /// <summary>
        /// Запускает воспроизведение партитуры.
        /// </summary>
        /// <param name="track">Загруженный трек</param>
        /// <param name="serverDeltaMs">Смещение локальных часов относительно сервера</param>
        /// <param name="ct">Токен отмены</param>
        /// <exception cref="ArgumentNullException"></exception>
        /// <exception cref="OperationCanceledException"></exception>
        /// Максимальный допустимый рассинхрон 30мс. В идеале < 20. Это не гарантия метода, а требование к приложению.
        public static async Task PlayAsync(TrackData track, long serverDeltaMs = 0, CancellationToken ct = default)
        {
            ArgumentNullException.ThrowIfNull(track); // Исключение если нет трека.

            var events = track.Events; // Убрал сортировку чтобы не нагружать проц и gc огромными объектами перед началом.
            if (events.Count == 0) return;

            // Локальное время старта
            long targetStartLocalUtcMs = track.StartTimeUtcMs - serverDeltaMs;

            // Пробуждает поток за 10мс до старта и крутит его в цикле пока не достигним нужного времени.
            // Вместо старого Task.Delay(), который мог пробудиться на позже.
            // В теории, должно стартовать точнее и надёжнее на машинах.
            // Подробные комментарии ниже, принцип тот же.
            while (true)
            {
                ct.ThrowIfCancellationRequested();
                long remainingToStart = targetStartLocalUtcMs - DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

                if (remainingToStart <= 0) break;

                if (remainingToStart > 15) // Why 15? Because у Винды 64 такта в секунду. 1000/64 = ~15.62ms
                {
                    await Task.Delay((int)(remainingToStart - 10), ct);
                }
                else
                {
                    Thread.SpinWait(100);
                }
            }

            Stopwatch stopwatch = Stopwatch.StartNew(); // Локальный таймер в момент начала воспроизведения.

            // Перебор всех ивентов
            foreach (var ev in events)
            {
                ct.ThrowIfCancellationRequested(); // Отмена воспроизведения.

                long targetTimeMs = ev.TimeOffsetMs; // Целевое время нажатия относительно начала. Например: 3250мс.

                // Ожидание нужного момента
                while (stopwatch.ElapsedMilliseconds < targetTimeMs)                 // Если время ещё не наступило:
                {
                    long remainingMs = targetTimeMs - stopwatch.ElapsedMilliseconds; // Считаем, а сколько осталось-то?
                             
                    if (remainingMs > 15)                                            // Если ждать осталось больше 15мс. 
                    {
                        await Task.Delay((int)(remainingMs - 10), ct);               // Усыпляем поток, но пробуждаем за 10мс до начала, чтобы дать ему время проснуться.
                    }
                    else                                                             // Иначе
                    {
                        Thread.SpinWait(100);                                        // Крутим ядро 100 тактов ( ~25нс ) при 4ГГц процессоре. И по новой, пока не выйдем из while.
                    }
                }

                // Нажатие клавиш
                foreach (string keyStr in ev.Keys)
                {
                    if (!string.IsNullOrWhiteSpace(keyStr))
                    {
                        WindowsInput.SendKey(keyStr[0], ev.Action);
                    }
                }
            }

            stopwatch.Stop();
        }
    }
}
