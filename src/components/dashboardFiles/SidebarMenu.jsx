import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchDefaultPhoto } from "../UploadProfilePhoto/photoUploadUtils";

const FALLBACK_DEFAULT_IMAGE = "/ProfilePhotos/defaultImage.jpg";

const navItems = [
  { to: "/my-profile", label: "Edit Your Profile" },
  { to: "/partner-preferences", label: "Edit Your Preferences" },
  { to: "/basic-search", label: "Search" },
  { to: "/advanced-search", label: "Advanced Search" },
];

const SidebarMenu = ({ profileId }) => {
  const [defaultPhotoUrl, setDefaultPhotoUrl] = useState(FALLBACK_DEFAULT_IMAGE);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true);
  const [photoError, setPhotoError] = useState(null);

  const loadAndDisplayDefaultPhoto = async () => {
    console.log("[SidebarMenu] Attempting to load default profile photo.");

    if (!profileId) {
      console.warn("[SidebarMenu] No profile ID available. Using fallback image.");
      setDefaultPhotoUrl(FALLBACK_DEFAULT_IMAGE);
      setIsLoadingPhoto(false);
      setPhotoError(null);
      return;
    }

    setIsLoadingPhoto(true);
    setPhotoError(null);

    try {
      let fetchedPhotoObj = null;
      let fetchedErrorMsg = null;

      await fetchDefaultPhoto(
        profileId,
        (photoObject) => {
          fetchedPhotoObj = photoObject;
        },
        (error) => {
          fetchedErrorMsg = error;
        }
      );

      // ✅ If photo exists, use it. Otherwise fallback silently (NO red error tile)
      if (fetchedPhotoObj && fetchedPhotoObj.fullUrl) {
        setDefaultPhotoUrl(fetchedPhotoObj.fullUrl);
        setPhotoError(null);
        console.log(
          "[SidebarMenu] Default photo fetched successfully for profile ID:",
          profileId,
          "URL:",
          fetchedPhotoObj.fullUrl
        );
      } else {
        setDefaultPhotoUrl(FALLBACK_DEFAULT_IMAGE);
        setPhotoError(null);

        if (fetchedErrorMsg) {
          console.warn(
            "[SidebarMenu] No default photo found for profile ID:",
            profileId,
            "Using fallback.",
            fetchedErrorMsg
          );
        } else {
          console.log(
            "[SidebarMenu] No default photo returned for profile ID:",
            profileId,
            "Using fallback."
          );
        }
      }
    } catch (err) {
      console.error(
        "[SidebarMenu] Unexpected runtime error during photo load for profile ID:",
        profileId,
        err
      );
      // Even for unexpected errors, show fallback image (don't show red tile unless you want)
      setDefaultPhotoUrl(FALLBACK_DEFAULT_IMAGE);
      setPhotoError(null);
    } finally {
      setIsLoadingPhoto(false);
      console.log(
        "[SidebarMenu] Default photo loading process completed for profile ID:",
        profileId
      );
    }
  };

  useEffect(() => {
    console.log("[SidebarMenu] useEffect triggered. Profile ID:", profileId);

    if (profileId) {
      loadAndDisplayDefaultPhoto();
    } else {
      setDefaultPhotoUrl(FALLBACK_DEFAULT_IMAGE);
      setIsLoadingPhoto(false);
      setPhotoError(null);
      console.log("[SidebarMenu] Profile ID is null, using fallback image.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  return (
    <div className="bg-white text-gray-800 h-full rounded-xl shadow-md p-6 border border-gray-200 text-sm">
      <div className="text-center mb-6">
        {/* Conditional rendering for Profile Image */}
        {isLoadingPhoto ? (
          <div className="flex items-center justify-center w-32 h-32 mx-auto rounded shadow bg-gray-100 animate-pulse">
            <svg
              className="animate-spin h-8 w-8 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="sr-only">Loading profile photo...</span>
          </div>
        ) : (
          <img
            src={defaultPhotoUrl}
            alt="Profile Photo"
            className="rounded shadow mx-auto w-32 h-32 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_DEFAULT_IMAGE;
            }}
          />
        )}

        {/* We intentionally do NOT show error for "no photo" */}
        {photoError && <p className="text-red-500 text-xs mt-1">{photoError}</p>}

        {/* Upload your Photo (Clickable) */}
        <div className="mt-2">
          <Link to="/upload-photo" className="text-indigo-600 text-sm hover:underline font-medium">
            Upload your Photo
          </Link>
        </div>

        <hr className="my-3" />

        {/* Placeholder Profile Status */}
        <p className="text-sm text-gray-700">
          Your Profile Status: <span className="text-green-600 font-medium">Verified</span>
        </p>

        <hr className="my-3" />
      </div>

      {/* Main Navigation */}
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block px-3 py-2 rounded hover:bg-indigo-100 text-indigo-800 font-medium"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SidebarMenu;
