import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import getBaseUrl from '../utils/GetUrl';

function ResetPasswordScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId;
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!userId) {
            setError('User ID is missing.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!newPassword) {
            setError('New password cannot be empty.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('${getBaseUrl()}/api//updatePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, newPassword: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.error || 'Failed to reset password.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error('Error resetting password:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-indigo-800 mb-6">Reset Password</h2>
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                        {error}
                    </div>
                )}
                
                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                        {successMessage}
                        <p className="mt-2 text-sm">Redirecting to login page...</p>
                    </div>
                )}
                
                <div className="space-y-6">
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium mb-2">User ID:</label>
                        <input
                            type="text"
                            value={userId || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                        <p className="text-sm text-gray-500 mt-1">Your user ID cannot be changed</p>
                    </div>
                    
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium mb-2">New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium mb-2">Confirm New Password:</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <button
                        onClick={handleResetPassword}
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-indigo-400"
                    >
                        {isLoading ? 'Processing...' : 'Reset Password'}
                    </button>
                    
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordScreen;