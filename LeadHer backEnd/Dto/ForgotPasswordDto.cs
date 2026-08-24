using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Dto
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = "";
    }
}
