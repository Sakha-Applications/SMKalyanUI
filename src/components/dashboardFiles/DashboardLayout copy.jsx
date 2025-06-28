// src/components/dashboard/DashboardLayout.jsx

import React from 'react';
import { SidebarMenu, MatchGrid, MissionBox } from './index'; // Ensure MissionBox is imported
 
const DashboardLayout = ({ children, profileId }) => { // profileId is already received here
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <SidebarMenu profileId={profileId} /> {/* Already directly rendered */}
      </div>

      {/* Main Content */}
 {/* Place MissionBox here, typically at the top of the main content area */}
 
<div className="overflow-x-hidden"> {/* Add this */}
   <MissionBox />
        {/* Directly render MatchGrid here and pass profileId */}
        <h3 className="text-xl font-semibold text-indigo-800">Suggested Matches</h3> {/* Removed mb-4 */}
        <MatchGrid profileId={profileId} /> {/* <--- NEW: Direct render and prop pass */}

         <h3 className="text-xl font-semibold mt-2 mb-4 text-indigo-800">Invitations</h3> {/* Changed mt-8 to mt-2 to reduce top margin */}
        {/* If 'Invitations' also uses MatchGrid, render it here too */}
        <MatchGrid profileId={profileId} /> {/* <--- NEW: Direct render and prop pass */}

        {/* Remove {children} if MatchGrid is the ONLY dynamic content in this section.
           If other children from Dashboard.js should still render, you'd keep {children}
           but Dashboard.js would no longer pass MatchGrid as a child. */}
        {/* {children} */}
      </div>
    </div>
  );
};

export default DashboardLayout;