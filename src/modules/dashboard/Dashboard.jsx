import {
  DashboardLayout,
  TimelineStatsGrid,
  SecondaryNavBar,
  DiscoverGrid
} from "./components";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PreferencesReminderDialog from "../../components/common/PreferencesReminderDialog";
import registrationService from "../../services/registrationService";
import creditService from "../../services/creditService";

import MemberLayout from "../../shared/layouts/MemberLayout";
import ProfileStatusBanner from "../../shared/components/ProfileStatusBanner";
import LowCreditNotice from "../../shared/components/LowCreditNotice";
import {
  calculateProfileCompletion,
} from "../../shared/utils/profileCompletion";

const Dashboard = () => {
  const navigate = useNavigate();

  const [showPreferencesReminder, setShowPreferencesReminder] = useState(false);

  const handleOpenPreferencesReminder = () => setShowPreferencesReminder(true);
  const handleClosePreferencesReminder = () => setShowPreferencesReminder(false);

  const handleSetPreferencesClick = () => {
    handleClosePreferencesReminder();
    navigate("/partner-preferences");
  };

  const handleFindMatchesClick = () => {
    handleClosePreferencesReminder();
    navigate("/all-matches");
  };

  const userProfileId = sessionStorage.getItem("profileId");
  const [profileStatus, setProfileStatus] = useState(
    sessionStorage.getItem("profileStatus") || ""
  );

  const [profileData, setProfileData] =
    useState(null);

  const [
    creditSummary,
    setCreditSummary,
  ] = useState(null);

  useEffect(() => {
  const loadProfileStatus = async () => {
    if (!userProfileId) {
      return;
    }

    try {
      const data =
        await registrationService.getProfile(userProfileId);

      const currentProfile =
        data?.profile || data || {};

      setProfileData(currentProfile);

      const status =
        data?.profile_status ||
        data?.profileStatus ||
        data?.profile?.profile_status ||
        "";

      if (status) {
        setProfileStatus(status);
        sessionStorage.setItem(
          "profileStatus",
          status
        );
      }
    } catch (error) {
      console.error(
        "Unable to load profile status:",
        error
      );
    }
  };

  loadProfileStatus();
}, [userProfileId]);

  useEffect(() => {
    let active = true;

    const loadCreditSummary =
      async () => {
        try {
          const summary =
            await creditService
              .getMyCreditSummary();

          if (active) {
            setCreditSummary(
              summary
            );
          }
        } catch (error) {
          console.error(
            "Unable to load credit summary:",
            error
          );

          if (active) {
            setCreditSummary(
              null
            );
          }
        }
      };

    loadCreditSummary();

    return () => {
      active = false;
    };
  }, []);
  

  const profileCompletion =
    calculateProfileCompletion(profileData || {});

  return (
    <MemberLayout onMatchesClick={handleOpenPreferencesReminder}>
      <div className="w-full">
        
        {profileData && profileStatus && (
          <ProfileStatusBanner
            profileStatus={profileStatus}
            completion={profileCompletion}
          />
        )}
        <LowCreditNotice
          creditSummary={
            creditSummary
          }
          onRecharge={() =>
            navigate(
              "/renew-profile"
            )
          }
        />
                <div className="mb-2">
          <SecondaryNavBar
  profileStatus={profileStatus}
  profileCompletion={profileCompletion}
/>
        </div>

        <DashboardLayout
          profileId={userProfileId}
          profileStatus={profileStatus}
        >
          <TimelineStatsGrid />
          <DiscoverGrid />
        </DashboardLayout>
      </div>

      <PreferencesReminderDialog
        open={showPreferencesReminder}
        onClose={handleClosePreferencesReminder}
        onSetPreferences={handleSetPreferencesClick}
        onFindMatches={handleFindMatchesClick}
      />
    </MemberLayout>
  );
};

export default Dashboard;
