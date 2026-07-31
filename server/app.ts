import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import bookingRoutes from "./routes/booking.routes";
import testResultRoutes from "./routes/test-result.routes";
import aiRoutes from "./routes/ai.routes";
import organizationRoutes from "./routes/organization.routes";
import patientRoutes from "./routes/patient.routes";
import authRoutes from "./routes/auth.routes";
import appointmentRoutes from "./routes/appointment.routes";
import feedbackRoutes from "./routes/feedback.routes";
import recordRequestsRoutes from "./routes/record-requests.routes";
import specialtyRoutes from "./routes/specialty.routes";
import doctorRoutes from "./routes/doctor.routes";
import newsRoutes from "./routes/news.routes";
import consentRoutes from "./routes/consent.routes";
const app = express();

// Behind nginx reverse proxy — trust proxy so req.ip + rate limiter per-IP work correctly.
app.set("trust proxy", 1);

app.use(cookieParser());

const IS_PROD = process.env.NODE_ENV === "production";

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: IS_PROD ? ["'self'"] : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      connectSrc: IS_PROD ? ["'self'", "ws:", "wss:"] : ["'self'", "ws:", "wss:", "ws://localhost:3000", "ws://host:3000"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
    },
  },
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: "Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau 15 phút." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/test-results", testResultRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/organization", organizationRoutes);

app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/feedback-requests", feedbackRoutes);
app.use("/api/v1/record-requests", recordRequestsRoutes);
app.use("/api/v1/specialties", specialtyRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/consent", consentRoutes);

export default app;