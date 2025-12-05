import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  CalendarDays,
} from 'lucide-react';

const attendanceData = [
  { date: '2024-01-08', punchIn: '09:02 AM', punchOut: '06:15 PM', status: 'present', hours: 9.2 },
  { date: '2024-01-07', punchIn: '09:30 AM', punchOut: '06:00 PM', status: 'late', hours: 8.5 },
  { date: '2024-01-06', punchIn: null, punchOut: null, status: 'weekend', hours: 0 },
  { date: '2024-01-05', punchIn: '08:55 AM', punchOut: '06:30 PM', status: 'present', hours: 9.6 },
  { date: '2024-01-04', punchIn: '09:00 AM', punchOut: '01:00 PM', status: 'half-day', hours: 4 },
  { date: '2024-01-03', punchIn: null, punchOut: null, status: 'absent', hours: 0 },
  { date: '2024-01-02', punchIn: '08:50 AM', punchOut: '06:45 PM', status: 'present', hours: 9.9 },
];

const statusColors = {
  present: 'success',
  late: 'warning',
  absent: 'destructive',
  'half-day': 'info',
  weekend: 'ghost',
  holiday: 'ghost',
} as const;

const statusIcons = {
  present: CheckCircle,
  late: AlertCircle,
  absent: XCircle,
  'half-day': Clock,
  weekend: CalendarDays,
  holiday: CalendarDays,
};

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunch = () => {
    if (isPunchedIn) {
      toast({
        title: 'Punched Out',
        description: `You have clocked out at ${currentTime.toLocaleTimeString()}`,
      });
      setIsPunchedIn(false);
      setPunchInTime(null);
    } else {
      toast({
        title: 'Punched In',
        description: `You have clocked in at ${currentTime.toLocaleTimeString()}`,
      });
      setIsPunchedIn(true);
      setPunchInTime(currentTime);
    }
  };

  const calculateWorkHours = () => {
    if (!punchInTime) return '0h 0m';
    const diff = currentTime.getTime() - punchInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const weeklyStats = {
    totalHours: attendanceData.reduce((acc, d) => acc + d.hours, 0),
    presentDays: attendanceData.filter((d) => d.status === 'present' || d.status === 'late').length,
    lateDays: attendanceData.filter((d) => d.status === 'late').length,
    absentDays: attendanceData.filter((d) => d.status === 'absent').length,
  };

  return (
    <DashboardLayout title="Attendance" subtitle="Track your work hours">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Punch In/Out Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card variant="glass" className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Time Display */}
                <div className="text-center md:text-left">
                  <motion.p
                    key={currentTime.toLocaleTimeString()}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold tracking-tight"
                  >
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </motion.p>
                  <p className="text-muted-foreground mt-2">
                    {currentTime.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {isPunchedIn && punchInTime && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 flex items-center gap-2 text-sm"
                    >
                      <Clock className="h-4 w-4 text-accent" />
                      <span>Working for: <strong>{calculateWorkHours()}</strong></span>
                    </motion.div>
                  )}
                </div>

                {/* Punch Button */}
                <div className="flex flex-col items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePunch}
                    className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isPunchedIn
                        ? 'bg-destructive/20 border-2 border-destructive shadow-[0_0_40px_hsl(var(--destructive)/0.3)]'
                        : 'bg-accent/20 border-2 border-accent shadow-[0_0_40px_hsl(var(--accent)/0.3)]'
                    }`}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: isPunchedIn ? [1, 1.1, 1] : 1 }}
                        transition={{ repeat: isPunchedIn ? Infinity : 0, duration: 2 }}
                      >
                        <Clock className={`h-12 w-12 mx-auto mb-2 ${isPunchedIn ? 'text-destructive' : 'text-accent'}`} />
                      </motion.div>
                      <span className="font-semibold text-lg">
                        {isPunchedIn ? 'Punch Out' : 'Punch In'}
                      </span>
                    </div>
                    {/* Pulse Ring */}
                    {!isPunchedIn && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-accent"
                        animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                  </motion.button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Office HQ - Main Building</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                <span className="text-sm">Total Hours</span>
                <span className="font-bold text-accent">{weeklyStats.totalHours.toFixed(1)}h</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                <span className="text-sm">Present Days</span>
                <span className="font-bold text-success">{weeklyStats.presentDays}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                <span className="text-sm">Late Days</span>
                <span className="font-bold text-warning">{weeklyStats.lateDays}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                <span className="text-sm">Absent Days</span>
                <span className="font-bold text-destructive">{weeklyStats.absentDays}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Attendance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Attendance History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <div className="space-y-3">
                  {attendanceData.map((record, index) => {
                    const StatusIcon = statusIcons[record.status as keyof typeof statusIcons];
                    return (
                      <motion.div
                        key={record.date}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            record.status === 'present' || record.status === 'late' ? 'bg-accent/10' : 'bg-muted'
                          }`}>
                            <StatusIcon className={`h-5 w-5 ${
                              record.status === 'present' ? 'text-success' :
                              record.status === 'late' ? 'text-warning' :
                              record.status === 'absent' ? 'text-destructive' :
                              'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">
                              {new Date(record.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {record.punchIn ? `${record.punchIn} - ${record.punchOut}` : 'No attendance'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {record.hours > 0 && (
                            <span className="text-sm font-medium">{record.hours}h</span>
                          )}
                          <Badge variant={statusColors[record.status as keyof typeof statusColors]}>
                            {record.status}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>
              <TabsContent value="calendar" className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Attendance;
