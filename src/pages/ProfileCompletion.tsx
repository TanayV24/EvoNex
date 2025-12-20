import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ProfileFormData {
  full_name: string;
  phone: string;
  designation: string;
  department: string;
  gender?: string;
  date_of_birth?: string;
  marital_status?: string;
  bio?: string;
}

const ProfileCompletion: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isHRRole, setIsHRRole] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: user?.full_name || '',
    phone: '',
    designation: '',
    department: 'Loading...',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    bio: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // ✅ Safe role check
    const userRole = user?.role?.toLowerCase() || '';
    if (userRole === 'hr' || userRole === 'manager' || userRole === 'company_admin') {
      setIsHRRole(true);
    }

    // Redirect company_admin to onboarding
    if (userRole === 'company_admin') {
      navigate('/onboarding', { replace: true });
      return;
    }

    // If profile already completed, go to dashboard
    if (user?.profile_completed === true && user?.temp_password === false) {
      console.log('✓ Profile already completed, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // ✅ Fetch fresh user details with department name
    fetchUserDetails();

  }, [user, navigate]);

  // ✅ NEW: Fetch user details with department name from backend
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No access token available');
        return;
      }

      const response = await fetch('http://localhost:8000/api/users/get_user_details/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✓ User details fetched:', data.data);

        // Update form data with fetched department
        if (data.data?.department) {
          setFormData(prev => ({
            ...prev,
            department: data.data.department,
            full_name: data.data.full_name || prev.full_name,
          }));
        }
      } else {
        console.log('Could not fetch user details');
        // Fallback
        setFormData(prev => ({
          ...prev,
          department: 'Unassigned',
        }));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Fallback
      setFormData(prev => ({
        ...prev,
        department: 'Unassigned',
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.full_name?.trim()) {
        toast({
          title: 'Error',
          description: 'Full name is required',
          variant: 'destructive',
        });
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!formData.designation?.trim()) {
        toast({
          title: 'Error',
          description: 'Designation is required',
          variant: 'destructive',
        });
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // ✅ Only send required fields - NO address fields
      const submitData: any = {
        full_name: formData.full_name,
        phone: formData.phone,
        designation: formData.designation,
        department: formData.department,
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.date_of_birth && { date_of_birth: formData.date_of_birth }),
        ...(formData.marital_status && { marital_status: formData.marital_status }),
        ...(formData.bio && { bio: formData.bio }),
      };

      const response = await fetch('http://localhost:8000/api/users/complete_profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to complete profile');
      }

      const data = await response.json();
      console.log('✓ Profile completed successfully:', data);

      // ✅ Update localStorage safely
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          userData.profile_completed = true;
          userData.temp_password = false;
          userData.full_name = formData.full_name;
          if (formData.phone) userData.phone = formData.phone;
          if (formData.designation) userData.designation = formData.designation;
          if (formData.department) userData.department = formData.department;
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error('Error updating localStorage:', e);
        }
      }

      console.log('✓ Profile completed successfully');
      console.log('✓ profile_completed = true');
      console.log('✓ temp_password = false');

      toast({
        title: 'Success!',
        description: 'Your profile has been completed successfully',
      });

      setTimeout(() => {
        const userRole = user?.role?.toLowerCase() || '';
        if (userRole === 'hr' || userRole === 'manager') {
          navigate('/ManagerDashboard', { replace: true });
        } else if (userRole === 'employee') {
          navigate('/EmployeeDashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 1000);
    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to complete profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-slate-400">
            We just need a few more details to personalize your workspace.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-8 text-sm">
          {[1, 2].map((step, idx) => {
            const isCompleted = step < currentStep;
            const isActive = step === currentStep;

            return (
              <div
                key={step}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={[
                      'w-9 h-9 rounded-full flex items-center justify-center border-2',
                      isCompleted
                        ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
                        : isActive
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-slate-600 bg-slate-900 text-slate-400',
                    ].join(' ')}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      Step {step}
                    </span>
                    <span className="text-sm font-medium text-slate-200">
                      {step === 1 ? 'Basic Info' : 'Work Details'}
                    </span>
                  </div>
                </div>
                {idx < 1 && (
                  <div className="w-20 h-px bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700" />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl shadow-black/40 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Basic Information
                  </h2>
                  <p className="text-sm text-slate-400">
                    Tell us about yourself
                  </p>
                </div>

                <div className="grid gap-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-slate-200">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="bg-slate-900/70 border-slate-700 text-slate-100"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-200">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91-XXXXXXXXXX"
                      className="bg-slate-900/70 border-slate-700 text-slate-100"
                    />
                  </div>

                  {/* Gender + DOB */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-slate-200">
                        Gender
                      </Label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="bg-slate-900/70 border border-slate-700 text-slate-100 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth" className="text-slate-200">
                        Date of Birth
                      </Label>
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="bg-slate-900/70 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Marital Status */}
                  <div className="space-y-2">
                    <Label htmlFor="marital_status" className="text-slate-200">
                      Marital Status
                    </Label>
                    <select
                      id="marital_status"
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleInputChange}
                      className="bg-slate-900/70 border border-slate-700 text-slate-100 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Work Details (NO address fields) */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Work Details
                  </h2>
                  <p className="text-sm text-slate-400">
                    Your role and responsibilities
                  </p>
                </div>

                <div className="grid gap-5">
                  {/* Department - READ ONLY */}
                  <div className="space-y-2">
                    <Label className="text-slate-200">Department</Label>
                    <div className="bg-slate-900/70 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 font-medium">
                      {formData.department}
                    </div>
                    <p className="text-xs text-slate-500">
                      This is assigned from your company setup.
                    </p>
                  </div>

                  {/* Designation */}
                  <div className="space-y-2">
                    <Label htmlFor="designation" className="text-slate-200">
                      Designation <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Manager"
                      className="bg-slate-900/70 border-slate-700 text-slate-100"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-200">
                      Bio / About You
                    </Label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      className="bg-slate-900/70 border border-slate-700 text-slate-100 rounded-md px-3 py-2 text-sm min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer / Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-slate-700 text-slate-200 hover:bg-slate-800"
                >
                  ← Back
                </Button>
              )}

              <div className="ml-auto flex items-center gap-3">
                {currentStep < 2 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}

                {currentStep === 2 && (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete Profile
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;