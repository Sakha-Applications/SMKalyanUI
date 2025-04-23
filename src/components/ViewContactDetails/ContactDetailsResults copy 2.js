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
    Grid
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';
const BACKEND_DEFAULT_IMAGE_URL = '/ProfilePhotos/defaultImage.jpg'; // URL to your backend's default image

const ContactDetailsResults = ({ results, userEmail }) => {
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailAddress, setEmailAddress] = useState(userEmail || '');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [profilePhotos, setProfilePhotos] = useState({});

    useEffect(() => {
        const fetchPhotos = async () => {
            const photosByProfile = {};
            for (const profile of results) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/get-photos?profileId=${profile.profile_id}`);
                    photosByProfile[profile.profile_id] = response.data.map(photo => {
                        // Extract just the filename from the full path
                        const parts = photo.photo_path.split(/[\\\/]/); // Split by both / and \
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

        if (results && results.length > 0) {
            fetchPhotos();
        }
    }, [results]);

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

    const handlePrintReport = () => {
        const printableContent = document.getElementById('printable-contact-details');
        console.log("printableContent element:", printableContent); // Add this line

        if (printableContent) {
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
            window.print();
            document.body.innerHTML = originalContents;
            // No need to reload the window after printing
        } else {
            console.error("Error: 'printable-contact-details' element not found in the DOM.");
            setSnackbarMessage("Error: Could not prepare report for printing.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleEmailDialogOpen = () => {
        setEmailDialogOpen(true);
    };

    const handleEmailDialogClose = () => {
        setEmailDialogOpen(false);
    };

    const handleEmailSend = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Emailing report data to:', emailAddress);
            setSnackbarMessage(`Report successfully sent to ${emailAddress}`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setEmailDialogOpen(false);
            // In a real implementation, you would call your API here
        } catch (error) {
            console.error('Error sending email:', error);
            setSnackbarMessage('Failed to send email. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Print and Email buttons component
    const actionButtons = (
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
    );

    return (
        <Box sx={{ mt: 4 }}>
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

                            {/* Profile Details (Middle Column) */}
                            <Grid item xs={12} sm={8} md={5} lg={5}>
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
                            <Grid item xs={12} md={4} lg={5}>
                            


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