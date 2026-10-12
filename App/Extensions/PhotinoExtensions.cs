using Photino.NET;
using System.Text.Json;

namespace GenshinOrchestra.Client.App.Extensions
{
    public static class PhotinoExtensions
    {
        public static void SendToReact<T>(this PhotinoWindow window, string action, T payload)
        {
            var message = JsonSerializer.Serialize(new { action, payload });
            window.SendWebMessage(message);
        }
    }
}
