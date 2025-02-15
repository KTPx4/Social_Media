using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Server.DTOs.Communication
{
    public class EditGroupModel
    {
        [AllowNull]
        public string Name { get; set; }

        [AllowNull]
        public IFormFile Image { get; set; }

        [AllowNull]

        public List<string> Members { get; set; }

    }
}
