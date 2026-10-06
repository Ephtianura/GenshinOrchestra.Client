using GenshinOrchestra.Client.App.Models;
using Photino.NET;
using System.Drawing;
using System.Runtime.InteropServices;

namespace GenshinOrchestra.Client.App
{
    class Program
    {
        private static PhotinoWindow _window;

        #region Win32 API для включения кнопки сворачивания
        [DllImport("user32.dll", SetLastError = true)]
        private static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        private static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        private const int GWL_STYLE = -16;
        private const int WS_MINIMIZEBOX = 0x00020000;
        #endregion

        [STAThread]
        static void Main(string[] args)
        {
            string iconPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "icon.ico");

            _window = new PhotinoWindow()
                .SetTitle("Genshin Orchestra Client")
                .SetIconFile(iconPath)
                .SetUseOsDefaultSize(false)
                .SetUseOsDefaultLocation(false)
                .SetSize(1280, 720)
                .SetLocation(new Point(0, 0))
                .Center()
                .SetChromeless(false)
                .SetResizable(false)
                .SetDevToolsEnabled(false)
                .RegisterWindowCreatedHandler((sender, e) => EnableMinimizeButton(_window.WindowHandle))
                .RegisterWebMessageReceivedHandler(OnMessageFromUI);

#if DEBUG
            _window.Load("http://localhost:5173");
#else
            _window.Load("wwwroot/index.html");
#endif
            _window.WaitForClose();
        }

        private static async void OnMessageFromUI(object? sender, string message)
        {

            if (message == "START")
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

        private static void EnableMinimizeButton(IntPtr hWnd)
        {
            int currentStyle = GetWindowLong(hWnd, GWL_STYLE);
            SetWindowLong(hWnd, GWL_STYLE, currentStyle | WS_MINIMIZEBOX);
        }
    }
}



//if (message == "TEST_INPUT")
//{
//    _window.SendWebMessage(JsonSerializer.Serialize(new
//    {
//        type = "TEST_START",
//        message = "Быстро кликните в Блокнот / Genshin! Печать через 3 секунды..."
//    }));
//    await Task.Delay(1000);
//    char[] keysToPress = { 'Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F' };
//    foreach (var key in keysToPress)
//    {
//        InputSimulator.PressKey(key, holdDurationMs: 60);
//        await Task.Delay(150);
//    }
//    _window.SendWebMessage(JsonSerializer.Serialize(new
//    {
//        type = "TEST_COMPLETE",
//        status = "Успешно напечатано: QWERASDF!"
//    }));
//}