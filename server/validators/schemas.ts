import { z } from "zod";

// ---------- Shared ----------
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ");

export const cccdSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{9}$|^[0-9]{12}$/, "Số CCCD không hợp lệ (9 hoặc 12 số)");

// Cho phép ""/null (form gửi trường rỗng) nhưng vẫn validate khi có giá trị.
export const optionalPhone = z.union([z.literal(""), phoneSchema]).nullable().optional();
export const optionalEmail = z.union([z.literal(""), z.email("Email không hợp lệ")]).nullable().optional();

// ---------- Booking ----------
export const bookingCreateSchema = z.object({
  patientName: z.string().trim().min(2, "Vui lòng nhập họ và tên người bệnh").max(200),
  phone: phoneSchema,
  specialty: z.string().trim().min(1, "Vui lòng chọn chuyên khoa").max(200),
  doctorName: z.string().trim().max(200).optional(),
  date: z.string().trim().min(1, "Vui lòng chọn ngày khám").max(50),
  timeSlot: z.string().trim().min(1, "Vui lòng chọn khung giờ khám").max(50),
  symptoms: z.string().trim().max(2000).optional(),
});

// ---------- Feedback ----------
export const feedbackServiceTypeSchema = z.enum(["kham-benh", "noi-tru", "cap-cuu", "ban-si", "other"]);
export const feedbackStatusSchema = z.enum(["moi", "dang_xu_ly", "da_xu_ly"]);

export const feedbackCreateSchema = z
  .object({
    patient_name: z.string().trim().min(2, "Vui lòng nhập họ và tên").max(200).optional(),
    patient_id: z.string().max(100).optional().nullable(),
    service_type: feedbackServiceTypeSchema,
    rating: z.coerce.number().int().min(1, "Vui lòng chọn đánh giá từ 1-5 sao").max(5, "Vui lòng chọn đánh giá từ 1-5 sao"),
    content: z.string().trim().min(1, "Vui lòng nhập nội dung góp ý").max(5000),
    contact_phone: optionalPhone,
    contact_email: optionalEmail,
  })
  .refine(
    (data) => !!data.patient_id || !!data.contact_phone || !!data.contact_email,
    { message: "Vui lòng cung cấp số điện thoại hoặc email để chúng tôi có thể phản hồi", path: ["contact_phone"] }
  );

export const feedbackUpdateSchema = z
  .object({
    status: feedbackStatusSchema.optional(),
    admin_response: z.string().max(5000).nullable().optional(),
    responded_by: z.string().max(200).nullable().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: "Không có dữ liệu cập nhật" });

// ---------- Record request ----------
export const recordRequestTypeSchema = z.enum([
  "ho-so-y-te",
  "phieu-xet-nghiem",
  "anh-pha",
  "don-thuoc",
  "giay-chung-nhan",
  "other",
]);
export const recordRequestStatusSchema = z.enum(["moi", "dang_xu_ly", "da_xu_ly", "da_huy"]);
export const deliveryMethodSchema = z.enum(["tai-kham", "nhan-tai-quay", "chuyen-bo-post"]);

export const recordRequestCreateSchema = z
  .object({
    patient_name: z.string().trim().min(2, "Vui lòng nhập họ và tên").max(200),
    patient_id: z.string().max(100).optional().nullable(),
    patient_code: z.string().max(100).optional().nullable(),
    request_type: recordRequestTypeSchema,
    date_from: z.string().trim().min(1, "Vui lòng chọn ngày bắt đầu").max(50),
    date_to: z.string().trim().min(1, "Vui lòng chọn ngày kết thúc").max(50),
    delivery_method: deliveryMethodSchema,
    reason: z.string().trim().max(2000).optional().nullable(),
    contact_phone: optionalPhone,
    contact_email: optionalEmail,
  })
  .superRefine((data, ctx) => {
    const from = new Date(data.date_from);
    const to = new Date(data.date_to);
    if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from > to) {
      ctx.addIssue({ code: "custom", message: "Ngày bắt đầu không được sau ngày kết thúc", path: ["date_from"] });
    }
  });

