export const ROLES = {
  ADMIN: 'company_admin',
  HR: 'hr',
  MANAGER: 'manager',
  TEAM_LEAD: 'team_lead',
  EMPLOYEE: 'employee',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// ============================================
// PERMISSION DEFINITIONS
// ============================================

export const PERMISSIONS = {
  VIEW_EMPLOYEES_SIDEBAR: 'view_employees_sidebar',
  VIEW_ALL_EMPLOYEES: 'view_all_employees',
  VIEW_TEAM_EMPLOYEES: 'view_team_employees',
  ADD_EMPLOYEE: 'add_employee',
  EDIT_EMPLOYEE: 'edit_employee',
  DELETE_EMPLOYEE: 'delete_employee',
  ADD_DEPARTMENT: 'add_department',
  EDIT_DEPARTMENT: 'edit_department',
  DELETE_DEPARTMENT: 'delete_department',
  ADD_MANAGER: 'add_manager',
  EDIT_MANAGER: 'edit_manager',
  DELETE_MANAGER: 'delete_manager',
} as const;

// ============================================
// ROLE-PERMISSION MAPPING (FINAL)
// ============================================

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_EMPLOYEES_SIDEBAR,
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.ADD_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
    PERMISSIONS.ADD_DEPARTMENT,
    PERMISSIONS.EDIT_DEPARTMENT,
    PERMISSIONS.DELETE_DEPARTMENT,
    PERMISSIONS.ADD_MANAGER,
    PERMISSIONS.EDIT_MANAGER,
    PERMISSIONS.DELETE_MANAGER,
  ],

  [ROLES.HR]: [
    PERMISSIONS.VIEW_EMPLOYEES_SIDEBAR,
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.ADD_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_EMPLOYEES_SIDEBAR,
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.ADD_DEPARTMENT,
    PERMISSIONS.EDIT_DEPARTMENT,
  ],

  [ROLES.TEAM_LEAD]: [
    PERMISSIONS.VIEW_EMPLOYEES_SIDEBAR,
    PERMISSIONS.VIEW_TEAM_EMPLOYEES,
  ],

  [ROLES.EMPLOYEE]: [],
};

// ============================================
// SIDEBAR VISIBILITY
// ============================================

export const SIDEBAR_VISIBILITY: Record<UserRole, { showEmployeesItem: boolean }> = {
  [ROLES.ADMIN]: { showEmployeesItem: true },
  [ROLES.HR]: { showEmployeesItem: true },
  [ROLES.MANAGER]: { showEmployeesItem: true },
  [ROLES.TEAM_LEAD]: { showEmployeesItem: true },
  [ROLES.EMPLOYEE]: { showEmployeesItem: false },
};

// ============================================
// DASHBOARD ACCESSIBILITY
// ============================================

export const DASHBOARD_ACCESS: Record<UserRole, boolean> = {
  [ROLES.ADMIN]: true,
  [ROLES.HR]: true,
  [ROLES.MANAGER]: true,
  [ROLES.TEAM_LEAD]: false,
  [ROLES.EMPLOYEE]: false,
};

// ============================================
// PAGE LEVEL BUTTON VISIBILITY (Add Employee, Add Department, Add Manager)
// ============================================

export const PAGE_BUTTON_VISIBILITY: Record<
  UserRole,
  {
    showAddEmployee: boolean;
    showAddDepartment: boolean;
    showAddManager: boolean;
  }
> = {
  [ROLES.ADMIN]: {
    showAddEmployee: true,
    showAddDepartment: true,
    showAddManager: true,
  },
  [ROLES.HR]: {
    showAddEmployee: true,
    showAddDepartment: false,
    showAddManager: false,
  },
  [ROLES.MANAGER]: {
    showAddEmployee: false,
    showAddDepartment: true,
    showAddManager: false,
  },
  [ROLES.TEAM_LEAD]: {
    showAddEmployee: false,
    showAddDepartment: false,
    showAddManager: false,
  },
  [ROLES.EMPLOYEE]: {
    showAddEmployee: false,
    showAddDepartment: false,
    showAddManager: false,
  },
};

