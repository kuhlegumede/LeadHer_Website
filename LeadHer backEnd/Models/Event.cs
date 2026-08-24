
using BlogApp_BackEnd.Models;
using System;
using System.ComponentModel.DataAnnotations;

public class Event
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; }

    [Required]
    public DateTime EventDate { get; set; }

    [MaxLength(200)]
    public string Location { get; set; }

    [Required]
    public int UserId {  get; set; } //FK
    public User User {  get; set; }

    [MaxLength(255)]
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}