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

function RenewProfile() {
  console.log("[RenewProfile] Component initialized");
  
  // Get user info from localStorage or context
  const getUserInfo = async () => {
    const token = sessionStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (!token || !email) {
      console.warn("[RenewProfile] Missing token or email in storage");
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
        console.error("[RenewProfile] Failed to fetch profile ID", data);
        return { profileId: "", email, token };
      }
    } catch (err) {
      console.error("[RenewProfile] Error fetching profile info:", err);
      return { profileId: "", email, token };
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log("[RenewProfile] Fetching user profile");

        const email = localStorage.getItem("userEmail");
        const token = sessionStorage.getItem("token");

        if (!email || !token) {
          console.warn("RenewProfile: Missing email or token in storage");
          return;
        }

        const response = await fetch("https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//modifyProfile", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        console.log("[RenewProfile] User profile data:", data);

        setRenewalInfo(prev => ({
          ...prev,
          contactInfo: email,
          email: email,
          profileId: data.profile_id,
          memberName: data.name || '',
          phoneNumber: data.phone || ''
        }));

        setUserToken(token);
      } catch (err) {
        console.error("[RenewProfile] Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const [renewalSuccess, setRenewalSuccess] = useState(false);
  const [renewalInfo, setRenewalInfo] = useState({
    amount: '1000', // Fixed renewal amount
    paymentMethod: 'UPI',
    transactionDetails: '',
    memberName: '',
    contactInfo: '',
    email: '',
    profileId: '',
    paymentReference: '',
    phoneNumber: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    const userInfo = getUserInfo();
    setRenewalInfo(prev => ({
      ...prev,
      contactInfo: userInfo.email || '',
      email: userInfo.email || '',
      profileId: userInfo.profileId || ''
    }));
    setUserToken(userInfo.token || '');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`[RenewProfile] Input changed: ${name} = ${value}`);
    setRenewalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRenewal = async (e) => {
    e.preventDefault();
    console.log("[RenewProfile] Submitting renewal with:", renewalInfo);

    if (!renewalInfo.memberName || !renewalInfo.contactInfo || !renewalInfo.paymentReference) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//offline-payment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userToken && { 'Authorization': `Bearer ${userToken}` })
        },
        body: JSON.stringify({
          profile_id: renewalInfo.profileId,
          amount: renewalInfo.amount,
          payment_type: 'ProfileRenewal',
          payment_method: 'Offline',
          payment_mode: renewalInfo.paymentMethod,
          payment_reference: renewalInfo.paymentReference,
          payment_date: new Date().toISOString().split('T')[0],
          payment_time: new Date().toTimeString().split(' ')[0],
          phone_number: renewalInfo.phoneNumber || renewalInfo.contactInfo,
          email: renewalInfo.email,
          transactionDetails: renewalInfo.transactionDetails
        })
      });

      const result = await response.json();
      console.log("[RenewProfile] API response:", result);

      if (response.ok && result.success) {
        setRenewalSuccess(true);
      } else {
        throw new Error(result.message || "Unknown error");
      }
    } catch (error) {
      console.error("[RenewProfile] Error submitting renewal:", error);
      setSnackbarMessage('Error submitting renewal. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  console.log("[RenewProfile] Rendering with renewalSuccess =", renewalSuccess);
  console.log("[RenewProfile] Current renewal info state:", renewalInfo);

  if (renewalSuccess) {
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
                Renew Profile
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
              Thank you for Renewing Your Profile!
            </Typography>
            <Typography sx={{ color: "#555", mb: 3 }}>
              Your profile renewal information has been submitted and recorded in our database. Our team will process your renewal shortly. Please note you will be able view additional 10 prfiles contact details
            </Typography>
            
            <Box sx={{ bgcolor: "#f9f9f9", p: 3, borderRadius: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                Renewal Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Profile ID:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{renewalInfo.profileId}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Member Name:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{renewalInfo.memberName}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Email:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{renewalInfo.email}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Renewal Amount:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>₹{renewalInfo.amount}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Method:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{renewalInfo.paymentMethod === 'UPI' ? 'UPI' : 
                              renewalInfo.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                              'Check/DD'}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Reference:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{renewalInfo.paymentReference}</Typography>
                </Grid>
                
                {renewalInfo.transactionDetails && (
                  <>
                    <Grid item xs={4} sm={3}>
                      <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Details:</Typography>
                    </Grid>
                    <Grid item xs={8} sm={9}>
                      <Typography>{renewalInfo.transactionDetails}</Typography>
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
              Renew Profile
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
            Renew Profile Activation
          </Typography>
          
          {/* Payment Details Section */}
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
                        <TableCell sx={{ borderBottom: "none" }}>Provide unique ref no</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Box component="form" onSubmit={handleSubmitRenewal} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>
              Profile Renewal Details
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mb: 3 }}>
              Please provide your renewal payment details below. Annual renewal fee is ₹1000. Our team will process your renewal and send you a confirmation.
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
                    value={renewalInfo.profileId}
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
                    name="memberName"
                    value={renewalInfo.memberName}
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
                    value={renewalInfo.email}
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
                    value={renewalInfo.phoneNumber}
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
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Renewal Amount:</Typography>
                  <TextField
                    name="amount"
                    value="₹1000"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Payment Method:<span style={{ color: 'red' }}>*</span></Typography>
                  <FormControl fullWidth required sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <Select
                      name="paymentMethod"
                      value={renewalInfo.paymentMethod}
                      onChange={handleInputChange}
                      size="small"
                    >
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                      <MenuItem value="check">Check/DD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Payment Reference:<span style={{ color: 'red' }}>*</span></Typography>
                  <TextField
                    name="paymentReference"
                    value={renewalInfo.paymentReference}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    placeholder="Enter transaction ID/reference"
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Additional Details:</Typography>
                  <TextField
                    name="transactionDetails"
                    value={renewalInfo.transactionDetails}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Enter any additional details"
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
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
                {isSubmitting ? 'Submitting...' : 'Submit Renewal Information'}
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

export default RenewProfile;