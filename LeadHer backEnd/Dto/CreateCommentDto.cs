using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Dto
{
    public class CreateCommentDto
    {
        [Required]
        public string Text { get; set; }
        [Required]
        public int BlogId { get; set; }
    }
}
