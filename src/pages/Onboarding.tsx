import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Building2, Users, UserCheck, CheckCircle, Loader2, 
  Eye, EyeOff, Lock, AlertCircle, Plus, Trash2
} from 'lucide-react';
import { authRest, usersRest } from '@/services/api';



// ============================================
// TYPE DEFINITIONS
// ============================================



interface CompanySetupData {
  company_name: string;
  company_website: string;
  company_industry: string;
  timezone: string;
  currency: string;
  total_employees: number;
  working_hours_start: string;
  working_hours_end: string;
  casual_leave_days: number;
  sick_leave_days: number;
  personal_leave_days: number;
  managers: Array<{ name: string; email: string }>;
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



// ============================================
// MAIN COMPONENT
// ============================================



const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserData, accessToken } = useAuth();
  
  // Only company_admin should access this page
  React.useEffect(() => {
    if (user?.role !== 'company_admin') {
      window.location.href = '/dashboard';
    }
  }, [user]);



  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Determine what step user needs to complete
  const [onboardingStep, setOnboardingStep] = useState<'password' | 'company' | 'complete'>('complete');
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
    company_name: '',
    company_website: '',
    company_industry: 'IT Services',
    timezone: 'IST',
    currency: 'INR',
    total_employees: 1,
    working_hours_start: '09:00',
    working_hours_end: '18:00',
    casual_leave_days: 12,
    sick_leave_days: 6,
    personal_leave_days: 2,
    managers: [{ name: '', email: '' }],
  });
  
  // HR Form state for adding HR manager
  const [hrForm, setHrForm] = useState<HRForm>({
    name: '',
    email: '',
  });
  
  // Loading states
  const [addingManager, setAddingManager] = useState(false);
  const [completingSetup, setCompletingSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // ============================================
  // EFFECT: Check what onboarding is needed
  // ============================================
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        console.log('🔍 Onboarding Check:');
        console.log('  - Temp password:', userData.temp_password);
        console.log('  - Setup completed:', userData.company_setup_completed);
        
        // Determine which step to show
        if (userData.temp_password === true) {
          // First priority: Change password
          setOnboardingStep('password');
        } else if (userData.company_setup_completed === false) {
          // Second priority: Company setup
          setOnboardingStep('company');
        } else {
          // All done - redirect
          setOnboardingStep('complete');
        }
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
    
    setIsCheckingStatus(false);
  }, []);
  
  // ============================================
  // EFFECT: Auto-redirect if complete
  // ============================================
  
  useEffect(() => {
    if (!isCheckingStatus && onboardingStep === 'complete') {
      console.log('✓ All onboarding complete - redirecting to dashboard');
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 500);
    }
  }, [onboardingStep, isCheckingStatus, navigate]);
  
  // ============================================
  // PASSWORD CHANGE HANDLERS
  // ============================================
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
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
      
      // Update user in localStorage and AuthContext
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.temp_password = false;
        localStorage.setItem('user', JSON.stringify(userData));
        updateUserData({ temp_password: false });
      }
      
      // Move to next step or dashboard
      console.log('✓ Password changed - checking if setup needed');
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
  
  // ============================================
  // COMPANY SETUP HANDLERS
  // ============================================
  
  const handleSetupInputChange = (field: keyof CompanySetupData, value: any) => {
    setSetupForm(prev => ({ ...prev, [field]: value }));
  };
  
  const handleManagerChange = (index: number, field: 'name' | 'email', value: string) => {
    const newManagers = [...setupForm.managers];
    newManagers[index][field] = value;
    setSetupForm(prev => ({ ...prev, managers: newManagers }));
  };
  
  const addManager = () => {
    setSetupForm(prev => ({
      ...prev,
      managers: [...prev.managers, { name: '', email: '' }]
    }));
  };
  
  const removeManager = (index: number) => {
    setSetupForm(prev => ({
      ...prev,
      managers: prev.managers.filter((_, i) => i !== index)
    }));
  };
  
  // Handle HR form input
  const handleHRInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHrForm({
      ...hrForm,
      [name]: value,
    });
  };

  // Handle Add HR function with API call
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

    setAddingManager(true);

    try {
      const response = await authRest.addHR(hrForm.name, hrForm.email);
      
      toast({
        title: 'Success!',
        description: `${hrForm.name} has been added successfully`,
      });

      // Add to managers list locally
      setSetupForm(prev => ({
        ...prev,
        managers: [...prev.managers, { name: hrForm.name, email: hrForm.email }]
      }));

      // Reset form
      setHrForm({ name: '', email: '' });

    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add HR',
        variant: 'destructive',
      });
    } finally {
      setAddingManager(false);
    }
  };
  
  const handleCompanySetup = async () => {
    if (!setupForm.company_name.trim()) {
      toast({
        title: 'Error',
        description: 'Company name is required',
        variant: 'destructive',
      });
      return;
    }
    
    setCompletingSetup(true);
    try {
      // Fix URL format - add https:// if not present
      let websiteUrl = setupForm.company_website.trim();
      if (websiteUrl && !websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = `https://${websiteUrl}`;
      }

      // Create payload with fixed URL
      const payload = {
        company_name: setupForm.company_name,
        company_website: websiteUrl,
        company_industry: setupForm.company_industry,
        timezone: setupForm.timezone,
        currency: setupForm.currency,
        total_employees: setupForm.total_employees,
        working_hours_start: setupForm.working_hours_start,
        working_hours_end: setupForm.working_hours_end,
        casual_leave_days: setupForm.casual_leave_days,
        sick_leave_days: setupForm.sick_leave_days,
        personal_leave_days: setupForm.personal_leave_days,
      };

      console.log('📤 Sending company setup:', payload);

      const response = await authRest.companySetup(payload);
      
      toast({
        title: 'Success!',
        description: 'Company setup completed! Redirecting to dashboard...',
      });
      
      // Update user data
      updateUserData({ company_setup_completed: true });
      
      // Move to complete
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
  
  // ============================================
  // LOADING STATE
  // ============================================
  
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
  
  // ============================================
  // STEP 1: PASSWORD CHANGE
  // ============================================
  
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
            {/* Alert */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Temporary Password Detected</p>
                <p className="text-sm text-amber-800">You must change your password before continuing</p>
              </div>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* New Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">At least 8 characters recommended</p>
              </div>
              
              {/* Confirm Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password & Continue'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // ============================================
  // STEP 2: COMPANY SETUP
  // ============================================
  
  if (onboardingStep === 'company') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Welcome to WorkOS</CardTitle>
                <p className="text-blue-100 text-sm mt-1">Let's set up your company (Step 2 of 2)</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
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
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    placeholder="e.g., TechCorp India"
                    value={setupForm.company_name}
                    onChange={(e) => handleSetupInputChange('company_name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company_website">Company Website</Label>
                  <Input
                    id="company_website"
                    placeholder="e.g., https://techcorp.com"
                    type="url"
                    value={setupForm.company_website}
                    onChange={(e) => handleSetupInputChange('company_website', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company_industry">Industry</Label>
                  <select 
                    id="company_industry"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={setupForm.company_industry}
                    onChange={(e) => handleSetupInputChange('company_industry', e.target.value)}
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
                      onChange={(e) => handleSetupInputChange('timezone', e.target.value)}
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
                      onChange={(e) => handleSetupInputChange('currency', e.target.value)}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
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
                  <Label htmlFor="total_employees">Total Employees</Label>
                  <Input
                    id="total_employees"
                    type="number"
                    min="1"
                    value={setupForm.total_employees}
                    onChange={(e) => handleSetupInputChange('total_employees', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Working Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={setupForm.working_hours_start}
                        onChange={(e) => handleSetupInputChange('working_hours_start', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={setupForm.working_hours_end}
                        onChange={(e) => handleSetupInputChange('working_hours_end', e.target.value)}
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
                        value={setupForm.casual_leave_days}
                        onChange={(e) => handleSetupInputChange('casual_leave_days', parseInt(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="flex-1">Sick Leave Days/Year</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={setupForm.sick_leave_days}
                        onChange={(e) => handleSetupInputChange('sick_leave_days', parseInt(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="flex-1">Personal Leave Days/Year</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={setupForm.personal_leave_days}
                        onChange={(e) => handleSetupInputChange('personal_leave_days', parseInt(e.target.value))}
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
              
              {/* TAB 3: Managers */}
              <TabsContent value="managers" className="space-y-6">
                <p className="text-sm text-gray-600">Add HR manager names and emails (optional, can add later)</p>
                
                {/* HR Add Form with API Integration */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-4">
                  <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add HR Manager
                  </h4>

                  <form onSubmit={handleAddHR} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="hr_name" className="text-sm">HR Name</Label>
                        <Input
                          id="hr_name"
                          type="text"
                          name="name"
                          placeholder="e.g. Priya Sharma"
                          value={hrForm.name}
                          onChange={handleHRInputChange}
                          disabled={addingManager}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hr_email" className="text-sm">HR Email</Label>
                        <Input
                          id="hr_email"
                          type="email"
                          name="email"
                          placeholder="e.g. priya@pharmacy.com"
                          value={hrForm.email}
                          onChange={handleHRInputChange}
                          disabled={addingManager}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={addingManager || !hrForm.name || !hrForm.email}
                      className="w-full"
                      variant="default"
                    >
                      {addingManager ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding Manager...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Manager
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Existing Managers Section */}
                {setupForm.managers.filter(m => m.name).length > 0 && (
                  <div className="border rounded-lg p-5 space-y-4">
                    <h4 className="font-semibold">Added Managers ({setupForm.managers.filter(m => m.name).length})</h4>
                    <div className="space-y-2">
                      {setupForm.managers.map((manager, index) => (
                        manager.name && (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                            <div>
                              <p className="font-medium">{manager.name}</p>
                              <p className="text-sm text-gray-600">{manager.email}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeManager(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
                
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
                    <p className="font-semibold">{setupForm.company_name || 'Not provided'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Industry</p>
                      <p className="font-semibold">{setupForm.company_industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Currency</p>
                      <p className="font-semibold">{setupForm.currency}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Working Hours</p>
                    <p className="font-semibold">{setupForm.working_hours_start} - {setupForm.working_hours_end}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Leave Days/Year</p>
                    <p className="font-semibold">
                      Casual: {setupForm.casual_leave_days} | Sick: {setupForm.sick_leave_days} | Personal: {setupForm.personal_leave_days}
                    </p>
                  </div>
                  
                  {setupForm.managers.some(m => m.name) && (
                    <div>
                      <p className="text-sm text-gray-600">Managers</p>
                      <ul className="font-semibold space-y-1">
                        {setupForm.managers.map((m, i) => (
                          m.name && <li key={i}>• {m.name} ({m.email})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    ✓ After completing setup, you'll be redirected to your admin dashboard
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
                    {completingSetup ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing Setup...
                      </>
                    ) : (
                      'Complete Setup ✓'
                    )}
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