using GenshinOrchestra.Client.App.ToDelete;
using System.Text.Json.Serialization;

namespace GenshinOrchestra.Client.App.Models
{
    public class TrackData
    {
        [JsonPropertyName("trackId")]
        public string TrackId { get; set; } = string.Empty;

        [JsonPropertyName("startTimeUtcMs")]
        public long StartTimeUtcMs { get; set; }

        [JsonPropertyName("events")]
        public List<TrackEvent> Events { get; set; } = [];

        public static TrackData GetMockTrack(long scheduledStartTimeUtcMs)
        {
            var builder = new TrackDataBuilder("la_vaguelette_part_3", scheduledStartTimeUtcMs)
            .At(0).Down("Q", "E")

            .At(940).Up("Q")
            .At(1000).Down("Q")

            .At(1940).Up("Q")
            .At(2000).Down("Q")

            .At(2940).Up("Q")
            .At(3000).Down("Q")

            .At(3940).Up("Q")
            .At(4000).Down("Q")

            .At(4940).Up("Q", "E")
            .At(5000).Down("W")
            .At(5060).Up("W");

            int spamStartMs = 500;
            int noteStepMs = 40; 
            int holdMs = 20;      

            for (int i = 0; i < 64; i++)
            {
                int noteTime = spamStartMs + (i * noteStepMs);

                builder.At(noteTime).Down("Q")
                       .At(noteTime + holdMs).Up("Q");
            }

            return builder.Build();
        }
    }

    /// <summary>
    /// Builder
    /// </summary>
    public class TrackDataBuilder
    {
        private readonly TrackData _track;
        private int _currentOffsetMs;

        public TrackDataBuilder(string trackId, long startTimeUtcMs)
        {
            _track = new TrackData
            {
                TrackId = trackId,
                StartTimeUtcMs = startTimeUtcMs
            };
        }
        public TrackDataBuilder At(int offsetMs)
        {
            _currentOffsetMs = offsetMs;
            return this;
        }
        public TrackDataBuilder Down(params string[] keys)
        {
            _track.Events.Add(new TrackEvent
            {
                TimeOffsetMs = _currentOffsetMs,
                RawAction = "DOWN",
                Keys = [.. keys]
            });
            return this;
        }
        public TrackDataBuilder Up(params string[] keys)
        {
            _track.Events.Add(new TrackEvent
            {
                TimeOffsetMs = _currentOffsetMs,
                RawAction = "UP",
                Keys = [.. keys]
            });
            return this;
        }

        public TrackData Build() => _track;
    }
}
