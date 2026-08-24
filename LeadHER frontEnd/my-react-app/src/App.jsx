import React, {useEffect} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import AddBlog from "./Components/AddBlog";
import BlogList from "./Components/BlogList";
import BlogDetails from "./Components/BlogDetails";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminDashboard from "./Components/AdminDashboard";
import ForgotPassword from "./Components/ForgotPassword";
import EventsList from "./Components/EventsList";
import AddEvent from "./Components/AddEvent";
import EventDetails from "./Components/EventDetails";
import Events from "./Components/Events";
import StudentJournal from "./Components/StudentJournal";
import MyJournals from "./Components/MyJournals";
import { isSessionExpired, logout } from "./Utils/Auth";
import "./Styles/App.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};
 

function App() {
  
  useEffect(() => {
  //Check if session has already expired.
  if(isSessionExpired()){
    logout();
    return;
  } 

  //Start a timer to log the user out when the session expires.
 const expiresAt = Number(localStorage.getItem("expiresAt"));
  
  if(!expiresAt)return; 

  const remaining = expiresAt - Date.now();
  const timer = setTimeout(() =>{
    alert("Your session has expired. Please login again.");
    logout();
  }, remaining);

  return () => clearTimeout(timer);
}, []);

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route
            path="/my-blogs"
            element={
              <ProtectedRoute>
                <BlogList />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="event-list"
            element={
              <ProtectedRoute>
                <EventsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-blog"
            element={
              <ProtectedRoute>
                <AddBlog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <AddEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <StudentJournal />
              </ProtectedRoute>
            }
          />

          <Route
           path="/my-journals"
           element = {<MyJournals/>}
           />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
