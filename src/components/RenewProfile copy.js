import React, { useState, useEffect } from 'react';
import { Button, Typography, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Link } from 'react-router-dom';

function RenewProfile() {
    const [renewalSuccess, setRenewalSuccess] = useState(false);
    const [showOfflineForm, setShowOfflineForm] = useState(false);
    const [submittingOffline, setSubmittingOffline] = useState(false);
    const [offlineSubmitSuccess, setOfflineSubmitSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const subscriptionAmount = 100000; // Amount in paise (₹1000)
    const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;

    // Offline payment form state
    const [offlineFormData, setOfflineFormData] = useState({
        payment_mode: 'upi',
        payment_reference: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_time: new Date().toTimeString().slice(0, 5),
        phone_number: ''
    });

    const fetchRazorpayOrder = async () => {
        try {
            const response = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: subscriptionAmount }),
            });
            const data = await response.json();
            setOrderId(data.id);
        } catch (error) {
            console.error('Error fetching Razorpay order:', error);
            setPaymentError('Failed to initiate payment');
        }
    };

    const handlePayment = async () => {
        if (!orderId || !razorpayKeyId) {
            setPaymentError('Order ID or Razorpay Key ID not available');
            return;
        }

        const options = {
            key: razorpayKeyId,
            order_id: orderId,
            name: 'Kalyana Sakha',
            description: 'Renew Profile Activation - Annual Subscription',
            amount: subscriptionAmount,
            currency: 'INR',
            handler: async function (response) {
                const paymentId = response.razorpay_payment_id;
                const orderId = response.razorpay_order_id;
                const signature = response.razorpay_signature;

                try {
                    const verificationResponse = await fetch('/api/razorpay/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ paymentId, orderId, signature }),
                    });
                    const verificationData = await verificationResponse.json();
                    if (verificationData.success) {
                        setRenewalSuccess(true);
                        console.log('Renewal successful and payment verified!');
                    } else {
                        setPaymentError('Payment verification failed');
                        console.error('Payment verification failed:', verificationData.error);
                    }
                } catch (error) {
                    console.error('Error verifying payment:', error);
                    setPaymentError('Failed to verify payment');
                }
            },
            prefill: {
                name: '',
                email: '',
                contact: '',
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', function (response) {
            setPaymentError(`Payment failed: ${response.error.description}`);
            console.error('Payment failed:', response);
        });
    };

    const handleOfflineInputChange = (e) => {
        const { name, value } = e.target;
        setOfflineFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOfflineSubmit = async (e) => {
        e.preventDefault();
        setSubmittingOffline(true);
        
        try {
            const response = await fetch('/api/offline-payment/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...offlineFormData,
                    amount: subscriptionAmount / 100, // Convert to rupees
                    payment_type: 'profile_renewal'
                }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setOfflineSubmitSuccess(true);
                setShowOfflineForm(false);
            } else {
                setPaymentError(data.message || 'Failed to submit offline payment');
            }
        } catch (error) {
            console.error('Error submitting offline payment:', error);
            setPaymentError('Failed to submit offline payment details');
        } finally {
            setSubmittingOffline(false);
        }
    };

    const toggleOfflineForm = () => {
        setShowOfflineForm(prev => !prev);
    };

    useEffect(() => {
        fetchRazorpayOrder();
    }, []);

    if (renewalSuccess || offlineSubmitSuccess) {
        return (
            <div className="bg-gray-50 font-sans antialiased min-h-screen">
                <nav className="bg-white shadow-md py-4">
                    <div className="container mx-auto flex justify-between items-center px-6">
                        <Link to="/dashboard" className="text-xl font-bold text-indigo-700">
                            Renew Profile
                        </Link>
                        <div className="space-x-4">
                            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-500">Dashboard</Link>
                        </div>
                    </div>
                </nav>

                <section className="py-8">
                    <div className="container mx-auto px-6">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold text-green-600 mb-4">
                                {renewalSuccess ? 'Profile Renewal Successful!' : 'Offline Payment Submitted Successfully!'}
                            </h2>
                            <p className="text-gray-700">
                                {renewalSuccess 
                                    ? 'Your profile activation has been renewed for another year.' 
                                    : 'Your offline payment details have been submitted. Your profile will be renewed once the payment is verified.'}
                            </p>
                            {!renewalSuccess && (
                                <p className="text-gray-600 mt-4">
                                    You will receive confirmation once your payment is verified by our team.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-8">
                    <div className="container mx-auto px-6">
                        <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 font-sans antialiased min-h-screen">
            <nav className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link to="/dashboard" className="text-xl font-bold text-indigo-700">
                        Renew Profile
                    </Link>
                    <div className="space-x-4">
                        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-500">Dashboard</Link>
                    </div>
                </div>
            </nav>

            <section className="py-8">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Renew Profile Activation</h2>
                        <p className="text-gray-700 mb-4">To continue accessing contact details and enjoy the benefits of a subscribed member, please renew your profile activation for ₹1000 per annum.</p>
                        
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-indigo-700 mb-4">Online Payment</h3>
                            <Button
                                onClick={handlePayment}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={!orderId || !razorpayKeyId}
                            >
                                Pay Now to Renew
                            </Button>
                            {paymentError && (
                                <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{paymentError}</Typography>
                            )}
                            {!orderId && !paymentError && <p className="text-gray-500 mt-4">Initiating payment...</p>}
                            {!razorpayKeyId && <p className="text-red-500 mt-4">Razorpay Key ID not configured in the frontend.</p>}
                        </div>
                        
                        <div className="border-t pt-6">
                            <h3 className="text-xl font-semibold text-indigo-700 mb-4">Offline Payment</h3>
                            <p className="text-gray-700 mb-4">
                                You can also make payment through UPI/Bank Transfer to the following account and submit the details:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-md mb-6">
                                <p className="font-medium">UPI ID: profile.connect@okicici</p>
                                <p className="font-medium">Phone Number: +91 9876543210</p>
                            </div>
                            
                            <Button
                                onClick={toggleOfflineForm}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                {showOfflineForm ? 'Hide Offline Payment Form' : 'Submit Offline Payment Details'}
                            </Button>
                            
                            {showOfflineForm && (
                                <form onSubmit={handleOfflineSubmit} className="mt-6 space-y-4">
                                    <div>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
                                            <Select
                                                labelId="payment-mode-label"
                                                id="payment_mode"
                                                name="payment_mode"
                                                value={offlineFormData.payment_mode}
                                                onChange={handleOfflineInputChange}
                                                required
                                            >
                                                <MenuItem value="upi">UPI</MenuItem>
                                                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                                <MenuItem value="cash">Cash</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Payment Reference/Transaction ID"
                                            name="payment_reference"
                                            value={offlineFormData.payment_reference}
                                            onChange={handleOfflineInputChange}
                                            required
                                            margin="normal"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <TextField
                                            label="Payment Date"
                                            type="date"
                                            name="payment_date"
                                            value={offlineFormData.payment_date}
                                            onChange={handleOfflineInputChange}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            margin="normal"
                                        />
                                        
                                        <TextField
                                            label="Payment Time"
                                            type="time"
                                            name="payment_time"
                                            value={offlineFormData.payment_time}
                                            onChange={handleOfflineInputChange}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            margin="normal"
                                        />
                                    </div>
                                    
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Your Phone Number"
                                            name="phone_number"
                                            value={offlineFormData.phone_number}
                                            onChange={handleOfflineInputChange}
                                            required
                                            margin="normal"
                                        />
                                    </div>
                                    
                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            disabled={submittingOffline}
                                        >
                                            {submittingOffline ? 'Submitting...' : 'Submit Payment Details'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm mt-8">
                <div className="container mx-auto px-6">
                    <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default RenewProfile;