using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;

// Оказалось ненужным, к сожалению.
namespace GenshinOrchestra.Client.App.ToDelete
{
    public sealed class SignalRClient : IAsyncDisposable
    {
        private readonly HubConnection _connection;

        public SignalRClient(IConfiguration configuration)
        {
            var hubUrl = configuration["MainServer:HubUrl"]
                ?? throw new InvalidOperationException("Пропала ссылка на хаб...");

            _connection = new HubConnectionBuilder()
                .WithUrl(hubUrl)
                .WithAutomaticReconnect()
                .Build();

            _connection.On("ReceiveNotes", () => NotesReceived?.Invoke());
        }

        public event Action? NotesReceived;

        public Task ConnectAsync()
            => _connection.StartAsync();

        public Task PingAsync()
            => _connection.InvokeAsync("Ping");

        public Task SendNotesAsync()
            => _connection.InvokeAsync("SendNotes");

        public ValueTask DisposeAsync()
            => _connection.DisposeAsync();
    }
}
