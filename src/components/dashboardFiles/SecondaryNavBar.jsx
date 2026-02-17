import { Link } from "react-router-dom";

const secondaryLinks = [
  { to: "/renew-profile", label: "Renew Profile Activation" },
  { to: "/make-preferred", label: "Make Profile Preferred" },
  { to: "/donate", label: "Donate for the Cause" }
];

const isApproved = () => {
  const s = (sessionStorage.getItem("profileStatus") || "").toString().trim().toUpperCase();
  return s === "APPROVED";
};

const blockedMsg =
  "Your profile is under review. This feature will be available once your profile is approved.";

const SecondaryNavBar = () => (
  <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow mb-2 flex justify-around flex-wrap items-center text-sm font-medium">
    {secondaryLinks.map((item) => {
      const locked = item.label === "Make Profile Preferred" && !isApproved();

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
    })}
  </div>
);

export default SecondaryNavBar;
