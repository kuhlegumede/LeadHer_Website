// Pages/Events.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Pages.css";
const API_URL = import.meta.env.VITE_API_URL;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const eventsPerPage = 6;

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
       const res = await fetch(`${API_URL}/api/Events`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Events API error:", res.status, errorText);
        throw new Error(`Failed to load events(${res.status})`);
      }
      const data = await res.json();
      data.sort((a,b) => new Date(a.eventDate) - new Date(b.eventDate));
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return (
      <section className="page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Events...</p>
        </div>
      </section>
    );
  }

return (
  <section className="page events-page">

    <div className="page-header">
      <h1 className="page-title">Upcoming Events 📅</h1>

      <p className="page-subtitle">
        Discover workshops, conferences, seminars and community events.
      </p>

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>

    {filteredEvents.length === 0 ? (
      <div className="empty-state">
        <div className="empty-icon">📅</div>
        <h3>No Events Found</h3>
        <p>Try another search term.</p>
      </div>
    ) : (
      <>
        <div className="events-grid">
          {currentEvents.map((event) => (
            <div className="event-card" key={event.id}>

              <div className="event-image">
                {event.imageUrl ? (
                  <img
                   src={`${API_URL}${event.imageUrl}`}
                    alt={event.title}
                  />
                ) : (
                  <div className="event-placeholder">
                    🎉
                  </div>
                )}
              </div>

              <div className="event-content">

                <span className="event-date">
                  {new Date(event.eventDate).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <h2>{event.title}</h2>

                <div className="event-location">
                  📍 {event.location}
                </div>
                <p className="event-description">{event.description}</p>
                <Link
                  to={`/events/${event.id}`}
                  className="event-more-btn"
                >
                  View Event →
                </Link>

              </div>

            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-btn ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </>
    )}
  </section>
);
};

export default Events;
