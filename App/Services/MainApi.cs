using GenshinOrchestra.Client.App.Dto;
using System.Net.Http.Json;

namespace GenshinOrchestra.Client.App.Services
{
    public class MainApi(HttpClient httpClient) : IMainApi
    {
        private readonly HttpClient _httpClient = httpClient;

        public async Task<UpdateInfoResponse?> GetLatestVerAsync(CancellationToken ct = default)
        {
            try
            {
                return await _httpClient.GetFromJsonAsync<UpdateInfoResponse>("client/check-update", ct);
            }
            catch
            {
                return null;
            }
        }
    }
}