// ============================================
// CARD LEVEL BUTTON VISIBILITY (Edit/Delete on employee cards)
// ============================================

export const CARD_ACTION_VISIBILITY: Record<
  UserRole,
  {
    showEditButton: boolean;
    showDeleteButton: boolean;
  }
> = {
  [ROLES.ADMIN]: {
    showEditButton: true,
    showDeleteButton: true,
  },
  [ROLES.HR]: {
    showEditButton: true,
    showDeleteButton: true,
  },
  [ROLES.MANAGER]: {
    showEditButton: false,
    showDeleteButton: false,
  },
  [ROLES.TEAM_LEAD]: {
    showEditButton: false,
    showDeleteButton: false,
  },
  [ROLES.EMPLOYEE]: {
    showEditButton: false,
    showDeleteButton: false,
  },
};

// ============================================
// DATA VISIBILITY RULES
// ============================================

export const DATA_VISIBILITY: Record<
  UserRole,
  {
    canViewAllEmployees: boolean;
    canViewTeamOnly: boolean;
  }
> = {
  [ROLES.ADMIN]: {
    canViewAllEmployees: true,
    canViewTeamOnly: false,
  },
  [ROLES.HR]: {
    canViewAllEmployees: true,
    canViewTeamOnly: false,
  },
  [ROLES.MANAGER]: {
    canViewAllEmployees: true,
    canViewTeamOnly: false,
  },
  [ROLES.TEAM_LEAD]: {
    canViewAllEmployees: false,
    canViewTeamOnly: true,
  },
  [ROLES.EMPLOYEE]: {
    canViewAllEmployees: false,
    canViewTeamOnly: false,
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function hasPermission(
  userRole: UserRole | undefined,
  permission: string
): boolean {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function canAccessDashboard(userRole: UserRole | undefined): boolean {
  if (!userRole) return false;
  return DASHBOARD_ACCESS[userRole] ?? false;
}

// PAGE LEVEL - Show/Hide Add buttons
export function getPageButtonVisibility(userRole: UserRole | undefined) {
  if (!userRole) {
    return {
      showAddEmployee: false,
      showAddDepartment: false,
      showAddManager: false,
    };
  }
  return PAGE_BUTTON_VISIBILITY[userRole];
}

// CARD LEVEL - Show/Hide Edit/Delete buttons
export function getCardActionVisibility(userRole: UserRole | undefined) {
  if (!userRole) {
    return {
      showEditButton: false,
      showDeleteButton: false,
    };
  }
  return CARD_ACTION_VISIBILITY[userRole];
}

export function getSidebarVisibility(userRole: UserRole | undefined) {
  if (!userRole) {
    return { showEmployeesItem: false };
  }
  return SIDEBAR_VISIBILITY[userRole];
}

export function getDataVisibility(userRole: UserRole | undefined) {
  if (!userRole) {
    return {
      canViewAllEmployees: false,
      canViewTeamOnly: false,
    };
  }
  return DATA_VISIBILITY[userRole];
}

export function filterEmployeesByRole(
  employees: any[],
  userRole: UserRole | undefined,
  userDepartmentId?: string
): any[] {
  if (!userRole) return [];

  const dataVisibility = getDataVisibility(userRole);

  if (dataVisibility.canViewAllEmployees) {
    return employees;
  }

  if (dataVisibility.canViewTeamOnly && userDepartmentId) {
    return employees.filter(emp => emp.department_id === userDepartmentId);
  }

  return [];
}

export function getAllRoles(): UserRole[] {
  return Object.values(ROLES) as UserRole[];
}

export function getRoleDisplayName(role: UserRole | undefined): string {
  if (!role) return 'Unknown';
  return role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
}

// ============================================
// EXPORT TYPE FOR AUTH CONTEXT
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department_id?: string;
  company_id: string;
}