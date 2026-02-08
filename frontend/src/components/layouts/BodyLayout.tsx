import React from "react";
import type { ReactNode } from "react";
import Sidebar from "../elements/Sidebar";

type LayoutProps = {
  children: ReactNode;
};

const BodyLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex bg-loom-dark text-loom-text min-h-screen">
      <div className="w-full min-h-screen flex">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default BodyLayout;
