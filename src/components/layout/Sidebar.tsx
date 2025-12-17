// src/components/layout/Sidebar.tsx - UPDATED WITH INDIVIDUAL ITEMS

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebarCollapse } from "@/contexts/SidebarContext";
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckSquare,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  BarChart3,
  Link2,
  Settings,
  Shield,
  ChevronRight,
  ChevronLeft,
  LogOut,
  MessageSquare,
  PenTool,
  ChevronDown,
  Sparkles,
  X,
} from "lucide-react";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
  defaultOpen?: boolean;
  icon?: React.ElementType;
}

const menuGroups: MenuGroup[] = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: BarChart3, label: "Analytics", path: "/analytics" },
      { icon: Users, label: "Employees", path: "/employees" },
    ],
    defaultOpen: true,
  },
  {
    label: "Work Management",
    icon: CheckSquare,
    items: [
      { icon: CheckSquare, label: "Tasks", path: "/tasks", badge: "12" },
      { icon: Clock, label: "Attendance", path: "/attendance" },
      { icon: Calendar, label: "Leave", path: "/leave" },
    ],
    defaultOpen: true,
  },
  {
    label: "Collaboration",
    icon: MessageSquare,
    items: [
      { icon: MessageSquare, label: "Chat", path: "/chat", badge: "5" },
      { icon: PenTool, label: "Whiteboard", path: "/whiteboard" },
    ],
    defaultOpen: true,
  },
  {
    label: "Finance",
    icon: DollarSign,
    items: [
      { icon: DollarSign, label: "Payroll", path: "/payroll" },
      { icon: CreditCard, label: "Advances", path: "/advances" },
    ],
    defaultOpen: false,
  },
  {
    label: "System",
    icon: Shield,
    items: [
      { icon: Shield, label: "Security", path: "/security" },
      { icon: Link2, label: "Integrations", path: "/integrations" },
      { icon: FileText, label: "Compliance", path: "/compliance" },
    ],
    defaultOpen: false,
  },
];

// Animation Variants
const sidebarVariants: Variants = {
  expanded: {
    width: 280,
    transition: { type: "spring", stiffness: 400, damping: 40 },
  },
  collapsed: {
    width: 90,
    transition: { type: "spring", stiffness: 400, damping: 40 },
  },
};

const groupHeaderVariants: Variants = {
  hover: { x: 4, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: { opacity: 0, x: -10, scale: 0.95, transition: { duration: 0.2 } },
};

const iconContainerVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.15,
    rotate: [0, -8, 8, -8, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const floatingTrayVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, x: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    x: -20,
    transition: { duration: 0.2 },
  },
};

const floatingItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  hover: {
    scale: 1.05,
    x: 4,
    transition: { duration: 0.2 },
  },
};

