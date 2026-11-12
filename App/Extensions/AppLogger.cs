namespace GenshinOrchestra.Client.App.Extensions
{
    public static class AppLogger
    {
        public static string? LogError(Exception ex)
        {
            try
            {
                var logsDir = Path.Combine(AppContext.BaseDirectory, "logs");
                Directory.CreateDirectory(logsDir);

                var fileName = $"error_{DateTime.Now:yyyy-MM-dd}.log";
                var logPath = Path.Combine(logsDir, fileName);
                var logMessage = $"[{DateTimeOffset.UtcNow}] {ex.GetType()}: {ex.Message}\n{ex.StackTrace}\n\n";

                File.AppendAllText(logPath, logMessage);
                return fileName;
            }
            catch { return null; }
        }
        public static string? Log(string message)
        {
            try
            {
                var logsDir = Path.Combine(AppContext.BaseDirectory, "logs");
                Directory.CreateDirectory(logsDir);

                var fileName = $"log_{DateTime.Now:yyyy-MM-dd}.log";
                var logPath = Path.Combine(logsDir, fileName);
                var logMessage = $"[{DateTimeOffset.UtcNow}]: {message}\n\n";

                File.AppendAllText(logPath, logMessage);
                return fileName;
            }
            catch { return null; }
        }
    }
}