import { Link } from "react-router-dom";

import { designClasses } from "../styles/designTokens";

const normalizeStatus = (status) =>
  typeof status === "string"
    ? status.trim().toUpperCase()
    : "";

const getStatusLabel = (status) => {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "PAYMENT_SUBMITTED":
      return "Payment Submitted";

    case "APPROVED":
      return "Approved";

    default:
      return status || "Unknown";
  }
};

const ProfileStatusBanner = ({
  profileStatus,
  completion,
  completeProfilePath = "/my-profile",
  showAction = true,
}) => {
  const status = normalizeStatus(profileStatus);

  if (!completion || status === "APPROVED") {
    return null;
  }

  const {
    percentage = 0,
    pendingSections = [],
    isComplete = false,
  } = completion;

  const safePercentage = Math.min(
    Math.max(Number(percentage) || 0, 0),
    100
  );

  const readyForRegistrationFee =
  isComplete &&
  status === "DRAFT";

const awaitingApproval =
  isComplete &&
  status === "PAYMENT_SUBMITTED";

  const containerClass =
  readyForRegistrationFee ||
  awaitingApproval
    ? designClasses.statusReview
    : designClasses.statusWarning;

  return (
    <section
      className={`mb-4 rounded-2xl p-4 ${containerClass}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className={designClasses.statusTitle}>
            {awaitingApproval
              ? "Profile information: 100% complete"
              : `Your profile is ${safePercentage}% complete`}
          </h2>

          <p
            className={`mt-1 text-sm ${designClasses.statusText}`}
          >
            {awaitingApproval
              ? "Your profile information is complete and is awaiting approval. Restricted member features will become available after approval."
              : "Complete the remaining profile information and submit it for review."}
          </p>
        </div>

        {!awaitingApproval && (
          <div
            className={`shrink-0 text-sm font-semibold ${designClasses.textAccent}`}
          >
            {safePercentage}%
          </div>
        )}
      </div>

      {!awaitingApproval && (
        <>
          <div
            className={`mt-3 h-2 w-full overflow-hidden rounded-full ${designClasses.progressTrack}`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${designClasses.progressWarning}`}
              style={{
                width: `${safePercentage}%`,
              }}
            />
          </div>

          {pendingSections.length > 0 && (
            <div className="mt-3">
              <p
                className={`text-sm font-medium ${designClasses.textDark}`}
              >
                {pendingSections.length}{" "}
                {pendingSections.length === 1
                  ? "area needs"
                  : "areas need"}{" "}
                attention:
              </p>

              <div className="mt-2 space-y-2">
                {pendingSections.map(
                  (section) => (
                    <div
                      key={section.id}
                      className="text-sm"
                    >
                      <div
                        className={`font-semibold ${designClasses.textDark}`}
                      >
                        {section.title}
                      </div>

                      {section.missingFields?.length >
                        0 && (
                        <div
                          className={`mt-0.5 ${designClasses.statusText}`}
                        >
                          Missing:{" "}
                          {section.missingFields
                            .map(
                              (item) =>
                                item.label
                            )
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {showAction && (
            <div className="mt-4">
              <Link
                to={completeProfilePath}
                className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.primaryButton}`}
              >
                Complete Profile
              </Link>
            </div>
          )}
        </>
      )}

      <div
        className={`mt-3 border-t pt-3 text-xs ${designClasses.border} ${designClasses.statusText}`}
      >
        Profile status:{" "}
        <span
          className={`font-semibold ${designClasses.textDark}`}
        >
          {getStatusLabel(status)}
        </span>
      </div>
    </section>
  );
};

export default ProfileStatusBanner;