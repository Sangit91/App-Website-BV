import { Router } from "express";
import { appointmentService } from "../services/appointment.service";
import { authenticate, requireAnyStaff } from "../middleware/auth.middleware";

const router = Router();

function validatePhone(phone: string): boolean {
  return /^[0-9]{10,11}$/.test(phone);
}

function validateCCCD(cccd: string): boolean {
  return /^[0-9]{9}$|^[0-9]{12}$/.test(cccd);
}

router.post("/check-patient", async (req, res) => {
  try {
    const { identity_card, full_name, dob, phone } = req.body;

    if (!identity_card || !full_name || !dob || !phone) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    if (!validateCCCD(identity_card)) {
      return res.status(400).json({ error: "Số CCCD không hợp lệ (9 hoặc 12 số)" });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: "Số điện thoại không hợp lệ" });
    }

    const { patient, isNew } = await appointmentService.getOrCreatePatient({
      cccd: identity_card,
      fullName: full_name,
      phone,
      birthDate: dob,
    });

    res.json({
      exists: !isNew,
      patientCode: patient.patientCode,
      message: isNew
        ? "Đã tạo mới bệnh nhân trong hệ thống"
        : "Bệnh nhân đã tồn tại trong hệ thống",
    });
  } catch (error) {
    console.error("[appointment] check-patient error:", error);
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { patientCode, patientName, phone, specialtyId, specialtyName, doctorName, appointmentDate, appointmentTime, symptoms } = req.body;

    if (!patientCode || !specialtyId || !appointmentDate) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const appointment = await appointmentService.createAppointment({
      patientName: patientName || "",
      patientCode,
      phone: phone || "",
      specialtyId,
      specialtyName: specialtyName || "",
      doctorName: doctorName || undefined,
      appointmentDate,
      appointmentTime: appointmentTime || "08:00",
      symptoms: symptoms || undefined,
    });

    res.status(201).json({
      success: true,
      appointment: {
        ...appointment,
        maKCB: appointment.bookingCode,
      },
      message: "Đặt lịch khám thành công",
    });
  } catch (error) {
    console.error("[appointment] create error:", error);
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.get("/search", authenticate, requireAnyStaff, async (req, res) => {
  try {
    const { patientCode, phone } = req.query;

    if (!patientCode && !phone) {
      return res.status(400).json({ error: "Cần cung cấp mã bệnh nhân hoặc số điện thoại" });
    }

    const appointments = await appointmentService.searchAppointments({
      patientCode: patientCode as string | undefined,
      phone: phone as string | undefined,
    });

    res.json({ appointments });
  } catch (error) {
    console.error("[appointment] search error:", error);
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.get("/:bookingCode", async (req, res) => {
  try {
    const phone = req.query.phone as string | undefined;
    const appointment = await appointmentService.findByBookingCode(req.params.bookingCode);

    if (!appointment) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn" });
    }

    if (!phone || appointment.phone !== phone) {
      return res.status(403).json({ error: "Số điện thoại không khớp với lịch hẹn" });
    }

    res.json({ appointment });
  } catch (error) {
    console.error("[appointment] get error:", error);
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.patch("/:bookingCode/cancel", async (req, res) => {
  try {
    const phone = (req.body?.phone || "") as string;

    const appointment = await appointmentService.findByBookingCode(req.params.bookingCode);
    if (!appointment) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn" });
    }

    if (!phone || appointment.phone !== phone) {
      return res.status(403).json({ error: "Số điện thoại không khớp với lịch hẹn" });
    }

    const result = await appointmentService.cancelAppointment(req.params.bookingCode);

    if (!result) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn" });
    }

    res.json({
      success: true,
      appointment: result,
      message: "Đã hủy lịch hẹn thành công",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    if (message === "Lịch hẹn đã khám không thể hủy") {
      return res.status(400).json({ error: message });
    }
    console.error("[appointment] cancel error:", error);
    res.status(500).json({ error: message });
  }
});

export default router;
