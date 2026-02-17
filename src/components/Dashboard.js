import {
  HeaderBar,
  DashboardLayout,
  MissionBox,
  TimelineStatsGrid,
  TopNavTabs,
  SecondaryNavBar
} from "./dashboardFiles";
import PreferredProfilesSection from "./preferredProfile/PreferredProfilesSection";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PreferencesReminderDialog from "../components/common/PreferencesReminderDialog";
import getBaseUrl from "../utils/GetUrl";

const normalizeStatus = (s) => (typeof s === "string" ? s.trim().toUpperCase() : "");

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
  const token = sessionStorage.getItem("token");

  // ✅ NEW: profileStatus state for banner
  const [profileStatus, setProfileStatus] = useState(
    sessionStorage.getItem("profileStatus") || ""
  );

  useEffect(() => {
    // Fetch status once on dashboard load (ensures message shown immediately after login)
    const fetchStatus = async () => {
      if (!userProfileId || !token) return;

      try {
        const res = await fetch(`${getBaseUrl()}/api/profile/${userProfileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        // profileRoutes may return different shapes; try common fields
        const status =
          data?.profile_status ||
          data?.profileStatus ||
          data?.profile?.profile_status ||
          "";

        if (status) {
          setProfileStatus(status);
          sessionStorage.setItem("profileStatus", status);
          console.log("✅ Dashboard fetched profileStatus:", status);
        } else {
          console.warn("⚠️ Dashboard: profileStatus not found in /api/profile response:", data);
        }
      } catch (e) {
        console.error("❌ Dashboard: failed to fetch profile status:", e);
      }
    };

    fetchStatus();
  }, [userProfileId, token]);

  const statusU = normalizeStatus(profileStatus);

  const showApprovalBanner = statusU && statusU !== "APPROVED";

  const bannerContent = () => {
    // Professional guidance
    if (statusU === "DRAFT") {
      return (
        <>
          <div className="font-semibold text-yellow-900">Your profile is incomplete.</div>
          <div className="text-sm text-yellow-900 mt-1">
            Please complete and submit your profile for review. Full features will be enabled once your profile is approved.
          </div>
          <div className="mt-3">
            <Link
              to="/my-profile"
              className="inline-block px-3 py-2 rounded bg-yellow-700 text-white text-sm hover:bg-yellow-800"
            >
              Complete Profile
            </Link>
          </div>
        </>
      );
    }

    // SUBMITTED / PAYMENT_SUBMITTED
    return (
      <>
        <div className="font-semibold text-blue-900">Your profile is under review.</div>
        <div className="text-sm text-blue-900 mt-1">
          Some features are temporarily restricted until approval. You will get full access once your profile is approved.
        </div>
      </>
    );
  };

  console.log("[Dashboard] Retrieved profileId from sessionStorage:", userProfileId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-6">
        <HeaderBar />

        {/* ✅ NEW: Approval banner shown immediately after login */}
        {showApprovalBanner && (
          <div className="mb-4 rounded-lg border p-4 bg-blue-50 border-blue-200">
            {bannerContent()}
            <div className="text-xs text-gray-600 mt-2">
              Current status: <span className="font-medium">{statusU}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4">
          {/* Left Ads/Preferred Profiles */}
          <div className="hidden md:block">
            <PreferredProfilesSection
              showTicker
              showCards
              tickerLimit={8}
              cardsLimit={6}
              userProfileId={userProfileId}
            />
          </div>

          {/* Center Main Dashboard */}
          <div className="w-full">
            <div className="mb-2">
              <TopNavTabs onMatchesClick={handleOpenPreferencesReminder} />
              <SecondaryNavBar />
            </div>

            <DashboardLayout profileId={userProfileId}>
              <MissionBox />
              <TimelineStatsGrid />
            </DashboardLayout>
          </div>

          {/* Right Future Ads */}
          <div className="hidden md:block">
            <div className="bg-white rounded shadow text-center py-6 text-gray-400">
              <p>Ad Space</p>
            </div>
          </div>
        </div>
      </div>

      <PreferencesReminderDialog
        open={showPreferencesReminder}
        onClose={handleClosePreferencesReminder}
        onSetPreferences={handleSetPreferencesClick}
        onFindMatches={handleFindMatchesClick}
      />
    </div>
  );
};

export default Dashboard;
