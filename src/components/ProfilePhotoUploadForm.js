import React, { useState } from 'react';
   import { Paper, Typography, TextField, Button, Grid, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
   import SearchIcon from '@mui/icons-material/Search';
   import { handleSearchProfile, handleSearchCriteriaChange, handlePhotoChange, handleUploadPhotos, getUploadedPhotos, fetchDefaultPhoto } from '../utils/photoUploadUtils';

   const ProfilePhotoUploadForm = () => {
       const [searchCriteria, setSearchCriteria] = useState({
           profileId: '',
           email: '',
           phone: '',
       });
       const [profileData, setProfileData] = useState(null);
       const [photos, setPhotos] = useState([]);
       const [photoPreviews, setPhotoPreviews] = useState([]);
       const [uploading, setUploading] = useState(false);
       const [uploadError, setUploadError] = useState(null);
       const [fetchError, setFetchError] = useState(null);
       const [searching, setSearching] = useState(false);
       const [uploadedPhotos, setUploadedPhotos] = useState([]);
       const [gettingPhotos, setGettingPhotos] = useState(false);
       const [isDefaultPhoto, setIsDefaultPhoto] = useState(false);
       const [defaultPhoto, setDefaultPhoto] = useState(null);

       const handleSearchCriteriaChangeLocal = (event) => {
           handleSearchCriteriaChange(event, setSearchCriteria, setProfileData, setPhotos, setPhotoPreviews, setFetchError, setUploadedPhotos, setDefaultPhoto);
       };

       const handleSearchProfileLocal = async () => {
           await handleSearchProfile(searchCriteria, setProfileData, setFetchError, setSearching, setUploadedPhotos, setDefaultPhoto, setUploadError, getUploadedPhotos, fetchDefaultPhoto);
       };

       const handlePhotoChangeLocal = (event) => {
           handlePhotoChange(event, setPhotos, setPhotoPreviews);
       };

       const handleUploadPhotosLocal = async () => {
           await handleUploadPhotos(profileData, photos, isDefaultPhoto, setUploading, setUploadError, setPhotos, setPhotoPreviews, setIsDefaultPhoto, getUploadedPhotos, fetchDefaultPhoto, setUploadedPhotos, setDefaultPhoto);
       };

       return (
           <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
               <Typography variant="h5" gutterBottom>
                   Upload Photos to Profile
               </Typography>

               <Grid container spacing={2} alignItems="center">
                   <Grid item xs={12} sm={6} md={4}>
                       <TextField
                           fullWidth
                           label="Profile ID"
                           name="profileId"
                           value={searchCriteria.profileId}
                           onChange={handleSearchCriteriaChangeLocal}
                       />
                   </Grid>
                   <Grid item xs={12} sm={6} md={4}>
                       <TextField
                           fullWidth
                           label="Email"
                           name="email"
                           value={searchCriteria.email}
                           onChange={handleSearchCriteriaChangeLocal}
                       />
                   </Grid>
                   <Grid item xs={12} sm={6} md={4}>
                       <TextField
                           fullWidth
                           label="Phone Number"
                           name="phone"
                           value={searchCriteria.phone}
                           onChange={handleSearchCriteriaChangeLocal}
                       />
                   </Grid>
                   <Grid item xs={12}>
                       <Button
                           fullWidth
                           variant="contained"
                           color="primary"
                           onClick={handleSearchProfileLocal}
                           startIcon={<SearchIcon />}
                           disabled={searching}
                           sx={{ mt: 2 }}
                       >
                           {searching ? 'Searching...' : 'Search Profile'}
                       </Button>
                   </Grid>
               </Grid>

               {fetchError && <Typography color="error" sx={{ mt: 2 }}>{fetchError}</Typography>}

               {profileData && (
                   <div sx={{ mt: 2 }}>
                       <Typography variant="h6">Profile Details</Typography>
                       <Typography>Name: {profileData.name}</Typography>
                       {profileData.current_age && <Typography>Current Age: {profileData.current_age}</Typography>}
                       {profileData.gotra && <Typography>Gotra: {profileData.gotra}</Typography>}

                       <input
                           type="file"
                           name="photos"
                           multiple
                           accept="image/*"
                           onChange={handlePhotoChangeLocal}
                           style={{ marginTop: 20 }}
                       />
                       {photoPreviews.length > 0 && (
                           <div style={{ display: 'flex', marginTop: 10 }}>
                               {photoPreviews.map((preview, index) => (
                                   <img
                                       key={index}
                                       src={preview}
                                       alt={`preview-${index}`}
                                       style={{ width: 80, height: 80, marginRight: 10, objectFit: 'cover' }}
                                   />
                               ))}
                           </div>
                       )}
                       <FormControlLabel
                           control={
                               <Checkbox
                                   checked={isDefaultPhoto}
                                   onChange={(e) => setIsDefaultPhoto(e.target.checked)}
                                   name="isDefaultPhoto"
                                   color="primary"
                               />
                           }
                           label="Set as Default Photo"
                           sx={{ mt: 2 }}
                       />

                       <Button
                           variant="contained"
                           color="secondary"
                           onClick={handleUploadPhotosLocal}
                           disabled={photos.length === 0 || uploading || !profileData}
                           sx={{ mt: 2 }}
                       >
                           {uploading ? (
                               <>
                                   <CircularProgress size={20} sx={{ mr: 1 }} />
                                   Uploading...
                               </>
                           ) : (
                               'Upload Photos'
                           )}
                       </Button>
                       {uploadError && <Typography color="error" sx={{ mt: 2 }}>{uploadError}</Typography>}

                       <Typography variant="h6" sx={{ mt: 4 }}>Uploaded Photos</Typography>
                       {gettingPhotos ? (
                           <CircularProgress sx={{ mt: 2 }} />
                       ) : (
                           <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 10 }}>
                               {uploadedPhotos.length > 0 ? (
                                   uploadedPhotos.map((photo, index) => (
                                       <div key={index} style={{ marginRight: 10, marginBottom: 10 }}>
                                           <img
                                               src={`http://localhost:3001/${photo.path}`}
                                               alt={`uploaded-${index}`}
                                               style={{ width: 100, height: 100, objectFit: 'cover' }}
                                           />
                                           {photo.isDefault && <Typography variant="caption">Default</Typography>}
                                       </div>
                                   ))
                               ) : (
                                   <Typography>No photos uploaded yet.</Typography>
                               )}
                           </div>
                       )}

                       <Typography variant="h6" sx={{ mt: 4 }}>Default Photo</Typography>
                       {defaultPhoto ? (
                           <img
                               src={`http://localhost:3001/${defaultPhoto}`}
                               alt="Default Profile"
                               style={{ width: 150, height: 150, objectFit: 'cover' }}
                           />
                       ) : (
                           <Typography>No default photo set.</Typography>
                       )}
                   </div>
               )}
           </Paper>
       );
   };

   export default ProfilePhotoUploadForm;