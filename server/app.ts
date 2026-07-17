import express from "express";
import bookingRoutes from "./routes/booking.routes";
import testResultRoutes from "./routes/test-result.routes";
import aiRoutes from "./routes/ai.routes";
import organizationRoutes from "./routes/organization.routes";

const app = express();

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/booking", bookingRoutes);
app.use("/api/test-results", testResultRoutes);
app.use("/api/gemini", aiRoutes);
app.use("/api/organization", organizationRoutes);

export default app;