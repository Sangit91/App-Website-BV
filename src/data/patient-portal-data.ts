import { MedicalRecord } from "../types/models/medical-record";
import { ClinicalTest, CLINICAL_TEST_TYPE_LABELS } from "../types/models/clinical-test";
import { TreatmentHistory, TREATMENT_TYPE_LABELS, TREATMENT_OUTCOME_LABELS } from "../types/models/treatment-history";

export interface PatientPortalData {
  medicalRecords: MedicalRecord[];
  clinicalTests: ClinicalTest[];
  treatmentHistories: TreatmentHistory[];
}

export const MOCK_PATIENT_PORTAL_DATA: PatientPortalData = {
  medicalRecords: [
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
      treatment: "Kháng sinh, hạ sốt, súc họng nước muối",
      prescriptions: [
        { medicine: "Amoxicillin 500mg", dosage: "2 viên", frequency: "3 lần/ngày", duration: "7 ngày" },
        { medicine: "Paracetamol 500mg", dosage: "1 viên", frequency: "Khi sốt > 38.5°C", duration: "3 ngày" }
      ],
      followUpDate: "2023-11-17",
      createdAt: "2023-11-10T14:00:00Z"
    }
  ],
  clinicalTests: [
    {
      id: "ct-001",
      patientId: "p-001",
      date: "2024-03-15",
      testType: "xet-nghiem-mau",
      category: "Sinh hóa",
      testName: "Lipid máu",
      result: "Cholesterol toàn phần: 220 mg/dL\nHDL: 42 mg/dL\nLDL: 148 mg/dL\nTG: 180 mg/dL",
      status: "abnormal",
      indicators: [
        { name: "Cholesterol", value: "220", unit: "mg/dL", normalRange: "< 200", status: "high" },
        { name: "HDL", value: "42", unit: "mg/dL", normalRange: "> 40", status: "normal" },
        { name: "LDL", value: "148", unit: "mg/dL", normalRange: "< 100", status: "high" },
        { name: "Triglyceride", value: "180", unit: "mg/dL", normalRange: "< 150", status: "high" }
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
      category: "Chẩn đoán hình ảnh",
      testName: "X-quang ngực thẳng",
      result: "Tim không giãn, không có dịch màng phổi\nPhổi: hình ảnh tăng tính quang hai đáy phổi\nC骨干: không tổn thương",
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
      category: "Chẩn đoán hình ảnh",
      testName: "Siêu âm bụng tổng quát",
      result: "Gan: Không tổn thương thực thể\nMật: Không giãn, không sỏi\nTụy: Không tổn thương thực thể\nLách: Không tổn thương thực thể\nThận hai bên: Kích thước bình thường, không sỏi, không dilation",
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
      category: "Huyết học",
      testName: "Công thức máu",
      result: "WBC: 7.2 G/L\nRBC: 4.8 T/L\nHb: 14.2 g/dL\nHct: 42%\nPlt: 245 G/L",
      status: "normal",
      indicators: [
        { name: "WBC", value: "7.2", unit: "G/L", normalRange: "4-10", status: "normal" },
        { name: "RBC", value: "4.8", unit: "T/L", normalRange: "4.5-5.5", status: "normal" },
        { name: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "13-17", status: "normal" },
        { name: "Hematocrit", value: "42", unit: "%", normalRange: "40-50", status: "normal" },
        { name: "Plt", value: "245", unit: "G/L", normalRange: "150-400", status: "normal" }
      ],
      orderedBy: "BS. Trần Thị Hương",
      orderedByDoctorId: "bs-002",
      performedAt: "2024-02-20T10:30:00Z",
      labCode: "LAB-2024-0220-002",
      createdAt: "2024-02-20T09:18:00Z"
    },
    {
      id: "ct-005",
      patientId: "p-001",
      date: "2023-11-10",
      testType: "xet-nghiem-mau",
      category: "Vi sinh",
      testName: "CRP (C-Reactive Protein)",
      result: "CRP: 28 mg/L",
      status: "abnormal",
      indicators: [
        { name: "CRP", value: "28", unit: "mg/L", normalRange: "< 6", status: "high" }
      ],
      notes: "CRP tăng phản ánh quá trình viêm đang hoạt động",
      orderedBy: "BS. Lê Văn Sơn",
      orderedByDoctorId: "bs-003",
      performedAt: "2023-11-10T15:00:00Z",
      labCode: "LAB-2023-1110-001",
      createdAt: "2023-11-10T14:05:00Z"
    }
  ],
  treatmentHistories: [
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
    },
    {
      id: "th-003",
      patientId: "p-001",
      admissionDate: "2023-06-15",
      dischargeDate: "2023-06-17",
      type: "noi-tru",
      department: "Khoa Hồi Sức Cấp Cứu",
      departmentId: "cap-cuu",
      diagnosis: "Cơn tăng huyết áp cấp, đau đầu dữ dội",
      diagnosisCodes: ["I10.x1"],
      treatment: "Hạ huyết áp cấp, theo dõi huyết động",
      outcome: "do",
      summary: "Bệnh nhân vào cấp cứu với cơn tăng huyết áp cấp (190/110 mmHg), đau đầu. Được xử trí hạ áp, theo dõi 2 ngày, ổn định xuất viện.",
      doctorName: "BS. Hoàng Minh Tuấn",
      doctorTitle: "BS CKII",
      roomNumber: "CC-01",
      bedNumber: "3",
      notes: "Cần tái khám định kỳ, uống thuốc đều đặn",
      createdAt: "2023-06-17T08:00:00Z"
    }
  ]
};