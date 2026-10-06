//using System.Runtime.InteropServices;

//namespace GenshinOrchestra.Client.App;

//public static class InputSimulator
//{
//    [DllImport("user32.dll", SetLastError = true)]
//    private static extern uint SendInput(uint nInputs, INPUT[] pInputs, int cbSize);

//    [DllImport("user32.dll")]
//    private static extern uint MapVirtualKey(uint uCode, uint uMapType);

//    [StructLayout(LayoutKind.Sequential)]
//    private struct INPUT
//    {
//        public uint type;
//        public KEYBDINPUT ki;
//    }

//    [StructLayout(LayoutKind.Sequential)]
//    private struct KEYBDINPUT
//    {
//        public ushort wVk;
//        public ushort wScan;
//        public uint dwFlags;
//        public uint time;
//        public IntPtr dwExtraInfo;
//        public uint padding1;
//        public uint padding2;
//    }

//    private const uint INPUT_KEYBOARD = 1;
//    private const uint KEYEVENTF_SCANCODE = 0x0008;
//    private const uint KEYEVENTF_KEYUP = 0x0002;
//    private const uint MAPVK_VK_TO_VSC = 0;

//    public static void PressKey(char key, int holdDurationMs = 60)
//    {
//        uint vk = (uint)char.ToUpper(key);
//        ushort scanCode = (ushort)MapVirtualKey(vk, MAPVK_VK_TO_VSC);

//        if (scanCode == 0) return;

//        // 1. KeyDown
//        INPUT[] inputDown = new INPUT[1];
//        inputDown[0].type = INPUT_KEYBOARD;
//        inputDown[0].ki = new KEYBDINPUT
//        {
//            wVk = 0, 
//            wScan = scanCode,
//            dwFlags = KEYEVENTF_SCANCODE,
//            time = 0,
//            dwExtraInfo = IntPtr.Zero
//        };

//        // 2. KeyUp
//        INPUT[] inputUp = new INPUT[1];
//        inputUp[0].type = INPUT_KEYBOARD;
//        inputUp[0].ki = new KEYBDINPUT
//        {
//            wVk = 0,
//            wScan = scanCode,
//            dwFlags = KEYEVENTF_SCANCODE | KEYEVENTF_KEYUP,
//            time = 0,
//            dwExtraInfo = IntPtr.Zero
//        };

//        int structSize = Marshal.SizeOf<INPUT>();

//        SendInput(1, inputDown, structSize);
//        Thread.Sleep(holdDurationMs);
//        SendInput(1, inputUp, structSize);
//    }
//}