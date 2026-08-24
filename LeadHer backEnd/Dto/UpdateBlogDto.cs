namespace BlogApp_BackEnd.Dto
{
    public class UpdateBlogDto
    {
        public string Title { get; set; }
        public string Text { get; set; }
        public IFormFile? Image { get; set; }
    }
}
