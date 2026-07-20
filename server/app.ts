import express from "express";
import bookingRoutes from "./routes/booking.routes";
import testResultRoutes from "./routes/test-result.routes";
import aiRoutes from "./routes/ai.routes";
import organizationRoutes from "./routes/organization.routes";
import patientRoutes from "./routes/patient.routes";
import authRoutes from "./routes/auth.routes";
import appointmentRoutes from "./routes/appointment.routes";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/booking", bookingRoutes);
app.use("/api/test-results", testResultRoutes);
app.use("/api/gemini", aiRoutes);
app.use("/api/organization", organizationRoutes);

app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/appointments", appointmentRoutes);

export default app;