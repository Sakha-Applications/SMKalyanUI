// src/components/viewContactDetails/ContactDetailsResults.js
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
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Grid from '@mui/material/Unstable_Grid2'; // Import Grid v2
import getBaseUrl from '../../utils/GetUrl';

const API_BASE_URL = `${getBaseUrl()}`;
const BACKEND_DEFAULT_IMAGE_URL = '/ProfilePhotos/defaultImage.jpg'; // URL to your backend's default image

const ContactDetailsResults = ({ results, userEmail }) => {
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailAddress, setEmailAddress] = useState(userEmail || '');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [profilePhotos, setProfilePhotos] = useState({});
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchPhotos = async () => {
            console.log("🖼️ Fetching photos for profiles:", results.map(p => p.profile_id).join(', '));
            const photosByProfile = {};
            for (const profile of results) {
                try {
                    console.log(`🖼️ Fetching photos for profile ID: ${profile.profile_id}`);
                    const response = await axios.get(`${API_BASE_URL}/api/get-photos?profileId=${profile.profile_id}`);
                    console.log(`🖼️ Received photos for profile ${profile.profile_id}:`, response.data);
                    photosByProfile[profile.profile_id] = response.data.map(photo => {
                        const parts = photo.photo_path.split(/[\\\/]/);
                        const filename = parts[parts.length - 1];
                        return {
                            path: `/ProfilePhotos/${filename}`,
                            isDefault: photo.is_default === 1,
                            filename: filename
                        };
                    });
                    console.log(`🖼️ Processed photos for profile ${profile.profile_id}:`, photosByProfile[profile.profile_id]);
                } catch (error) {
                    console.error(`❌ Error fetching photos for profile ${profile.profile_id}:`, error);
                    photosByProfile[profile.profile_id] = [];
                }
            }
            console.log("🖼️ All profile photos fetched:", photosByProfile);
            setProfilePhotos(photosByProfile);
        };

        if (results && results.length > 0) {
            fetchPhotos();
        }
    }, [results]);

    const getDefaultPhotoUrl = (profileId) => {
        const photos = profilePhotos[profileId];
        if (!photos || photos.length === 0) {
            console.log(`🖼️ No photos found for profile ${profileId}, using default image`);
            return `${API_BASE_URL}${BACKEND_DEFAULT_IMAGE_URL}`;
        }
        const defaultPhoto = photos.find(photo => photo.isDefault);
        console.log(`🖼️ Default photo for profile ${profileId}:`, defaultPhoto);
        return defaultPhoto ? `${API_BASE_URL}${defaultPhoto.path}` : `${API_BASE_URL}${photos[0].path}`;
    };

    const handlePrintReport = () => {
        console.log("🖨️ Print report function called");
        const printableContent = document.getElementById('printable-contact-details');
        if (printableContent) {
            console.log("🖨️ Found printable content, preparing for print");
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = `
                <div style="padding: 20px;">
                    <h2 style="text-align: center; margin-bottom: 20px;">Contact Details Report</h2>
                    ${printableContent.innerHTML}
                    <p style="text-align: center; margin-top: 30px; font-size: 12px;">
                        Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                    </p>
                </div>
            `;
            console.log("🖨️ Opening print dialog");
            window.print();
            document.body.innerHTML = originalContents;
            console.log("🖨️ Print completed, restored original content");
        } else {
            console.error("❌ Error: 'printable-contact-details' element not found in the DOM.");
            setSnackbarMessage("Error: Could not prepare report for printing.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleEmailDialogOpen = () => {
        console.log("📧 Opening email dialog");
        setEmailDialogOpen(true);
    };

    const handleEmailDialogClose = () => {
        console.log("📧 Closing email dialog");
        setEmailDialogOpen(false);
    };

    const handleEmailSend = async () => {
        console.log("📧 Sending email report to:", emailAddress);
        try {
            setIsLoading(true);
            console.log("📧 Simulating email sending process");
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("📧 Email simulation completed successfully");
            setSnackbarMessage(`Report successfully sent to ${emailAddress}`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setEmailDialogOpen(false);
            // In a real implementation, you would call your API here
        } catch (error) {
            console.error('❌ Error sending email:', error);
            setSnackbarMessage('Failed to send email. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleGetDetails = async (profile) => {
        console.log("🔍 Getting details for profile:", profile);
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token'); 
            console.log("🔑 Token retrieved from session storage");
            
            if (!token) {
                console.error("❌ No authentication token found");
                setSnackbarMessage('Authentication error. Please log in again.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setIsLoading(false);
                return;
            }
            
            console.log(`🔄 Sending request to share contact details for profile ${profile.profile_id}`);
            console.log("📤 Request payload:", {
                sharedProfileId: profile.profile_id,
                sharedProfileName: profile.name
            });
            
            const response = await axios.post(
                `${API_BASE_URL}/api/share-contact-details`,
                {
                    sharedProfileId: profile.profile_id,
                    sharedProfileName: profile.name,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            
            console.log("📥 Received response:", response);
            console.log("✅ Contact details shared successfully");
            
            // Navigate to the new page and pass the profile details
            console.log("🧭 Navigating to sharing contact details page");
            navigate('/sharingcontactdetails', { state: { profile } });
        } catch (error) {
            console.error('❌ Error sharing contact details:', error);
            
            // Enhanced error logging
            if (error.response) {
                console.error('❌ Response error data:', error.response.data);
                console.error('❌ Response error status:', error.response.status);
                console.error('❌ Response error headers:', error.response.headers);
                
                // Check for specific 403 status (contact limit reached)
                if (error.response.status === 403) {
                    const errorMessage = error.response.data && error.response.data.message 
                        ? error.response.data.message 
                        : 'You have reached the maximum limit of free contacts. Please upgrade your account to view more contacts.';
                
                    console.error(`❌ Permission denied (403): ${errorMessage}`);
                    setSnackbarMessage(errorMessage);
                } else {
                    console.error(`❌ HTTP error: ${error.response.status}`);
                    setSnackbarMessage(`Server error (${error.response.status}): ${error.response.data?.message || 'Failed to get contact details'}`);
                }
            } else if (error.request) {
                console.error('❌ No response received from server:', error.request);
                setSnackbarMessage('No response received from server. Please check your connection and try again.');
            } else {
                console.error('❌ Error setting up request:', error.message);
                setSnackbarMessage(`Error: ${error.message}`);
            }
            
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Print and Email buttons component
    const actionButtons = (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrintReport}
                disabled={isLoading}
            >
                Print Report
            </Button>
            <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={handleEmailDialogOpen}
                disabled={isLoading}
            >
                Email Report
            </Button>
        </Box>
    );

    return (
        <Box sx={{ mt: 4 }} key={`results-container-${results.length}`}>
            <Typography variant="h6" gutterBottom>
                Contact Details ({results.length} {results.length === 1 ? 'result' : 'results'})
            </Typography>

            {/* Action buttons at the top */}
            {results.length > 0 && actionButtons}

            {/* Add the id here */}
            <Box id="printable-contact-details">
                {results.map((profile) => (
                    <Paper key={profile.profile_id} elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            {/* Profile Photo (Left Side) */}
                            <Grid xs={12} sm={4} md={3} lg={2}>
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
                                        onError={(e) => {
                                            console.error(`❌ Error loading image for profile ${profile.profile_id}`);
                                            e.target.src = `${API_BASE_URL}${BACKEND_DEFAULT_IMAGE_URL}`;
                                        }}
                                    />
                                </Box>
                            </Grid>

                            {/* Profile Details (Middle Column) */}
                            <Grid xs={12} sm={8} md={5} lg={5}>
                                <Typography variant="subtitle1">
                                    <strong>Profile ID:</strong> {profile.profile_id}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Married Status:</strong> {profile.married_status}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Name:</strong> {profile.name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Current Location:</strong> {profile.current_location}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Mother Tongue:</strong> {profile.mother_tongue}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Gotra:</strong> {profile.gotra}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Age:</strong> {profile.current_age}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Father Name:</strong> {profile.father_name}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Siblings:</strong> {profile.siblings}
                                </Typography>
                            </Grid>

                            {/* Additional Profile Details (Right Column) */}
                            <Grid xs={12} md={4} lg={5}>
                                <Typography variant="subtitle1">
                                    <strong>Expectations:</strong> {profile.expectations}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Phone Number:</strong> {profile.phone}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Communication Address:</strong> {profile.communication_address}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Education:</strong> {profile.education}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Profession:</strong> {profile.profession}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Designation:</strong> {profile.designation}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Current Company:</strong> {profile.current_company}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Annual Income:</strong> {profile.annual_income}
                                </Typography>
                                {/* Add other relevant details here */}
                            </Grid>
                            <Grid xs={12} sx={{ textAlign: 'right' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleGetDetails(profile)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'Get Details'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Box>

            {/* Action buttons at the bottom for better UX */}
            {results.length > 0 && actionButtons}

            {/* Email Dialog */}
            <Dialog open={emailDialogOpen} onClose={handleEmailDialogClose}>
                <DialogTitle>
                    Send Contact Details Report
                    <IconButton
                        aria-label="close"
                        onClick={handleEmailDialogClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
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
                    <Button onClick={handleEmailDialogClose} disabled={isLoading}>Cancel</Button>
                    <Button
                        onClick={handleEmailSend}
                        variant="contained"
                        disabled={!emailAddress || !emailAddress.includes('@') || isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Notification */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ContactDetailsResults;