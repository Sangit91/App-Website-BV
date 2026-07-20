import { Router } from "express";

const router = Router();

interface MockPatient {
  id: string;
  patientCode: string;
  name: string;
  cccd: string;
  phone: string;
  birthDate: string;
  gender: "nam" | "nữ" | "khác";
}

interface MockAppointment {
  id: string;
  maKCB: string;
  patientCode: string;
  patientName: string;
  specialtyId: string;
  specialtyName: string;
  doctorId?: string;
  doctorName?: string;
  appointmentDate: string;
  appointmentTime: string;
  roomNumber: string;
  queueNumber: number;
  status: "cho-kham" | "dang-kham" | "da-kham" | "huy";
  symptoms?: string;
  createdAt: string;
}

const MOCK_PATIENTS: MockPatient[] = [
  { id: "p-001", patientCode: "BN-2020-00001", name: "NGUYỄN VĂN MINH", cccd: "012345678901", phone: "0912345678", birthDate: "1965-03-15", gender: "nam" },
  { id: "p-002", patientCode: "BN-2021-00042", name: "TRẦN THỊ HOA", cccd: "023456789012", phone: "0987654321", birthDate: "1978-07-22", gender: "nữ" },
  { id: "p-003", patientCode: "BN-2022-00156", name: "LÊ VĂN SƠN", cccd: "034567890123", phone: "0903123456", birthDate: "1990-11-08", gender: "nam" }
];

const SPECIALTIES = [
  { id: "tim-mach", name: "Khoa Tim Mạch" },
  { id: "noi-tong-hop", name: "Khoa Nội Tổng Hợp" },
  { id: "tai-mui-hong", name: "Khoa Tai Mũi Họng" },
  { id: "mat", name: "Khoa Mắt" },
  { id: "san-phu-khoa", name: "Khoa Sản Phụ Khoa" },
  { id: "noi-tiet", name: "Khoa Nội Tiết" },
  { id: "ho-hap", name: "Khoa Hô Hấp" },
  { id: "co-xuong-khop", name: "Khoa Cơ Xương Khớp" }
];

const MOCK_APPOINTMENTS: MockAppointment[] = [
  {
    id: "apt-001",
    maKCB: "KCB-2024-001234",
    patientCode: "BN-2020-00001",
    patientName: "NGUYỄN VĂN MINH",
    specialtyId: "tim-mach",
    specialtyName: "Khoa Tim Mạch",
    doctorName: "BS. Nguyễn Văn Minh",
    appointmentDate: "2024-03-15",
    appointmentTime: "08:00",
    roomNumber: "201",
    queueNumber: 5,
    status: "da-kham",
    symptoms: "Đau ngực trái, khó thở",
    createdAt: "2024-03-01T10:00:00Z"
  },
  {
    id: "apt-002",
    maKCB: "KCB-2024-001567",
    patientCode: "BN-2021-00042",
    patientName: "TRẦN THỊ HOA",
    specialtyId: "noi-tong-hop",
    specialtyName: "Khoa Nội Tổng Hợp",
    doctorName: "BS. Trần Thị Hương",
    appointmentDate: "2024-03-18",
    appointmentTime: "09:30",
    roomNumber: "305",
    queueNumber: 8,
    status: "cho-kham",
    createdAt: "2024-03-10T14:30:00Z"
  }
];

function generateMaBN(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `BN-${year}-${seq}`;
}

function generateMaKCB(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 100000).toString().padStart(6, "0");
  return `KCB-${year}-${seq}`;
}

function validatePhone(phone: string): boolean {
  return /^[0-9]{10,11}$/.test(phone);
}

function validateCCCD(cccd: string): boolean {
  return /^[0-9]{9}$|^[0-9]{12}$/.test(cccd);
}

