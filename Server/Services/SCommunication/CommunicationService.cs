using Azure;
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
    public class RsProcessReactMessage
    {
        public ReactMessageResponse reactResponse;
        public Guid FromId;
        public List<Guid> ToIds;
    }
    public interface ICommunicationService
    {
        Task<RsProcessMessage> ProcessMessageAsync(string senderUserId, MessageModel messageModel);
        Task<RsProcessMessage> ProcessDirectMessageAsync(string senderUserId, MessageModel messageModel);
        Task<RsProcessReactMessage> ProcessReactMessageAsync(ReactMessageModel reactMessageModel);

        Task<ConversationResponse> CreateConversation(string userId, CreateGroupModel createGroupModel, FileInfoDto fileInfoDto);
        Task<List<ConversationResponse>> GetGroups(string userId);
        Task<List<ConversationResponse>> GetConversation(string userId, int page = 0);
        Task<List<MessageResponse>> GetMessage(string userId, string convId, int page = 0);

        Task<List<MessageResponse>> GetMedia(string userId, string convId,int page = 0);
        Task<MessageResponse> SendFile(string userId, string convId, IFormFile file);
        Task<bool> SetSeen(string userId, string convId);
    }

    public class CommunicationService : ICommunicationService
    {
        private readonly APIDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _RootImgGroup;
        private readonly string _ServerHost;
        private readonly string _AccessImgAccount;
        private readonly int _LIMIT_CONVERSATION = 20;
        private readonly int _LIMIT_MESSAGE = 15;
        private readonly int _LIMIT_MEDIA = 20;

        public CommunicationService(APIDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;

            var serverSettings = configuration.GetSection("ServerSettings");
            _RootImgGroup = serverSettings["RootImgGroup"];
            _ServerHost = serverSettings["HostName"];
            _AccessImgAccount = serverSettings["AccessImgHost"];
        }

        public async Task<bool> CanSendDirectMessage(string userId1, string userId2)
        {
            var relationship = await _context.FriendShips.Where(f => f.UserId.ToString() == userId1 && f.FriendId.ToString() == userId2).FirstOrDefaultAsync();

            if (relationship == null) return true;

            return relationship.Status == Models.RelationShip.FriendShip.FriendStatus.Normal;
        }

        public async Task<User> ExistsUser(string userId)
        {
            return await _context.Users.Where(u => u.Id.ToString() == userId).FirstOrDefaultAsync();
        }

        public async Task<bool> CanSendDirect(ICollection<ConvMember> convMembers)
        {
            var userId1 = convMembers.ElementAt(0).UserId;
            var userId2 = convMembers.ElementAt(1).UserId;

            return await CanSendDirectMessage(userId1.ToString(), userId2.ToString());
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

            Message replyMess = null;

            var listMember = Conversation.Members;
            var convSetting = Conversation.ConvSetting;

            var SenderUser = listMember.Where(c => c.UserId.ToString() == senderUserId).FirstOrDefault();
          
            if (Conversation == null) throw new Exception("ErrMess-Conversation not exists");
            if (SenderUser == null) throw new Exception("ErrMess-You not have permission to send message");
            if(replyId != null)
            {
                replyMess = await _context.Messages.Where(m => m.Id == replyId).FirstOrDefaultAsync();
                if(replyMess == null) throw new Exception("ErrMess-Reply message not found");

            }
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
            if(replyMess != null)
            {
                var rep = new MessageResponse(replyMess);
                messResponse.MessageReply = rep;
            }

            List<Guid> listTo = listMember.Where(m=> m.UserId != SenderUser.UserId).Select(m => m.UserId).ToList();
            RsProcessMessage rs = new RsProcessMessage()
            {
                FromId = SenderUser.UserId,
                ToIds = listTo,
                messageResponse= messResponse
            };

            return rs;

        }
        public async Task<RsProcessReactMessage> ProcessReactMessageAsync(ReactMessageModel reactMessageModel)
        {
            var senderUserId = reactMessageModel.SenderId;
            var messageId = reactMessageModel.MessageId;
            var react = reactMessageModel.React;

            var Message = await _context.Messages.Where(m => m.Id == messageId)
                .Include(m => m.Conversation)
                .ThenInclude(c => c.Members)
                .FirstOrDefaultAsync();
               
            if(Message == null) throw new Exception("ErrMess-Message not exists");
            var React = await _context.MessagesReactions.Where(r => r.UserId == senderUserId && r.MessageId  == messageId).FirstOrDefaultAsync();
            var isDeleted = false;
            if(React == null)
            {
                React = new MessageReaction()
                {
                    UserId = senderUserId,
                    MessageId = messageId,
                    React = react
                };
                await _context.MessagesReactions.AddAsync(React);
            }
            else
            {
                if(React.React.Equals(react))
                {
                    _context.MessagesReactions.Remove(React);
                    isDeleted = true;
                }
                else
                {
                    React.React = react;
                }
            }
            await _context.SaveChangesAsync();

            var listMember = Message.Conversation?.Members ?? [];

            List<Guid> listTo = listMember.Where(m => m.UserId != senderUserId).Select(m => m.UserId).ToList();

            var messResponse = new ReactMessageResponse()
            {
                ConversationId = Message.Conversation?.Id ?? new Guid(),
                MessageId = messageId,
                React = react,
                SenderId = senderUserId,
                isDelete= isDeleted
            };

            RsProcessReactMessage rs = new RsProcessReactMessage()
            {
                FromId = senderUserId,
                ToIds = listTo,
                reactResponse = messResponse
            };

            return rs;
        }
        public  async Task<RsProcessMessage> ProcessDirectMessageAsync(string senderUserId, MessageModel messageModel)
        {
            var friendId = messageModel.ConversationId;
            
            var type = messageModel.Type;

            var content = messageModel.Content;
            var canSend = await CanSendDirectMessage(senderUserId, friendId.ToString());
            if(!canSend) throw new Exception("ErrMess-Can not send message to this user");

            var conversations = await _context.Conversations
            .Include(c => c.Members)
            .Where(c => c.Type == Conversation.ConversationType.Direct &&
                        c.Members.Any(cm => cm.UserId.ToString() == senderUserId) &&
                        c.Members.Any(cm => cm.UserId == friendId))
            .FirstOrDefaultAsync();
            
            if(conversations == null)
            {
                conversations = new Conversation()
                {
                    Type = Conversation.ConversationType.Direct,
                    Name = "Chat Direct",
                };
                await _context.Conversations.AddAsync(conversations);
                await _context.SaveChangesAsync();

                var setting = new ConvSetting()
                {
                    CanEdit = ConvSetting.ConvPermission.All,
                    CanSend = ConvSetting.ConvPermission.All,
                    ConversationId = conversations.Id
                };
                var members = new List<ConvMember>();
                members.Add(new ConvMember()
                {
                    ConversationId = conversations.Id,
                    UserId = new Guid(senderUserId),
                    Role = ConvMember.ConversationRole.None,
                    Notify = ConvMember.SettingNotify.Normal
                });
                members.Add(new ConvMember()
                {
                    ConversationId = conversations.Id,
                    UserId = friendId,
                    Role = ConvMember.ConversationRole.None,
                    Notify = ConvMember.SettingNotify.Normal
                });
                await _context.ConvMembers.AddRangeAsync(members);
                await _context.ConvSettings.AddAsync(setting);
            }

            var mess = new Message()
            {
                ConversationId = conversations.Id,
                SenderId = new Guid(senderUserId),
                ReplyMessageId = null,
                Type = type,
                Content = content
            };

            await _context.Messages.AddAsync(mess);
            await _context.SaveChangesAsync();

            var messResponse = new MessageResponse(mess);

            List<Guid> listTo = new List<Guid> { friendId };
            RsProcessMessage rs = new RsProcessMessage()
            {
                FromId = new Guid(senderUserId),
                ToIds = listTo,
                messageResponse = messResponse
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
            ConvResponse.LastMessage = new MessageResponse(newMess);
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
            var convId = await _context.ConvMembers.Where(c => c.UserId == new Guid(userId)).Select(c => c.ConversationId).ToListAsync();
            var conversations = await _context.Conversations
            .Where(c => convId.Contains(c.Id))
            .Include(c => c.Members)
            .ThenInclude(c => c.User)
            .Include(c => c.ConvSetting)
            .Select(c => new
            {
                Conversation = c,
                LastMessage = _context.Messages
                    .Where(m => m.ConversationId == c.Id)
                    .Include(m => m.Sender)
                    .Include(m => m.Seens)
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefault()
                    ,
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

        public async Task<List<MessageResponse>> GetMessage(string userId, string convId, int page = 1)
        {
            if(page < 1) page = 1;
            var Conversation = await _context.Conversations
                .Where(c => c.Id.ToString() == convId)
                .Include(c => c.Members)
                .FirstOrDefaultAsync();

            var Members = Conversation.Members;
            if (!Members.Any(m =>m.UserId.ToString() == userId)) 
            {
                throw new Exception("Chat-You not allow to access data");
            }

            var Messages = await _context.Messages
                .Where(m => m.ConversationId.ToString() == convId)
                .Include(m => m.Reacts)
                .Include(m => m.ReplyMessage)
                .Include(m => m.Seens)
                .OrderByDescending(m=> m.CreatedAt)
                .Select(m => new MessageResponse()
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    ConversationId = m.ConversationId,
                    ReplyMessageId = m.ReplyMessageId,
                    Type = m.Type,
                    Content = m.Content,
                    IsSystem = m.IsSystem,
                    IsDeleted = m.IsDeleted,
                    CreatedAt = m.CreatedAt,
                    MessageReply = m.ReplyMessage == null ? null : new MessageResponse(m.ReplyMessage),
                    Reacts = m.Reacts.Select(r => new MessageReactResponse()
                    {
                        MessageId = r.MessageId,
                        CreatedAt = r.CreatedAt,
                        React = r.React,
                        UserId = r.UserId,
                    }).ToList(),
                    SeenIds = m.Seens.Select(s => s.UserId.ToString()).ToList()
                })
                .Skip((page -1)* _LIMIT_MESSAGE)
                .Take(_LIMIT_MESSAGE)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            return Messages;
        }

        public async Task<List<MessageResponse>> GetMedia(string userId,string convId, int page = 1)
        {   
            if (page < 1) page = 1;
            var files = await _context.Messages
                .Where(m => m.ConversationId.ToString() == convId && !m.IsDeleted && (m.Type == Message.MessageType.Image || m.Type == Message.MessageType.Video))
                .Skip((page-1) * _LIMIT_MEDIA)
                .Take(_LIMIT_MEDIA)
                .Select(m => new MessageResponse()
                {
                    Id = m.Id,
                    Content = $"{_ServerHost}/api/file/src?t=message&id={m.Id}&token=",
                    CreatedAt= m.CreatedAt,
                    Type = m.Type,
                    
                })
                .ToListAsync();
            return files;
 
        }

        public async Task<MessageResponse> SendFile(string userId, string convId, IFormFile file)
        {

            // Kiểm tra xem user có phải là thành viên của conversation không
            bool isMember = await _context.ConvMembers.AnyAsync(cm => cm.ConversationId.ToString() == convId && cm.UserId.ToString() == userId);
            if (!isMember)
            {
                throw new Exception("Chat-You are not a member of this conversation or not exists");
            }

            var messageType = Message.MessageType.File;

            if (file.ContentType.StartsWith("image/"))
            {
                messageType = Message.MessageType.Image;
            }
            else if (file.ContentType.StartsWith("video/"))
            {
                messageType = Message.MessageType.Video;
            }
            
            string fileName = Path.GetFileName(file.FileName);
            
            var newMess = new Message()
            {
                Content = fileName,
                Type = messageType,
                ConversationId = new Guid(convId),
                SenderId = new Guid(userId),
            };
            _context.Messages.Add(newMess);
            await _context.SaveChangesAsync(); // Để có được message.Id

            // Xác định đường dẫn lưu file: /wwwroot/group/{conversationId}/{messageId}/
            string folderPath = Path.Combine(_RootImgGroup, convId, newMess.Id.ToString());
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            string filePath = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var rs = new MessageResponse(newMess);
          
            rs.Content = $"{_ServerHost}/api/file/src?t=message&id={rs.Id}&token=";

            return rs;
        }

        public async Task<bool> SetSeen(string userId, string convId)
        {
            bool isMember = await _context.ConvMembers.AnyAsync(cm => cm.ConversationId.ToString() == convId && cm.UserId.ToString() == userId);
            if (!isMember)
            {
                throw new Exception("Chat-You are not a member of this conversation or not exists");
            }
            var listSeen = new List<MessageSeen>();
            
            var listMessId = await _context.Messages            
                .Where(m => m.ConversationId.ToString() == convId && m.SenderId.ToString() != userId && !m.Seens.Any(s => s.UserId.ToString() == userId))
                .Select(m => m.Id)
                .ToListAsync();

            foreach(var id in listMessId)
            {
                listSeen.Add(new MessageSeen()
                {
                    MessageId = id,
                    UserId = new Guid(userId),
                    Status = MessageSeen.SeenStatus.Seen,

                });
            }

            await _context.MessagesSeens.AddRangeAsync(listSeen);
            await _context.SaveChangesAsync();

           return true;
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
