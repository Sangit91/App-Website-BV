import { getPrisma } from "../db/prisma";

export interface ActivityLogData {
  userId?: string;
  userName: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  durationMs?: number;
  dataAccessed?: string;
  patientId?: string;
}

export async function logActivity(data: ActivityLogData): Promise<void> {
  try {
    await getPrisma().activityLog.create({
      data: {
        userId: data.userId || null,
        userName: data.userName || "system",
        action: data.action,
        details: data.details || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        durationMs: data.durationMs || null,
        dataAccessed: data.dataAccessed || null,
        patientId: data.patientId || null,
      },
    });
  } catch (err) {
    console.error("[activity-log] failed to write log:", err);
  }
}
