import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
    Tabs,
    Tab,
    Paper,
    Typography,
    Box,
    Button // Import Button from MUI if you want to style tab buttons
} from "@mui/material";
import BasicDetailsTab from "./BasicDetailsTab";
import PersonalInfoTab from "./PersonalInfoTab";
import ContactDetailsTab from "./ContactDetailsTab";
import FamilyDetailsTab from "./FamilyDetailsTab";
import CareerEducationTab from "./CareerEducationTab";
import useFormData from "../hooks/useFormData";
import axios from "axios";

const ProfileDetails = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const tabLabels = [
        "Basic Details",
        "Personal Info",
        "Contact Details",
        "Family Details",
        "Career & Education",
    ];

    const { formData, setFormData, handleChange, handleDOBChange, handleTimeBlur } =
        useFormData();

    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async () => {
        // Validation (as before)
        if (!/^\d{10}$/.test(formData.phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        if (!formData.dob) {
            alert("Date of Birth is mandatory.");
            setTabIndex(1);
            return;
        }

        try {
            const userLoginData = {
                profileId: formData.profileId,
                user_id: formData.email ? formData.email : formData.phone,
                password: generateRandomPassword(),
            };

            const response = await axios.post(
                "http://localhost:3001/api/addProfile",
                {
                    profileData: formData,
                    userLoginData: userLoginData,
                }
            );

            const { profileId, userId: newUserId, password: newPassword } =
                response.data;

            alert(
                `Profile created successfully!\nProfile ID: ${profileId}\nUser ID: ${newUserId}\nPassword: ${newPassword}`
            );

            // --- Trigger email sending after the alert is closed ---
            try {
                const emailResponse = await axios.post(
                    "http://localhost:3001/api/send-email", // Replace with your actual email sending API endpoint
                    {
                        email: formData.email, // Ensure formData.email is correct
                        profileId: profileId, // Send the profile ID in the email body if needed
                        userId: newUserId,
                        password: newPassword,
                        // You can add other relevant information here
                    }
                );

                if (emailResponse.status === 200) {
                    alert('Confirmation email sent successfully!');
                } else {
                    alert('Failed to send confirmation email.');
                    console.error('Failed to send confirmation email:', emailResponse);
                }
            } catch (error) {
                alert('Error sending email.');
                console.error('Error sending email:', error);
            }

            // Reset form data (as before)
            setFormData({
                id: 0,
                profileId: "",
                name: "",
                profileCreatedFor: "",
                profileFor: "",
                motherTongue: "",
                nativePlace: "",
                currentLocation: "",
                profileStatus: "",
                marriedStatus: "",
                gotra: "",
                guruMatha: "",
                dob: null,
                timeOfBirth: "",
                currentAge: 0,
                subCaste: "",
                rashi: "",
                height: 0,
                nakshatra: "",
                charanaPada: "",
                email: "",
                phone: "",
                alternatePhone: "",
                communicationAddress: "",
                residenceAddress: "",
                fatherName: "",
                fatherProfession: "",
                motherName: "",
                motherProfession: "",
                expectations: "",
                siblings: "",
                workingStatus: "",
                education: "",
                profession: "",
                designation: "",
                currentCompany: "",
                annualIncome: 0,
                profileCategory: "",
                profileCategoryneed: "",
            });
            setTabIndex(0);
            navigate('/'); // Redirect to the home page
        } catch (error) {
            alert("Failed to create profile.");
            console.error("Error submitting form:", error);
        }
    };

    const generateRandomPassword = (length = 10) => {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return password;
    };

    return (
        <div className="bg-gray-50 font-sans antialiased min-h-screen">
            {/* Navigation (Optional, if you want a nav bar here) */}
            <nav className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link to="/" className="text-xl font-bold text-indigo-700">
                        Profile Registration
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto py-12 px-6">
                <Paper
                    elevation={3}
                    className="rounded-lg shadow-xl p-8 bg-white"
                >
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        className="text-2xl font-semibold text-gray-800 mb-8"
                    >
                        Register Your Profile
                    </Typography>

                    <Tabs
                        value={tabIndex}
                        onChange={(e, newIndex) => setTabIndex(newIndex)}
                        variant="fullWidth"
                        className="mb-6"
                    >
                        {tabLabels.map((label, index) => (
                            <Tab
                                key={index}
                                label={label}
                                className="text-gray-700 hover:text-indigo-500"
                            />
                        ))}
                    </Tabs>

                    {/* Tab Content */}
                    <Box>
                        {tabIndex === 0 && (
                            <BasicDetailsTab
                                formData={formData}
                                handleChange={handleChange}
                                tabIndex={tabIndex}
                                setTabIndex={setTabIndex}
                            />
                        )}
                        {tabIndex === 1 && (
                            <PersonalInfoTab
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
                            <ContactDetailsTab
                                formData={formData}
                                handleChange={handleChange}
                                isActive={true}
                                tabIndex={tabIndex}
                                setTabIndex={setTabIndex}
                            />
                        )}
                        {tabIndex === 3 && (
                            <FamilyDetailsTab
                                formData={formData}
                                handleChange={handleChange}
                                isActive={true}
                                tabIndex={tabIndex}
                                setTabIndex={setTabIndex}
                            />
                        )}
                        {tabIndex === 4 && (
                            <CareerEducationTab
                                formData={formData}
                                handleChange={handleChange}
                                isActive={true}
                                tabIndex={tabIndex}
                                setTabIndex={setTabIndex}
                                handleSubmit={handleSubmit}
                            />
                        )}
                    </Box>
                </Paper>
            </div>

            {/* Footer (Optional, if you want a footer here) */}
            <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-12">
                <div className="container mx-auto px-6">
                    <p>&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ProfileDetails;
