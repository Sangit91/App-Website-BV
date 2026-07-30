import { Router } from "express";
import { appointmentService } from "../services/appointment.service";

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
  } catch (error: any) {
    console.error("[appointment] check-patient error:", error);
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
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
  } catch (error: any) {
    console.error("[appointment] create error:", error);
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

router.get("/search", async (req, res) => {
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
  } catch (error: any) {
    console.error("[appointment] search error:", error);
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

router.get("/:bookingCode", async (req, res) => {
  try {
    const appointment = await appointmentService.findByBookingCode(req.params.bookingCode);

    if (!appointment) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn" });
    }

    res.json({ appointment });
  } catch (error: any) {
    console.error("[appointment] get error:", error);
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

router.patch("/:bookingCode/cancel", async (req, res) => {
  try {
    const result = await appointmentService.cancelAppointment(req.params.bookingCode);

    if (!result) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn" });
    }

    res.json({
      success: true,
      appointment: result,
      message: "Đã hủy lịch hẹn thành công",
    });
  } catch (error: any) {
    if (error.message === "Lịch hẹn đã khám không thể hủy") {
      return res.status(400).json({ error: error.message });
    }
    console.error("[appointment] cancel error:", error);
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

export default router;
