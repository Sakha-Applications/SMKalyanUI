// src/components/Search/SearchResults.js
import React, { useState, useEffect } from "react";
import { Typography, Box, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../../utils/GetUrl';
import { fetchDefaultPhoto } from '../UploadProfilePhoto/photoUploadUtils'; // Import the utility

const API_BASE_URL = `${getBaseUrl()}`;
const FALLBACK_DEFAULT_IMAGE_PATH = '/ProfilePhotos/defaultImage.jpg';

const SearchResults = ({ results }) => {
  const navigate = useNavigate();
  const [hoverMessage, setHoverMessage] = useState(null);
  const [profilePhotoUrls, setProfilePhotoUrls] = useState({});
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  useEffect(() => {
    console.log("[SearchResults] useEffect triggered. Results:", results);
    if (results && results.length > 0) {
      loadAllProfilePhotos(results);
    } else {
      setHoverMessage(null);
      setProfilePhotoUrls({});
      setLoadingPhotos(false);
    }
  }, [results]);

  // HELPER FUNCTION TO PROMISIFY fetchDefaultPhoto
  const promisifiedFetchDefaultPhoto = (profileId) => {
    return new Promise((resolve) => {
      fetchDefaultPhoto(
        profileId,
        (photoObject) => { // Success callback
          if (photoObject && photoObject.fullUrl) {
            resolve(photoObject.fullUrl); // Resolve with the URL
          } else {
            resolve(`${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`); // Resolve with fallback if no photo
          }
        },
        (error) => { // Error callback
          console.error(`[SearchResults] Raw error from fetchDefaultPhoto for ${profileId}:`, error);
          resolve(`${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`); // Resolve with fallback on error
        }
      );
    });
  };

  const loadAllProfilePhotos = async (profiles) => {
    setLoadingPhotos(true);
    const urlsMap = {};

    const fetchPromises = profiles.map(async (profile) => {
      const photoUrl = await promisifiedFetchDefaultPhoto(profile.profile_id); // Await the promisified function
      urlsMap[profile.profile_id] = photoUrl;
      console.log(`[SearchResults] Storing URL for ${profile.profile_id}:`, photoUrl);
    });

    await Promise.all(fetchPromises); // Wait for all individual photo fetches to complete

    setProfilePhotoUrls(urlsMap); // Update state only once all are done
    setLoadingPhotos(false);
    console.log("[SearchResults] All profile photos loaded:", urlsMap);
  };

  const getProfilePhotoUrl = (profileId) => {
    return profilePhotoUrls[profileId] || `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`;
  };

  const handleCardClick = (profileId) => {
    alert(`Clicked on profile: ${profileId}. To see more details, please log in or register.`);
    navigate('/');
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
      {hoverMessage && (
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', marginBottom: 1 }}>
          {hoverMessage}
        </Typography>
      )}

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
            const imageUrl = getProfilePhotoUrl(result.profile_id);
            console.log(`[SearchResults Render] Image URL for ${result.profile_id} (Name: ${result.name}):`, imageUrl);
            return (
              <Grid
                key={result.profile_id || index}
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
                  onClick={() => handleCardClick(result.profile_id)}
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
                        e.target.onerror = null;
                        e.target.src = `${API_BASE_URL}${FALLBACK_DEFAULT_IMAGE_PATH}`;
                        console.error(`[SearchResults] Image element failed to load for ${result.profile_id}. Setting fallback. Error:`, e);
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
                    {result.profile_id && (
                      <Typography variant="caption" color="text.secondary" className="text-xs mt-2 block">
                        Profile ID: {result.profile_id}
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