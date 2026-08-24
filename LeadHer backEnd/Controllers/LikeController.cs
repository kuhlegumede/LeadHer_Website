using BlogApp_BackEnd.Interfaces;
using BlogApp_BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class LikeController : ControllerBase
{
    private readonly IBlogRepository _repo;

    public LikeController(IBlogRepository repo)
    {
        _repo = repo;
    }

    [HttpPost("{blogId}")]
    [Authorize]
    public async Task<IActionResult> Like(int blogId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await _repo.LikeBlogAsync(blogId, userId);
        return Ok(new { success = result });
    }

    [HttpDelete("{blogId}")]
    [Authorize]
    public async Task<IActionResult> Unlike(int blogId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await _repo.UnlikeBlogAsync(blogId, userId);
        return Ok(new { success = result });
    }
}
