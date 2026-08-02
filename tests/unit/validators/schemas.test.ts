import {
  bookingCreateSchema,
  feedbackCreateSchema,
  recordRequestCreateSchema,
  patientLookupSchema,
  appointmentCreateSchema,
  appointmentCheckPatientSchema,
} from "../../../server/validators/schemas";

describe("validators/schemas", () => {
  describe("bookingCreateSchema", () => {
    it("valid booking passes", () => {
      const r = bookingCreateSchema.safeParse({
        patientName: "Nguyễn Văn A",
        phone: "0912345678",
        specialty: "Tim mạch",
        date: "2026-08-03",
        timeSlot: "08:00-09:00",
      });
      expect(r.success).toBe(true);
    });

    it("phone sai định dạng → fail với message tiếng Việt", () => {
      const r = bookingCreateSchema.safeParse({
        patientName: "Nguyễn Văn A",
        phone: "abc",
        specialty: "Tim mạch",
        date: "2026-08-03",
        timeSlot: "08:00-09:00",
      });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(JSON.stringify(r.error.issues)).toContain("Số điện thoại không hợp lệ");
      }
    });

    it("thiếu patientName → fail", () => {
      const r = bookingCreateSchema.safeParse({
        phone: "0912345678",
        specialty: "Tim mạch",
        date: "2026-08-03",
        timeSlot: "08:00",
      });
      expect(r.success).toBe(false);
    });
  });

  describe("feedbackCreateSchema", () => {
    it("có patient_id hợp lệ (không cần contact)", () => {
      const r = feedbackCreateSchema.safeParse({
        service_type: "kham-benh",
        rating: 5,
        content: "Rất hài lòng",
        patient_id: "BN-001",
      });
      expect(r.success).toBe(true);
    });

    it("ẩn danh không có kênh liên hệ → fail", () => {
      const r = feedbackCreateSchema.safeParse({
        service_type: "kham-benh",
        rating: 3,
        content: "Góp ý",
      });
      expect(r.success).toBe(false);
    });

    it("ẩn danh có contact_phone → pass", () => {
      const r = feedbackCreateSchema.safeParse({
        service_type: "kham-benh",
        rating: 4,
        content: "Góp ý",
        contact_phone: "0912345678",
      });
      expect(r.success).toBe(true);
    });

    it("rating ngoài 1-5 → fail", () => {
      const r = feedbackCreateSchema.safeParse({
        service_type: "kham-benh",
        rating: 99,
        content: "Góp ý",
        contact_phone: "0912345678",
      });
      expect(r.success).toBe(false);
    });
  });

  describe("recordRequestCreateSchema", () => {
    it("date_from sau date_to → fail", () => {
      const r = recordRequestCreateSchema.safeParse({
        patient_name: "Nguyễn Văn A",
        request_type: "ho-so-y-te",
        date_from: "2026-08-10",
        date_to: "2026-08-01",
        delivery_method: "tai-kham",
        contact_phone: "0912345678",
      });
      expect(r.success).toBe(false);
      if (!r.success) {
        expect(JSON.stringify(r.error.issues)).toContain("Ngày bắt đầu không được sau ngày kết thúc");
      }
    });

    it("date hợp lệ → pass", () => {
      const r = recordRequestCreateSchema.safeParse({
        patient_name: "Nguyễn Văn A",
        request_type: "ho-so-y-te",
        date_from: "2026-08-01",
        date_to: "2026-08-10",
        delivery_method: "tai-kham",
        contact_phone: "0912345678",
      });
      expect(r.success).toBe(true);
    });

    it("request_type không hợp lệ → fail", () => {
      const r = recordRequestCreateSchema.safeParse({
        patient_name: "Nguyễn Văn A",
        request_type: "khong-ton-tai",
        date_from: "2026-08-01",
        date_to: "2026-08-10",
        delivery_method: "tai-kham",
        contact_phone: "0912345678",
      });
      expect(r.success).toBe(false);
    });
  });

  describe("patientLookupSchema", () => {
    it("identifier rỗng → fail", () => {
      expect(patientLookupSchema.safeParse({ identifier: "", identifierType: "cccd" }).success).toBe(false);
    });
    it("identifierType không hợp lệ → fail", () => {
      expect(patientLookupSchema.safeParse({ identifier: "abc", identifierType: "xx" }).success).toBe(false);
    });
    it("hợp lệ → pass", () => {
      expect(patientLookupSchema.safeParse({ identifier: "001234567890", identifierType: "cccd" }).success).toBe(true);
    });
  });

  describe("appointmentCheckPatientSchema", () => {
    it("CCCD không đúng 9/12 số → fail", () => {
      const r = appointmentCheckPatientSchema.safeParse({
        identity_card: "12345",
        full_name: "Nguyễn Văn A",
        dob: "1990-01-01",
        phone: "0912345678",
      });
      expect(r.success).toBe(false);
    });
    it("CCCD 12 số → pass", () => {
      const r = appointmentCheckPatientSchema.safeParse({
        identity_card: "001234567890",
        full_name: "Nguyễn Văn A",
        dob: "1990-01-01",
        phone: "0912345678",
      });
      expect(r.success).toBe(true);
    });
  });

  describe("appointmentCreateSchema", () => {
    it("thiếu specialtyId → fail", () => {
      const r = appointmentCreateSchema.safeParse({
        patientCode: "BN-001",
        appointmentDate: "2026-08-03",
      });
      expect(r.success).toBe(false);
    });
    it("hợp lệ → pass", () => {
      const r = appointmentCreateSchema.safeParse({
        patientCode: "BN-001",
        specialtyId: "spec-1",
        appointmentDate: "2026-08-03",
      });
      expect(r.success).toBe(true);
    });
  });
});