import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import {
  Plus,
  CalendarDays,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { LeaveRequest } from '@/types/workos';

const leaveTypes = [
  { value: 'casual', label: 'Casual Leave', balance: 9, total: 12 },
  { value: 'sick', label: 'Sick Leave', balance: 8, total: 10 },
  { value: 'earned', label: 'Earned Leave', balance: 10, total: 15 },
  { value: 'unpaid', label: 'Unpaid Leave', balance: Infinity, total: Infinity },
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'emp-001',
    employeeName: 'Emma Employee',
    type: 'casual',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    days: 3,
    reason: 'Family function',
    status: 'pending',
    appliedOn: '2024-01-08',
  },
  {
    id: '2',
    employeeId: 'emp-002',
    employeeName: 'John Developer',
    type: 'sick',
    startDate: '2024-01-10',
    endDate: '2024-01-11',
    days: 2,
    reason: 'Fever and cold',
    status: 'approved',
    appliedOn: '2024-01-09',
    approvedBy: 'Manager',
  },
  {
    id: '3',
    employeeId: 'emp-003',
    employeeName: 'Sarah Designer',
    type: 'earned',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    days: 5,
    reason: 'Vacation',
    status: 'rejected',
    appliedOn: '2024-01-05',
  },
];

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
} as const;

const Leave: React.FC = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [newLeave, setNewLeave] = useState({
    type: 'casual',
    reason: '',
  });

  const isManager = user?.role === 'manager' || user?.role === 'admin' || user?.role === 'developer';

  const handleApplyLeave = () => {
    if (!dateRange?.from || !newLeave.reason) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const days = dateRange.to
      ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 1;

    const request: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: user?.id || 'emp-001',
      employeeName: user?.name || 'Employee',
      type: newLeave.type as LeaveRequest['type'],
      startDate: format(dateRange.from, 'yyyy-MM-dd'),
      endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(dateRange.from, 'yyyy-MM-dd'),
      days,
      reason: newLeave.reason,
      status: 'pending',
      appliedOn: format(new Date(), 'yyyy-MM-dd'),
    };

    setLeaveRequests([request, ...leaveRequests]);
    setIsApplyModalOpen(false);
    setDateRange(undefined);
    setNewLeave({ type: 'casual', reason: '' });
    toast({
      title: 'Leave Applied',
      description: `Your leave request for ${days} day(s) has been submitted`,
    });
  };

  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(leaveRequests.map((req) =>
      req.id === id ? { ...req, status, approvedBy: user?.name } : req
    ));
    toast({
      title: `Leave ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      description: `The leave request has been ${status}`,
    });
  };

  return (
    <DashboardLayout title="Leave Management" subtitle="Apply and manage leaves">
      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {leaveTypes.slice(0, 4).map((leave, index) => (
          <motion.div
            key={leave.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">{leave.label}</span>
                </div>
                <div className="relative">
                  {/* Ring Progress */}
                  <svg className="w-20 h-20 mx-auto -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-muted/30"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="text-primary"
                      initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                      animate={{
                        strokeDashoffset:
                          leave.total === Infinity
                            ? 0
                            : 2 * Math.PI * 34 * (1 - leave.balance / leave.total),
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{
                        strokeDasharray: 2 * Math.PI * 34,
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-bold">
                        {leave.total === Infinity ? '∞' : leave.balance}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {leave.total === Infinity ? 'Unlimited' : `of ${leave.total}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">
          {isManager ? 'Leave Requests' : 'My Leave History'}
        </h2>
        <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4 mr-2" />
              Apply Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Leave Type</Label>
                <Select
                  value={newLeave.type}
                  onValueChange={(value) => setNewLeave({ ...newLeave, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} ({type.total === Infinity ? 'Unlimited' : `${type.balance} left`})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Select Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span className="text-muted-foreground">Pick dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Reason *</Label>
                <Textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="Enter reason for leave"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleApplyLeave}>
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave Requests List */}
      <Card variant="glass">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            <AnimatePresence>
              {leaveRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {isManager && (
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.employeeName}`}
                            alt={request.employeeName}
                          />
                          <AvatarFallback>{request.employeeName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          {isManager && <span className="font-medium">{request.employeeName}</span>}
                          <Badge variant="outline" className="text-xs capitalize">
                            {request.type}
                          </Badge>
                          <Badge variant={statusColors[request.status]} className="text-xs">
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(request.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          {request.startDate !== request.endDate && (
                            <>
                              {' - '}
                              {new Date(request.endDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </>
                          )}
                          <span className="mx-2">•</span>
                          {request.days} day{request.days > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <FileText className="h-3 w-3 inline mr-1" />
                          {request.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isManager && request.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-success hover:bg-success/10"
                            onClick={() => handleApproval(request.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleApproval(request.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {request.status !== 'pending' && request.approvedBy && (
                        <span className="text-xs text-muted-foreground">
                          by {request.approvedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Leave;
