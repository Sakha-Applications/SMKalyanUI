import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import ProfileRegisterForm from "./components/ProfileRegisterForm";
import ProfileSearchForm from "./components/ProfileSearchForm";
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
        <Router>  {/* ✅ Wrap everything inside Router */}
            <Routes>
                <Route path="/" element={
                    <div>
                        <h2>User Form</h2>
                        <UserForm refreshUsers={refreshUsers} />  {/* ✅ Pass refreshUsers */}
                        <h2>Users List</h2>
                        <UserList users={users} isLoading={isLoading} />
                    </div>
                } />
                <Route path="/profile-register" element={<ProfileRegisterForm />} />
            </Routes>
        </Router>
    );
};

export default App;

