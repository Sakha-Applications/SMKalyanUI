// src/components/dashboard/MatchGrid.jsx
// This file functionally acts as the "Matches" component.

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../../utils/GetUrl'; // To get the API base URL
import { fetchDefaultPhoto } from '../UploadProfilePhoto/photoUploadUtils'; // For fetching profile photos

// Define a fallback image path if profile photos are not available
const FALLBACK_DEFAULT_IMAGE_PATH = '/ProfilePhotos/defaultImage.jpg';

// The main Matches component, receiving profileId as a prop
const Matches = ({ profileId }) => { // Component named 'Matches' as per functionality
  const navigate = useNavigate();

  // State management for user preferences, matched profiles, loading, and errors
  const [userProfileData, setUserProfileData] = useState(null);
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [loadingUserPreferences, setLoadingUserPreferences] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState(null);

  // State for managing profile photo URLs and their loading status (replicated from SearchResults.js)
  const [profilePhotoUrls, setProfilePhotoUrls] = useState({});
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  // Helper function: Converts CM to Feet'Inches" string for display
  const cmToFeetInchesString = useCallback((cmValue) => {
    if (!cmValue || isNaN(cmValue)) return 'N/A';
    const totalInches = cmValue / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }, []);

  // --- Step 1: Fetch Logged-in User's Profile and Preferences ---
  useEffect(() => {
    const fetchUserPreferences = async () => {
      // Check if profileId is available (passed from DashboardLayout)
      if (!profileId) {
        setError("Profile ID not available. Cannot fetch user preferences.");
        setLoadingUserPreferences(false);
        return;
      }

      // --- CRITICAL FIX: Retrieve authentication token using the correct key 'token' ---
      const authToken = sessionStorage.getItem('token'); // CORRECTED: Changed from 'authToken' to 'token'
      if (!authToken) {
        setError("Authentication token not found. Please log in again.");
        setLoadingUserPreferences(false);
        return;
      }
      // --- END CRITICAL FIX ---

      setLoadingUserPreferences(true);
      setError(null); // Clear previous errors

      try {
        // API call to fetch user's preferences (corrected to include /api prefix and Authorization header)
        const response = await fetch(`${getBaseUrl()}/api/modifyProfile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Include auth token for authenticated endpoint
          },
        });

        // Handle specific 401 Unauthorized status
        if (response.status === 401) {
            throw new Error('Authentication required. Your session might have expired. Please log in.');
        }

        // Handle other non-OK responses
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch user preferences. Status: ${response.status}`);
        }

        const data = await response.json();
        setUserProfileData(data);
        console.log("🟢 User preferences fetched:", data);
      } catch (err) {
        console.error("❌ Error fetching user preferences:", err);
        setError(err.message || "Failed to load your preferences.");
        // If authentication fails, redirect to login
        if (err.message.includes("Authentication required") || err.message.includes("Invalid token")) {
          navigate('/login');
        }
      } finally {
        setLoadingUserPreferences(false);
      }
    };

    fetchUserPreferences();
  }, [profileId, navigate]); // Dependencies: profileId and navigate (for potential redirect)

  // --- Step 2 & 3: Construct searchQuery & Execute Match Search ---
  useEffect(() => {
    const findMatches = async () => {
      // Only proceed if user preferences are loaded and there's no error from preference fetch
      if (!userProfileData || error) {
        return;
      }

      // --- CRITICAL FIX: Retrieve authentication token again for the match search API ---
      const authToken = sessionStorage.getItem('token'); // CORRECTED: Changed from 'authToken' to 'token'
      if (!authToken) {
        setError("Authentication token not found for match search. Please log in again.");
        setLoadingMatches(false);
        return;
      }
      // --- END CRITICAL FIX ---

      setLoadingMatches(true);
      setError(null); // Clear previous errors
      setMatchedProfiles([]); // Clear previous results

      try {
        // Destructure necessary preferred fields from userProfileData
        const {
          gotra, // User's own gotra for exclusion (string)
          ageRange, // e.g., [25, 35] (array of numbers)
          heightRange, // e.g., [150, 180] (array of CM numbers)
          preferredIncomeRange, // e.g., [5, 20] (array of Lakh numbers)
          profileFor, // e.g., "Bridegroom" (string)
          preferredMaritalStatus, // e.g., "Single (Never Married)" (string)
          preferredManglikStatus, // e.g., "Non-Manglik" (string)
          preferredDiet, // e.g., "Vegetarian" (string or array of strings if multi-select)
          // Multi-select arrays (already parsed by modifyProfileController.js)
          preferredMotherTongues, // e.g., ['Kannada', 'Marathi']
          preferredSubCastes,
          preferredGuruMathas,
          preferredGotras, // e.g., ['Aatreya', 'Bharadwaj']
          preferredNakshatras,
          preferredRashis,
          preferredEducation,
          preferredProfessions,
          preferredHobbies,
          preferredCountries,
          preferredCities, // e.g., [{label: 'Bengaluru', value: 'Bengaluru'}]
          preferredNativeOrigins, // e.g., [{label: 'Mysuru', value: 'Mysuru'}]
          // Add other preferred fields if they exist in userProfileData and need to be sent
        } = userProfileData;

        // Construct the searchQuery payload for the new /api/matchProfiles endpoint
        const searchQuery = {
          userOwnGotra: gotra || null, // User's own gotra for exclusion
          profile_id: userProfileData.profile_id || userProfileData.profileId, // ✅ ADD THIS
          // Preferred criteria for inclusion:
          minPreferredAge: ageRange ? ageRange[0] : null,
          maxPreferredAge: ageRange ? ageRange[1] : null,

          // Height: Sending CM values directly to backend
          minPreferredHeightCm: heightRange ? heightRange[0] : null,
          maxPreferredHeightCm: heightRange ? heightRange[1] : null,

          // Income: Sending numbers in Lakhs
          minPreferredIncome: preferredIncomeRange ? preferredIncomeRange[0] : null,
          maxPreferredIncome: preferredIncomeRange ? preferredIncomeRange[1] : null,

          // Exact Match Preferences
          preferredProfileFor: profileFor || null, // Maps to profile_for
          preferredMaritalStatus: preferredMaritalStatus || null,
          preferredManglikStatus: preferredManglikStatus || null,
          preferredDiet: preferredDiet || null,

          // Multi-select Preferences (sent as arrays of strings/objects)
          preferredMotherTongues: preferredMotherTongues || [],
          preferredSubCastes: preferredSubCastes || [],
          preferredGuruMathas: preferredGuruMathas || [],
          preferredNakshatras: preferredNakshatras || [],
          preferredRashis: preferredRashis || [],
          preferredEducation: preferredEducation || [],
          preferredProfessions: preferredProfessions || [],
          preferredHobbies: preferredHobbies || [],
          preferredCountries: preferredCountries || [],
          preferredCities: preferredCities || [], // Array of objects for JSON matching
          preferredNativeOrigins: preferredNativeOrigins || [], // Array of objects for JSON matching
          // preferredGotras should be included for IN clause:
          preferredGotras: preferredGotras || [],
        };

        console.log("🔍 Sending match search request with payload:", searchQuery);

        // API call to the new match profiles endpoint
        const response = await fetch(`${getBaseUrl()}/api/matchProfiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Include auth token
          },
          body: JSON.stringify(searchQuery),
        });

        // Handle 401 Unauthorized
        if (response.status === 401) {
            throw new Error('Authentication required for matches. Your session might have expired. Please log in.');
        }

        // Handle other non-OK responses
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch matches. Status: ${response.status}`);
        }

        const data = await response.json();
        setMatchedProfiles(data);
        console.log("✅ Matches fetched:", data);
      } catch (err) {
        console.error("❌ Error finding matches:", err);
        setError(err.message || "Failed to find matches. Please try again.");
        // Redirect to login on authentication failure
        if (err.message.includes("Authentication required") || err.message.includes("Invalid token")) {
          navigate('/login');
        }
      } finally {
        setLoadingMatches(false);
      }
    };

    // Trigger match search only if user preferences are loaded and no error occurred during preference fetch
    if (userProfileData && !error) {
      findMatches();
    }
  }, [userProfileData, error, navigate]); // Dependencies: userProfileData, error state, navigate

  // --- Photo Loading Logic (Replicated from SearchResults.js) ---
  useEffect(() => {
    const loadAllProfilePhotos = async (resultsData) => {
      setLoadingPhotos(true);
      const photoPromises = resultsData.map(async (result) => {
        const currentProfileId = result.profile_id || result.profileId;
        if (!currentProfileId) {
          console.warn(`[Matches][loadAllProfilePhotos] Profile missing profile_id/profileId:`, result);
          return { profileId: 'unknown', photoUrl: `${getBaseUrl()}${FALLBACK_DEFAULT_IMAGE_PATH}` };
        }

        let photoUrl = `${getBaseUrl()}${FALLBACK_DEFAULT_IMAGE_PATH}`;
        let fetchError = null;

        await fetchDefaultPhoto(
          currentProfileId,
          (photoObject) => {
            if (photoObject && photoObject.fullUrl) {
              photoUrl = photoObject.fullUrl;
            }
          },
          (errorMsg) => {
            fetchError = errorMsg;
          }
        );

        if (fetchError) {
          console.warn(`[Matches][loadAllProfilePhotos][${currentProfileId}] fetchDefaultPhoto reported an error: ${fetchError}. Using fallback.`);
        }
        return { profileId: currentProfileId, photoUrl };
      });

      const photoResults = await Promise.all(photoPromises);
      const photoMap = {};
      photoResults.forEach(({ profileId, photoUrl }) => {
        photoMap[profileId] = photoUrl;
      });

      setProfilePhotoUrls(photoMap);
      setLoadingPhotos(false);
    };

    if (matchedProfiles.length > 0) {
      loadAllProfilePhotos(matchedProfiles);
    } else {
      setProfilePhotoUrls({});
      setLoadingPhotos(false);
    }
  }, [matchedProfiles]); // Re-run when matchedProfiles change

  // Helper to get profile photo URL from state (Replicated from SearchResults.js)
  const getProfilePhotoUrl = useCallback((id) => {
    return profilePhotoUrls[id] || `${getBaseUrl()}${FALLBACK_DEFAULT_IMAGE_PATH}`;
  }, [profilePhotoUrls]);

  // Card click handler (Replicated from SearchResults.js)
  const handleCardClick = (id) => {
    alert(`Clicked on profile: ${id}. To see more details, please log in or register.`);
    // For now, navigating to home (login page). In a real app, might open a modal or new route.
    navigate('/');
  };

  // --- Render Logic ---
  // Initial loading state while user preferences are being fetched
  if (loadingUserPreferences) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
        <Typography variant="h6" className="text-indigo-800">
          Loading your preferences to find matches...
        </Typography>
      </div>
    );
  }

  // Display error messages
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 font-inter">
      {/* Navigation Bar (replicated from BasicSearchForm.jsx) */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-xl font-bold text-indigo-700">Your Matches</h1>
          <div className="space-x-4">
            <Button
              variant="text"
              className="text-gray-700 hover:text-indigo-500"
              onClick={() => navigate('/Dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <section className="py-8">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold">Profiles Matching Your Preferences</h2>
          </div>

          <div className="p-6">
            {/* Loading spinner for match search or photo loading */}
            {loadingMatches || loadingPhotos ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>
                  {loadingMatches ? "Finding your perfect matches..." : "Loading match photos..."}
                </Typography>
              </Box>
            ) : matchedProfiles.length > 0 ? (
              // Display matched profiles in a grid
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mt: 2 }}>
                {matchedProfiles.map((profile, index) => {
                  const currentProfileId = profile.profile_id || profile.profileId;
                  const imageUrl = getProfilePhotoUrl(currentProfileId);
                  // Parse age from "X years" string to a number for display
                  const profileAge = profile.current_age ? `${parseInt(profile.current_age)} yrs` : 'N/A';
                  // Height is already in "feet'inches"" string format
                  const profileHeight = profile.height || 'N/A';

                  return (
                    <Box
                      key={currentProfileId || index}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleCardClick(currentProfileId)}
                    >
                      {/* Image Section (replicated from SearchResults.js) */}
                      <Box sx={{ width: '100%', height: 200, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                          src={imageUrl}
                          alt={profile.name || 'Profile Photo'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop on error
                            // Only set fallback if not already showing an error image or placeholder
                            if (e.target.src !== `${getBaseUrl()}${FALLBACK_DEFAULT_IMAGE_PATH}`) {
                                e.target.src = `${getBaseUrl()}${FALLBACK_DEFAULT_IMAGE_PATH}`;
                            }
                          }}
                        />
                      </Box>
                      {/* Details Section (replicated from SearchResults.js) */}
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6" component="div" className="font-semibold text-gray-900 mb-1">
                          {profile.name || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="text-gray-700">
                          <strong>Age:</strong> {profileAge}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="text-gray-700">
                          <strong>Height:</strong> {profileHeight}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="text-gray-700">
                          <strong>Location:</strong> {profile.current_location || 'N/A'}
                        </Typography>
                        {profile.gotra && (
                          <Typography variant="body2" color="text.secondary" className="text-gray-700">
                            <strong>Gotra:</strong> {profile.gotra}
                          </Typography>
                        )}
                        {currentProfileId && (
                          <Typography variant="caption" color="text.secondary" className="text-xs mt-2 block">
                            Profile ID: {currentProfileId}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              // No matches found message
              <Typography align="center" className="text-gray-700 mt-4">No matches found based on your preferences.</Typography>
            )}
          </div>
        </div>
      </section>

      {/* Footer (replicated from BasicSearchForm.jsx) */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-8">
        <div className="container mx-auto px-6">
          <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Matches; // Exported as Matches