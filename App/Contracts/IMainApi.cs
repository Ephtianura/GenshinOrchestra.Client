using GenshinOrchestra.Client.App.Dto;

namespace GenshinOrchestra.Client.App.Contracts
{
    public interface IMainApi
    {
        Task<UpdateInfoResponse?> GetLatestVerAsync(CancellationToken ct = default);
    }
}