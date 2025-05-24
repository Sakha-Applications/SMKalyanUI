import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPasswordScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId; // Retrieve userId from navigation state
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

        try {
            const response = await fetch('https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//updatePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, newPassword: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data); // Assuming your backend sends a success message
                // Optionally navigate the user to the login screen
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.error || 'Failed to reset password.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error('Error resetting password:', err);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <div>
                <label>New Password:</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div>
                <label>Confirm New Password:</label>
                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>
            <button onClick={handleResetPassword}>Reset Password</button>
        </div>
    );
}

export default ResetPasswordScreen;