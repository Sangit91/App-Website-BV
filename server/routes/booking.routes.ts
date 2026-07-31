import { Router } from "express";
import { bookingService } from "../services/booking.service";
import { authenticate, requireAnyStaff } from "../middleware/auth.middleware";
import { bookingFormLimiter, lookupLimiter } from "../middleware/rate-limit.middleware";
import { validate } from "../validators/middleware";
import { bookingCreateSchema } from "../validators/schemas";
import { getPagination } from "../utils/pagination";

const router = Router();

router.get("/", authenticate, requireAnyStaff, async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query, 200, 200);
    const { data, total } = await bookingService.getAll(page, limit);
    res.setHeader("X-Total-Count", String(total));
    res.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.get("/search", lookupLimiter, async (req, res) => {
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

router.post("/", bookingFormLimiter, validate(bookingCreateSchema), async (req, res) => {
  try {
    const { patientName, phone, specialty, doctorName, date, timeSlot, symptoms } = req.body;
    const newBooking = await bookingService.create({ patientName, phone, specialty, doctorName, date, timeSlot, symptoms });
    res.status(201).json(newBooking);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

export default router;
