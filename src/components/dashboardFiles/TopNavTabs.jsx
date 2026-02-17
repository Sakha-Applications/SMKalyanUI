import { Link } from "react-router-dom";

const tabs = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/matches", label: "Matches" },
  { to: "/basic-search", label: "Search" },
  { to: "/inbox", label: "Connections" }
];

const isApproved = () => {
  const s = (sessionStorage.getItem("profileStatus") || "").toString().trim().toUpperCase();
  return s === "APPROVED";
};

const blockedMsg =
  "Your profile is under review. This feature will be available once your profile is approved.";

const TopNavTabs = ({ onMatchesClick }) => (
  <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow mb-2 flex justify-around flex-wrap items-center text-sm font-medium">
    {tabs.map((item) => {
      const locked = (item.label === "Matches" || item.label === "Search") && !isApproved();

      // Matches: keep existing behavior when approved, block when not
      if (item.label === "Matches") {
        return (
          <Link
            key={item.to}
            to="#"
            onClick={(e) => {
              e.preventDefault();
              if (locked) {
                alert(blockedMsg);
                return;
              }
              onMatchesClick();
            }}
            className={`px-4 py-1 rounded transition ${
              locked ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-500 cursor-pointer"
            }`}
          >
            {item.label}
          </Link>
        );
      }

      // Search: block navigation when not approved
      if (item.label === "Search") {
        return (
          <Link
            key={item.to}
            to={locked ? "#" : item.to}
            onClick={(e) => {
              if (locked) {
                e.preventDefault();
                alert(blockedMsg);
              }
            }}
            className={`px-4 py-1 rounded transition ${
              locked ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-500 cursor-pointer"
            }`}
          >
            {item.label}
          </Link>
        );
      }

      // Other tabs normal
      return (
        <Link
          key={item.to}
          to={item.to}
          className="px-4 py-1 rounded hover:bg-indigo-500 transition cursor-pointer"
        >
          {item.label}
        </Link>
      );
    })}
  </div>
);

export default TopNavTabs;
