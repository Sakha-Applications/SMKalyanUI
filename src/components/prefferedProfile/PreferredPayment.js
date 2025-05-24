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
import { Link, useLocation, useNavigate } from 'react-router-dom';

function PreferredPayment() {
  console.log("[PreferredPayment] Component initialized");
  
  const location = useLocation();
  const navigate = useNavigate();
  const profileData = location.state?.profileData;

  // Get user info from localStorage or context
  const getUserInfo = async () => {
    const token = sessionStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (!token || !email) {
      console.warn("[PreferredPayment] Missing token or email in storage");
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
        console.error("[PreferredPayment] Failed to fetch profile ID", data);
        return { profileId: "", email, token };
      }
    } catch (err) {
      console.error("[PreferredPayment] Error fetching profile info:", err);
      return { profileId: "", email, token };
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log("[PreferredPayment] Fetching user profile");

        const email = localStorage.getItem("userEmail");
        const token = sessionStorage.getItem("token");

        if (!email || !token) {
          console.warn("PreferredPayment: Missing email or token in storage");
          return;
        }

        const response = await fetch("https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//modifyProfile", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        console.log("[PreferredPayment] User profile data:", data);

        setPaymentInfo(prev => ({
          ...prev,
          contactInfo: email,
          email: email,
          profileId: profileData?.profile_id || data.profile_id,
          memberName: data.name || '',
          phoneNumber: data.phone || ''
        }));

        setUserToken(token);
      } catch (err) {
        console.error("[PreferredPayment] Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, [profileData]);

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [preferredRecord, setPreferredRecord] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    amount: '250', // Fixed preferred profile amount
    paymentMethod: 'UPI',
    transactionDetails: '',
    memberName: '',
    contactInfo: '',
    email: '',
    profileId: profileData?.profile_id || '',
    paymentReference: '',
    phoneNumber: profileData?.phone || ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    const userInfo = getUserInfo();
    setPaymentInfo(prev => ({
      ...prev,
      contactInfo: userInfo.email || '',
      email: userInfo.email || '',
      profileId: profileData?.profile_id || userInfo.profileId || ''
    }));
    setUserToken(userInfo.token || '');
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`[PreferredPayment] Input changed: ${name} = ${value}`);
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    console.log("[PreferredPayment] Submitting payment with:", paymentInfo);

    if (!paymentInfo.memberName || !paymentInfo.email || !paymentInfo.phoneNumber || !paymentInfo.paymentReference) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);

      // Submit offline payment first
      const offlinePaymentResponse = await fetch('https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//offline-payment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userToken && { 'Authorization': `Bearer ${userToken}` })
        },
        body: JSON.stringify({
          profile_id: paymentInfo.profileId,
          amount: paymentInfo.amount,
          payment_type: 'PreferredProfile',
          payment_method: 'Offline',
          payment_mode: paymentInfo.paymentMethod,
          payment_reference: paymentInfo.paymentReference,
          payment_date: new Date().toISOString().split('T')[0],
          payment_time: new Date().toTimeString().split(' ')[0],
          phone_number: paymentInfo.phoneNumber,
          email: paymentInfo.email,
          transactionDetails: paymentInfo.transactionDetails
        })
      });

      const offlineResult = await offlinePaymentResponse.json();
      console.log("[PreferredPayment] Offline payment API response:", offlineResult);

      if (!offlinePaymentResponse.ok || !offlineResult.success) {
        throw new Error(offlineResult.message || "Failed to submit offline payment");
      }

      // Submit preferred profile record
      const preferredResponse = await fetch('https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/preferred-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userToken && { 'Authorization': `Bearer ${userToken}` })
        },
        body: JSON.stringify({
          profile_id: paymentInfo.profileId,
          email: paymentInfo.email,
          phone_number: paymentInfo.phoneNumber,
          member_name: paymentInfo.memberName,
          payment_amount: parseFloat(paymentInfo.amount),
          payment_method: paymentInfo.paymentMethod,
          payment_reference: paymentInfo.paymentReference,
          payment_date: new Date().toISOString().split('T')[0],
          payment_time: new Date().toTimeString().split(' ')[0],
          transaction_details: paymentInfo.transactionDetails
        })
      });

      const preferredResult = await preferredResponse.json();
      console.log("[PreferredPayment] Preferred profile API response:", preferredResult);

      if (preferredResponse.ok && preferredResult.success) {
        setPreferredRecord(preferredResult.data);
        setPaymentSuccess(true);
        setSnackbarMessage('Payment submitted successfully! Your profile will be marked as preferred.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        throw new Error(preferredResult.message || "Failed to create preferred profile record");
      }
    } catch (error) {
      console.error("[PreferredPayment] Error submitting payment:", error);
      setSnackbarMessage(`Error submitting payment: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  console.log("[PreferredPayment] Rendering with paymentSuccess =", paymentSuccess);
  console.log("[PreferredPayment] Current payment info state:", paymentInfo);

  if (paymentSuccess && preferredRecord) {
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
                Preferred Profile Payment
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ color: "#4caf50", fontWeight: "bold", mr: 2 }}>
                ✅ Payment Successful!
              </Typography>
              <Box sx={{ 
                bgcolor: "#4caf50", 
                color: "white", 
                px: 2, 
                py: 0.5, 
                borderRadius: 1,
                fontSize: "0.8rem",
                fontWeight: "bold"
              }}>
                PREFERRED
              </Box>
            </Box>
            
            <Typography sx={{ color: "#555", mb: 3 }}>
              Congratulations! Your preferred profile payment has been processed successfully. Your profile is now marked as preferred and will be highlighted across our platform.
            </Typography>
            
            <Box sx={{ bgcolor: "#f9f9f9", p: 3, borderRadius: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                Preferred Profile Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Profile ID:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{preferredRecord.profile_id}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Member Name:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{preferredRecord.member_name}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Email:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{preferredRecord.email}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Amount:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>₹{preferredRecord.payment_amount}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Method:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{preferredRecord.payment_method === 'UPI' ? 'UPI' : 
                              preferredRecord.payment_method === 'bank_transfer' ? 'Bank Transfer' : 
                              'Check/DD'}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Reference:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{preferredRecord.payment_reference}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Date:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography>{new Date(preferredRecord.payment_date).toLocaleDateString()}</Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Valid Until:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Typography sx={{ color: "#4caf50", fontWeight: "medium" }}>
                    {new Date(preferredRecord.validity_date).toLocaleDateString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={4} sm={3}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Status:</Typography>
                </Grid>
                <Grid item xs={8} sm={9}>
                  <Box sx={{ 
                    display: 'inline-block',
                    bgcolor: "#4caf50", 
                    color: "white", 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: 1,
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}>
                    {preferredRecord.status}
                  </Box>
                </Grid>
                
                {preferredRecord.transaction_details && (
                  <>
                    <Grid item xs={4} sm={3}>
                      <Typography sx={{ fontWeight: "medium", color: "#555" }}>Additional Details:</Typography>
                    </Grid>
                    <Grid item xs={8} sm={9}>
                      <Typography>{preferredRecord.transaction_details}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

            <Box sx={{ 
              bgcolor: "#e3f2fd", 
              p: 3, 
              borderRadius: 2, 
              mt: 3,
              border: "1px solid #2196f3"
            }}>
              <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "bold", mb: 1 }}>
                🎉 Your Profile Benefits:
              </Typography>
              <Typography sx={{ color: "#555", mb: 1 }}>
                • Your profile will appear in the preferred section across our platform
              </Typography>
              <Typography sx={{ color: "#555", mb: 1 }}>
                • Enhanced visibility to potential matches
              </Typography>
              <Typography sx={{ color: "#555", mb: 1 }}>
                • Priority placement in search results
              </Typography>
              <Typography sx={{ color: "#555" }}>
                • Valid for 90 days from payment date
              </Typography>
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
              Preferred Profile Payment
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
            Preferred Profile Payment
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
          
          <Box component="form" onSubmit={handleSubmitPayment} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>
              Preferred Profile Payment Details
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mb: 3 }}>
              Please provide your payment details below. Preferred profile fee is ₹250. Our team will process your payment and mark your profile as preferred for 90 days.
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
                    value={paymentInfo.profileId}
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
                    value={paymentInfo.memberName}
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
                    value={paymentInfo.email}
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
                    value={paymentInfo.phoneNumber}
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
                  <Typography sx={{ fontWeight: "bold", color: "#444", mb: 1 }}>Payment Amount:</Typography>
                  <TextField
                    name="amount"
                    value="₹250"
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
                      value={paymentInfo.paymentMethod}
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
                    value={paymentInfo.paymentReference}
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
                    value={paymentInfo.transactionDetails}
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
                {isSubmitting ? 'Processing Payment...' : 'Submit Payment Information'}
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PreferredPayment;