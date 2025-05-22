import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    IconButton,
    Paper,
    Grid
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';
const BACKEND_DEFAULT_IMAGE_URL = '/ProfilePhotos/defaultImage.jpg';

const SharingContactDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const profile = state ? state.profile : null;
    const userEmail = sessionStorage.getItem('userEmail') || '';
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailAddress, setEmailAddress] = useState(userEmail);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [profilePhotos, setProfilePhotos] = useState({});

    useEffect(() => {
        const fetchPhotos = async () => {
            if (profile) {
                const photosByProfile = {};
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/get-photos?profileId=${profile.profile_id}`);
                    photosByProfile[profile.profile_id] = response.data.map(photo => {
                        const parts = photo.photo_path.split("/");
                        const filename = parts[parts.length - 1];
                        return {
                            path: `/ProfilePhotos/${filename}`,
                            isDefault: photo.is_default === 1,
                            filename: filename
                        };
                    });
                } catch (error) {
                    console.error(`Error fetching photos for profile ${profile.profile_id}:`, error);
                    photosByProfile[profile.profile_id] = [];
                }
                setProfilePhotos(photosByProfile);
            }
        };

        fetchPhotos();
    }, [profile]);

    const getDefaultPhotoUrl = (profileId) => {
        const photos = profilePhotos[profileId];
        if (!photos || photos.length === 0) {
            return `${API_BASE_URL}${BACKEND_DEFAULT_IMAGE_URL}`;
        }
        const defaultPhoto = photos.find(photo => photo.isDefault);
        return defaultPhoto ? `${API_BASE_URL}${defaultPhoto.path}` : `${API_BASE_URL}${photos[0].path}`;
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (!profile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Typography variant="h6">No contact details available.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Top back arrow */}
            <IconButton onClick={handleGoBack} sx={{ mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom>
                Contact Details for {profile.name}
            </Typography>

            <Box id="printable-contact-details">
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4} md={3} lg={2}>
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: 150,
                                    height: 'auto',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={getDefaultPhotoUrl(profile.profile_id)}
                                    alt={profile.name || 'Profile Photo'}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={8} md={5} lg={5}>
                            <Typography variant="subtitle1"><strong>Profile ID:</strong> {profile.profile_id}</Typography>
                            <Typography variant="subtitle1"><strong>Married Status:</strong> {profile.married_status}</Typography>
                            <Typography variant="subtitle1"><strong>Name:</strong> {profile.name}</Typography>
                            <Typography variant="subtitle1"><strong>Current Location:</strong> {profile.current_location}</Typography>
                            <Typography variant="subtitle1"><strong>Mother Tongue:</strong> {profile.mother_tongue}</Typography>
                            <Typography variant="subtitle1"><strong>Gotra:</strong> {profile.gotra}</Typography>
                            <Typography variant="subtitle1"><strong>Age:</strong> {profile.current_age}</Typography>
                            <Typography variant="subtitle1"><strong>Father Name:</strong> {profile.father_name}</Typography>
                            <Typography variant="subtitle1"><strong>Siblings:</strong> {profile.siblings}</Typography>
                        </Grid>

                        <Grid item xs={12} md={4} lg={5}>
                            <Typography variant="subtitle1"><strong>Expectations:</strong> {profile.expectations}</Typography>
                            <Typography variant="subtitle1"><strong>Phone Number:</strong> {profile.phone}</Typography>
                            <Typography variant="subtitle1"><strong>Communication Address:</strong> {profile.communication_address}</Typography>
                            <Typography variant="subtitle1"><strong>Education:</strong> {profile.education}</Typography>
                            <Typography variant="subtitle1"><strong>Profession:</strong> {profile.profession}</Typography>
                            <Typography variant="subtitle1"><strong>Designation:</strong> {profile.designation}</Typography>
                            <Typography variant="subtitle1"><strong>Current Company:</strong> {profile.current_company}</Typography>
                            <Typography variant="subtitle1"><strong>Annual Income:</strong> {profile.annual_income}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Back to Results Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGoBack}
                >
                    Back to Search Results
                </Button>
            </Box>

            {/* 
            // Email and Print functionality is commented for now

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={handlePrintReport}
                >
                    Print Report
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    onClick={handleEmailDialogOpen}
                >
                    Email Report
                </Button>
            </Box>

            <Dialog open={emailDialogOpen} onClose={handleEmailDialogClose}>
                <DialogTitle>
                    Send Contact Details Report
                    <IconButton
                        aria-label="close"
                        onClick={handleEmailDialogClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Enter the email address where you would like to receive this report:
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEmailDialogClose}>Cancel</Button>
                    <Button
                        onClick={handleEmailSend}
                        variant="contained"
                        disabled={!emailAddress || !emailAddress.includes('@')}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            */}
        </Box>
    );
};

export default SharingContactDetails;
