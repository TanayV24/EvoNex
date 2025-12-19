import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Briefcase,
  TrendingUp,
} from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with real API calls
  const stats = [
    {
      title: 'Team Members',
      value: '12',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    // {
    //   title: 'Active Tasks',
    //   value: '8',
    //   icon: Tasks,
    //   color: 'bg-green-100 text-green-600',
    // },
    {
      title: 'Projects',
      value: '3',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Performance',
      value: '92%',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || 'Manager'}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample team member */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Raj Kumar</p>
                    <p className="text-sm text-gray-500">Senior Developer</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>

                {/* More team members... */}
                <div className="text-center py-8 text-gray-500">
                  <p>View all team members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                View Tasks
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                Team Reports
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                Performance
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                Settings
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Team member completed task
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Project milestone reached
                  </p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New team member added
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;