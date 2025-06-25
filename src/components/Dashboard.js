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

const Dashboard = () => {
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
              <TopNavTabs />
              <SecondaryNavBar />
            </div>

            {/* Pass userProfileId to DashboardLayout */}
            <DashboardLayout profileId={userProfileId}>
              <MissionBox />

              <TimelineStatsGrid />

              <h3 className="text-xl font-semibold mb-4 text-indigo-800">Suggested Matches</h3>
              <MatchGrid />

              <h3 className="text-xl font-semibold mt-8 mb-4 text-indigo-800">Invitations</h3>
              <MatchGrid />
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
    </div>
  );
};

export default Dashboard;