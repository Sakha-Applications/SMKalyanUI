import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import getBaseUrl from "../../utils/GetUrl";
import { fetchDefaultPhoto } from "../UploadProfilePhoto/photoUploadUtils";

const FALLBACK_DEFAULT_IMAGE = "/ProfilePhotos/defaultImage.jpg";

// ✅ Status helpers
const normalizeStatus = (s) => (typeof s === "string" ? s.trim().toUpperCase() : "");
const isApproved = (status) => normalizeStatus(status) === "APPROVED";

const getStatusUi = (status) => {
  const s = normalizeStatus(status);
  switch (s) {
    case "DRAFT":
      return { label: "Draft", className: "text-gray-600" };
    case "SUBMITTED":
      return { label: "Submitted", className: "text-yellow-700" };
    case "PAYMENT_SUBMITTED":
      return { label: "Payment Submitted", className: "text-blue-700" };
    case "APPROVED":
      return { label: "Approved", className: "text-green-600 font-medium" };
    default:
      return { label: s || "UNKNOWN", className: "text-gray-600" };
  }
};

const blockedMsg =
  "Your profile is under review. Search features will be available once your profile is approved.";

const SidebarMenu = ({ profileId }) => {
  const [defaultPhotoUrl, setDefaultPhotoUrl] = useState(FALLBACK_DEFAULT_IMAGE);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true);
  const [photoError, setPhotoError] = useState(null);

  const [profileStatus, setProfileStatus] = useState(sessionStorage.getItem("profileStatus") || "");
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // ✅ Navigation items (Search + Advanced Search will be locked in UI)
  const navItems = [
    { to: "/my-profile", label: "Edit Your Profile" },
    { to: "/partner-preferences", label: "Edit Your Preferences" },
    { to: "/basic-search", label: "Search", lockUntilApproved: true },
    { to: "/advanced-search", label: "Advanced Search", lockUntilApproved: true },
  ];

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
      setDefaultPhotoUrl(FALLBACK_DEFAULT_IMAGE);
      setPhotoError(null);
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  const loadProfileStatus = async () => {
    if (!profileId) return;

    setIsLoadingStatus(true);
    try {
      const token = sessionStorage.getItem("token");

      const res = await axios.get(`${getBaseUrl()}/api/profile/${profileId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const status = res?.data?.profile_status || res?.data?.profileStatus || "";
      console.log("[SidebarMenu] Loaded profile status:", status);

      setProfileStatus(status);
      if (status) sessionStorage.setItem("profileStatus", status);
    } catch (err) {
      console.error("[SidebarMenu] Failed to load profile status:", err?.message);
      // keep previous profileStatus
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadAndDisplayDefaultPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  useEffect(() => {
    loadProfileStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const statusUi = getStatusUi(profileStatus);
  const approved = isApproved(profileStatus);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Profile Photo */}
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
          {isLoadingPhoto ? (
            <span className="text-xs text-gray-400">Loading...</span>
          ) : (
            <img
              src={defaultPhotoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setDefaultPhotoUrl(FALLBACK_DEFAULT_IMAGE)}
            />
          )}
        </div>

        <div className="mt-3">
          <Link
            to="/upload-photo"
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Upload your Photo
          </Link>
        </div>

        <hr className="my-3 w-full" />

        {/* Real Profile Status */}
        <p className="text-sm text-gray-700">
          Your Profile Status:{" "}
          <span className={statusUi.className}>
            {isLoadingStatus ? "Loading..." : statusUi.label}
          </span>
        </p>

        <hr className="my-3 w-full" />
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mt-2">
        {navItems.map((item) => {
          const locked = item.lockUntilApproved && !approved;

          return (
            <Link
              key={item.to}
              to={locked ? "#" : item.to}
              onClick={(e) => {
                if (locked) {
                  e.preventDefault();
                  alert(blockedMsg);
                }
              }}
              className={`block px-3 py-2 rounded transition ${
                locked
                  ? "opacity-60 cursor-not-allowed bg-gray-50 text-gray-600"
                  : "hover:bg-indigo-50 text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarMenu;
