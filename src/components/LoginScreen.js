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
      const response = await fetch(`${getBaseUrl()}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: username, password: password }),
      });

      const data = await response.json();
      
      if (response.ok && data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('isLoggedIn', 'true');

        if (data.user && data.user.email) {
          sessionStorage.setItem('userEmail', data.user.email);
          
          // Fetch profile ID from modifyProfile
          try {
            const token = data.token;
            const response = await fetch(`${getBaseUrl()}/api/modifyProfile`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const profileData = await response.json();

            if (response.ok && profileData.profile_id) {
              sessionStorage.setItem('profileId', profileData.profile_id);
              

              // Store profile status for member access checks.
  const status =
    profileData?.profile_status ||
    profileData?.profileStatus ||
    profileData?.profile?.profile_status ||
    "";

  if (status) {
    sessionStorage.setItem("profileStatus", status);
    
  } else {
    console.warn("âš ï¸ profileStatus not found in modifyProfile response:", profileData);
  }
            } else {
              console.warn("âš ï¸ Profile ID not found in modifyProfile response:", profileData);
            }
          } catch (fetchError) {
            console.error("âŒ Error fetching profile ID:", fetchError);
          }
        } else {
          console.warn("User email not found in login response.");
        }

        // Store role for routing decisions (prefer JWT payload as source of truth)
let role = (data?.user?.role || data?.role || '').toString();

try {
  if (!role && data?.token) {
    const payloadBase64 = data.token.split('.')[1];
    const payloadJson = JSON.parse(atob(payloadBase64));
    role = (payloadJson?.role || '').toString();
  }
} catch (e) {
  console.warn("âš ï¸ Unable to decode JWT role:", e);
}

if (role) {
  sessionStorage.setItem('userRole', role);
  
} else {
  console.warn("âš ï¸ userRole could not be determined from response/token.");
}

// Operational users use the shared Moderator/Admin workbench.
if (
  ["ADMIN", "MODERATOR"].includes(
    role.toUpperCase()
  )
) {
  navigate("/admin");
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
              Member Login
            </h1>

            <p
              className={`mt-2 text-sm ${designClasses.textSecondary}`}
            >
              Sign in to continue to your
              Kalyana Sakha account.
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

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="username"
                className={designClasses.fieldLabel}
              >
                User ID or Email
              </label>

              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
                disabled={isLoading}
                className={`w-full rounded-lg border px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-[#D79A1E]/30 ${designClasses.border} ${designClasses.surface} ${designClasses.textDark}`}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={designClasses.fieldLabel}
              >
                Password
              </label>

              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                disabled={isLoading}
                className={`w-full rounded-lg border px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-[#D79A1E]/30 ${designClasses.border} ${designClasses.surface} ${designClasses.textDark}`}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Link
                to="/forgot-password"
                className={`text-sm font-semibold ${designClasses.textPrimary}`}
              >
                Forgot Password?
              </Link>

              <Link
                to="/profile-register"
                className={`text-sm font-semibold ${designClasses.textAccent}`}
              >
                Join Now
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-lg px-4 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${designClasses.primaryButton}`}
            >
              {isLoading
                ? "Logging In..."
                : "Login"}
            </button>
          </form>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}

export default LoginScreen;

