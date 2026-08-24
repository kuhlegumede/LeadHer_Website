using BlogApp_BackEnd.Data;
using BlogApp_BackEnd.Interfaces;
using BlogApp_BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApp_BackEnd.Repository
{
    public class JournalRepository: IJournalRepository
    {
        private readonly AppDbContext _context;

        public JournalRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<JournalEntry?>GetByIdAsync(int id, int userId)
        {
            return await _context.JournalEntries
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);
        }
        public async Task<IEnumerable<JournalEntry>> GetByUserIdAsync(int userId)
        {
            return await _context.JournalEntries
                .Where(j => j.UserId == userId)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();
        }

        public async Task<JournalEntry> CreateAsync(JournalEntry entry)
        {
            _context.JournalEntries.Add(entry);
            await _context.SaveChangesAsync();
            return entry;
        }
        public async Task<bool> DeleteAsync(int id, int userId) 
        { var journal = await _context.JournalEntries.FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId);
            if (journal == null)
            { 
                return false;
            }
            _context.JournalEntries.Remove(journal);
            await _context.SaveChangesAsync();
            return true; 
        }
    }
}
