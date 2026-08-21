import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import MemberLayout from "../../shared/layouts/MemberLayout";
import dashboardDiscoveryService from "../../services/dashboardDiscoveryService";
import profileService from "../../services/profileService";

import ProfileCard from "./components/ProfileCard/ProfileCard";
import styles from "./components/MatchGrid.module.css";

const FALLBACK_DEFAULT_IMAGE_PATH = "/ProfilePhotos/defaultImage.jpg";

const DISCOVERY_LABELS = {
  recent: "Recently Joined",
  "same-city": "Same City",
  "same-mother-tongue": "Same Mother Tongue",
  gotra: "Compatible Gotra",
  profession: "Profession",
  international: "International",
};

const DISCOVERY_TYPES = {
  recent: "RECENT",
  "same-city": "SAME_CITY",
  "same-mother-tongue": "SAME_MOTHER_TONGUE",
  gotra: "GOTRA",
  profession: "PROFESSION",
  international: "INTERNATIONAL",
};

const DiscoverResultsPage = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [searchParams] = useSearchParams();

  const [profiles, setProfiles] = useState([]);
  const [photoUrls, setPhotoUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [error, setError] = useState("");

  const discoveryType = DISCOVERY_TYPES[type];
  const title = DISCOVERY_LABELS[type] || "Discover Profiles";
  const profession = searchParams.get("profession") || "";

  const validType = useMemo(
    () => Boolean(discoveryType),
    [discoveryType]
  );

  useEffect(() => {
    if (!validType) {
      setError("Unsupported discovery category.");
      setLoading(false);
      return;
    }

    const loadProfiles = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await dashboardDiscoveryService.getDiscoveryProfiles(
            discoveryType,
            profession,
            30
          );

        setProfiles(
          Array.isArray(data?.profiles)
            ? data.profiles
            : []
        );
      } catch (err) {
        console.error(
          "[DiscoverResultsPage] Failed to load profiles:",
          err
        );

        setError(
          "Unable to load profiles for this category."
        );
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [discoveryType, profession, validType]);

  useEffect(() => {
    if (profiles.length === 0) {
      setPhotoUrls({});
      return;
    }

    const loadPhotos = async () => {
      setLoadingPhotos(true);

      try {
        const results = await Promise.all(
          profiles.map(async (profile) => {
            const profileId =
              profile.profile_id ||
              profile.profileId;

            let photoUrl =
              FALLBACK_DEFAULT_IMAGE_PATH;

if (profileId) {
  try {
    const photo =
      await profileService.getDefaultPhoto(profileId);

    if (photo?.fullUrl) {
      photoUrl = photo.fullUrl;
    }
  } catch (error) {
    console.error(
      `Unable to load photo for profile ${profileId}:`,
      error
    );
  }
}

            return {
              profileId,
              photoUrl,
            };
          })
        );

        const map = {};

        results.forEach(
          ({ profileId, photoUrl }) => {
            if (profileId) {
              map[profileId] = photoUrl;
            }
          }
        );

        setPhotoUrls(map);
      } finally {
        setLoadingPhotos(false);
      }
    };

    loadPhotos();
  }, [profiles]);

  const handleCardClick = (profileId) => {
    navigate(`/view-profile/${profileId}`);
  };

  return (
    <MemberLayout>
      <div className="w-full">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[#00264D]">
              {title}
            </h1>

            {profession && (
              <p className="mt-1 text-sm text-[#667085]">
                Profession: {profession}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-[#00264D] px-4 py-2 text-sm font-semibold text-[#00264D] transition hover:bg-[#00264D] hover:text-white"
          >
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-[#667085]">
            Loading profiles...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : profiles.length === 0 ? (
          <div className="rounded-xl border border-[#E4E1D9] bg-white p-8 text-center text-sm text-[#667085]">
            No profiles found in this category.
          </div>
        ) : (
          <>
            {loadingPhotos && (
              <div className="mb-3 text-sm text-[#667085]">
                Loading photos...
              </div>
            )}

            <div className={styles.cardsContainer}>
              {profiles.map((profile) => {
                const profileId =
                  profile.profile_id ||
                  profile.profileId;

                return (
                  <ProfileCard
                    key={profileId}
                    profile={profile}
                    imageUrl={
                      photoUrls[profileId] ||
                      FALLBACK_DEFAULT_IMAGE_PATH
                    }
                    onCardClick={handleCardClick}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </MemberLayout>
  );
};

export default DiscoverResultsPage;