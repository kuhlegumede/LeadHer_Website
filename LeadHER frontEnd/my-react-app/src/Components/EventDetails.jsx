import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/Pages.css";
const API_URL = import.meta.env.VITE_API_URL;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const res = await fetch(`${API_URL}/api/Events`);

  const token = localStorage.getItem("token");

  // Get logged-in user information
  // Check whether current user is an admin
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // =========================================================
  // LOAD EVENT
  // =========================================================

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/Events/${id}`);

      if (!res.ok) {
        throw new Error("Failed to load event");
      }

      const data = await res.json();

      console.log("Event loaded:", data);

      setEvent(data);
    } catch (error) {
      console.error("Error loading event:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE EVENT
  // =========================================================

  const handleDelete = async () => {
    if (!isAdmin) {
      alert("Only administrators can delete events.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(`${API_URL}/api/Events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        alert("Your session has expired. Please login again.");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        alert("Only administrators can delete events.");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to delete event."
        );
      }

      alert("Event deleted successfully.");

      // Go back to events page after deletion
      navigate("/events");

    } catch (error) {
      console.error("Delete event error:", error);

      alert(
        error.message ||
        "Something went wrong while deleting the event."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <section className="page">
        <div className="event-loading">
          <div className="event-spinner"></div>
          <p>Loading event...</p>
        </div>
      </section>
    );
  }

  // =========================================================
  // EVENT NOT FOUND
  // =========================================================

  if (!event) {
    return (
      <section className="page">
        <div className="event-not-found">
          <div className="event-not-found-icon">
            📅
          </div>

          <h2>Event not found</h2>

          <button
            className="event-back-button"
            onClick={() => navigate("/events")}
          >
            ← Back to Events
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page">

      <div className="event-details-container">

        {/* BACK BUTTON */}

        <button
          className="event-back-button"
          onClick={() => navigate("/events")}
        >
          ← Back to Events
        </button>

        {/* EVENT IMAGE */}

        <div className="event-banner">

          {event.imageUrl ? (
            <img
              src={`${API_URL}${event.imageUrl}`}
              alt={event.title}
              onLoad={() =>
                console.log("Image loaded")
              }
              onError={() =>
                console.log("Image failed")
              }
            />
          ) : (
            <div className="event-banner-placeholder">
              🎉
            </div>
          )}

        </div>

        {/* EVENT INFORMATION */}

        <div className="event-info">

          {/* DATE */}

          <span className="event-date-badge">
            📅{" "}
            {new Date(
              event.eventDate
            ).toLocaleDateString("en-ZA", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>

          {/* TITLE */}

          <h1>{event.title}</h1>

          {/* EVENT META */}

          <div className="event-meta-grid">

            <div className="meta-card">

              <div className="meta-icon">
                🕒
              </div>

              <div>
                <h4>Time</h4>

                <p>
                  {new Date(
                    event.eventDate
                  ).toLocaleTimeString("en-ZA", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

            </div>

            <div className="meta-card">

              <div className="meta-icon">
                📍
              </div>

              <div>
                <h4>Venue</h4>

                <p>{event.location}</p>
              </div>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="description-card">

            <h2>About this Event</h2>

            <p>{event.description}</p>

          </div>

          {/* ADMIN ACTIONS */}

          {isAdmin && (
            <div className="event-admin-actions">

              <div className="admin-action-heading">
                <span>⚙️</span>

                <div>
                  <h3>Administrator Actions</h3>

                  <p>
                    Only administrators can manage
                    this event.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="delete-event-button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="delete-spinner"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    🗑️ Delete Event
                  </>
                )}
              </button>

            </div>
          )}

          {/* FOOTER */}

          <div className="event-footer">

            Posted on{" "}
            {new Date(
              event.createdAt
            ).toLocaleDateString("en-ZA")}

          </div>

        </div>

      </div>

    </section>
  );
};

export default EventDetails;
