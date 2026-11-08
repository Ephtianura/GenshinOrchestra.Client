using GenshinOrchestra.Client.App.Extensions;
using Microsoft.Win32;
using System.Management;
using System.Security.Cryptography;
using System.Text;

namespace GenshinOrchestra.Client.App.Services
{
    public static class AuthService
    {
        public static string GenerateHwid()
        {
            string motherboardSerial = "";
            string cpuId = "";

            try
            {
                using var searcher = new ManagementObjectSearcher(
                    "SELECT SerialNumber FROM Win32_BaseBoard");

                foreach (ManagementObject obj in searcher.Get())
                {
                    motherboardSerial = obj["SerialNumber"]?.ToString()?.Trim() ?? "";
                    break;
                }
            }
            catch (Exception ex)
            {
                AppLogger.LogError(ex);
                AppLogger.Log($"[HWID] Motherboard: {ex.Message}");
            }

            try
            {
                using var searcher = new ManagementObjectSearcher(
                    "SELECT ProcessorId FROM Win32_Processor");

                foreach (ManagementObject obj in searcher.Get())
                {
                    cpuId = obj["ProcessorId"]?.ToString()?.Trim() ?? "";
                    break;
                }
            }
            catch (Exception ex)
            {
                AppLogger.LogError(ex);
                AppLogger.Log($"[HWID] CPU: {ex.Message}");
            }

            // Если WMI не сработал, используем стабильный MachineGuid.
            if (string.IsNullOrWhiteSpace(motherboardSerial) &&
                string.IsNullOrWhiteSpace(cpuId))
            {
                using var key = Registry.LocalMachine.OpenSubKey(
                    @"SOFTWARE\Microsoft\Cryptography");

                var machineGuid = key?.GetValue("MachineGuid")?.ToString();

                if (!string.IsNullOrWhiteSpace(machineGuid))
                    return machineGuid;
            }

            string raw = $"{motherboardSerial}|{cpuId}";

            return Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(raw))
            );
        }
    }
}
