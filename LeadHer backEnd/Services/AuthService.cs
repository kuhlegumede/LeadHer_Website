using BCrypt.Net;
using BlogApp_BackEnd.Interfaces;
using BlogApp_BackEnd.Models;
using BlogApp_BackEnd.Dto;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BlogApp_BackEnd.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;

        public AuthService(IUserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
        }

        public async Task<AuthResponseDto> RegisterAsync(string username, string email, string password, bool isAdmin = false)
        {
            var existingUser = await _userRepository.GetByUsernameOrEmailAsync(username);
            if (existingUser != null) throw new Exception("User already exists");

            var existingEmail = await _userRepository.GetByUsernameOrEmailAsync(email);
            if (existingEmail != null) throw new Exception("Email already exists");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = hashedPassword,
                IsAdmin = false
            };

            await _userRepository.CreateUserAsync(user);

            return new AuthResponseDto
            {
                Token = GenerateJwtToken(user),
                Username = user.Username,
                IsAdmin = user.IsAdmin
            };
        }

        public async Task<AuthResponseDto> LoginAsync(string usernameOrEmail, string password)
        {
            var user = await _userRepository.GetByUsernameOrEmailAsync(usernameOrEmail);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            return new AuthResponseDto
            {
                Token = GenerateJwtToken(user),
                Username = user.Username,
                IsAdmin = user.IsAdmin
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            // Add admin role if user is admin
            if (user.IsAdmin)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}