import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="auth-layout">
    <main>{children}</main>
  </div>
);

export default AuthLayout;
