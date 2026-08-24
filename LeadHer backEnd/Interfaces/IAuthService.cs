using BlogApp_BackEnd.Dto;

namespace BlogApp_BackEnd.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(
            string username,
            string email,
            string password,
            bool isAdmin = false);

        Task<AuthResponseDto> LoginAsync(
            string usernameOrEmail,
            string password);


    }
}