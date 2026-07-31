import crypto from "crypto";
import { getPrisma } from "../db/prisma";
import { Prisma } from "../generated/prisma/client";

export type ConsentScope = "treatment_required" | "notification_opt_in" | "research_opt_in";

export interface SubmitConsentInput {
  patient_id: string;
  policy_version: string;
  is_agreed: boolean;
  agreed_scopes: ConsentScope[];
  ip_address?: string;
  user_agent?: string;
}

export interface WithdrawConsentInput {
  patient_id: string;
  policy_version: string;
  reason?: string;
}

const CONSENT_SECRET = process.env.CONSENT_SECRET || "";

if (!CONSENT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("CONSENT_SECRET is required in production");
}

export const consentService = {
  async getActivePolicy() {
    return getPrisma().consentPolicy.findFirst({
      where: { isActive: true },
      orderBy: { effectiveDate: "desc" },
    });
  },

  async getPatientConsent(patientId: string, policyVersion?: string) {
    const policy = policyVersion
      ? await getPrisma().consentPolicy.findUnique({ where: { version: policyVersion } })
      : await this.getActivePolicy();

    if (!policy) return null;

    return getPrisma().patientConsent.findFirst({
      where: {
        patientId,
        policyVersion: policy.version,
        isAgreed: true,
        withdrawnAt: null,
      },
      orderBy: { agreedAt: "desc" },
    });
  },

  async hasValidConsent(patientId: string): Promise<boolean> {
    const consent = await this.getPatientConsent(patientId);
    return consent !== null;
  },

  async submit(input: SubmitConsentInput): Promise<{ success: boolean; consent?: unknown; error?: string }> {
    const policy = await getPrisma().consentPolicy.findUnique({
      where: { version: input.policy_version },
    });

    if (!policy) {
      return { success: false, error: "Phiên bản chính sách không tồn tại" };
    }

    if (!policy.isActive) {
      return { success: false, error: "Chính sách này không còn hiệu lực" };
    }

    if (input.is_agreed) {
      const existingConsent = await this.getPatientConsent(input.patient_id, input.policy_version);
      if (existingConsent) {
        return { success: false, error: "Bạn đã đồng ý chính sách này rồi" };
      }

      const agreedAt = new Date();
      const hashInput = `${input.patient_id}|${input.policy_version}|${JSON.stringify(input.agreed_scopes)}|${agreedAt.toISOString()}|${CONSENT_SECRET}`;
      const consentHash = crypto.createHash("sha256").update(hashInput).digest("hex");

      const consent = await getPrisma().patientConsent.create({
        data: {
          patientId: input.patient_id,
          policyVersion: input.policy_version,
          isAgreed: true,
          agreedScopes: input.agreed_scopes,
          agreedAt,
          ipAddress: input.ip_address || null,
          userAgent: input.user_agent || null,
          consentHash,
        },
      });

      return { success: true, consent };
    } else {
      const consent = await getPrisma().patientConsent.create({
        data: {
          patientId: input.patient_id,
          policyVersion: input.policy_version,
          isAgreed: false,
          agreedScopes: [],
          ipAddress: input.ip_address || null,
          userAgent: input.user_agent || null,
        },
      });

      return { success: true, consent };
    }
  },

  async withdraw(input: WithdrawConsentInput): Promise<{ success: boolean; error?: string }> {
    const consent = await this.getPatientConsent(input.patient_id, input.policy_version);

    if (!consent) {
      return { success: false, error: "Không tìm thấy bản ghi đồng ý" };
    }

    await getPrisma().patientConsent.update({
      where: { id: consent.id },
      data: {
        isAgreed: false,
        withdrawnAt: new Date(),
      },
    });

    return { success: true };
  },

  async createPolicy(data: {
    version: string;
    title: string;
    content_html: string;
    effective_date: Date;
    created_by?: string;
  }) {
    return getPrisma().$transaction(async (tx) => {
      await tx.consentPolicy.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      return tx.consentPolicy.create({
        data: {
          version: data.version,
          title: data.title,
          contentHtml: data.content_html,
          effectiveDate: data.effective_date,
          isActive: true,
          createdBy: data.created_by || null,
        },
      });
    });
  },

  async getAllPolicies() {
    return getPrisma().consentPolicy.findMany({
      orderBy: { effectiveDate: "desc" },
    });
  },
};