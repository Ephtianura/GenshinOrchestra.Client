using GenshinOrchestra.Client.App.Models;
using System.Runtime.InteropServices;

namespace GenshinOrchestra.Client.App
{
    public static partial class WindowsInput
    {
        #region consts
        private const uint INPUT_KEYBOARD = 1;
        private const uint KEYEVENTF_KEYUP = 0x0002;
        private const uint KEYEVENTF_SCANCODE = 0x0008;
        #endregion

        #region structs
        [StructLayout(LayoutKind.Sequential)]
        private struct INPUT
        {
            public uint type;
            public KEYBDINPUT ki;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct KEYBDINPUT
        {
            public ushort wVk;
            public ushort wScan;
            public uint dwFlags;
            public uint time;
            public nint dwExtraInfo;
            public uint padding1;
            public uint padding2;
        }
        #endregion

        #region dll_import
        [LibraryImport("user32.dll", SetLastError = true)]
        private static partial uint SendInput(uint nInputs, [In] INPUT[] pInputs, int cbSize);

        [LibraryImport("user32.dll", SetLastError = true)]
        private static partial uint MapVirtualKeyW(uint uCode, uint uMapType);
        #endregion

        /// <summary>
        /// Отправляет событие нажатия или отпускания физической клавиши по Hardware Scan Code
        /// </summary>
        public static void SendKey(char key, KeyAction action)
        {
            ushort vk = char.ToUpper(key);
            ushort scanCode = (ushort)MapVirtualKeyW(vk, 0); // MAPVK_VK_TO_VSC = 0

            if (scanCode == 0) return;

            uint flags = KEYEVENTF_SCANCODE;
            if (action == KeyAction.Release)
            {
                flags |= KEYEVENTF_KEYUP;
            }

            INPUT[] inputs = [
                new INPUT
            {
                type = INPUT_KEYBOARD,
                ki = new KEYBDINPUT
                {
                    wVk = 0,
                    wScan = scanCode,
                    dwFlags = flags,
                    time = 0,
                    dwExtraInfo = nint.Zero
                }
            }
            ];

            int structSize = Marshal.SizeOf<INPUT>();
            uint result = SendInput((uint)inputs.Length, inputs, structSize);

            if (result == 0)
            {
                int errorCode = Marshal.GetLastWin32Error();
                Console.WriteLine($"[Error] SendInput failed. Win32 Error Code: {errorCode}");
            }
        }
    }
}