using GenshinOrchestra.Client.App.Contracts;
using GenshinOrchestra.Client.App.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GenshinOrchestra.Client.App.Extensions
{
    public static class Configure
    {
        public static IServiceProvider Services()
        {
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json", false, true).Build();
            var services = new ServiceCollection();
            services.AddSingleton<IConfiguration>(configuration);

            // MainApi
            services.AddHttpClient<IMainApi,
#if DEBUG
                MainApi
#else
                MockMainApi
#endif
                >(client =>
            {
                client.BaseAddress = new Uri(configuration["MainServer:ApiUrl"]
                    ?? throw new InvalidOperationException("Куда-то пропала ссылка на сервер..."));
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
            services.AddSingleton(sp =>
            {
                var dispatcher = new PhotinoReflectionDispatcher();
                dispatcher.RegisterService(sp.GetRequiredService<AppApi>());
                return dispatcher;
            });

            return services.BuildServiceProvider();
        }
    }
}
