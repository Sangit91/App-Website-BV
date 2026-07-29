import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../services/auth.service.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export type Role = "Super Admin" | "Department Admin" | "Receptionist" | "Doctor";

const ROLE_HIERARCHY: Record<Role, number> = {
  "Super Admin": 4,
  "Department Admin": 3,
  "Receptionist": 2,
  "Doctor": 1
};

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Không có token xác thực" });
    return;
  }

  const token = authHeader.substring(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({ success: false, error: "Token không hợp lệ hoặc đã hết hạn" });
    return;
  }

  req.user = payload;
  next();
}

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Chưa xác thực" });
      return;
    }

    const userRole = req.user.role as Role;
    const userLevel = ROLE_HIERARCHY[userRole] || 0;

    const hasAccess = allowedRoles.some(role => {
      const requiredLevel = ROLE_HIERARCHY[role] || 0;
      return userLevel >= requiredLevel;
    });

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        error: "Bạn không có quyền thực hiện thao tác này"
      });
      return;
    }

    next();
  };
}

export function authorizeExact(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Chưa xác thực" });
      return;
    }

    const userRole = req.user.role as Role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: "Bạn không có quyền thực hiện thao tác này"
      });
      return;
    }

    next();
  };
}

export function authorizeDepartmentAccess(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Chưa xác thực" });
    return;
  }

  const userRole = req.user.role as Role;

  if (userRole === "Super Admin") {
    next();
    return;
  }

  const requestedDepartmentId = req.params.departmentId || req.body.departmentId;

  if (!requestedDepartmentId) {
    next();
    return;
  }

  if (userRole === "Department Admin" && req.user.departmentId === requestedDepartmentId) {
    next();
    return;
  }

  if (userRole === "Receptionist" && req.user.departmentId === requestedDepartmentId) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    error: "Bạn không có quyền truy cập phòng ban này"
  });
}

export const requireSuperAdmin = authorizeExact("Super Admin");
export const requireAdmin = authorize("Super Admin", "Department Admin");
export const requireDoctor = authorize("Super Admin", "Department Admin", "Doctor");
export const requireReceptionist = authorize("Super Admin", "Department Admin", "Receptionist");