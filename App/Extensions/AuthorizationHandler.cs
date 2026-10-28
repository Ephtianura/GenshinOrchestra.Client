using GenshinOrchestra.Client.App.Models;
using System.Net.Http.Headers;

namespace GenshinOrchestra.Client.App.Extensions
{
    public class AuthorizationHandler(TokenStorage tokenStorage)
    : DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var token = tokenStorage.AccessToken;

            if (!string.IsNullOrWhiteSpace(token))
                request.Headers.Authorization =
                    new AuthenticationHeaderValue("Bearer", token);

            return base.SendAsync(request, cancellationToken);
        }
    }
}
