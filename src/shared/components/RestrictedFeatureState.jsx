import { Link } from "react-router-dom";

import { designClasses } from "../styles/designTokens";
import ProfileStatusBanner from "./ProfileStatusBanner";

const RestrictedFeatureState = ({
  featureName = "This feature",
  profileStatus = "",
  completion = null,
  message,
  backPath = "/dashboard",
}) => {
  const defaultMessage =
    `${featureName} will become available after your profile is approved.`;

  return (
    <div className={designClasses.card}>
      <div className="p-5 sm:p-6">
        <h1 className={designClasses.statusTitle}>
          {featureName} is not available yet
        </h1>

        <p
          className={`mt-2 text-sm ${designClasses.statusText}`}
        >
          {message || defaultMessage}
        </p>

        {completion && (
          <div className="mt-4">
            <ProfileStatusBanner
  profileStatus={profileStatus}
  completion={completion}
  showAction={false}
/>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/my-profile"
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.primaryButton}`}
          >
            Complete Profile
          </Link>

          <Link
            to={backPath}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition ${designClasses.secondaryButton}`}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestrictedFeatureState;