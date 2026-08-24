using BlogApp_BackEnd.Dto;
using BlogApp_BackEnd.Interfaces;
using BlogApp_BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly IBlogRepository _repo;

    public CommentController(IBlogRepository repo)
    {
        _repo = repo;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddComment([FromBody] CreateCommentDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var comment = new Comment
        {
            BlogId = dto.BlogId,
            Text = dto.Text,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repo.AddCommentAsync(comment);
        return Ok(created);
    }

    [HttpGet("{blogId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetComments(int blogId)
    {
        var comments = await _repo.GetCommentsByBlogIdAsync(blogId);
        return Ok(comments);
    }
}
