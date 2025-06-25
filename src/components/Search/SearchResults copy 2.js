// src/components/Search/SearchResults.js
import React, { useState, useEffect } from "react";
import { Typography, Box, Grid } from "@mui/material"; // Removed Paper, added Box, Grid
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getBaseUrl from '../../utils/GetUrl';

const API_BASE_URL = `${getBaseUrl()}`;
const BACKEND_DEFAULT_IMAGE_URL = '/ProfilePhotos/defaultImage.jpg';

const SearchResults = ({ results }) => {
  const navigate = useNavigate();
  const [hoverMessage, setHoverMessage] = useState(null);
  const [profilePhotos, setProfilePhotos] = useState({});

  useEffect(() => {
    if (results && results.length > 0) {
      // setHoverMessage('Click anywhere to go to the main page for more details.'); // Keep this if you want the message
      fetchPhotos();
    } else {
      setHoverMessage(null);
    }
  }, [results]);

  const fetchPhotos = async () => {
    const photosByProfile = {};
    for (const profile of results) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/get-photos?profileId=${profile.profile_id}`);
        photosByProfile[profile.profile_id] = response.data.map(photo => {
          // Extract just the filename from the full path
          const parts = photo.photo_path.split("/"); // Split by both / and \
          const filename = parts[parts.length - 1];
          return {
            path: `/ProfilePhotos/${filename}`, // Create a relative path
            isDefault: photo.is_default === 1, // Ensure boolean conversion
            filename: filename
          };
        });
      } catch (error) {
        console.error(`Error fetching photos for profile ${profile.profile_id}:`, error);
        photosByProfile[profile.profile_id] = [];
      }
    }
    setProfilePhotos(photosByProfile);
  };

  const getDefaultPhotoUrl = (profileId) => {
    const photos = profilePhotos[profileId];
    if (photos && photos.length > 0) {
      const defaultPhoto = photos.find(photo => photo.isDefault);
      if (defaultPhoto) {
        return `${API_BASE_URL}${defaultPhoto.path}`;
      } else if (photos.length > 0) {
        return `${API_BASE_URL}${photos[0].path}`;
      }
    }
    return `${API_BASE_URL}${BACKEND_DEFAULT_IMAGE_URL}`;
  };

  const handlePaperClick = () => {
    if (results && results.length > 0) {
      alert('To see more details, please log in or register.');
      navigate('/');
    }
  };

  return (
    // Replaced Paper with a div that mimics the styling of internal sections
    <div
      className="p-6 bg-gray-50 rounded-lg shadow-inner mt-4" // Adjusted styling for a more integrated look
      style={{ cursor: results && results.length > 0 ? 'pointer' : 'default' }}
      onClick={handlePaperClick}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2> {/* Changed to h2 */}
      {hoverMessage && (
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', marginBottom: 1 }}>
          {hoverMessage}
        </Typography>
      )}
      {results && results.length > 0 ? (
        <div>
          {results.map((result, index) => (
            <Box key={index} sx={{ mb: 3, paddingBottom: 3, borderBottom: '1px solid #e0e0e0', '&:last-child': { borderBottom: 'none', mb: 0, paddingBottom: 0 } }}>
              <Grid container spacing={2} alignItems="center">
                {/* Profile Photo (Left Side) */}
                <Grid item xs={3} sm={2}>
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 80,
                      height: 'auto',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={getDefaultPhotoUrl(result.profile_id)}
                      alt={result.name || 'Profile Photo'}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.src = `${API_BASE_URL}${BACKEND_DEFAULT_IMAGE_URL}`;
                      }}
                    />
                  </Box>
                </Grid>

                {/* Profile Details (Right Side) */}
                <Grid item xs={9} sm={10}>
                  <div className="font-medium text-gray-700">
                    <strong>Profile ID:</strong> {result.profile_id}
                  </div>
                  <div className="text-gray-700">
                    <strong>Name:</strong> {result.name}
                  </div>
                  <div className="text-gray-700">
                    <strong>Profile For:</strong> {result.profile_for}
                  </div>
                  {result.hasOwnProperty('gotra') && (
                    <div className="text-gray-700">
                      <strong>Gotra:</strong> {result.gotra}
                    </div>
                  )}
                </Grid>
              </Grid>
              {/* Removed the <hr> as border-bottom on Box handles it */}
            </Box>
          ))}
        </div>
      ) : (
        <Typography align="center" className="text-gray-700 mt-4">No results found</Typography>
      )}
    </div>
  );
};

export default SearchResults;