import express from "express";
import bookingRoutes from "./routes/booking.routes";
import testResultRoutes from "./routes/test-result.routes";
import aiRoutes from "./routes/ai.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/booking", bookingRoutes);
app.use("/api/test-results", testResultRoutes);
app.use("/api/gemini", aiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;