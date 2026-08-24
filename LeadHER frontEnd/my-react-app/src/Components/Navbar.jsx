import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";
import { Button } from "bootstrap";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <header className="nav-header">
      <nav className="nav-container">
        <Link to="/" className="nav-logo">
          Lead<span>HER</span>
        </Link>

        {/* <ul className="nav-list">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/events" className="nav-link">Events</Link></li>
        </ul> */}

        <div className="auth-buttons">
          {!token ? (
            <>
              <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
              <button className="login-btn" onClick={() => navigate("/register")}>Register</button>
            </>
          ) : (
            <div className="user-menu-wrapper">
              <button className="user-menu-btn" onClick={() => setShowMenu(!showMenu)}>
                Hi, {username}
              </button>

              {showMenu && (
                <div className="user-dropdown">
                  <button onClick={() => navigate("/")}>Home</button>
                  <button onClick={() => navigate("/events")}>Events</button>
                  <button onClick={() => navigate("/journal")}>Journal</button>
                  <button onClick={() => navigate("/my-blogs")}>My Blogs</button>
                  <button onClick={() => navigate("/create-blog")}>New Blog</button>
                  <button onClick={() => navigate("/create-event")}>New Event</button>
                  {isAdmin && <button onClick={() => navigate("/admin")}>Admin Dashboard</button>}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
