import React, { useState, useEffect } from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';
const BACKEND_DEFAULT_IMAGE_URL = '/ProfilePhotos/defaultImage.jpg';

const SearchResults = ({ results }) => {
  const navigate = useNavigate();
  const [hoverMessage, setHoverMessage] = useState(null);
  const [profilePhotos, setProfilePhotos] = useState({});

  useEffect(() => {
    if (results && results.length > 0) {
      // setHoverMessage('Click anywhere to go to the main page for more details.');
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
          const parts = photo.photo_path.split("/"]/); // Split by both / and \
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
    <Paper
      elevation={3}
      sx={{ padding: 2, marginTop: 3, cursor: results && results.length > 0 ? 'pointer' : 'default' }}
      onClick={handlePaperClick}
    >
      <Typography variant="h6">Search Results</Typography>
      {hoverMessage && (
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', marginBottom: 1 }}>
          {hoverMessage}
        </Typography>
      )}
      {results && results.length > 0 ? (
        <div>
          {results.map((result, index) => (
            <Box key={index} sx={{ mb: 2 }}>
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
                  <div>
                    <strong>Profile ID:</strong> {result.profile_id}
                  </div>
                  <div>
                    <strong>Name:</strong> {result.name}
                  </div>
                  <div>
                    <strong>Profile For:</strong> {result.profile_for}
                  </div>
                  {result.hasOwnProperty('gotra') && (
                    <div>
                      <strong>Gotra:</strong> {result.gotra}
                    </div>
                  )}
                </Grid>
              </Grid>
              <hr style={{ margin: '8px 0', borderTop: '1px solid #eee' }} />
            </Box>
          ))}
        </div>
      ) : (
        <Typography>No results found</Typography>
      )}
    </Paper>
  );
};

export default SearchResults;