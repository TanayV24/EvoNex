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
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  marital_status?: string;
  bio?: string;
}

const ProfileCompletion: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState(['HR', 'Engineering', 'Sales', 'Marketing', 'Operations']);
  const [isHRRole, setIsHRRole] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: user?.full_name || '',
    phone: '',
    designation: '',
    department: user?.role === 'hr' ? 'HR' : '',
    gender: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    marital_status: '',
    bio: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // ✅ FIX: Safe role checking without accessing company_id
    const userRole = user?.role?.toLowerCase() || '';
    
    if (userRole === 'hr' || userRole === 'manager' || userRole === 'company_admin') {
      setIsHRRole(true);
    }

    // Redirect company_admin to onboarding
    if (userRole === 'company_admin') {
      navigate('/onboarding', { replace: true });
      return;
    }

    // If profile already completed, redirect to dashboard
    if (user?.profile_completed === true && user?.temp_password === false) {
      console.log('✓ Profile already completed, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    loadDepartments();
  }, [user, navigate]);

  const loadDepartments = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No access token, using default departments');
        return;
      }
      
      const response = await fetch('http://localhost:8000/api/companies/departments/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const deptNames = data.results?.map((d: any) => d.name) || [];
        if (deptNames.length > 0) {
          setDepartments(deptNames);
        }
      }
    } catch (error) {
      console.log('Using default departments:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.full_name?.trim()) {
        toast({ title: 'Error', description: 'Full name is required', variant: 'destructive' });
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!formData.designation?.trim()) {
        toast({ title: 'Error', description: 'Designation is required', variant: 'destructive' });
        return false;
      }

      if (!isHRRole && !formData.department?.trim()) {
        toast({ title: 'Error', description: 'Department is required', variant: 'destructive' });
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

      // ✅ FIX: Send only the fields you need
      const submitData = {
        full_name: formData.full_name,
        phone: formData.phone,
        designation: formData.designation,
        department: formData.department,
        // Optional fields
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.date_of_birth && { date_of_birth: formData.date_of_birth }),
        ...(formData.address && { address: formData.address }),
        ...(formData.city && { city: formData.city }),
        ...(formData.state && { state: formData.state }),
        ...(formData.country && { country: formData.country }),
        ...(formData.pincode && { pincode: formData.pincode }),
        ...(formData.marital_status && { marital_status: formData.marital_status }),
        ...(formData.bio && { bio: formData.bio }),
      };

      const response = await fetch('http://localhost:8000/api/users/complete_profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to complete profile');
      }

      const data = await response.json();
      console.log('✓ Profile completed successfully:', data);

      // ✅ FIX: Update localStorage safely
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
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 1000);

    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to complete profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2].map((step, idx) => (
            <React.Fragment key={step}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                step < currentStep ? 'bg-green-500 text-white' : 
                step === currentStep ? 'bg-blue-500 text-white' : 
                'bg-gray-600 text-gray-300'
              }`}>
                {step < currentStep ? <CheckCircle2 className="w-6 h-6" /> : step}
              </div>
              <p className={`ml-3 text-sm font-medium ${
                step <= currentStep ? 'text-white' : 'text-gray-400'
              }`}>
                {step === 1 ? 'Basic Info' : isHRRole ? 'Work Details' : 'Work & Address'}
              </p>
              {idx < 1 && (
                <div className={`flex-1 h-1 mx-4 ${step < currentStep ? 'bg-green-500' : 'bg-gray-600'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
                  <p className="text-gray-400">Tell us about yourself</p>
                </div>

                {/* Full Name */}
                <div>
                  <Label className="text-gray-300">Full Name *</Label>
                  <Input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-gray-300">Phone Number</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91-XXXXXXXXXX"
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label className="text-gray-300">Gender</Label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <Label className="text-gray-300">Date of Birth</Label>
                  <Input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                {/* Marital Status */}
                <div>
                  <Label className="text-gray-300">Marital Status</Label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Work & Address Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isHRRole ? 'Work Details' : 'Work & Address Details'}
                  </h2>
                  <p className="text-gray-400">
                    {isHRRole ? 'Your role and responsibilities' : 'Your role and location information'}
                  </p>
                </div>

                {/* Department - Only for non-HR users */}
                {!isHRRole && (
                  <div>
                    <Label className="text-gray-300">Department *</Label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Department - Read-only for HR users */}
                {isHRRole && (
                  <div>
                    <Label className="text-gray-300">Department</Label>
                    <div className="px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md">
                      <p className="font-medium">HR</p>
                      <p className="text-sm text-gray-400">Auto-assigned for HR Manager</p>
                    </div>
                  </div>
                )}

                {/* Designation */}
                <div>
                  <Label className="text-gray-300">Designation *</Label>
                  <Input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Manager"
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                    required
                  />
                </div>

                {/* Address - Only for non-HR users */}
                {!isHRRole && (
                  <>
                    <div>
                      <Label className="text-gray-300">Address</Label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">City</Label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">State</Label>
                        <Input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Pincode</Label>
                        <Input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="Pincode"
                          className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Country</Label>
                        <Input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Country"
                          className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Bio */}
                <div>
                  <Label className="text-gray-300">Bio / About You</Label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md placeholder-gray-500"
                  />
                </div>
              </div>
            )}

            {/* Footer / Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="bg-slate-700 text-white hover:bg-slate-600"
                >
                  ← Back
                </Button>
              )}

              {currentStep < 2 && (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {currentStep === 2 && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto bg-green-600 hover:bg-green-700 text-white"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;