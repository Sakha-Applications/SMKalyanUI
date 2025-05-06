import React from "react";
import { Box, Typography, TextField, FormControl, Select, MenuItem } from "@mui/material";
import FormNavigation from "../FormNavigation";

const ModifyProfileBasicDetailsTab = ({ formData, handleChange, tabIndex, setTabIndex }) => {
    return (
        <Box sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4 columns: Label (2fr), Input (8fr)
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
                name="profile_id"
                value={formData.profile_id ?? ""} // Access profile_id from formData
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
            />

            {/* Name */}
            <Typography sx={{ fontWeight: "bold", color: "#333", gridColumn: "1" }}>Name:</Typography>
            <TextField
                name="name"
                value={formData.name ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2 / 4" }} // Span from column 2 to 4
            />
            <Box    />

            {/* Profile Created For */}
            <Typography sx={{ fontWeight: "bold", color: "#444", gridColumn: "1" }}>Profile Created For:</Typography>
            <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1, gridColumn: "2" }}>
                <Select name="profile_created_for" value={formData.profile_created_for || ""} onChange={handleChange}>
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
                <Select name="profile_for" value={formData.profile_for || ""} onChange={handleChange}>
                    <MenuItem value="Bride">Bride</MenuItem>
                    <MenuItem value="Bridegroom">Bridegroom</MenuItem>
                </Select>
            </FormControl>

            {/* Mother Tongue */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother Tongue:</Typography>
            <TextField
                name="mother_tongue"
                value={formData.mother_tongue ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Native Place */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Native Place:</Typography>
            <TextField
                name="native_place"
                value={formData.native_place ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Current Location */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Current Location:</Typography>
            <TextField
                name="current_location"
                value={formData.current_location ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Profile Status */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile Status:</Typography>
            <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                <Select name="profile_status" value={formData.profile_status || ""} onChange={handleChange}>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
            </FormControl>

            {/* Married Status */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Married Status:</Typography>
            <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
                <Select name="married_status" value={formData.married_status || ""} onChange={handleChange}>
                    <MenuItem value="Single (Never Married)">Single (Never Married)</MenuItem>
                    <MenuItem value="Divorced">Divorced</MenuItem>
                    <MenuItem value="Separated">Separated</MenuItem>
                    <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
            </FormControl>

            <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </Box>
    );
};

export default ModifyProfileBasicDetailsTab;