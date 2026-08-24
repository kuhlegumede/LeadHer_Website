import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Pages.css";
import "../Styles/Admin.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("blogs");
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalUsers: 0,
    totalComments: 0,
    totalLikes: 0
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please login to access admin panel");
      navigate("/login");
      return;
    }
    loadData();
  }, [token, navigate]);

  const loadBlogs = useCallback(async () => {
    const res = await fetch("https://localhost:7033/api/Blog", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        throw new Error("403");
      }
      throw new Error("Failed to load posts");
    }
    
    const data = await res.json();
    setBlogs(data);
    
    // Calculate stats
    const totalComments = data.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0);
    const totalLikes = data.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
    
    setStats(prev => ({
      ...prev,
      totalBlogs: data.length,
      totalComments,
      totalLikes
    }));
  }, [token]);

  const loadUsers = useCallback(async () => {
    const res = await fetch("https://localhost:7033/api/Admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        throw new Error("403");
      }
      throw new Error("Failed to load users");
    }
    
    const data = await res.json();
    console.log(data);
    setUsers(data);
    setStats(prev => ({ ...prev, totalUsers: data.length }));
  }, [token]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadBlogs(), loadUsers()]);
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.message.includes("403") || error.message.includes("401")) {
        alert("Access denied. Admin privileges required.");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }, [loadBlogs, loadUsers, navigate]);

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this posts? This action cannot be undone.")) return;

    try {
      const res = await fetch(`https://localhost:7033/api/Admin/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete post");

      setBlogs(prev => prev.filter(b => b.id !== id));
      setStats(prev => ({ ...prev, totalBlogs: prev.totalBlogs - 1 }));
      alert("✅ Post deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete post");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This will delete all their posts and comments.")) return;

    try {
      const res = await fetch(`https://localhost:7033/api/Admin/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers(prev => prev.filter(u => u.userId !== id));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      alert("✅ User deleted successfully!");
      
      // Reload blogs to update after user deletion
      await loadBlogs();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete user");
    }
  };

  const handleViewBlog = (id) => {
    navigate(`/blog/${id}`);
  };

  if (loading) {
    return (
      <section className="page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page admin-page">
      <div className="admin-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage users and content</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalBlogs}</h3>
            <p>Total Posts</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{stats.totalComments}</h3>
            <p>Total Comments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>{stats.totalLikes}</h3>
            <p>Total Likes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "blogs" ? "active" : ""}`}
          onClick={() => setActiveTab("blogs")}
        >
          Manage Posts ({blogs.length})
        </button>
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users ({users.length})
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === "blogs" && (
          <div className="admin-table-container">
            <h2>All Posts</h2>
            {blogs.length === 0 ? (
              <p className="empty-message">No posts found</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Created</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map(blog => (
                      <tr key={blog.id}>
                        <td>{blog.id}</td>
                        <td className="blog-title-cell">{blog.title}</td>
                        <td>{blog.user?.username || "Unknown"}</td>
                        <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                        <td>{blog.likes?.length || 0}</td>
                        <td>{blog.comments?.length || 0}</td>
                        <td className="action-buttons">
                          <button 
                            onClick={() => handleViewBlog(blog.id)}
                            className="admin-view-btn"
                            title="View Blog"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="admin-delete-btn"
                            title="Delete Blog"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-table-container">
            <h2>All Users</h2>
            {users.length === 0 ? (
              <p className="empty-message">No users found</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Blogs</th>
                      <th>Comments</th>
                      <th>Admin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>{user.blogs?.length || 0}</td>
                        <td>{user.comments?.length || 0}</td>
                        <td>
                          {user.isAdmin ? (
                            <span className="admin-badge">✓ Admin</span>
                          ) : (
                            <span className="user-badge">User</span>
                          )}
                        </td>
                        <td className="action-buttons">
                          <button 
                            onClick={() => handleDeleteUser(user.userId)}
                            className="admin-delete-btn"
                            disabled={user.isAdmin}
                            title={user.isAdmin ? "Cannot delete admin" : "Delete User"}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;