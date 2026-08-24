using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Models
{
    public class Blog
    {
        [Key]  
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        public string Text { get; set; }

        public string Images { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int UserId { get; set; }
        public User User { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<BlogLike> Likes { get; set; }
    }
}
