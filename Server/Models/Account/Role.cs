using Microsoft.AspNetCore.Identity;

namespace Server.Models.Account
{
    public class Role : IdentityRole<Guid>
    {
        public Role()
        {
            
        }
        public Role(string name)
        {
            this.Name = name;
        }
    }
}
