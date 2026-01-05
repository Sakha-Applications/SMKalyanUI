// src/components/dashboard/DashboardLayout.jsx

import React from 'react';
import { SidebarMenu, MatchGrid } from './index';
 
const DashboardLayout = ({ children, profileId }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <SidebarMenu profileId={profileId} />
      </div>


      {/* Main Content */}
<div className="overflow-x-hidden">
  {children}
  
  
  <h3 className="text-xl font-semibold text-indigo-800 mb-2">Suggested Matches</h3>
  <MatchGrid profileId={profileId} />

  
</div>
    </div>
  );
};

export default DashboardLayout;