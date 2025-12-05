import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: 1,
    user: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    action: 'submitted leave request',
    target: '3 days vacation',
    time: '5 minutes ago',
    type: 'leave',
    status: 'pending',
  },
  {
    id: 2,
    user: { name: 'Sarah Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    action: 'completed task',
    target: 'Q4 Report Review',
    time: '1 hour ago',
    type: 'task',
    status: 'completed',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    action: 'punched in',
    target: 'at Office HQ',
    time: '2 hours ago',
    type: 'attendance',
    status: 'success',
  },
  {
    id: 4,
    user: { name: 'Emily Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    action: 'requested advance',
    target: '₹50,000',
    time: '3 hours ago',
    type: 'payroll',
    status: 'pending',
  },
];

const statusIcons = {
  pending: AlertCircle,
  completed: CheckCircle,
  success: CheckCircle,
  failed: XCircle,
};

const statusColors = {
  pending: 'text-warning',
  completed: 'text-success',
  success: 'text-success',
  failed: 'text-destructive',
};

export const RecentActivity: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const StatusIcon = statusIcons[activity.status];
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <StatusIcon className={cn('h-5 w-5', statusColors[activity.status])} />
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
