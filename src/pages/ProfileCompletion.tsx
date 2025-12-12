import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { usersRest } from '@/services/api';

interface ProfileForm {
  full_name: string;
  phone: string;
  department: string;
  designation: string;
}

const ProfileCompletion: React.FC = () => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<ProfileForm>({
    full_name: '',
    phone: '',
    department: '',
    designation: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Only HR/Manager/Employee should see this, not admin
  React.useEffect(() => {
    if (user?.role === 'company_admin') {
      navigate('/onboarding', { replace: true });
    }
    // If already completed, go to dashboard
    if (user?.profile_completed === true) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation
  if (!form.full_name || !form.department) {
    toast({
      title: 'Error',
      description: 'Please fill in all required fields',
      variant: 'destructive',
    });
    return;
  }
  
  if (isLoading) return; // Prevent double submission
  setIsLoading(true);
  
  try {
    // ✅ Use usersRest service
    const data = await usersRest.completeProfile(form);
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to complete profile');
    }
    
    toast({
      title: 'Success!',
      description: 'Your profile has been completed',
    });
    
    // Update localStorage with profile_completed = true
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.profile_completed = true;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    // Redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 500);
    
  } catch (error) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <p className="text-sm text-gray-600">
            Please fill in your profile information to get started
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Enter your full name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91-9876543210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium">
                Department <span className="text-red-500">*</span>
              </Label>
              <Input
                id="department"
                type="text"
                placeholder="e.g., HR, Engineering, Sales"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation" className="text-sm font-medium">
                Designation / Job Title
              </Label>
              <Input
                id="designation"
                type="text"
                placeholder="e.g., HR Manager, Senior Engineer"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Completing Profile...
                </>
              ) : (
                'Complete Profile & Continue'
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              * Required fields
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
