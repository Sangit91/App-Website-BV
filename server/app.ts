import "dotenv/config";
import express from "express";
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

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.post("/api/debug-update", async (req, res) => {
  const { id, status } = req.body;
  try {
    const { getPrisma } = await import("./db/prisma");
    const r = await getPrisma().feedbackRequest.update({
      where: { id },
      data: { status },
    });
    res.json({ success: true, data: r });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

app.use("/api/booking", bookingRoutes);
app.use("/api/test-results", testResultRoutes);
app.use("/api/gemini", aiRoutes);
app.use("/api/organization", organizationRoutes);

app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/feedback-requests", feedbackRoutes);
app.use("/api/v1/record-requests", recordRequestsRoutes);
app.use("/api/v1/specialties", specialtyRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/consent", consentRoutes);

export default app;