namespace BlogApp_BackEnd.Models
{
    public class BlogLike
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int BlogId { get; set; }
        public Blog Blog { get; set; }
    }
}
