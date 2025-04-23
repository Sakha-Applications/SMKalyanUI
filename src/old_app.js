 import React from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import ProfileRegisterForm from "./components/ProfileRegisterForm";

import ProfileSearchForm from "./components/ProfileSearchForm";

import ProfilePhotoUploadForm from "./components/ProfilePhotoUploadForm";



const HomePage = () => {

    return (

        <div style={{

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            height: "100vh",

            backgroundColor: "#f4f7f6",

        }}>

            {/* ✅ Elegant Box Container */}

            <div style={{

                width: "800px",

                backgroundColor: "#ffffff",

                padding: "30px",

                borderRadius: "12px",

                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",

                textAlign: "center",

            }}>

                {/* ✅ Title */}

                <h1 style={{ color: "#2c3e50", marginBottom: "20px" }}>Profile Management System</h1>

               

                {/* ✅ Welcome Message */}

                <p style={{

                    fontSize: "16px",

                    color: "#555",

                    lineHeight: "1.6",

                    marginBottom: "30px",

                }}>

                    Manage user profiles effortlessly! Register new users, search existing profiles, and keep everything organized with ease.

                </p>



                {/* ✅ Navigation Box */}

                <div style={{

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    backgroundColor: "#ecf0f1",

                    padding: "15px",

                    borderRadius: "10px",

                    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",

                }}>

                    {/* ✅ Register Profile */}

                    <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>

                        <Link to="/profile-register" style={{

                            textDecoration: "none",

                            color: "#2980b9",

                            fontWeight: "bold",

                            fontSize: "18px",

                        }}>Register Profile</Link>

                        <p style={{ fontSize: "12px", color: "#777", marginTop: "5px" }}>

                            Create a new profile and store details securely.

                        </p>

                    </div>



                    {/* ✅ Vertical Divider */}

                    <div style={{ width: "2px", height: "40px", backgroundColor: "#bbb" }}></div>



                    {/* ✅ Search Profile */}

                    <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>

                        <Link to="/profile-search" style={{

                            textDecoration: "none",

                            color: "#2980b9",

                            fontWeight: "bold",

                            fontSize: "18px",

                        }}>Search Profiles</Link>

                        <p style={{ fontSize: "12px", color: "#777", marginTop: "5px" }}>

                            Find and manage existing profiles quickly.

                        </p>

                    </div>

                    {/* Add the new link here */}

          <div style={{ width: "2px", height: "40px", backgroundColor: "#bbb" }}></div>

          <div style={{ flex: 1, textAlign: "center", padding: "10px" }}>

            <Link to="/upload-photo" style={{

              textDecoration: "none",

              color: "#2980b9",

              fontWeight: "bold",

              fontSize: "18px",

            }}>Upload Photo</Link>

            <p style={{ fontSize: "12px", color: "#777", marginTop: "5px" }}>Upload photos to existing profiles.</p>

          </div>

                </div>

            </div>

        </div>

    );

};



const App = () => {

    return (

        <Router>

            <Routes>

                <Route path="/" element={<HomePage />} />

                <Route path="/profile-register" element={<ProfileRegisterForm />} />

                <Route path="/profile-search" element={<ProfileSearchForm />} />

                <Route path="/upload-photo" element={<ProfilePhotoUploadForm />} /> {/* New route */}

            </Routes>

        </Router>

    );

};



export default App;