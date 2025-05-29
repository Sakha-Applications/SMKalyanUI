import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'; 
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import getBaseUrl from '../utils/GetUrl';

function Donate() {
  console.log("[Donate] Component initialized");
  
  // Get user info from localStorage or context
const getUserInfo = async () => {
  const token = sessionStorage.getItem("token");
  const email = localStorage.getItem("userEmail");

    console.log("[Donate] Email from localStorage:", email);
  console.log("[Donate] Token from sessionStorage:", token);

  if (!token || !email) {
    console.warn("[Donate] Missing token or email in storage");
    return { profileId: "", email: "", token: "" };
  }

  try {
    const response = await fetch(`${getBaseUrl()}/api/modifyProfile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    if (response.ok && data?.profile_id) {
      return { profileId: data.profile_id, email, token };
    } else {
      console.error("[Donate] Failed to fetch profile ID", data);
      return { profileId: "", email, token };
    }
  } catch (err) {
    console.error("[Donate] Error fetching profile info:", err);
    return { profileId: "", email, token };
  }
};
  

useEffect(() => {
  const fetchUserProfile = async () => {
    
      console.log("[Donate] Fetching user profile");

      const email = localStorage.getItem("userEmail");
      const token = sessionStorage.getItem("token");

      console.log("[Donate] Token:", token);
    console.log("[Donate] Email from localStorage:", email);

      if (!email || !token) {
        console.warn("Donate: Missing email or token in storage");
        return;
      }

      try {
      const response = await fetch(`${getBaseUrl()}/api/modifyProfile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      console.log("[Donate] User profile data:", data);

      setDonationInfo(prev => ({
        ...prev,
        contactInfo: email,
        email: email, // Added email field to match the new table structure
        profileId: data.profile_id,
        donorName: data.name || '',
        phoneNumber: data.phone || '' // Add phone number from profile if available
      }));

      setUserToken(token);
    } catch (err) {
      console.error("[Donate] Error fetching profile:", err);
    }
  };

   // Wait slightly to allow session/localStorage to stabilize
  setTimeout(() => {
    fetchUserProfile();
  }, 100);
  
}, []);

  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationInfo, setDonationInfo] = useState({
    amount: '1000',
    paymentMethod: 'UPI',
    transactionDetails: '',
    donorName: '',
    contactInfo: '',
    email: '', // Added email field to match the new table structure
    profileId: '',
    paymentReference: '', // Added mandatory payment reference field
    phoneNumber: '' // Added explicitly to match the table structure
  });
  const [customAmount, setCustomAmount] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToken, setUserToken] = useState('');

  

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`[Donate] Input changed: ${name} = ${value}`);
    setDonationInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitDonation = async (e) => {
    e.preventDefault();
    console.log("[Donate] Submitting donation with:", donationInfo);

    if (!donationInfo.donorName || !donationInfo.contactInfo || !donationInfo.paymentReference) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarOpen(true);
      return;
    }

    const finalAmount = donationInfo.amount === 'other' ? customAmount : donationInfo.amount;

    try {
      setIsSubmitting(true);

      const response = await fetch(`${getBaseUrl()}/api/offline-payment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userToken && { 'Authorization': `Bearer ${userToken}` })
        },
        body: JSON.stringify({
          profile_id: donationInfo.profileId,
          amount: finalAmount,
          payment_type: 'Donation',
          payment_method: 'Offline', // Changed to payment_method
          payment_mode: donationInfo.paymentMethod, // Also send as payment_mode for backward compatibility
          payment_reference: donationInfo.paymentReference,
          payment_date: new Date().toISOString().split('T')[0],
          payment_time: new Date().toTimeString().split(' ')[0],
          phone_number: donationInfo.phoneNumber || donationInfo.contactInfo, // Use phoneNumber if available
          email: donationInfo.email, // Added email field
          transactionDetails: donationInfo.transactionDetails
        })
      });

      const result = await response.json();
      console.log("[Donate] API response:", result);

      if (response.ok && result.success) {
        setDonationSuccess(true);
      } else {
        throw new Error(result.message || "Unknown error");
      }
    } catch (error) {
      console.error("[Donate] Error submitting donation:", error);
      setSnackbarMessage('Error submitting donation. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);


  
  console.log("[Donate] Rendering with donationSuccess =", donationSuccess);
  console.log("[Donate] Current donation info state:", donationInfo);

  if (donationSuccess) {
    return (
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 4 }}>
        <Box 
          component="nav" 
          sx={{ 
            bgcolor: "white", 
            boxShadow: 2, 
            py: 2, 
            mb: 4 
          }}
        >
          <Container>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" component={Link} to="/dashboard" sx={{ fontWeight: "bold", color: "#3f51b5", textDecoration: "none" }}>
                Donate
              </Typography>
              <Box>
                <Button component={Link} to="/dashboard" sx={{ color: "#555", '&:hover': { color: "#3f51b5" } }}>
                  Dashboard
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ color: "#4caf50", fontWeight: "bold", mb: 2 }}>
              Thank you for your Donation!
            </Typography>
            <Typography sx={{ color: "#555", mb: 3 }}>
              Your donation information has been submitted and recorded in our database. Our team will process your contribution shortly.
            </Typography>
            
            <Box sx={{ bgcolor: "#f9f9f9", p: 3, borderRadius: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                Donation Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Profile ID:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{donationInfo.profileId}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Donor:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{donationInfo.donorName}</Typography>
                </Grid>
                
               <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Email:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{donationInfo.email}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Amount:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>₹{donationInfo.amount === 'other' ? customAmount : donationInfo.amount}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Method:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{donationInfo.paymentMethod === 'UPI' ? 'UPI' : 
                              donationInfo.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                              'Check/DD'}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Reference:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{donationInfo.paymentReference}</Typography>
                </Grid>
                
                {donationInfo.transactionDetails && (
                  <>
                    <Grid item xs={4} sm={3}>
                      <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Details:</Typography>
                    </Grid>
                    <Grid item xs={8} sm={9}>
                      <Typography>{donationInfo.transactionDetails}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Paper>
        </Container>

        <Box component="footer" sx={{ bgcolor: "white", boxShadow: "0px -2px 4px rgba(0,0,0,0.05)", py: 3, mt: 4, textAlign: "center" }}>
          <Container>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 4 }}>
      <Box 
        component="nav" 
        sx={{ 
          bgcolor: "white", 
          boxShadow: 2, 
          py: 2, 
          mb: 4 
        }}
      >
        <Container>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" component={Link} to="/dashboard" sx={{ fontWeight: "bold", color: "#3f51b5", textDecoration: "none" }}>
              Donate
            </Typography>
            <Box>
              <Button component={Link} to="/dashboard" sx={{ color: "#555", '&:hover': { color: "#3f51b5" } }}>
                Dashboard
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" sx={{ color: "#3f51b5", fontWeight: "bold", mb: 3 }}>
            Donate to Support Us
          </Typography>
          
          {/* Payment Details Section - Moved before offline donation details */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Bank Details - Left side */}
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: "#f9f9f9", p: 3, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                  Bank Account Details
                </Typography>
                <Box>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "medium", color: "#555", borderBottom: "1px solid #eee" }}>Account Name:</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #eee" }}>ProfileConnect</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "medium", color: "#555", borderBottom: "1px solid #eee" }}>Account Number:</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #eee" }}>1234567790</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "medium", color: "#555", borderBottom: "1px solid #eee" }}>IFSC Code:</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #eee" }}>ABCD0002234</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "medium", color: "#555", borderBottom: "none" }}>Bank:</TableCell>
                        <TableCell sx={{ borderBottom: "none" }}>Example Bank</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Grid>
            
            {/* UPI Details - Right side */}
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: "#f9f9f9", p: 3, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                  UPI Payment Details
                </Typography>
                <Box>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "medium", color: "#555", borderBottom: "1px solid #eee" }}>UPI ID:</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #eee" }}>profileconnect@upi</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "medium", color: "#555", borderBottom: "1px solid #eee" }}>Account Name:</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #eee" }}>ProfileConnect</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "medium", color: "#555", borderBottom: "1px solid #eee" }}>UPI Phone Number:</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #eee" }}>9845473728</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "medium", color: "#555", borderBottom: "none" }}>Note:</TableCell>
                        <TableCell sx={{ borderBottom: "none" }}>Provide tran unique ref no</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Box component="form" onSubmit={handleSubmitDonation} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>
              Offline Donation Details
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mb: 3 }}>
              Please provide your donation details below. Our team will process your contribution and send you a confirmation.
            </Typography>
            
            <Box
              sx={{
                mt: 2,
                p: 4,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                maxWidth: "100%",
                margin: "auto",
              }}
            >
              <Grid container spacing={3}>
                {/* Row 1 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Profile ID:</Typography>
                  <TextField
                    name="profileId"
                    value={donationInfo.profileId}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Your Name:<span style={{ color: 'red' }}>*</span></Typography>
                  <TextField
                    name="donorName"
                    value={donationInfo.donorName}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Email:<span style={{ color: 'red' }}>*</span></Typography>
                  <TextField
                    name="email"
                    value={donationInfo.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Phone Number:<span style={{ color: 'red' }}>*</span></Typography>
                  <TextField
                    name="phoneNumber"
                    value={donationInfo.phoneNumber}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
                
                {/* Row 2 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Amount:<span style={{ color: 'red' }}>*</span></Typography>
                  <FormControl fullWidth required sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <Select
                      name="amount"
                      value={donationInfo.amount}
                      onChange={handleInputChange}
                      size="small"
                    >
                      <MenuItem value="500">₹500</MenuItem>
                      <MenuItem value="1000">₹1000</MenuItem>
                      <MenuItem value="2000">₹2000</MenuItem>
                      <MenuItem value="5000">₹5000</MenuItem>
                      <MenuItem value="10000">₹10000</MenuItem>
                      <MenuItem value="other">Other Amount</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  {donationInfo.amount === 'other' ? (
                    <>
                      <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Custom Amount:<span style={{ color: 'red' }}>*</span></Typography>
                      <TextField
                        name="customAmount"
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          console.debug(`[Donate] Custom amount changed: ${e.target.value}`);
                          setCustomAmount(e.target.value);
                        }}
                        InputProps={{ inputProps: { min: 100 } }}
                        variant="outlined"
                        size="small"
                        fullWidth
                        required
                        placeholder="₹"
                        sx={{ bgcolor: "white", borderRadius: 1 }}
                      />
                    </>
                  ) : (
                    <>
                      <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Payment Method:<span style={{ color: 'red' }}>*</span></Typography>
                      <FormControl fullWidth required sx={{ bgcolor: "white", borderRadius: 1 }}>
                        <Select
                          name="paymentMethod"
                          value={donationInfo.paymentMethod}
                          onChange={handleInputChange}
                          size="small"
                        >
                          <MenuItem value="UPI">UPI</MenuItem>
                          <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                          <MenuItem value="check">Check/DD</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  {donationInfo.amount === 'other' ? (
                    <>
                      <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Payment Method:<span style={{ color: 'red' }}>*</span></Typography>
                      <FormControl fullWidth required sx={{ bgcolor: "white", borderRadius: 1 }}>
                        <Select
                          name="paymentMethod"
                          value={donationInfo.paymentMethod}
                          onChange={handleInputChange}
                          size="small"
                        >
                          <MenuItem value="UPI">UPI</MenuItem>
                          <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                          <MenuItem value="check">Check/DD</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Payment Reference:<span style={{ color: 'red' }}>*</span></Typography>
                      <TextField
                        name="paymentReference"
                        value={donationInfo.paymentReference}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        required
                        placeholder="Enter a unique reference number"
                        sx={{ bgcolor: "white", borderRadius: 1 }}
                      />
                    </>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  {donationInfo.amount === 'other' ? (
                    <>
                      <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Payment Reference:<span style={{ color: 'red' }}>*</span></Typography>
                      <TextField
                        name="paymentReference"
                        value={donationInfo.paymentReference}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        required
                        placeholder="Enter a unique reference number"
                        sx={{ bgcolor: "white", borderRadius: 1 }}
                      />
                    </>
                  ) : (
                    <>
                      <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Additional Details:</Typography>
                      <TextField
                        name="transactionDetails"
                        value={donationInfo.transactionDetails}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="Enter the additional details."
                        sx={{ bgcolor: "white", borderRadius: 1 }}
                      />
                    </>
                  )}
                </Grid>
                
                {/* Row 3 - Only show if custom amount is selected */}
                {donationInfo.amount === 'other' && (
                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Additional Details:</Typography>
                    <TextField
                      name="transactionDetails"
                      value={donationInfo.transactionDetails}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Enter Additional Details if applicable"
                      sx={{ bgcolor: "white", borderRadius: 1 }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
            
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  bgcolor: "#3f51b5",
                  color: "white",
                  py: 1.5,
                  px: 4,
                  fontSize: "1.1rem",
                  fontWeight: "medium",
                  '&:hover': {
                    bgcolor: "#303f9f"
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Donation Information'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Box component="footer" sx={{ bgcolor: "white", boxShadow: "0px -2px 4px rgba(0,0,0,0.05)", py: 3, mt: 4, textAlign: "center" }}>
        <Container>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.
          </Typography>
        </Container>
      </Box>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Donate;