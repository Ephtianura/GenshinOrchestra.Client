using GenshinOrchestra.Client.App.Dto;

namespace GenshinOrchestra.Client.App.Services
{
    public class MockMainApi(HttpClient httpClient) : IMainApi
    {
        public Task<UpdateInfoResponse?> GetLatestVerAsync(CancellationToken cancellationToken = default)
        {
            var mockData = new UpdateInfoResponse
            {
                Version = "1.5.0",
                DownloadUrl = "https://github.com/Ephtianura/GenshinOrchestra.Client/releases/download/v0.1.0/GenshinOrchestra_Setup_v0.1.0.exe",
                IsMandatory = false,
                ReleaseNotes = "Тестовое обновление 1.5.0"
            };

            return Task.FromResult<UpdateInfoResponse?>(mockData);
        }
    }
}
