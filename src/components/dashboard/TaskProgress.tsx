import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const tasks = [
  { id: 1, name: 'Q4 Financial Report', progress: 85, status: 'on-track', priority: 'high' },
  { id: 2, name: 'Employee Onboarding', progress: 60, status: 'in-progress', priority: 'medium' },
  { id: 3, name: 'System Migration', progress: 30, status: 'delayed', priority: 'urgent' },
  { id: 4, name: 'Training Program', progress: 95, status: 'on-track', priority: 'low' },
];

const statusColors: Record<string, 'success' | 'info' | 'destructive'> = {
  'on-track': 'success',
  'in-progress': 'info',
  'delayed': 'destructive',
};

const priorityColors: Record<string, 'ghost' | 'secondary' | 'warning' | 'destructive'> = {
  low: 'ghost',
  medium: 'secondary',
  high: 'warning',
  urgent: 'destructive',
};

export const TaskProgress: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Task Progress</CardTitle>
          <Badge variant="outline">{tasks.length} Active</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{task.name}</span>
                  <Badge variant={priorityColors[task.priority]} className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{task.progress}%</span>
              </div>
              <div className="relative">
                <Progress value={task.progress} className="h-2" />
                <motion.div
                  className={cn(
                    'absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full',
                    task.status === 'on-track' && 'bg-success',
                    task.status === 'in-progress' && 'bg-info',
                    task.status === 'delayed' && 'bg-destructive'
                  )}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