const subMenuVariants: Variants = {
  closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  open: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const subItemVariants: Variants = {
  closed: { opacity: 0, x: -10 },
  open: { opacity: 1, x: 0 },
};

export const Sidebar: React.FC = () => {
  const { isCollapsed, setIsCollapsed } = useSidebarCollapse();
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    menuGroups.reduce(
      (acc, group) => ({
        ...acc,
        [group.label]: group.defaultOpen ?? true,
      }),
      {}
    )
  );

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [floatingTray, setFloatingTray] = useState<string | null>(null);

  // Close floating tray on route change
  useEffect(() => {
    setFloatingTray(null);
  }, [location.pathname]);

  // Close floating tray when sidebar expands
  useEffect(() => {
    if (!isCollapsed) {
      setFloatingTray(null);
    }
  }, [isCollapsed]);

  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const toggleGroup = (label: string) => {
    if (isCollapsed) {
      setFloatingTray(floatingTray === label ? null : label);
    } else {
      setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
    }
  };

  const handleFloatingItemClick = (path: string) => {
    navigate(path);
    setFloatingTray(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Separate single items from grouped items
  const mainGroup = menuGroups.find((g) => g.label === "Main");
  const groupedMenus = menuGroups.filter((g) => g.label !== "Main");

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {floatingTray && isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFloatingTray(null)}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className={cn(
          "fixed left-0 top-0 h-screen flex flex-col border-r z-40 overflow-hidden shadow-2xl transition-colors duration-300",
          isDark
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-blue-500/20"
            : "bg-gradient-to-br from-white via-slate-50 to-white border-blue-200/50"
        )}
      >
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={cn(
              "absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl",
              isDark ? "bg-blue-500/20" : "bg-blue-400/20"
            )}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className={cn(
              "absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl",
              isDark ? "bg-purple-500/20" : "bg-purple-400/20"
            )}
          />
        </div>

        {/* Logo Section */}
        <motion.div
          layout
          className={cn(
            "relative p-4 border-b flex items-center gap-3 z-20 transition-colors duration-300 flex-shrink-0",
            isDark
              ? "bg-gradient-to-b from-slate-950/80 to-slate-950/40 backdrop-blur-sm border-blue-500/20"
              : "bg-white/50 backdrop-blur-sm border-blue-200/50"
          )}
        >
          <motion.div
            whileHover={{
              rotate: 360,
              scale: 1.05,
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)",
            }}
            transition={{ duration: 0.6 }}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-lg shadow-blue-500/50",
              isCollapsed && "mx-auto"
            )}
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 4px rgba(255,255,255,0.5)",
                  "0 0 8px rgba(255,255,255,0.8)",
                  "0 0 4px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              W
            </motion.span>
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <motion.div
                  className={cn(
                    "font-bold text-sm",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                  style={{
                    backgroundImage: isDark
                      ? "linear-gradient(to right, #fff, #93c5fd)"
                      : "linear-gradient(to right, #0f172a, #3b82f6)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  WorkOS
                </motion.div>
                <div
                  className={cn(
                    "text-xs",
                    isDark ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  Workspace Pro
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation - NO SCROLLING IN COLLAPSED MODE */}
        <motion.nav
          layout
          className={cn(
            "flex-1 z-20 relative",
            isCollapsed ? "overflow-hidden" : "overflow-y-auto hide-scrollbar"
          )}
        >
          <div className="h-full flex flex-col gap-6 py-4 px-3">
            {/* Individual Items (Dashboard, Analytics, Employees) */}
            {mainGroup && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-shrink-0 space-y-1"
              >
                {mainGroup.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <motion.div
                      key={item.path}
                      custom={itemIndex}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive: navActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                            navActive
                              ? isDark
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-lg shadow-blue-500/20"
                                : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md shadow-blue-200/50"
                              : isDark
                              ? "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                            isCollapsed && "justify-center"
                          )
                        }
                      >
                        {/* Active indicator */}
                        {active && (
                          <>
                            <motion.div
                              layoutId="activeIndicator"
                              className={cn(
                                "absolute left-0 top-0 bottom-0 w-1 rounded-r-full",
                                isDark
                                  ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                                  : "bg-blue-600 shadow-md shadow-blue-600/50"
                              )}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 35,
                              }}
                            />
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"
                              animate={{ opacity: [0.5, 0.8, 0.5] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          </>
                        )}

                        {/* Icon */}
                        <motion.div
                          variants={iconContainerVariants}
                          initial="rest"
                          whileHover="hover"
                          className="relative z-10"
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {active && (
                            <motion.div
                              className="absolute inset-0 blur-md opacity-50"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <Icon className="w-5 h-5 text-blue-400" />
                            </motion.div>
                          )}
                        </motion.div>

                        {!isCollapsed && (
                          <span className="text-sm font-medium relative z-10 flex-1">
                            {item.label}
                          </span>
                        )}

                        {/* Badge */}
                        {!isCollapsed && item.badge && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-bold relative z-10",
                              active
                                ? isDark
                                  ? "bg-blue-400 text-slate-900"
                                  : "bg-blue-600 text-white"
                                : isDark
                                ? "bg-slate-700 text-slate-300"
                                : "bg-slate-200 text-slate-700"
                            )}
                          >
                            {item.badge}
                          </motion.div>
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Divider after individual items */}
            {mainGroup && groupedMenus.length > 0 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={cn(
                  "h-px mx-3 bg-gradient-to-r flex-shrink-0",
                  isDark
                    ? "from-transparent via-slate-700 to-transparent"
                    : "from-transparent via-slate-300 to-transparent"
                )}
              />
            )}

            {/* Grouped Items */}
            {groupedMenus.map((group, groupIndex) => {
              const GroupIcon = group.icon;
              const isGroupOpen = openGroups[group.label];
              const isTrayOpen = floatingTray === group.label;

              return (
                <motion.div
                  key={group.label}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (groupIndex + 1) * 0.1 }}
                  className="flex-shrink-0"
                >
                  {/* Group Header / Group Button */}
                  <motion.button
                    onClick={() => toggleGroup(group.label)}
                    variants={groupHeaderVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 mb-3 rounded-xl transition-all duration-300 group relative",
                      isCollapsed
                        ? "justify-center"
                        : "text-xs font-bold uppercase tracking-widest",
                      isDark
                        ? "text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                        : "text-slate-600 hover:text-blue-600 hover:bg-blue-100/50",
                      isTrayOpen &&
                        (isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100/60 text-blue-600")
                    )}
                  >
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="relative flex-shrink-0"
                    >
                      {GroupIcon && <GroupIcon className="w-5 h-5" />}
                    </motion.div>

                    {/* Label and Chevron (expanded mode only) */}
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left relative">
                          {group.label}
                          <motion.div
                            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                            initial={{ width: 0 }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </span>
                        <motion.div
                          animate={{ rotate: isGroupOpen ? 0 : -90 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      </>
                    )}

                    {/* Hover glow effect */}
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                        isDark ? "bg-blue-500/10" : "bg-blue-400/10"
                      )}
                    />
                  </motion.button>

                  {/* Divider between groups (collapsed mode) */}
                  {isCollapsed && groupIndex < groupedMenus.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "h-px mx-3 mb-3 bg-gradient-to-r",
                        isDark
                          ? "from-transparent via-slate-700 to-transparent"
                          : "from-transparent via-slate-300 to-transparent"
                      )}
                    />
                  )}

                  {/* Group Items (expanded mode only) */}
                  <AnimatePresence>
                    {!isCollapsed && isGroupOpen && (
                      <motion.div
                        variants={subMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="space-y-1 overflow-hidden"
                      >
                        {group.items.map((item, itemIndex) => {
                          const Icon = item.icon;
                          const active = isActive(item.path);

                          return (
                            <motion.div
                              key={item.path}
                              custom={itemIndex}
                              variants={subItemVariants}
                            >
                              <NavLink
                                to={item.path}
                                className={({ isActive: navActive }) =>
                                  cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    navActive
                                      ? isDark
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-lg shadow-blue-500/20"
                                        : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md shadow-blue-200/50"
                                      : isDark
                                      ? "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                  )
                                }
                              >
                                {/* Active indicator */}
                                {active && (
                                  <>
                                    <motion.div
                                      layoutId="activeIndicator"
                                      className={cn(
                                        "absolute left-0 top-0 bottom-0 w-1 rounded-r-full",
                                        isDark
                                          ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                                          : "bg-blue-600 shadow-md shadow-blue-600/50"
                                      )}
                                      transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 35,
                                      }}
                                    />
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"
                                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                      }}
                                    />
                                  </>
                                )}

                                {/* Icon */}
                                <motion.div
                                  variants={iconContainerVariants}
                                  initial="rest"
                                  whileHover="hover"
                                  className="relative z-10"
                                >
                                  <Icon className="w-5 h-5 flex-shrink-0" />
                                  {active && (
                                    <motion.div
                                      className="absolute inset-0 blur-md opacity-50"
                                      animate={{ scale: [1, 1.5, 1] }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                      }}
                                    >
                                      <Icon className="w-5 h-5 text-blue-400" />
                                    </motion.div>
                                  )}
                                </motion.div>

                                <span className="text-sm font-medium relative z-10 flex-1">
                                  {item.label}
                                </span>

                                {/* Badge */}
                                {item.badge && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{
                                      scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }}
                                    className={cn(
                                      "px-2 py-0.5 rounded-full text-xs font-bold relative z-10",
                                      active
                                        ? isDark
                                          ? "bg-blue-400 text-slate-900"
                                          : "bg-blue-600 text-white"
                                        : isDark
                                        ? "bg-slate-700 text-slate-300"
                                        : "bg-slate-200 text-slate-700"
                                    )}
                                  >
                                    {item.badge}
                                  </motion.div>
                                )}
                              </NavLink>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.nav>

        {/* Settings */}
        <motion.div
          layout
          className={cn(
            "border-t px-3 py-3 relative z-20 transition-colors duration-300 flex-shrink-0",
            isDark
              ? "bg-gradient-to-t from-slate-950/80 to-slate-950/40 backdrop-blur-sm border-blue-500/20"
              : "bg-white/50 backdrop-blur-sm border-blue-200/50"
          )}
        >
          <NavLink
            to="/settings"
            className={({ isActive: navActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
                navActive
                  ? isDark
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300"
                    : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                  : isDark
                  ? "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                isCollapsed && "justify-center"
              )
            }
          >
            <motion.div whileHover={{ scale: 1.2, rotate: 90 }} className="relative z-10">
              <Settings className="w-5 h-5 flex-shrink-0" />
            </motion.div>
            {!isCollapsed && (
              <span className="text-sm font-medium relative z-10">Settings</span>
            )}
          </NavLink>
        </motion.div>

        {/* Logout */}
        <motion.div
          layout
          className={cn(
            "border-t px-3 py-3 relative z-20 transition-colors duration-300 flex-shrink-0",
            isDark
              ? "bg-gradient-to-t from-slate-950/80 to-slate-950/40 backdrop-blur-sm border-blue-500/20"
              : "bg-white/50 backdrop-blur-sm border-blue-200/50"
          )}
        >
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
              isDark
                ? "text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                : "text-slate-600 hover:bg-red-50 hover:text-red-600",
              isCollapsed && "justify-center"
            )}
          >
            <motion.div
              whileHover={{ x: 2, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="relative z-10"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
            </motion.div>
            {!isCollapsed && (
              <span className="text-sm font-medium relative z-10">Logout</span>
            )}
          </motion.button>
        </motion.div>

        {/* Collapse Button */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{
            scale: 1.05,
            backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)",
          }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-full p-3 border-t flex items-center justify-center transition-all duration-300 relative z-20 group flex-shrink-0",
            isDark
              ? "border-blue-500/20 text-slate-400 hover:text-blue-400 bg-slate-950/50"
              : "border-blue-200/50 text-slate-600 hover:text-blue-600 bg-white/50"
          )}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </motion.div>

          {/* Animated line indicator */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.aside>

      {/* FLOATING TRAY POPUP - APPEARS WHEN GROUP CLICKED IN COLLAPSED MODE */}
      <AnimatePresence>
        {floatingTray && isCollapsed && (
          <motion.div
            variants={floatingTrayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed left-24 top-1/2 transform -translate-y-1/2 rounded-2xl p-6 z-50 min-w-[280px] shadow-2xl",
              isDark
                ? "bg-slate-900/95 backdrop-blur-xl border border-blue-500/40"
                : "bg-white/95 backdrop-blur-xl border border-blue-300/60"
            )}
          >
            {/* Tray Header */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <motion.h3
                className={cn(
                  "font-bold text-base flex items-center gap-2",
                  isDark ? "text-blue-300" : "text-blue-600"
                )}
              >
                {menuGroups.find((g) => g.label === floatingTray)?.icon &&
                  React.createElement(
                    menuGroups.find((g) => g.label === floatingTray)!.icon!,
                    { className: "w-5 h-5" }
                  )}
                {floatingTray}
              </motion.h3>
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFloatingTray(null)}
                className={cn(
                  "p-1 rounded-lg transition-colors flex-shrink-0",
                  isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-200/50"
                )}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Tray Items */}
            <div className="flex flex-col gap-2">
              {menuGroups
                .find((g) => g.label === floatingTray)
                ?.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <motion.button
                      key={item.path}
                      variants={floatingItemVariants}
                      whileHover="hover"
                      onClick={() => handleFloatingItemClick(item.path)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap relative overflow-hidden",
                        active
                          ? isDark
                            ? "bg-gradient-to-r from-blue-500/30 to-purple-500/20 text-blue-300 shadow-lg"
                            : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md"
                          : isDark
                          ? "bg-slate-800/50 text-slate-300 hover:bg-slate-700/60 hover:text-blue-300"
                          : "bg-slate-100/50 text-slate-700 hover:bg-blue-50/80 hover:text-blue-600"
                      )}
                    >
                      {/* Active glow */}
                      {active && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"
                          animate={{ opacity: [0.5, 0.8, 0.5] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="relative z-10"
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                      </motion.div>
                      <span className="relative z-10 flex-1 text-left">{item.label}</span>

                      {/* Badge in tray */}
                      {item.badge && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-bold relative z-10",
                            isDark ? "bg-blue-500 text-white" : "bg-blue-600 text-white"
                          )}
                        >
                          {item.badge}
                        </motion.span>
                      )}

                      {/* Active sparkle */}
                      {active && (
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-auto flex-shrink-0 relative z-10"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
            </div>

            {/* Animated gradient border */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
              animate={{
                background: isDark
                  ? [
                      "linear-gradient(0deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)",
                      "linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)",
                      "linear-gradient(180deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)",
                      "linear-gradient(270deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)",
                    ]
                  : [
                      "linear-gradient(0deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.2) 100%)",
                      "linear-gradient(90deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.2) 100%)",
                      "linear-gradient(180deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.2) 100%)",
                      "linear-gradient(270deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.2) 100%)",
                    ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
