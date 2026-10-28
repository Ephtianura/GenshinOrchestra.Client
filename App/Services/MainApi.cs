using GenshinOrchestra.Client.App.Contracts;
using GenshinOrchestra.Client.App.Dto;
using GenshinOrchestra.Client.App.Exceptions;
using System.Net.Http.Json;
using System.Text.Json;

namespace GenshinOrchestra.Client.App.Services
{
    public partial class MainApi(HttpClient httpClient) : IMainApi
    {
        private readonly HttpClient _httpClient = httpClient;
        public async Task<UpdateInfoResponse?> GetLatestVerAsync(CancellationToken ct = default)
        {
            return await ExecuteAsync(async () =>
                await _httpClient.GetFromJsonAsync<UpdateInfoResponse>("client/check-update", ct));
        }

        public async Task<List<RoomResponse>> GetAllRooms(CancellationToken ct = default)
        {
            return await ExecuteAsync(async () =>
                await _httpClient.GetFromJsonAsync<List<RoomResponse>>("client/rooms", ct));
        }

        public async Task<List<RoomMemberResponse>> GetRoomParticipants(Guid roomId, CancellationToken ct = default)
        {
            return await ExecuteAsync(async () =>
                await _httpClient.GetFromJsonAsync<List<RoomMemberResponse>>($"client/rooms/{roomId}/participants", ct));
        }

        public async Task<string?> Register(RegisterRequest request, CancellationToken ct = default)
        {
            return await ExecuteAsync(async () =>
            {
                using var response = await _httpClient.PostAsJsonAsync("client/auth/register", request, ct);

                response.EnsureSuccessStatusCode();

                return await response.Content.ReadFromJsonAsync<string>(cancellationToken: ct);
            });
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
