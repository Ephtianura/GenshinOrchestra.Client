namespace GenshinOrchestra.Client.App.Extensions
{
    public static class AppLogger
    {
        public static void Log(Exception ex)
        {
            try
            {
                var logsDir = Path.Combine(AppContext.BaseDirectory, "logs");
                Directory.CreateDirectory(logsDir);

                var logPath = Path.Combine(logsDir, "error.log");
                var logMessage = $"[{DateTimeOffset.UtcNow}] {ex.GetType()}: {ex.Message}\n{ex.StackTrace}\n\n";

                File.AppendAllText(logPath, logMessage);
            }
            catch { }
        }
    }
}