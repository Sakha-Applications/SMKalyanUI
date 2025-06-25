import React from 'react';
import { SidebarMenu } from './index'; // Adjust import path as needed

const DashboardLayout = ({ children, profileId }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <SidebarMenu profileId={profileId} />
      </div>
      
      {/* Main Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;