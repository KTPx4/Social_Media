using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.DTOs.Communication;
using Server.Services.SCommunication;
using System.Linq;
using System.Security.Claims;

namespace Server.Hubs
{
    [Authorize] // Đảm bảo chỉ user đã xác thực mới có thể kết nối
    public class ChatHub : Hub
    {
         
        private readonly ICommunicationService _communicationService;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly ConnectionManager _connectionManager;

        public ChatHub(ConnectionManager connectionManager, ICommunicationService communicationService, IHubContext<ChatHub> hubContext)
        {
            _communicationService = communicationService;
            _hubContext = hubContext;
            _connectionManager = connectionManager;
        }


        // Khi user kết nối, lấy UserId từ token và lưu vào danh sách
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirstValue("UserId");
            if (userId != null)
            {
                _connectionManager.AddConnection(Context.ConnectionId, userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _connectionManager.RemoveConnection(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        // Nhận tin nhắn từ client
        public async Task<ResponseModel<MessageResponse>> SendMessage(MessageModel messageModel)
        {
            var senderUserId = messageModel.SenderId;
            var processedMessage = messageModel.Content;
            var conversationId = messageModel.ConversationId.ToString();
            

            if (string.IsNullOrEmpty(senderUserId) || string.IsNullOrEmpty(conversationId))
            {
                return ResponseModel<MessageResponse>.BadRequest("Sender id not exists");
            }

            RsProcessMessage RsProcessMessage = null;

            try
            {
                RsProcessMessage = await _communicationService.ProcessMessageAsync(senderUserId, messageModel);

            }
            catch (Exception ex) 
            {
                var mess = ex.Message;
                var rsMess = "Error. Try again!";
                
                if(mess.StartsWith("ErrMess-"))
                {
                    rsMess = mess.Substring("ErrMess-".Length);
                }

                return ResponseModel<MessageResponse>.BadRequest(rsMess);

            }


            // find id of user in list online
            var receiverConnections = _connectionManager.GetConnections(RsProcessMessage.ToIds);
            foreach (var connectionId in receiverConnections)
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", RsProcessMessage.FromId, RsProcessMessage.messageResponse);
            }

            return ResponseModel<MessageResponse>.Ok(RsProcessMessage.messageResponse);

        }
    }
}
