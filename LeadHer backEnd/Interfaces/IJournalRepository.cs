using BlogApp_BackEnd.Models;

namespace BlogApp_BackEnd.Interfaces
{
    public interface IJournalRepository
    {
        Task<IEnumerable<JournalEntry>> GetByUserIdAsync(int userId);
        Task<JournalEntry> CreateAsync(JournalEntry entry);
        Task<JournalEntry?> GetByIdAsync(int id, int userId);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
