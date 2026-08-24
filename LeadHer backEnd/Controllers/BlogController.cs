using BlogApp_BackEnd.Dto;
using BlogApp_BackEnd.Interfaces;
using BlogApp_BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogApp_BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogRepository _blogRepository;
        private readonly IWebHostEnvironment _env;

        public BlogController(IBlogRepository blogRepository, IWebHostEnvironment env)
        {
            _blogRepository = blogRepository;
            _env = env;
        }

        // GET ALL
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _blogRepository.GetAllAsync();

            var response = blogs.Select(b => new BlogResponseDto
            {
                Id = b.Id,
                Title = b.Title,
                Text = b.Text,
                ImageUrl = b.Images,
                CreatedAt = b.CreatedAt,
                UserId = b.UserId,
                Username = b.User?.Username,
                LikesCount = b.Likes?.Count ?? 0,
                CommentsCount = b.Comments?.Count ?? 0
            });

            return Ok(response);
        }

        // GET BY ID
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog == null)
                return NotFound(new { message = "Blog not found." });

            return Ok(blog);
        }

        // CREATE
        [HttpPost]
        [Authorize]
        [RequestSizeLimit(20_000_000)]
        public async Task<IActionResult> Create([FromForm] CreateBlogDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            string imagePath = null;
            if (dto.Image != null)
            {
                imagePath = await SaveImage(dto.Image);
            }
            var blog = new Blog
            {
                Title = dto.Title,
                Text = dto.Text,
                Images = imagePath,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };
            var created = await _blogRepository.CreateAsync(blog);

            // Return a DTO to avoid circular reference
            var response = new BlogResponseDto
            {
                Id = created.Id,
                Title = created.Title,
                Text = created.Text,
                ImageUrl = created.Images,
                CreatedAt = created.CreatedAt,
                UserId = created.UserId,
                Username = User.FindFirstValue(ClaimTypes.Name),
                LikesCount = 0,
                CommentsCount = 0
            };

            return Ok(response);
        }

        // UPDATE
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateBlogDto dto)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (blog.UserId != userId) return Unauthorized();

            blog.Title = dto.Title ?? blog.Title;
            blog.Text = dto.Text ?? blog.Text;

            if (dto.Image != null)
            {
                // Delete old image
                if (!string.IsNullOrEmpty(blog.Images))
                {
                    var fullOldPath = Path.Combine(_env.WebRootPath, blog.Images.TrimStart('/'));
                    if (System.IO.File.Exists(fullOldPath))
                        System.IO.File.Delete(fullOldPath);
                }

                // Save new file
                blog.Images = await SaveImage(dto.Image);
            }

            var updated = await _blogRepository.UpdateAsync(blog);
            return Ok(updated);
        }


        // DELETE
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (blog.UserId != userId) return Unauthorized();

            // Delete file
            if (!string.IsNullOrEmpty(blog.Images))
            {
                var fullPath = Path.Combine(_env.WebRootPath, blog.Images.TrimStart('/'));
                if (System.IO.File.Exists(fullPath))
                    System.IO.File.Delete(fullPath);
            }

            var deleted = await _blogRepository.DeleteAsync(id);
            return Ok(new { success = deleted });
        }

        // GET USER'S BLOGS
        [HttpGet("myblogs")]
        [Authorize]
        public async Task<IActionResult> MyBlogs()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var blogs = await _blogRepository.GetByUserIdAsync(userId);
            return Ok(blogs);
        }
        private async Task<string> SaveImage(IFormFile file)
        {
            var folder = "Uploads/Blogs";
            var uploadPath = Path.Combine(_env.WebRootPath, folder);

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return "/" + folder + "/" + fileName;
        }
    }
}
