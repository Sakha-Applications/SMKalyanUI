import React, { useState } from "react";
import { Tabs, Tab, Paper, Typography, Box } from "@mui/material";
import { Link } from 'react-router-dom'; // Import Link
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
    console.log("handleSubmit function called"); // <--- Debug 1: Is the function being called?
    try {
      console.log("Submitting data:", formData); // Log the data being sent
      const response = await axios.post('http://localhost:3001/api/addProfile', formData);
      console.log("Submission successful:", response.data);
      // Optionally, show a success message to the user
    } catch (error) {
      console.error("Error submitting data:", error);
      // Optionally, show an error message to the user
    }
  };

  const generateRandomPassword = (length = 10) => {
    // ... (Your existing generateRandomPassword function remains the same)
  };

  return (
    <div className="bg-gray-50 font-sans antialiased min-h-screen">
      {/* Navigation Bar (Similar to Home) */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/" className="text-xl font-bold text-indigo-700">
            ProfileConnect {/* Or your app name */}
          </Link>
          <div>
            <Link to="/" className="text-gray-700 hover:text-indigo-500">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Section - Your Profile Details Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <Paper elevation={3} sx={{ maxWidth: "80%", mx: "auto", p: 3, mt: 4, backgroundColor: "#f9f9f9" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Profile Details
            </Typography>
            <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} variant="fullWidth">
              {tabLabels.map((label, index) => (<Tab key={index} label={label} />))}
            </Tabs>

            <Box sx={{ mt: 2 }}>
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
      </section>

      {/* Footer (Optional) */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm">
        <div className="container mx-auto px-6">
          <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfileDetails;