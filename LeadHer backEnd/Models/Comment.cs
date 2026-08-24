using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Text { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public User User { get; set; }

        public int BlogId { get; set; }
        public Blog Blog { get; set; }
    }
}
