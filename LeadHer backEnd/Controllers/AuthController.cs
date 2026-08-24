using BlogApp_BackEnd.Data;
using BlogApp_BackEnd.Dto;
using BlogApp_BackEnd.Interfaces;
using BlogApp_BackEnd.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogApp_BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserRepository _userRepository;
        private readonly AppDbContext _context;

        public AuthController(IAuthService authService, IUserRepository userRepository,
    AppDbContext context)
        {
            _authService = authService;
            _userRepository = userRepository;
            _context = context;
        }

        /// <summary>
        /// Register a new user. Set IsAdmin to true to register as admin (for testing/initial setup).
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto dto)
        {
            try
            {
                var authResponse = await _authService.RegisterAsync(dto.Username, dto.Email, dto.Password);
                return Ok(authResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDto dto)
        {
            try
            {
                var authResponse = await _authService.LoginAsync(dto.Email, dto.Password);
                return Ok(authResponse);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPut("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _userRepository.GetByUsernameOrEmailAsync(dto.Email);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _userRepository.UpdateUserAsync(user);

            return Ok(new
            {
                message = "Password updated successfully."
            });
        }
    }
    }