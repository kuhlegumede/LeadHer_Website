using BlogApp_BackEnd.Dto;
using BlogApp_BackEnd.Models;
using BlogApp_BackEnd.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogApp_BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventRepository _eventRepository;
        private readonly IWebHostEnvironment _env;

        public EventsController(IEventRepository eventRepository, IWebHostEnvironment env)
        {
            _eventRepository = eventRepository;
            _env = env;
        }

        // GET: api/Events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents()
        {
            var events = await _eventRepository.GetAllEventsAsync();

            var eventDtos = events.Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                EventDate = e.EventDate,
                Location = e.Location,
                UserId = e.UserId,
                ImageUrl = e.ImageUrl,
                CreatedAt = e.CreatedAt

            }).ToList();

            return Ok(eventDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var e = await _eventRepository.GetEventByIdAsync(id);
            if (e == null)
                return NotFound();
            var eventDto = new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                EventDate = e.EventDate,
                Location = e.Location,
                UserId = e.UserId,
                ImageUrl = e.ImageUrl,
                CreatedAt = e.CreatedAt
            };
            return Ok(eventDto);
        }

        // POST: api/Events
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [RequestSizeLimit(20_000_000)]
        public async Task<ActionResult<EventDto>> PostEvent([FromForm] CreateEventDto dto)
        {
            try
            {
                //  Extract logged-in user from JWT
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                string imagePath = null;

                // Save image if uploaded
                if (dto.Image != null)
                {
                    imagePath = await SaveImage(dto.Image);
                }

                // Create event
                var eventItem = new Event
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    EventDate = dto.EventDate,
                    Location = dto.Location,
                    ImageUrl = imagePath,
                    UserId = userId,
                    CreatedAt = DateTime.Now
                };

                await _eventRepository.AddEventAsync(eventItem);

                // Prepare response DTO
                var eventDto = new EventDto
                {
                    Id = eventItem.Id,
                    Title = eventItem.Title,
                    Description = eventItem.Description,
                    EventDate = eventItem.EventDate,
                    Location = eventItem.Location,
                    UserId = userId,
                    ImageUrl = eventItem.ImageUrl,
                    CreatedAt = eventItem.CreatedAt

                };

                return CreatedAtAction(nameof(GetEvents), new { id = eventItem.Id }, eventDto);
            }
            catch (Exception ex)
            {

                return BadRequest(new
                {
                    message = "Failed! Only admins allowed to create events.",
                    error = ex.Message
                });
            }
        }

        private async Task<string> SaveImage(IFormFile file)
        {
            var folder = "Uploads/Events";
            var uploadPath = Path.Combine(_env.WebRootPath, folder);

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return "/" + folder + "/" + fileName;
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateEventDto dto)
        {
            var existingEvent = await _eventRepository.GetEventByIdAsync(id);

            if (existingEvent == null)
                return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            existingEvent.Title = dto.Title;
            existingEvent.Description = dto.Description;
            existingEvent.EventDate = dto.EventDate;
            existingEvent.Location = dto.Location;

            if (dto.ImageUrl != null)
            {
                // Delete old image
                if (!string.IsNullOrEmpty(existingEvent.ImageUrl))
                {
                    var oldImage = Path.Combine(
                        _env.WebRootPath,
                        existingEvent.ImageUrl.TrimStart('/')
                            .Replace("/", Path.DirectorySeparatorChar.ToString()));

                    if (System.IO.File.Exists(oldImage))
                        System.IO.File.Delete(oldImage);
                }

                existingEvent.ImageUrl = await SaveImage(dto.ImageUrl);
            }

            await _eventRepository.UpdateEventAsync(existingEvent);

            return Ok(existingEvent);
        }

        // DELETE: api/Events/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var deleted = await _eventRepository.DeleteEventAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
