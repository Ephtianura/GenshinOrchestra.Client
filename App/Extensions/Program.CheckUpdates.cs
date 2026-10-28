using GenshinOrchestra.Client.App.Extensions;
using GenshinOrchestra.Client.App.Services;
using Microsoft.Extensions.DependencyInjection;

namespace GenshinOrchestra.Client.App
{
    internal static partial class Program
    {
        private static void CheckUpdates(IServiceProvider services, PhotinoReflectionDispatcher dispatcher, string address)
        {
            if (services.GetRequiredService<UpdateService>().RunUpdateUIIfAvailableAsync(dispatcher, iconPath, address).GetAwaiter().GetResult()) return;
        }
    }
}
