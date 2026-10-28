using GenshinOrchestra.Client.App.Extensions;
using Photino.NET;

namespace GenshinOrchestra.Client.App.ToDelete
{
    public class AppSender
    {
        private readonly SignalRClient _signalR;
        private readonly PhotinoWindow _window;
        public AppSender(SignalRClient signalR, PhotinoWindow window)
        {
            _signalR = signalR;
            _window = window;
            _signalR.NotesReceived += OnNotesReceived;
        }

        private void OnNotesReceived()
        {
            Console.WriteLine("Сервер сообщил об обновлении нот");
            _window.SendToReact("NotesReceived", "");
        }
    }
}
