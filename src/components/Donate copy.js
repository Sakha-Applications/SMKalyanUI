import React, { useState } from 'react';
import { Button, Typography, } from "@mui/material";
import { Link } from 'react-router-dom';

function RenewProfile() {
    const [renewalSuccess, setRenewalSuccess] = useState(false);


    const handleRenew = () => {
        //  Here you would typically integrate with your payment gateway
        //  For this example, we'll just simulate a successful renewal after clicking the button
        setRenewalSuccess(true);
    };



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
                        <p className="text-gray-700 mb-4">To continue accessing contact details and enjoy the benefits of a subscribed member, please renew your profile activation.</p>
                        <Button
                            onClick={handleRenew}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 "

                        >
                            Renew Profile
                        </Button>

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



function Donate() {
    const [donationSuccess, setDonationSuccess] = useState(false);

    const handleDonate = () => {
        //  Here you would integrate with your payment gateway
        //   For this example, we'll just simulate a successful donation.
        setDonationSuccess(true);
    };

    if (donationSuccess) {
        return (
            <div className="bg-gray-50 font-sans antialiased min-h-screen">
                <nav className="bg-white shadow-md py-4">
                    <div className="container mx-auto flex justify-between items-center px-6">
                        <Link to="/dashboard" className="text-xl font-bold text-indigo-700">
                            Donate
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
                            <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you for your Donation!</h2>
                            <p className="text-gray-700">Your contribution is greatly appreciated.</p>
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
                        Donate
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
                        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Donate to Support Us</h2>
                        <p className="text-gray-700 mb-4">Your generous donation will help us continue to provide valuable services.</p>
                        <Button
                            onClick={handleDonate}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            disabled // Added the disabled attribute here
                        >
                            Donate Now
                        </Button>
                        {/* Add your donation options (e.g., amount selection), */}
                        {/* and integrate with a payment gateway like Razorpay (or any other) here. */}
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

export default Donate;
