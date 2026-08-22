import React from "react";

import SidebarMenu from "./SidebarMenu";
import MatchGrid from "./MatchGrid";

import {
  designClasses,
} from "../../../shared/styles/designTokens";

const DashboardLayout = ({
  children,
  profileId,
  profileStatus,
}) => {
  return (
    <div className="w-full">
      <SidebarMenu
        profileId={profileId}
        profileStatus={profileStatus}
      />

      <div className="overflow-x-hidden">
        {children}

        <section className="mt-6">
          <div className="mb-3">
            <h2
              className={`text-xl font-semibold ${designClasses.textPrimary}`}
            >
              Suggested Matches
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              Profiles selected based on your partner preferences.
            </p>
          </div>

          <MatchGrid
            profileId={profileId}
          />
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;