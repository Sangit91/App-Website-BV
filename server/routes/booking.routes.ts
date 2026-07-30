import { Router } from "express";
import { bookingService } from "../services/booking.service";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const allBookings = await bookingService.getAll();
    res.json(allBookings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const phone = req.query.phone as string;
    if (!phone) {
      return res.status(400).json({ error: "Vui lòng cung cấp số điện thoại tra cứu" });
    }
    const filtered = await bookingService.search(phone);
    res.json(filtered);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { patientName, phone, specialty, doctorName, date, timeSlot, symptoms } = req.body;

    const validationError = bookingService.validateInput({ patientName, phone, specialty, doctorName, date, timeSlot, symptoms });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newBooking = await bookingService.create({ patientName, phone, specialty, doctorName, date, timeSlot, symptoms });
    res.status(201).json(newBooking);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

export default router;
