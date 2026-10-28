using System.Management;

namespace GenshinOrchestra.Client.App.Services
{
    public static class AuthService
    {
        public static string GenerateHwid()
        {
            string motherboardSerial = $"{Guid.NewGuid()}_mb";
            string cpuId = $"{Guid.NewGuid()}_cpu";

            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT SerialNumber FROM Win32_BaseBoard");
                foreach (var obj in searcher.Get())
                {
                    if (obj["SerialNumber"]?.ToString()?.Trim() is { Length: > 0 } serial)
                        motherboardSerial = serial;
                    break;
                }
            }
            catch
            {
                // Log
            }

            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT ProcessorId FROM Win32_Processor");
                foreach (var obj in searcher.Get())
                {
                    if (obj["SerialNumber"]?.ToString()?.Trim() is { Length: > 0 } serial)
                        cpuId = serial;
                    break;
                }
            }
            catch
            {
                // Log
            }

            return $"{motherboardSerial} | {cpuId}";
        }
    }
}
