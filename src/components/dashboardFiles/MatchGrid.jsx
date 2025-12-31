// src/components/dashboard/MatchGrid.jsx
// This file functionally acts as the "Matches" component.

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../../utils/GetUrl';
import { fetchDefaultPhoto } from '../UploadProfilePhoto/photoUploadUtils';

// --- NEW IMPORTS ---
import ProfileCard from './ProfileCard/ProfileCard';
import styles from './MatchGrid.module.css';
// --- END NEW IMPORTS ---

const FALLBACK_DEFAULT_IMAGE_PATH = '/ProfilePhotos/defaultImage.jpg';
const VISIBLE_COUNT = 20; // Step-1: prevent loading too many profiles/photos at once

const Matches = ({ profileId }) => {
  const navigate = useNavigate();

  // State management
  const [userProfileData, setUserProfileData] = useState(null);
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [loadingUserPreferences, setLoadingUserPreferences] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState(null);
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
      if (!profileId) {
        setError("Profile ID not available. Cannot fetch user preferences.");
        setLoadingUserPreferences(false);
        return;
      }

      const authToken = sessionStorage.getItem('token');
      if (!authToken) {
        setError("Authentication token not found. Please log in again.");
        setLoadingUserPreferences(false);
        return;
      }

      setLoadingUserPreferences(true);
      setError(null);

      try {
        const response = await fetch(`${getBaseUrl()}/api/modifyProfile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.status === 401) {
            throw new Error('Authentication required. Your session might have expired. Please log in.');
        }

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
        if (err.message.includes("Authentication required") || err.message.includes("Invalid token")) {
          navigate('/login');
        }
      } finally {
        setLoadingUserPreferences(false);
      }
    };

    fetchUserPreferences();
  }, [profileId, navigate]);

  // --- Step 2 & 3: Construct searchQuery & Execute Match Search ---
  useEffect(() => {
    const findMatches = async () => {
      if (!userProfileData || error) {
        return;
      }

      const authToken = sessionStorage.getItem('token');
      if (!authToken) {
        setError("Authentication token not found for match search. Please log in again.");
        setLoadingMatches(false);
        return;
      }

      setLoadingMatches(true);
      setError(null);
      setMatchedProfiles([]);

      try {
        const {
          gotra,
          ageRange,
          heightRange,
          preferredIncomeRange,
          profileFor,
          preferredMaritalStatus,
          preferredManglikStatus,
          preferredDiet,
          preferredMotherTongues,
          preferredSubCastes,
          preferredGuruMathas,
          preferredGotras,
          preferredNakshatras,
          preferredRashis,
          preferredEducation,
          preferredProfessions,
          preferredHobbies,
          preferredCountries,
          preferredCities,
          preferredNativeOrigins,
        } = userProfileData;

        const searchQuery = {
          userOwnGotra: gotra || null,
          profile_id: userProfileData.profile_id || userProfileData.profileId,
          minPreferredAge: ageRange ? ageRange[0] : null,
          maxPreferredAge: ageRange ? ageRange[1] : null,
          minPreferredHeightCm: heightRange ? heightRange[0] : null,
          maxPreferredHeightCm: heightRange ? heightRange[1] : null,
          minPreferredIncome: preferredIncomeRange ? preferredIncomeRange[0] : null,
          maxPreferredIncome: preferredIncomeRange ? preferredIncomeRange[1] : null,
          preferredProfileFor: profileFor || null,
          preferredMaritalStatus: preferredMaritalStatus || null,
          preferredManglikStatus: preferredManglikStatus || null,
          preferredDiet: preferredDiet || null,
          preferredMotherTongues: preferredMotherTongues || [],
          preferredSubCastes: preferredSubCastes || [],
          preferredGuruMathas: preferredGuruMathas || [],
          preferredNakshatras: preferredNakshatras || [],
          preferredRashis: preferredRashis || [],
          preferredEducation: preferredEducation || [],
          preferredProfessions: preferredProfessions || [],
          preferredHobbies: preferredHobbies || [],
          preferredCountries: preferredCountries || [],
          preferredCities: preferredCities || [],
          preferredNativeOrigins: preferredNativeOrigins || [],
          preferredGotras: preferredGotras || [],
        };

        console.log("🔍 Sending match search request with payload:", searchQuery);

        const response = await fetch(`${getBaseUrl()}/api/matchProfiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(searchQuery),
        });

        if (response.status === 401) {
            throw new Error('Authentication required for matches. Your session might have expired. Please log in.');
        }

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
        if (err.message.includes("Authentication required") || err.message.includes("Invalid token")) {
          navigate('/login');
        }
      } finally {
        setLoadingMatches(false);
      }
    };

    if (userProfileData && !error) {
      findMatches();
    }
  }, [userProfileData, error, navigate]);

  const visibleProfiles = matchedProfiles.slice(0, VISIBLE_COUNT);

  // --- Photo Loading Logic ---
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

/*    if (matchedProfiles.length > 0) {
      loadAllProfilePhotos(matchedProfiles);
    } else {
      setProfilePhotoUrls({});
      setLoadingPhotos(false);
    }
  }, [matchedProfiles]);
*/
if (visibleProfiles.length > 0) {
  loadAllProfilePhotos(visibleProfiles);
} else {
  setProfilePhotoUrls({});
  setLoadingPhotos(false);
}
}, [visibleProfiles]);

  // Helper to get profile photo URL from state
  const getProfilePhotoUrl = useCallback((id) => {
    return profilePhotoUrls[id] || `${getBaseUrl()}${FALLBACK_DEFAULT_IMAGE_PATH}`;
  }, [profilePhotoUrls]);

  // Card click handler
  // --- Card click handler - MODIFIED ---
  const handleCardClick = useCallback((id) => {
    const authToken = sessionStorage.getItem('token'); // Check authentication status

    if (authToken) {
      // User is logged in, navigate to the specific profile details page
      console.log(`Navigating to profile details for ID: ${id}`);
      navigate(`/view-profile/${id}`); // <-- Navigate to the new view page
    } else {
      // User is not logged in, prompt them to log in
      alert('Please log in to view profile details.'); // Or use a Material-UI Dialog
      navigate('/login'); // Redirect to login page
    }
  }, [navigate]);

  // --- Render Logic ---
  if (loadingUserPreferences) {
    return (
      <div className="flex items-center justify-center py-8">
        <Typography variant="h6" className="text-indigo-800">
          Loading your preferences to find matches...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </div>
    );
  }

  return (
    <>
      {/* Loading spinner for match search or photo loading */}
      {loadingMatches || loadingPhotos ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
            {loadingMatches ? "Finding your perfect matches..." : "Loading match photos..."}
          </Typography>
        </Box>
      ) : matchedProfiles.length > 0 ? (
        // REMOVED: All wrapper divs and sections that were adding extra styling
        // Use only the cards container with proper CSS module styling
        <div className={styles.cardsContainer}>
          {visibleProfiles.map((profile) => (
            <ProfileCard
              key={profile.profile_id}
              profile={profile}
              imageUrl={getProfilePhotoUrl(profile.profile_id)}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        <Typography align="center" className="text-gray-700 py-4">
          No matches found based on your preferences.
        </Typography>
      )}
    </>
  );
};

export default Matches;