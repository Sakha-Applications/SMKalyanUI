import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { fetchDefaultPhoto } from '../UploadProfilePhoto/photoUploadUtils';

const navItems = [
  { to: "/my-profile", label: "Edit Your Profile" },
  { to: "/partner-preferences", label: "Edit Your Preferences" },
  { to: "/basic-search", label: "Search" },
  { to: "/advanced-search", label: "Advanced Search" }
];

const SidebarMenu = ({ profileId }) => {
  const [defaultPhotoUrl, setDefaultPhotoUrl] = useState('https://via.placeholder.com/150');
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true);
  const [photoError, setPhotoError] = useState(null);

  const loadAndDisplayDefaultPhoto = async () => {
    console.log("[SidebarMenu] Attempting to load default profile photo.");

    if (!profileId) {
      console.warn("[SidebarMenu] No profile ID available from prop. Cannot fetch default photo.");
      setDefaultPhotoUrl('https://via.placeholder.com/150?text=No+User');
      setIsLoadingPhoto(false);
      setPhotoError(null);
      return;
    }

    setIsLoadingPhoto(true);
    setPhotoError(null); // Clear error at the start of fetch

    try {
      await fetchDefaultPhoto(
        profileId,
        (photoObject) => {
          if (photoObject && photoObject.fullUrl) {
            setDefaultPhotoUrl(photoObject.fullUrl);
            setPhotoError(null); // <<< IMPORTANT: Clear error on successful fetch
            console.log("[SidebarMenu] Default photo fetched successfully for profile ID:", profileId, "URL:", photoObject.fullUrl);
          } else {
            setDefaultPhotoUrl('https://via.placeholder.com/150?text=No+Photo');
            setPhotoError("No profile photo found."); // Specific message for no photo
            console.log("[SidebarMenu] No default photo found for profile ID:", profileId, "or incomplete data.");
          }
        },
        (error) => {
          const errorMessage = error && error.message ? error.message : "Failed to load photo due to an API error.";
          console.error("[SidebarMenu] Error fetching default photo for profile ID:", profileId, error);
          setPhotoError(errorMessage);
          setDefaultPhotoUrl('https://placehold.co/150x150/ff0000/ffffff?text=Error');
        }
      );
    } catch (err) {
      console.error("[SidebarMenu] Unexpected runtime error during photo load for profile ID:", profileId, err);
      setPhotoError("An unexpected error occurred while loading photo.");
      setDefaultPhotoUrl('https://placehold.co/150x150/ff0000/ffffff?text=Error');
    } finally {
      setIsLoadingPhoto(false);
      console.log("[SidebarMenu] Default photo loading process completed for profile ID:", profileId);
    }
  };

  useEffect(() => {
    console.log("[SidebarMenu] useEffect triggered. Profile ID:", profileId);
    if (profileId) {
      loadAndDisplayDefaultPhoto();
    } else {
      setDefaultPhotoUrl('https://via.placeholder.com/150?text=No+User');
      setIsLoadingPhoto(false);
      setPhotoError(null);
      console.log("[SidebarMenu] Profile ID is null, skipping default photo fetch.");
    }
  }, [profileId]);

  return (
    <div className="bg-white text-gray-800 h-full rounded-xl shadow-md p-6 border border-gray-200 text-sm">
      <div className="text-center mb-6">
        {/* Conditional rendering for Profile Image */}
        {isLoadingPhoto ? (
          <div className="flex items-center justify-center w-32 h-32 mx-auto rounded shadow bg-gray-100 animate-pulse">
            <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="sr-only">Loading profile photo...</span>
          </div>
        ) : (
          // Display the fetched photo or a specific placeholder/error image
          <img
            src={defaultPhotoUrl}
            alt="Profile Photo"
            className="rounded shadow mx-auto w-32 h-32 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/150x150/cccccc/333333?text=Image+Load+Fail';
              setPhotoError("Image failed to load visually in browser."); // Provide UI feedback for browser error
              console.error("[SidebarMenu] Image element onError triggered. Image source likely invalid or unreachable:", defaultPhotoUrl);
            }}
          />
        )}

        {photoError && (
          <p className="text-red-500 text-xs mt-1">{photoError}</p>
        )}

        {/* Upload your Photo (Clickable) */}
        <div className="mt-2">
          <Link
            to="/upload-photo"
            className="text-indigo-600 text-sm hover:underline font-medium"
          >
            Upload your Photo
          </Link>
        </div>

        <hr className="my-3" />

        {/* Placeholder Profile Status */}
        <p className="text-sm text-gray-700">
          Your Profile Status:{" "}
          <span className="text-green-600 font-medium">Verified</span>
          {/* You can replace with dynamic status */}
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