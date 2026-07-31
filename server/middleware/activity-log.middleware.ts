import { Request, Response, NextFunction } from "express";
import { logActivity } from "../services/activity-log.service";

export interface ActivityLogOptions {
  action: string;
  details?: string;
  dataAccessed?: string;
  patientId?: string;
  getPatientId?: (req: Request) => string | undefined;
}

export function activityLogger(options: ActivityLogOptions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    res.on("finish", () => {
      const user = (req as Request & { user?: { userId?: string; username?: string } }).user;

      void logActivity({
        userId: user?.userId,
        userName: user?.username || "anonymous",
        action: options.action,
        details: options.details,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        durationMs: Date.now() - start,
        dataAccessed: options.dataAccessed,
        patientId: options.getPatientId
          ? options.getPatientId(req)
          : (options.patientId ?? (req.params.patientId as string | undefined)),
      });
    });

    next();
  };
}

export const phiAccessLogger = activityLogger;
