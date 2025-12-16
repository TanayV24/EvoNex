import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/workos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

interface LoginCredentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Login attempt:', {
        email: credentials.email,
        passwordLength: credentials.password.length,
      });

      // Call backend login
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          role: 'admin',
        }),
      });

      console.log('📡 Backend response status:', response.status);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        console.error('❌ Login failed:', data);
        throw new Error(data.error || data.message || 'Login failed');
      }

      console.log('✅ Login successful');

      // Store all data in localStorage
      localStorage.setItem('access_token', data.data.access_token);  // Fixed!
      localStorage.setItem('token', data.data.access_token);         // Also add!
      localStorage.setItem('refresh_token', data.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      console.log('💾 Data stored in localStorage');
      console.log('📋 User data:', data.data.user);
      console.log('🔑 Temp password flag:', data.data.user.temp_password);

      // Call login in AuthContext to update state
      await login(
        credentials.email,
        credentials.password,
        data.data.user.role as UserRole
      );

      toast({
        title: 'Welcome!',
        description: `Logged in as ${data.data.user.full_name}`,
      });

      // Redirect based on temp_password flag
      // Redirect based on role and setup flags
      const userRole = data.data.user.role;
      const tempPassword = data.data.user.temp_password;
      const setupCompleted = data.data.user.company_setup_completed;
      const profileCompleted = data.data.user.profile_completed;

      console.log('🔍 Redirect logic:', { userRole, tempPassword, setupCompleted, profileCompleted });

      // ADMIN FLOW
      if (userRole === 'company_admin') {
          if (tempPassword === true) {
              // Admin with temp password → Change password page
              console.log('🔐 Admin: Temp password detected → /auth/change-password');
              setTimeout(() => {
                  navigate('/auth/change-password', { replace: true });
              });
          } else if (setupCompleted === false) {
              // Admin needs company setup
              console.log('🏢 Admin: Setup not completed → /onboarding');
              setTimeout(() => {
                  navigate('/onboarding', { replace: true });
              });
          } else {
              // Admin all set
              console.log('✅ Admin: All setup complete → /admin/dashboard');
              setTimeout(() => {
                  navigate('/admin/dashboard', { replace: true });
              });
          }
      }
  
      // HR / MANAGER / EMPLOYEE FLOW
      else if (['manager', 'hr_manager', 'team_lead', 'employee'].includes(userRole)) {
          if (tempPassword === true) {
              // HR/Manager with temp password → Change password page
              console.log('🔐 HR/Manager: Temp password detected → /users/change-password');
              setTimeout(() => {
                  navigate('/users/change-password', { replace: true });
              });
          } else if (profileCompleted === false) {
              // HR/Manager needs profile completion
              console.log('👤 HR/Manager: Profile not completed → /profile-completion');
              setTimeout(() => {
                  navigate('/profile-completion', { replace: true });
              });
          } else {
              // HR/Manager all set
              console.log('✅ HR/Manager: All setup complete → /dashboard');
              setTimeout(() => {
                  navigate('/dashboard', { replace: true });
              });
          }
      }
      // UNKNOWN ROLE
      else {
          console.log('⚠️ Unknown role:', userRole);
          setTimeout(() => {
              navigate('/dashboard', { replace: true });
          });
      }

    } catch (error) {
      console.error('🔴 Login error:', error);
      toast({
        title: 'Login Failed',
        description:
          error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">📋</span>
              </div>
            </div>
            <CardTitle className="text-center text-white">WorkOS</CardTitle>
            <p className="text-center text-blue-100 text-sm mt-2">
              Workforce Operating System
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create Company
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;