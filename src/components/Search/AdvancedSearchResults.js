// src/components/Search/AdvancedSearchResults.js
// This is a direct copy of SearchResults.js, intended for separate development
import React, { useState, useEffect } from "react";
import { Typography, Box, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../../utils/GetUrl';
// Import only the specific functions needed
import { fetchDefaultPhoto } from '../UploadProfilePhoto/photoUploadUtils';

// Ensure API_BASE_URL is correctly set based on your environment
const API_BASE_URL = `${getBaseUrl()}`;
const FALLBACK_DEFAULT_IMAGE_PATH = '/ProfilePhotos/defaultImage.jpg'; // Path relative to your client's public folder or API_BASE_URL

const AdvancedSearchResults = ({ results }) => {
  const navigate = useNavigate();
  const [profilePhotoUrls, setProfilePhotoUrls] = useState({});
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  useEffect(() => {
    console.log("[AdvancedSearchResults][useEffect] Triggered with results:", results);
    if (results && results.length > 0) {
      loadAllProfilePhotos(results);
    } else {
      // Clear state when no results
      console.log("[AdvancedSearchResults][useEffect] No results, clearing photo state.");
      setProfilePhotoUrls({});
      setLoadingPhotos(false);
    }
  }, [results]); // Dependency array: re-run when results change

  const loadAllProfilePhotos = async (resultsData) => {
    console.log('[AdvancedSearchResults][loadAllProfilePhotos] Starting photo loading process.');
    setLoadingPhotos(true);

    const photoPromises = resultsData.map(async (result) => {
      const profileId = result.profile_id || result.profileId; // Use profile_id or profileId
      if (!profileId) {
        console.warn("[AdvancedSearchResults][loadAllProfilePhotos] Profile missing profile_id/profileId. Skipping photo fetch and using fallback.");
        return { profileId: 'unknown', photoUrl: `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}` };
      }
      console.log(`[AdvancedSearchResults][loadAllProfilePhotos][${profileId}] Calling fetchDefaultPhoto...`);

      // Variables to hold the fetched photo URL and potential error
      let photoUrl = `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`; // Default to fallback
      let currentFetchError = null; // To capture errors from fetchDefaultPhoto

      // These temporary setters will be passed to fetchDefaultPhoto in photoUploadUtils.js.
      // fetchDefaultPhoto will call these to update its internal state, but here we capture
      // the values to update our local 'photoUrl' and 'currentFetchError'.
      const tempDefaultPhoto = (photoObj) => {
        if (photoObj && photoObj.fullUrl) {
          photoUrl = photoObj.fullUrl; // Set the photoUrl if successful
        }
      };
      const tempSetFetchError = (errorMsg) => {
        currentFetchError = errorMsg; // Capture the error message
      };

      try {
        // Await the fetchDefaultPhoto call which internally handles its Axios call and success/error logic.
        // It will call tempDefaultPhoto or tempSetFetchError based on its outcome.
        await fetchDefaultPhoto(profileId, tempDefaultPhoto, tempSetFetchError);

        // After fetchDefaultPhoto completes, check if it reported an error
        if (currentFetchError) {
          console.warn(`[AdvancedSearchResults][loadAllProfilePhotos][${profileId}] fetchDefaultPhoto reported an error: ${currentFetchError}. Using fallback.`);
          photoUrl = `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`; // Ensure fallback on error
        }

      } catch (err) {
        // This outer catch block would only be hit if fetchDefaultPhoto itself throws an unhandled exception,
        // which it should not if its internal try/catch is robust.
        console.error(`[AdvancedSearchResults][loadAllProfilePhotos][${profileId}] Unexpected error from fetchDefaultPhoto:`, err);
        photoUrl = `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`; // Ensure fallback on unexpected error
      }

      console.log(`[AdvancedSearchResults][loadAllProfilePhotos][${profileId}] Final URL after fetchDefaultPhoto:`, photoUrl);
      return { profileId, photoUrl };
    });

    const photoResults = await Promise.all(photoPromises);
    const photoMap = {};

    photoResults.forEach(({ profileId, photoUrl }) => {
      photoMap[profileId] = photoUrl;
      console.log(`[AdvancedSearchResults][loadAllProfilePhotos] Storing final URL for ${profileId} in photoMap: ${photoUrl}`);
    });

    console.log('[AdvancedSearchResults][loadAllProfilePhotos] All photo promises resolved. Final photoMap before setting state:', photoMap);
    setProfilePhotoUrls(photoMap); // Update state once all promises are resolved
    console.log('[AdvancedSearchResults][loadAllProfilePhotos] profilePhotoUrls state updated. Done loading photos.');
    setLoadingPhotos(false);
  };

  // Helper function to get profile photo URL
  const getProfilePhotoUrl = (profileId) => {
    const url = profilePhotoUrls[profileId];
    if (url) {
        return url;
    }
    console.log(`[getProfilePhotoUrl][${profileId}] No URL found in state or state not yet updated, returning initial fallback.`);
    return `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`;
  };

  /*const handleCardClick = (profileId) => {
    alert(`Clicked on profile: ${profileId}. To see more details, please log in or register.`);
    navigate('/');
  };
*/
const handleCardClick = (profileId) => {
  if (!profileId) {
    console.warn("[AdvancedSearchResults] handleCardClick called without profileId");
    return;
  }

  const token = sessionStorage.getItem('token');

  if (!token) {
    alert(`To see the details for profile ${profileId}, please log in or register.`);
    // If your login page is '/', change '/login' to '/' here
    navigate('/login');
    return;
  }

  console.log(`[AdvancedSearchResults] Navigating to view-profile for profileId: ${profileId}`);
  navigate(`/view-profile/${profileId}`);
};

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Advanced Search Results</h2> {/* Changed title */}

      {loadingPhotos && results && results.length > 0 ? (
        <div className="flex items-center justify-center p-8 text-indigo-800">
          <svg className="animate-spin h-8 w-8 mr-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading profile photos...
        </div>
      ) : results && results.length > 0 ? (
        <Grid container spacing={3}>
          {results.map((result, index) => {
            const currentProfileId = result.profile_id || result.profileId; // Use profile_id or profileId
            const imageUrl = getProfilePhotoUrl(currentProfileId);
            console.log(`[AdvancedSearchResults Render Loop][${currentProfileId}] Final image URL for render:`, imageUrl);
            return (
              <Grid
                key={currentProfileId || index}
                sx={{
                  width: {
                    xs: '100%',
                    sm: '50%',
                    md: '33.33%',
                    lg: '25%',
                  },
                  padding: (theme) => theme.spacing(1.5),
                }}
              >
                <Box
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleCardClick(currentProfileId)}
                >
                  {/* Image Section */}
                  <Box sx={{ width: '100%', height: 200, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                      src={imageUrl}
                      alt={result.name || 'Profile Photo'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop on error
                        // Only set fallback if the current src is not already the fallback
                        if (e.target.src !== `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`) {
                            e.target.src = `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`;
                            console.error(`[AdvancedSearchResults][${currentProfileId}] Image element failed to load its src. Setting fallback. Error:`, e);
                        } else {
                            console.warn(`[AdvancedSearchResults][${currentProfileId}] Image element already showing fallback. No further action needed.`);
                        }
                      }}
                      onLoad={() => {
                        console.log(`[AdvancedSearchResults][${currentProfileId}] Image element successfully loaded URL:`, imageUrl);
                      }}
                    />
                  </Box>

                  {/* Details Section */}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" component="div" className="font-semibold text-gray-900 mb-1">
                      {result.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="text-gray-700">
                      <strong>Age:</strong> {result.current_age || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="text-gray-700">
                      <strong>Height:</strong> {result.height || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="text-gray-700">
                      <strong>Location:</strong> {result.current_location || 'N/A'}
                    </Typography>
                    {result.gotra && (
                      <Typography variant="body2" color="text.secondary" className="text-gray-700">
                        <strong>Gotra:</strong> {result.gotra}
                      </Typography>
                    )}
                    {currentProfileId && (
                      <Typography variant="caption" color="text.secondary" className="text-xs mt-2 block">
                        Profile ID: {currentProfileId}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography align="center" className="text-gray-700 mt-4">No results found</Typography>
      )}
    </div>
  );
};

export default AdvancedSearchResults;