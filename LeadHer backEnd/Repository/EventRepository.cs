using BlogApp_BackEnd.Models;
using BlogApp_BackEnd.Data;
using Microsoft.EntityFrameworkCore;
using BlogApp_BackEnd.Interfaces;

namespace BlogApp_BackEnd.Repository
{
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EventRepository(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events
                                 .Include(e => e.User)
                                 .OrderBy(e => e.EventDate)
                                 .ToListAsync();
        }

        public async Task<Event> GetEventByIdAsync(int id)
        {
            return await _context.Events
                                 .Include(e => e.User)
                                 .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<bool> AddEventAsync(Event eventItem)
        {
            try
            {
                await _context.Events.AddAsync(eventItem);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false; // Controller will catch exact error
            }
        }

        public async Task<bool> UpdateEventAsync(Event eventItem)
        {
            var existingEvent = await _context.Events.FindAsync(eventItem.Id);
            if (existingEvent == null)
                return false;
                
            existingEvent.Title = eventItem.Title;
            existingEvent.Description = eventItem.Description;
            existingEvent.EventDate = eventItem.EventDate;
            existingEvent.Location = eventItem.Location;
            existingEvent.ImageUrl = eventItem.ImageUrl;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteEventAsync(int id)
        {
            var eventToDelete = await _context.Events.FindAsync(id);
            if (eventToDelete == null)
                return false;
            if (!string.IsNullOrEmpty(eventToDelete.ImageUrl))
            {
                var fullPath = Path.Combine(_env.WebRootPath, eventToDelete.ImageUrl.TrimStart('/'));
                if (File.Exists(fullPath))
                    File.Delete(fullPath);
            }

            _context.Events.Remove(eventToDelete);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