export const recordRequestUpdateSchema = z
  .object({
    status: recordRequestStatusSchema.optional(),
    admin_notes: z.string().max(2000).nullable().optional(),
    processed_by: z.string().max(200).nullable().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: "Không có dữ liệu cập nhật" });

// ---------- Admin: Specialty ----------
export const specialtyCreateSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên chuyên khoa").max(200),
  slug: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional().default(""),
  icon: z.string().trim().max(200).optional().default(""),
  detail: z.string().trim().max(10000).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

export const specialtyUpdateSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên chuyên khoa").max(200).optional(),
  slug: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  icon: z.string().trim().max(200).optional(),
  detail: z.string().trim().max(10000).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

// ---------- Admin: Doctor ----------
const shiftSchema = z.enum(["ca_sang", "ca_chieu", "nghi"]);

export const doctorCreateSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên bác sĩ").max(200),
  title: z.string().trim().max(200).optional(),
  specialtyId: z.string().max(100).optional().nullable(),
  phone: optionalPhone,
  image: z.string().trim().max(500).optional().nullable(),
  experienceYear: z.coerce.number().int().min(0).max(100).nullable().optional(),
  bio: z.string().trim().max(5000).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const doctorUpdateSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên bác sĩ").max(200).optional(),
  title: z.string().trim().max(200).optional(),
  specialtyId: z.string().max(100).optional().nullable(),
  phone: optionalPhone,
  image: z.string().trim().max(500).optional().nullable(),
  experienceYear: z.coerce.number().int().min(0).max(100).nullable().optional(),
  bio: z.string().trim().max(5000).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const doctorScheduleSchema = z.object({
  monday: shiftSchema,
  tuesday: shiftSchema,
  wednesday: shiftSchema,
  thursday: shiftSchema,
  friday: shiftSchema,
  saturday: shiftSchema,
  sunday: shiftSchema,
});

// ---------- Admin: News ----------
export const newsCreateSchema = z.object({
  title: z.string().trim().min(1, "Vui lòng nhập tiêu đề").max(300),
  slug: z.string().trim().max(300).optional(),
  summary: z.string().trim().max(1000).optional(),
  category: z.string().trim().max(100).optional(),
  content: z.string().trim().max(200000).optional(),
  image: z.string().trim().max(500).optional(),
  author: z.string().trim().max(200).optional(),
  isFeatured: z.boolean().optional(),
  isTender: z.boolean().optional(),
  tenderNumber: z.string().max(200).nullable().optional(),
  tenderStartDate: z.string().max(50).nullable().optional(),
  tenderEndDate: z.string().max(50).nullable().optional(),
  tenderMethod: z.string().max(200).nullable().optional(),
  tenderEstimate: z.string().max(200).nullable().optional(),
  tenderReceived: z.string().max(200).nullable().optional(),
  tenderDept: z.string().max(200).nullable().optional(),
  contactName: z.string().max(200).nullable().optional(),
  contactPhone: z.string().max(30).nullable().optional(),
  contactEmail: optionalEmail,
  downloadCount: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  publishedAt: z.string().max(50).nullable().optional(),
});

export const newsUpdateSchema = newsCreateSchema.partial();

// ---------- Admin: Service / Service group ----------
export const serviceGroupCreateSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên nhóm dịch vụ").max(200),
  slug: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  icon: z.string().trim().max(200).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

export const serviceCreateSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên dịch vụ").max(200),
  slug: z.string().trim().max(200).optional(),
  groupId: z.string().max(100).optional().nullable(),
  icon: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  price: z.coerce.number().int().min(0).max(999999999).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
  isActive: z.boolean().optional(),
});

export const serviceGroupUpdateSchema = serviceGroupCreateSchema.partial();
export const serviceUpdateSchema = serviceCreateSchema.partial();

// ---------- Admin: Organization department ----------
export const orgDeptCreateSchema = z.object({
  name: z.string().trim().min(1, "Tên khoa/phòng là bắt buộc").max(200),
  leader: z.string().trim().min(1, "Trưởng khoa là bắt buộc").max(200),
  phone: z.string().trim().max(30).optional(),
  staffCount: z.coerce.number().int().min(0).max(10000).optional(),
  description: z.string().trim().max(2000).optional(),
  details: z.string().max(20000).optional(),
});

