import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  color: 'primary' | 'accent' | 'warning' | 'destructive';
  delay?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  suffix = '',
  prefix = '',
  change,
  changeType,
  icon: Icon,
  color,
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepValue = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.min(Math.round(stepValue * currentStep), value));
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 text-primary',
    accent: 'from-accent/20 to-accent/5 text-accent',
    warning: 'from-warning/20 to-warning/5 text-warning',
    destructive: 'from-destructive/20 to-destructive/5 text-destructive',
  };

  const iconBgClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card variant="glass" className="overflow-hidden">
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', colorClasses[color])} />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn('rounded-xl p-3', iconBgClasses[color])}>
              <Icon className="h-6 w-6" />
            </div>
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              changeType === 'increase' ? 'text-success' : 'text-destructive'
            )}>
              {changeType === 'increase' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-3xl font-bold tracking-tight">
              {prefix}
              <motion.span
                key={displayValue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {displayValue.toLocaleString()}
              </motion.span>
              {suffix}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
