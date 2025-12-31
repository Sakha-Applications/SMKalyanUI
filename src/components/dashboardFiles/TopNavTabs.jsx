import { Link } from "react-router-dom"; // Import Link component

// Define the tabs with their respective paths
const tabs = [
  { to: "/dashboard", label: "My Kalyana" }, // Assuming My Kalyana links to dashboard
  { to: "/matches", label: "Matches" },      // Assuming a /matches route exists
  { to: "/basic-search", label: "Search" },  // Link to your new Basic Search Form
  { to: "/inbox", label: "Connections" }           // Assuming an /inbox route exists
];

const TopNavTabs = ({ onMatchesClick }) => ( // <--- ADDED { onMatchesClick } here
  <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow mb-2 flex justify-around flex-wrap items-center text-sm font-medium">
    {tabs.map((item) => (
      // CORRECTED: Conditionally apply onClick for the 'Matches' tab
      item.label === "Matches" ? (
        <Link
          key={item.to}
          to="#" // Prevent default navigation for the Matches link
          onClick={(e) => {
            e.preventDefault(); // Stop default Link behavior
            onMatchesClick();   // Call the handler passed from Dashboard
          }}
          className="px-4 py-1 rounded hover:bg-indigo-500 transition cursor-pointer"
        >
          {item.label}
        </Link>
      ) : (
        // For other tabs, behave as a regular Link
        <Link
          key={item.to}
          to={item.to}
          className="px-4 py-1 rounded hover:bg-indigo-500 transition cursor-pointer"
        >
          {item.label}
        </Link>
      )
    ))}
  </div>
);

export default TopNavTabs;
