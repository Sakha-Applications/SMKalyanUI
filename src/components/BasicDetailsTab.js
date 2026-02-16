import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  Select, 
  MenuItem,
  Autocomplete,
  CircularProgress 
} from "@mui/material";
import FormNavigation from "./FormNavigation";
import axios from "axios";
import getBaseUrl from '../utils/GetUrl';

const BasicDetailsTab = ({ formData, handleChange, tabIndex, setTabIndex }) => {
  // Native Place state
  const [isNativePlaceLoading, setIsNativePlaceLoading] = useState(false);
  const [nativePlaceError, setNativePlaceError] = useState(null);
  const [nativePlaceOptions, setNativePlaceOptions] = useState([]);
  const [nativePlaceInputValue, setNativePlaceInputValue] = useState('');
  const [nativePlaceSelectedValue, setNativePlaceSelectedValue] = useState(null);
  
  // Residing City state
  const [isResidingCityLoading, setIsResidingCityLoading] = useState(false);
  const [residingCityError, setResidingCityError] = useState(null);
  const [residingCityOptions, setResidingCityOptions] = useState([]);
  const [residingCityInputValue, setResidingCityInputValue] = useState('');
  const [residingCitySelectedValue, setResidingCitySelectedValue] = useState(null);
  
  // Mother Tongue state
  const [isMotherTongueLoading, setIsMotherTongueLoading] = useState(false);
  const [motherTongueError, setMotherTongueError] = useState(null);
  const [motherTongueOptions, setMotherTongueOptions] = useState([]);
  const [motherTongueInputValue, setMotherTongueInputValue] = useState('');
  const [motherTongueSelectedValue, setMotherTongueSelectedValue] = useState(null);
  
  // Effect to initialize selected native place if formData has it
  useEffect(() => {
    if (formData.nativePlace && !nativePlaceSelectedValue) {
      // If nativePlace is already a string (place name), create an object
      if (typeof formData.nativePlace === 'string' && formData.nativePlace) {
        setNativePlaceSelectedValue({
          label: formData.nativePlace,
          value: formData.nativePlace
        });
        setNativePlaceInputValue(formData.nativePlace);
      }
      // If it's a numeric ID, fetch the name
      else if (!isNaN(formData.nativePlace)) {
        const fetchNativePlaceDetails = async () => {
          try {
            const response = await axios.get(`${getBaseUrl()}/api//native-places`);
            const places = response.data;
            const selectedPlace = places.find(place => place.id === formData.nativePlace);
            if (selectedPlace) {
              setNativePlaceSelectedValue({
                label: selectedPlace.nativeplace,
                value: selectedPlace.nativeplace,
                id: selectedPlace.id // Store ID separately for reference
              });
              setNativePlaceInputValue(selectedPlace.nativeplace);
              
              // Update form data with the name instead of ID
              const syntheticEvent = {
                target: {
                  name: 'nativePlace',
                  value: selectedPlace.nativeplace
                }
              };
              handleChange(syntheticEvent);
            }
          } catch (error) {
            console.error("Error fetching native place details:", error);
          }
        };
        
        fetchNativePlaceDetails();
      }
    }
  }, [formData.nativePlace]);

  // Effect to initialize selected residing city if formData has it
  useEffect(() => {
    if (formData.currentLocation && !residingCitySelectedValue) {
      // If currentLocation is already a string (city name), create an object
      if (typeof formData.currentLocation === 'string' && formData.currentLocation) {
        setResidingCitySelectedValue({
          label: formData.currentLocation,
          value: formData.currentLocation
        });
        setResidingCityInputValue(formData.currentLocation);
      }
      // If it's a numeric ID, fetch the name
      else if (!isNaN(formData.currentLocation)) {
        const fetchCityDetails = async () => {
          try {
            const response = await axios.get(`${getBaseUrl()}/api//native-places`);
            const places = response.data;
            const selectedPlace = places.find(place => place.id === formData.currentLocation);
            if (selectedPlace) {
              setResidingCitySelectedValue({
                label: selectedPlace.nativeplace,
                value: selectedPlace.nativeplace,
                id: selectedPlace.id // Store ID separately for reference
              });
              setResidingCityInputValue(selectedPlace.nativeplace);
              
              // Update form data with the name instead of ID
              const syntheticEvent = {
                target: {
                  name: 'currentLocation',
                  value: selectedPlace.nativeplace
                }
              };
              handleChange(syntheticEvent);
            }
          } catch (error) {
            console.error("Error fetching city details:", error);
          }
        };
        
        fetchCityDetails();
      }
    }
  }, [formData.currentLocation]);

  // Effect to initialize selected mother tongue if formData has it
  useEffect(() => {
    if (formData.motherTongue && !motherTongueSelectedValue) {
      // If motherTongue is already a string (language name), create an object
      if (typeof formData.motherTongue === 'string' && formData.motherTongue) {
        setMotherTongueSelectedValue({
          label: formData.motherTongue,
          value: formData.motherTongue
        });
        setMotherTongueInputValue(formData.motherTongue);
      }
      // If it's a numeric ID, fetch the name
      else if (!isNaN(formData.motherTongue)) {
        const fetchMotherTongueDetails = async () => {
          try {
            const response = await axios.get(`${getBaseUrl()}/api//mother-tongues`);
            const languages = response.data;
            const selectedLanguage = languages.find(lang => lang.id === formData.motherTongue);
            if (selectedLanguage) {
              setMotherTongueSelectedValue({
                label: selectedLanguage.mother_tongue,
                value: selectedLanguage.mother_tongue,
                id: selectedLanguage.id // Store ID separately for reference
              });
              setMotherTongueInputValue(selectedLanguage.mother_tongue);
              
              // Update form data with the name instead of ID
              const syntheticEvent = {
                target: {
                  name: 'motherTongue',
                  value: selectedLanguage.mother_tongue
                }
              };
              handleChange(syntheticEvent);
            }
          } catch (error) {
            console.error("Error fetching mother tongue details:", error);
          }
        };
        
        fetchMotherTongueDetails();
      }
    }
  }, [formData.motherTongue]);

  // Search native places when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nativePlaceInputValue.length >= 2) {
        searchPlaces(nativePlaceInputValue, "nativePlace");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [nativePlaceInputValue]);

  // Search residing city when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (residingCityInputValue.length >= 2) {
        searchPlaces(residingCityInputValue, "residingCity");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [residingCityInputValue]);

  // Search mother tongue when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (motherTongueInputValue.length >= 2) {
        searchMotherTongues(motherTongueInputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [motherTongueInputValue]);

  // Generic function to search places based on input and field type
  const searchPlaces = async (searchText, fieldType) => {
    if (!searchText || searchText.length < 2) return;
    
    // Set loading state based on field type
    if (fieldType === "nativePlace") {
      setIsNativePlaceLoading(true);
      setNativePlaceError(null);
    } else {
      setIsResidingCityLoading(true);
      setResidingCityError(null);
    }
    
    try {
      const response = await axios.get(`${getBaseUrl()}/api//native-places?search=${encodeURIComponent(searchText)}`);
      console.log(`${fieldType} search response:`, response.data);
      
      if (Array.isArray(response.data)) {
        const options = response.data.map((item) => ({
          label: item.nativeplace,
          value: item.nativeplace,
          id: item.id // Store ID separately for reference
        }));
        
        // Update state based on field type
        if (fieldType === "nativePlace") {
          setNativePlaceOptions(options);
        } else {
          setResidingCityOptions(options);
        }
      } else {
        console.error(`Unexpected ${fieldType} response format:`, response.data);
        
        // Set error based on field type
        if (fieldType === "nativePlace") {
          setNativePlaceError("Invalid data format received");
        } else {
          setResidingCityError("Invalid data format received");
        }
      }
    } catch (error) {
      console.error(`Error searching ${fieldType}:`, error);
      
      // Set error based on field type
      if (fieldType === "nativePlace") {
        setNativePlaceError(`Failed to search native places: ${error.message}`);
      } else {
        setResidingCityError(`Failed to search cities: ${error.message}`);
      }
    } finally {
      // Clear loading state based on field type
      if (fieldType === "nativePlace") {
        setIsNativePlaceLoading(false);
      } else {
        setIsResidingCityLoading(false);
      }
    }
  };

  // Function to search mother tongues
  const searchMotherTongues = async (searchText) => {
    if (!searchText || searchText.length < 2) return;
    
    setIsMotherTongueLoading(true);
    setMotherTongueError(null);
    
    try {
      const response = await axios.get(`${getBaseUrl()}/api//mother-tongues?search=${encodeURIComponent(searchText)}`);
      console.log("Mother tongue search response:", response.data);
      
      if (Array.isArray(response.data)) {
        const options = response.data.map((item) => ({
          label: item.mother_tongue,
          value: item.mother_tongue,
          id: item.id // Store ID separately for reference
        }));
        setMotherTongueOptions(options);
      } else {
        console.error("Unexpected mother tongue response format:", response.data);
        setMotherTongueError("Invalid data format received");
      }
    } catch (error) {
      console.error("Error searching mother tongues:", error);
      setMotherTongueError(`Failed to search mother tongues: ${error.message}`);
    } finally {
      setIsMotherTongueLoading(false);
    }
  };

  // Handle selection of native place
  const handleNativePlaceChange = (event, newValue) => {
    setNativePlaceSelectedValue(newValue);
    
    // Update the parent form data with the name (not the ID)
    const syntheticEvent = {
      target: {
        name: 'nativePlace',
        value: newValue ? newValue.value : ''
      }
    };
    
    // Store ID separately if needed for API calls later
    if (newValue && newValue.id) {
      const idEvent = {
        target: {
          name: 'nativePlaceId',
          value: newValue.id
        }
      };
      handleChange(idEvent);
    }
    
    handleChange(syntheticEvent);
  };

  // Handle selection of residing city
  const handleResidingCityChange = (event, newValue) => {
    setResidingCitySelectedValue(newValue);
    
    // Update the parent form data with the name (not the ID)
    const syntheticEvent = {
      target: {
        name: 'currentLocation',
        value: newValue ? newValue.value : ''
      }
    };
    
    // Store ID separately if needed for API calls later
    if (newValue && newValue.id) {
      const idEvent = {
        target: {
          name: 'currentLocationId',
          value: newValue.id
        }
      };
      handleChange(idEvent);
    }
    
    handleChange(syntheticEvent);
  };

  // Handle selection of mother tongue
  const handleMotherTongueChange = (event, newValue) => {
    setMotherTongueSelectedValue(newValue);
    
    // Update the parent form data with the name (not the ID)
    const syntheticEvent = {
      target: {
        name: 'motherTongue',
        value: newValue ? newValue.value : ''
      }
    };
    
    // Store ID separately if needed for API calls later
    if (newValue && newValue.id) {
      const idEvent = {
        target: {
          name: 'motherTongueId',
          value: newValue.id
        }
      };
      handleChange(idEvent);
    }
    
    handleChange(syntheticEvent);
  };

  return (
    <Box
      sx={{
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
        margin: "auto",
      }}
    >
      {/* ID (Auto-generated) */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>ID (Auto-generated):</Typography>
      <TextField
        value={formData.id ?? ""}
        fullWidth
        InputProps={{ readOnly: true }}
        helperText="This is auto generated id."
        sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
      />

      {/* Profile ID */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile ID:</Typography>
      <TextField
        name="profileId"
        value={formData.profileId ?? ""}
        fullWidth
        InputProps={{ readOnly: true }}
        helperText="This is system-generated profile please note it."
        sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
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
          <MenuItem value="Friends">Friends</MenuItem>
        </Select>
      </FormControl>

      {/* This Profile is For */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>
        Providing Details For(ನನ್ನ ವಿವರಗಳು):
      </Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <Select name="profileFor" value={formData.profileFor || ""} onChange={handleChange}>
          <MenuItem value="Bride">Bride</MenuItem>
          <MenuItem value="Bridegroom">Bridegroom</MenuItem>
        </Select>
      </FormControl>

{/* Name Label */}
      <Typography sx={{ fontWeight: "bold", color: "#333" }}>Name:</Typography>

      {/* Name Input Field spanning Columns 2, 3, and 4 */}
      <TextField
        name="name"
        value={formData.name ?? ""}
        onChange={handleChange}
        helperText="Enter the Full Name"
        fullWidth
        required
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
          gridColumn: "2 / span 3",
        }}
      />


      {/* Profile Category */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Bride/Groom Category:</Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <Select name="profileCategory" value={formData.profileCategory || ""} onChange={handleChange}>
          <MenuItem value="Domestic-India">Domestic-India</MenuItem>
          <MenuItem value="International">International</MenuItem>
          <MenuItem value="Vaidika">Vaidika</MenuItem>
        </Select>
      </FormControl>
      
      {/* looking for Profile Category */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Looking for Bride/Groom Category:</Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <Select name="profileCategoryneed" value={formData.profileCategoryneed || ""} onChange={handleChange}>
          <MenuItem value="Domestic-India">Domestic-India</MenuItem>
          <MenuItem value="International">International</MenuItem>
          <MenuItem value="Vaidhik">Vaidhik</MenuItem>
          <MenuItem value="Anyone">Anyone</MenuItem>
        </Select>
      </FormControl>

      {/* Mother Tongue - AUTOCOMPLETE VERSION */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Mother Tongue:</Typography>
      <Autocomplete
        value={motherTongueSelectedValue}
        onChange={handleMotherTongueChange}
        inputValue={motherTongueInputValue}
        onInputChange={(event, newInputValue) => {
          setMotherTongueInputValue(newInputValue);
        }}
        options={motherTongueOptions}
        loading={isMotherTongueLoading}
        loadingText="Searching..."
        noOptionsText={motherTongueInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
        fullWidth
        freeSolo // Allow custom values
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            helperText={motherTongueError || "Start typing to search mother tongues"}
            error={!!motherTongueError}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isMotherTongueLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* Native Place - AUTOCOMPLETE VERSION */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Native Place:</Typography>
      <Autocomplete
        value={nativePlaceSelectedValue}
        onChange={handleNativePlaceChange}
        inputValue={nativePlaceInputValue}
        onInputChange={(event, newInputValue) => {
          setNativePlaceInputValue(newInputValue);
        }}
        options={nativePlaceOptions}
        loading={isNativePlaceLoading}
        loadingText="Searching..."
        noOptionsText={nativePlaceInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
        fullWidth
        freeSolo // Allow custom values
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            helperText={nativePlaceError || "Start typing to search native places"}
            error={!!nativePlaceError}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isNativePlaceLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* Residing City - AUTOCOMPLETE VERSION */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Residing City:</Typography>
      <Autocomplete
        value={residingCitySelectedValue}
        onChange={handleResidingCityChange}
        inputValue={residingCityInputValue}
        onInputChange={(event, newInputValue) => {
          setResidingCityInputValue(newInputValue);
        }}
        options={residingCityOptions}
        loading={isResidingCityLoading}
        loadingText="Searching..."
        noOptionsText={residingCityInputValue.length < 2 ? "Type at least 2 characters" : "No options found"}
        fullWidth
        freeSolo // Allow custom values
        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            helperText={residingCityError || "Start typing to search cities"}
            error={!!residingCityError}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isResidingCityLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* Profile Status */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile Status:</Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <Select name="profileStatus" value={formData.profileStatus || "Active"} onChange={handleChange}>
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

            {/* NEW FIELD: Do you share your detail on platform */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>Do you share your detail on platform:</Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        {/* Use formData.shareDetailsOnPlatform to control the value */}
        <Select
          name="shareDetailsOnPlatform"
          value={formData.shareDetailsOnPlatform || "Yes"} // Default to "Yes" if not set
          onChange={handleChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </FormControl>
      
{/* NEW FIELD: How did you come to know about this Initiative/service ? */}
      <Typography sx={{ fontWeight: "bold", color: "#444" }}>
        How did you come to know about this Initiative/service ?
      </Typography>
      <FormControl fullWidth required sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
        <Select
          name="howDidYouKnow" // Bind to the new formData field
          value={formData.howDidYouKnow || ""} // Default value
          onChange={handleChange}
        >
          <MenuItem value="">Select an Option</MenuItem> {/* Optional: A placeholder option */}
          <MenuItem value="Friends">Friends</MenuItem>
          <MenuItem value="Family">Family</MenuItem>
          <MenuItem value="Social Media (Facebook, Instagram, LinkedIn, etc.)">Social Media (Facebook, Instagram, LinkedIn, etc.)</MenuItem>
          <MenuItem value="WhatsApp Message">WhatsApp Message</MenuItem>
          <MenuItem value="Community Outreach Program">Community Outreach Program</MenuItem>
          <MenuItem value="Event or Conference">Event or Conference</MenuItem>
          <MenuItem value="SMS or Phone Call">SMS or Phone Call</MenuItem>
          <MenuItem value="Others">Others</MenuItem>
        </Select>
      </FormControl>


      <FormNavigation tabIndex={tabIndex} setTabIndex={setTabIndex} />
    </Box>
  );
};

export default BasicDetailsTab;