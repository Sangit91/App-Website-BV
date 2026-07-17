import { Router } from "express";
import { bookingService } from "../services/booking.service";

const router = Router();

// Get all bookings
router.get("/", (req, res) => {
  const allBookings = bookingService.getAll();
  res.json(allBookings);
});

// Search bookings by phone
router.get("/search", (req, res) => {
  const phone = req.query.phone as string;
  if (!phone) {
    return res.status(400).json({ error: "Vui lòng cung cấp số điện thoại tra cứu" });
  }
  const filtered = bookingService.search(phone);
  res.json(filtered);
});

// Create new booking
router.post("/", (req, res) => {
  try {
    const { patientName, phone, specialty, doctorName, date, timeSlot, symptoms } = req.body;
    
    const validationError = bookingService.validateInput({ patientName, phone, specialty, doctorName, date, timeSlot, symptoms });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newBooking = bookingService.create({ patientName, phone, specialty, doctorName, date, timeSlot, symptoms });
    res.status(201).json(newBooking);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

export default router;