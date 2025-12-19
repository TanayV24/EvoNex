import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';


// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './Dashboards/Dashboard';
import AdminDashboard from './Dashboards/AdminDashboard';
import ManagerDashboard from './Dashboards/ManagerDashboard'; // NEW
import Onboarding from './pages/Onboarding';
import ProfileCompletion from './pages/ProfileCompletion';
import Employees from './pages/Employees';
import Tasks from './pages/Tasks';
import Leave from './pages/Leave';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import ChatPage from './pages/ChatPage';
import WhiteboardPage from './pages/Whiteboard';

const queryClient = new QueryClient();

// PROTECTED ROUTE COMPONENT
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (!user) return;

    const currentPath = window.location.pathname;

    // COMPANY ADMIN FLOW
    if (user.role === 'company_admin') {
      // Step 1: Temp password? Change password page
      if (user.temp_password === true) {
        if (currentPath !== '/auth/change-password') {
          console.log('Admin: Temp password detected → change-password');
          navigate('/auth/change-password', { replace: true });
        }
        return;
      }

      // Step 2: Company setup not completed? Onboarding page
      if (user.company_setup_completed === false) {
        if (currentPath !== '/onboarding') {
          console.log('Admin: Setup not completed → onboarding');
          navigate('/onboarding', { replace: true });
        }
        return;
      }

      // Step 3: All done, don't go back to setup
      if (
        user.company_setup_completed === true &&
        currentPath === '/onboarding'
      ) {
        console.log('Admin: Setup complete → admin/dashboard');
        navigate('/admin/dashboard', { replace: true });
        return;
      }
    }

    // MANAGER FLOW (NEW) ⭐
    if (user.role === 'manager') {
      // Step 1: Temp password? Change password page
      if (user.temp_password === true) {
        if (currentPath !== '/users/change-password') {
          console.log('Manager: Temp password detected → change-password');
          navigate('/users/change-password', { replace: true });
        }
        return;
      }

      // Step 2: Profile not completed? Profile completion page
      if (user.profile_completed === false) {
        if (currentPath !== '/profile-completion') {
          console.log('Manager: Profile not completed → profile-completion');
          navigate('/profile-completion', { replace: true });
        }
        return;
      }

      // Step 3: All done, route to manager dashboard
      if (user.profile_completed === true && currentPath === '/profile-completion') {
        console.log('Manager: Profile complete → managerdashboard');
        navigate('/ManagerDashboard', { replace: true });
        return;
      }
    }

    // HR MANAGER FLOW
    if (user.role === 'hr') {
      // Step 1: Temp password? Change password page
      if (user.temp_password === true) {
        if (currentPath !== '/users/change-password') {
          console.log('HR: Temp password detected → change-password');
          navigate('/users/change-password', { replace: true });
        }
        return;
      }

      // Step 2: Profile not completed? Profile completion page
      if (user.profile_completed === false) {
        if (currentPath !== '/profile-completion') {
          console.log('HR: Profile not completed → profile-completion');
          navigate('/profile-completion', { replace: true });
        }
        return;
      }

      // Step 3: All done, route to dashboard
      if (user.profile_completed === true && currentPath === '/profile-completion') {
        console.log('HR: Profile complete → dashboard');
        navigate('/ManagerDashboard', { replace: true });
        return;
      }
    }

    // EMPLOYEE / TEAM LEAD FLOW
    if (['employee', 'team_lead'].includes(user.role)) {
      // Step 1: Temp password? Change password page
      if (user.temp_password === true) {
        if (currentPath !== '/users/change-password') {
          console.log('Employee: Temp password detected → change-password');
          navigate('/users/change-password', { replace: true });
        }
        return;
      }

      // Step 2: Profile not completed? Profile completion page
      if (user.profile_completed === false) {
        if (currentPath !== '/profile-completion') {
          console.log('Employee: Profile not completed → profile-completion');
          navigate('/profile-completion', { replace: true });
        }
        return;
      }

      // Step 3: All done, route to dashboard
      if (user.profile_completed === true && currentPath === '/profile-completion') {
        console.log('Employee: Profile complete → dashboard');
        navigate('/dashboard', { replace: true });
        return;
      }
    }
  }, [user, navigate, loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-50 border-t-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// MAIN APP COMPONENT
function AppContent() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* PROTECTED ROUTES - Auth */}
      <Route
        path="/auth/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-completion"
        element={
          <ProtectedRoute>
            <ProfileCompletion />
          </ProtectedRoute>
        }
      />

      {/* PROTECTED ROUTES - Dashboards */}
      {/* Main Dashboard (Employee/HR) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Manager Dashboard (NEW) ⭐ */}
      <Route
        path="/ManagerDashboard"
        element={
          <ProtectedRoute>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* PROTECTED ROUTES - Other Pages */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <ProtectedRoute>
            <Leave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/whiteboard"
        element={
          <ProtectedRoute>
            <WhiteboardPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ROOT APP COMPONENT
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
          <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}