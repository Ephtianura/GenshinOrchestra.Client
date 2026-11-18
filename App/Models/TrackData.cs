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
            return new TrackDataBuilder("test_track_33", scheduledStartTimeUtcMs)
                // Прогрев
               .At(0).Down("q").At(10).Up("q").At(50).Down("w").At(60).Up("w").At(100).Down("e").At(110).Up("e").At(150).Down("r").At(160).Up("r").At(200).Down("t").At(210).Up("t").At(250).Down("y").At(260).Up("y").At(300).Down("u").At(310).Up("u")
               .At(350).Down("a").At(360).Up("a").At(400).Down("s").At(410).Up("s").At(450).Down("d").At(460).Up("d").At(500).Down("f").At(510).Up("f").At(550).Down("g").At(560).Up("g").At(600).Down("h").At(610).Up("h").At(650).Down("j").At(660).Up("j")
               .At(700).Down("z").At(710).Up("z").At(750).Down("x").At(760).Up("x").At(800).Down("c").At(810).Up("c").At(850).Down("v").At(860).Up("v").At(900).Down("b").At(910).Up("b").At(950).Down("n").At(960).Up("n").At(1000).Down("m").At(1010).Up("m")
                // ---------------
               .At(1020).Down("U")
               .At(1030).Up("U")
               .At(1179).Down("Y")
               .At(1189).Up("Y")
               .At(1339).Down("Q", "W")
               .At(1349).Up("Q", "W")
               .At(1658).Down("W", "E")
               .At(1668).Up("W", "E")
               .At(1977).Down("T", "Y")
               .At(1987).Up("T", "Y")
               .At(2137).Down("R", "T")
               .At(2147).Up("R", "T")
               .At(2296).Down("H")
               .At(2306).Up("H")
               .At(2615).Down("J")
               .At(2625).Up("J")
               .At(2934).Down("R", "T")
               .At(2944).Up("R", "T")
               .At(3094).Down("E")
               .At(3104).Up("E")
               .At(3254).Down("G", "H")
               .At(3264).Up("G", "H")
               .At(3573).Down("J")
               .At(3583).Up("J")
               .At(3892).Down("E")
               .At(3902).Up("E")
               .Build();
        }
    }

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
                Action = KeyAction.Press,
                Keys = [.. keys]
            });
            return this;
        }
        public TrackDataBuilder Up(params string[] keys)
        {
            _track.Events.Add(new TrackEvent
            {
                TimeOffsetMs = _currentOffsetMs,
                Action = KeyAction.Release,
                Keys = [.. keys]
            });
            return this;
        }

        public TrackData Build() => _track;
    }

    public class TrackEvent
    {
        [JsonPropertyName("timeOffsetMs")]
        public int TimeOffsetMs { get; set; }

        [JsonPropertyName("action")]
        public KeyAction Action { get; set; }

        [JsonPropertyName("keys")]
        public List<string> Keys { get; set; } = [];
    }
}
