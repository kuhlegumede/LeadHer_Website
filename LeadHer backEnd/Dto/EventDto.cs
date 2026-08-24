namespace BlogApp_BackEnd.Dto
{
    public class EventDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public string Location { get; set; }
        public int UserId { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
