namespace GenshinOrchestra.Client.App.Models
{
    /// <summary> Ошибка при обращении к API </summary>
    public class MainApiException(string message, Exception? inner = null) : Exception(message, inner) { }

    /// <summary> Ошибка на стороне API </summary>
    public class MainApiHttpException(string message, Exception? inner = null) : MainApiException(message, inner);

    /// <summary> Таймаут. API Долго не отвечает </summary>
    public class MainApiTimeoutException(string message, Exception? inner = null) : MainApiException(message, inner);

    /// <summary> Некорректный или неожиданный формат ответа API </summary>
    public class MainApiInvalidResponseException(string message, Exception? inner = null) : MainApiException(message, inner);

    /// <summary> Пустой запрос </summary>
    public class MainApiEmptyResponseException(string message, Exception? inner = null) : MainApiException(message, inner);
}
