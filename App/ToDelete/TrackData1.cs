using GenshinOrchestra.Client.App.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GenshinOrchestra.Client.App.ForDelete
{
    public class TrackData1
    {
        [JsonPropertyName("trackId")]
        public string TrackId { get; set; } = string.Empty;

        [JsonPropertyName("startTimeUtcMs")]
        public long StartTimeUtcMs { get; set; }

        [JsonPropertyName("events")]
        public List<TrackEvent> Events { get; set; } = [];

        public static TrackData1 GetMockTrack(long scheduledStartTimeUtcMs)
        {
            string mockJson = $$"""
        {
          "trackId": "la_vaguelette_part_3",
          "startTimeUtcMs": {{scheduledStartTimeUtcMs}},
          "events": [
            {
              "timeOffsetMs": 0,
              "action": "DOWN",
              "keys": ["Q", "E"]
            },
         {
              "timeOffsetMs": 1000,
              "action": "DOWN",
              "keys": ["Q"]
            },
            {
              "timeOffsetMs": 1000,
              "action": "UP",
              "keys": ["Q", "E"]
            },
            {
              "timeOffsetMs": 1000,
              "action": "DOWN",
              "keys": ["W"]
            },
            {
              "timeOffsetMs": 1000,
              "action": "UP",
              "keys": ["W"]
            }
          ]
        }
        """;

            return JsonSerializer.Deserialize<TrackData1>(mockJson)
                   ?? throw new InvalidOperationException("Failed to parse mock JSON.");
        }
    }

    public class TrackEvent
    {
        [JsonPropertyName("timeOffsetMs")]
        public int TimeOffsetMs { get; set; }

        [JsonPropertyName("action")]
        public string RawAction { get; set; } = "DOWN";

        [JsonPropertyName("keys")]
        public List<string> Keys { get; set; } = [];

        [JsonIgnore]
        public KeyAction Action => RawAction.Equals("UP", StringComparison.OrdinalIgnoreCase)
            ? KeyAction.Release
            : KeyAction.Press;
    }
}
