using System.Text.Json.Serialization;

namespace GenshinOrchestra.Client.App.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum KeyAction
    {
        Press,  // Нажать клавишу (Утопить её в клавиатуру)
        Release // Отпустить клавишу (Дать ей подняться вверх)
    }
}