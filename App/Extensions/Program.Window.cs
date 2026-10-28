using System.Runtime.InteropServices;

namespace GenshinOrchestra.Client.App
{
    internal static partial class Program
    {
        #region Win32 API для включения кнопки сворачивания 

        [DllImport("user32.dll", SetLastError = true)]
        private static extern int GetWindowLong(IntPtr hWnd, int nIndex);
        [DllImport("user32.dll")]
        private static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        private const int GWL_STYLE = -16;
        private const int WS_MINIMIZEBOX = 0x00020000;

        private static void EnableMinimizeButton(IntPtr hWnd)
        {
            int currentStyle = GetWindowLong(hWnd, GWL_STYLE);
            SetWindowLong(hWnd, GWL_STYLE, currentStyle | WS_MINIMIZEBOX);
        }
        #endregion
    }
}
