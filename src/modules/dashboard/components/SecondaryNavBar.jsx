import { Link } from "react-router-dom";

import { designClasses } from "../../../shared/styles/designTokens";

const secondaryLinks = [
  { to: "/renew-profile", label: "Recharge Profile" },
  { to: "/make-preferred", label: "Advertise Your Profile", requiresApproval: true },
  { to: "/donate", label: "Registration Fee" },
];

const normalizeStatus = (status) =>
  typeof status === "string"
    ? status.trim().toUpperCase()
    : "";

const blockedMessage =
  "Your profile is under review. This feature will be available once your profile is approved.";

const SecondaryNavBar = ({
  profileStatus = "",
}) => {
  const approved =
    normalizeStatus(
      profileStatus
    ) === "APPROVED";

  return (
  <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
    <span
      className={`mr-1 hidden text-xs font-semibold uppercase tracking-[0.12em] sm:inline ${designClasses.textSecondary}`}
    >
      Member Services
    </span>

    {secondaryLinks.map((item) => {
      const locked =
        item.requiresApproval &&
        !approved;

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
              ? `${designClasses.secondaryButton} cursor-not-allowed opacity-40`
              : designClasses.secondaryButton
          }`}
        >
          {item.label}
        </Link>
      );
    })}
  </div>
  );
};

export default SecondaryNavBar;