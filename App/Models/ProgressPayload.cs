using System.Text.Json.Serialization;

namespace GenshinOrchestra.Client.App.Models
{
    public record ProgressPayload(
        [property: JsonPropertyName("percent")] int Percent,
        [property: JsonPropertyName("message")] string? Message = null,
        [property: JsonPropertyName("error")] string? Error = null,

        [property: JsonPropertyName("bytesDownloaded")] long BytesDownloaded = 0,
        [property: JsonPropertyName("totalBytes")] long TotalBytes = 0,
        [property: JsonPropertyName("bytesPerSecond")] double BytesPerSecond = 0,
        [property: JsonPropertyName("secondsRemaining")] double SecondsRemaining = 0
    );
}

