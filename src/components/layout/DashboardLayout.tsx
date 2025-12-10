// src/components/layout/DashboardLayout.tsx

import React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { useSidebarCollapse } from "@/contexts/sideBarContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isCollapsed } = useSidebarCollapse();

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content Area - Responsive to Sidebar State */}
      <motion.div
        className="flex-1 flex flex-col"
        animate={{
          marginLeft: isCollapsed ? "90px" : "280px",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        {/* Children (Header + Main Content) */}
        {children}
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
