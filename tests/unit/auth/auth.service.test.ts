import {
  adminLogin,
  verifyPassword,
  verifyAccessToken,
  verifyRefreshToken,
  hashNewPassword,
  refreshTokens,
  revokeSession,
} from "../../../server/services/auth.service";
import { getPrisma } from "../../../server/db/prisma";

jest.mock("../../../server/db/prisma", () => ({
  getPrisma: jest.fn(),
}));

const mockPrisma = getPrisma as jest.MockedFunction<typeof getPrisma>;

const mockAdmin = {
  id: "admin-1",
  username: "admin",
  role: "Super Admin",
  isActive: true,
  deletedAt: null,
  departmentId: null,
  passwordHash: "",
  department: null,
};

function setupAdmin(password: string) {
  return {
    ...mockAdmin,
    passwordHash: `${password.split(":")[0]}:${password.split(":")[1]}`,
  };
}

beforeEach(() => {
  mockPrisma.mockReturnValue({
    adminUser: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  } as any);
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
  process.env.NODE_ENV = "test";
});

describe("auth.service", () => {
  describe("hashNewPassword + verifyPassword", () => {
    it("mã hoá PBKDF2 và verify đúng mật khẩu", async () => {
      const hashed = await hashNewPassword("Admin@123");
      const [hash, salt] = hashed.split(":");
      expect(hash).toBeDefined();
      expect(salt).toBeDefined();
      expect(verifyPassword("Admin@123", hash, salt)).toBe(true);
    });

    it("verify sai mật khẩu trả false", async () => {
      const hashed = await hashNewPassword("Admin@123");
      const [hash, salt] = hashed.split(":");
      expect(verifyPassword("WrongPass1", hash, salt)).toBe(false);
    });
  });

  describe("adminLogin", () => {
    it("login thành công trả accessToken + refreshToken", async () => {
      const hashed = await hashNewPassword("Admin@123");
      (mockPrisma().adminUser.findUnique as jest.Mock).mockResolvedValue(setupAdmin(hashed));
      (mockPrisma().adminUser.update as jest.Mock).mockResolvedValue(mockAdmin);

      const result = await adminLogin("admin", "Admin@123");
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result).toHaveProperty("expiresIn");
    });

    it("login sai mật khẩu trả INVALID_CREDENTIALS", async () => {
      const hashed = await hashNewPassword("Admin@123");
      (mockPrisma().adminUser.findUnique as jest.Mock).mockResolvedValue(setupAdmin(hashed));

      const result = await adminLogin("admin", "WrongPass1");
      expect((result as any).code).toBe("INVALID_CREDENTIALS");
    });

    it("user không tồn tại trả INVALID_CREDENTIALS", async () => {
      (mockPrisma().adminUser.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await adminLogin("ghost", "Anything1");
      expect((result as any).code).toBe("INVALID_CREDENTIALS");
    });

    it("user bị disable trả ACCOUNT_DISABLED", async () => {
      const hashed = await hashNewPassword("Admin@123");
      (mockPrisma().adminUser.findUnique as jest.Mock).mockResolvedValue({
        ...setupAdmin(hashed),
        deletedAt: new Date(),
      });
      const result = await adminLogin("admin", "Admin@123");
      expect((result as any).code).toBe("ACCOUNT_DISABLED");
    });
  });

  describe("access token verify (JWT RFC 7519)", () => {
    it("verify token do chính hàm generate trả ra payload đúng", async () => {
      const loginResult = await (async () => {
        const hashed = await hashNewPassword("Admin@123");
        (mockPrisma().adminUser.findUnique as jest.Mock).mockResolvedValue(setupAdmin(hashed));
        (mockPrisma().adminUser.update as jest.Mock).mockResolvedValue({ id: "admin-1" });
        return adminLogin("admin", "Admin@123");
      })();
      const { accessToken } = loginResult as { accessToken: string };
      const payload = verifyAccessToken(accessToken);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe("admin-1");
      expect(payload?.role).toBe("Super Admin");
    });

    it("token giả mạo trả null", () => {
      expect(verifyAccessToken("not-a-jwt")).toBeNull();
    });

    it("token đã hết hạn trả null", () => {
      const exp = Math.floor(Date.now() / 1000) - 100;
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
      const body = Buffer.from(JSON.stringify({ userId: "x", username: "u", role: "r", sub: "x", iat: exp - 100, exp })).toString("base64url");
      const sig = require("crypto").createHmac("sha256", "test-jwt-secret").update(`${header}.${body}`).digest("base64url");
      expect(verifyAccessToken(`${header}.${body}.${sig}`)).toBeNull();
    });
  });

  describe("refreshTokens (rotation + reuse detection)", () => {
    it("refresh hợp lệ cấp access + refresh token mới", async () => {
      const hashed = await hashNewPassword("Admin@123");
      (mockPrisma().adminUser.findUnique as jest.Mock).mockResolvedValue(setupAdmin(hashed));
      (mockPrisma().adminUser.update as jest.Mock).mockResolvedValue({ id: "admin-1" });

      const login1 = await adminLogin("admin", "Admin@123");
      const { refreshToken: token1 } = login1 as { refreshToken: string };

      (mockPrisma().adminUser.findUnique as jest.Mock).mockResolvedValue({ ...mockAdmin });
      const rotated = await refreshTokens(token1);

      // token cũ đã bị revoke → dùng lại phải bị từ chối
      (mockPrisma().adminUser.findUnique as jest.Mock).mockResolvedValue({ ...mockAdmin });
      const replay = await refreshTokens(token1);
      expect((replay as any).code).toBe("INVALID_REFRESH_TOKEN");
      expect(rotated).toHaveProperty("accessToken");
      expect(rotated).toHaveProperty("refreshToken");
    });

    it("refresh token không hợp lệ trả INVALID_REFRESH_TOKEN", async () => {
      const result = await refreshTokens("fake-token");
      expect((result as any).code).toBe("INVALID_REFRESH_TOKEN");
    });
  });

  describe("revokeSession", () => {
    it("revoke không throw", async () => {
      expect(() => revokeSession("some-token")).not.toThrow();
    });
  });
});