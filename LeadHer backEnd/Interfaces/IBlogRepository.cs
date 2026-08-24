using BlogApp_BackEnd.Models;

namespace BlogApp_BackEnd.Interfaces
{
    public interface IBlogRepository
    {
        Task<IEnumerable<Blog>> GetAllAsync();
        Task<Blog> GetByIdAsync(int id);
        Task<IEnumerable<Blog>> GetByUserIdAsync(int userId);

        Task<Blog> CreateAsync(Blog blog);
        Task<Blog> UpdateAsync(Blog blog);
        Task<bool> DeleteAsync(int id);

        // Likes
        Task<bool> LikeBlogAsync(int blogId, int userId);
        Task<bool> UnlikeBlogAsync(int blogId, int userId);

        // Comments
        Task<Comment> AddCommentAsync(Comment comment);
        Task<IEnumerable<Comment>> GetCommentsByBlogIdAsync(int blogId);
    }
}
