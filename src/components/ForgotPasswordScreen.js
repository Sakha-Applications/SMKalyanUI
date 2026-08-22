import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import getBaseUrl from "../utils/GetUrl";

import BrandHeader from "../shared/layouts/BrandHeader";
import BrandFooter from "../shared/layouts/BrandFooter";

import {
  designClasses,
} from "../shared/styles/designTokens";

const ForgotPasswordScreen = () => {
  const [userIdOrEmail, setUserIdOrEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${getBaseUrl()}/api/forgot-password`, { // Adjust this URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIdOrEmail }),
      });

      const data = await response.json();

      if (response.ok && data.userId) {
        setMessage(data.message || 'Temporary token generated. Proceed to reset password.');
        navigate('/reset-password', { state: { userId: data.userId } });
      } else {
        setError(data.error || 'Failed to initiate password reset.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Error sending password reset request:', err);
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
              Forgot Password
            </h1>

            <p
              className={`mt-2 text-sm leading-6 ${designClasses.textSecondary}`}
            >
              Enter your User ID or email
              address to begin the password
              reset process.
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 rounded-xl p-3 text-sm ${designClasses.statusSuccess}`}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              className={`mb-4 rounded-xl p-3 text-sm ${designClasses.statusError}`}
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="userIdOrEmail"
                className={designClasses.fieldLabel}
              >
                User ID or Email
              </label>

              <input
                type="text"
                id="userIdOrEmail"
                value={userIdOrEmail}
                onChange={(e) =>
                  setUserIdOrEmail(
                    e.target.value
                  )
                }
                required
                disabled={isLoading}
                className={`w-full rounded-lg border px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-[#D79A1E]/30 ${designClasses.border} ${designClasses.surface} ${designClasses.textDark}`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-lg px-4 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${designClasses.primaryButton}`}
            >
              {isLoading
                ? "Sending..."
                : "Continue"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className={`text-sm font-semibold ${designClasses.textPrimary}`}
            >
              Back to Login
            </Link>
          </div>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
};

export default ForgotPasswordScreen;