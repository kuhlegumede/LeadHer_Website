using BlogApp_BackEnd.Dto;
using BlogApp_BackEnd.Interfaces;
using BlogApp_BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogApp_BackEnd.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JournalController : ControllerBase
    {
        private readonly IJournalRepository _journalRepository;

        public JournalController(IJournalRepository journalRepository)
        {
            _journalRepository = journalRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyEntries()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            if (!int.TryParse(userIdString, out var userId))
            {
                return BadRequest("Invalid user ID.");
            }
            try
            {
                var entries = await _journalRepository.GetByUserIdAsync(userId);
                
                var response = entries.Select(j => new JournalResponseDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Content = j.Content,
                    Gratitude = j.Gratitude,
                    ScripturePrayer = j.ScripturePrayer,
                    BrainDump = j.BrainDump,
                    CreatedAt = j.CreatedAt,
                    UserId = j.UserId
                });
                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception 
                return StatusCode(500, "An error occurred while retrieving journal entries.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateEntry([FromBody] JournalDto dto)
        {

            if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Content))
            {
                return BadRequest(new { message = "Title and content are required" });
            }

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var userId = int.Parse(userIdString);

            try
            {
                var entry = new JournalEntry
                {
                    Title = dto.Title,
                    Content = dto.Content,
                    Gratitude = dto.Gratitude,
                    ScripturePrayer = dto.ScripturePrayer,
                    BrainDump  = dto.BrainDump,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };

                var createdEntry = await _journalRepository.CreateAsync(entry);

                var response = new JournalResponseDto
                {
                    Id = createdEntry.Id,
                    Title = createdEntry.Title,
                    Content = createdEntry.Content,
                    Gratitude = createdEntry.Gratitude,
                    ScripturePrayer = createdEntry.ScripturePrayer,
                    BrainDump = createdEntry.BrainDump,
                    CreatedAt = createdEntry.CreatedAt,
                    UserId = createdEntry.UserId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "An error occurred while creating the journal entry.");
            }

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult>DeleteEntry(int id)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized(new
                {
                    message = "User is not authenticated."
                });
            }
            if(!int.TryParse(userIdString, out var userId))
            {
                return BadRequest(new
                {
                    message = "Invalid user ID."
                });
            }
            try
            {
                //Check both journal ID and UserId, user cannot delete another users journal.
                var deleted = await _journalRepository.DeleteAsync(id, userId);
                if (!deleted)
                {
                    return NotFound(new
                    {
                        message = "Journal entry not found."
                    });
                }
                return Ok(new
                {
                    message = "Journal entry deleted successfully."
                });
            }
            catch(Exception)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while deleting the journal entry."
                });
            }
        }
    }
    
}
