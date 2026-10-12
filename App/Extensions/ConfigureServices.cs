using GenshinOrchestra.Client.App.Services;
using Microsoft.Extensions.DependencyInjection;

namespace GenshinOrchestra.Client.App.Extensions
{
    public static class Configure
    {
        public static IServiceProvider Services()
        {
            var services = new ServiceCollection();

            // MainApi
            services.AddHttpClient<IMainApi,
#if DEBUG
                MockMainApi
#else
                MainApi
#endif
                >(client =>
            {
                client.BaseAddress = new Uri("https://orchestra.aniflow.xyz/api/");
                client.Timeout = TimeSpan.FromSeconds(10);
                client.DefaultRequestHeaders.Add("User-Agent", "GenshinOrchestra-Client");
            });

            // UpdateService
            services.AddHttpClient<UpdateService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(15);
                client.DefaultRequestHeaders.Add("User-Agent", "GenshinOrchestra-Client");
            }).AddStandardResilienceHandler();

            // AppApi
            services.AddSingleton<AppApi>();
            services.AddSingleton<PhotinoReflectionDispatcher>(sp =>
            {
                var dispatcher = new PhotinoReflectionDispatcher();
                dispatcher.RegisterService(sp.GetRequiredService<AppApi>());
                return dispatcher;
            });

            return services.BuildServiceProvider();
        }
    }
}
