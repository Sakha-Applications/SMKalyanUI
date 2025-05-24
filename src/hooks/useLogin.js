import { useState, useEffect } from 'react';
import axios from 'axios';

const useLogin = () => {
    const [userId, setUserId] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkFirstLogin = async () => {
            setMessage('');
            setError('');
            if (userId) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//checkFirstLogin?userId=${userId}`);
                    setIsFirstLogin(response.data.isFirstLogin);
                } catch (err) {
                    console.error('Error checking first login:', err);
                    setError('Failed to check login status.');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsFirstLogin(false);
            }
        };

        checkFirstLogin();
    }, [userId]);

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
    };

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmNewPasswordChange = (e) => {
        setConfirmNewPassword(e.target.value);
    };

    const updatePassword = async () => {
        setIsLoading(true);
        setMessage('');
        setError('');

        if (!newPassword || !confirmNewPassword) {
            setError('Please enter and confirm your new password.');
            setIsLoading(false);
            return { success: false };
        }
        
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            setIsLoading(false);
            return { success: false };
        }

        try {
            const response = await axios.post('https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//updatePassword', {
                userId: userId,
                newPassword: newPassword,
            });
            
            if (response.status === 200) {
                setMessage('Password set successfully. Please log in with your new password.');
                setIsFirstLogin(false);
                setNewPassword('');
                setConfirmNewPassword('');
                return { success: true };
            } else {
                setError('Failed to set new password.');
                return { success: false };
            }
        } catch (err) {
            console.error('Error setting new password:', err);
            setError('Failed to update password on the server.');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const login = async () => {
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post('https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api//login', {
                userId: userId,
                password: currentPassword,
            });
            
            if (response.status === 200) {
                setMessage('Login successful!');
                return { success: true };
            } else if (response.status === 401) {
                setError('Invalid credentials.');
                return { success: false };
            } else {
                setError('Login failed.');
                return { success: false };
            }
        } catch (err) {
            console.error('Error logging in:', err);
            setError('Failed to log in.');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setUserId('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setMessage('');
        setError('');
    };

    return {
        userId,
        currentPassword,
        newPassword,
        confirmNewPassword,
        isFirstLogin,
        message,
        error,
        isLoading,
        handleUserIdChange,
        handleCurrentPasswordChange,
        handleNewPasswordChange,
        handleConfirmNewPasswordChange,
        updatePassword,
        login,
        resetForm
    };
};

export default useLogin;