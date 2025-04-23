import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProfileRegisterForm from "./components/ProfileRegisterForm";
import ProfileSearchForm from "./components/ProfileSearchForm";
import ProfilePhotoUploadForm from "./components/ProfilePhotoUploadForm";
import LoginScreen from "./components/LoginScreen"; // Assuming the path to your LoginScreen
import Home from "./components/Home"; // New Home component

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="app-nav">
          <ul style={{ display: "flex", justifyContent: "center", listStyle: "none", padding: 20, backgroundColor: "#f0f0f0", borderRadius: 8 }}>
            <li style={{ marginRight: 20 }}>
              <Link to="/" style={{ textDecoration: "none", color: "#333", fontWeight: "bold", fontSize: 18 }}>Home</Link>
            </li>
            <li style={{ marginRight: 20 }}>
              <Link to="/profile-register" style={{ textDecoration: "none", color: "#333", fontWeight: "bold", fontSize: 18 }}>Register</Link>
            </li>
            <li style={{ marginRight: 20 }}>
              <Link to="/profile-search" style={{ textDecoration: "none", color: "#333", fontWeight: "bold", fontSize: 18 }}>Search</Link>
            </li>
            <li style={{ marginRight: 20 }}>
              <Link to="/upload-photo" style={{ textDecoration: "none", color: "#333", fontWeight: "bold", fontSize: 18 }}>Upload Photo</Link>
            </li>
            <li>
              <Link to="/login" style={{ textDecoration: "none", color: "#333", fontWeight: "bold", fontSize: 18 }}>Login</Link>
            </li>
          </ul>
        </nav>

        <div className="content-container" style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile-register" element={<ProfileRegisterForm />} />
            <Route path="/profile-search" element={<ProfileSearchForm />} />
            <Route path="/upload-photo" element={<ProfilePhotoUploadForm />} />
            <Route path="/login" element={<LoginScreen />} /> {/* New Login Route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;