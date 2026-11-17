//namespace GenshinOrchestra.Client.App.ToDelete
//{
//    using GenshinOrchestra.Client.App.Extensions;
//    using System.Runtime.InteropServices;

//    public class GlobalHotkeys(Action sendReady, Action sendUnready)
//    {
//        private readonly Action _sendReady = sendReady;
//        private readonly Action _sendUnready = sendUnready;

//        #region user32.dll
//        private const int HOTKEY_READY = 1;
//        private const int HOTKEY_UNREADY = 2;

//        private const uint MOD_CONTROL = 0x0002;
//        private const uint MOD_ALT = 0x0001;

//        private const uint VK_F11 = 0x7A;
//        private const uint VK_F12 = 0x7B;

//        private const int WM_HOTKEY = 0x0312;

//        [DllImport("user32.dll")]
//        private static extern bool RegisterHotKey(
//            nint hWnd, int id, uint fsModifiers, uint vk);

//        [DllImport("user32.dll")]
//        private static extern bool UnregisterHotKey(nint hWnd, int id);
//        #endregion



//        public void Register(nint hWnd)
//        {
//            bool f11 = RegisterHotKey(
//             hWnd, HOTKEY_READY,
//             MOD_CONTROL | MOD_ALT, VK_F11);


//            bool f12 = RegisterHotKey(
//                hWnd, HOTKEY_UNREADY,
//                MOD_CONTROL | MOD_ALT, VK_F12);


//            if (!f12)
//                AppLogger.Log("Не удалось зарегистрировать Ctrl + Alt + F12");

//            if (!f11)
//                AppLogger.Log("Не удалось зарегистрировать Ctrl + Alt + F11");
//        }

//        public bool HandleMessage(int message, nint wParam)
//        {
//            if (message != WM_HOTKEY)
//                return false;

//            switch (wParam.ToInt32())
//            {
//                case HOTKEY_READY:
//                    SendReady();
//                    return true;

//                case HOTKEY_UNREADY:
//                    SendUnready();
//                    return true;

//                default:
//                    return false;
//            }
//        }

//        public static void Unregister(nint hWnd)
//        {
//            UnregisterHotKey(hWnd, HOTKEY_UNREADY);
//            UnregisterHotKey(hWnd, HOTKEY_READY);
//        }

//        private void SendReady() => _sendReady();
//        private void SendUnready() => _sendUnready();
//    }
//}
