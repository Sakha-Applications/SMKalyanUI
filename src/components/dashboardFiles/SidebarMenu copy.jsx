import { Link } from "react-router-dom";

const navItems = [
  { to: "/my-profile", label: "Edit Your Profile" },
  { to: "/partner-preferences", label: "Edit Your Preferences" },
  { to: "/basic-search", label: "Search" },  // Link to your new Basic Search Form
//  { to: "/contact-details", label: "Search Profiles" }, // Existing Search Profiles link
  { to: "/advanced-search", label: "Advanced Search" } // NEW: Advanced Search link
];

const SidebarMenu = () => (
  <div className="bg-white text-gray-800 h-full rounded-xl shadow-md p-6 border border-gray-200 text-sm">
    <div className="text-center mb-6">
      {/* Placeholder Profile Image */}
      <img
        src="https://via.placeholder.com/150"
        alt="Profile"
        className="rounded shadow mx-auto w-32 h-32 object-cover"
      />

      {/* Upload your Photo (Clickable) */}
      <div className="mt-2">
        <Link
          to="/upload-photo"
          className="text-indigo-600 text-sm hover:underline font-medium"
        >
          Upload your Photo
        </Link>
      </div>

      <hr className="my-3" />

      {/* Placeholder Profile Status */}
      <p className="text-sm text-gray-700">
        Your Profile Status:{" "}
        <span className="text-green-600 font-medium">Verified</span>
        {/* You can replace with dynamic status */}
      </p>

      <hr className="my-3" />
    </div>

    {/* Main Navigation */}
    <nav className="space-y-4">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="block px-3 py-2 rounded hover:bg-indigo-100 text-indigo-800 font-medium"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  </div>
);

export default SidebarMenu;
