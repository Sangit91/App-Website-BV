import {
  encryptCccd,
  decryptCccd,
  hashCccd,
  maskCccd,
} from "../../../server/services/cccd.service";

describe("cccd.service", () => {
  describe("encrypt/decrypt roundtrip (AES-256-GCM)", () => {
    it("encrypt → decrypt trả đúng giá trị gốc", () => {
      const plain = "001234567890";
      const encrypted = encryptCccd(plain);
      expect(encrypted).toContain(".");
      expect(encrypted).not.toBe(plain);
      expect(decryptCccd(encrypted)).toBe(plain);
    });

    it("mỗi lần encrypt ra payload khác nhau (IV ngẫu nhiên)", () => {
      const plain = "001234567890";
      expect(encryptCccd(plain)).not.toBe(encryptCccd(plain));
    });

    it("decrypt payload lỗi throw", () => {
      expect(() => decryptCccd("not-a-valid-payload")).toThrow();
    });
  });

  describe("hashCccd (SHA-256 deterministic)", () => {
    it("cùng CCCD → cùng hash, khác CCCD → khác hash", () => {
      expect(hashCccd("001234567890")).toBe(hashCccd("001234567890"));
      expect(hashCccd("001234567890")).not.toBe(hashCccd("009876543210"));
    });

    it("hash khác plaintext (không lộ)", () => {
      expect(hashCccd("001234567890")).not.toContain("001234567890");
    });
  });

  describe("maskCccd", () => {
    it("mask giữ 4 đầu + 2 cuối", () => {
      expect(maskCccd("001234567890")).toBe("0012****90");
    });

    it("chuỗi ngắn → trả ****", () => {
      expect(maskCccd("12")).toBe("****");
    });
  });
});