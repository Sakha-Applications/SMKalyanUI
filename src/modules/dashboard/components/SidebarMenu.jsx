import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import profileService from "../../../services/profileService";
import { designClasses } from "../../../shared/styles/designTokens";

const FALLBACK_DEFAULT_IMAGE = "/ProfilePhotos/defaultImage.jpg";

// ✅ Status helpers
const normalizeStatus = (s) => (typeof s === "string" ? s.trim().toUpperCase() : "");

const getStatusUi = (status) => {
  const s = normalizeStatus(status);

  switch (s) {
    case "DRAFT":
      return {
        label: "Draft",
        className: designClasses.statusText,
      };

    case "SUBMITTED":
      return {
        label: "Submitted",
        className: designClasses.textAccent,
      };

    case "PAYMENT_SUBMITTED":
      return {
        label: "Payment Submitted",
        className: designClasses.textPrimary,
      };

    case "APPROVED":
      return {
        label: "Approved",
        className: `${designClasses.textSuccess} font-medium`,
      };

    default:
      return {
        label: s || "Unknown",
        className: designClasses.statusText,
      };
  }
};

const SidebarMenu = ({
  profileId,
  profileStatus = "",
}) => {
  const [defaultPhotoUrl, setDefaultPhotoUrl] = useState(FALLBACK_DEFAULT_IMAGE);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true);
  
  

  const loadAndDisplayDefaultPhoto = async () => {
    if (!profileId) {
      setDefaultPhotoUrl(FALLBACK_DEFAULT_IMAGE);
      setIsLoadingPhoto(false);
      return;
    }

    setIsLoadingPhoto(true);

    try {
      const photo =
        await profileService.getDefaultPhoto(
          profileId
        );

      setDefaultPhotoUrl(
        photo?.fullUrl ||
          FALLBACK_DEFAULT_IMAGE
      );
    } catch (err) {
      console.error(
        `Unable to load photo for profile ${profileId}:`,
        err
      );

      setDefaultPhotoUrl(
        FALLBACK_DEFAULT_IMAGE
      );
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  useEffect(() => {
    loadAndDisplayDefaultPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const statusUi = getStatusUi(profileStatus);

  return (
    <div
      className={`${designClasses.surface} ${designClasses.border} mb-4 flex flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="flex items-center gap-4">
        <div
  className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border ${designClasses.border} ${designClasses.surfaceMuted}`}
>
          {isLoadingPhoto ? (
            <span
  className={`text-xs ${designClasses.textSecondary}`}
>
  Loading...
</span>
          ) : (
            <img
              src={defaultPhotoUrl}
              alt="Profile"
              className="h-full w-full object-cover"
              onError={() => setDefaultPhotoUrl(FALLBACK_DEFAULT_IMAGE)}
            />
          )}
        </div>

        <div>
          <div
            className={`text-sm font-semibold ${designClasses.textPrimary}`}
          >
            My Profile
          </div>

          <div className={`mt-1 text-sm ${designClasses.textSecondary}`}>
            Profile Status:{" "}
            <span
              className={statusUi.className}
            >
              {statusUi.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          to="/upload-photo"
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${designClasses.secondaryButton}`}
        >
          Manage Photos
        </Link>

        <Link
          to="/my-profile"
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${designClasses.primaryButton}`}
        >
          View My Profile
        </Link>
      </div>
    </div>
  );
};

export default SidebarMenu;
