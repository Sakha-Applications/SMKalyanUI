import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  Select, 
  MenuItem,
  Paper,
  Container,
  Grid,
  Alert,
  Snackbar
} from "@mui/material";
import { Link } from 'react-router-dom';

function Donate() {
  console.log("[Donate] Component initialized");
  
  // Get user info from localStorage or context
const getUserInfo = async () => {
  const token = sessionStorage.getItem("token");
  const email = localStorage.getItem("userEmail");

  if (!token || !email) {
    console.warn("[Donate] Missing token or email in storage");
    return { profileId: "", email: "", token: "" };
  }

  try {
    const response = await fetch("https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//modifyProfile", {
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
    try {
      console.log("[Donate] Fetching user profile");

      const email = localStorage.getItem("userEmail");
      const token = sessionStorage.getItem("token");

      if (!email || !token) {
        console.warn("Donate: Missing email or token in storage");
        return;
      }

      const response = await fetch("https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//modifyProfile", {
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
        profileId: data.profile_id,
        donorName: data.name || ''
      }));

      setUserToken(token);
    } catch (err) {
      console.error("[Donate] Error fetching profile:", err);
    }
  };

  fetchUserProfile();
}, []);

  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationInfo, setDonationInfo] = useState({
    amount: '500',
    paymentMethod: 'UPI',
    transactionDetails: '',
    donorName: '',
    contactInfo: '',
    profileId: '',
    paymentReference: '' // Added mandatory payment reference field
  });
  const [customAmount, setCustomAmount] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToken, setUserToken] = useState('');

    useEffect(() => {
    const userInfo = getUserInfo();
    setDonationInfo(prev => ({
      ...prev,
      contactInfo: userInfo.email || '',
      profileId: userInfo.profileId || ''
    }));
    setUserToken(userInfo.token || '');
  }, []);


  
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

      const response = await fetch('https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//offline-payment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userToken && { 'Authorization': `Bearer ${userToken}` })
        },
        body: JSON.stringify({
          profile_id: donationInfo.profileId, // fallback for backend if no req.user
          amount: finalAmount,
          payment_type: 'offline',
          payment_mode: donationInfo.paymentMethod,
          payment_reference: donationInfo.paymentReference,
          payment_date: new Date().toISOString().split('T')[0],
          payment_time: new Date().toTimeString().split(' ')[0],
          phone_number: donationInfo.contactInfo,
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
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Email/Phone:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{donationInfo.contactInfo}</Typography>
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
          
          <Box component="form" onSubmit={handleSubmitDonation} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>
              Offline Donation Details
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mb: 3 }}>
              Please provide your donation details below. Our team will process your contribution and send you a confirmation.
            </Typography>
            
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "2fr 8fr",
                gap: 3,
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                maxWidth: "100%",
                margin: "auto",
              }}
            >
              {/* Profile ID */}
              <Typography sx={{ fontWeight: "bold", color: "#444" }}>Profile ID:</Typography>
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
              
              {/* Your Name */}
              <Typography sx={{ fontWeight: "bold", color: "#444" }}>Your Name:<span style={{ color: 'red' }}>*</span></Typography>
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
              
              {/* Email/Phone */}
              <Typography sx={{ fontWeight: "bold", color: "#444" }}>Email/Phone:<span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                name="contactInfo"
                value={donationInfo.contactInfo}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                fullWidth
                required
                sx={{ bgcolor: "white", borderRadius: 1 }}
              />
              
              {/* Amount */}
              <Typography sx={{ fontWeight: "bold", color: "#444" }}>Amount:<span style={{ color: 'red' }}>*</span></Typography>
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
              
              {/* Custom Amount (conditional) */}
              {donationInfo.amount === 'other' && (
                <>
                  <Typography sx={{ fontWeight: "bold", color: "#444" }}>Custom Amount:<span style={{ color: 'red' }}>*</span></Typography>
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
              )}
              
              {/* Payment Method */}
              <Typography sx={{ fontWeight: "bold", color: "#444" }}>Payment Method:<span style={{ color: 'red' }}>*</span></Typography>
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
              
              {/* Payment Reference - New Mandatory Field */}
              <Typography sx={{ fontWeight: "bold", color: "#444" }}>Payment Reference:<span style={{ color: 'red' }}>*</span></Typography>
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
              
              {/* Payment Details */}
              <Typography sx={{ fontWeight: "bold", color: "#444" }}>Additional Details:</Typography>
              <TextField
                name="transactionDetails"
                value={donationInfo.transactionDetails}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={3}
                placeholder="Enter bank transaction ID, check number, or other payment details if applicable"
                sx={{ bgcolor: "white", borderRadius: 1 }}
              />
            </Box>
              
            <Box sx={{ bgcolor: "#f9f9f9", p: 3, borderRadius: 2, mt: 4, mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                Bank Account Details
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Account Name:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>ProfileConnect</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Account Number:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>1234567890</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>IFSC Code:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>ABCD0001234</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Bank:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>Example Bank</Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" sx={{ color: "#555", mt: 2, fontSize: "0.875rem" }}>
                Please use your name as reference when making a bank transfer.
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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