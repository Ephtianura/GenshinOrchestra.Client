//using GenshinOrchestra.Client.App.Contracts;
//using GenshinOrchestra.Client.App.Dto;
//using GenshinOrchestra.Client.App.Models;
//using System.Management;
//using System.Security.Cryptography;
//using System.Text;

//namespace GenshinOrchestra.Client.App.Services
//{
//    public class AuthService : IAuthService
//    {
//        private readonly IMainApi _mainApi;
//        private readonly TokenStorage _tokenStorage;
//        public AuthService(IMainApi mainApi, TokenStorage tokenStorage)
//        {
//            _mainApi = mainApi;
//            _tokenStorage = tokenStorage;
//            Directory.CreateDirectory(SecretsDirectory);
//        }
//        private static readonly string SecretsDirectory = Path.Combine(
//              Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
//              "GenshinOrchestra",
//              "UserData"
//          );
//        private const string HwidPath = "genshin_orchestra_hwid.dat";
//        private const string TokenPath = "genshin_orchestra_token.dat";

//        /// <summary>
//        /// Генерирует HWID
//        /// </summary>
//        public static string GenerateHwid()
//        {
//            string motherboardSerial = $"{Guid.NewGuid()}_mb";
//            string cpuId = $"{Guid.NewGuid()}_cpu";

//            try
//            {
//                using var searcher = new ManagementObjectSearcher("SELECT SerialNumber FROM Win32_BaseBoard");
//                foreach (var obj in searcher.Get())
//                {
//                    if (obj["SerialNumber"]?.ToString()?.Trim() is { Length: > 0 } serial)
//                        motherboardSerial = serial;
//                    break;
//                }
//            }
//            catch
//            {
//                // Log
//            }

//            try
//            {
//                using var searcher = new ManagementObjectSearcher("SELECT ProcessorId FROM Win32_Processor");
//                foreach (var obj in searcher.Get())
//                {
//                    if (obj["SerialNumber"]?.ToString()?.Trim() is { Length: > 0 } serial)
//                        cpuId = serial;
//                    break;
//                }
//            }
//            catch
//            {
//                // Log
//            }

//            return $"{motherboardSerial} | {cpuId}";
//        }

//        /// <summary>
//        /// Сохранение HWID в защищенное хранилище Windows (DPAPI)
//        /// </summary>
//        public static void SaveHwidToWindows(string hwid) => SaveSecureValue(HwidPath, hwid);

//        /// <summary>
//        /// Чтение HWID из защищенного хранилища Windows
//        /// </summary>
//        public static string? ReadHwidFromWindows() => ReadSecureValue(HwidPath);

//        /// <summary>
//        /// Сохранение Токена в защищенное хранилище Windows (DPAPI)
//        /// </summary>
//        public static void SaveTokenToWindows(string token) => SaveSecureValue(TokenPath, token);

//        /// <summary>
//        /// Чтение Токена из защищенного хранилища Windows
//        /// </summary>
//        public static string? ReadTokenFromWindows() => ReadSecureValue(TokenPath);

//        /// <summary>
//        /// Вызывает MainApi для регистрации и сохраняет новый токен
//        /// </summary>
//        public async Task<string> RegisterAsync(string name, string hwid, CancellationToken ct)
//        {
//            var token = ReadTokenFromWindows();
//            var newToken = await _mainApi.Register(new RegisterRequest(name, hwid, token), ct)
//                ?? throw new Exception("Увы, апи не отдал токен");
//            if (newToken == token) return newToken;
//            SaveTokenToWindows(newToken);
//            _tokenStorage.AccessToken = newToken;
//            return newToken;
//        }

//        #region private
//        private static void SaveSecureValue(string fileName, string value)
//        {
//            if (string.IsNullOrEmpty(value)) return;

//            var filePath = Path.Combine(SecretsDirectory, fileName);
//            var plainBytes = Encoding.UTF8.GetBytes(value);

//            // Шифрование данных ключом текущего пользователя Windows
//            var encryptedBytes = ProtectedData.Protect(
//                plainBytes,
//                optionalEntropy: null,
//                DataProtectionScope.CurrentUser
//            );

//            File.WriteAllBytes(filePath, encryptedBytes);
//        }
//        private static string? ReadSecureValue(string fileName)
//        {
//            var filePath = Path.Combine(SecretsDirectory, fileName);
//            if (!File.Exists(filePath)) return null;

//            try
//            {
//                var encryptedBytes = File.ReadAllBytes(filePath);

//                // Расшифровка данных
//                var plainBytes = ProtectedData.Unprotect(
//                    encryptedBytes,
//                    optionalEntropy: null,
//                    DataProtectionScope.CurrentUser
//                );

//                return Encoding.UTF8.GetString(plainBytes);
//            }
//            catch
//            {
//                // Log
//                return null;
//            }
//        }
//        #endregion
//    }
//}
