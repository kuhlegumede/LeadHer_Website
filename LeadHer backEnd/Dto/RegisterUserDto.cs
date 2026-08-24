using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Dto
{
    public class RegisterUserDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }
        //public bool IsAdmin { get; set; } = false;
    }
}
