namespace BlogApp_BackEnd.Dto
{
    public class JournalResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Gratitude { get; set; } = string.Empty;
        public string? ScripturePrayer { get; set; } = string.Empty;
        public string? BrainDump { get; set; } = string.Empty ;
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
    }
}
