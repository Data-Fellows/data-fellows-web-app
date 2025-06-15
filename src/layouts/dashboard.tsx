import React, { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => (
  <div className="dashboard-layout">
    <main>{children}</main>
  </div>
);

export default DashboardLayout;
