using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Dto
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; } = "";

        [Required]
        [MaxLength(50)]
        public string Password { get; set; } = "";
    }
}
