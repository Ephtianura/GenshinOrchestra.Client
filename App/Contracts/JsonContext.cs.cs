using GenshinOrchestra.Client.App.Extensions;
using System.Text.Json.Serialization;

[JsonSerializable(typeof(BridgeRequest))]
//[JsonSerializable(typeof(BridgeResponse))]
internal partial class JsonContext : JsonSerializerContext { }