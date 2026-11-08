namespace GenshinOrchestra.Client.App.Extensions
{
    public static class AppLogger
    {
        public static void LogError(Exception ex)
        {
            try
            {
                var logsDir = Path.Combine(AppContext.BaseDirectory, "logs");
                Directory.CreateDirectory(logsDir);

                var logPath = Path.Combine(logsDir, $"error_{DateTime.Now:yyyy-MM-dd}.log");
                var logMessage = $"[{DateTimeOffset.UtcNow}] {ex.GetType()}: {ex.Message}\n{ex.StackTrace}\n\n";

                File.AppendAllText(logPath, logMessage);
            }
            catch { }
        }
        public static void Log(string message)
        {
            try
            {
                var logsDir = Path.Combine(AppContext.BaseDirectory, "logs");
                Directory.CreateDirectory(logsDir);

                var logPath = Path.Combine(logsDir, $"log_{DateTime.Now:yyyy-MM-dd}.log");
                var logMessage = $"[{DateTimeOffset.UtcNow}]: {message}\n\n";

                File.AppendAllText(logPath, logMessage);
            }
            catch { }
        }
    }
}