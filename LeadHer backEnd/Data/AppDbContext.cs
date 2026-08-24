using BlogApp_BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApp_BackEnd.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<BlogLike> BlogLikes { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<JournalEntry> JournalEntries => Set<JournalEntry>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure composite primary key for BlogLike
            modelBuilder.Entity<BlogLike>()
                .HasKey(bl => new { bl.UserId, bl.BlogId });

            // Configure relationships
            modelBuilder.Entity<BlogLike>()
                .HasOne(bl => bl.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(bl => bl.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<BlogLike>()
                .HasOne(bl => bl.Blog)
                .WithMany(b => b.Likes)
                .HasForeignKey(bl => bl.BlogId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Blog)
                .WithMany(b => b.Comments)
                .HasForeignKey(c => c.BlogId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Blog>()
                .HasOne(b => b.User)
                .WithMany(u => u.Blogs)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Event>()
                .HasOne(u => u.User)
                .WithMany(u => u.Events)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
