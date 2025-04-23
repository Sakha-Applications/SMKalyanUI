// src/components/viewContactDetails/ContactDetailsResults.js
import React, { useState } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    IconButton
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';

const ContactDetailsResults = ({ results, userEmail }) => {
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailAddress, setEmailAddress] = useState(userEmail || '');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handlePrintReport = () => {
        // Create a printable version
        const printableContent = document.getElementById('printable-contact-details');
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
        window.location.reload(); // Reload to restore the original state
    };

    const handleEmailDialogOpen = () => {
        setEmailDialogOpen(true);
    };

    const handleEmailDialogClose = () => {
        setEmailDialogOpen(false);
    };

    const handleEmailSend = async () => {
        // Here you'd normally send the actual email via your backend
        try {
            // Simulating email sending with a timeout
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Emailing report data to:', emailAddress);
            setSnackbarMessage(`Report successfully sent to ${emailAddress}`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setEmailDialogOpen(false);
            
            // In a real implementation, you would call your API:
            /*
            const response = await fetch('http://localhost:3001/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    email: emailAddress,
                    subject: 'Contact Details Report',
                    data: results
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            */
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

    return (
        <Box sx={{ mt: 4 }} id="contact-details-section">
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        Contact Details ({results.length} {results.length === 1 ? 'result' : 'results'})
                    </Typography>
                    <Box>
                        <Button 
                            variant="outlined" 
                            startIcon={<PrintIcon />} 
                            onClick={handlePrintReport}
                            sx={{ mr: 1 }}
                        >
                            Print
                        </Button>
                        <Button 
                            variant="outlined" 
                            startIcon={<EmailIcon />} 
                            onClick={handleEmailDialogOpen}
                        >
                            Email
                        </Button>
                    </Box>
                </Box>
                
                <div id="printable-contact-details">
                    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="contact details table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Profile ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Profile For</TableCell>
                                    <TableCell>Age</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Gotra</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((profile) => (
                                    <TableRow key={profile.profile_id} hover>
                                        <TableCell>{profile.profile_id}</TableCell>
                                        <TableCell>{profile.name}</TableCell>
                                        <TableCell>{profile.profile_for}</TableCell>
                                        <TableCell>{profile.age}</TableCell>
                                        <TableCell>{profile.email}</TableCell>
                                        <TableCell>{profile.phone_number}</TableCell>
                                        <TableCell>{profile.gotra}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Paper>

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