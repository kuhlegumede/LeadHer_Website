import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Pages.css";
import "../Styles/Home.css";
//import leadherBanner from "../Assets/IMG_E1779.JPG";
import queeny from "../Assets/queeny.JPG";
import sinovuyo from "../Assets/sinovuyo.JPG";
const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 9;

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Blog`);
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error loading blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  if (loading) {
    return (
      <section className="page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading LeadHER content...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page home-page">
      
       <div className="hero-section">

    <div className="hero-left">

        <span className="hero-tag">
            Nelson Mandela University
        </span>
        <h1> Empowering Women.<br /><span>Inspiring Leaders.</span> </h1>
        <p>
  <span className="lead">Lead</span>
  <span className="her">HER</span> is a Women's Empowerment Programme dedicated to
  inspiring confidence, leadership, mentorship and lifelong
  success for every student.</p>

        <div className="hero-buttons">

            <Link to="/register" className="hero-btn">
                Join <span className="lead">Lead</span><span className="her">HER</span>
            </Link>
        </div>

    </div>

    <div className="hero-right">

        <div className="hero-card">
            
            <h4>
                A Women's Empowerment Programme
            </h4>

        </div>

    </div>

</div>
      
      <div className="leaders-section">
        <div className="section-heading">
    <span className="section-tag">✨ OUR LEADERS</span>

    <h2 className="section-title">
        Meet the Lead<span>HER Team</span>
    </h2>
    <p className="section-description">
        Dedicated women empowering future leaders through mentorship,
        innovation and community.
    </p>

    <div className="section-line"></div>
    </div>
         
         <div className="leaders-grid">
          <div className="leader-card">
            <img src={sinovuyo} alt="Sinovuyo" className="Leader 1" />
            <div className = "leader-overlay">
              <h3>Sinovuyo Mdlungu</h3>
              <p>📧 sinovuyo.mdlungu@mandela.ac.za</p>
            </div>
         </div>
         <div className="leader-card">
            <img src={queeny} alt="Queeny" className="Leader 2" />
            <div className = "leader-overlay">
              <h3>Queeny Nqikashe</h3>
              <p>📧 LFC@mandela.ac.za</p>
            </div>
         </div>
      </div>
   </div>

      <div className="page-header">
        <div className="stories-header">
          <span className="stories-tag"> 📖 STUDENT VOICES</span>
    <h2 className="stories-title">Community Stories</h2>
    <p className="stories-subtitle">
        Discover inspiring journeys, achievements and experiences shared by the
        LeadHER community.
    </p>

</div>
        <p className="page-subtitle">Discover student voices, journeys, and inspiration</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts found</h3>
          <p>Try a different search keyword</p>
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {currentBlogs.map((blog) => (
              <Link key={blog.id} to={`/blog/${blog.id}`} className="blog-card">
                <div className="blog-card-image">
                  {blog.imageUrl ? (
                    <img
                      src={`${API_URL}${blog.imageUrl}`}
                      alt={blog.title}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <span>📄</span>
                    </div>
                  )}
                </div>

                <div className="blog-card-content">
                  <h2>{blog.title}</h2>
                  <p className="blog-excerpt">
                    {blog.text?.length > 120 ? `${blog.text.slice(0, 120)}...` : blog.text}
                  </p>
                  <div className="blog-meta">
                    <span className="read-more">Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          <footer className="footer">

    <div className="footer-content">

        <div className="footer-brand">
            <h2 className = "footer-logo">
              <span className="lead">Lead</span>
              <span className = "her">HER</span>
            </h2>
            <p>Empowering women through leadership,mentorship and opportunity.</p>
        </div>

        <div className="footer-links">

            <h3>Quick Links</h3>
            <a href="/">Home</a>
            <a href="/register">Register</a>
            <a href="/login">Login</a>
        </div>

        <div className="footer-social">
            <h3>Follow Us</h3>
            <a href="https://www.facebook.com/leadher.nmu" target="_blank">👍 Facebook</a>
            <a href="https://www.instagram.com/leadher.nmu" target="_blank">📸 Instagram</a>
        </div>
    </div>

    <div className="footer-bottom">  © {new Date().getFullYear()} Nelson Mandela University LeadHER Programme</div>
</footer>
        </>
      )}
    </section>
  );
};

export default Home;
