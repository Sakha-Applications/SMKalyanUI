import { Link } from "react-router-dom"; // Import Link component

// Define the tabs with their respective paths
const tabs = [
  { to: "/dashboard", label: "My Kalyana" }, // Assuming My Kalyana links to dashboard
  { to: "/matches", label: "Matches" },      // Assuming a /matches route exists
  { to: "/basic-search", label: "Search" },  // Link to your new Basic Search Form
  { to: "/inbox", label: "Inbox" }           // Assuming an /inbox route exists
];

const TopNavTabs = () => (
  <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow mb-2 flex justify-around flex-wrap items-center text-sm font-medium">
    {tabs.map((item) => ( // Changed 'tab' to 'item' for consistency with secondaryLinks
      <Link
        key={item.to} // Use item.to as the key
        to={item.to} // Use item.to for the Link's 'to' prop
        className="px-4 py-1 rounded hover:bg-indigo-500 transition cursor-pointer"
      >
        {item.label} {/* Use item.label for the displayed text */}
      </Link>
    ))}
  </div>
);

export default TopNavTabs;
