using Microsoft.EntityFrameworkCore;

namespace Server.Data
{
    public class APIDbContext : DbContext
    {
        public APIDbContext(DbContextOptions options) : base(options)
        {
        }

    }
}
