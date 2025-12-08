import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Clock,
  CheckSquare,
  DollarSign,
  Building2,
  TrendingUp,
  AlertTriangle,
  FileText,
  Settings,
  Shield,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const adminKPIs = [
  { title: 'Total Employees', value: 248, change: 12, changeType: 'increase' as const, icon: Users, color: 'primary' as const },
  { title: 'Active Companies', value: 15, change: 3, changeType: 'increase' as const, icon: Building2, color: 'accent' as const },
  { title: 'Pending Approvals', value: 23, change: 5, changeType: 'decrease' as const, icon: AlertTriangle, color: 'warning' as const },
  { title: 'Monthly Revenue', value: 125000, prefix: '₹', change: 18, changeType: 'increase' as const, icon: DollarSign, color: 'primary' as const },
];

const systemHealth = [
  { name: 'API Uptime', value: 99.9, status: 'healthy' },
  { name: 'Database Performance', value: 94.2, status: 'healthy' },
  { name: 'Storage Used', value: 67.5, status: 'warning' },
  { name: 'Active Sessions', value: 156, status: 'healthy' },
];

const recentCompanies = [
  { name: 'TechCorp Solutions', employees: 45, status: 'active', joinedDate: '2024-01-08' },
  { name: 'Design Studio Pro', employees: 12, status: 'active', joinedDate: '2024-01-05' },
  { name: 'StartupX Labs', employees: 28, status: 'pending', joinedDate: '2024-01-03' },
  { name: 'Finance Partners', employees: 67, status: 'active', joinedDate: '2023-12-28' },
];

const complianceMetrics = [
  { name: 'PF Compliance', percentage: 98, color: 'bg-emerald-500' },
  { name: 'ESI Compliance', percentage: 95, color: 'bg-blue-500' },
  { name: 'TDS Filed', percentage: 100, color: 'bg-purple-500' },
  { name: 'Payroll Accuracy', percentage: 99.5, color: 'bg-amber-500' },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title={`Admin Console`}
      subtitle="System overview and management dashboard"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminKPIs.map((kpi, index) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            prefix={kpi.prefix}
            change={kpi.change}
            changeType={kpi.changeType}
            icon={kpi.icon}
            color={kpi.color}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* System Health & Recent Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* System Health Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Health
              </CardTitle>
              <Badge variant="success">All Systems Operational</Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {systemHealth.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        item.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {typeof item.value === 'number' && item.value < 100 ? `${item.value}%` : item.value}
                      </span>
                      {item.status === 'healthy' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Companies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Recent Companies
              </CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {recentCompanies.map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.employees} employees</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={company.status === 'active' ? 'success' : 'warning'}>
                        {company.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Compliance Metrics & Attendance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Compliance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Compliance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {complianceMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <span className="text-sm font-semibold">{metric.percentage}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${metric.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.percentage}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AttendanceChart />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Building2 className="h-5 w-5" />
                <span className="text-xs">Add Company</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-xs">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Generate Reports</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <PieChart className="h-5 w-5" />
                <span className="text-xs">View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
