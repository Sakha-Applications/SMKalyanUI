import React from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import FormNavigation from "../FormNavigation";

const CareerEducationTab = ({ formData, handleChange, handleSubmit, isActive, tabIndex, setTabIndex }) => {
  if (!isActive) { console.log("CareerEducationTab is not active, returning null"); // <--- Debug 5: Is the tab active?} return null;)


  return null;
  }
  console.log("CareerEducationTab is rendering with handleSubmit:", handleSubmit, "and isActive:", isActive, "and tabIndex:", tabIndex); // <--- Debug 6: Is the component rendering with the correct props?
  return (
    <Box
      sx={{
        mt: 2,
        display: "grid",
        gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4-column grid
        gap: 3,
        alignItems: "center",
        p: 4,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 2,
        maxWidth: "150%",
        margin: "auto"
      }}
    >
      {/* Working Status */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Working Status:</Typography>
      <TextField 
        name="workingStatus" 
        value={formData.workingStatus ?? ""} 
        onChange={handleChange} 
        fullWidth 
        required 
        sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
      />

      {/* Education */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Education:</Typography>
      <TextField 
        name="education" 
        value={formData.education ?? ""} 
        onChange={handleChange} 
        fullWidth 
        required 
        sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
      />

      {/* Profession */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profession:</Typography>
      <TextField 
        name="profession" 
        value={formData.profession ?? ""} 
        onChange={handleChange} 
        fullWidth 
        sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
      />

      {/* Designation */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Designation:</Typography>
      <TextField 
        name="designation" 
        value={formData.designation ?? ""} 
        onChange={handleChange} 
        fullWidth 
        sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
      />

      {/* Current Company */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Current Company:</Typography>
      <TextField 
        name="currentCompany" 
        value={formData.currentCompany ?? ""} 
        onChange={handleChange} 
        fullWidth 
        sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
      />

      {/* Annual Income */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Annual Income:</Typography>
      <TextField 
        name="annualIncome" 
        type="number" 
        value={formData.annualIncome ?? ""} 
        onChange={handleChange} 
        fullWidth 
        sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
      />

      {/* Use FormNavigation with showSubmitButton set to true */}
      <FormNavigation 
        tabIndex={tabIndex} 
        setTabIndex={setTabIndex} 
        showSubmitButton={false} 
        handleSubmit={handleSubmit} 
      />
    </Box>
  );
};

export default CareerEducationTab;