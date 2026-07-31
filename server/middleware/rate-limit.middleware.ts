import rateLimit from "express-rate-limit";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

// Mỗi form công khai 5 request/IP/15 phút (agents/06-server-api.md: "Mọi endpoint POST public bắt buộc rate limit 5 request/IP/15 phút").
// Mỗi endpoint dùng instance riêng → bucket riêng, form này không chặn form kia.
const makePublicFormLimiter = () =>
  rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Quá nhiều yêu cầu gửi biểu mẫu. Vui lòng thử lại sau 15 phút." },
  });

export const bookingFormLimiter = makePublicFormLimiter();
export const feedbackFormLimiter = makePublicFormLimiter();
export const recordRequestFormLimiter = makePublicFormLimiter();
export const consentFormLimiter = makePublicFormLimiter();
export const appointmentFormLimiter = makePublicFormLimiter();

// Tra cứu công khai (patient lookup, booking search, test result, appointment tra mã)
export const lookupLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Quá nhiều lượt tra cứu. Vui lòng thử lại sau 15 phút." },
});

// AI consultant — tốn chi phí API, giới hạn chặt hơn
export const aiLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Quá nhiều yêu cầu tư vấn AI. Vui lòng thử lại sau 15 phút." },
});

// Xác thực OTP — chống brute-force (chồng lên authLimiter cấp router)
export const otpVerifyLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Quá nhiều lần xác thực OTP. Vui lòng thử lại sau 15 phút." },
});
