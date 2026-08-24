namespace BlogApp_BackEnd.Models
{
    public class JournalEntry
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Gratitude { get; set; } = string.Empty;
        public string? ScripturePrayer { get; set; }
        public string? BrainDump { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
