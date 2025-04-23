import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackHomeButton from '../hooks/BackHomeButton'; // Ensure this import is correct

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/login', { // Corrected API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: username, password: password }), // Ensure backend expects 'userId'
      });

      const data = await response.json();

      if (response.ok && data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('isLoggedIn', 'true');
        //  ADD THIS BLOCK TO STORE USER EMAIL
        if (data.user && data.user.email) {
          localStorage.setItem('userEmail', data.user.email);
        } else {
          console.warn("User email not found in login response."); //  Important:  Handle this case!
          //  You might want to set a default or show an error to the user.
        }
        //  END OF ADDED BLOCK
        navigate('/dashboard'); // Redirect to dashboard on successful login
      } else {
        setError(data.error || 'Invalid username or password.'); // Use 'data.error' to match backend response
      }
    } catch (error) {
      setError('An error occurred during login.');
      console.error('Login error:', error);
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
            <Link to="/profile-register" className="text-gray-700 hover:text-indigo-500 mr-4">
              Join Now
            </Link>
            <BackHomeButton /> {/* Use the BackHomeButton */}
          </div>
        </div>
      </nav>

      {/* Main Content Section - Login Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                  User ID or Email:
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-indigo-500 hover:text-indigo-800">
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Logging In...' : 'Login'}
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
}

export default LoginScreen;
