  // src/components/layout/Sidebar.tsx
// ✅ REDESIGNED PROFESSIONAL SIDEBAR WITH ENHANCED ANIMATIONS
// 
// ROLE VISIBILITY:
// EMPLOYEE: Dashboard + Work Mgmt + Collaboration (individual items)
// TEAM LEAD: Dashboard + Analytics + Work Mgmt + Collaboration (individual items)
// MANAGER: Dashboard + Analytics + Employees + Work Mgmt (grouped) + Collaboration (grouped)
// HR: Dashboard + Analytics + Employees + Work Mgmt (grouped, NO Tasks) + Collaboration (grouped) + Finance (grouped)
// ADMIN: All items + All 4 groups

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
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

// ============================================
// MENU CONFIGURATION - ALL ITEMS
// ============================================

const basicItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Users, label: "Employees", path: "/employees" },
];

const allGroupedMenus: MenuGroup[] = [
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

// ============================================
// ENHANCED ANIMATION VARIANTS
// ============================================

const sidebarVariants: Variants = {
  expanded: {
    width: 280,
    transition: { type: "spring", stiffness: 300, damping: 35 },
  },
  collapsed: {
    width: 100,
    transition: { type: "spring", stiffness: 300, damping: 35 },
  },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -24, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
  exit: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.25 } },
};

const subMenuVariants: Variants = {
  closed: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3 } },
  open: {
    opacity: 1,
    height: "auto",
    marginBottom: 12,
    transition: { duration: 0.4, staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const subItemVariants: Variants = {
  closed: { opacity: 0, x: -16, scale: 0.9 },
  open: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3 } },
};

