import {
  HeaderBar,
  DashboardLayout,
  MissionBox,
  StatsCard,
  MatchGrid,
  TimelineStatsGrid,
  TopNavTabs,
  SecondaryNavBar,
  ThirdNavBar
} from "./dashboardFiles";
import PreferredProfilesSection from "./preferredProfile/PreferredProfilesSection";
import React, { useState } from 'react'; // ADD this import or ensure useState is included
import { useNavigate } from 'react-router-dom'; // ADD this import
import PreferencesReminderDialog from '../components/common/PreferencesReminderDialog'; // ADD this import



const Dashboard = () => {
  const navigate = useNavigate(); // ADD this line

  // State to manage the visibility of the preferences reminder dialog
  const [showPreferencesReminder, setShowPreferencesReminder] = useState(false); // ADD this line

  // Handler to open the dialog
  const handleOpenPreferencesReminder = () => { // ADD this function
    setShowPreferencesReminder(true);
  };

  // Handler to close the dialog
  const handleClosePreferencesReminder = () => { // ADD this function
    setShowPreferencesReminder(false);
  };

  // Handler for 'Set Preferences' button click in the dialog
  const handleSetPreferencesClick = () => { // ADD this function
    handleClosePreferencesReminder(); // Close the dialog
    navigate('/partner-preferences'); // Navigate to the PartnerPreferencesPage route
  };

  // Handler for 'Find Matches Anyway' button click in the dialog
  const handleFindMatchesClick = () => { // ADD this function
    handleClosePreferencesReminder(); // Close the dialog
    navigate('/all-matches'); // Navigate to the new dedicated matches page
  };

  const userProfileId = sessionStorage.getItem("profileId");
  console.log("[Dashboard] Retrieved profileId from sessionStorage:", userProfileId);
  console.log("[Dashboard] SessionStorage contents:", sessionStorage);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-6">
        <HeaderBar />

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
              {/* NOTE: You have a duplicate <TopNavTabs /> here.
                 Please remove the one without the onMatchesClick prop. */}
  
              <SecondaryNavBar />
            </div>

            {/* Pass userProfileId to DashboardLayout */}
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

      {/* PASTE THE DIALOG COMPONENT HERE, right before this div's closing tag */}
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