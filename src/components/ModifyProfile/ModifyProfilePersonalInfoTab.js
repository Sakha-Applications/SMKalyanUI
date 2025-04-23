import React from "react";
import { Box, Typography, TextField, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import FormNavigation from "../FormNavigation";
import useApiData from "../../hooks/useApiData";

const ModifyProfilePersonalInfoTab = ({ formData, handleChange, handleDOBChange, handleTimeBlur, tabIndex, setTabIndex }) => {
    const { isLoading, error, gotraOptions, rashiOptions, nakshatraOptions } = useApiData();

    return (
        <Box sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "2fr 8fr 2fr 8fr", // 4 columns: Label (2fr), Input (8fr)
            gap: 3,
            alignItems: "center",
            p: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 2,
            maxWidth: "150%",
            margin: "auto"
        }}>
            {/* Gotra */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Gotra:</Typography>
            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TextField
                    name="gotra"
                    value={formData.gotra ?? ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    select
                >
                    {gotraOptions.length > 0 ? (
                        gotraOptions.map((gotra, index) => (
                            <MenuItem key={index} value={gotra.gotraname}>
                                {gotra.gotraname}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No options available</MenuItem>
                    )}
                </TextField>
            )}

            {/* GuruMatha */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>GuruMatha:</Typography>
            <TextField
                name="guruMatha"
                value={formData.guruMatha ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Date of Birth (Read-only) */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Date of Birth:</Typography>
            <TextField
                name="dob"
                value={formData.dob ? dayjs(formData.dob).format("YYYY-MM-DD") : ""}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
            />

            {/* Time of Birth */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Time of Birth:</Typography>
            <TextField
                name="timeOfBirth"
                value={formData.timeOfBirth ?? ""}
                onChange={handleChange}
                onBlur={handleTimeBlur}
                helperText="Enter time in HH:MM:SS format"
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Current Age (Read-only) */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Current Age:</Typography>
            <TextField
                name="currentAge"
                value={formData.currentAge ?? ""}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
            />

            {/* Sub Caste */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Sub Caste:</Typography>
            <TextField
                name="subCaste"
                value={formData.subCaste ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Rashi */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Rashi:</Typography>
            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TextField
                    name="rashi"
                    value={formData.rashi ?? ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    select
                >
                    {rashiOptions.length > 0 ? (
                        rashiOptions.map((rashi, index) => (
                            <MenuItem key={index} value={rashi.rashiname}>
                                {rashi.rashiname}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No options available</MenuItem>
                    )}
                </TextField>
            )}

            {/* Height */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Height:</Typography>
            <TextField
                name="height"
                value={formData.height ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            {/* Nakshatra */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Nakshatra:</Typography>
            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TextField
                    name="nakshatra"
                    value={formData.nakshatra ?? ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    select
                >
                    {nakshatraOptions.length > 0 ? (
                        nakshatraOptions.map((nakshatra, index) => (
                            <MenuItem key={index} value={nakshatra.nakshatraname}>
                                {nakshatra.nakshatraname}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No options available</MenuItem>
                    )}
                </TextField>
            )}

            {/* Charana Pada */}
            <Typography sx={{ fontWeight: "bold", color: "#444" }}>Charana Pada:</Typography>
            <TextField
                name="charanaPada"
                value={formData.charanaPada ?? ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />

            <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
        </Box>
    );
};

export default ModifyProfilePersonalInfoTab;