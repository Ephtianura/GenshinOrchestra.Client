using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace GenshinOrchestra.Client.App
{
    internal static partial class Program
    {
        private static (WebApplication App, string Address) StartWebServer()
        {
            var builder = WebApplication.CreateBuilder();
            builder.WebHost.UseUrls("http://127.0.0.1:0");

            var app = builder.Build();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.Start();

            var address = app.Services
                .GetRequiredService<IServer>()
                .Features
                .Get<IServerAddressesFeature>()!
                .Addresses
                .Single();

            return (app, address);
        }
    }


    //using System;
    //using System.IO;
    //using System.Net;
    //using System.Net.Sockets;
    //using System.Threading;
    //using System.Threading.Tasks;
    //// Вариант с собственным сервером, экономия установщика 4 мб, готового приложения - 13мб
    //// var(app, address, ct) = StartWebServer();
    //// app.Stop();
    //// ct.Cancel();
    //internal static partial class Program
    //{
    //    private static (HttpListener Listener, string Address, CancellationTokenSource Cts) StartWebServer()
    //    {
    //        int freePort;
    //        var tempListener = new TcpListener(IPAddress.Loopback, 0);
    //        tempListener.Start();
    //        freePort = ((IPEndPoint)tempListener.LocalEndpoint).Port;
    //        tempListener.Stop();

    //        string address = $"http://127.0.0.1:{freePort}/";

    //        var cts = new CancellationTokenSource();
    //        var listener = new HttpListener();
    //        listener.Prefixes.Add(address);
    //        listener.Start();

    //        Task.Run(() => ListenLoopAsync(listener, cts.Token));

    //        return (listener, address, cts);
    //    }

    //    private static async Task ListenLoopAsync(HttpListener listener, CancellationToken cancellationToken)
    //    {
    //        string wwwrootDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot");

    //        try
    //        {
    //            while (!cancellationToken.IsCancellationRequested)
    //            {
    //                // Ждем входящий запрос
    //                var context = await listener.GetContextAsync();

    //                _ = Task.Run(() => ProcessRequestAsync(context, wwwrootDir));
    //            }
    //        }
    //        catch (HttpListenerException) when (cancellationToken.IsCancellationRequested)
    //        {
    //            // Штатное завершение работы при отмене
    //        }
    //    }

    //    private static async Task ProcessRequestAsync(HttpListenerContext context, string wwwrootDir)
    //    {
    //        var response = context.Response;

    //        string path = context.Request.Url?.AbsolutePath ?? "/";
    //        if (path == "/")
    //        {
    //            path = "/index.html";
    //        }

    //        string fullPath = Path.GetFullPath(Path.Combine(wwwrootDir, path.TrimStart('/')));

    //        if (!fullPath.StartsWith(wwwrootDir, StringComparison.OrdinalIgnoreCase) || !File.Exists(fullPath))
    //        {
    //            string indexPath = Path.Combine(wwwrootDir, "index.html");
    //            if (File.Exists(indexPath))
    //            {
    //                await SendFileAsync(response, indexPath, "text/html");
    //            }
    //            else
    //            {
    //                response.StatusCode = (int)HttpStatusCode.NotFound;
    //                response.Close();
    //            }
    //            return;
    //        }

    //        string contentType = GetMimeType(fullPath);
    //        await SendFileAsync(response, fullPath, contentType);
    //    }

    //    private static async Task SendFileAsync(HttpListenerResponse response, string filePath, string contentType)
    //    {
    //        response.ContentType = contentType;

    //        byte[] buffer = await File.ReadAllBytesAsync(filePath);
    //        response.ContentLength64 = buffer.Length;

    //        await response.OutputStream.WriteAsync(buffer, 0, buffer.Length);
    //        response.OutputStream.Close();
    //    }

    //    private static string GetMimeType(string fileName)
    //    {
    //        string ext = Path.GetExtension(fileName).ToLowerInvariant();
    //        return ext switch
    //        {
    //            ".html" => "text/html; charset=utf-8",
    //            ".js" => "application/javascript",
    //            ".css" => "text/css",
    //            ".json" => "application/json",
    //            ".png" => "image/png",
    //            ".jpg" => "image/jpeg",
    //            ".svg" => "image/svg+xml",
    //            ".ico" => "image/x-icon",
    //            _ => "application/octet-stream"
    //        };
    //    }
    //}
}
