using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Dto
{
    public class LoginUserDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
