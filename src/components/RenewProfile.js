import React, { useState, useEffect } from 'react';
import { Button, Typography, } from "@mui/material";
import { Link } from 'react-router-dom';

function RenewProfile() {
    const [orderId, setOrderId] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const [renewalSuccess, setRenewalSuccess] = useState(false);
    const subscriptionAmount = 100000; // Amount in paise (₹1000)
    const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID; // Ensure this is set in your .env.local file

    const fetchRazorpayOrder = async () => {
        try {
            const response = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: subscriptionAmount }), // Send the amount to the backend
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
                        // Optionally redirect or show a detailed success message
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
                // You might want to fetch and prefill user details here if available
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

    useEffect(() => {
        fetchRazorpayOrder();
    }, []);

    if (renewalSuccess) {
        return (
            <div className="bg-gray-50 font-sans antialiased min-h-screen">
                <nav className="bg-white shadow-md py-4">
                    <div className="container mx-auto flex justify-between items-center px-6">
                        <Link to="/dashboard" className="text-xl font-bold text-indigo-700">
                            Renew Profile
                        </Link>
                        <div className="space-x-4">
                            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-500">Dashboard</Link>
                            {/* Add other navigation links if needed */}
                        </div>
                    </div>
                </nav>

                <section className="py-8">
                    <div className="container mx-auto px-6">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold text-green-600 mb-4">Profile Renewal Successful!</h2>
                            <p className="text-gray-700">Your profile activation has been renewed for another year.</p>
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
                        {/* Add other navigation links if needed */}
                    </div>
                </div>
            </nav>

            <section className="py-8">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Renew Profile Activation</h2>
                        <p className="text-gray-700 mb-4">To continue accessing contact details and enjoy the benefits of a subscribed member, please renew your profile activation for ₹1000 per annum.</p>
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
