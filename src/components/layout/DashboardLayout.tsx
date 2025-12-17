import React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { useSidebarCollapse } from "@/contexts/SidebarContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isCollapsed } = useSidebarCollapse();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ===== SIDEBAR - FIXED POSITION ===== */}
      <motion.div
        animate={{ width: isCollapsed ? "90px" : "280px" }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
        }}
        className="flex-shrink-0 h-screen fixed left-0 top-0 z-50"
      >
        <Sidebar />
      </motion.div>

      {/* ===== MAIN CONTENT - SHIFTS WITH SIDEBAR ===== */}
      <motion.div
        animate={{ marginLeft: isCollapsed ? "90px" : "280px" }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
        }}
        className="flex-1 flex flex-col w-full h-screen overflow-hidden"
      >
        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;