// src/modules/search/components/SearchResults.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Grid } from "@mui/material";
import profileService from "../../../services/profileService";

const FALLBACK_DEFAULT_IMAGE_PATH = "/ProfilePhotos/defaultImage.jpg";

const SearchResults = ({ results }) => {
  const navigate = useNavigate();
  const [profilePhotoUrls, setProfilePhotoUrls] = useState({});
const [loadingPhotos, setLoadingPhotos] = useState(true);
  

  useEffect(() => {
  if (results && results.length > 0) {
    loadAllProfilePhotos(results);
  } else {
    setProfilePhotoUrls({});
    setLoadingPhotos(false);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [results]);

  const loadAllProfilePhotos = async (resultsData) => {
  setLoadingPhotos(true);

  const photoPromises = resultsData.map(async (result) => {
    const profileId = result.profile_id || result.profileId;

    if (!profileId) {
      return {
        profileId: "unknown",
        photoUrl: FALLBACK_DEFAULT_IMAGE_PATH,
      };
    }

    let photoUrl = FALLBACK_DEFAULT_IMAGE_PATH;

try {
  const photo =
    await profileService.getDefaultPhoto(profileId);

  if (photo?.fullUrl) {
    photoUrl = photo.fullUrl;
  }
} catch (error) {
  console.error(
    `Unable to load photo for profile ${profileId}:`,
    error
  );
}

    return {
      profileId,
      photoUrl,
    };
  });

  const photoResults = await Promise.all(photoPromises);

  const photoMap = {};

  photoResults.forEach(({ profileId, photoUrl }) => {
    photoMap[profileId] = photoUrl;
  });

  setProfilePhotoUrls(photoMap);
  setLoadingPhotos(false);
};

  const getProfilePhotoUrl = (profileId) => {
  return profilePhotoUrls[profileId] || FALLBACK_DEFAULT_IMAGE_PATH;
};

const handleCardClick = (profileId) => {
  if (!profileId) {
    return;
  }

  navigate(`/view-profile/${profileId}`);
};

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
      
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
            const currentProfileId =
  result.profile_id || result.profileId;

const imageUrl = getProfilePhotoUrl(currentProfileId);
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
  onClick={() => handleCardClick(currentProfileId)} 
  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
  sx={{ 
    cursor: 'pointer', 
    display: 'block'
  }}
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
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_DEFAULT_IMAGE_PATH;
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

export default SearchResults;