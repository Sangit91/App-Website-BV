import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type Role = "Super Admin" | "Receptionist" | "Doctor" | "Department Admin";

export interface AdminUser {
  userId: string;
  name: string;
  username: string;
  role: Role;
  department?: string;
  departmentId?: string;
}

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
  departmentId?: string;
  exp?: number;
}

interface AdminContextType {
  activeUser: AdminUser | null;
  accessToken: string | null;
  login: (user: AdminUser, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const REFRESH_STORAGE_KEY = "admin_refresh_token";

function decodeJWT(token: string): TokenPayload | null {
  try {
    const [, body] = token.split(".");
    const payload = JSON.parse(atob(body));
    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      departmentId: payload.departmentId,
      exp: payload.exp
    };
  } catch {
    return null;
  }
}

function mapRoleToAdminUser(payload: TokenPayload, token: string): AdminUser {
  const roleMap: Record<string, Role> = {
    "Super Admin": "Super Admin",
    "Receptionist": "Receptionist",
    "Doctor": "Doctor",
    "Department Admin": "Department Admin"
  };

  return {
    userId: payload.userId,
    username: payload.username,
    name: payload.username,
    role: roleMap[payload.role] || "Receptionist",
    departmentId: payload.departmentId
  };
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUser] = useState<AdminUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedRefresh = localStorage.getItem(REFRESH_STORAGE_KEY);
    if (storedRefresh) setRefreshToken(storedRefresh);
    if (storedToken) {
      try {
        const payload = decodeJWT(storedToken);
        if (payload && payload.exp * 1000 > Date.now()) {
          const user = mapRoleToAdminUser(payload, storedToken);
          setActiveUser(user);
          setAccessToken(storedToken);
        } else {
          localStorage.removeItem("admin_token");
          localStorage.removeItem(REFRESH_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem(REFRESH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (user: AdminUser, token: string, refresh?: string) => {
    setActiveUser(user);
    setAccessToken(token);
    localStorage.setItem("admin_token", token);
    if (refresh) {
      setRefreshToken(refresh);
      localStorage.setItem(REFRESH_STORAGE_KEY, refresh);
    }
  };

  const logout = () => {
    setActiveUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("admin_token");
    localStorage.removeItem(REFRESH_STORAGE_KEY);
  };

  const refreshAccessToken = useCallback(async () => {
    const storedRefresh = refreshToken || localStorage.getItem(REFRESH_STORAGE_KEY);
    if (!storedRefresh) return null;

    try {
      const res = await fetch("/api/v1/auth/admin/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefresh }),
      });

      if (!res.ok) {
        logout();
        return null;
      }

      const data = await res.json();
      const newToken = data.accessToken;
      if (!newToken) {
        logout();
        return null;
      }

      const newRefresh = data.refreshToken;

      const payload = decodeJWT(newToken);
      if (payload) {
        const user = mapRoleToAdminUser(payload, newToken);
        setActiveUser(user);
      }

      setAccessToken(newToken);
      localStorage.setItem("admin_token", newToken);

      if (newRefresh) {
        setRefreshToken(newRefresh);
        localStorage.setItem(REFRESH_STORAGE_KEY, newRefresh);
      }

      return newToken;
    } catch {
      logout();
      return null;
    }
  }, [refreshToken]);

  return (
    <AdminContext.Provider value={{ activeUser, accessToken, login, logout, refreshAccessToken }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}

export function decodeAdminToken(token: string): AdminUser | null {
  const payload = decodeJWT(token);
  if (!payload) return null;
  return mapRoleToAdminUser(payload, token);
}
