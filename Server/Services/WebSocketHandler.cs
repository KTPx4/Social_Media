using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.WebSockets;
using System.Text;

namespace Server.Services
{
    public static class WebSocketHandler
    {
        private static readonly Dictionary<string, WebSocket> ActiveConnections = new();

        public static async Task HandleWebSocketAsync(HttpContext context)
        {
            // Kiểm tra xem request có phải là WebSocket không
            if (!context.WebSockets.IsWebSocketRequest)
            {
                context.Response.StatusCode = 400; // Bad Request
                await context.Response.WriteAsync("This endpoint only supports WebSocket requests.");
                return;
            }

            var token = context.Request.Query["token"].ToString();

            // Lấy IServiceProvider từ HttpContext
            var serviceProvider = context.RequestServices;
            var tokenService = serviceProvider.GetRequiredService<TokenService>();

            // Kiểm tra token thông qua TokenService
            var principal = tokenService.ValidateToken(token);
            if (principal == null)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Invalid token");
                return;
            }

            // Lấy UserId từ token
            var userId = principal.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsync("Invalid token");
                return;
            }

            // Chấp nhận WebSocket
            WebSocket webSocket;
            try
            {
                webSocket = await context.WebSockets.AcceptWebSocketAsync();
            }
            catch (InvalidOperationException ex)
            {
                context.Response.StatusCode = 500; // Internal Server Error
                await context.Response.WriteAsync($"WebSocket initialization error: {ex.Message}");
                return;
            }

            // Thêm người dùng vào danh sách kết nối
            lock (ActiveConnections)
            {
                ActiveConnections[userId] = webSocket;
            }

            // Xử lý nhận tin nhắn
            await ReceiveMessagesAsync(userId, webSocket);

            // Đóng WebSocket khi hoàn tất
            lock (ActiveConnections)
            {
                ActiveConnections.Remove(userId);
            }
        }

        private static async Task ReceiveMessagesAsync(string userId, WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            var received = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!received.CloseStatus.HasValue)
            {
                // Xử lý tin nhắn
                var message = Encoding.UTF8.GetString(buffer, 0, received.Count);
                Console.WriteLine($"Received from {userId}: {message}");

                // Gửi lại cho client
                var response = Encoding.UTF8.GetBytes($"Echo: {message}");
                await webSocket.SendAsync(new ArraySegment<byte>(response), WebSocketMessageType.Text, true, CancellationToken.None);

                received = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }

            // Xóa kết nối khi đóng
            lock (ActiveConnections)
            {
                ActiveConnections.Remove(userId);
            }
            await webSocket.CloseAsync(received.CloseStatus.Value, received.CloseStatusDescription, CancellationToken.None);
        }
    }
}
