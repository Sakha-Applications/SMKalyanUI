import React from "react";
import { Box, Typography, TextField, FormControl, Select, MenuItem } from "@mui/material";

const BasicDetailsTab = ({ formData, handleChange, tabIndex, setTabIndex }) => {
  return (
    <Box sx={{
      mt: 2,
      display: "grid",
      gridTemplateColumns: "2fr 8fr 2fr 8fr",
      gap: 3,
      alignItems: "center",
      justifyContent: "center",
      p: 4,
      backgroundColor: "#f5f5f5",
      borderRadius: 2,
      boxShadow: 2,
      maxWidth: "100%",
      margin: "auto"
    }}>
      {/* ID (Auto-generated) */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>ID (Auto-generated):</Typography>
      <TextField
        value={formData.id ?? ""}
        fullWidth
        InputProps={{ readOnly: true }}
        sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
      />

      {/* Profile ID */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile ID:</Typography>
      <TextField
        name="profileId"
        value={formData.profileId ?? ""}
        fullWidth
        InputProps={{ readOnly: true }}
        sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
      />

      {/* Name Label */}
      <Typography sx={{ fontWeight: "bold", color: "#333" }}>Name:</Typography>

      {/* Name Input Field spanning Columns 2, 3, and 4 */}
      <TextField
        name="name"
        value={formData.name ?? ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
          gridColumn: "2 / span 3" // Spans across columns 2, 3, and 4
        }}
      />

      {/* Profile Created For */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile Created For:</Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <Select name="profileCreatedFor" value={formData.profileCreatedFor || ""} onChange={handleChange}>
          <MenuItem value="Self">Self</MenuItem>
          <MenuItem value="Son">Son</MenuItem>
          <MenuItem value="Daughter">Daughter</MenuItem>
          <MenuItem value="Sibling">Sibling</MenuItem>
          <MenuItem value="Relatives">Relatives</MenuItem>
        </Select>
      </FormControl>

      {/* This Profile is For */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>This Profile is For:</Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <Select name="profileFor" value={formData.profileFor || ""} onChange={handleChange}>
          <MenuItem value="Bride">Bride</MenuItem>
          <MenuItem value="Bridegroom">Bridegroom</MenuItem>
        </Select>
      </FormControl>

      {/* Mother Tongue */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother Tongue:</Typography>
      <TextField
        name="motherTongue"
        value={formData.motherTongue ?? ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
      />

      {/* Native Place */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Native Place:</Typography>
      <TextField
        name="nativePlace"
        value={formData.nativePlace ?? ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
      />

      {/* Current Location */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Current Location:</Typography>
      <TextField
        name="currentLocation"
        value={formData.currentLocation ?? ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
      />

      {/* Profile Status */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile Status:</Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <Select name="profileStatus" value={formData.profileStatus || ""} onChange={handleChange}>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      {/* Married Status */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Married Status:</Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <Select name="marriedStatus" value={formData.marriedStatus || ""} onChange={handleChange}>
          <MenuItem value="Single (Never Married)">Single (Never Married)</MenuItem>
          <MenuItem value="Divorced">Divorced</MenuItem>
          <MenuItem value="Separated">Separated</MenuItem>
          <MenuItem value="Widowed">Widowed</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default BasicDetailsTab;