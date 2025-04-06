import React from "react";
import { Box, Typography, TextField, MenuItem } from "@mui/material";
import FormNavigation from "./FormNavigation"; 
import useApiData from "../hooks/useApiData";

const FamilyDetailsTab = ({ formData, handleChange, tabIndex, setTabIndex, isActive }) => {
    if (!isActive) return null;
  
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
        {/* Father's Name */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Father's Name:</Typography>
        <TextField 
          name="fatherName" 
          value={formData.fatherName ?? ""} 
          onChange={handleChange} 
          fullWidth 
          required 
          sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />
  
        {/* Father's Profession */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Father's Profession:</Typography>
        <TextField 
          name="fatherProfession" 
          value={formData.fatherProfession ?? ""} 
          onChange={handleChange} 
          fullWidth 
          sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />
  
        {/* Mother's Name */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother's Name:</Typography>
        <TextField 
          name="motherName" 
          value={formData.motherName ?? ""} 
          onChange={handleChange} 
          fullWidth 
          required 
          sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />
  
        {/* Mother's Profession */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother's Profession:</Typography>
        <TextField 
          name="motherProfession" 
          value={formData.motherProfession ?? ""} 
          onChange={handleChange} 
          fullWidth 
          sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />
  
        {/* Your Expectations */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Your Expectations:</Typography>
        <TextField 
          name="expectations" 
          value={formData.expectations ?? ""} 
          onChange={handleChange} 
          fullWidth 
          multiline 
          rows={4} 
          sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />
  
        {/* Sibling Details */}
        <Typography sx={{ fontWeight: "bold", color: "#444" }}>Sibling Details:</Typography>
        <TextField 
          name="siblings" 
          value={formData.siblings ?? ""} 
          onChange={handleChange} 
          fullWidth 
          multiline 
          rows={4} 
          required 
          sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / span 3" }} 
        />
        
        <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </Box>
    );
};
  
export default FamilyDetailsTab;