const tooltipVariants: Variants = {
  hidden: { opacity: 0, x: -16, scale: 0.75 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: { opacity: 0, x: -16, scale: 0.75, transition: { duration: 0.15 } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
};

// ============================================
// MEMOIZED MENU ITEM COMPONENT
// ============================================

interface MenuItemProps {
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
  isDark: boolean;
  showTooltip?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const MenuItemComponent = memo(
  ({
    item,
    isActive,
    isCollapsed,
    isDark,
    showTooltip,
    onMouseEnter,
    onMouseLeave,
  }: MenuItemProps) => {
    const Icon = item.icon;

    return (
      <motion.div
        variants={menuItemVariants}
        className="relative group"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <NavLink
          to={item.path}
          className={({ isActive: navActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
              navActive
                ? isDark
                  ? "bg-gradient-to-r from-blue-500/25 to-purple-500/25 text-blue-300 shadow-lg shadow-blue-500/15"
                  : "bg-gradient-to-r from-blue-100/60 to-purple-100/60 text-blue-700 shadow-md shadow-blue-200/40"
                : isDark
                  ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50",
              isCollapsed && "justify-center px-3"
            )
          }
        >
          {isActive && (
            <motion.div
              layoutId="active-indicator"
              className={cn(
                "absolute inset-0 rounded-lg -z-10",
                isDark
                  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/15"
                  : "bg-gradient-to-r from-blue-200/35 to-purple-200/25"
              )}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}

          <motion.div 
            whileHover={{ scale: 1.15, rotate: 5 }} 
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
          </motion.div>

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <span className="text-sm font-medium truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "ml-auto text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0",
                    isDark
                      ? "bg-red-500/30 text-red-300"
                      : "bg-red-100/70 text-red-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </motion.div>
          )}
        </NavLink>

        {isCollapsed && showTooltip && (
          <motion.div
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "absolute left-full ml-4 px-3 py-2 rounded-lg whitespace-nowrap text-sm font-semibold z-50 pointer-events-none shadow-lg",
              isDark
                ? "bg-slate-800 text-white border border-slate-700"
                : "bg-white text-slate-900 border border-slate-200"
            )}
          >
            {item.label}
            {item.badge && (
              <span className="ml-2 text-xs">
                ({item.badge})
              </span>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }
);

MenuItemComponent.displayName = "MenuItemComponent";

// ============================================
// MEMOIZED GROUP HEADER COMPONENT
// ============================================

interface GroupHeaderProps {
  group: MenuGroup;
  isCollapsed: boolean;
  isGroupOpen: boolean;
  isDark: boolean;
  groupIndex: number;
  totalGroups: number;
  onToggle: () => void;
  showTooltip?: boolean;
}

const GroupHeaderComponent = memo(
  ({
    group,
    isCollapsed,
    isGroupOpen,
    isDark,
    groupIndex,
    totalGroups,
    onToggle,
    showTooltip,
  }: GroupHeaderProps) => {
    const GroupIcon = group.icon;

    return (
      <>
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: isCollapsed ? 1.08 : 1.02 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 mb-3 rounded-lg transition-all duration-300 group relative",
            isCollapsed
              ? "justify-center"
              : "text-xs font-bold uppercase tracking-wider",
            isDark
              ? "text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
              : "text-slate-600 hover:text-blue-600 hover:bg-blue-100/40"
          )}
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: isCollapsed ? 0 : 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {GroupIcon && <GroupIcon className="w-4 h-4 flex-shrink-0" />}
          </motion.div>

          {!isCollapsed && (
            <>
              <span className="flex-1 text-left truncate">{group.label}</span>
              <motion.div
                animate={{ rotate: isGroupOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </motion.div>
            </>
          )}
        </motion.button>

        {isCollapsed && groupIndex < totalGroups - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "my-2 h-px mx-3",
              isDark ? "bg-slate-700/40" : "bg-slate-200/60"
            )}
          />
        )}

        {isCollapsed && showTooltip && (
          <motion.div
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "absolute left-full ml-4 px-3 py-2 rounded-lg whitespace-nowrap text-sm font-semibold z-50 pointer-events-none shadow-lg",
              isDark
                ? "bg-slate-800 text-white border border-slate-700"
                : "bg-white text-slate-900 border border-slate-200"
            )}
          >
            {group.label}
          </motion.div>
        )}
      </>
    );
  }
);

GroupHeaderComponent.displayName = "GroupHeaderComponent";

// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================

export const Sidebar: React.FC = () => {
  const { isCollapsed, setIsCollapsed } = useSidebarCollapse();
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  useEffect(() => {
    const initialState = allGroupedMenus.reduce(
      (acc, group) => ({
        ...acc,
        [group.label]: group.defaultOpen ?? true,
      }),
      {}
    );
    setOpenGroups(initialState);
  }, []);

  useEffect(() => {
    setHoveredItem(null);
    setHoveredGroup(null);
  }, [location.pathname]);

  if (!user) return null;

  // ============================================
  // DETERMINE USER ROLE
  // ============================================

  const isEmployee = user.role === "employee";
  const isTeamLead = user.role === "team_lead";
  const isManager = user.role === "manager";
  const isHR = user.role === "hr";
  const isAdmin = user.role === "company_admin";

  // ============================================
  // CRITICAL ROLE-BASED VISIBILITY LOGIC
  // ============================================

  const visibleBasicItems = useMemo(() => {
    if (isEmployee) {
      return basicItems.slice(0, 1);
    }

    if (isTeamLead) {
      return basicItems.slice(0, 2);
    }

    return basicItems;
  }, [isEmployee, isTeamLead]);

  const flattenedIndividualItems = useMemo(() => {
    if (isEmployee || isTeamLead) {
      const workMgmtItems = allGroupedMenus[0].items;
      const collaborationItems = allGroupedMenus[1].items;
      return [...workMgmtItems, ...collaborationItems];
    }
    return [];
  }, [isEmployee, isTeamLead]);

  const visibleGroups = useMemo(() => {
    if (isEmployee || isTeamLead) {
      return [];
    }

    if (isManager) {
      return allGroupedMenus.slice(0, 2);
    }

    if (isHR) {
      // HR: Work Management (NO Tasks), Collaboration, Finance
      const workMgmtGroupForHR: MenuGroup = {
        ...allGroupedMenus[0],
        items: allGroupedMenus[0].items.slice(1), // Remove Tasks, keep Attendance + Leave
      };
      return [workMgmtGroupForHR, allGroupedMenus[1], allGroupedMenus[2]];
    }

    if (isAdmin) {
      return allGroupedMenus;
    }

    return [];
  }, [isEmployee, isTeamLead, isManager, isHR, isAdmin]);

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const isActive = useCallback(
    (path: string) => {
      return location.pathname === path || location.pathname.startsWith(path + "/");
    },
    [location.pathname]
  );

  const toggleGroup = useCallback((label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <style>{`
        .sidebar-nav::-webkit-scrollbar {
          display: none;
        }
        .sidebar-nav {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className={cn(
          "h-screen flex flex-col fixed left-0 top-0 z-40 border-r transition-colors duration-300",
          isDark
            ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-blue-500/15"
            : "bg-gradient-to-b from-slate-50 via-white to-slate-50 border-slate-200/60"
        )}
      >
        {/* LOGO SECTION */}
        <motion.div
          className={cn(
            "flex items-center gap-3 px-4 py-6 border-b flex-shrink-0",
            isDark ? "border-slate-800/40" : "border-slate-200/50"
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex-shrink-0"
          >
            W
          </motion.div>

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="min-w-0"
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                WorkOS
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Workspace Pro
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* NAVIGATION */}
        <motion.nav
          className="flex-1 overflow-y-auto px-3 py-6 space-y-4 sidebar-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          variants={containerVariants}
        >
          {/* BASIC ITEMS */}
          {visibleBasicItems.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className={isCollapsed ? "space-y-4" : "space-y-1"}
            >
              {visibleBasicItems.map((item) => (
                <MenuItemComponent
                  key={item.path}
                  item={item}
                  isActive={isActive(item.path)}
                  isCollapsed={isCollapsed}
                  isDark={isDark}
                  showTooltip={isCollapsed && hoveredItem === item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              ))}
            </motion.div>
          )}

          {/* DIVIDER */}
          {(visibleBasicItems.length > 0 || flattenedIndividualItems.length > 0) &&
            visibleGroups.length > 0 &&
            !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className={cn(
                  "my-2 h-px",
                  isDark ? "bg-slate-800/30" : "bg-slate-300/40"
                )}
              />
            )}

          {/* FLATTENED INDIVIDUAL ITEMS */}
          {flattenedIndividualItems.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className={isCollapsed ? "space-y-4" : "space-y-1"}
            >
              {flattenedIndividualItems.map((item) => (
                <MenuItemComponent
                  key={item.path}
                  item={item}
                  isActive={isActive(item.path)}
                  isCollapsed={isCollapsed}
                  isDark={isDark}
                  showTooltip={isCollapsed && hoveredItem === item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              ))}
            </motion.div>
          )}

          {/* GROUPED ITEMS */}
          {visibleGroups.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className={isCollapsed ? "space-y-4" : "space-y-1"}
            >
              {visibleGroups.map((group, groupIndex) => {
                const isGroupOpen = openGroups[group.label];

                return (
                  <motion.div
                    key={group.label}
                    onMouseEnter={() => isCollapsed && setHoveredGroup(group.label)}
                    onMouseLeave={() => setHoveredGroup(null)}
                    variants={{
                      hidden: { opacity: 0, y: -15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                  >
                    <GroupHeaderComponent
                      group={group}
                      isCollapsed={isCollapsed}
                      isGroupOpen={isGroupOpen}
                      isDark={isDark}
                      groupIndex={groupIndex}
                      totalGroups={visibleGroups.length}
                      onToggle={() => toggleGroup(group.label)}
                      showTooltip={isCollapsed && hoveredGroup === group.label}
                    />

                    {!isCollapsed && isGroupOpen && (
                      <motion.div
                        variants={subMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="space-y-1"
                      >
                        {group.items.map((item) => (
                          <motion.div 
                            key={item.path} 
                            variants={subItemVariants}
                            className="pl-2"
                          >
                            <MenuItemComponent
                              item={item}
                              isActive={isActive(item.path)}
                              isCollapsed={isCollapsed}
                              isDark={isDark}
                              showTooltip={hoveredItem === item.path}
                              onMouseEnter={() => setHoveredItem(item.path)}
                              onMouseLeave={() => setHoveredItem(null)}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.nav>

        {/* SETTINGS & LOGOUT */}
        <motion.div
          className={cn(
            "px-3 py-6 space-y-3 border-t flex-shrink-0",
            isDark ? "border-slate-800/40" : "border-slate-200/50"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <NavLink
            to="/settings"
            className={({ isActive: navActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative",
                navActive
                  ? isDark
                    ? "bg-gradient-to-r from-blue-500/25 to-purple-500/25 text-blue-300"
                    : "bg-gradient-to-r from-blue-100/60 to-purple-100/60 text-blue-700"
                  : isDark
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50",
                isCollapsed && "justify-center px-3"
              )
            }
            onMouseEnter={() => setHoveredItem("settings")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.92 }}>
              <Settings className="w-5 h-5 flex-shrink-0" />
            </motion.div>
            {!isCollapsed && <span className="text-sm font-medium truncate">Settings</span>}
            
            {isCollapsed && hoveredItem === "settings" && (
              <motion.div
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  "absolute left-full ml-4 px-3 py-2 rounded-lg whitespace-nowrap text-sm font-semibold z-50 pointer-events-none shadow-lg",
                  isDark
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "bg-white text-slate-900 border border-slate-200"
                )}
              >
                Settings
              </motion.div>
            )}
          </NavLink>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative",
              isDark
                ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                : "text-red-600 hover:bg-red-100/50 hover:text-red-700",
              isCollapsed && "justify-center px-3"
            )}
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div whileHover={{ scale: 1.15, rotate: -5 }} whileTap={{ scale: 0.92 }}>
              <LogOut className="w-5 h-5 flex-shrink-0" />
            </motion.div>
            {!isCollapsed && <span className="text-sm font-medium truncate">Logout</span>}
            
            {isCollapsed && hoveredItem === "logout" && (
              <motion.div
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  "absolute left-full ml-4 px-3 py-2 rounded-lg whitespace-nowrap text-sm font-semibold z-50 pointer-events-none shadow-lg",
                  isDark
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "bg-white text-slate-900 border border-slate-200"
                )}
              >
                Logout
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        {/* COLLAPSE BUTTON */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "w-full p-4 border-t flex items-center justify-center transition-all duration-300 relative z-20 group flex-shrink-0",
            isDark
              ? "border-slate-800/40 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
              : "border-slate-200/50 text-slate-600 hover:text-blue-600 hover:bg-blue-100/40"
          )}
        >
          <motion.div 
            animate={{ rotate: isCollapsed ? 0 : 180 }} 
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </motion.div>
        </motion.button>
      </motion.aside>
    </>
  );
};

export default Sidebar;