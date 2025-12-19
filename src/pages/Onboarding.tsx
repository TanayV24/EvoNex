// Onboarding.tsx - UPDATED WITH ADD MANAGER FORM IN TAB 3
// Location: src/pages/Onboarding.tsx
// CHANGES: Added Add Manager form in same tab as Add HR (Tab 3)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  Building2,
  Users,
  UserCheck,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { authRest } from '@/services/api';

// TYPE DEFINITIONS
interface CompanySetupData {
  companyname: string;
  companywebsite: string;
  companyindustry: string;
  timezone: string;
  currency: string;
  totalemployees: number;
  workinghoursstart: string;
  workinghoursend: string;
  casualleavedays: number;
  sickleavedays: number;
  personalleavedays: number;
}

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface HRForm {
  name: string;
  email: string;
}

interface ManagerForm {
  name: string;
  email: string;
}

// MAIN COMPONENT
const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserData, accessToken } = useAuth();

  // Only companyadmin should access this page
  React.useEffect(() => {
    if (user?.role !== 'company_admin') {
      window.location.href = '/dashboard';
    }
  }, [user?.role]);

  // STATE MANAGEMENT
  const [onboardingStep, setOnboardingStep] = useState<'password' | 'company' | 'complete'>('password');
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Password Change State
  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Company Setup State
  const [activeTab, setActiveTab] = useState<'info' | 'employee' | 'managers' | 'review'>('info');
  const [setupForm, setSetupForm] = useState<CompanySetupData>({
    companyname: '',
    companywebsite: '',
    companyindustry: 'IT Services',
    timezone: 'IST',
    currency: 'INR',
    totalemployees: 1,
    workinghoursstart: '09:00',
    workinghoursend: '18:00',
    casualleavedays: 12,
    sickleavedays: 6,
    personalleavedays: 2,
  });

  // HR Form state
  const [hrForm, setHrForm] = useState<HRForm>({
    name: '',
    email: '',
  });

  // Manager Form state (NEW)
  const [managerForm, setManagerForm] = useState<ManagerForm>({
    name: '',
    email: '',
  });

  // Track added users
  const [addedHR, setAddedHR] = useState<HRForm | null>(null);
  const [addedManager, setAddedManager] = useState<ManagerForm | null>(null);

  // Loading states
  const [addingHR, setAddingHR] = useState(false);
  const [addingManager, setAddingManager] = useState(false);
  const [completingSetup, setCompletingSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // EFFECT: Check what onboarding is needed
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Onboarding Check');
        console.log('- Temp password:', userData.temp_password);
        console.log('- Setup completed:', userData.company_setup_completed);

        if (userData.temp_password === true) {
          setOnboardingStep('password');
        } else if (userData.company_setup_completed === false) {
          setOnboardingStep('company');
        } else {
          setOnboardingStep('complete');
        }
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
    setIsCheckingStatus(false);
  }, []);

  // EFFECT: Auto-redirect if complete
  useEffect(() => {
    if (!isCheckingStatus && onboardingStep === 'complete') {
      console.log('All onboarding complete - redirecting to dashboard');
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 500);
    }
  }, [onboardingStep, isCheckingStatus, navigate]);

  // PASSWORD CHANGE HANDLERS
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authRest.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      toast({
        title: 'Success!',
        description: 'Your password has been changed successfully',
      });

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.temp_password = false;
        localStorage.setItem('user', JSON.stringify(userData));
        updateUserData({ temp_password: false });
      }

      console.log('Password changed - checking if setup needed');
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        const userData = JSON.parse(updatedUser);
        if (userData.company_setup_completed === false) {
          setOnboardingStep('company');
        } else {
          setOnboardingStep('complete');
        }
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

  // COMPANY SETUP HANDLERS
  const handleSetupInputChange = (
    field: keyof CompanySetupData,
    value: any
  ) => {
    setSetupForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // HR form handlers
  const handleHRInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHrForm({
      ...hrForm,
      [name]: value,
    });
  };

  // Manager form handlers (NEW)
  const handleManagerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManagerForm({
      ...managerForm,
      [name]: value,
    });
  };

  // Handle Add HR
  const handleAddHR = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hrForm.name || !hrForm.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setAddingHR(true);

    try {
      const response = await authRest.addHR(hrForm.name, hrForm.email);

      toast({
        title: 'Success!',
        description: `${hrForm.name} has been added as HR Manager`,
      });

      setAddedHR({ ...hrForm });
      setHrForm({ name: '', email: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add HR',
        variant: 'destructive',
      });
    } finally {
      setAddingHR(false);
    }
  };

  // Handle Add Manager (NEW)
  const handleAddManager = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!managerForm.name || !managerForm.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setAddingManager(true);

    try {
      const response = await authRest.addManager(managerForm.name, managerForm.email, 'manager');

      toast({
        title: 'Success!',
        description: `${managerForm.name} has been added as Manager`,
      });

      setAddedManager({ ...managerForm });
      setManagerForm({ name: '', email: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add Manager',
        variant: 'destructive',
      });
    } finally {
      setAddingManager(false);
    }
  };

  // Handle Company Setup
  const handleCompanySetup = async () => {
    if (!setupForm.companyname.trim()) {
      toast({
        title: 'Error',
        description: 'Company name is required',
        variant: 'destructive',
      });
      return;
    }

    setCompletingSetup(true);

    try {
      let websiteUrl = setupForm.companywebsite.trim();
      if (
        websiteUrl &&
        !websiteUrl.startsWith('http://') &&
        !websiteUrl.startsWith('https://')
      ) {
        websiteUrl = `https://${websiteUrl}`;
      }

      const payload = {
        company_name: setupForm.companyname,
        company_website: websiteUrl,
        company_industry: setupForm.companyindustry,
        timezone: setupForm.timezone,
        currency: setupForm.currency,
        total_employees: setupForm.totalemployees,
        working_hours_start: setupForm.workinghoursstart,
        working_hours_end: setupForm.workinghoursend,
        casual_leave_days: setupForm.casualleavedays,
        sick_leave_days: setupForm.sickleavedays,
        personal_leave_days: setupForm.personalleavedays,
      };

      console.log('Sending company setup:', payload);
      const response = await authRest.companySetup(payload);

      toast({
        title: 'Success!',
        description: 'Company setup completed! Redirecting to dashboard...',
      });

      updateUserData({ company_setup_completed: true });
      setOnboardingStep('complete');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save setup',
        variant: 'destructive',
      });
    } finally {
      setCompletingSetup(false);
    }
  };

  // LOADING STATE
  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-lg font-semibold">Setting up your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // STEP 1: PASSWORD CHANGE
  if (onboardingStep === 'password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Change Your Password</CardTitle>
                <p className="text-blue-100 text-sm mt-1">Step 1 of 2</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Temporary Password Detected</p>
                <p className="text-sm text-amber-800">
                  You must change your password before continuing
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentpassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentpassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newpassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newpassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  At least 8 characters recommended
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmpassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmpassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Changing Password...' : 'Change Password & Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // STEP 2: COMPANY SETUP
  if (onboardingStep === 'company') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Welcome to WorkOS</CardTitle>
                <p className="text-blue-100 text-sm mt-1">
                  Let's set up your company (Step 2 of 2)
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
            >
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="info" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Info</span>
                </TabsTrigger>
                <TabsTrigger value="employee" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Employee</span>
                </TabsTrigger>
                <TabsTrigger value="managers" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Managers</span>
                </TabsTrigger>
                <TabsTrigger value="review" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Review</span>
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Company Info */}
              <TabsContent value="info" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyname">Company Name</Label>
                  <Input
                    id="companyname"
                    placeholder="e.g., TechCorp India"
                    value={setupForm.companyname}
                    onChange={(e) =>
                      handleSetupInputChange('companyname', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companywebsite">Company Website</Label>
                  <Input
                    id="companywebsite"
                    placeholder="e.g., https://techcorp.com"
                    type="url"
                    value={setupForm.companywebsite}
                    onChange={(e) =>
                      handleSetupInputChange('companywebsite', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyindustry">Industry</Label>
                  <select
                    id="companyindustry"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={setupForm.companyindustry}
                    onChange={(e) =>
                      handleSetupInputChange('companyindustry', e.target.value)
                    }
                  >
                    <option>IT Services</option>
                    <option>Manufacturing</option>
                    <option>Retail</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Education</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={setupForm.timezone}
                      onChange={(e) =>
                        handleSetupInputChange('timezone', e.target.value)
                      }
                    >
                      <option value="IST">IST (India)</option>
                      <option value="UTC">UTC</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={setupForm.currency}
                      onChange={(e) =>
                        handleSetupInputChange('currency', e.target.value)
                      }
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={() => setActiveTab('employee')}
                  className="w-full"
                >
                  Next: Employee Info
                </Button>
              </TabsContent>

              {/* TAB 2: Employee Info */}
              <TabsContent value="employee" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="totalemployees">Total Employees</Label>
                  <Input
                    id="totalemployees"
                    type="number"
                    min="1"
                    value={setupForm.totalemployees}
                    onChange={(e) =>
                      handleSetupInputChange('totalemployees', parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Working Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="starttime">Start Time</Label>
                      <Input
                        id="starttime"
                        type="time"
                        value={setupForm.workinghoursstart}
                        onChange={(e) =>
                          handleSetupInputChange('workinghoursstart', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endtime">End Time</Label>
                      <Input
                        id="endtime"
                        type="time"
                        value={setupForm.workinghoursend}
                        onChange={(e) =>
                          handleSetupInputChange('workinghoursend', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Leave Structure</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Label className="flex-1">Casual Leave Days/Year</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={setupForm.casualleavedays}
                        onChange={(e) =>
                          handleSetupInputChange(
                            'casualleavedays',
                            parseInt(e.target.value)
                          )
                        }
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="flex-1">Sick Leave Days/Year</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={setupForm.sickleavedays}
                        onChange={(e) =>
                          handleSetupInputChange('sickleavedays', parseInt(e.target.value))
                        }
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="flex-1">Personal Leave Days/Year</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={setupForm.personalleavedays}
                        onChange={(e) =>
                          handleSetupInputChange(
                            'personalleavedays',
                            parseInt(e.target.value)
                          )
                        }
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('info')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setActiveTab('managers')}
                    className="flex-1"
                  >
                    Next: Add Managers
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 3: Managers (NEW - BOTH HR AND MANAGER) */}
              <TabsContent value="managers" className="space-y-6">
                <p className="text-sm text-gray-600">
                  Add HR and/or Manager (both are optional, can add later)
                </p>

                {/* HR FORM */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-4">
                  <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add HR Manager
                  </h4>

                  {addedHR ? (
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <p className="font-medium text-green-900">✓ {addedHR.name}</p>
                      <p className="text-sm text-green-700">{addedHR.email}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleAddHR} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="hrname" className="text-sm">
                            HR Name
                          </Label>
                          <Input
                            id="hrname"
                            type="text"
                            name="name"
                            placeholder="e.g. Priya Sharma"
                            value={hrForm.name}
                            onChange={handleHRInputChange}
                            disabled={addingHR}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hremail" className="text-sm">
                            HR Email
                          </Label>
                          <Input
                            id="hremail"
                            type="email"
                            name="email"
                            placeholder="e.g. priya@company.com"
                            value={hrForm.email}
                            onChange={handleHRInputChange}
                            disabled={addingHR}
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={addingHR || !hrForm.name || !hrForm.email}
                        className="w-full"
                        variant="default"
                      >
                        {addingHR && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {addingHR ? 'Adding HR...' : <><Plus className="mr-2 h-4 w-4" />Add HR</>}
                      </Button>
                    </form>
                  )}
                </div>

                {/* MANAGER FORM (NEW) */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 space-y-4">
                  <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Manager
                  </h4>

                  {addedManager ? (
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <p className="font-medium text-green-900">✓ {addedManager.name}</p>
                      <p className="text-sm text-green-700">{addedManager.email}</p>
                      <p className="text-xs text-green-600 mt-1">Role: Manager</p>
                    </div>
                  ) : (
                    <form onSubmit={handleAddManager} className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="managername" className="text-sm">
                          Manager Name
                        </Label>
                        <Input
                          id="managername"
                          type="text"
                          name="name"
                          placeholder="e.g. Rajesh Kumar"
                          value={managerForm.name}
                          onChange={handleManagerInputChange}
                          disabled={addingManager}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="manageremail" className="text-sm">
                          Manager Email
                        </Label>
                        <Input
                          id="manageremail"
                          type="email"
                          name="email"
                          placeholder="e.g. rajesh@company.com"
                          value={managerForm.email}
                          onChange={handleManagerInputChange}
                          disabled={addingManager}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={addingManager || !managerForm.name || !managerForm.email}
                        className="w-full"
                        variant="default"
                      >
                        {addingManager && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {addingManager ? 'Adding Manager...' : <><Plus className="mr-2 h-4 w-4" />Add Manager</>}
                      </Button>
                    </form>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('employee')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setActiveTab('review')}
                    className="flex-1"
                  >
                    Review Setup
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 4: Review */}
              <TabsContent value="review" className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-semibold">
                      {setupForm.companyname || 'Not provided'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Industry</p>
                      <p className="font-semibold">{setupForm.companyindustry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Currency</p>
                      <p className="font-semibold">{setupForm.currency}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Working Hours</p>
                    <p className="font-semibold">
                      {setupForm.workinghoursstart} - {setupForm.workinghoursend}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Leave Days/Year</p>
                    <p className="font-semibold">
                      Casual: {setupForm.casualleavedays} | Sick:{' '}
                      {setupForm.sickleavedays} | Personal: {setupForm.personalleavedays}
                    </p>
                  </div>

                  {(addedHR || addedManager) && (
                    <div>
                      <p className="text-sm text-gray-600">Team</p>
                      <ul className="font-semibold space-y-1">
                        {addedHR && (
                          <li className="text-blue-900">
                            ✓ {addedHR.name} (HR)
                          </li>
                        )}
                        {addedManager && (
                          <li className="text-purple-900">
                            ✓ {addedManager.name} (Manager)
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    After completing setup, you'll be redirected to your admin
                    dashboard
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('managers')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCompanySetup}
                    disabled={completingSetup}
                    className="flex-1"
                  >
                    {completingSetup && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {completingSetup ? 'Completing Setup...' : 'Complete Setup'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This shouldn't be reached, but just in case
  return null;
};

export default Onboarding;
