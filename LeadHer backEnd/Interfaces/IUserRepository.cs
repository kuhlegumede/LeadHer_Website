using BlogApp_BackEnd.Models;

namespace BlogApp_BackEnd.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByUsernameOrEmailAsync(string usernameOrEmail);
        Task<User> CreateUserAsync(User user);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<bool> DeleteUserAsync(int id);
        Task<User> GetByIdAsync(int id);
        Task<bool> UpdateUserRoleAsync(int userId, bool isAdmin);
        Task<bool> UpdateUserAsync(User user);
        Task<User?> GetByResetTokenAsync(string token);
    }
}