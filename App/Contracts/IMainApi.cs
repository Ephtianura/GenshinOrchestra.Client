using GenshinOrchestra.Client.App.Dto;

namespace GenshinOrchestra.Client.App.Services
{
    public interface IMainApi
    {
        Task<UpdateInfoResponse?> GetLatestVerAsync(CancellationToken ct = default);
    }
}