import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import getBaseUrl from "../utils/GetUrl";

import BrandHeader from "../shared/layouts/BrandHeader";
import BrandFooter from "../shared/layouts/BrandFooter";

import {
  designClasses,
} from "../shared/styles/designTokens";

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
            const response = await fetch(`${getBaseUrl()}/api/updatePassword`, {
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
        <div
          className={`flex min-h-screen flex-col ${designClasses.page}`}
        >
            <BrandHeader compact />

            <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
                <section
                  className={`${designClasses.card} w-full max-w-md p-6 sm:p-8`}
                >
                    <div className="mb-6 text-center">
                        <h1
                          className={`text-2xl font-semibold ${designClasses.textPrimary}`}
                        >
                            Reset Password
                        </h1>

                        <p
                          className={`mt-2 text-sm ${designClasses.textSecondary}`}
                        >
                            Set a new password for
                            your Kalyana Sakha
                            account.
                        </p>
                    </div>

                    {error && (
                        <div
                          className={`mb-4 rounded-xl p-3 text-sm ${designClasses.statusError}`}
                          role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div
                          className={`mb-4 rounded-xl p-3 text-sm ${designClasses.statusSuccess}`}
                        >
                            {successMessage}

                            <p
                              className={`mt-1 text-xs ${designClasses.textSecondary}`}
                            >
                                Redirecting to login...
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label
                              className={designClasses.fieldLabel}
                            >
                                User ID
                            </label>

                            <input
                                type="text"
                                value={userId || ""}
                                disabled
                                className={`w-full rounded-lg border px-3 py-2.5 ${designClasses.border} ${designClasses.readOnlyField} ${designClasses.textSecondary}`}
                            />
                        </div>

                        <div>
                            <label
                              className={designClasses.fieldLabel}
                            >
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                  setNewPassword(
                                    e.target.value
                                  )
                                }
                                disabled={isLoading}
                                className={`w-full rounded-lg border px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-[#D79A1E]/30 ${designClasses.border} ${designClasses.surface} ${designClasses.textDark}`}
                            />
                        </div>

                        <div>
                            <label
                              className={designClasses.fieldLabel}
                            >
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                  setConfirmNewPassword(
                                    e.target.value
                                  )
                                }
                                disabled={isLoading}
                                className={`w-full rounded-lg border px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-[#D79A1E]/30 ${designClasses.border} ${designClasses.surface} ${designClasses.textDark}`}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleResetPassword}
                            disabled={isLoading}
                            className={`w-full rounded-lg px-4 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${designClasses.primaryButton}`}
                        >
                            {isLoading
                              ? "Processing..."
                              : "Change Password"}
                        </button>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className={`text-sm font-semibold ${designClasses.textPrimary}`}
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <BrandFooter />
        </div>
    );
}

export default ResetPasswordScreen;