import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { TaskProgress } from '@/components/dashboard/TaskProgress';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LeaveBalance } from '@/components/dashboard/LeaveBalance';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Clock, CheckSquare, DollarSign, Calendar, TrendingUp } from 'lucide-react';

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

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`}
      subtitle={`Here's what's happening with your ${user?.role === 'employee' ? 'work' : 'team'} today`}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            suffix={kpi.suffix}
            change={kpi.change}
            changeType={kpi.changeType}
            icon={kpi.icon}
            color={kpi.color}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Charts and Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AttendanceChart />
        <TaskProgress />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <LeaveBalance />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
