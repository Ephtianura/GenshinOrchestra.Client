using GenshinOrchestra.Client.App.Extensions;
using System.Runtime.InteropServices;

namespace GenshinOrchestra.Client.App
{
    internal static partial class Program
    {
        private static void LogAndShowException(Exception ex)
        {
            AppLogger.Log(ex);
            MessageBox(IntPtr.Zero, $"Произошла критическая ошибка :<\nЛог записан в /logs/error.log\n\n{ex.Message}", "Genshin Orchestra", 0x00000000 | 0x00000010);
        }

        #region DllImport
        [DllImport("user32.dll", CharSet = CharSet.Unicode)]
        private static extern int MessageBox(IntPtr hWnd, string text, string caption, uint type);
        #endregion
    }
}