using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models.Account;

namespace Server.Services
{
    public class NotifyService
    {
        private readonly APIDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        private readonly string _AccessImgAccount;
        private readonly string _RootImgPost;
        private readonly string _AccessImgPost;
        private readonly string _ServerHost;

        public NotifyService(APIDbContext context, UserManager<User> userManager, IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _configuration = configuration;

            var serverSettings = _configuration.GetSection("ServerSettings");
            _RootImgPost = serverSettings["RootImgPost"];
            _AccessImgPost = serverSettings["AccesImgPost"];
            _ServerHost = serverSettings["HostName"];
            _AccessImgAccount = serverSettings["AccessImgHost"];

        }

        public async Task<bool> ReadNotify(string userId, string notifyId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("Notify-Account not exists");

            var notify = await _context.UserNotifies.Where(n => n.Id.ToString() == notifyId).FirstOrDefaultAsync();

            if (notifyId == null) throw new Exception("Notify-Notify not exists");
            notify.IsSeen = true;

            _context.UserNotifies.Update(notify);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
