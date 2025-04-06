import React, { useState } from "react";
import { Tabs, Tab, Paper, Typography, Box } from "@mui/material";
import BasicDetailsTab from "./BasicDetailsTab";
import PersonalInfoTab from "./PersonalInfoTab";
import ContactDetailsTab from "./ContactDetailsTab";
import FamilyDetailsTab from "./FamilyDetailsTab";
import CareerEducationTab from "./CareerEducationTab";
import useFormData from "../hooks/useFormData";
import axios from "axios";

const ProfileDetails = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const tabLabels = ["Basic Details", "Personal Info", "Contact Details", "Family Details", "Career & Education"];
    
    const { formData, setFormData, handleChange, handleDOBChange, handleTimeBlur } = useFormData();

    const handleSubmit = async () => {
        // Validate phone number
        if (!/^\d{10}$/.test(formData.phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }
        
        // Validate Date of Birth
        if (!formData.dob) {
            alert("Date of Birth is mandatory.");
            setTabIndex(1); // Switch to tab with DOB
            return;
        }
        
        try {
            const response = await axios.post("http://localhost:3001/api/addProfile", formData);
            // Fixed string interpolation syntax using backticks
            alert(`Profile created successfully! Profile ID: ${formData.profileId}`);
            
            // Reset form data
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
                annualIncome: 0
            });
            setTabIndex(0);
        } catch (error) {
            alert("Failed to create profile.");
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div>
            <Paper elevation={3} sx={{ maxWidth: "80%", mx: "auto", p: 3, mt: 4, backgroundColor: "#f9f9f9" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Profile Details
                </Typography>
                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} variant="fullWidth">
                    {tabLabels.map((label, index) => (<Tab key={index} label={label} />))}
                </Tabs>

                <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1200px 1fr", gap: 2, alignItems: "center" }}>
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
                            setFormData={setFormData}  // ✅ Add this line
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
    );
};

export default ProfileDetails;