import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "Super Admin" | "Receptionist" | "Doctor" | "Department Admin";

export interface AdminUser {
  name: string;
  role: Role;
  department?: string;
}

interface AdminContextType {
  activeUser: AdminUser | null;
  login: (role: Role, name: string, department?: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUser] = useState<AdminUser | null>(null);

  const login = (role: Role, name: string, department?: string) => {
    setActiveUser({ name, role, department });
  };

  const logout = () => {
    setActiveUser(null);
  };

  return (
    <AdminContext.Provider value={{ activeUser, login, logout }}>
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