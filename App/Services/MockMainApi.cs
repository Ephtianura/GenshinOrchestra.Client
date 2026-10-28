using GenshinOrchestra.Client.App.Contracts;
using GenshinOrchestra.Client.App.Dto;

namespace GenshinOrchestra.Client.App.Services
{
    public class MockMainApi(HttpClient httpClient) : IMainApi
    {
        public Task<List<RoomResponse>> GetAllRooms(CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<UpdateInfoResponse?> GetLatestVerAsync(CancellationToken ct = default)
        {
            var mockData = new UpdateInfoResponse
            {
                Version = "1.5.0",
                DownloadUrl = "https://github.com/Ephtianura/GenshinOrchestra.Client/releases/download/v0.2.0/GenshinOrchestra_Setup_v0.2.0.exe",
                IsMandatory = false,
                ReleaseNotes = "Тестовое обновление 1.5.0"
            };

            return Task.FromResult<UpdateInfoResponse?>(mockData);
        }

        public Task<List<RoomMemberResponse>> GetRoomParticipants(Guid roomId, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }

        public Task<string?> Register(RegisterRequest request, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }
    }
}
