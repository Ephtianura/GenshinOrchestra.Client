namespace GenshinOrchestra.Client.App.Dto
{
    public record RegisterRequest(
            string Name,
            string Hwid,
            string? Token
        );
}
