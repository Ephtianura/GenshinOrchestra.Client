using GenshinOrchestra.Client.App.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Photino.NET;

namespace GenshinOrchestra.Client.App
{
    internal static partial class Program
    {
        private static PhotinoWindow _window;
        private readonly static string iconPath = Path.Combine("icon.ico");
        private const string windlowTitle = "Genshin Orchestra Client "; // Пробел важен для иконки.

        [STAThread]
        static void Main()
        {
            var (app, address) = StartWebServer();

            try
            {
                var services = Configure.Services();
                var dispatcher = services.GetRequiredService<PhotinoReflectionDispatcher>();

#if DEBUG
                CheckUpdates(services, dispatcher, address);
#else
                CheckUpdates(services, dispatcher, address);
#endif

                if (!SingleInstance.IsFirstInstance)
                {
                    SingleInstance.ActivateExisting();
                    return;
                }

                _window = new PhotinoWindow()
                    .SetTitle(windlowTitle)
                    .SetIconFile(iconPath)
                    .SetUseOsDefaultSize(false)
                    .SetUseOsDefaultLocation(false)
                    .SetSize(1280, 720)
                    .Center()
                    .SetChromeless(false)
                    .SetResizable(false)
                    .RegisterWindowCreatedHandler((sender, e) => EnableMinimizeButton(_window.WindowHandle))
                    .RegisterWebMessageReceivedHandler(dispatcher.HandleMessage);

#if DEBUG
                _window.Load("http://localhost:5173");
#else
                _window.SetDevToolsEnabled(true).Load(address);
#endif
                _window.WaitForClose();
            }
            finally
            {
                app.StopAsync().GetAwaiter().GetResult();
                app.DisposeAsync().AsTask().GetAwaiter().GetResult();
            }
        }

    }
}
