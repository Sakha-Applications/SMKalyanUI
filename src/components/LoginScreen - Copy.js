import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import
import './LoginScreen.css';

const LoginScreen = () => {
    const navigate = useNavigate(); // Add this line
    const [userId, setUserId] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const checkFirstLogin = async () => {
            setMessage('');
            setError('');
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:3001/api/checkFirstLogin?userId=${userId}`);
                    setIsFirstLogin(response.data.isFirstLogin);
                } catch (err) {
                    console.error('Error checking first login:', err);
                    setError('Failed to check login status.');
                }
            } else {
                setIsFirstLogin(false);
            }
        };

        checkFirstLogin();
    }, [userId]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (isFirstLogin) {
            if (!newPassword || !confirmNewPassword) {
                setError('Please enter and confirm your new password.');
                return;
            }
            if (newPassword !== confirmNewPassword) {
                setError('New passwords do not match.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:3001/api/updatePassword', {
                    userId: userId,
                    newPassword: newPassword,
                });
                if (response.status === 200) {
                    setMessage('Password set successfully. Please log in with your new password.');
                    setIsFirstLogin(false);
                    setNewPassword('');
                    setConfirmNewPassword('');
                } else {
                    setError('Failed to set new password.');
                }
            } catch (err) {
                console.error('Error setting new password:', err);
                setError('Failed to update password on the server.');
            }
        } else {
            try {
                const response = await axios.post('http://localhost:3001/api/login', {
                    userId: userId,
                    password: currentPassword,
                });
                if (response.status === 200) {
                    setMessage('Login successful!');
                    // Redirect to your main application page
                     // Add navigation to home page after successful login
                     setTimeout(() => {
                        navigate('/'); // This will redirect to the home page
                    }, 1000); // 1 second delay so user can see the success message
                } else if (response.status === 401) {
                    setError('Invalid credentials.');
                } else {
                    setError('Login failed.');
                }
            } catch (err) {
                console.error('Error logging in:', err);
                setError('Failed to log in.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {message && <div className="message">{message}</div>}
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>

                {isFirstLogin ? (
                    <div className="first-login-fields">
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password:</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Set New Password</button>
                    </div>
                ) : (
                    <div className="regular-login-field">
                        <div className="form-group">
                            <label htmlFor="currentPassword">Password:</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default LoginScreen;