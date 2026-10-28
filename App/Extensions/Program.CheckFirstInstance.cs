using GenshinOrchestra.Client.App.Extensions;

namespace GenshinOrchestra.Client.App
{
    internal static partial class Program
    {
        private static void CheckFirstInstance()
        {
            if (!SingleInstance.IsFirstInstance)
            {
                SingleInstance.ActivateExisting();
                return;
            }
        }
    }
}
