import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/Pages.css";
import "../Styles/Journal.css";
const API_URL = import.meta.env.VITE_API_URL;

const StudentJournal = () => {
  const res = await fetch(`${API_URL}/api/Journal`);

  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [scripturePrayer, setScripturePrayer] = useState("");
  const [brainDump, setBrainDump] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD JOURNALS / CHECK CONNECTION
  // =========================================================

  const loadEntries = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Unable to connect to the journal service."
        );
      }

      setError("");
    } catch (err) {
      console.error("Load journal error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    loadEntries();
  }, []);

  // =========================================================
  // CLEAR FORM
  // =========================================================

  const clearForm = () => {
    setTitle("");
    setContent("");
    setGratitude("");
    setScripturePrayer("");
    setBrainDump("");
  };

  // =========================================================
  // SAVE JOURNAL
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Your session has expired. Please login again.");
      return;
    }

    if (!title.trim()) {
      alert("Journal title is required.");
      return;
    }

    if (!content.trim()) {
      alert("Thoughts & Reflection is required.");
      return;
    }

    try {
      setSaving(true);

      setError("");

      const journalData = {
        title: title.trim(),
        content: content.trim(),
        gratitude: gratitude.trim(),
        scripturePrayer: scripturePrayer.trim(),
        brainDump: brainDump.trim(),
      };

      console.log("Sending journal:", journalData);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(journalData),
      });

      console.log("Response status:", response.status);

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      if (!response.ok) {
        const text = await response.text();

        console.error("Backend error:", text);

        throw new Error(
          text || "Unable to save journal entry."
        );
      }

      const savedJournal = await response.json();

      console.log(
        "Journal saved successfully:",
        savedJournal
      );

      clearForm();

      alert("Journal entry saved successfully!");

    } catch (err) {
      console.error("Save journal error:", err);

      alert(
        err.message ||
        "Something went wrong while saving your journal."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <section className="page">
        <div className="journal-loading">
          <div className="journal-spinner"></div>

          <p>Loading journal...</p>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <section className="page">
        <div className="journal-error">

          <div className="error-icon">
            !
          </div>

          <h2>
            Unable to Load Journal
          </h2>

          <p>
            {error}
          </p>

          <button
            className="journal-primary-button"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Login Again
          </button>

        </div>
      </section>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <section className="page">

      <div className="page-container">

        {/* PAGE HEADER */}

        <div className="journals-header">

          <div className="journals-heading">
            <div>
              <h1>
                Student Journal
              </h1>

              <p className="page-subtitle">
                Reflect on your day, record your
                gratitude, write your favourite
                scripture or prayer and freely
                express your thoughts.
              </p>
            </div>

          </div>

          <Link
            to="/my-journals"
            className="back-button"
          >
            📚 My Journals
          </Link>

        </div>

        {/* JOURNAL FORM */}

        <div className="journal-form-panel">

          <form
            className="form-container"
            onSubmit={handleSubmit}
          >

            {/* TITLE */}

            <div className="form-group">

              <label className="form-label">
                Journal Title *
              </label>

              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter title..."
                required
              />

            </div>

            {/* GRATITUDE */}

            <div className="form-group">

              <label className="form-label">
                🌼 Gratitude
              </label>

              <textarea
                className="form-textarea"
                rows={4}
                value={gratitude}
                onChange={(e) =>
                  setGratitude(e.target.value)
                }
                placeholder="What are you grateful for today?"
              />

            </div>

            {/* SCRIPTURE / PRAYER */}

            <div className="form-group">

              <label className="form-label">
                📖 Scripture Or Prayer
              </label>

              <textarea
                className="form-textarea"
                rows={4}
                value={scripturePrayer}
                onChange={(e) =>
                  setScripturePrayer(e.target.value)
                }
                placeholder="Favourite scripture or prayer..."
              />

            </div>

            {/* REFLECTION */}

            <div className="form-group">

              <label className="form-label">
                💭 Thoughts & Reflection *
              </label>

              <textarea
                className="form-textarea"
                rows={8}
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="How was your day?"
                required
              />

            </div>

            {/* BRAIN DUMP */}

            <div className="form-group">

              <label className="form-label">
                🧠 Brain Dump
              </label>

              <textarea
                className="form-textarea"
                rows={6}
                value={brainDump}
                onChange={(e) =>
                  setBrainDump(e.target.value)
                }
                placeholder="Write anything..."
              />

            </div>

            {/* ACTIONS */}

            <div className="journal-actions">

              {/* THIS BUTTON IS NOW INSIDE THE FORM */}

              <button
                type="submit"
                className="form-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Journal"}
              </button>

              <Link
                to="/my-journals"
                className="secondary-button"
              >
                View My Journals
              </Link>

            </div>

          </form>

        </div>

      </div>

    </section>
  );
};

export default StudentJournal;
