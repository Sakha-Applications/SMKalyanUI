import SidebarMenu from './SidebarMenu';

const DashboardLayout = ({ children }) => (
  <div className="flex flex-col lg:flex-row gap-6">
    <div className="w-full lg:w-1/4">
      <SidebarMenu />
    </div>
    <div className="w-full lg:w-3/4">{children}</div>
  </div>
);

export default DashboardLayout;
