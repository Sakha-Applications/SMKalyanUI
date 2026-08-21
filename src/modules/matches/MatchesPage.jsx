import {
  useEffect,
  useState,
} from "react";

import registrationService from "../../services/registrationService";

import MemberLayout from "../../shared/layouts/MemberLayout";
import RestrictedFeatureState from "../../shared/components/RestrictedFeatureState";

import {
  calculateProfileCompletion,
} from "../../shared/utils/profileCompletion";

import {
  designClasses,
} from "../../shared/styles/designTokens";

import MatchGrid from "../dashboard/components/MatchGrid";

const normalizeStatus = (status) =>
  typeof status === "string"
    ? status.trim().toUpperCase()
    : "";

const MatchesPage = () => {
  const profileId =
    sessionStorage.getItem(
      "profileId"
    );

  const [
    profileStatus,
    setProfileStatus,
  ] = useState(
    sessionStorage.getItem(
      "profileStatus"
    ) || ""
  );

  const [
    profileData,
    setProfileData,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        if (!profileId) {
          if (active) {
            setError(
              "Your member profile could not be identified."
            );
          }

          return;
        }

        const response =
          await registrationService.getProfile(
            profileId
          );

        if (!active) {
          return;
        }

        const currentProfile =
          response?.profile ||
          response ||
          {};

        const currentStatus =
          response?.profile_status ||
          response?.profileStatus ||
          currentProfile?.profile_status ||
          currentProfile?.profileStatus ||
          profileStatus ||
          "";

        setProfileData(
          currentProfile
        );

        if (currentStatus) {
          setProfileStatus(
            currentStatus
          );

          sessionStorage.setItem(
            "profileStatus",
            currentStatus
          );
        }
      } catch (requestError) {
        console.error(
          "Unable to load profile for Matches:",
          requestError
        );

        if (active) {
          setError(
            "We could not load your profile information right now."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [
    profileId,
    profileStatus,
  ]);

  const normalizedStatus =
    normalizeStatus(
      profileStatus
    );

  const profileCompletion =
    calculateProfileCompletion(
      profileData || {}
    );

  const approved =
    normalizedStatus ===
    "APPROVED";

  if (loading) {
    return (
      <MemberLayout>
        <div
          className={`${designClasses.card} p-6`}
        >
          <p
            className={`text-sm ${designClasses.textSecondary}`}
          >
            Loading Matches...
          </p>
        </div>
      </MemberLayout>
    );
  }

  if (!approved) {
    return (
      <MemberLayout>
        <RestrictedFeatureState
          featureName="Matches"
          profileStatus={
            profileStatus
          }
          completion={
            profileCompletion
          }
          message="Matches will be available after your profile is approved."
        />
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="space-y-4">
        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <h1
            className={`text-xl font-semibold ${designClasses.textPrimary}`}
          >
            Suggested Matches
          </h1>

          <p
            className={`mt-1 text-sm ${designClasses.textSecondary}`}
          >
            Profiles matching your
            partner expectations.
          </p>
        </section>

        {error ? (
          <div
            className={`rounded-xl p-4 text-sm ${designClasses.statusError}`}
            role="alert"
          >
            {error}
          </div>
        ) : (
          <MatchGrid
            profileId={profileId}
          />
        )}
      </div>
    </MemberLayout>
  );
};

export default MatchesPage;