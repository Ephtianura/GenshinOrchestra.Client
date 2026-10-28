namespace GenshinOrchestra.Client.App.Dto
{
    public record RoomMemberResponse(
        Guid UserId,
        string Name,
        string? InGameNick,
        RoomRole Role,
        MemberStatus Status,
        string? AvatarUrl
    );
}
