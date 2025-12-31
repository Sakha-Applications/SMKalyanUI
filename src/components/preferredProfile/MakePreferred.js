// src/components/preferredProfile/MakePreferred.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, CircularProgress, Grid } from '@mui/material';
import getBaseUrl from '../../utils/GetUrl';

const MakePreferred = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    email: '',
    phone: '',
    profile_id: ''
  });
  const [profileData, setProfileData] = useState(null);
  const [preferredStatus, setPreferredStatus] = useState(null);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  // Get email from login details on component mount
  useEffect(() => {
    console.log("MakePreferred: Component mounted, checking for stored email...");
    
    // Debug: Log all storage keys first
    console.log("=== SESSION STORAGE DEBUG ===");
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      console.log(`  ${key}: ${value}`);
    }
    
    console.log("=== LOCAL STORAGE DEBUG ===");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`  ${key}: ${value}`);
    }
    
    // Check multiple possible keys for email
    const possibleEmailKeys = [
      "email", 
      "userEmail", 
      "user_email", 
      "loginEmail", 
      "Email",
      "userId",  // Since you mentioned user id is the email
      "user_id",
      "username"
    ];
    
    let foundEmail = null;
    
    // Check sessionStorage first
    for (const key of possibleEmailKeys) {
      const value = sessionStorage.getItem(key);
      if (value && value.includes('@')) {  // Basic email validation
        console.log(`MakePreferred: Found email in sessionStorage with key '${key}':`, value);
        foundEmail = value;
        break;
      }
    }
    
    // If not found in sessionStorage, check localStorage
    if (!foundEmail) {
      for (const key of possibleEmailKeys) {
        const value = localStorage.getItem(key);
        if (value && value.includes('@')) {  // Basic email validation
          console.log(`MakePreferred: Found email in localStorage with key '${key}':`, value);
          foundEmail = value;
          break;
        }
      }
    }
    
    // Check for user objects that might contain email
    if (!foundEmail) {
      const possibleUserKeys = ["user", "userData", "currentUser", "loginData"];
      
      for (const key of possibleUserKeys) {
        const sessionValue = sessionStorage.getItem(key);
        const localValue = localStorage.getItem(key);
        
        [sessionValue, localValue].forEach((value, index) => {
          if (value && !foundEmail) {
            try {
              const parsed = JSON.parse(value);
              const storageType = index === 0 ? 'sessionStorage' : 'localStorage';
              console.log(`MakePreferred: Checking ${storageType} key '${key}':`, parsed);
              
              // Check various email properties
              const emailProps = ['email', 'userEmail', 'user_email', 'Email', 'userId', 'username'];
              for (const prop of emailProps) {
                if (parsed[prop] && parsed[prop].includes('@')) {
                  console.log(`MakePreferred: Found email in ${storageType} object '${key}.${prop}':`, parsed[prop]);
                  foundEmail = parsed[prop];
                  break;
                }
              }
            } catch (e) {
              console.log(`MakePreferred: Could not parse ${key}:`, e.message);
            }
          }
        });
      }
    }
    
    if (foundEmail) {
      console.log("MakePreferred: Auto-populating email field with:", foundEmail);
      setSearchCriteria(prev => ({
        ...prev,
        email: foundEmail
      }));
    } else {
      console.log("MakePreferred: No email found in any storage location");
      console.log("MakePreferred: Please check your login component to ensure email is being stored");
    }
  }, []);

  const handleInputChange = (field, value) => {
    console.log(`MakePreferred: Input changed - ${field}:`, value);
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if profile is already preferred
  const checkPreferredStatus = async (profileId) => {
    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      
      const response = await fetch(`${getBaseUrl()}/api/preferred-profiles/check/${profileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log("MakePreferred: Preferred status check response:", data);
      
      if (response.ok && data.success) {
        if (data.data.is_preferred) {
          // Get detailed preferred profile information
          const detailResponse = await fetch(`${getBaseUrl()}/api/preferred-profiles/profile/${profileId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            console.log("MakePreferred: Preferred profile details:", detailData);
            
            if (detailData.success && detailData.data) {
              return {
                isPreferred: true,
                details: detailData.data
              };
            }
          }
          
          return { isPreferred: true, details: null };
        }
      }
      
      return { isPreferred: false, details: null };
    } catch (error) {
      console.error("MakePreferred: Error checking preferred status:", error);
      return { isPreferred: false, details: null };
    }
  };

  const handleSearch = async () => {
    console.log("MakePreferred: Search initiated with criteria:", searchCriteria);
    
    // Check if at least one field has a value
    const hasSearchCriteria = Object.values(searchCriteria).some(value => value.trim() !== '');
    
    if (!hasSearchCriteria) {
      const errorMsg = 'Please enter at least one search criteria (email, phone, or profile ID)';
      console.log("MakePreferred: Error -", errorMsg);
      setError(errorMsg);
      return;
    }

    // Reset states
    setError(null);
    setProfileData(null);
    setPreferredStatus(null);
    setSearching(true);
    
    // Prepare search data (only include non-empty fields)
    const searchData = {};
    Object.keys(searchCriteria).forEach(key => {
      if (searchCriteria[key].trim() !== '') {
        searchData[key] = searchCriteria[key].trim();
      }
    });
    
    console.log("MakePreferred: Sending search request with data:", searchData);
    
    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      console.log("MakePreferred: Using token:", token ? "Token found" : "No token");
      
      const response = await fetch(`${getBaseUrl()}/api/search-by-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(searchData)
      });
      
      console.log("MakePreferred: Response status:", response.status);
      console.log("MakePreferred: Response ok:", response.ok);
      
      const data = await response.json();
      console.log("MakePreferred: Response data:", data);
      
      if (response.ok && data && data.length > 0) {
        console.log("MakePreferred: Profile found successfully:", data[0]);
        const foundProfile = data[0];
        setProfileData(foundProfile);
        
        // Check if this profile is already preferred
        if (foundProfile.id) {
          console.log("MakePreferred: Checking preferred status for profile:", foundProfile.id);
          const preferredCheck = await checkPreferredStatus(foundProfile.id);
          setPreferredStatus(preferredCheck);
          console.log("MakePreferred: Preferred status result:", preferredCheck);
        }
      } else {
        const errorMsg = 'No profile found matching the search criteria';
        console.log("MakePreferred: No profile found");
        setError(errorMsg);
      }
    } catch (err) {
      console.error("MakePreferred: Search error:", err);
      console.error("MakePreferred: Error details:", {
        message: err.message,
        stack: err.stack
      });
      
      let errorMessage = 'Error searching profile. Please try again.';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setSearching(false);
      console.log("MakePreferred: Search completed");
    }
  };

  const handleConfirm = () => {
    console.log("MakePreferred: Proceeding to payment with profile data:", profileData);
    navigate('/preferred-payment', { state: { profileData } });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  console.log("MakePreferred: Current render state:", {
    searchCriteria,
    profileData: profileData ? "Profile loaded" : "No profile",
    preferredStatus: preferredStatus ? "Status checked" : "No status",
    error,
    searching
  });

  return (
  <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 4 }}>
    {/* Top Nav (same style as Donate) */}
    <Box
      component="nav"
      sx={{
        bgcolor: "white",
        boxShadow: 2,
        py: 2,
        mb: 4,
      }}
    >
      <Box sx={{ maxWidth: "lg", mx: "auto", px: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="h5"
            component={Link}
            to="/dashboard"
            sx={{ fontWeight: "bold", color: "#3f51b5", textDecoration: "none" }}
          >
            Make Preferred
          </Typography>

          <Box>
            <Button
              component={Link}
              to="/dashboard"
              sx={{ color: "#555", "&:hover": { color: "#3f51b5" } }}
            >
              Dashboard
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>

    {/* Main Content */}
    <Box sx={{ maxWidth: "md", mx: "auto", px: 2 }}>
      <Box sx={{ bgcolor: "white", boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ color: "#3f51b5", fontWeight: "bold", mb: 1 }}>
          Make Profile Preferred
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Search by any one or combination of the following criteria:
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Email Address"
              value={searchCriteria.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              fullWidth
              margin="normal"
              type="email"
              placeholder="Enter email address"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Phone Number"
              value={searchCriteria.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter phone number"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Profile ID"
              value={searchCriteria.profile_id}
              onChange={(e) => handleInputChange("profile_id", e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter profile ID"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={searching}
            size="large"
            sx={{
              bgcolor: "#3f51b5",
              color: "white",
              textTransform: "none",
              "&:hover": { bgcolor: "#303f9f" },
            }}
          >
            {searching ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                Searching...
              </>
            ) : (
              "Search Profile"
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        {profileData && (
          <Box sx={{ mt: 4 }}>
            {/* Profile Details Box */}
            <Box
              sx={{
                p: 3,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                mb: 2,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
                Profile Details
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Name:</strong> {profileData.name || "N/A"}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Email:</strong> {profileData.email || "N/A"}
              </Typography>

              {profileData.current_age && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Current Age:</strong> {profileData.current_age}
                </Typography>
              )}

              {profileData.gotra && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Gotra:</strong> {profileData.gotra}
                </Typography>
              )}

              {profileData.phone && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Phone:</strong> {profileData.phone}
                </Typography>
              )}

              {profileData.id && (
                <Typography sx={{ mb: 0 }}>
                  <strong>Profile ID:</strong> {profileData.id}
                </Typography>
              )}
            </Box>

            {/* Preferred Status Check */}
            {preferredStatus?.isPreferred ? (
              <Alert
                severity="info"
                sx={{
                  mb: 2,
                  "& .MuiAlert-message": { width: "100%" },
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, color: "info.main" }}>
                  Profile Already Preferred
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  This profile is already marked as preferred and is currently active.
                </Typography>

                {preferredStatus.details && (
                  <>
                    <Typography sx={{ mb: 1 }}>
                      <strong>Valid Until:</strong> {formatDate(preferredStatus.details.validity_date)}
                    </Typography>

                    {preferredStatus.details.days_remaining !== undefined && (
                      <Typography sx={{ mb: 1 }}>
                        <strong>Days Remaining:</strong> {preferredStatus.details.days_remaining} days
                      </Typography>
                    )}

                    <Typography sx={{ mb: 1 }}>
                      <strong>Payment Amount:</strong> ₹{preferredStatus.details.payment_amount}
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                      <strong>Payment Date:</strong> {formatDate(preferredStatus.details.payment_date)}
                    </Typography>
                  </>
                )}

                <Typography sx={{ mt: 2, fontStyle: "italic" }}>
                  You cannot make this profile preferred again until the current preferred status expires.
                </Typography>
              </Alert>
            ) : (
              <Box
                sx={{
                  p: 3,
                  border: "1px solid #e8f5e8",
                  borderRadius: 2,
                  backgroundColor: "#f8fff8",
                }}
              >
                <Typography sx={{ mb: 1, fontWeight: "medium", color: "success.main" }}>
                  This profile is available for preferred status.
                </Typography>

                <Typography sx={{ mb: 2, color: "text.secondary" }}>
                  Make this profile preferred for ₹250 and get premium visibility for 90 days.
                </Typography>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleConfirm}
                  size="large"
                  sx={{ textTransform: "none" }}
                >
                  Proceed to Payment (₹250)
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>

    {/* Footer (same style as Donate) */}
    <Box
      component="footer"
      sx={{
        bgcolor: "white",
        boxShadow: "0px -2px 4px rgba(0,0,0,0.05)",
        py: 3,
        mt: 4,
        textAlign: "center",
      }}
    >
      <Box sx={{ maxWidth: "lg", mx: "auto", px: 2 }}>
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.
        </Typography>
      </Box>
    </Box>
  </Box>
);
};

export default MakePreferred;