import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import BackHomeButton from '../hooks/BackHomeButton'; // Import BackHomeButton (adjust path if needed)

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
      const response = await fetch('http://localhost:3001/api/forgot-password', { // Adjust this URL
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
    <div className="bg-gray-50 font-sans antialiased min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/" className="text-xl font-bold text-indigo-700">
            ProfileConnect {/* Or your app name */}
          </Link>
          <div>
            <Link to="/login" className="text-gray-700 hover:text-indigo-500 mr-4">
              Back to Login
            </Link>
            <BackHomeButton /> {/* Use the BackHomeButton */}
          </div>
        </div>
      </nav>

      {/* Main Content Section - Forgot Password Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Forgot Your Password?</h2>
            <p className="text-gray-700 mb-4 text-center">
              Enter your User ID or email address below to initiate the password reset process.
            </p>
            {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="userIdOrEmail" className="block text-gray-700 text-sm font-bold mb-2">
                  User ID or Email:
                </label>
                <input
                  type="text"
                  id="userIdOrEmail"
                  value={userIdOrEmail}
                  onChange={(e) => setUserIdOrEmail(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Initiate Reset'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer (Optional) */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm">
        <div className="container mx-auto px-6">
          <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordScreen;