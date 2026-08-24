import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/Pages.css";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const token = localStorage.getItem("token");

  const loadBlog = useCallback(async () => {
    try {
      const res = await fetch(`https://localhost:7033/api/Blog/${id}`);
      const data = await res.json();
      console.log(data.images);
      setBlog(data);
      setLikeCount(data.likes?.length || 0);
      
      if (token && data.likes) {
        setLiked(false); 
      }
    } catch (error) {
      console.error("Error loading post:", error);
      alert("Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`https://localhost:7033/api/Comment/${id}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }, [id]);

  useEffect(() => {
    loadBlog();
    loadComments();
  }, [loadBlog, loadComments]);

  const handleLike = async () => {
    if (!token) {
      alert("Please login to like this post");
      navigate("/login");
      return;
    }

    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`https://localhost:7033/api/Like/${id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Failed to update like");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to comment");
      navigate("/login");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch("https://localhost:7033/api/Comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: newComment,
          blogId: parseInt(id)
        })
      });

      if (res.ok) {
        const newCommentData = await res.json();
        setComments(prev => [newCommentData, ...prev]);
        setNewComment("");
        alert("✅ Comment added!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <section className="page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading post...</p>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="page">
        <div className="empty-state">
          <h3>Post not found</h3>
          <button onClick={() => navigate("/")} className="cta-button">
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="blog-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <article className="blog-detail">
          <h1 className="blog-detail-title">{blog.title}</h1>
          
          <div className="blog-detail-meta">
            <span className="blog-author">By {blog.user?.username|| "Anonymous"}</span>
            <span className="blog-date">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </div>

          <div className="blog-main-content">
            <div className="blog-detail-image">
            {blog.images && (
              <img 
                src = {`https://localhost:7033/${blog.images}`}
                alt = {blog.title}
                />
            )}
          </div>

          <div className="blog-detail-content">
            <p>{blog.text}</p>
          </div>
      </div>
          <div className="blog-interactions">
            <button 
              onClick={handleLike} 
              className={`like-button ${liked ? "liked" : ""}`}
            >
              {liked ? "❤️" : "🤍"} {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </button>
            <span className="comment-count">💬 {comments.length} Comments</span>
          </div>
        </article>

        <div className="comments-section">
          <h2>Comments</h2>

          {token ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="comment-input"
              />
              <button type="submit" className="comment-submit-btn">
                Post Comment
              </button>
            </form>
          ) : (
            <div className="login-prompt">
              <p>Please <button onClick={() => navigate("/login")} className="link-button">login</button> to comment</p>
            </div>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-author">{comment.user?.username || "Anonymous"}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;