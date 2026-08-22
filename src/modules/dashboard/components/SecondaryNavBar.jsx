import { Link } from "react-router-dom";

import { designClasses } from "../../../shared/styles/designTokens";

const secondaryLinks = [
  {
    to: "/renew-profile",
    label: "Recharge Profile",
  },
  {
    to: "/make-preferred",
    label: "Advertise Your Profile",
    requiresApproval: true,
  },
  {
    to: "/donate",
    label: "Registration Fee",
    requiresCompleteProfile: true,
  },
];

const normalizeStatus = (status) =>
  typeof status === "string"
    ? status.trim().toUpperCase()
    : "";

const approvalBlockedMessage =
  "Your profile is under review. This feature will be available once your profile is approved.";

const completionBlockedMessage =
  "Please complete all required profile information before paying the Registration Fee.";

const SecondaryNavBar = ({
  profileStatus = "",
  profileCompletion = null,
}) => {
  const approved =
    normalizeStatus(
      profileStatus
    ) === "APPROVED";

  const profileComplete =
  Boolean(
    profileCompletion?.isComplete
  );
  return (
  <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
    <span
      className={`mr-1 hidden text-xs font-semibold uppercase tracking-[0.12em] sm:inline ${designClasses.textSecondary}`}
    >
      Member Services
    </span>

    {secondaryLinks.map((item) => {
      const locked =
  (
    item.requiresApproval &&
    !approved
  ) ||
  (
    item.requiresCompleteProfile &&
    !profileComplete
  );

      return (
        <Link
          key={item.to}
          to={locked ? "#" : item.to}
          onClick={(event) => {
            if (locked) {
  event.preventDefault();

  if (
    item.requiresCompleteProfile &&
    !profileComplete
  ) {
    window.alert(
      completionBlockedMessage
    );
    return;
  }

  window.alert(
    approvalBlockedMessage
  );
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