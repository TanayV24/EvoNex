import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import React from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Employees from "./pages/Employees";
import Onboarding from "./pages/Onboarding";
import ChatPage from "./pages/ChatPage";
import ProfileCompletion from "./pages/ProfileCompletion";

const queryClient = new QueryClient();

// ============================================
// PROTECTED ROUTE COMPONENT - FIXED VERSION
// ============================================

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loading) return; // Wait for auth to load
    
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (!user) return;

    const currentPath = window.location.pathname;

    // ============================================
    // COMPANY ADMIN FLOW
    // ============================================
    
    if (user.role === 'company_admin') {
      // Step 1: Temp password? → Change password page
      if (user.temp_password === true) {
        if (currentPath !== '/auth/change-password') {
          console.log('🔐 Admin: Temp password detected → change-password');
          navigate('/auth/change-password', { replace: true });
        }
        return;
      }

      // Step 2: Company setup not completed? → Onboarding page
      if (user.company_setup_completed === false) {
        if (currentPath !== '/onboarding') {
          console.log('🏢 Admin: Setup not completed → onboarding');
          navigate('/onboarding', { replace: true });
        }
        return;
      }

      // Step 3: All done, don't go back to setup
      if (user.company_setup_completed === true && currentPath === '/onboarding') {
        console.log('✅ Admin: Setup complete → admin/dashboard');
        navigate('/admin/dashboard', { replace: true });
        return;
      }
    }

    // ============================================
    // MANAGER/HR/EMPLOYEE FLOW
    // ============================================
    
      else if (['manager', 'hr', 'team_lead', 'employee'].includes(user.role)) {
      // Step 1: Temp password? → Change password page
      if (user.temp_password === true) {
          if (currentPath !== '/users/change-password') {
              console.log('🔐 Manager/HR: Temp password detected → /users/change-password');
              navigate('/users/change-password', { replace: true });
          }
          return;
      }
      // Step 2: Profile not completed? → Profile completion page
      if (user.profile_completed === false) {
          if (currentPath !== '/profile-completion') {
              console.log('👤 Manager/HR: Profile not completed → /profile-completion');
              navigate('/profile-completion', { replace: true });
          }
          return;
      }
      // Step 3: All done, don't go back to profile completion
      if (user.profile_completed === true && currentPath === '/profile-completion') {
          console.log('✅ Manager/HR: Profile complete → /dashboard');
          navigate('/dashboard', { replace: true });
          return;
      }
  }

  }, [user, navigate, loading, isAuthenticated]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/auth/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      
      <Route element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} path="/users/change-password" />
      <Route element={<ProtectedRoute><ProfileCompletion /></ProtectedRoute>} path="/profile-completion" />


      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Manager/HR Routes */}
      <Route
        path="/onboarding/profile"
        element={
          <ProtectedRoute>
            <ProfileCompletion />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider>
              <ChatProvider>
                <TooltipProvider>
                  <AppContent />
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </ChatProvider>
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;