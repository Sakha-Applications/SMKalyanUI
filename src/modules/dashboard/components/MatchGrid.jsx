// src/components/dashboard/MatchGrid.jsx
// This file functionally acts as the "Matches" component.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import profileService from "../../../services/profileService";
import dashboardDiscoveryService from "../../../services/dashboardDiscoveryService";

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
  const noPhotoCacheRef = React.useRef(new Set());

const [loadingPhotos, setLoadingPhotos] = useState(false);

const statusU = (
  sessionStorage.getItem("profileStatus") || ""
)
  .toString()
  .trim()
  .toUpperCase();

const approved = statusU === "APPROVED";

  // --- Step 1: Fetch Logged-in User's Profile and Preferences ---
  useEffect(() => {
    if (!approved) {
  setError("Your profile is under review. Matches will be available once your profile is approved.");
  setLoadingUserPreferences(false);
  return;
}

    const fetchUserPreferences = async () => {
      if (!profileId) {
        setError("Profile ID not available. Cannot fetch user preferences.");
        setLoadingUserPreferences(false);
        return;
      }

     setLoadingUserPreferences(true);
setError(null);

try {
  const data =
    await profileService.getMyProfile();

  setUserProfileData(data);
} catch (err) {
  console.error(
    "Unable to load match preferences:",
    err
  );

  if (err?.response?.status === 401) {
    navigate("/login");
    return;
  }

  setError(
    err?.response?.data?.error ||
      err?.response?.data?.message ||
      "Failed to load your preferences."
  );
} finally {
  setLoadingUserPreferences(false);
}
    };

    fetchUserPreferences();
  }, [profileId, navigate, approved]);

    // --- Step 2 & 3: Construct searchQuery & Execute Match Search ---
  useEffect(() => {
    const findMatches = async () => {

      if (!approved) return;


      if (!userProfileData || error) {
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

        const data =
  await dashboardDiscoveryService.getMatches(
    searchQuery
  );

setMatchedProfiles(
  Array.isArray(data) ? data : []
);
  } catch (err) {
  console.error(
    "Unable to load matches:",
    err
  );

  if (err?.response?.status === 401) {
    navigate("/login");
    return;
  }

  setError(
    err?.response?.data?.error ||
      err?.response?.data?.message ||
      "Failed to find matches. Please try again."
  );
      } finally {
        setLoadingMatches(false);
      }
    };

    if (userProfileData && !error) {
      findMatches();
    }
  }, [userProfileData, error, navigate, approved]);

const visibleProfiles = useMemo(
  () => matchedProfiles.slice(0, VISIBLE_COUNT),
  [matchedProfiles]
);


// --- Photo Loading Logic (FIXED) ---
useEffect(() => {
  const loadAllProfilePhotos = async (resultsData) => {
    setLoadingPhotos(true);

    const photoPromises = resultsData.map(async (result) => {
      const currentProfileId = result.profile_id || result.profileId;

      if (!currentProfileId) {
        return {
          profileId: 'unknown',
          photoUrl: FALLBACK_DEFAULT_IMAGE_PATH,
        };
      }

      let photoUrl = FALLBACK_DEFAULT_IMAGE_PATH;

      // Skip API call if we already know this profile has no photo
if (noPhotoCacheRef.current.has(currentProfileId)) {
  return {
    profileId: currentProfileId,
    photoUrl: FALLBACK_DEFAULT_IMAGE_PATH,
  };
}

try {
  const photo =
    await profileService.getDefaultPhoto(currentProfileId);

  if (photo?.fullUrl) {
    photoUrl = photo.fullUrl;
  } else {
    noPhotoCacheRef.current.add(currentProfileId);
  }
} catch (error) {
  console.error(
    `Unable to load photo for profile ${currentProfileId}:`,
    error
  );

  noPhotoCacheRef.current.add(currentProfileId);
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

  if (visibleProfiles.length > 0) {
    loadAllProfilePhotos(visibleProfiles);
  } else {
    setProfilePhotoUrls({});
    setLoadingPhotos(false);
  }
}, [visibleProfiles]);

  // Helper to get profile photo URL from state
  const getProfilePhotoUrl = useCallback((id) => {
    return (
  profilePhotoUrls[id] ||
  FALLBACK_DEFAULT_IMAGE_PATH
);
  }, [profilePhotoUrls]);

  // Card click handler
  // --- Card click handler - MODIFIED ---
  const handleCardClick = useCallback(
  (id) => {
    if (!id) {
      return;
    }

    navigate(`/view-profile/${id}`);
  },
  [navigate]
);

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
    {/* STEP-2: Show spinner ONLY while matches are loading (do not block UI for photos) */}
    {loadingMatches ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <svg
          className="animate-spin h-8 w-8 text-indigo-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>

        <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
          Finding your perfect matches...
        </Typography>
      </Box>
    ) : matchedProfiles.length > 0 ? (
      <div className={styles.cardsContainer}>
        {/* Optional: small indicator (non-blocking) */}
        {loadingPhotos && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6px 0' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Loading photos...
            </Typography>
          </div>
        )}

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