export const orgDeptUpdateSchema = z.object({
  name: z.string().trim().min(1, "Tên khoa/phòng là bắt buộc").max(200).optional(),
  leader: z.string().trim().min(1, "Trưởng khoa là bắt buộc").max(200).optional(),
  phone: z.string().trim().max(30).optional(),
  staffCount: z.coerce.number().int().min(0).max(10000).optional(),
  description: z.string().trim().max(2000).optional(),
  details: z.string().max(20000).optional(),
});

// ---------- Public: Testimonial ----------
export const testimonialCreateSchema = z.object({
  patientId: z.string().max(100).optional().nullable(),
  patientName: z.string().trim().min(1, "Vui lòng nhập họ tên người bệnh").max(200),
  doctorId: z.string().max(100).optional().nullable(),
  serviceId: z.string().max(100).optional().nullable(),
  content: z.string().trim().min(1, "Vui lòng nhập nội dung cảm nhận").max(2000),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isApproved: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();

// ---------- Public: Patient lookup ----------
export const patientLookupSchema = z.object({
  identifier: z.string().trim().min(1, "Thiếu thông tin tra cứu").max(200),
  identifierType: z.enum(["patientCode", "cccd", "phone"], "Loại định danh không hợp lệ"),
});

// ---------- Public: AI consult ----------
export const aiConsultSchema = z.object({
  message: z.string().trim().min(1, "Vui lòng nhập nội dung câu hỏi").max(5000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model", "assistant"]),
        text: z.string().max(5000),
      })
    )
    .max(50)
    .optional(),
});

// ---------- Public: Appointment ----------
export const appointmentCheckPatientSchema = z.object({
  identity_card: cccdSchema,
  full_name: z.string().trim().min(2, "Vui lòng nhập họ và tên").max(200),
  dob: z.string().trim().min(1, "Vui lòng nhập ngày sinh").max(50),
  phone: phoneSchema,
});

export const appointmentCreateSchema = z.object({
  patientCode: z.string().trim().min(1, "Thiếu mã bệnh nhân").max(50),
  patientName: z.string().trim().max(200).optional().default(""),
  phone: optionalPhone,
  specialtyId: z.string().trim().min(1, "Thiếu chuyên khoa").max(100),
  specialtyName: z.string().trim().max(200).optional().default(""),
  doctorName: z.string().trim().max(200).optional(),
  appointmentDate: z.string().trim().min(1, "Thiếu ngày khám").max(50),
  appointmentTime: z.string().trim().max(50).optional().default("08:00"),
  symptoms: z.string().trim().max(2000).optional(),
});

export const appointmentCancelSchema = z.object({
  phone: z.string().trim().min(1, "Vui lòng cung cấp số điện thoại").max(20),
});

// ---------- Public: Consent ----------
export const consentSubmitSchema = z.object({
  patient_id: z.string().min(1, "Thiếu mã bệnh nhân").max(100),
  policy_version: z.string().min(1, "Thiếu phiên bản chính sách").max(50),
  is_agreed: z.boolean(),
  agreed_scopes: z.array(z.string().max(100)).max(100).optional().default([]),
});

export const consentWithdrawSchema = z.object({
  patient_id: z.string().min(1, "Thiếu mã bệnh nhân").max(100),
  policy_version: z.string().min(1, "Thiếu phiên bản chính sách").max(50),
  reason: z.string().max(2000).optional().nullable(),
});

// ---------- Auth ----------
export const otpSendSchema = z.object({
  patientCode: z.string().trim().min(1, "Thiếu mã bệnh nhân").max(50),
  phone: z.string().trim().min(1, "Thiếu số điện thoại").max(20),
});

export const otpVerifySchema = z.object({
  sessionId: z.string().min(1, "Thiếu sessionId").max(100),
  otpCode: z.string().min(1, "Thiếu mã OTP").max(10),
});
