import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import ProfileRegisterForm from "./components/ProfileRegisterForm";
import ProfileSearchForm from "./components/ProfileSearchForm";  // ✅ Make sure this file exists
import { getUsers } from "./services/api";

const App = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getUsers();
            setUsers(response?.data || []);
        } catch (error) {
            console.error("Error fetching users", error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    return (
        <Router>  
            <div>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Profile Management System</h1>

                {/* ✅ Navigation Links */}
                <nav style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Link to="/" style={{ margin: "0 15px" }}>User Form</Link>
                    <Link to="/profile-register" style={{ margin: "0 15px" }}>Register Profile</Link>
                    <Link to="/profile-search" style={{ margin: "0 15px" }}>Search Profiles</Link>
                </nav>

                <Routes>
                    <Route path="/" element={
                        <div>
                            <h2>User Form</h2>
                            <UserForm refreshUsers={refreshUsers} />
                            <h2>Users List</h2>
                            <UserList users={users} isLoading={isLoading} />
                        </div>
                    } />
                    <Route path="/profile-register" element={<ProfileRegisterForm />} />
                    <Route path="/profile-search" element={<ProfileSearchForm />} />  {/* ✅ This is now correctly used */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;


