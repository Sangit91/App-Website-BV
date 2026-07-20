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
  address?: string;
  email?: string;
  insuranceCode?: string;
  visitCount: number;
  registeredDate?: string;
}

interface MockMedicalRecord {
  id: string;
  patientId: string;
  date: string;
  clinic: string;
  clinicId: string;
  doctorName: string;
  doctorTitle?: string;
  symptoms: string;
  diagnosis: string;
  icd10_code?: string;
  treatment: string;
  prescriptions?: {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }[];
  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

interface MockClinicalTest {
  id: string;
  patientId: string;
  date: string;
  testType: string;
  loinc_code?: string;
  category: string;
  testName: string;
  result: string;
  status: "normal" | "abnormal" | "critical";
  indicators?: {
    name: string;
    loinc_code?: string;
    value: string;
    unit?: string;
    normalRange: string;
    status: "normal" | "high" | "low";
  }[];
  attachments?: string[];
  notes?: string;
  orderedBy: string;
  orderedByDoctorId?: string;
  performedAt?: string;
  labCode?: string;
  createdAt: string;
}

interface MockTreatmentHistory {
  id: string;
  patientId: string;
  admissionDate: string;
  dischargeDate?: string;
  type: "ngoai-tru" | "noi-tru";
  department: string;
  departmentId: string;
  diagnosis: string;
  diagnosisCodes: string[];
  treatment: string;
  outcome: "khoi" | "tai-kham" | "do" | "tu-vong";
  summary: string;
  doctorName: string;
  doctorTitle?: string;
  roomNumber?: string;
  bedNumber?: string;
  notes?: string;
  createdAt: string;
}

const MOCK_PATIENTS: MockPatient[] = [
  {
    id: "p-001",
    patientCode: "BN-2020-00001",
    name: "NGUYỄN VĂN MINH",
    cccd: "012345678901",
    phone: "0912345678",
    birthDate: "1965-03-15",
    gender: "nam",
    address: "123 Quang Trung, Xã Đại Lộc, TP Đà Nẵng",
    visitCount: 12,
    registeredDate: "2020-01-15"
  },
  {
    id: "p-002",
    patientCode: "BN-2021-00042",
    name: "TRẦN THỊ HOA",
    cccd: "023456789012",
    phone: "0987654321",
    birthDate: "1978-07-22",
    gender: "nữ",
    address: "456 Lê Lợi, Xã Đại Lộc, TP Đà Nẵng",
    visitCount: 8,
    registeredDate: "2021-03-20"
  },
  {
    id: "p-003",
    patientCode: "BN-2022-00156",
    name: "LÊ VĂN SƠN",
    cccd: "034567890123",
    phone: "0903123456",
    birthDate: "1990-11-08",
    gender: "nam",
    address: "789 Nguyễn Huệ, Xã Đại Lộc, TP Đà Nẵng",
    visitCount: 5,
    registeredDate: "2022-06-10"
  }
];

const MOCK_MEDICAL_RECORDS: MockMedicalRecord[] = [
  {
    id: "mr-001",
    patientId: "p-001",
    date: "2024-03-15",
    clinic: "Khoa Tim Mạch",
    clinicId: "tim-mach",
    doctorName: "BS. Nguyễn Văn Minh",
    doctorTitle: "BS CKII",
    symptoms: "Đau ngực trái, khó thở khi gắng sức",
    diagnosis: "Bệnh lý mạch vành, tăng huyết áp độ I",
    icd10_code: "I25.10",
    treatment: "Điều trị nội khoa, theo dõi và tái khám sau 2 tuần",
    prescriptions: [
      { medicine: "Aspirin 100mg", dosage: "1 viên", frequency: "1 lần/ngày", duration: "30 ngày" },
      { medicine: "Atorvastatin 20mg", dosage: "1 viên", frequency: "1 lần/ngày", duration: "30 ngày", notes: "Uống tối" },
      { medicine: "Amlodipin 5mg", dosage: "1 viên", frequency: "1 lần/ngày", duration: "30 ngày" }
    ],
    followUpDate: "2024-03-29",
    createdAt: "2024-03-15T08:30:00Z"
  },
  {
    id: "mr-002",
    patientId: "p-001",
    date: "2024-02-20",
    clinic: "Khoa Nội Tổng Hợp",
    clinicId: "noi-tong-hop",
    doctorName: "BS. Trần Thị Hương",
    doctorTitle: "BS CKII",
    symptoms: "Đau bụng thượng vị, ợ chua, buồn nôn",
    diagnosis: "Viêm dạ dày mạn tính, H. pylori dương tính",
    icd10_code: "K29.5",
    treatment: "Diệt H. pylori theo phác đồ 14 ngày, ăn uống điều độ",
    prescriptions: [
      { medicine: "Amoxicillin 500mg", dosage: "2 viên", frequency: "2 lần/ngày", duration: "14 ngày" },
      { medicine: "Clarithromycin 500mg", dosage: "1 viên", frequency: "2 lần/ngày", duration: "14 ngày" },
      { medicine: "Esomeprazole 40mg", dosage: "1 viên", frequency: "2 lần/ngày", duration: "14 ngày", notes: "Trước ăn 30 phút" }
    ],
    followUpDate: "2024-03-05",
    createdAt: "2024-02-20T09:15:00Z"
  },
  {
    id: "mr-003",
    patientId: "p-001",
    date: "2023-11-10",
    clinic: "Khoa Tai Mũi Họng",
    clinicId: "tai-mui-hong",
    doctorName: "BS. Lê Văn Sơn",
    doctorTitle: "BS CKI",
    symptoms: "Đau họng, nuốt đau, sốt nhẹ 3 ngày",
    diagnosis: "Viêm amidan cấp tính",
    icd10_code: "J03.90",
    treatment: "Kháng sinh, hạ sốt, súc họng nước muối",
    prescriptions: [
      { medicine: "Amoxicillin 500mg", dosage: "2 viên", frequency: "3 lần/ngày", duration: "7 ngày" },
      { medicine: "Paracetamol 500mg", dosage: "1 viên", frequency: "Khi sốt > 38.5°C", duration: "3 ngày" }
    ],
    followUpDate: "2023-11-17",
    createdAt: "2023-11-10T14:00:00Z"
  }
];

const MOCK_CLINICAL_TESTS: MockClinicalTest[] = [
  {
    id: "ct-001",
    patientId: "p-001",
    date: "2024-03-15",
    testType: "xet-nghiem-mau",
    loinc_code: "24331-1",
    category: "Sinh hóa",
    testName: "Lipid máu",
    result: "Cholesterol toàn phần: 220 mg/dL\nHDL: 42 mg/dL\nLDL: 148 mg/dL\nTG: 180 mg/dL",
    status: "abnormal",
    indicators: [
      { name: "Cholesterol", loinc_code: "2093-3", value: "220", unit: "mg/dL", normalRange: "< 200", status: "high" },
      { name: "HDL", loinc_code: "2085-9", value: "42", unit: "mg/dL", normalRange: "> 40", status: "normal" },
      { name: "LDL", loinc_code: "2089-1", value: "148", unit: "mg/dL", normalRange: "< 100", status: "high" },
      { name: "Triglyceride", loinc_code: "2571-8", value: "180", unit: "mg/dL", normalRange: "< 150", status: "high" }
    ],
    notes: "Có thể cần điều chỉnh chế độ ăn và tăng vận động",
    orderedBy: "BS. Nguyễn Văn Minh",
    orderedByDoctorId: "bs-001",
    performedAt: "2024-03-15T10:00:00Z",
    labCode: "LAB-2024-0315-001",
    createdAt: "2024-03-15T08:30:00Z"
  },
  {
    id: "ct-002",
    patientId: "p-001",
    date: "2024-03-15",
    testType: "x-quang",
    loinc_code: "24581-2",
    category: "Chẩn đoán hình ảnh",
    testName: "X-quang ngực thẳng",
    result: "Tim không giãn, không có dịch màng phổi\nPhổi: hình ảnh tăng tính quang hai đáy phổi",
    status: "normal",
    notes: "Hình ảnh phổi phù hợp với viêm phế quản nhẹ",
    orderedBy: "BS. Nguyễn Văn Minh",
    orderedByDoctorId: "bs-001",
    performedAt: "2024-03-15T11:30:00Z",
    labCode: "XQA-2024-0315-001",
    createdAt: "2024-03-15T08:35:00Z"
  },
  {
    id: "ct-003",
    patientId: "p-001",
    date: "2024-02-20",
    testType: "sieu-am",
    loinc_code: "44500-6",
    category: "Chẩn đoán hình ảnh",
    testName: "Siêu âm bụng tổng quát",
    result: "Gan: Không tổn thương thực thể\nMật: Không giãn, không sỏi\nTụy: Không tổn thương thực thể\nLách: Không tổn thương thực thể\nThận hai bên: Kích thước bình thường, không sỏi",
    status: "normal",
    notes: "Kết quả siêu âm bình thường, không phát hiện bất thường",
    orderedBy: "BS. Trần Thị Hương",
    orderedByDoctorId: "bs-002",
    performedAt: "2024-02-20T14:00:00Z",
    labCode: "SA-2024-0220-001",
    createdAt: "2024-02-20T09:20:00Z"
  },
  {
    id: "ct-004",
    patientId: "p-001",
    date: "2024-02-20",
    testType: "xet-nghiem-mau",
    loinc_code: "58413-6",
    category: "Huyết học",
    testName: "Công thức máu",
    result: "WBC: 7.2 G/L\nRBC: 4.8 T/L\nHb: 14.2 g/dL\nHct: 42%\nPlt: 245 G/L",
    status: "normal",
    indicators: [
      { name: "WBC", loinc_code: "6690-2", value: "7.2", unit: "G/L", normalRange: "4-10", status: "normal" },
      { name: "RBC", loinc_code: "789-8", value: "4.8", unit: "T/L", normalRange: "4.5-5.5", status: "normal" },
      { name: "Hemoglobin", loinc_code: "718-7", value: "14.2", unit: "g/dL", normalRange: "13-17", status: "normal" },
      { name: "Hematocrit", loinc_code: "4544-3", value: "42", unit: "%", normalRange: "40-50", status: "normal" },
      { name: "Plt", loinc_code: "777-3", value: "245", unit: "G/L", normalRange: "150-400", status: "normal" }
    ],
    orderedBy: "BS. Trần Thị Hương",
    orderedByDoctorId: "bs-002",
    performedAt: "2024-02-20T10:30:00Z",
    labCode: "LAB-2024-0220-002",
    createdAt: "2024-02-20T09:18:00Z"
  }
];

const MOCK_TREATMENT_HISTORIES: MockTreatmentHistory[] = [
  {
    id: "th-001",
    patientId: "p-001",
    admissionDate: "2024-03-15",
    dischargeDate: "2024-03-15",
    type: "ngoai-tru",
    department: "Khoa Tim Mạch",
    departmentId: "tim-mach",
    diagnosis: "Bệnh lý mạch vành, tăng huyết áp độ I",
    diagnosisCodes: ["I25.10", "I10"],
    treatment: "Điều trị ngoại trú, theo dõi huyết động",
    outcome: "tai-kham",
    summary: "Bệnh nhân được khám, làm xét nghiệm và chẩn đoán bệnh lý mạch vành. Được kê đơn thuốc và hẹn tái khám sau 2 tuần.",
    doctorName: "BS. Nguyễn Văn Minh",
    doctorTitle: "BS CKII",
    notes: "Cần theo dõi huyết áp tại nhà, hạn chế ăn mỡ",
    createdAt: "2024-03-15T12:00:00Z"
  },
  {
    id: "th-002",
    patientId: "p-001",
    admissionDate: "2024-02-18",
    dischargeDate: "2024-02-21",
    type: "noi-tru",
    department: "Khoa Nội Tổng Hợp",
    departmentId: "noi-tong-hop",
    diagnosis: "Viêm dạ dày mạn tính, H. pylori dương tính",
    diagnosisCodes: ["K29.5", "B98.0"],
    treatment: "Điều trị trong 3 ngày với phác đồ diệt H. pylori, theo dõi triệu chứng",
    outcome: "khoi",
    summary: "Bệnh nhân nhập viện điều trị viêm dạ dày có H. pylori. Đáp ứng điều trị tốt, hết đau bụng, ợ chua giảm. Được xuất viện với đơn thuốc hoàn tất phác đồ 14 ngày.",
    doctorName: "BS. Trần Thị Hương",
    doctorTitle: "BS CKII",
    roomNumber: "302",
    bedNumber: "5",
    notes: "Hướng dẫn chế độ ăn uống: ăn nhiều bữa nhỏ, tránh đồ cay nóng, cafe, rượu bia",
    createdAt: "2024-02-21T10:00:00Z"
  }
];

router.post("/lookup", (req, res) => {
  const { identifier, identifierType } = req.body;

  if (!identifier || !identifierType) {
    return res.status(400).json({ error: "Thiếu thông tin tra cứu" });
  }

  let patient: MockPatient | undefined;

  switch (identifierType) {
    case "patientCode":
      patient = MOCK_PATIENTS.find(p => p.patientCode === identifier);
      break;
    case "cccd":
      patient = MOCK_PATIENTS.find(p => p.cccd === identifier);
      break;
    case "phone":
      patient = MOCK_PATIENTS.find(p => p.phone === identifier);
      break;
    default:
      return res.status(400).json({ error: "Loại định danh không hợp lệ" });
  }

  if (!patient) {
    return res.status(404).json({ error: "Không tìm thấy bệnh nhân" });
  }

  res.json({ patient, message: "Tìm thấy bệnh nhân" });
});

router.get("/:patientId/medical-records", (req, res) => {
  const { patientId } = req.params;
  const { readToken, startDate, endDate, clinicId } = req.query;

  if (!readToken) {
    return res.status(401).json({ error: "Yêu cầu read_token" });
  }

  let records = MOCK_MEDICAL_RECORDS.filter(r => r.patientId === patientId);

  if (startDate) {
    records = records.filter(r => r.date >= (startDate as string));
  }
  if (endDate) {
    records = records.filter(r => r.date <= (endDate as string));
  }
  if (clinicId) {
    records = records.filter(r => r.clinicId === clinicId);
  }

  res.json({
    records,
    total: records.length,
    page: 1,
    pageSize: records.length
  });
});

router.get("/:patientId/clinical-tests", (req, res) => {
  const { patientId } = req.params;
  const { readToken, startDate, endDate, testType, status } = req.query;

  if (!readToken) {
    return res.status(401).json({ error: "Yêu cầu read_token" });
  }

  let tests = MOCK_CLINICAL_TESTS.filter(t => t.patientId === patientId);

  if (startDate) {
    tests = tests.filter(t => t.date >= (startDate as string));
  }
  if (endDate) {
    tests = tests.filter(t => t.date <= (endDate as string));
  }
  if (testType) {
    tests = tests.filter(t => t.testType === testType);
  }
  if (status) {
    tests = tests.filter(t => t.status === status);
  }

  res.json({
    tests,
    total: tests.length,
    page: 1,
    pageSize: tests.length
  });
});

router.get("/:patientId/treatment-histories", (req, res) => {
  const { patientId } = req.params;
  const { readToken } = req.query;

  if (!readToken) {
    return res.status(401).json({ error: "Yêu cầu read_token" });
  }

  const histories = MOCK_TREATMENT_HISTORIES.filter(h => h.patientId === patientId);

  res.json({
    histories,
    total: histories.length,
    page: 1,
    pageSize: histories.length
  });
});

export default router;