import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clipboard, FileSearch, Calendar, Stethoscope, TestTube,
  Activity, Pill, Clock, AlertCircle, Check, ChevronDown,
  ChevronUp, User, MapPin, FileText, TestTube2, Image, MessageSquare
} from "lucide-react";
import { MedicalRecord } from "../../types/models/medical-record";
import { ClinicalTest, CLINICAL_TEST_TYPE_LABELS, ClinicalTestStatus } from "../../types/models/clinical-test";
import { TreatmentHistory, TREATMENT_TYPE_LABELS, TREATMENT_OUTCOME_LABELS } from "../../types/models/treatment-history";
import { Patient } from "../../types/models/patient";
import PatientLookupForm from "./PatientLookupForm";
import { MOCK_PATIENT_PORTAL_DATA } from "../../data/patient-portal-data";

interface PatientPortalSectionProps {
  onPatientLookup?: (request: { identifier: string; identifierType: string }) => Promise<Patient>;
  onFetchMedicalRecords?: (patientId: string) => Promise<MedicalRecord[]>;
  onFetchClinicalTests?: (patientId: string) => Promise<ClinicalTest[]>;
  onFetchTreatmentHistories?: (patientId: string) => Promise<TreatmentHistory[]>;
  onOpenRecordRequest?: () => void;
  onOpenFeedback?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

type PortalTab = "benh-su" | "cls" | "dieu-tri";

const TAB_CONFIG = {
  "benh-su": {
    key: "benh-su" as PortalTab,
    label: "Lịch sử bệnh sử",
    icon: Clipboard,
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600"
  },
  "cls": {
    key: "cls" as PortalTab,
    label: "CLS các lần khám",
    icon: TestTube2,
    color: "from-teal-500 to-cyan-600",
    bgLight: "bg-teal-50",
    textColor: "text-teal-600"
  },
  "dieu-tri": {
    key: "dieu-tri" as PortalTab,
    label: "Lịch sử điều trị",
    icon: Activity,
    color: "from-rose-500 to-pink-600",
    bgLight: "bg-rose-50",
    textColor: "text-rose-600"
  }
};

function StatusBadge({ status }: { status: ClinicalTestStatus }) {
  const config = {
    normal: { bg: "bg-green-100", text: "text-green-700", label: "Bình thường" },
    abnormal: { bg: "bg-amber-100", text: "text-amber-700", label: "Bất thường" },
    critical: { bg: "bg-red-100", text: "text-red-700", label: "Nghiêm trọng" }
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${bg} ${text}`}>
      {status === "normal" && <Check size={10} />}
      {status === "critical" && <AlertCircle size={10} />}
      {label}
    </span>
  );
}

function MedicalRecordCard({ record, index }: { record: MedicalRecord; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateFormatted = new Date(record.date).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-green-800/5 overflow-hidden hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                {record.clinic}
              </span>
              <span className="text-[10px] text-ink/50">{dateFormatted}</span>
            </div>
            <h4 className="font-display font-bold text-green-dark truncate pr-4">{record.diagnosis}</h4>
            <p className="text-xs text-ink/60 mt-1 line-clamp-1">{record.symptoms}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-ink/40 font-medium">BS. {record.doctorName}</span>
          {isExpanded ? <ChevronUp size={18} className="text-ink/40" /> : <ChevronDown size={18} className="text-ink/40" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-green-800/5 pt-4 space-y-4">
              <div>
                <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Triệu chứng</h5>
                <p className="text-sm text-ink/80">{record.symptoms}</p>
              </div>
              <div>
                <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Chẩn đoán</h5>
                <p className="text-sm text-ink/80 font-medium">{record.diagnosis}</p>
              </div>
              <div>
                <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Phác đồ điều trị</h5>
                <p className="text-sm text-ink/80">{record.treatment}</p>
              </div>
              {record.prescriptions && record.prescriptions.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Đơn thuốc</h5>
                  <div className="space-y-2">
                    {record.prescriptions.map((rx, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl">
                        <Pill size={16} className="text-brand-green mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-green-dark">{rx.medicine}</p>
                          <p className="text-xs text-ink/60">{rx.dosage} × {rx.frequency} - {rx.duration}</p>
                          {rx.notes && <p className="text-xs text-ink/50 italic mt-1">{rx.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {record.followUpDate && (
                <div className="flex items-center gap-2 p-3 bg-peach/10 rounded-xl border border-peach/20">
                  <Calendar size={16} className="text-peach shrink-0" />
                  <div>
                    <span className="text-xs text-ink/60">Tái khám: </span>
                    <span className="text-xs font-bold text-green-dark">
                      {new Date(record.followUpDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ClinicalTestCard({ test, index }: { test: ClinicalTest; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateFormatted = new Date(test.date).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-green-800/5 overflow-hidden hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
            <TestTube className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                {CLINICAL_TEST_TYPE_LABELS[test.testType]}
              </span>
              <StatusBadge status={test.status} />
              <span className="text-[10px] text-ink/50">{dateFormatted}</span>
            </div>
            <h4 className="font-display font-bold text-green-dark truncate pr-4">{test.testName}</h4>
            <p className="text-xs text-ink/60 mt-1 line-clamp-1">{test.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-ink/40 font-medium">{test.orderedBy}</span>
          {isExpanded ? <ChevronUp size={18} className="text-ink/40" /> : <ChevronDown size={18} className="text-ink/40" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-green-800/5 pt-4 space-y-4">
              <div>
                <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Kết quả</h5>
                <div className="p-4 bg-gray-50/50 rounded-xl">
                  <pre className="text-sm text-ink/80 whitespace-pre-wrap font-sans">{test.result}</pre>
                </div>
              </div>
              {test.indicators && test.indicators.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Chỉ số chi tiết</h5>
                  <div className="space-y-2">
                    {test.indicators.map((ind, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                        <div>
                          <span className="text-sm font-semibold text-green-dark">{ind.name}</span>
                          <span className="text-xs text-ink/50 ml-2">({ind.unit})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-bold ${
                            ind.status === "high" || ind.status === "low" ? "text-amber-600" : "text-green-600"
                          }`}>
                            {ind.value}
                          </span>
                          <span className="text-xs text-ink/40">Ref: {ind.normalRange}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {test.notes && (
                <div className="flex items-start gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                  <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-ink/80">{test.notes}</p>
                </div>
              )}
              {test.labCode && (
                <div className="flex items-center gap-2 text-xs text-ink/50">
                  <FileText size={12} />
                  <span>Mã xét nghiệm: {test.labCode}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TreatmentHistoryCard({ history, index }: { history: TreatmentHistory; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const admissionDate = new Date(history.admissionDate).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-green-800/5 overflow-hidden hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-rose-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {TREATMENT_TYPE_LABELS[history.type]}
              </span>
              {history.outcome && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  history.outcome === "khoi" ? "bg-green-100 text-green-700" :
                  history.outcome === "do" ? "bg-amber-100 text-amber-700" :
                  history.outcome === "tai-kham" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {TREATMENT_OUTCOME_LABELS[history.outcome]}
                </span>
              )}
              <span className="text-[10px] text-ink/50">{admissionDate}</span>
            </div>
            <h4 className="font-display font-bold text-green-dark truncate pr-4">{history.diagnosis}</h4>
            <p className="text-xs text-ink/60 mt-1 line-clamp-1">{history.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-ink/40 font-medium">BS. {history.doctorName}</span>
          {isExpanded ? <ChevronUp size={18} className="text-ink/40" /> : <ChevronDown size={18} className="text-ink/40" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-green-800/5 pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1">Ngày nhập viện</h5>
                  <p className="text-sm text-ink/80">{admissionDate}</p>
                </div>
                {history.dischargeDate && (
                  <div>
                    <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1">Ngày xuất viện</h5>
                    <p className="text-sm text-ink/80">
                      {new Date(history.dischargeDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </p>
                  </div>
                )}
                {(history.roomNumber || history.bedNumber) && (
                  <div>
                    <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1">Phòng/Giường</h5>
                    <p className="text-sm text-ink/80">
                      {history.roomNumber && `Phòng ${history.roomNumber}`}
                      {history.roomNumber && history.bedNumber && " - "}
                      {history.bedNumber && `Giường ${history.bedNumber}`}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Chẩn đoán</h5>
                <p className="text-sm text-ink/80 font-medium">{history.diagnosis}</p>
                {history.diagnosisCodes && history.diagnosisCodes.length > 0 && (
                  <p className="text-xs text-ink/50 mt-1">Mã: {history.diagnosisCodes.join(", ")}</p>
                )}
              </div>
              <div>
                <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Điều trị</h5>
                <p className="text-sm text-ink/80">{history.treatment}</p>
              </div>
              {history.surgicalProcedure && (
                <div>
                  <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Phẫu thuật/Thủ thuật</h5>
                  <p className="text-sm text-ink/80">{history.surgicalProcedure}</p>
                </div>
              )}
              {history.summary && (
                <div>
                  <h5 className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-2">Tóm tắt</h5>
                  <p className="text-sm text-ink/80">{history.summary}</p>
                </div>
              )}
              {history.notes && (
                <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <FileText size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-ink/80">{history.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PatientPortalSection({
  onPatientLookup,
  onFetchMedicalRecords,
  onFetchClinicalTests,
  onFetchTreatmentHistories,
  onOpenRecordRequest,
  onOpenFeedback,
  isLoading = false,
  error = null
}: PatientPortalSectionProps) {
  const [activeTab, setActiveTab] = useState<PortalTab>("benh-su");
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [clinicalTests, setClinicalTests] = useState<ClinicalTest[]>([]);
  const [treatmentHistories, setTreatmentHistories] = useState<TreatmentHistory[]>([]);
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const tabs = Object.values(TAB_CONFIG);
  const currentConfig = TAB_CONFIG[activeTab];

  const handlePatientLookup = async (patient: Patient) => {
    setCurrentPatient(patient);
    setIsDataLoading(true);
    setLookupError(null);

    try {
      if (onPatientLookup) {
        // API mode - fetch data for the patient
        const [records, tests, histories] = await Promise.all([
          onFetchMedicalRecords?.(patient.id) || [],
          onFetchClinicalTests?.(patient.id) || [],
          onFetchTreatmentHistories?.(patient.id) || []
        ]);
        setMedicalRecords(records);
        setClinicalTests(tests);
        setTreatmentHistories(histories);
      } else {
        // Mock mode - load from mock data (replace with real API calls in production)
        await new Promise(resolve => setTimeout(resolve, 800));
        setMedicalRecords(MOCK_PATIENT_PORTAL_DATA.medicalRecords);
        setClinicalTests(MOCK_PATIENT_PORTAL_DATA.clinicalTests);
        setTreatmentHistories(MOCK_PATIENT_PORTAL_DATA.treatmentHistories);
      }
    } catch (err) {
      setLookupError("Không thể tải dữ liệu bệnh nhân");
    } finally {
      setIsDataLoading(false);
    }
  };

  const getDataForTab = () => {
    switch (activeTab) {
      case "benh-su":
        return medicalRecords;
      case "cls":
        return clinicalTests;
      case "dieu-tri":
        return treatmentHistories;
      default:
        return [];
    }
  };

  const renderCard = (item: unknown, index: number) => {
    const key = (item as { id: string }).id;
    switch (activeTab) {
      case "benh-su":
        return <React.Fragment key={key}><MedicalRecordCard record={item as MedicalRecord} index={index} /></React.Fragment>;
      case "cls":
        return <React.Fragment key={key}><ClinicalTestCard test={item as ClinicalTest} index={index} /></React.Fragment>;
      case "dieu-tri":
        return <React.Fragment key={key}><TreatmentHistoryCard history={item as TreatmentHistory} index={index} /></React.Fragment>;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-red-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="font-display font-bold text-lg text-green-dark mb-2">Không thể tải dữ liệu</h3>
        <p className="text-sm text-ink/60">{error}</p>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <PatientLookupForm
        onPatientFound={handlePatientLookup}
        isLoading={isLookupLoading}
        error={lookupError}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PatientLookupForm
        onPatientFound={handlePatientLookup}
        isLoading={isLookupLoading}
        error={lookupError}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-dark/5 to-brand-green/10 rounded-2xl p-4 border border-green-800/10"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-brand-green" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-green-dark">{currentPatient.name}</h3>
              <span className="text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full font-bold">
                {currentPatient.visitCount} lượt khám
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 text-xs text-ink/70">
              <span>Mã KCB: <strong className="text-green-dark">{currentPatient.patientCode}</strong></span>
              <span>NS: <strong className="text-green-dark">{new Date(currentPatient.birthDate).getFullYear()}</strong></span>
              <span>GT: <strong className="text-green-dark">{currentPatient.gender === 'nam' ? 'Nam' : currentPatient.gender === 'nữ' ? 'Nữ' : 'Khác'}</strong></span>
              <span>ĐT: <strong className="text-green-dark">{currentPatient.phone}</strong></span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex overflow-x-auto scrollbar-hide gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : "bg-gray-100 text-ink/70 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className={`rounded-3xl bg-gradient-to-br ${currentConfig.bgLight}/30 p-6 border border-green-800/5`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 ${currentConfig.bgLight} rounded-xl flex items-center justify-center`}>
            <currentConfig.icon className={`w-5 h-5 ${currentConfig.textColor}`} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-green-dark">
              {currentConfig.label}
            </h3>
            <p className="text-xs text-ink/60">
              {getDataForTab().length} bản ghi
            </p>
          </div>
        </div>

        {isDataLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-green-800/5 p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : getDataForTab().length === 0 ? (
          <div className="bg-white rounded-2xl border border-green-800/5 p-8 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileSearch className="w-7 h-7 text-ink/30" />
            </div>
            <h4 className="font-display font-bold text-green-dark mb-2">Chưa có dữ liệu</h4>
            <p className="text-sm text-ink/60">Không có bản ghi nào trong mục này</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {getDataForTab().map((item, index) => renderCard(item, index))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {currentPatient && (
          <div className="flex gap-4 mt-6 pt-6 border-t border-green-800/5">
            <button
              onClick={onOpenRecordRequest}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-green-800/10 rounded-xl text-sm font-semibold text-green-dark hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FileSearch size={18} className="text-brand-green" />
              <span>Yêu cầu trích sao hồ sơ</span>
            </button>
            <button
              onClick={onOpenFeedback}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-green-800/10 rounded-xl text-sm font-semibold text-green-dark hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <MessageSquare size={18} className="text-brand-green" />
              <span>Góp ý chất lượng dịch vụ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}