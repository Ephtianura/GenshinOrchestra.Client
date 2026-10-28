namespace GenshinOrchestra.Client.App.Dto
{
    public record RoomResponse(
       Guid Id,
       string Name,
       bool IsActive,
       int MaxPlayers,
       DateTimeOffset CreatedAt
   );
}
