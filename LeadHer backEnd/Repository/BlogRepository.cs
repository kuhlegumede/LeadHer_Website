using BlogApp_BackEnd.Data;
using BlogApp_BackEnd.Interfaces;
using BlogApp_BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApp_BackEnd.Repositories
{
    public class BlogRepository : IBlogRepository
    {
        private readonly AppDbContext _context;

        public BlogRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Blog>> GetAllAsync()
        {
            return await _context.Blogs
                .Include(b => b.User)
                .Include(b => b.Comments)
                .Include(b => b.Likes)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Blog> GetByIdAsync(int id)
        {
            return await _context.Blogs
                .Include(b => b.User)
                .Include(b => b.Comments)
                    .ThenInclude(c => c.User)
                .Include(b => b.Likes)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<IEnumerable<Blog>> GetByUserIdAsync(int userId)
        {
            return await _context.Blogs
                .Include(b => b.User)
                .Include(b => b.Comments)
                .Include(b => b.Likes)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Blog> CreateAsync(Blog blog)
        {
            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return blog;
        }

        public async Task<Blog> UpdateAsync(Blog blog)
        {
            _context.Blogs.Update(blog);
            await _context.SaveChangesAsync();
            return blog;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return false;

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> LikeBlogAsync(int blogId, int userId)
        {
            var existingLike = await _context.BlogLikes
                .FirstOrDefaultAsync(bl => bl.BlogId == blogId && bl.UserId == userId);

            if (existingLike != null) return false;

            var like = new BlogLike
            {
                BlogId = blogId,
                UserId = userId
            };

            _context.BlogLikes.Add(like);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnlikeBlogAsync(int blogId, int userId)
        {
            var like = await _context.BlogLikes
                .FirstOrDefaultAsync(bl => bl.BlogId == blogId && bl.UserId == userId);

            if (like == null) return false;

            _context.BlogLikes.Remove(like);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Comment> AddCommentAsync(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == comment.Id);
        }

        public async Task<IEnumerable<Comment>> GetCommentsByBlogIdAsync(int blogId)
        {
            return await _context.Comments
                .Include(c => c.User)
                .Where(c => c.BlogId == blogId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }
    }
}