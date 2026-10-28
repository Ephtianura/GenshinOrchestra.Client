namespace GenshinOrchestra.Client.App.Exceptions
{
    /// <summary> Помилка при зверенні до сторонніх API </summary>
    public class MainApiException(string message, Exception? inner = null) : Exception(message, inner) { }

    /// <summary> Помилка на стороні API </summary>
    public class MainApiHttpException(string message, Exception? inner = null) : MainApiException(message, inner);

    /// <summary> Таймаут. API Довго не відповідає </summary>
    public class MainApiTimeoutException(string message, Exception? inner = null) : MainApiException(message, inner);

    /// <summary> Некоректний або неочікуваний формат відповіді API </summary>
    public class MainApiInvalidResponseException(string message, Exception? inner = null) : MainApiException(message, inner);

    /// <summary> Пуста відповідь </summary>
    public class MainApiEmptyResponseException(string message, Exception? inner = null) : MainApiException(message, inner);
}
