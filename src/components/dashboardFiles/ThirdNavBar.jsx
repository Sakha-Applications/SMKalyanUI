import { Link } from "react-router-dom";

const thirdNavLinks = [
  { to: "/dashboard", label: "Home / Dashboard" },
  { to: "/my-profile", label: "My Profile" },
  { to: "/partner-preferences", label: "Partner Preference" },
  { to: "/my-photos", label: "My Photos" }
];

const ThirdNavBar = () => (
  <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow mb-4 flex justify-around flex-wrap items-center text-sm font-medium">
    {thirdNavLinks.map((item) => (
      <Link
        key={item.to}
        to={item.to}
        className="px-4 py-1 rounded hover:bg-indigo-500 transition cursor-pointer"
      >
        {item.label}
      </Link>
    ))}
  </div>
);

export default ThirdNavBar;
