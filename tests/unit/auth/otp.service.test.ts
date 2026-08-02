import { otpService, resolvePatientIdByPatientCode } from "../../../server/services/otp.service";
import { getPrisma } from "../../../server/db/prisma";

jest.mock("../../../server/db/prisma", () => ({
  getPrisma: jest.fn(),
}));

const mockPrisma = getPrisma as jest.MockedFunction<typeof getPrisma>;

beforeEach(() => {
  mockPrisma.mockReturnValue({
    patient: {
      findFirst: jest.fn(),
    },
  } as any);
});

describe("otp.service", () => {
  describe("createSession + verifyOtp", () => {
    it("tạo session trả OTP 6 số + expiresIn 300s", () => {
      const { sessionId, otpCode, expiresIn } = otpService.createSession("BN-001", "0912345678");
      expect(sessionId).toBeDefined();
      expect(otpCode).toMatch(/^\d{6}$/);
      expect(expiresIn).toBe(300);
    });

    it("verify đúng OTP trả ok:true + session verified", () => {
      const { sessionId, otpCode } = otpService.createSession("BN-001", "0912345678");
      const res = otpService.verifyOtp(sessionId, otpCode);
      expect(res.ok).toBe(true);
    });

    it("verify sai OTP trả ok:false status 401", () => {
      const { sessionId } = otpService.createSession("BN-001", "0912345678");
      const res = otpService.verifyOtp(sessionId, "000000");
      expect(res.ok).toBe(false);
      if (!res.ok) expect(res.status).toBe(401);
    });

    it("quá 5 lần verify sai → 429 + session bị xoá", () => {
      const { sessionId } = otpService.createSession("BN-001", "0912345678");
      let lastStatus = 0;
      for (let i = 0; i < 5; i++) {
        const res = otpService.verifyOtp(sessionId, "000000");
        if (!res.ok) lastStatus = res.status;
      }
      expect(lastStatus).toBe(429);
      // session đã bị xoá → verify tiếp trả 404
      const after = otpService.verifyOtp(sessionId, "000000");
      expect(after.ok).toBe(false);
      if (!after.ok) expect(after.status).toBe(404);
    });

    it("session không tồn tại trả 404", () => {
      const res = otpService.verifyOtp("sess_ghost", "123456");
      expect(res.ok).toBe(false);
      if (!res.ok) expect(res.status).toBe(404);
    });
  });

  describe("issueReadToken + verifyReadToken", () => {
    it("sau verify OTP đúng → issue readToken → verify đúng", () => {
      const { sessionId, otpCode } = otpService.createSession("BN-001", "0912345678");
      const ok = otpService.verifyOtp(sessionId, otpCode);
      expect(ok.ok).toBe(true);
      if (ok.ok) {
        const { readToken } = otpService.issueReadToken(ok.session);
        expect(readToken).toMatch(/^rt_/);
        const session = otpService.verifyReadToken(readToken);
        expect(session?.patientCode).toBe("BN-001");
      }
    });

    it("readToken chưa verify (OTP chưa đúng) trả null", () => {
      const { sessionId } = otpService.createSession("BN-001", "0912345678");
      const unverified = otpService.issueReadToken({
        sessionId,
        patientCode: "BN-001",
        phone: "0912345678",
        otpCode: "111111",
        expiresAt: Date.now() + 60000,
        verified: false,
        attempts: 0,
      });
      expect(otpService.verifyReadToken(unverified.readToken)).toBeNull();
    });

    it("readToken không tồn tại trả null", () => {
      expect(otpService.verifyReadToken("rt_unknown")).toBeNull();
    });
  });

  describe("resolvePatientIdByPatientCode", () => {
    it("trả id khi tìm thấy patient", async () => {
      (mockPrisma().patient.findFirst as jest.Mock).mockResolvedValue({ id: "p-1" });
      const id = await resolvePatientIdByPatientCode("BN-001");
      expect(id).toBe("p-1");
    });

    it("trả null khi không tìm thấy", async () => {
      (mockPrisma().patient.findFirst as jest.Mock).mockResolvedValue(null);
      const id = await resolvePatientIdByPatientCode("BN-GHOST");
      expect(id).toBeNull();
    });
  });
});