import React, { useState } from "react";
import { addUser } from "../services/api";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserForm = ({ refreshUsers }) => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addUser({ name, age, email, phone });
            refreshUsers();
            setName(""); setAge(""); setEmail(""); setPhone("");
        } catch (error) {
            console.error("Error adding user", error);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 450, margin: "auto", backgroundColor: "#fafafa" }}>
            <Typography variant="h6" align="center" sx={{ color: "#283593" }}>User Registration</Typography>
            <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ width: "30%", background: "#283593", color: "#fff", padding: 1, borderRadius: 1, textAlign: "center" }}>
                        Name
                    </Box>
                    <TextField 
                        sx={{ width: "70%", background: "#f5f5f5", input: { color: "#000" } }}
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </Box>

                {/* Age Field */}
                <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ width: "30%", background: "#283593", color: "#fff", padding: 1, borderRadius: 1, textAlign: "center" }}>
                        Age
                    </Box>
                    <TextField 
                        sx={{ width: "70%", background: "#f5f5f5", input: { color: "#000" } }}
                        type="number"
                        value={age} 
                        onChange={(e) => setAge(e.target.value)} 
                        required 
                    />
                </Box>

                {/* Email Field */}
                <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ width: "30%", background: "#283593", color: "#fff", padding: 1, borderRadius: 1, textAlign: "center" }}>
                        Email
                    </Box>
                    <TextField 
                        sx={{ width: "70%", background: "#f5f5f5", input: { color: "#000" } }}
                        type="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </Box>

                {/* Phone Field */}
                <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ width: "30%", background: "#283593", color: "#fff", padding: 1, borderRadius: 1, textAlign: "center" }}>
                        Phone
                    </Box>
                    <TextField 
                        sx={{ width: "70%", background: "#f5f5f5", input: { color: "#000" } }}
                        type="tel"
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                </Box>

                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Add User
                    </Button>
                </Box>
            </form>

            <Box mt={2}>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    fullWidth 
                    onClick={() => navigate("/profile-register")}
                >
                    Profile Register
                </Button>
            </Box>
        </Paper>
    );
};

export default UserForm;
