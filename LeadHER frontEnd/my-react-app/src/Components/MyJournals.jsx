import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/Journal.css";
const API_URL = import.meta.env.VITE_API_URL;

const MyJournals = () => {
  const res = await fetch(`${API_URL}/api/Journal`;
  const token = localStorage.getItem("token");

  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const journalsPerPage = 6;

  const loadJournals = async () => {
    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error("Your session has expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error("Unable to load your journals.");
      }

      const data = await response.json();

      setJournals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournals();
  }, []);

  const filteredJournals = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return journals;
    }

    return journals.filter((journal) => {
      return (
        (journal.title || "")
          .toLowerCase()
          .includes(searchTerm) ||

        (journal.content || "")
          .toLowerCase()
          .includes(searchTerm) ||

        (journal.gratitude || "")
          .toLowerCase()
          .includes(searchTerm) ||

        (journal.scripturePrayer || "")
          .toLowerCase()
          .includes(searchTerm) ||

        (journal.brainDump || "")
          .toLowerCase()
          .includes(searchTerm)
      );
    });
  }, [journals, search]);

  const totalPages = Math.ceil(
    filteredJournals.length / journalsPerPage
  );

  const currentJournals = useMemo(() => {
    const start =
      (currentPage - 1) * journalsPerPage;

    return filteredJournals.slice(
      start,
      start + journalsPerPage
    );
  }, [filteredJournals, currentPage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const deleteJournal = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this journal entry?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      if (response.status === 404) {
        throw new Error(
          "Journal entry was not found."
        );
      }

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Unable to delete journal."
        );
      }

      // Remove the deleted journal immediately
      setJournals((previous) =>
        previous.filter(
          (journal) => journal.id !== id
        )
      );

      // If the current page becomes empty,
      // move back one page.
      setCurrentPage((page) => {
        const remaining =
          filteredJournals.length - 1;

        const newTotalPages = Math.max(
          1,
          Math.ceil(
            remaining / journalsPerPage
          )
        );

        return Math.min(page, newTotalPages);
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(
      "en-ZA",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  if (loading) {
    return (
      <section className="page">
        <div className="journal-loading">
          <div className="journal-spinner"></div>
          <p>Loading your journals...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="journal-error">
          <div className="error-icon">!</div>

          <h2>Unable to Load Journals</h2>

          <p>{error}</p>

          <div className="error-actions">
            <button
              className="journal-primary-button"
              onClick={loadJournals}
            >
              Try Again
            </button>

            <Link
              to="/journal"
              className="journal-secondary-button"
            >
              Back to Journal
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="my-journals-page">

        {/* HEADER */}
        <div className="journals-header">

          <div className="journals-heading">

            <div>
              <h1>My Journals</h1>

              <p>
                Your personal space for reflections,
                gratitude, prayers and thoughts.
              </p>
            </div>

          </div>

          <Link
            to="/journal"
            className="back-button"
          >
            ← Back to Journal
          </Link>

        </div>

        {/* SEARCH + COUNT */}
        <div className="journals-toolbar">

          <div className="search-wrapper">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              className="journal-search"
              placeholder="Search your journals..."
              value={search}
              onChange={handleSearch}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

          <div className="journal-count">
            {filteredJournals.length}{" "}
            {filteredJournals.length === 1
              ? "Journal"
              : "Journals"}
          </div>

        </div>

        {/* EMPTY STATE */}
        {filteredJournals.length === 0 ? (

          <div className="empty-journals">

            <div className="empty-icon">
              📖
            </div>

            {search ? (
              <>
                <h2>No Journals Found</h2>

                <p>
                  No journal entries match "{search}".
                </p>

                <button
                  className="journal-primary-button"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <h2>Your Journal is Empty</h2>

                <p>
                  Start documenting your thoughts,
                  gratitude and reflections.
                </p>

                <Link
                  to="/journal"
                  className="journal-primary-button"
                >
                  Write Your First Journal
                </Link>
              </>
            )}

          </div>

        ) : (

          <>
            {/* JOURNAL GRID */}
            <div className="journals-grid">

              {currentJournals.map((journal) => (

                <article
                  className="journal-history-card"
                  key={journal.id}
                >

                  {/* CARD HEADER */}
                  <div className="journal-card-top">

                    <div className="journal-card-date">

                      <span className="date-icon">
                        📅
                      </span>

                      <div>
                        <span className="date-text">
                          {formatDate(
                            journal.createdAt
                          )}
                        </span>

                        <span className="time-text">
                          {formatTime(
                            journal.createdAt
                          )}
                        </span>
                      </div>

                    </div>
                  <button
                   className="delete-journal-button"
                     onClick={() => deleteJournal(journal.id)}
                     disabled={deletingId === journal.id}
                     title="Delete journal"
                     aria-label="Delete journal entry">
                     {deletingId === journal.id ? (
                 <>
                     <span className="delete-spinner"></span>
                      Deleting...
                 </>
                     ) : (
                  <>
                    <span className="delete-icon">🗑️</span>
                     Delete
                 </>
                     )}
                </button>
                  </div>
                  {/* TITLE */}
                  <h2 className="journal-card-title">
                    {journal.title}
                  </h2>
                  {/* GRATITUDE */}
                  {journal.gratitude && (
                    <div className="journal-preview-section">
                      <h4>🌼 Gratitude</h4>

                      <p>
                        {journal.gratitude}
                      </p>
                    </div>
                  )}

                  {/* SCRIPTURE */}
                  {journal.scripturePrayer && (
                    <div className="journal-preview-section">
                      <h4>📖 Scripture / Prayer</h4>

                      <p>
                        {journal.scripturePrayer}
                      </p>
                    </div>
                  )}

                  {/* REFLECTION */}
                  <div className="journal-preview-section">
                    <h4>
                      💭 Thoughts & Reflection
                    </h4>

                    <p>
                      {journal.content}
                    </p>
                  </div>

                  {/* BRAIN DUMP */}
                  {journal.brainDump && (
                    <div className="journal-preview-section">
                      <h4>🧠 Brain Dump</h4>

                      <p>
                        {journal.brainDump}
                      </p>
                    </div>
                  )}

                </article>

              ))}

            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="journal-pagination">

                <button
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      currentPage - 1
                    )
                  }
                >
                  ← Previous
                </button>

                <div className="pagination-numbers">

                  {Array.from(
                    { length: totalPages },
                    (_, index) => {
                      const pageNumber =
                        index + 1;

                      return (
                        <button
                          key={pageNumber}
                          className={`pagination-number ${
                            currentPage ===
                            pageNumber
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentPage(
                              pageNumber
                            )
                          }
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                </div>

                <button
                  className="pagination-button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage + 1
                    )
                  }
                >
                  Next →
                </button>

              </div>
            )}

          </>
        )}

      </div>
    </section>
  );
};

export default MyJournals;
