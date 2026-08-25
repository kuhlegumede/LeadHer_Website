// Components/EventsList.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Pages.css";

// Gets the API base URL from your Vite environment file
const API_URL = import.meta.env.VITE_API_URL;

const EventsList = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [eventImage, setEventImage] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: ""
  });

  // Load all events
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Events`);

      if (!res.ok) {
        console.error(
          `Server returned status ${res.status} for ${API_URL}/api/Events`
        );

        setEvents([]);
        return;
      }

      const contentType = res.headers.get("content-type");

      if (
        !contentType ||
        !contentType.includes("application/json")
      ) {
        console.error(
          "Server did not return JSON data. Check the API URL."
        );

        setEvents([]);
        return;
      }

      const data = await res.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingEvents = data.filter((event) => {
        const eventDate = new Date(event.eventDate);

        return eventDate >= today;
      });

      setEvents(upcomingEvents);
    } catch (err) {
      console.error("Error loading events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle text/date input changes
  const handleInputChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value
    });
  };

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setEventImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Remove selected image
  const clearImage = () => {
    setEventImage(null);
    setImagePreview(null);

    const input = document.getElementById("event-image");

    if (input) {
      input.value = "";
    }
  };

  // Create new event
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login to submit an event!");
      navigate("/login");
      return;
    }

    const formData = new FormData();

    formData.append("Title", newEvent.title);
    formData.append("Description", newEvent.description);
    formData.append("EventDate", newEvent.eventDate);
    formData.append("Location", newEvent.location);

    if (eventImage) {
      formData.append("Image", eventImage);
    }

    try {
      const res = await fetch(`${API_URL}/api/Events`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`
        },

        body: formData
      });

      if (res.ok) {
        alert("Event added successfully!");

        setShowAddForm(false);

        setNewEvent({
          title: "",
          description: "",
          eventDate: "",
          location: ""
        });

        setEventImage(null);
        setImagePreview(null);

        loadEvents();
      } else {
        const error = await res.json();

        alert(
          "Failed to add event: " +
          JSON.stringify(error)
        );
      }
    } catch (err) {
      console.error("Submit error:", err);

      alert("Unexpected error occurred.");
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/Events/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Event deleted successfully.");

        loadEvents();
      } else {
        alert("Failed to delete event.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        Loading Events...
      </div>
    );
  }

  return (
    <section className="page events-page">

      <div className="page-header">
        <h1 className="page-title">
          Upcoming Events 📅
        </h1>

        <p className="page-subtitle">
          Connect and share your community happenings.
        </p>

        <button
          className="cta-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm
            ? "✕ Cancel"
            : "+ Post an Event"}
        </button>
      </div>

      {showAddForm && (
        <form
          className="add-event-form"
          onSubmit={handleSubmit}
        >
          <h3>Create New Event</h3>

          <div className="form-grid">

            <div className="form-group">
              <label>Event Title</label>

              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date & Time</label>

              <input
                type="datetime-local"
                name="eventDate"
                value={newEvent.eventDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>

              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Event Image</label>

              <div className="file-upload-wrapper">

                {!imagePreview ? (
                  <label
                    htmlFor="event-image"
                    className="file-upload-label"
                  >
                    <span>📸 Upload Image</span>
                  </label>
                ) : (
                  <div className="image-preview-container">

                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />

                    <button
                      type="button"
                      onClick={clearImage}
                      className="remove-image-btn"
                    >
                      ✕ Remove
                    </button>

                  </div>
                )}

                <input
                  id="event-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

              </div>
            </div>

          </div>

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
            >
              Create Event
            </button>

          </div>

        </form>
      )}

      {events.length === 0 ? (
        <div className="empty-state">
          <h3>No Upcoming Events</h3>
        </div>
      ) : (
        <div className="events-grid">

          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
            >

              {event.imageUrl ? (
                <div className="event-image-box">

                  <img
                    src={`${API_URL}${event.imageUrl}`}
                    alt={event.title}
                  />

                </div>
              ) : (
                <div className="event-image-box event-placeholder">
                  🎉
                </div>
              )}

              <div className="event-date-badge">

                <span className="badge-month">
                  {new Date(event.eventDate)
                    .toLocaleString(
                      "default",
                      { month: "short" }
                    )
                    .toUpperCase()}
                </span>

                <span className="badge-day">
                  {new Date(event.eventDate).getDate()}
                </span>

              </div>

              <div className="event-content">

                <h2 className="event-title">
                  {event.title}
                </h2>

                <div className="event-meta">

                  <div className="meta-item">
                    🕒{" "}
                    {new Date(
                      event.eventDate
                    ).toLocaleString(
                      "en-US",
                      {
                        weekday: "long",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )}
                  </div>

                  <div className="meta-item">
                    📍 {event.location}
                  </div>

                </div>

                <p className="event-description">
                  {event.description}
                </p>

                <div className="event-footer">

                  <span className="event-creator">
                    👤 {event.creatorUsername}
                  </span>

                  {isAdmin && (
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(event.id)
                      }
                    >
                      🗑️ Delete
                    </button>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
};

export default EventsList;
