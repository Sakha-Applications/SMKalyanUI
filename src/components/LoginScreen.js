import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackHomeButton from '../hooks/BackHomeButton'; // Ensure this import is correct
import getBaseUrl from '../utils/GetUrl';

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
      console.log('Login API URL:', `${getBaseUrl()}/api/login`);
      const response = await fetch(`${getBaseUrl()}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: username, password: password }),
      });

      const data = await response.json();
      console.log("🔍 Full Login Response:", data);

      if (response.ok && data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('isLoggedIn', 'true');

        if (data.user && data.user.email) {
          localStorage.setItem('userEmail', data.user.email);
          console.log("🔍 Full user object:", data.user);
          console.log("Login Success: User Email stored:", data.user.email);

          // Fetch profile ID from modifyProfile
          try {
            const token = data.token;
            const response = await fetch(`${getBaseUrl()}/api/modifyProfile`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const profileData = await response.json();

            if (response.ok && profileData.profile_id) {
              sessionStorage.setItem('profileId', profileData.profile_id);
              console.log("✅ Fetched and stored profile ID:", profileData.profile_id);

              // ✅ NEW: Store profileStatus if available
  const status =
    profileData?.profile_status ||
    profileData?.profileStatus ||
    profileData?.profile?.profile_status ||
    "";

  if (status) {
    sessionStorage.setItem("profileStatus", status);
    console.log("✅ Stored profileStatus:", status);
  } else {
    console.warn("⚠️ profileStatus not found in modifyProfile response:", profileData);
  }
            } else {
              console.warn("⚠️ Profile ID not found in modifyProfile response:", profileData);
            }
          } catch (fetchError) {
            console.error("❌ Error fetching profile ID:", fetchError);
          }
        } else {
          console.warn("User email not found in login response.");
        }

        // ✅ Store role for routing decisions

        // ✅ Store role for routing decisions (prefer JWT payload as source of truth)
let role = (data?.user?.role || data?.role || '').toString();

try {
  if (!role && data?.token) {
    const payloadBase64 = data.token.split('.')[1];
    const payloadJson = JSON.parse(atob(payloadBase64));
    role = (payloadJson?.role || '').toString();
  }
} catch (e) {
  console.warn("⚠️ Unable to decode JWT role:", e);
}

if (role) {
  sessionStorage.setItem('userRole', role);
  console.log("✅ Stored userRole:", role);
} else {
  console.warn("⚠️ userRole could not be determined from response/token.");
}

// ✅ Redirect admin to admin dashboard
if (role.toUpperCase() === 'ADMIN') {
  navigate('/admin');
  return;
}


        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid username or password.');
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
          <Link to="/home" className="text-xl font-bold text-indigo-700">
            ProfileConnect
          </Link>
          <div>
            <Link to="/profile-register" className="text-gray-700 hover:text-indigo-500 mr-4">
              Join Now
            </Link>
            <BackHomeButton />
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

      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-700 text-sm">
        <div className="container mx-auto px-6">
          <p className="mt-2">&copy; {new Date().getFullYear()} ProfileConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LoginScreen;
