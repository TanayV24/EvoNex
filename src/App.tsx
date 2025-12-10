// src/App.tsx

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
import { SidebarProvider } from "@/contexts/sideBarContext";
import React from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import Leave from "./pages/Leave";
import Settings from "./pages/Settings";
import WhiteboardPage from "./pages/Whiteboard";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import ChatPage from "./pages/ChatPage";

const queryClient = new QueryClient();

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      const needsOnboarding =
        user.temp_password || user.company_setup_completed === false;
      const isOnOnboardingPage = window.location.pathname === "/onboarding";
      const isOnChangePasswordPage =
        window.location.pathname === "/auth/change-password";

      if (
        needsOnboarding &&
        !isOnOnboardingPage &&
        !isOnChangePasswordPage
      ) {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ============================================
// APP COMPONENT
// ============================================
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider>
              <TooltipProvider>
                <ChatProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route
                      path="/auth/change-password"
                      element={<ChangePassword />}
                    />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin-dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/developer-dashboard"
                      element={
                        <ProtectedRoute>
                          <DeveloperDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/companies"
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
                      path="/attendance"
                      element={
                        <ProtectedRoute>
                          <Attendance />
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
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
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
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Fallback - 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>

                  {/* Toasters for notifications */}
                  <Toaster />
                  <Sonner />
                </ChatProvider>
              </TooltipProvider>
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
