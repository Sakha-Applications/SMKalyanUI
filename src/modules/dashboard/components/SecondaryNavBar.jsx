import { Link } from "react-router-dom";

import {
  designClasses,
} from "../../../shared/styles/designTokens";

const secondaryLinks = [
  {
    to: "/renew-profile",
    label: "Recharge Profile",
    showForStatuses: ["APPROVED"],
  },
  {
    to: "/make-preferred",
    label: "Advertise Your Profile",
    showForStatuses: ["APPROVED"],
    requiresApproval: true,
  },
  {
    to: "/donate",
    label: "Registration Fee",
    showForStatuses: ["DRAFT"],
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
  const normalizedStatus =
    normalizeStatus(profileStatus);

  const approved =
    normalizedStatus === "APPROVED";

  const profileComplete =
    Boolean(
      profileCompletion?.isComplete
    );

  const visibleLinks =
    secondaryLinks.filter((item) => {
      if (
        !Array.isArray(
          item.showForStatuses
        ) ||
        item.showForStatuses.length === 0
      ) {
        return true;
      }

      return item.showForStatuses.includes(
        normalizedStatus
      );
    });

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
      <span
        className={`mr-1 hidden text-xs font-semibold uppercase tracking-[0.12em] sm:inline ${designClasses.textSecondary}`}
      >
        Member Services
      </span>

      {visibleLinks.map((item) => {
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
              if (!locked) {
                return;
              }

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