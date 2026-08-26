import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Pages.css";
const API_URL = import.meta.env.VITE_API_URL;

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      alert("Please fill in all required fields!");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("text", text);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${API_URL}/api/Blog`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      if (!res.ok) {
        let errorMessage = "Failed to create post.";
        const responseText = await res.text();
        try{
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.title || errorData.detail || errorData.message || JSON.stringify(errorData);
        }
        catch{
          errorMessage = responseText;
          errorMessage = errorMessage.substring(0,150) + '';
        }
        console.error("API Error Response: ",responseText);
        throw new Error(errorMessage);
      }

      setTitle("");
      setText("");
      setImage(null);
      setImagePreview(null);
      alert("✅ Post published successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("❌ " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Create New Post</h1>
        <p className="page-subtitle">Share your thoughts with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label">Post Title </label>
          <input
            type="text"
            placeholder="Enter an engaging title..."
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
          <small className="form-hint">{title.length}/100 characters</small>
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="form-input-file"
          />
          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="preview" className="preview-img" />
              <button 
                type="button" 
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="remove-image-btn"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Content </label>
          <textarea
            placeholder="Write your story here..."
            className="form-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate("/")} 
            className="form-button-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="form-button">
            {saving ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddBlog;
