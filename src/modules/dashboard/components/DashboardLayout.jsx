import React from "react";

import SidebarMenu from "./SidebarMenu";
import MatchGrid from "./MatchGrid";

const DashboardLayout = ({ children, profileId }) => {
  return (
    <div className="w-full">
      <SidebarMenu profileId={profileId} />

      <div className="overflow-x-hidden">
        {children}

        <h3 className="mb-3 mt-5 text-xl font-semibold text-[#00264D]">
          Suggested Matches
        </h3>

        <MatchGrid profileId={profileId} />
      </div>
    </div>
  );
};

export default DashboardLayout;