import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  clearPostLoginReturnTo,
  consumePostLoginReturnTo,
} from "../utils/authNavigation";

import getBaseUrl from "../utils/GetUrl";
import profileService from "../services/profileService";

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
  const location = useLocation();

  const loginMessage =
    location?.state?.loginMessage ||
    "";

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

        if (
          data.user &&
          data.user.email
        ) {
          sessionStorage.setItem(
            "userEmail",
            data.user.email
          );
        } else {
          console.warn(
            "User email not found in login response."
          );
        }

        /*
         * Resolve role before loading a matrimonial
         * profile. ADMIN/MODERATOR users do not need
         * member-profile hydration to enter their
         * operational workbench.
         */
        let role =
          (
            data?.user?.role ||
            data?.role ||
            ""
          ).toString();

        try {
          if (
            !role &&
            data?.token
          ) {
            const payloadBase64 =
              data.token.split(
                "."
              )[1];

            const payloadJson =
              JSON.parse(
                atob(
                  payloadBase64
                )
              );

            role =
              (
                payloadJson?.role ||
                ""
              ).toString();
          }
        } catch (decodeError) {
          console.warn(
            "Unable to decode JWT role:",
            decodeError
          );
        }

        if (role) {
          sessionStorage.setItem(
            "userRole",
            role
          );
        } else {
          console.warn(
            "userRole could not be determined from response/token."
          );
        }

        /*
         * Operational users use the shared
         * Moderator/Admin workbench.
         */
        if (
          [
            "ADMIN",
            "MODERATOR"
          ].includes(
            role.toUpperCase()
          )
        ) {
          clearPostLoginReturnTo();

          navigate(
            "/admin",
            {
              replace: true,
            }
          );
          return;
        }

        /*
         * Member login:
         *
         * Hydrate profile identity/status through
         * the shared profile service instead of
         * duplicating the /modifyProfile request.
         */
        try {
          const profileResponse =
            await profileService
              .getMyProfile();

          const profile =
            profileResponse?.profile ||
            profileResponse ||
            {};

          const resolvedProfileId =
            profile?.profile_id ||
            profile?.profileId ||
            data?.user?.profile_id ||
            data?.user?.profileId ||
            "";

          const resolvedProfileStatus =
            profileResponse
              ?.profile_status ||
            profileResponse
              ?.profileStatus ||
            profile
              ?.profile_status ||
            profile
              ?.profileStatus ||
            data?.user
              ?.profile_status ||
            data?.user
              ?.profileStatus ||
            "";

          const resolvedName =
            profile?.name ||
            data?.user?.name ||
            "";

          if (
            resolvedProfileId
          ) {
            sessionStorage.setItem(
              "profileId",
              String(
                resolvedProfileId
              )
            );
          } else {
            sessionStorage.removeItem(
              "profileId"
            );
          }

          if (
            resolvedProfileStatus
          ) {
            sessionStorage.setItem(
              "profileStatus",
              String(
                resolvedProfileStatus
              )
            );
          } else {
            /*
             * Do not warn here.
             * Dashboard/Profile can refresh the
             * authoritative status when required.
             */
            sessionStorage.removeItem(
              "profileStatus"
            );
          }

          if (resolvedName) {
            sessionStorage.setItem(
              "name",
              String(
                resolvedName
              )
            );
          }

        } catch (
          profileFetchError
        ) {
          /*
           * Authentication itself succeeded.
           * Do not reject the member's login solely
           * because profile hydration failed.
           */
          console.error(
            "Unable to load member profile after login:",
            profileFetchError
          );
        }

        const postLoginReturnTo =
          consumePostLoginReturnTo(
            location?.state
              ?.returnTo
          );

        navigate(
          postLoginReturnTo,
          {
            replace: true,
          }
        );
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

          {loginMessage && (
            <div
              className={`mb-4 rounded-xl p-3 text-sm ${designClasses.statusInfo}`}
              role="status"
            >
              {loginMessage}
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

