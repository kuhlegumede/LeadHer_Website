using BlogApp_BackEnd.Data;
using BlogApp_BackEnd.Interfaces;
using BlogApp_BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApp_BackEnd.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetByUsernameOrEmailAsync(string usernameOrEmail)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username == usernameOrEmail || u.Email == usernameOrEmail);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.Blogs)
                .Include(u => u.Comments)
                .ToListAsync();
        }
        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users
                .Include(u => u.Blogs)
                    .ThenInclude(b => b.Comments)
                .Include(u => u.Blogs)
                    .ThenInclude(b => b.Likes)
                .Include(u => u.Comments)
                .Include(u => u.Likes)
                .Include(u => u.Events)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
                return false;

            // Delete comments and likes on the user's blogs
            foreach (var blog in user.Blogs)
            {
                _context.Comments.RemoveRange(blog.Comments);
                _context.BlogLikes.RemoveRange(blog.Likes);
            }

            // Delete the user's own comments and likes
            _context.Comments.RemoveRange(user.Comments);
            _context.BlogLikes.RemoveRange(user.Likes);

            // Delete blogs and eventss
            _context.Blogs.RemoveRange(user.Blogs);
            _context.Events.RemoveRange(user.Events);

            //Delete user journal
            _context.JournalEntries.RemoveRange(user.JournalEntries);

            // Delete the user
            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _context.Users
        .FirstOrDefaultAsync(u => u.UserId == id);
        }

        public async Task<bool> UpdateUserRoleAsync(int userId, bool isAdmin)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return false;

            user.IsAdmin = isAdmin;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            _context.Users.Update(user);

            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<User?> GetByResetTokenAsync(string token)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.PasswordResetToken == token);
        }
    }
}