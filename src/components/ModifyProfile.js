// /frontend/src/components/ModifyProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Tabs, Tab, Paper, Typography, Box, TextField, Button } from "@mui/material";
import useFormData from "../hooks/useFormData";
import ModifyProfileBasicDetailsTab from "./ModifyProfile/ModifyProfileBasicDetailsTab";
import ModifyProfilePersonalInfoTab from "./ModifyProfile/ModifyProfilePersonalInfoTab";
import ModifyProfileContactDetailsTab from "./ModifyProfile/ModifyProfileContactDetailsTab";
import ModifyProfileFamilyDetailsTab from "./ModifyProfile/ModifyProfileFamilyDetailsTab";
import ModifyProfileCareerEducationTab from "./ModifyProfile/ModifyProfileCareerEducationTab";
import axios from "axios";

const ModifyProfile = () => {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    const tabLabels = ["Basic Details", "Personal Info", "Contact Details", "Family Details", "Career & Education"];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileId, setProfileId] = useState("");
    const [email, setEmail] = useState("");

    const { formData, setFormData, handleChange, handleDOBChange, handleTimeBlur } = useFormData();

    // Define fetchUserProfile outside the useEffect
    const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);
        console.log("ModifyProfile: fetchUserProfile started");

        try {
            const loggedInEmail = localStorage.getItem('userEmail');
            console.log("ModifyProfile: loggedInEmail from localStorage:", loggedInEmail);

            if (!loggedInEmail) {
                console.log("ModifyProfile: User email not found in localStorage.");
                setError("User not logged in.");
                setLoading(false);
                return;
            }

            // Get the authentication token
            const token = sessionStorage.getItem('token');
            console.log("ModifyProfile: Token from SessionStorage:", token);

            if (!token) {
                console.log("ModifyProfile: Authentication token NOT found in localStorage.");
                setError("Authentication token not found. Please log in again.");
                setLoading(false);
                return;
            }

            console.log("ModifyProfile: Token found, proceeding with API call...");
            const response = await axios.get(`https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//modifyProfile`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Send the token
                },
            });

            console.log("ModifyProfile: Response from /api/modifyProfile:", response.data);

            if (response.data) {
                setFormData(response.data);
                setProfileId(response.data.profile_id);
                setEmail(loggedInEmail); // Use the email from localStorage
            } else {
                console.log("ModifyProfile: Failed to fetch profile data - empty response.");
                setError("Failed to fetch profile data.");
            }
        } catch (err) {
            console.error("ModifyProfile: Error fetching profile:", err);
            setError("Failed to fetch profile data.");
        } finally {
            setLoading(false);
            console.log("ModifyProfile: fetchUserProfile finished");
        }
    };

    useEffect(() => {
        console.log("ModifyProfile: useEffect triggered");
        fetchUserProfile();
    }, []);

    const handleUpdate = async () => {
        setLoading(true);
        setError(null);
        console.log("ModifyProfile: handleUpdate started");
        console.log("ModifyProfile: formData being sent for update:", formData);

        // Get the authentication token
        const token = sessionStorage.getItem('token');
        console.log("ModifyProfile: Token from SessionStorage (in handleUpdate):", token);

        if (!token) {
            console.log("ModifyProfile: Authentication token NOT found in localStorage (in handleUpdate).");
            setError("Authentication token not found. Please log in again.");
            setLoading(false);
            return;
        }

        console.log("ModifyProfile: Token found, proceeding with update API call...");
        try {
            // Format the DOB explicitly before sending
            const updatedFormData = { ...formData };
            if (updatedFormData.dob) {
                if (updatedFormData.dob instanceof Date) {
                    const year = updatedFormData.dob.getFullYear();
                    const month = String(updatedFormData.dob.getMonth() + 1).padStart(2, '0');
                    const day = String(updatedFormData.dob.getDate()).padStart(2, '0');
                    updatedFormData.dob = `${year}-${month}-${day}`;
                } else if (typeof updatedFormData.dob === 'string' && updatedFormData.dob.includes('T')) {
                    updatedFormData.dob = updatedFormData.dob.split('T')[0];
                }
            }

            const response = await axios.put(`https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//modifyProfile`, updatedFormData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log("ModifyProfile: Response from update:", response);
            alert("Profile updated successfully!");
            navigate('/dashboard'); // Go back to the dashboard
        } catch (err) {
            console.error("ModifyProfile: Error updating profile:", err);
            setError("Failed to update profile.");
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
            console.log("ModifyProfile: handleUpdate finished");
        }
    };

    if (loading) {
        return <Typography variant="h6" align="center">Loading your profile...</Typography>;
    }

    if (error) {
        return <Typography color="error" align="center">{error}</Typography>;
    }

    return (
        <div className="bg-gray-50 font-sans antialiased min-h-screen">
            <nav className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link to="/" className="text-xl font-bold text-indigo-700">
                        Modify Profile
                    </Link>
                    <div>
                        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-500">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="py-16">
                <div className="container mx-auto px-6">
                    <Paper elevation={3} sx={{ maxWidth: "80%", mx: "auto", p: 3, mt: 4, backgroundColor: "#f9f9f9" }}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Modify Your Profile
                        </Typography>

                        {/* Non-editable Profile ID and Email */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <TextField
                                label="Profile ID"
                                value={profileId}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                            <TextField
                                label="Email"
                                value={email}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                            />
                        </Box>

                        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} variant="fullWidth">
                            {tabLabels.map((label, index) => <Tab key={index} label={label} />)}
                        </Tabs>

                        <Box sx={{ mt: 2 }}>
                            {tabIndex === 0 && (
                                <ModifyProfileBasicDetailsTab
                                    formData={formData}
                                    handleChange={handleChange}
                                    tabIndex={tabIndex}
                                    setTabIndex={setTabIndex}
                                />
                            )}
                            {tabIndex === 1 && (
                                <ModifyProfilePersonalInfoTab
                                    formData={formData}
                                    setFormData={setFormData}
                                    handleChange={handleChange}
                                    handleDOBChange={handleDOBChange}
                                    handleTimeBlur={handleTimeBlur}
                                    tabIndex={tabIndex}
                                    setTabIndex={setTabIndex}
                                />
                            )}
                            {tabIndex === 2 && (
                                <ModifyProfileContactDetailsTab
                                    formData={formData}
                                    handleChange={handleChange}
                                    isActive={true}
                                    tabIndex={tabIndex}
                                    setTabIndex={setTabIndex}
                                />
                            )}
                            {tabIndex === 3 && (
                                <ModifyProfileFamilyDetailsTab
                                    formData={formData}
                                    handleChange={handleChange}
                                    isActive={true}
                                    tabIndex={tabIndex}
                                    setTabIndex={setTabIndex}
                                />
                            )}
                            {tabIndex === 4 && (
                                <ModifyProfileCareerEducationTab
                                    formData={formData}
                                    handleChange={handleChange}
                                    isActive={true}
                                    tabIndex={tabIndex}
                                    setTabIndex={setTabIndex}
                                    handleSubmit={handleUpdate} // Keep handleSubmit here for the final tab
                                />
                            )}
                        </Box>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="primary" onClick={handleUpdate} disabled={loading}>
                                {loading ? "Updating..." : "Update Profile"}
                            </Button>
                        </Box>
                    </Paper>
                </div>
            </section>

            <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm">
                <div className="container mx-auto px-6">
                    <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ModifyProfile;