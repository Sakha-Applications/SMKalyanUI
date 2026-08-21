import { Link } from "react-router-dom";

import { designClasses } from "../../../shared/styles/designTokens";

const secondaryLinks = [
  { to: "/renew-profile", label: "Recharge Profile" },
  { to: "/make-preferred", label: "Advertise Your Profile", requiresApproval: true },
  { to: "/donate", label: "Registration Fee" },
];

const isApproved = () => {
  const status = (
    sessionStorage.getItem("profileStatus") || ""
  )
    .toString()
    .trim()
    .toUpperCase();

  return status === "APPROVED";
};

const blockedMessage =
  "Your profile is under review. This feature will be available once your profile is approved.";

const SecondaryNavBar = () => (
  <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
    <span
      className={`mr-1 hidden text-xs font-semibold uppercase tracking-[0.12em] sm:inline ${designClasses.textSecondary}`}
    >
      Account
    </span>

    {secondaryLinks.map((item) => {
      const locked =
        item.requiresApproval && !isApproved();

      return (
        <Link
          key={item.to}
          to={locked ? "#" : item.to}
          onClick={(event) => {
            if (locked) {
              event.preventDefault();
              window.alert(blockedMessage);
            }
          }}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            locked
              ? "cursor-not-allowed border border-gray-200 text-gray-400 opacity-70"
              : `${designClasses.secondaryButton}`
          }`}
        >
          {item.label}
        </Link>
      );
    })}
  </div>
);

export default SecondaryNavBar;