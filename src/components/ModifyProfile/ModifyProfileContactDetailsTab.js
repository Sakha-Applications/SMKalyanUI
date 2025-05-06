import React, { useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import FormNavigation from "../FormNavigation";

const ModifyProfileContactDetailsTab = ({ formData, handleChange, isActive, tabIndex, setTabIndex }) => {
    // Debug effect to see formData
    useEffect(() => {
        console.log("Contact Details formData:", formData);
    }, [formData]);

    // Initialize all fields if they exist but aren't loaded yet
    useEffect(() => {
        // Email
        if (formData.email && formData.email.trim() !== "") {
            const syntheticEvent = {
                target: {
                    name: 'email',
                    value: formData.email
                }
            };
            handleChange(syntheticEvent);
        }
        
        // Phone
        if (formData.phone && formData.phone.trim() !== "") {
            const syntheticEvent = {
                target: {
                    name: 'phone',
                    value: formData.phone
                }
            };
            handleChange(syntheticEvent);
        }
        
        // Alternate Phone
        if (formData.alternatePhone && formData.alternatePhone.trim() !== "") {
            const syntheticEvent = {
                target: {
                    name: 'alternatePhone',
                    value: formData.alternatePhone
                }
            };
            handleChange(syntheticEvent);
        }
        
        // Communication Address
        if (formData.communicationAddress && formData.communicationAddress.trim() !== "") {
            const syntheticEvent = {
                target: {
                    name: 'communicationAddress',
                    value: formData.communicationAddress
                }
            };
            handleChange(syntheticEvent);
        }
        
        // Residence Address
        if (formData.residenceAddress && formData.residenceAddress.trim() !== "") {
            const syntheticEvent = {
                target: {
                    name: 'residenceAddress',
                    value: formData.residenceAddress
                }
            };
            handleChange(syntheticEvent);
        }
    }, [formData]);

    if (!isActive) return null;

    return (
        <Box
            sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "2fr 8fr 2fr 8fr", // Changed to 4-column grid
                gap: 3,
                alignItems: "center",
                p: 4,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: 2,
                maxWidth: "150%", // Updated to match ContactDetailsTab
                margin: "auto"
            }}
        >
            {/* Email */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Email ID:</Typography>
            <TextField
                name="email"
                type="email"
                value={formData.email ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ 
                    backgroundColor: "#fff", 
                    borderRadius: 1,
                    gridColumn: "2 / span 3" // Spans across columns 2, 3, and 4
                }}
            />

            {/* Phone Number */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Phone Number:</Typography>
            <TextField
                name="phone"
                type="tel"
                value={formData.phone ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Alternate Phone Number */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Alternate Phone Number:</Typography>
            <TextField
                name="alternatePhone"
                type="tel"
                value={formData.alternatePhone ?? ""}
                onChange={handleChange}
                fullWidth
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Communication Address */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Communication Address:</Typography>
            <TextField
                name="communicationAddress"
                value={formData.communicationAddress ?? ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
                sx={{ 
                    backgroundColor: "#fff", 
                    borderRadius: 1,
                    gridColumn: "2 / span 3" // Spans across columns 2, 3, and 4
                }}
            />

            {/* Residence Address */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Residence Address:</Typography>
            <TextField
                name="residenceAddress"
                value={formData.residenceAddress ?? ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
                sx={{ 
                    backgroundColor: "#fff", 
                    borderRadius: 1,
                    gridColumn: "2 / span 3" // Spans across columns 2, 3, and 4
                }}
            />

            <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </Box>
    );
};

export default ModifyProfileContactDetailsTab;