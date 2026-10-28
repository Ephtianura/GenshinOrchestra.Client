using System.Runtime.InteropServices;

namespace GenshinOrchestra.Client.App.Extensions
{
    public static class SingleInstance
    {
        private const string MutexName = @"Local\GenshinOrchestra";
        private const string EventName = @"Local\GenshinOrchestra.Activate";
        private const string WindowTitle = "Genshin Orchestra Client ";


        private static readonly Mutex Mutex;
        private static readonly EventWaitHandle ActivateEvent;

        public static readonly bool IsFirstInstance;

        #region user32.dll
        [DllImport("user32.dll")]
        private static extern nint FindWindow(string? lpClassName, string? lpWindowName);

        [DllImport("user32.dll")]
        private static extern bool ShowWindow(nint hWnd, int nCmdShow);

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(nint hWnd);
        #endregion

        static SingleInstance()
        {
            Mutex = new Mutex(true, MutexName, out bool createdNew);
            IsFirstInstance = createdNew;

            ActivateEvent = new EventWaitHandle(
                false, EventResetMode.AutoReset, EventName);

            if (IsFirstInstance)
            {
                var thread = new Thread(() =>
                {
                    while (true)
                    {
                        ActivateEvent.WaitOne();

                        var hwnd = FindWindow(null, WindowTitle);

                        if (hwnd != 0)
                        {
                            ShowWindow(hwnd, 9); // SW_RESTORE
                            SetForegroundWindow(hwnd);
                        }
                    }
                });

                thread.IsBackground = true;
                thread.Start();
            }
        }

        public static void ActivateExisting()
        {
            ActivateEvent.Set();
        }
    }
}
