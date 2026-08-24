namespace BlogApp_BackEnd.Dto
{
    public class BlogResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } // 
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
    }
}
