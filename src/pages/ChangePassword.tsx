import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Loader2, AlertCircle } from 'lucide-react';
import { authRest, usersRest } from '@/services/api';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if password already changed - redirect if needed
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      
      // If password already changed, redirect to next step
      if (userData.temp_password === false) {
        if (userData.role === 'company_admin') {
          // Admin goes to company setup (or dashboard if already done)
          if (userData.company_setup_completed === false) {
            navigate('/onboarding', { replace: true });
          } else {
            navigate('/admin/dashboard', { replace: true });
          }
        } else {
          // Manager/HR/Employee goes to profile completion
          if (userData.profile_completed === false) {
            navigate('/onboarding/profile', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (form.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    if (isLoading) return; // Prevent double submission

    setIsLoading(true);

    try {
      console.log('🔐 Changing password for role:', user?.role);

      let response;

      // Call appropriate endpoint based on role
      if (user?.role === 'company_admin') {
        response = await authRest.changeTempPassword(
          form.currentPassword,
          form.newPassword
        );
      } else {
        // Manager/HR/Employee
        response = await authRest.changeTempPassword(
          form.currentPassword,
          form.newPassword
        );
      }

      console.log('✓ Password change response:', response);

      toast({
        title: 'Success!',
        description: 'Your password has been changed successfully',
      });

      // ✅ CRITICAL FIX: Update localStorage with the response data
      if (response.data && response.data.user) {
        const updatedUser = {
          ...user,
          ...response.data.user,
          temp_password: false, // Ensure it's set to false
        };

        console.log('💾 Updating localStorage with:', updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        updateUserData({ temp_password: false });
      }

      // Redirect based on role and setup/profile status
      setTimeout(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);

          if (userData.role === 'company_admin') {
            console.log('→ Redirecting admin to:', 
              userData.company_setup_completed ? '/admin/dashboard' : '/onboarding'
            );
            if (!userData.company_setup_completed) {
              navigate('/onboarding', { replace: true });
            } else {
              navigate('/admin/dashboard', { replace: true });
            }
          } else if (userData.role === 'manager' || userData.role === 'hr') {
              console.log('→ Redirecting employee/team_lead to:', 
                userData.profile_completed ? '/ManagerDashboard' : '/profile-completion'
              );
              if (!userData.profile_completed) {
                navigate('/profile-completion', { replace: true });
              } else {
                navigate('/ManagerDashboard', { replace: true });
              }
            }
            // EMPLOYEE / TEAM_LEAD - should go to /dashboard
            else if (userData.role === 'employee' || userData.role === 'team_lead') {
              console.log('→ Redirecting employee/team_lead to:', 
                userData.profile_completed ? '/dashboard' : '/profile-completion'
              );
              if (!userData.profile_completed) {
                navigate('/profile-completion', { replace: true });
              } else {
                navigate('/dashboard', { replace: true });
              }
            }
            // FALLBACK - unknown role
            else {
              console.log('⚠️ Unknown role:', userData.role);
              navigate('/landing', { replace: true });
            }

        }
      }, 500);

    } catch (error) {
      console.error('❌ Password change error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user doesn't exist, show loading
  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Change Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Alert */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Temporary Password Detected</p>
              <p className="text-sm text-yellow-800">You must change your password before continuing</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <Label htmlFor="current">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="current"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
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
            <div>
              <Label htmlFor="new">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="new"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
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
              <p className="text-xs text-gray-500 mt-1">At least 8 characters recommended</p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirm">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;