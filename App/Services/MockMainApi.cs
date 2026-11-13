using GenshinOrchestra.Client.App.Contracts;
using GenshinOrchestra.Client.App.Dto;

namespace GenshinOrchestra.Client.App.Services
{
    public class MockMainApi(HttpClient httpClient) : IMainApi
    {
        private readonly HttpClient _httpClient = httpClient;

        public async Task<UpdateInfoResponse?> GetLatestVerAsync(CancellationToken ct = default)
        {
            await Task.Delay(2000, ct);
            var mockData = new UpdateInfoResponse
            {
                Version = "1.5.0",
                DownloadUrl = "https://github.com/Ephtianura/GenshinOrchestra.Client/releases/download/v0.3.3/GenshinOrchestra_Setup_v0.3.3.exe",
                IsMandatory = false,
                ReleaseNotes = "Тестовое обновление 1.5.0"
            };

            return await Task.FromResult<UpdateInfoResponse?>(mockData);
        }
    }
}
