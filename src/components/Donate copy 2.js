import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper,
  Container,
  Grid,
  Divider,
  Alert,
  Snackbar
} from "@mui/material";
import { Link } from 'react-router-dom';

function Donate() {
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationInfo, setDonationInfo] = useState({
    amount: '500',
    paymentMethod: 'cash',
    transactionDetails: '',
    donorName: '',
    contactInfo: ''
  });
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonationInfo({
      ...donationInfo,
      [name]: value,
    });
  };

  const handleDonate = () => {
    setShowDonationForm(true);
  };

  const handleSubmitDonation = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!donationInfo.donorName || !donationInfo.contactInfo) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarOpen(true);
      return;
    }
    
    // If "other" amount selected, use the custom amount
    const finalAmount = donationInfo.amount === 'other' ? customAmount : donationInfo.amount;
    
    // Here we would typically submit to a server
    try {
      // Simulated API call
      console.log("Submitting donation:", {
        ...donationInfo,
        amount: finalAmount
      });
      
      // Simulate API response delay
      setTimeout(() => {
        setDonationSuccess(true);
      }, 500);
      
    } catch (error) {
      console.error("Error submitting offline payment:", error);
      setSnackbarMessage('Error submitting donation. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
              Your donation information has been submitted. Our team will process your contribution shortly.
            </Typography>
            
            <Box sx={{ bgcolor: "#f9f9f9", p: 3, borderRadius: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                Donation Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Donor:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{donationInfo.donorName}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Amount:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>₹{donationInfo.amount === 'other' ? customAmount : donationInfo.amount}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Method:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{donationInfo.paymentMethod === 'cash' ? 'Cash' : 
                              donationInfo.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                              'Check/DD'}</Typography>
                </Grid>
                
                {donationInfo.transactionDetails && (
                  <>
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: "medium", color: "#555" }}>Additional Details:</Typography>
                    </Grid>
                    <Grid item xs={8}>
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
          
          {!showDonationForm ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
                Your generous donation will help us continue to provide valuable matrimonial services to our community.
              </Typography>
              <Button
                onClick={handleDonate}
                variant="contained"
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
                Make a Donation
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmitDonation} sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>
                Offline Donation Details
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 3 }}>
                Please provide your donation details below. Our team will process your contribution and send you a confirmation.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="donorName"
                    label="Your Name"
                    value={donationInfo.donorName}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="contactInfo"
                    label="Email or Phone"
                    value={donationInfo.contactInfo}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <InputLabel>Amount</InputLabel>
                    <Select
                      name="amount"
                      value={donationInfo.amount}
                      onChange={handleInputChange}
                      label="Amount"
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
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="paymentMethod"
                      value={donationInfo.paymentMethod}
                      onChange={handleInputChange}
                      label="Payment Method"
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                      <MenuItem value="check">Check/DD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {donationInfo.amount === 'other' && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="customAmount"
                      label="Enter Amount (₹)"
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      InputProps={{ inputProps: { min: 100 } }}
                      variant="outlined"
                      fullWidth
                      required
                      sx={{ bgcolor: "white", borderRadius: 1 }}
                    />
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <TextField
                    name="transactionDetails"
                    label="Additional Payment Details (optional)"
                    value={donationInfo.transactionDetails}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter bank transaction ID, check number, or other payment details if applicable"
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
              </Grid>
              
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
                  Submit Donation Information
                </Button>
              </Box>
            </Box>
          )}
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

/**
 * Reusing the Donate component for the RenewProfile functionality
 * with customized text and settings
 */
function RenewProfile() {
  const [renewalSuccess, setRenewalSuccess] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    amount: '1000',
    paymentMethod: 'cash',
    transactionDetails: '',
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };

  const handleRenew = () => {
    setShowPaymentForm(true);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    
    // Here we would typically submit to a server
    try {
      // Simulated API call
      console.log("Submitting profile renewal payment:", paymentInfo);
      
      // Simulate API response delay
      setTimeout(() => {
        setRenewalSuccess(true);
      }, 500);
      
    } catch (error) {
      console.error("Error submitting offline payment:", error);
      setSnackbarMessage('Error submitting payment. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
              Payment Information Submitted!
            </Typography>
            <Typography sx={{ color: "#555", mb: 3 }}>
              Your profile renewal request has been recorded. Our team will verify your payment and activate your profile shortly.
            </Typography>
            
            <Box sx={{ bgcolor: "#f9f9f9", p: 3, borderRadius: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                Payment Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Amount:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>₹{paymentInfo.amount}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: "medium", color: "#555" }}>Payment Method:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{paymentInfo.paymentMethod === 'cash' ? 'Cash' : 
                              paymentInfo.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                              'Check/DD'}</Typography>
                </Grid>
                
                {paymentInfo.transactionDetails && (
                  <>
                    <Grid item xs={4}>
                      <Typography sx={{ fontWeight: "medium", color: "#555" }}>Additional Details:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{paymentInfo.transactionDetails}</Typography>
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
          
          {!showPaymentForm ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
                To continue accessing contact details and enjoy the benefits of a subscribed member, please renew your profile activation.
              </Typography>
              <Button
                onClick={handleRenew}
                variant="contained"
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  py: 1.5,
                  px: 4,
                  fontSize: "1.1rem",
                  fontWeight: "medium",
                  '&:hover': {
                    bgcolor: "#388e3c"
                  }
                }}
              >
                Renew Profile
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmitPayment} sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold", mb: 2 }}>
                Offline Payment Details
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 3 }}>
                Please provide your payment details below. Our team will verify your payment and activate your profile.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <InputLabel>Amount</InputLabel>
                    <Select
                      name="amount"
                      value={paymentInfo.amount}
                      onChange={handleInputChange}
                      label="Amount"
                    >
                      <MenuItem value="1000">₹1000 - 1 Year</MenuItem>
                      <MenuItem value="1800">₹1800 - 2 Years</MenuItem>
                      <MenuItem value="2500">₹2500 - 3 Years</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="paymentMethod"
                      value={paymentInfo.paymentMethod}
                      onChange={handleInputChange}
                      label="Payment Method"
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                      <MenuItem value="check">Check/DD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="transactionDetails"
                    label="Additional Payment Details (optional)"
                    value={paymentInfo.transactionDetails}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter bank transaction ID, check number, or other payment details if applicable"
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                </Grid>
              </Grid>
              
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
                  Please use your registered email or phone as reference when making a bank transfer.
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#4caf50",
                    color: "white",
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    fontWeight: "medium",
                    '&:hover': {
                      bgcolor: "#388e3c"
                    }
                  }}
                >
                  Submit Payment Information
                </Button>
              </Box>
            </Box>
          )}
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