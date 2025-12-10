// src/pages/Settings.tsx - FULLY WIRED WITH BACKEND
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  Camera,
  Save,
  Loader2,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface ProfileSettings {
  // Personal
  full_name: string;
  email: string;
  phone: string;
  avatar?: string;

  // Company info
  company_name: string;
  company_website: string;
  company_industry: string;
  total_employees: number;

  // Work settings
  timezone: string;
  currency: string;
  working_hours_start: string;
  working_hours_end: string;

  // Leave structure
  casual_leave_days: number;
  sick_leave_days: number;
  personal_leave_days: number;
}


interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  leave_approvals: boolean;
  task_assignments: boolean;
  payroll_updates: boolean;
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface Session {
  id: string;
  browser: string;
  device: string;
  location: string;
  ip_address: string;
  last_active: string;
  is_current: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

const Settings: React.FC = () => {
  const { user, accessToken, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // ============================================
  // PROFILE TAB STATE
  // ============================================

const [profileData, setProfileData] = useState<ProfileSettings>({
  full_name: user?.full_name || user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  avatar: user?.avatar || '',

  company_name: '',
  company_website: '',
  company_industry: '',
  total_employees: 0,

  timezone: 'IST',
  currency: 'INR',
  working_hours_start: '09:00',
  working_hours_end: '18:00',

  casual_leave_days: 12,
  sick_leave_days: 6,
  personal_leave_days: 2,
});


  // ============================================
  // NOTIFICATIONS TAB STATE
  // ============================================

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    leave_approvals: true,
    task_assignments: true,
    payroll_updates: true,
  });

  // ============================================
  // SECURITY TAB STATE
  // ============================================

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      browser: 'Chrome',
      device: 'Windows',
      location: 'New York, US',
      ip_address: '192.168.1.1',
      last_active: 'Just now',
      is_current: true,
    },
  ]);

  // ============================================
  // APPEARANCE TAB STATE
  // ============================================

  const [themeChoice, setThemeChoice] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('IST');

  // ============================================
  // LOAD DATA ON MOUNT
  // ============================================

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        avatar: user.avatar || '',
      });
    }
    loadProfile();
    loadSettings();
  }, [user]);

  // ============================================
  // API CALLS
  // ============================================

  const loadProfile = async () => {
  if (!accessToken) return;
  try {
    const res = await fetch('http://localhost:8000/api/admin/profile/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (res.ok) {
      const json = await res.json();
      setProfileData(prev => ({
        ...prev,
        ...json.data,
      }));
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
};


  const loadSettings = async () => {
    if (!accessToken) return;

    try {
      setIsLoading(true);
      // Load notification settings
      const notifResponse = await fetch('http://localhost:8000/api/admin/notifications/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (notifResponse.ok) {
        const notifData = await notifResponse.json();
        setNotifications(notifData.data || notifications);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // PROFILE UPDATE
  // ============================================

  const handleProfileSave = async () => {
    if (!profileData.full_name.trim()) {
      toast({
        title: 'Error',
        description: 'Full name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          full_name: profileData.full_name,
          phone: profileData.phone,
          
          company_name: profileData.company_name,
          company_website: profileData.company_website,
          company_industry: profileData.company_industry,
          total_employees: profileData.total_employees,
          
          timezone: profileData.timezone,
          currency: profileData.currency,
          working_hours_start: profileData.working_hours_start,
          working_hours_end: profileData.working_hours_end,
          
          casual_leave_days: profileData.casual_leave_days,
          sick_leave_days: profileData.sick_leave_days,
          personal_leave_days: profileData.personal_leave_days,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateUserData({
          full_name: profileData.full_name,
          phone: profileData.phone,
          department: profileData.department,
        });
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // AVATAR UPLOAD
  // ============================================

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:8000/api/admin/avatar/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData((prev) => ({ ...prev, avatar: data.data.avatar_url }));
        updateUserData({ avatar: data.data.avatar_url });
        toast({
          title: 'Success',
          description: 'Avatar updated successfully',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to upload avatar',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // NOTIFICATIONS UPDATE
  // ============================================

  const handleNotificationToggle = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);

    try {
      const response = await fetch('http://localhost:8000/api/admin/notifications/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedNotifications),
      });

      if (!response.ok) {
        const error = await response.json();
        setNotifications(notifications); // Revert on error
        toast({
          title: 'Error',
          description: error.error || 'Failed to update notification settings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setNotifications(notifications); // Revert on error
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update settings',
        variant: 'destructive',
      });
    }
  };

  // ============================================
  // PASSWORD CHANGE
  // ============================================

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/change_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          old_password: passwordData.current_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Password changed successfully',
        });
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to change password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // LOGOUT SESSION
  // ============================================

  const handleLogoutSession = async (sessionId: string) => {
    if (sessionId === 'current') {
      toast({
        title: 'Cannot logout current session',
        description: 'Use the main Logout button to log out',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/admin/sessions/${sessionId}/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setSessions(sessions.filter((s) => s.id !== sessionId));
        toast({
          title: 'Success',
          description: 'Session logged out',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to logout session',
        variant: 'destructive',
      });
    }
  };

  // ============================================
  // APPEARANCE UPDATE
  // ============================================

  const handleAppearanceSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/appearance/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          theme: themeChoice,
          language,
          timezone,
        }),
      });

      if (response.ok) {
        // Apply theme locally
        if (themeChoice === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (themeChoice === 'light') {
          document.documentElement.classList.remove('dark');
        }
        toast({
          title: 'Success',
          description: 'Appearance settings updated',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update appearance',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PROFILE */}
          <TabsContent value="profile" className="space-y-4 mt-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div>
                    <Label className="mb-4 block">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profileData.avatar} alt={profileData.full_name} />
                        <AvatarFallback>
                          {profileData.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={isLoading}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          disabled={isLoading}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {isLoading ? 'Uploading...' : 'Change Picture'}
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">Max 5MB. JPG, PNG or GIF</p>
                      </div>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      placeholder="e.g., John Doe"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="e.g., +1 234 567 890"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Engineering"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  

                  {/* Save Button */}
                  <Button
                    onClick={handleProfileSave}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* TAB 2: NOTIFICATIONS */}
          <TabsContent value="notifications" className="space-y-4 mt-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.email_notifications}
                      onCheckedChange={(value) =>
                        handleNotificationToggle('email_notifications', value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive browser notifications</p>
                    </div>
                    <Switch
                      checked={notifications.push_notifications}
                      onCheckedChange={(value) =>
                        handleNotificationToggle('push_notifications', value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.sms_notifications}
                      onCheckedChange={(value) =>
                        handleNotificationToggle('sms_notifications', value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Types</CardTitle>
                  <CardDescription>Select which notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Leave Approvals */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Leave Approvals</p>
                      <p className="text-sm text-gray-600">Get notified about leave status</p>
                    </div>
                    <Switch
                      checked={notifications.leave_approvals}
                      onCheckedChange={(value) =>
                        handleNotificationToggle('leave_approvals', value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  {/* Task Assignments */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Task Assignments</p>
                      <p className="text-sm text-gray-600">Get notified when tasks are assigned</p>
                    </div>
                    <Switch
                      checked={notifications.task_assignments}
                      onCheckedChange={(value) =>
                        handleNotificationToggle('task_assignments', value)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  {/* Payroll Updates */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Payroll Updates</p>
                      <p className="text-sm text-gray-600">Get notified about salary processing</p>
                    </div>
                    <Switch
                      checked={notifications.payroll_updates}
                      onCheckedChange={(value) =>
                        handleNotificationToggle('payroll_updates', value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* TAB 3: SECURITY */}
          <TabsContent value="security" className="space-y-4 mt-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder="Enter your current password"
                          value={passwordData.current_password}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, current_password: e.target.value })
                          }
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          value={passwordData.new_password}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, new_password: e.target.value })
                          }
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">At least 8 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                          value={passwordData.confirm_password}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirm_password: e.target.value })
                          }
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-gray-600">Secure your account with 2FA</p>
                    </div>
                    <Switch disabled />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">2FA setup coming soon</p>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Manage your active sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {session.browser} on {session.device}
                          {session.is_current && (
                            <span className="text-xs ml-2 bg-green-100 text-green-700 px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">{session.location}</p>
                        <p className="text-xs text-gray-500">Last active: {session.last_active}</p>
                      </div>
                      {!session.is_current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLogoutSession(session.id)}
                          disabled={isLoading}
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Logout
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* TAB 4: APPEARANCE */}
          <TabsContent value="appearance" className="space-y-4 mt-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>Customize the appearance of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Color Scheme */}
                  <div className="space-y-2">
                    <Label htmlFor="color-scheme">Color Scheme</Label>
                    <Select value={themeChoice} onValueChange={(value: any) => setThemeChoice(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timezone */}
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IST">India Standard Time (UTC+5:30)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="PST">Pacific Time (UTC-8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Save Button */}
                  <Button onClick={handleAppearanceSave} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;