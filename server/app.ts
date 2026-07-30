import "dotenv/config";
import express from "express";
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
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

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

app.use("/api/booking", bookingRoutes);
app.use("/api/test-results", testResultRoutes);
app.use("/api/gemini", aiRoutes);
app.use("/api/organization", organizationRoutes);

app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/feedback-requests", feedbackRoutes);
app.use("/api/v1/record-requests", recordRequestsRoutes);
app.use("/api/v1/specialties", specialtyRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/consent", consentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;