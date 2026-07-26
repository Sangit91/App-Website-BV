import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

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

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (storedToken) {
      try {
        const payload = decodeJWT(storedToken);
        if (payload && payload.exp * 1000 > Date.now()) {
          const user = mapRoleToAdminUser(payload, storedToken);
          setActiveUser(user);
          setAccessToken(storedToken);
        } else {
          localStorage.removeItem("admin_token");
        }
      } catch {
        localStorage.removeItem("admin_token");
      }
    }
  }, []);

  const login = (user: AdminUser, token: string) => {
    setActiveUser(user);
    setAccessToken(token);
    localStorage.setItem("admin_token", token);
  };

  const logout = () => {
    setActiveUser(null);
    setAccessToken(null);
    localStorage.removeItem("admin_token");
  };

  return (
    <AdminContext.Provider value={{ activeUser, accessToken, login, logout }}>
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