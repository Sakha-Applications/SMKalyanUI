import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {
    Tabs,
    Tab,
    Paper,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import BasicDetailsTab from "./BasicDetailsTab";
import PersonalInfoTab from "./PersonalInfoTab";
import ContactDetailsTab from "./ContactDetailsTab";
import FamilyDetailsTab from "./FamilyDetailsTab";
import CareerEducationTab from "./CareerEducationTab";
import useFormData from "../hooks/useFormData";
import axios from "axios";
import getBaseUrl from '../utils/GetUrl';

const ProfileDetails = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [showDonationDialog, setShowDonationDialog] = useState(false);
    const [profileCreationData, setProfileCreationData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const tabLabels = [
        "Basic Details",
        "Personal Info",
        "Contact Details",
        "Family Details",
        "Career & Education",
    ];

    const { formData, setFormData, handleChange, handleDOBChange, handleTimeBlur } = useFormData();
    const navigate = useNavigate();

    // Auto-login function
    const autoLoginUser = async (userId, password) => {
        try {
            console.log("🔐 Attempting auto-login for user:", userId);
            
            const loginResponse = await axios.post(`${getBaseUrl()}/api/login`, {
                userId: userId,
                password: password
            });

            if (loginResponse.data.token) {
                console.log("✅ Auto-login successful:", loginResponse.data);
                
                // Store tokens and user info in session/local storage
                sessionStorage.setItem("token", loginResponse.data.token);
                sessionStorage.setItem("isLoggedIn", "true");
                if (loginResponse.data.user && loginResponse.data.user.email) {
                    localStorage.setItem("userEmail", loginResponse.data.user.email);
                    localStorage.setItem("userProfileId", loginResponse.data.user.profile_id);
                    localStorage.setItem("userRole", loginResponse.data.user.role);
                    localStorage.setItem("userStatus", loginResponse.data.user.is_active);
                }
                
                console.log("✅ Login tokens stored successfully");
                return true; // Return success status
            } else {
                console.error("❌ Auto-login failed: No token received.");
                return false;
            }
        } catch (autoLoginError) {
            console.error("❌ Error during auto-login:", autoLoginError);
            return false;
        }
    };

    const sendEmailToUser = async (profileId, email) => {
        try {
            const emailPayload = {
                email: email,
                profileId: profileId,
            };

            console.log("📧 Sending email with payload:", emailPayload);
            const emailResponse = await axios.post(
                `${getBaseUrl()}/api/send-email`,
                emailPayload
            );

            if (emailResponse.status === 200) {
                console.log('✅ Email sent successfully!');
                return true;
            } else {
                console.log('⚠️ Failed to send email.');
                return false;
            }
        } catch (emailError) {
            console.log('⚠️ Email service not available.');
            console.error('Error sending email:', emailError.response?.data || emailError.message);
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!formData.dob) {
            alert("Date of Birth is mandatory.");
            setTabIndex(1);
            return;
        }

        setIsProcessing(true);

        const password = generateRandomPassword();
        const userLoginData = {
            profileId: formData.profileId,
            user_id: formData.email || formData.phone,
            password: password,
            role: 'USER',
            is_active: 'Yes',
            notes: ''
        };

        try {
            console.log("➡️ Step 1: Creating profile...");
            console.log("Sending profile data:", { profileData: formData });

            // STEP 1: Create profile
            const profileResponse = await axios.post(
                `${getBaseUrl()}/api/addProfile`,
                { profileData: formData }
            );

            const { profileId } = profileResponse.data;
            console.log("✅ Step 1 Complete: Profile created successfully:", profileResponse.data);

            // Prepare user login creation
            let loginCreated = false;
            let finalUserId = userLoginData.user_id;
            let finalPassword = password;
            let autoLoginSuccess = false;

            try {
                const loginResponse = await axios.post(
                    `${getBaseUrl()}/api/userlogin`,
                    userLoginData
                );
                console.log("✅ User login created:", loginResponse.data);
                
                const { userId, password: returnedPassword } = loginResponse.data;
                finalUserId = userId;
                finalPassword = returnedPassword || password;
                loginCreated = true;
                
            } catch (loginError) {
                console.error("❌ Error creating user login:", loginError);
                // Check if it's a duplicate entry error
                if (loginError.response?.status === 500 && 
                    loginError.response?.data?.details?.includes('Duplicate entry')) {
                    console.log("⚠️ User login already exists, will proceed with existing credentials...");
                    loginCreated = true;
                } else {
                    console.error("❌ Failed to create user login:", loginError);
                    alert(`Profile created successfully!\nProfile ID: ${profileId}\nWarning: Failed to create user login. Please contact support.`);
                    setIsProcessing(false);
                    return;
                }
            }

            // Auto-login the user if login was created successfully
            if (loginCreated) {
                autoLoginSuccess = await autoLoginUser(finalUserId, finalPassword);
                if (!autoLoginSuccess) {
                    console.log("⚠️ Auto-login failed, user will need to login manually for donation");
                }
            }

            // Show success alert with profile details
            alert(`Profile created successfully!\nProfile ID: ${profileId}\nUser ID: ${finalUserId}\nPassword: ${finalPassword}`);
            
            // STEP 2: Send email to user
            console.log("➡️ Step 2: Sending email to user...");
            await sendEmailToUser(profileId, formData.email);
            console.log("✅ Step 2 Complete: Email sent");

            // Store the profile creation data for donation dialog
            setProfileCreationData({
                profileId,
                userId: finalUserId,
                password: finalPassword,
                email: formData.email,
                phone: formData.phone,
                name: formData.name,
                autoLoginSuccess
            });
            
            // STEP 3: Show donation dialog
            console.log("➡️ Step 3: Showing donation dialog...");
            setIsProcessing(false);
            setShowDonationDialog(true);

        } catch (error) {
            setIsProcessing(false);
            alert("Failed to create profile. Check console for details.");
            console.error("Error submitting form:", error.response?.data || error.message);
        }
    };

    const handleDonationChoice = async (wantsToDonate) => {
        console.log("➡️ Step 4: User made donation choice:", wantsToDonate ? "Yes" : "Maybe Later");
        
        setShowDonationDialog(false);
        
        if (wantsToDonate) {
            // User chooses "Yes" -> Navigate to /donate
            console.log("➡️ Step 4a: User wants to donate");
            
            // Ensure user is logged in before going to donate page
            if (profileCreationData && !profileCreationData.autoLoginSuccess) {
                console.log("🔐 Auto-login was not successful, attempting login again before donation...");
                
                const loginSuccess = await autoLoginUser(
                    profileCreationData.userId, 
                    profileCreationData.password
                );
                
                if (!loginSuccess) {
                    alert("Unable to automatically log you in. Please login manually and then visit the donation page.");
                    resetFormAndNavigateHome();
                    return;
                }
            }
    
            // Store additional user info for the Donate component
            if (profileCreationData) {
                localStorage.setItem("userEmail", profileCreationData.email);
                sessionStorage.setItem("tempProfileData", JSON.stringify({
                    profileId: profileCreationData.profileId,
                    email: profileCreationData.email,
                    phone: profileCreationData.phone,
                    name: profileCreationData.name
                }));
            }
            
            console.log("🎯 Step 5: Navigating to donate page...");
            navigate("/donate");
            
        } else {
            // User chooses "Maybe Later" -> Navigate to home
            console.log("➡️ Step 4b: User chose Maybe Later");
            console.log("🏠 Step 5: Navigating to home page...");
            resetFormAndNavigateHome();
        }
    };

    const resetFormAndNavigateHome = () => {
        // Clear any stored login data if user chooses not to donate
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("tempProfileData");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("profileId");
        
        // Reset form after success
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
            placeOfBirth: "",
            currentAge: 0,
            subCaste: "",
            rashi: "",
            height: 0,
            nakshatra: "",
            charanaPada: "",
            howDidYouKnow: "",
            email: "",
            phone: "",
            alternatePhone: "",
            communicationAddress: "",
            residenceAddress: "",
            fatherName: "",
            fatherProfession: "",
            motherName: "",
            motherProfession: "",
            aboutBrideGroom: "",
            expectations: "",
            reference1Name: "",
            reference1Phone: "",
            reference2Name: "",
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
            shareDetailsOnPlatform: "Yes"
        });

        setTabIndex(0);
        setProfileCreationData(null);
        navigate('/'); // Navigate to home page
    };

    const generateRandomPassword = (length = 10) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    };

    return (
        <div className="bg-gray-50 font-sans antialiased min-h-screen">
            <nav className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link to="/" className="text-xl font-bold text-indigo-700">
                        Profile Registration
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto py-12 px-6">
                <Paper elevation={3} className="rounded-lg shadow-xl p-8 bg-white">
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

            {/* Donation Dialog */}
            <Dialog
                open={showDonationDialog}
                onClose={() => {}} // Prevent closing by clicking outside
                maxWidth="sm"
                fullWidth
                disableEscapeKeyDown // Prevent closing with ESC key
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        padding: 2
                    }
                }}
            >
                <DialogTitle sx={{ 
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    color: '#3f51b5',
                    pb: 1
                }}>
                    Support Our Cause! 🙏
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2, color: '#555', lineHeight: 1.6 }}>
                        Your profile has been created successfully! 
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#555', lineHeight: 1.6 }}>
                        Would you like to make a donation to support our platform? 
                        Your contribution helps us maintain and improve our services for the community.
                    </Typography>
                    {profileCreationData?.autoLoginSuccess && (
                        <Box sx={{ 
                            bgcolor: '#e8f5e8', 
                            p: 2, 
                            borderRadius: 1, 
                            mb: 2,
                            border: '1px solid #4caf50'
                        }}>
                            <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'medium' }}>
                                ✅ You have been automatically logged in for a seamless donation experience!
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ 
                        bgcolor: '#f5f5f5', 
                        p: 2, 
                        borderRadius: 1, 
                        mb: 2,
                        border: '1px solid #e0e0e0'
                    }}>
                        <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                            💡 Your donation helps us keep the platform running and continuously improve our services.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button
                        onClick={() => handleDonationChoice(false)}
                        variant="outlined"
                        disabled={isProcessing}
                        sx={{
                            px: 3,
                            py: 1,
                            borderColor: '#ccc',
                            color: '#666',
                            '&:hover': {
                                borderColor: '#999',
                                bgcolor: '#f5f5f5'
                            }
                        }}
                    >
                        Maybe Later
                    </Button>
                    <Button
                        onClick={() => handleDonationChoice(true)}
                        variant="contained"
                        disabled={isProcessing}
                        sx={{
                            px: 3,
                            py: 1,
                            bgcolor: '#4caf50',
                            '&:hover': {
                                bgcolor: '#45a049'
                            }
                        }}
                    >
                        Yes, I'd like to donate
                    </Button>
                </DialogActions>
            </Dialog>

            <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-12">
                <div className="container mx-auto px-6">
                    <p>&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ProfileDetails;