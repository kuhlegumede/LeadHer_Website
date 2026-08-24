using System.ComponentModel.DataAnnotations;

namespace BlogApp_BackEnd.Dto
{
    public class CreateEventDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        [MaxLength(500)]
        public string Description { get; set; }

        [Required(ErrorMessage = "Event Date is required.")]
        public DateTime EventDate { get; set; }

        [MaxLength(200)]
        public string Location { get; set; }

        public IFormFile? Image { get; set; }

      /*  [Required]
        public int UserId { get; set; }*/
    }
}