router.post("/check-patient", (req, res) => {
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

  let patient = MOCK_PATIENTS.find(p => p.cccd === identity_card);

  if (patient) {
    res.json({
      exists: true,
      patientCode: patient.patientCode,
      message: "Bệnh nhân đã tồn tại trong hệ thống"
    });
  } else {
    const newPatientCode = generateMaBN();

    const newPatient: MockPatient = {
      id: `p-${Date.now()}`,
      patientCode: newPatientCode,
      name: full_name.toUpperCase(),
      cccd: identity_card,
      phone,
      birthDate: dob,
      gender: "khác"
    };

    MOCK_PATIENTS.push(newPatient);

    console.log(`[MOCK APPOINTMENT] New patient created: ${newPatientCode}`);

    res.json({
      exists: false,
      patientCode: newPatientCode,
      message: "Đã tạo mới bệnh nhân trong hệ thống"
    });
  }
});

router.post("/", (req, res) => {
  const { patientCode, specialtyId, doctorId, appointmentDate, appointmentTime, symptoms } = req.body;

  if (!patientCode || !specialtyId || !appointmentDate) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  const patient = MOCK_PATIENTS.find(p => p.patientCode === patientCode);

  if (!patient) {
    return res.status(404).json({ error: "Không tìm thấy bệnh nhân" });
  }

  const specialty = SPECIALTIES.find(s => s.id === specialtyId);

  if (!specialty) {
    return res.status(400).json({ error: "Chuyên khoa không hợp lệ" });
  }

  const existingAppointments = MOCK_APPOINTMENTS.filter(
    a => a.patientCode === patientCode && a.appointmentDate === appointmentDate
  );

  const queueNumber = existingAppointments.length + 1;
  const roomNumber = `${Math.floor(Math.random() * 4 + 2)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;

  const newAppointment: MockAppointment = {
    id: `apt-${Date.now()}`,
    maKCB: generateMaKCB(),
    patientCode: patient.patientCode,
    patientName: patient.name,
    specialtyId: specialty.id,
    specialtyName: specialty.name,
    doctorId,
    appointmentDate,
    appointmentTime: appointmentTime || "08:00",
    roomNumber,
    queueNumber,
    status: "cho-kham",
    symptoms,
    createdAt: new Date().toISOString()
  };

  MOCK_APPOINTMENTS.push(newAppointment);

  console.log(`[MOCK APPOINTMENT] New appointment: ${newAppointment.maKCB}`);

  res.status(201).json({
    success: true,
    appointment: newAppointment,
    message: "Đặt lịch khám thành công"
  });
});

router.get("/search", (req, res) => {
  const { patientCode, phone } = req.query;

  if (!patientCode && !phone) {
    return res.status(400).json({ error: "Cần cung cấp mã bệnh nhân hoặc số điện thoại" });
  }

  let appointments = MOCK_APPOINTMENTS;

  if (patientCode) {
    appointments = appointments.filter(a => a.patientCode === patientCode);
  }

  if (phone) {
    const patient = MOCK_PATIENTS.find(p => p.phone === phone);
    if (patient) {
      appointments = appointments.filter(a => a.patientCode === patient.patientCode);
    } else {
      appointments = [];
    }
  }

  appointments.sort((a, b) =>
    new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
  );

  res.json({ appointments });
});

router.get("/:maKCB", (req, res) => {
  const { maKCB } = req.params;

  const appointment = MOCK_APPOINTMENTS.find(a => a.maKCB === maKCB);

  if (!appointment) {
    return res.status(404).json({ error: "Không tìm thấy lịch hẹn" });
  }

  res.json({ appointment });
});

router.patch("/:maKCB/cancel", (req, res) => {
  const { maKCB } = req.params;

  const appointment = MOCK_APPOINTMENTS.find(a => a.maKCB === maKCB);

  if (!appointment) {
    return res.status(404).json({ error: "Không tìm thấy lịch hẹn" });
  }

  if (appointment.status === "da-kham") {
    return res.status(400).json({ error: "Lịch hẹn đã khám không thể hủy" });
  }

  appointment.status = "huy";

  console.log(`[MOCK APPOINTMENT] Cancelled: ${maKCB}`);

  res.json({
    success: true,
    appointment,
    message: "Đã hủy lịch hẹn thành công"
  });
});

export default router;