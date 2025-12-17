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
import Dashboard from "./Dashboards/Dashboard";
import AdminDashboard from "./Dashboards/AdminDashboard";
import Employees from "./pages/Employees";
import Onboarding from "./pages/Onboarding";
import ChatPage from "./pages/ChatPage";
import ProfileCompletion from "./pages/ProfileCompletion";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import Leave from "./pages/Leave";
import Settings from "./pages/Settings";
import WhiteboardPage from "./pages/Whiteboard";

const queryClient = new QueryClient();

// ============================================
// PROTECTED ROUTE COMPONENT - FIXED VERSION
// ============================================
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
    if (user.role === "company_admin") {
      // Step 1: Temp password? → Change password page
      if (user.temp_password === true) {
        if (currentPath !== "/auth/change-password") {
          console.log(
            "🔐 Admin: Temp password detected → change-password"
          );
          navigate("/auth/change-password", { replace: true });
        }
        return;
      }

      // Step 2: Company setup not completed? → Onboarding page
      if (user.company_setup_completed === false) {
        if (currentPath !== "/onboarding") {
          console.log("🏢 Admin: Setup not completed → onboarding");
          navigate("/onboarding", { replace: true });
        }
        return;
      }

      // Step 3: All done, don't go back to setup
      if (
        user.company_setup_completed === true &&
        currentPath === "/onboarding"
      ) {
        console.log("✅ Admin: Setup complete → admin/dashboard");
        navigate("/admin/dashboard", { replace: true });
        return;
      }
    }

    // ============================================
    // MANAGER/HR/EMPLOYEE FLOW
    // ============================================
    else if (
      ["manager", "hr", "team_lead", "employee"].includes(user.role)
    ) {
      // Step 1: Temp password? → Change password page
      if (user.temp_password === true) {
        if (currentPath !== "/users/change-password") {
          console.log(
            "🔐 Manager/HR: Temp password detected → /users/change-password"
          );
          navigate("/users/change-password", { replace: true });
        }
        return;
      }

      // Step 2: Profile not completed? → Profile completion page
      if (user.profile_completed === false) {
        if (currentPath !== "/profile-completion") {
          console.log(
            "👤 Manager/HR: Profile not completed → /profile-completion"
          );
          navigate("/profile-completion", { replace: true });
        }
        return;
      }

      // Step 3: All done, don't go back to profile completion
      if (
        user.profile_completed === true &&
        currentPath === "/profile-completion"
      ) {
        console.log("✅ Manager/HR: Profile complete → /dashboard");
        navigate("/dashboard", { replace: true });
        return;
      }
    }
  }, [user, navigate, loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ============================================
// MAIN APP COMPONENT
// ============================================
function AppContent() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* ===== PROTECTED ROUTES ===== */}

      {/* Auth Routes - No Sidebar */}
      <Route
        path="/auth/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* Onboarding - No Sidebar */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Profile Completion - No Sidebar */}
      <Route
        path="/profile-completion"
        element={
          <ProtectedRoute>
            <ProfileCompletion />
          </ProtectedRoute>
        }
      />

      {/* User Change Password - No Sidebar */}
      <Route
        path="/users/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* ===== DASHBOARD ROUTES WITH SIDEBAR ===== */}

      {/* Main Dashboard */}
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

      {/* Work Management Pages */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
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
        path="/leave"
        element={
          <ProtectedRoute>
            <Leave />
          </ProtectedRoute>
        }
      />

      {/* People Management */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />

      {/* Collaboration */}
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

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider>
              <TooltipProvider>
                <AppContent />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}