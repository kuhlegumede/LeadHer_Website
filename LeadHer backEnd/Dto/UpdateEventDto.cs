using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Dto
{
    public class UpdateEventDto
    {
        [Required]
        public string Title { get; set; } = "";

        [Required]
        public string Description { get; set; } = "";

        [Required]
        public DateTime EventDate { get; set; }

        [Required]
        public string Location { get; set; } = "";

        [Required]
        public IFormFile? ImageUrl { get; set; }
    }
}
