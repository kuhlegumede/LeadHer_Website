namespace BlogApp_BackEnd.Dto
{
    public class JournalDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Gratitude { get; set; } = string.Empty;
        public string? ScripturePrayer { get; set; } = string.Empty;
        public string? BrainDump { get; set; }
    }
}
