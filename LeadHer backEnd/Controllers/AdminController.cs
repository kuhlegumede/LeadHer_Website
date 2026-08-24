using BlogApp_BackEnd.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IUserRepository _userRepo;
    private readonly IBlogRepository _blogRepo;

    public AdminController(IUserRepository userRepo, IBlogRepository blogRepo)
    {
        _userRepo = userRepo;
        _blogRepo = blogRepo;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userRepo.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpDelete("user/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var result = await _userRepo.DeleteUserAsync(id);

            if (!result)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.InnerException?.Message ?? ex.Message
            });
        }
    }

    [HttpDelete("blog/{id}")]
    public async Task<IActionResult> DeleteBlog(int id)
    {
        var blog = await _blogRepo.GetByIdAsync(id);
        if (blog == null) return NotFound();

        var result = await _blogRepo.DeleteAsync(id);
        return Ok(new { success = result });
    }
    [HttpPut("user/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto dto)
    {
        if (id != dto.UserId)
            return BadRequest(new { message = "User ID mismatch" });

        var user = await _userRepo.GetByIdAsync(dto.UserId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var result = await _userRepo.UpdateUserRoleAsync(dto.UserId, dto.IsAdmin);

        if (result)
        {
            return Ok(new
            {
                success = true,
                message = dto.IsAdmin ? "User promoted to admin" : "Admin privileges revoked",
                user = new
                {
                    id = user.UserId,
                    username = user.Username,
                    email = user.Email,
                    isAdmin = dto.IsAdmin
                }
            });
        }

        return BadRequest(new { message = "Failed to update user role" });
    }
}
