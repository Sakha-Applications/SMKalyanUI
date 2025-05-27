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
import PersonalInfoTab from "./PersonalInfoTab"; // Assuming this path
import ContactDetailsTab from "./ContactDetailsTab"; // Assuming this path
import FamilyDetailsTab from "./FamilyDetailsTab"; // Assuming this path
import CareerEducationTab from "./CareerEducationTab"; // Assuming this path
import useFormData from "../hooks/useFormData";
import axios from "axios";
import getBaseUrl from '../utils/GetUrl';

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

            console.log("Submitting profile data:", { profileData: formData, userLoginData: userLoginData }); // Debug client-side

            const response = await axios.post(
                `${getBaseUrl()}/api/addProfile`,
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
                const emailPayload = {
                    email: formData.email, // Ensure formData.email is correct
                    profileId: profileId, // Send the profile ID in the email body if needed
                    userId: newUserId,
                    password: newPassword,
                    // You can add other relevant information here
                };

                console.log("Attempting to send email with payload:", emailPayload); // Debug client-side
                console.log("Email API Endpoint:", `${getBaseUrl()}/api/send-email`); // Debug client-side

                const emailResponse = await axios.post(
                    `${getBaseUrl()}/api/send-email`, // Corrected path: removed double slash
                    emailPayload
                );

                console.log("Email API Response Status:", emailResponse.status); // Debug client-side
                console.log("Email API Response Data:", emailResponse.data); // Debug client-side

                if (emailResponse.status === 200) {
                    alert('Confirmation email sent successfully!');
                } else {
                    alert('Failed to send confirmation email. Check console for details.');
                    console.error('Failed to send confirmation email:', emailResponse);
                }
            } catch (error) {
                alert('Error sending email. Check console for details.');
                // Log more detailed error response from server if available
                console.error('Error sending email:', error.response ? error.response.data : error.message);
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
                 // ADD THIS NEW FIELD
                placeOfBirth: "", // Initialize placeOfBirth
                currentAge: 0,
                subCaste: "",
                rashi: "",
                height: 0,
                nakshatra: "",
                charanaPada: "",
                // ADD THIS NEW FIELD
                howDidYouKnow: "", // Initialize howDidYouKnow
                email: "",
                phone: "",
                alternatePhone: "",
                communicationAddress: "",
                residenceAddress: "",
                fatherName: "",
                fatherProfession: "",
                motherName: "",
                motherProfession: "",
                aboutBrideGroom: "", // Initialize aboutBrideGroom
                expectations: "",
                 // ADD THESE NEW FIELDS FOR REFERENCE 1 and 2
                reference1Name: "",
                reference1PhonePhoneNumber: "",
                reference2NamePhoneNumber: "",
                reference2Phone: "",
                siblings: "",
                workingStatus: "",
                education: "",
                profession: "",
                designation: "",
                currentCompany: "",
                annualIncome: 0,
                profileCategory: "",
                profileCategoryneed: "",
                 // Add this new field here, with a default value if desired (e.g., "Yes")
        shareDetailsOnPlatform: "Yes", // <--- ADD THIS LINE
            });
            setTabIndex(0);
            navigate('/'); // Redirect to the home page
        } catch (error) {
            alert("Failed to create profile. Check console for details.");
            console.error("Error submitting form (profile creation):", error.response ? error.response.data : error.message);
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