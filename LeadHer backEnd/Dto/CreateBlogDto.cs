namespace BlogApp_BackEnd.Dto
{
    public class CreateBlogDto
    {
        public string Title { get; set; }
        public string Text { get; set; }
        public IFormFile? Image { get; set; }
    }
}
