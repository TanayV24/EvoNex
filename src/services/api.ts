// workos/src/services/api.ts - UNIFIED ENDPOINTS

import type { Room, Message } from "@/types/chat";

// Use backend URL from environment or default
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
* authHeaders()
* - Prefer the new key 'access_token' stored by AuthContext.
* - Fallback to legacy 'token' if present (keeps backwards compatibility).
* - Returns an object suitable for fetch headers: { Authorization: 'Bearer ...' }
*/
function authHeaders() {
  // primary key used by AuthContext
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` };
  }

  // fallback for older builds that used "token"
  const legacyToken = localStorage.getItem("token");
  if (legacyToken) {
    return { Authorization: `Bearer ${legacyToken}` };
  }

  return {};
}

/* ---------------------------
Chat API helpers
--------------------------- */

export const chatRest = {
  async getRooms(): Promise {
    const res = await fetch(`${API}/api/chat/rooms/`, {
      headers: { ...authHeaders() },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch rooms");
    }
    return res.json();
  },

  async getRoomMessages(roomId: string): Promise {
    const res = await fetch(`${API}/api/chat/rooms/${roomId}/messages/`, {
      headers: { ...authHeaders() },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }
    return res.json();
  },

  async postMessage(roomId: string, content: string) {
    const res = await fetch(`${API}/api/chat/rooms/${roomId}/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to post message");
    }
    return res.json();
  },
};

/* ---------------------------
Auth & user helpers - UNIFIED
--------------------------- */

export const authRest = {
  // ✅ UNIFIED LOGIN ENDPOINT FOR ALL USERS (Admin + HR/Manager/Employee)
  async login(email: string, password: string) {
    const res = await fetch(`${API}/api/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Login failed");
    }

    return res.json();
  },

  // ✅ UNIFIED CHANGE TEMP PASSWORD ENDPOINT FOR ALL USERS (Admin + HR/Manager/Employee)
  // Updates:
  // - CompanyAdmin.temp_password_set for admin users
  // - UsersAppUser.temp_password for HR/Manager/Employee users
  async changeTempPassword(oldPassword: string, newPassword: string) {
    const res = await fetch(`${API}/api/auth/change_temp_password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to change password");
    }

    return res.json();
  },

  // Company setup (Admin only)
  async companySetup(payload: any) {
    const res = await fetch(`${API}/api/auth/company_setup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Company setup failed");
    }

    return res.json();
  },

  // ✅ ADD HR MANAGER
  // Uses authHeaders() for token retrieval (access_token preferred)
  async addHR(name: string, email: string) {
    const res = await fetch(`${API}/api/auth/add_hr/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to add HR");
    }

    return res.json();
  },

  // Logout on backend if you have an endpoint
  async logout() {
    const res = await fetch(`${API}/api/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    });

    if (!res.ok) {
      // ignore errors in logout for now
      return;
    }

    return res.json();
  },
};

/* ---------------------------
Users helpers
--------------------------- */

export const usersRest = {
  // ✅ COMPLETE PROFILE ENDPOINT FOR HR/Manager/Employee
  // Path: POST /api/users/complete_profile/
  async completeProfile(data: {
    full_name?: string;
    phone?: string;
    designation?: string;
    department?: string;
    gender?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    marital_status?: string;
    bio?: string;
  }) {
    const res = await fetch(`${API}/api/users/complete_profile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to complete profile");
    }

    return res.json();
  },

  // List HR Users (company) - optional helper
  async listHR() {
    const res = await fetch(`${API}/api/users/company_hrs/`, {
      headers: { ...authHeaders() },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch HR users");
    }

    return res.json();
  },
};

export default {
  authRest,
  usersRest,
  chatRest,
};