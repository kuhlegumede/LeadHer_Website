import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Pages.css";
const API_URL = import.meta.env.VITE_API_URL;

const AddEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: ""
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Title", form.title);
    data.append("Description", form.description);
    data.append("EventDate", form.eventDate);
    data.append("Location", form.location);
    if (image) data.append("Image", image);

    try {
      const res = await fetch("${API_URL}/api/Events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: data
      });

      if (!res.ok) {
        const response = await res.json();
        console.log(response);
        throw new Error(response.message || "Failed! Only Admins allowed to create events.");
     }

      alert("Event created successfully");
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("Could not create event");
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1 className="page-title">Create Event</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <input className="form-input" name="title" placeholder="Title" onChange={handleChange} required />
        <input className="form-input" type="datetime-local" name="eventDate" onChange={handleChange} required />
        <input className="form-input" name="location" placeholder="Location" onChange={handleChange} required />
        <textarea className="form-textarea" name="description" placeholder="Description" onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" className="form-button">Create Event</button>
      </form>
    </section>
  );
};

export default AddEvent;
