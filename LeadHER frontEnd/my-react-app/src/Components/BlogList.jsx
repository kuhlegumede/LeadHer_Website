import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Pages.css";
import "../Styles/BlogList.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadBlogs = useCallback(async () => {
    try {
      const res = await fetch("https://localhost:7033/api/Blog", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (!res.ok) throw new Error("Failed to load posts");

      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load your posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  if (loading) {
    return (
      <section className="page">
        <div className="loading-spinner">
          <p>Loading your posts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">My Posts</h1>
        <p className="page-subtitle">Manage your posts from your private menu</p>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
        </div>
      ) : (
        <div className = "blog-wrap">
        <div className="manage-blogs-container">
          {blogs.map((blog) => (
            <div key={blog.id} className="manage-blog-card">
              <h2>{blog.title}</h2>
              <p className="blog-preview">
              {blog.text?.slice(0, 170)}
              {blog.text?.length > 170 && "..."}
              </p>
              <div className="blog-card-actions">
                <button onClick={() => navigate(`/blog/${blog.id}`)} className="view-btn">View</button>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
    </section>
  );
};

export default BlogList;
