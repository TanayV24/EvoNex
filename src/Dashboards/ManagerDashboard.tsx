// src/pages/Dashboard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { TaskProgress } from '@/components/dashboard/TaskProgress';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LeaveBalance } from '@/components/dashboard/LeaveBalance';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { Users, Clock, CheckSquare, DollarSign, Calendar, TrendingUp, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminKPIs = [
  { title: 'Total Employees', value: 248, change: 12, changeType: 'increase' as const, icon: Users, color: 'primary' as const },
  { title: 'Present Today', value: 215, change: 5, changeType: 'increase' as const, icon: Clock, color: 'accent' as const },
  { title: 'Pending Tasks', value: 47, change: 8, changeType: 'decrease' as const, icon: CheckSquare, color: 'warning' as const },
  { title: 'Payroll Processed', value: 98, suffix: '%', change: 2, changeType: 'increase' as const, icon: DollarSign, color: 'primary' as const },
];

const managerKPIs = [
  { title: 'Team Members', value: 24, change: 4, changeType: 'increase' as const, icon: Users, color: 'primary' as const },
  { title: 'Attendance Rate', value: 92, suffix: '%', change: 3, changeType: 'increase' as const, icon: Clock, color: 'accent' as const },
  { title: 'Active Tasks', value: 18, change: 2, changeType: 'decrease' as const, icon: CheckSquare, color: 'warning' as const },
  { title: 'Leave Requests', value: 5, change: 1, changeType: 'increase' as const, icon: Calendar, color: 'destructive' as const },
];

const employeeKPIs = [
  { title: 'Tasks Completed', value: 12, change: 20, changeType: 'increase' as const, icon: CheckSquare, color: 'accent' as const },
  { title: 'Hours This Week', value: 38, suffix: 'h', change: 5, changeType: 'increase' as const, icon: Clock, color: 'primary' as const },
  { title: 'Leave Balance', value: 15, suffix: ' days', change: 0, changeType: 'increase' as const, icon: Calendar, color: 'warning' as const },
  { title: 'Performance', value: 94, suffix: '%', change: 8, changeType: 'increase' as const, icon: TrendingUp, color: 'accent' as const },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebarCollapse();

  const getKPIs = () => {
    switch (user?.role) {
      case 'developer':
      case 'admin':
        return adminKPIs;
      case 'manager':
        return managerKPIs;
      case 'employee':
        return employeeKPIs;
      default:
        return adminKPIs;
    }
  };

  const kpis = getKPIs();
  const displayName = user?.full_name || user?.name || 'User';

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.header
        className={cn(
          "sticky top-0 z-20 border-b transition-colors duration-300",
          isDark
            ? "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900 border-blue-500/20"
            : "bg-gradient-to-r from-slate-50 via-white to-slate-100 border-blue-200/30"
        )}
        animate={{
          paddingRight: isCollapsed ? "0px" : "0px", // Always same
        }}
      >
        <div className="px-8 py-6 flex items-center justify-between">
          {/* Welcome Message */}
          <motion.div
            className="flex-1"
            animate={{
              opacity: 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <h1 className={cn(
              "text-3xl font-bold transition-colors duration-300",
              isDark ? "text-white" : "text-slate-900"
            )}>
              Welcome back, {displayName}
            </h1>
            <p className={cn(
              "text-sm mt-1 transition-colors duration-300",
              isDark ? "text-slate-400" : "text-slate-600"
            )}>
              Here's what's happening with your team today
            </p>
          </motion.div>

          {/* Header Actions */}
          <div className="flex items-center gap-6 ml-8">
            {/* Search */}
            <motion.div
              className={cn(
                "hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg border transition-colors duration-300",
                isDark
                  ? "bg-slate-800/50 border-blue-500/20"
                  : "bg-slate-200/50 border-blue-300/30"
              )}
            >
              <Search className={cn("w-5 h-5", isDark ? "text-slate-400" : "text-slate-600")} />
              <input
                type="text"
                placeholder="Search..."
                className={cn(
                  "bg-transparent outline-none text-sm w-48 transition-colors duration-300",
                  isDark
                    ? "text-slate-200 placeholder-slate-500"
                    : "text-slate-900 placeholder-slate-400"
                )}
              />
            </motion.div>

            {/* Notification Badge */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className={cn(
                "relative p-2 rounded-lg transition-colors duration-300",
                isDark
                  ? "hover:bg-slate-800/50"
                  : "hover:bg-slate-300/50"
              )}
            >
              <span className="text-2xl">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* User Initial */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer transition-transform"
              title={displayName}
            >
              {displayName?.charAt(0)?.toUpperCase() || 'U'}
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Dashboard Content */}
      <main className={cn(
        "flex-1 overflow-auto transition-colors duration-300",
        isDark ? "bg-slate-950" : "bg-slate-50"
      )}>
        <div className="p-8 space-y-8">
          {/* KPI Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={`kpi-${isCollapsed}`} // Re-render when sidebar state changes
          >
            {kpis.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <KPICard {...kpi} />
              </motion.div>
            ))}
          </motion.div>

          {/* Charts and Widgets - Responsive Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            key={`charts-${isCollapsed}`}
          >
            <AttendanceChart />
            <TaskProgress />
          </motion.div>

          {/* Recent Activity and Leave Balance */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            key={`activity-${isCollapsed}`}
          >
            <RecentActivity />
            <LeaveBalance />
          </motion.div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
