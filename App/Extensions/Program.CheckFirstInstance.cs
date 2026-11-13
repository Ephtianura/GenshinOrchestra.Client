using GenshinOrchestra.Client.App.Extensions;

namespace GenshinOrchestra.Client.App
{
    internal static partial class Program
    {
        /// <summary>
        /// Проверяет, является ли текущий экземпляр приложения единственным.
        /// Если другой экземпляр уже запущен, отправляет ему сигнал разворачивания.
        /// </summary>
        /// <returns>
        /// <see langword="true"/> – если текущий экземпляр является первым;
        /// иначе <see langword="false"/>.
        /// </returns>
        private static bool EnsureSingleInstance()
        {
            if (SingleInstance.IsFirstInstance)
                return true;

            SingleInstance.ActivateExisting();
            return false;
        }
    }
}
