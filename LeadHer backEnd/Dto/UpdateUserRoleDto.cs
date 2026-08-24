using System.ComponentModel.DataAnnotations;

public class UpdateUserRoleDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public bool IsAdmin { get; set; }
}