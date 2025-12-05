import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const leaveTypes = [
  { type: 'Casual', used: 3, total: 12, color: 'primary' },
  { type: 'Sick', used: 2, total: 10, color: 'destructive' },
  { type: 'Earned', used: 5, total: 15, color: 'accent' },
  { type: 'Comp Off', used: 0, total: 5, color: 'warning' },
];

const colorVariants = {
  primary: 'stroke-primary',
  destructive: 'stroke-destructive',
  accent: 'stroke-accent',
  warning: 'stroke-warning',
};

const bgVariants = {
  primary: 'bg-primary/10',
  destructive: 'bg-destructive/10',
  accent: 'bg-accent/10',
  warning: 'bg-warning/10',
};

export const LeaveBalance: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Leave Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {leaveTypes.map((leave, index) => {
              const percentage = ((leave.total - leave.used) / leave.total) * 100;
              const circumference = 2 * Math.PI * 36;
              const strokeDashoffset = circumference - (percentage / 100) * circumference;

              return (
                <motion.div
                  key={leave.type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn(
                    'flex flex-col items-center p-4 rounded-xl',
                    bgVariants[leave.color as keyof typeof bgVariants]
                  )}
                >
                  <div className="relative">
                    <svg className="h-20 w-20 -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-muted/30"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className={colorVariants[leave.color as keyof typeof colorVariants]}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                          strokeDasharray: circumference,
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{leave.total - leave.used}</span>
                    </div>
                  </div>
                  <span className="mt-2 text-sm font-medium">{leave.type}</span>
                  <span className="text-xs text-muted-foreground">
                    {leave.used} used / {leave.total} total
                  </span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
