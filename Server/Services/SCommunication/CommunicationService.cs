using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Communication;
using Server.DTOs.Posts;
using Server.Models.Account;
using Server.Models.Communication;
using Server.Models.Community.Posts;
using System.Drawing.Printing;
using System.IO;

namespace Server.Services.SCommunication
{
    public class RsProcessMessage
    {
        public MessageResponse messageResponse;
        public Guid FromId;
        public List<Guid> ToIds;
    }

    public interface ICommunicationService
    {
        Task<RsProcessMessage> ProcessMessageAsync(string senderUserId, MessageModel messageModel);
        Task<ConversationResponse> CreateConversation(string userId, CreateGroupModel createGroupModel, FileInfoDto fileInfoDto);
        Task<List<ConversationResponse>> GetGroups(string userId);
        Task<List<ConversationResponse>> GetConversation(string userId, int page = 0);
    }

    public class CommunicationService : ICommunicationService
    {
        private readonly APIDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _RootImgGroup;
        private readonly string _ServerHost;
        private readonly string _AccessImgAccount;
        private readonly int _LIMIT_CONVERSATION = 20;

        public CommunicationService(APIDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;

            var serverSettings = configuration.GetSection("ServerSettings");
            _RootImgGroup = serverSettings["RootImgGroup"];
            _ServerHost = serverSettings["HostName"];
            _AccessImgAccount = serverSettings["AccessImgHost"];
        }

        public bool CanSendMessage(string userId, string conversationId)
        {
            return false;
        }

        public async Task<User> ExistsUser(string userId)
        {
            return await _context.Users.Where(u => u.Id.ToString() == userId).FirstOrDefaultAsync();
        }

        public async Task<bool> CanSendDirect(ICollection<ConvMember> convMembers)
        {
            var userId1 = convMembers.ElementAt(0).UserId;
            var userId2 = convMembers.ElementAt(1).UserId;

            var relationship = await _context.FriendShips.Where(f => f.UserId == userId1 && f.FriendId == userId2).FirstOrDefaultAsync();
            
            if (relationship == null) return true;

            return relationship.Status == Models.RelationShip.FriendShip.FriendStatus.Normal;
        }

        public async Task<RsProcessMessage> ProcessMessageAsync(string senderUserId, MessageModel messageModel)
        {
            
            var conversationId = messageModel.ConversationId;
            var replyId = messageModel.ReplyMessageId;
            var type = messageModel.Type;
            var content = messageModel.Content;

            var Conversation = await _context.Conversations
                .Where(c => c.Id == conversationId)
                .Include(c => c.Members)
                .Include(c => c.ConvSetting)
                .FirstOrDefaultAsync();
            
            var listMember = Conversation.Members;
            var convSetting = Conversation.ConvSetting;

            var SenderUser = listMember.Where(c => c.UserId.ToString() == senderUserId).FirstOrDefault();
          
            if (Conversation == null) throw new Exception("ErrMess-Conversation not exists");
            if (SenderUser == null) throw new Exception("ErrMess-You not have permission to send message");

            // Check can send
            //type group
            if (
                Conversation.Type == Conversation.ConversationType.Group && 
                convSetting.CanSend != ConvSetting.ConvPermission.All &&           
                SenderUser.Role != ConvMember.ConversationRole.Deputy &&
                SenderUser.Role != ConvMember.ConversationRole.Leader )
            {
                throw new Exception("ErrMess-You not allow to send message");
            }
            // type direct
            else if (Conversation.Type == Conversation.ConversationType.Direct && !(await CanSendDirect(listMember)))
            {
                throw new Exception("ErrMess-Can not send message to this user");
            }

            var mess = new Message()
            {
                ConversationId = conversationId,
                SenderId = SenderUser.UserId,
                ReplyMessageId = replyId,
                Type  = type,
                Content = content
            };
                    
            await _context.Messages.AddAsync(mess);
            await _context.SaveChangesAsync();

            var messResponse = new MessageResponse(mess);

            List<Guid> listTo = listMember.Where(m=> m.UserId != SenderUser.UserId).Select(m => m.UserId).ToList();
            RsProcessMessage rs = new RsProcessMessage()
            {
                FromId = SenderUser.UserId,
                ToIds = listTo,
                messageResponse= messResponse
            };

            return rs;

        }

