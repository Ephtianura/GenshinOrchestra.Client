using GenshinOrchestra.Client.App.Contracts;
using GenshinOrchestra.Client.App.Dto;
using GenshinOrchestra.Client.App.Extensions;
using GenshinOrchestra.Client.App.Models;
using System.Net.Http.Json;
using System.Text.Json;

namespace GenshinOrchestra.Client.App.Services
{
    public class MainApi(HttpClient httpClient) : IMainApi
    {
        private readonly HttpClient _httpClient = httpClient;
        public async Task<UpdateInfoResponse?> GetLatestVerAsync(CancellationToken ct = default)
        {
            try
            {
                return await ExecuteAsync(async () =>
                    await _httpClient.GetFromJsonAsync<UpdateInfoResponse>("client/version", ct));
            }
            catch (Exception ex)
            {
                AppLogger.LogError(ex);
                return null;
            }
        }

        private static async Task<T> ExecuteAsync<T>(Func<Task<T>> action)
        {
            try
            {
                return await action();
            }
            catch (TaskCanceledException ex)
            {
                throw new MainApiTimeoutException("API timeout", ex);
            }
            catch (HttpRequestException ex)
            {
                throw new MainApiHttpException("API HTTP error", ex);
            }
            catch (JsonException ex)
            {
                throw new MainApiInvalidResponseException("API invalid JSON", ex);
            }
        }
    }
}
