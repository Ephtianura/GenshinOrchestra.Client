using GenshinOrchestra.Client.App.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Photino.NET;

namespace GenshinOrchestra.Client.App
{
    internal static partial class Program
    {
        private static PhotinoWindow _window;
        private const string IconPath = "icon.ico";
        private const string WindowTitle = "Genshin Orchestra Client "; // Пробел важен для иконки.

        [STAThread]
        static void Main()
        {
            var (app, address) = StartWebServer();

            try
            {
                var services = Configure.Services();
                var dispatcher = services.GetRequiredService<PhotinoReflectionDispatcher>();

#if DEBUG
                //CheckUpdates(services, dispatcher, address);
#else
                CheckUpdates(services, dispatcher, address);
#endif
                if (!EnsureSingleInstance()) return;

                _window = new PhotinoWindow()
                    .SetTitle(WindowTitle)
                    .SetIconFile(IconPath)
                    .SetUseOsDefaultSize(false)
                    .SetUseOsDefaultLocation(false)
                    .SetMinSize(1280, 720)
                    .SetMaxSize(1600, 900)
                    .SetChromeless(false)
                    .RegisterWindowCreatedHandler((sender, e) => DisableMaximizeButton(_window.WindowHandle))
                    .RegisterWebMessageReceivedHandler(dispatcher.HandleMessage)
                    .Center();

#if DEBUG
                _window.Load("http://localhost:5173");
#else
                _window.SetDevToolsEnabled(false).Load(address);
#endif
                _window.WaitForClose();
            }
            catch (Exception ex)
            {
                LogAndShowException(ex);
            }
            finally
            {
                app.StopAsync().GetAwaiter().GetResult();
                app.DisposeAsync().AsTask().GetAwaiter().GetResult();
            }
        }

    }
}
