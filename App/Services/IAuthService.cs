
namespace GenshinOrchestra.Client.App.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(string name, string hwid, CancellationToken ct = default);
    }
}