namespace BlogApp_BackEnd.Interfaces
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event> GetEventByIdAsync(int id);
        Task<bool> AddEventAsync(Event eventItem);
        Task<bool> UpdateEventAsync(Event eventItem);
        Task<bool> DeleteEventAsync(int id);
    }
}
