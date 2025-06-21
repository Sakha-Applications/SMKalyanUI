import {
  HeaderBar,
  DashboardLayout,
  MissionBox,
  StatsCard,
  MatchGrid,
  TimelineStatsGrid,
  TopNavTabs
} from "../components/dashboard";
import PreferredProfilesSection from "../components/preferredProfile/PreferredProfilesSection";

const Dashboard = () => {
  const userProfileId = sessionStorage.getItem("profileId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-6">
        <HeaderBar />
        <TopNavTabs />

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
            <DashboardLayout>
              <MissionBox />
              <TimelineStatsGrid />
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">Your Matches</h3>
              <MatchGrid />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <StatsCard icon="diversity_1" title="Active Profiles" value="5,280" />
                <StatsCard icon="favorite" title="Successful Matches" value="1,620" color="text-green-600" />
                <StatsCard icon="people" title="New Members" value="148" color="text-orange-600" subtext="this month" />
              </div>
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
