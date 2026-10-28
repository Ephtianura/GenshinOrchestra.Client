using GenshinOrchestra.Client.App.Dto;
using static GenshinOrchestra.Client.App.Services.MainApi;

namespace GenshinOrchestra.Client.App.Contracts
{
    public interface IMainApi
    {
        Task<UpdateInfoResponse?> GetLatestVerAsync(CancellationToken ct = default);
        Task<List<RoomResponse>> GetAllRooms(CancellationToken ct = default);
        Task<string?> Register(RegisterRequest request, CancellationToken ct = default);
        Task<List<RoomMemberResponse>> GetRoomParticipants(Guid roomId, CancellationToken ct = default);
    }
}