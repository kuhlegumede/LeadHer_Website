using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? PasswordResetToken { get; set; }

        public DateTime? PasswordResetTokenExpiry { get; set; }
        public bool IsAdmin { get; set; } = false;

        public ICollection<Blog> Blogs { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<BlogLike> Likes { get; set; }
        public ICollection<Event> Events { get; set; }
        public List<JournalEntry> JournalEntries { get; set; } = new();

    }
}
