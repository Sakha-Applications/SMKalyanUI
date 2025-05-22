import React from "react";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import countryData from "country-telephone-data";
import FormNavigation from "./FormNavigation";

const countryCodes = countryData.allCountries.map((country) => ({
  code: `+${country.dialCode}`,
  label: `${country.name} (+${country.dialCode})`,
  iso2: country.iso2
}));

const ContactDetailsTab = ({ formData, handleChange, isActive, tabIndex, setTabIndex }) => {
  if (!isActive) return null;

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    const countryCode = updatedFormData.phoneCountryCode || "";
    const number = updatedFormData.phoneNumber || "";
    updatedFormData.phone = countryCode + number;

    handleChange({ target: { name: "phone", value: updatedFormData.phone } });
    handleChange({ target: { name, value } });
  };

  const handleAlternatePhoneChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    const countryCode = updatedFormData.alternatePhoneCountryCode || "";
    const number = updatedFormData.alternatePhoneNumber || "";
    updatedFormData.alternatePhone = countryCode + number;

    handleChange({ target: { name: "alternatePhone", value: updatedFormData.alternatePhone } });
    handleChange({ target: { name, value } });
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: "grid",
        gridTemplateColumns: "2fr 3fr 5fr 2fr 3fr 5fr",
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
          gridColumn: "2 / span 5"
        }}
      />

      {/* Phone Number */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Phone Number:</Typography>
      <TextField
        select
        name="phoneCountryCode"
        value={formData.phoneCountryCode ?? ""}
        onChange={handlePhoneChange}
        fullWidth
        required
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
      >
        {countryCodes.map((option) => (
          <MenuItem key={option.iso2 + option.code} value={option.code}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="phoneNumber"
        value={formData.phoneNumber ?? ""}
        onChange={handlePhoneChange}
        fullWidth
        required
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
      />

      {/* Alternate Phone Number */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Alternate Phone Number:</Typography>
      <TextField
        select
        name="alternatePhoneCountryCode"
        value={formData.alternatePhoneCountryCode ?? ""}
        onChange={handleAlternatePhoneChange}
        fullWidth
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
      >
        {countryCodes.map((option) => (
          <MenuItem key={option.iso2 + option.code} value={option.code}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="alternatePhoneNumber"
        value={formData.alternatePhoneNumber ?? ""}
        onChange={handleAlternatePhoneChange}
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
          gridColumn: "2 / span 5"
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
          gridColumn: "2 / span 5"
        }}
      />

      <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
    </Box>
  );
};

export default ContactDetailsTab;
