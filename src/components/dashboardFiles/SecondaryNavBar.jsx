import { Link } from "react-router-dom";

const secondaryLinks = [
  { to: "/renew-profile", label: "Renew Profile Activation" },
  { to: "/make-preferred", label: "Make Profile Preferred" },
  { to: "/donate", label: "Donate for the Cause" }
];

const SecondaryNavBar = () => (
  <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow mb-2 flex justify-around flex-wrap items-center text-sm font-medium">
    {secondaryLinks.map((item) => (
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

export default SecondaryNavBar;