        public async Task<ConversationResponse> CreateConversation(string userId, CreateGroupModel createGroupModel, FileInfoDto fileInfoDto)
        {

            var User = await _context.Users.Where(u => u.Id.ToString() == userId).FirstOrDefaultAsync();
            
            var listMember = await _context.Users
                .Where(u => createGroupModel.Members.Contains(u.Id.ToString()))
                .ToListAsync();
            
            if (listMember == null || listMember.Count != createGroupModel.Members.Count)
            {
                var listNotExists = createGroupModel.Members.Where(m => !listMember.Select(l => l.Id.ToString()).Contains(m)).ToList();
                throw new Exception("Chat-Member not exists: " + string.Join(", ", listNotExists));
            }


            Conversation conversation = new Conversation()
            {
                Name = createGroupModel.Name,
                Type = Conversation.ConversationType.Group,
                ImageUrl = fileInfoDto.Name
            };

            await _context.Conversations.AddAsync(conversation);
            await _context.SaveChangesAsync();

            // setting for conversation
            var setting = new ConvSetting()
            {
                CanEdit = ConvSetting.ConvPermission.All,
                CanSend = ConvSetting.ConvPermission.All,
                ConversationId = conversation.Id
            };

            // create member for conversation
            var listConvMember = listMember.Select(m => new ConvMember()
            {
                ConversationId = conversation.Id,
                Role = ConvMember.ConversationRole.Member,
                Notify = ConvMember.SettingNotify.Normal,
                UserId = m.Id,
            }).ToList();

            listConvMember.Add(new ConvMember()
            {
                UserId = User.Id,
                ConversationId = conversation.Id,
                Role = ConvMember.ConversationRole.Leader,
                Notify = ConvMember.SettingNotify.Normal,
            });
            // message created group
            var newMess = new Message()
            {
                ConversationId = conversation.Id,
                Content = "Create group success. Let start your chat!",
                IsSystem = true,
                Type= Message.MessageType.Text,
            };

            await _context.ConvSettings.AddAsync(setting);
            await _context.ConvMembers.AddRangeAsync(listConvMember);
            await _context.Messages.AddAsync(newMess);

            await _context.SaveChangesAsync();

            var groupdId = conversation.Id.ToString();

            var ConvResponse = new ConversationResponse(conversation,  _ServerHost , _AccessImgAccount);


            // copy avatar file to folder
            try
            {
                var uploadsFolder = Path.Combine(_RootImgGroup, groupdId);
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // destination folder
                var filePath = Path.Combine(uploadsFolder, fileInfoDto.Name);

                //// Lưu file tạm
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await fileInfoDto.File.CopyToAsync(stream);
                }

                //// Xóa file tạm (nếu cần)
                var tempFilePath = fileInfoDto.File.FileName; // File tạm của hệ thống.
                if (System.IO.File.Exists(tempFilePath))
                {
                    System.IO.File.Delete(tempFilePath);
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Copy media to folder post id '{groupdId}': {ex.ToString()}");
            }

            return ConvResponse;
        }

        public async Task<List<ConversationResponse>> GetGroups(string userId)
        {
            var User = await _context.Users.Where(u => u.Id.ToString() == userId).FirstOrDefaultAsync();

            var conversations = await _context.Conversations
               .Where(c => c.Members.Any(m => m.UserId.ToString() == userId))  // Lọc những conversation có userId
               .Include(c => c.Members)  // Load danh sách thành viên
                    .ThenInclude(m => m.User)  // 🛠️ Load thêm thông tin User
               .Include(c => c.ConvSetting)  // Load setting của conversation
               .Select(c => new ConversationResponse(c, _ServerHost,_AccessImgAccount)  // Chuyển dữ liệu sang DTO
               {

                   Members = c.Members.Select(m => new MemberResponse
                   {
                       ConversationId = c.Id,
                       UserId = m.UserId,
                       NickName = m.NickName,
                       Role = m.Role,
                       Notify = m.Notify,
                       ImageUrl = $"{_ServerHost}/{_AccessImgAccount}/{m.UserId}/{m.User.ImageUrl}",
                       Name = m.User.Name,
                       UserProfile = m.User.UserProfile,
                   }).ToList()
               })
               .ToListAsync();

            return conversations;
        }

        public async Task<List<ConversationResponse>> GetConversation(string userId, int page = 0)
        {
            if(page < 1) page = 1;

            var conversations = await _context.Conversations
            .Where(c => _context.ConvMembers.Any(cm => cm.ConversationId == c.Id && cm.UserId.ToString() == userId))
            .Include(c => c.Members)
            .Include(c => c.ConvSetting)
            .Select(c => new
            {
                Conversation = c,
                LastMessage = _context.Messages
                    .Where(m => m.ConversationId == c.Id)
                    .Include(m => m.Sender)
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefault(),
                UnreadCount = _context.Messages
                    .Where(
                        m => m.ConversationId == c.Id
                        && m.SenderId.ToString() != userId // Tin nhắn không phải của user
                        && !_context.MessagesSeens.Any(ms => ms.MessageId == m.Id && ms.UserId.ToString() == userId) // Chưa đọc
                    )
                    .Count()
            })
            .OrderByDescending(x => x.LastMessage != null ? x.LastMessage.CreatedAt : DateTime.MinValue)
            .Skip((page - 1) * _LIMIT_CONVERSATION)
            .Take(_LIMIT_CONVERSATION)
            .ToListAsync();

            var rs = conversations.Select(c => new ConversationResponse(c.Conversation, c.LastMessage, c.UnreadCount, _ServerHost , _AccessImgAccount)).ToList();
           
            return rs; 

        }




        /*
*  public async Task<RsProcessMessage> ProcessMessageAsync(string senderUserId, MessageModel messageModel)
{
   var isInit = messageModel.isInit;
   var conversationId = messageModel.ConversationId;
   var replyId = messageModel.ReplyMessageId;
   var type = messageModel.Type;
   var content = messageModel.Content;

   if(isInit)
   {
       var conversation = new Conversation()
       {
           Type= Conversation.ConversationType.Direct,
           Name = "Chat single",
       };
       await _context.Conversations.AddAsync(conversation);
       await _context.SaveChangesAsync();

       var Member1 = new ConvMember()
       {
           ConversationId = conversation.Id,
           UserId = new Guid(senderUserId),
           Role = ConvMember.ConversationRole.None,
           Notify = ConvMember.SettingNotify.Normal,
           NickName = ""
       };
       var Member2 = new ConvMember()
       {
           ConversationId = conversation.Id,
           UserId = conversationId,
           Role = ConvMember.ConversationRole.None,
           Notify = ConvMember.SettingNotify.Normal,
           NickName = ""
       };

       conversationId = conversation.Id;
   }

   throw new Exception("ErrMess-Error hihi");

}
*/
    }
}
