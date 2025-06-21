const tabs = ["My Kalyana", "Matches", "Search", "Inbox"];

const TopNavTabs = () => (
  <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow mb-2 flex justify-around flex-wrap items-center text-sm font-medium">
    {tabs.map((tab) => (
      <div
        key={tab}
        className="px-4 py-1 rounded hover:bg-indigo-500 transition cursor-pointer"
      >
        {tab}
      </div>
    ))}
  </div>
);

export default TopNavTabs;
