namespace GenshinOrchestra.Client.App.Dto
{
    public class UpdateInfoResponse
    {
        public string Version { get; set; } = string.Empty; // Например, "1.5.0"
        public string MinimumVersion { get; set; } = string.Empty; // Например, "1.4.0"
        public string DownloadUrl { get; set; } = string.Empty; // URL к папке с Velopack-релизом
        public bool IsMandatory { get; set; } = false;// Принудительное ли обновление
        public string ReleaseNotes { get; set; } = string.Empty;
    }
}
