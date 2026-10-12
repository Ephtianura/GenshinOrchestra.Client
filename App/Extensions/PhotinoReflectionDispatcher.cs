using Photino.NET;
using System.Collections.Concurrent;
using System.Reflection;
using System.Text.Json;

namespace GenshinOrchestra.Client.App.Extensions
{
    public sealed class PhotinoReflectionDispatcher
    {
        private readonly ConcurrentDictionary<string, (object Target, MethodInfo Method, ParameterInfo[] Parameters)> _routes = new(StringComparer.OrdinalIgnoreCase);

        // Регистрирует любой сервис целиком — все его публичные методы автоматически становятся доступными
        public void RegisterService(object serviceInstance)
        {
            var type = serviceInstance.GetType();
            var methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);

            foreach (var method in methods)
            {
                _routes[method.Name] = (serviceInstance, method, method.GetParameters());
            }
        }

        public void HandleMessage(object? sender, string message)
        {
            // Преобразуем object в PhotinoWindow
            if (sender is not PhotinoWindow window) return;

            _ = Task.Run(async () =>
            {
                string? requestId = null;
                try
                {
                    var req = JsonSerializer.Deserialize<BridgeRequest>(message, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (req == null || string.IsNullOrEmpty(req.Method)) return;

                    requestId = req.Id;

                    if (!_routes.TryGetValue(req.Method, out var route))
                    {
                        SendError(window, requestId, $"Method '{req.Method}' not found.");
                        return;
                    }

                    var args = BindParameters(route.Parameters, req.Params);

                    object? result = route.Method.Invoke(route.Target, args);

                    if (result is Task task)
                    {
                        await task.ConfigureAwait(false);
                        var taskType = task.GetType();
                        if (taskType.IsGenericType)
                        {
                            result = taskType.GetProperty("Result")?.GetValue(task);
                        }
                        else
                        {
                            result = null;
                        }
                    }

                    SendSuccess(window, requestId, result);
                }
                catch (Exception ex)
                {
                    SendError(window, requestId, ex.InnerException?.Message ?? ex.Message);
                }
            });
        }

        private object?[] BindParameters(ParameterInfo[] parameters, JsonElement paramsElement)
        {
            var args = new object?[parameters.Length];

            for (int i = 0; i < parameters.Length; i++)
            {
                var p = parameters[i];
                if (paramsElement.ValueKind == JsonValueKind.Object && p.Name != null && paramsElement.TryGetProperty(p.Name, out var propVal))
                {
                    args[i] = JsonSerializer.Deserialize(propVal.GetRawText(), p.ParameterType);
                }
                else if (paramsElement.ValueKind == JsonValueKind.Array && i < paramsElement.GetArrayLength())
                {
                    args[i] = JsonSerializer.Deserialize(paramsElement[i].GetRawText(), p.ParameterType);
                }
                else
                {
                    args[i] = p.HasDefaultValue ? p.DefaultValue : (p.ParameterType.IsValueType ? Activator.CreateInstance(p.ParameterType) : null);
                }
            }

            return args;
        }

        private void SendSuccess(PhotinoWindow window, string? id, object? data)
        {
            var resp = new { id, data, error = (string?)null };
            window.SendWebMessage(JsonSerializer.Serialize(resp));
        }

        private void SendError(PhotinoWindow window, string? id, string error)
        {
            var resp = new { id, data = (object?)null, error };
            window.SendWebMessage(JsonSerializer.Serialize(resp));
        }
    }

    public class BridgeRequest
    {
        public string Id { get; set; } = string.Empty;
        public string Method { get; set; } = string.Empty;
        public JsonElement Params { get; set; }
    }
}
