// src/modules/search/components/SearchResults.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Grid } from "@mui/material";
import profileService from "../../../services/profileService";
import {
  designClasses,
} from "../../../shared/styles/designTokens";

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
    <div
      className={`mt-4 rounded-xl p-5 ${designClasses.surfaceMuted}`}
    >
      <h2
        className={`mb-4 text-xl font-semibold ${designClasses.textPrimary}`}
      >
        Search Results
      </h2>
      
      {loadingPhotos && results && results.length > 0 ? (
        <div
          className={`flex items-center justify-center p-8 ${designClasses.textPrimary}`}
        >
          <svg
  className={`mr-3 h-8 w-8 animate-spin ${designClasses.textAccent}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  className={`${designClasses.card} overflow-hidden transition hover:shadow-md`}
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
                    <Typography
  variant="h6"
  component="div"
  className={`mb-1 font-semibold ${designClasses.textPrimary}`}
>
                      {result.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className={designClasses.textSecondary}>
                      <strong>Age:</strong> {result.current_age || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className={designClasses.textSecondary}>
                      <strong>Height:</strong> {result.height || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className={designClasses.textSecondary}>
                      <strong>Location:</strong> {result.current_location || 'N/A'}
                    </Typography>
                    {result.gotra && (
                      <Typography variant="body2" color="text.secondary" className={designClasses.textSecondary}>
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
        <Typography
  align="center"
  className={`mt-4 ${designClasses.textSecondary}`}
>
  No matching profiles found.
</Typography>
      )}
      
    </div>
  );
};

export default SearchResults;