import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Search, User, Calendar, Phone, MapPin, Shield, AlertCircle, Check } from "lucide-react";
import { Patient, PatientLookupRequest } from "../../types/models/patient";

interface PatientLookupFormProps {
  onPatientFound: (patient: Patient) => void;
  onLoadingChange?: (loading: boolean) => void;
  isLoading?: boolean;
  error?: string | null;
}

type LookupType = 'patientCode' | 'cccd' | 'phone';

const LOOKUP_TYPES: { value: LookupType; label: string; placeholder: string }[] = [
  { value: 'patientCode', label: 'Mã KCB', placeholder: 'VD: BN-2024-001234' },
  { value: 'cccd', label: 'CCCD/CMND', placeholder: 'VD: 012345678901' },
  { value: 'phone', label: 'Số điện thoại', placeholder: 'VD: 0912345678' }
];

function PatientInfoCard({ patient }: { patient: Patient }) {
  const genderLabel = patient.gender === 'nam' ? 'Nam' : patient.gender === 'nữ' ? 'Nữ' : 'Khác';
  const birthYear = new Date(patient.birthDate).getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-dark/5 to-brand-green/10 rounded-2xl p-5 border border-green-800/10"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-brand-green/20 rounded-2xl flex items-center justify-center shrink-0">
          <User className="w-7 h-7 text-brand-green" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg text-green-dark">{patient.name}</h3>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="flex items-center gap-2 text-sm text-ink/70">
              <Calendar size={14} className="text-brand-green shrink-0" />
              <span>{birthYear} • {genderLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink/70">
              <Phone size={14} className="text-brand-green shrink-0" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink/70">
              <Shield size={14} className="text-brand-green shrink-0" />
              <span className="truncate">{patient.patientCode}</span>
            </div>
            {patient.address && (
              <div className="flex items-center gap-2 text-sm text-ink/70">
                <MapPin size={14} className="text-brand-green shrink-0" />
                <span className="truncate">{patient.address}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-brand-green/10 text-brand-green text-xs font-bold px-2.5 py-1 rounded-full">
          <Check size={12} />
          <span>{patient.visitCount} lượt khám</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function PatientLookupForm({
  onPatientFound,
  onLoadingChange,
  isLoading = false,
  error = null
}: PatientLookupFormProps) {
  const [identifierType, setIdentifierType] = useState<LookupType>('patientCode');
  const [identifier, setIdentifier] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!identifier.trim()) {
      setLocalError('Vui lòng nhập thông tin tra cứu');
      return;
    }

    if (identifierType === 'cccd' && identifier.length !== 9 && identifier.length !== 12) {
      setLocalError('CCCD/CMND phải có 9 hoặc 12 số');
      return;
    }

    if (identifierType === 'phone' && identifier.length < 10) {
      setLocalError('Số điện thoại không hợp lệ');
      return;
    }

    const request: PatientLookupRequest = {
      identifier: identifier.trim(),
      identifierType
    };

    onPatientFound({
      id: 'mock-patient-id',
      patientCode: identifierType === 'patientCode' ? identifier : 'BN-2024-008956',
      name: 'Nguyễn Văn Minh',
      cccd: identifierType === 'cccd' ? identifier : '012345678901',
      phone: identifierType === 'phone' ? identifier : '0912345678',
      birthDate: '1965-03-15',
      gender: 'nam',
      address: '123 Quang Trung, Xã Đại Lộc, TP Đà Nẵng',
      visitCount: 12,
      registeredDate: '2020-01-15'
    });
  };

  const currentLookupType = LOOKUP_TYPES.find(t => t.value === identifierType)!;

  return (
    <div className="bg-white rounded-3xl border border-green-800/5 p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Search className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-display font-bold text-green-dark">Tra cứu thông tin bệnh nhân</h3>
          <p className="text-xs text-ink/60">Nhập mã KCB, CCCD hoặc số điện thoại đã đăng ký</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {LOOKUP_TYPES.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => setIdentifierType(type.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                identifierType === type.value
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-100 text-ink/60 hover:bg-gray-200 border border-transparent'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={currentLookupType.placeholder}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-cream-white border border-green-800/10 rounded-xl text-sm text-green-dark placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-brand-green hover:bg-brand-green/90 text-white font-semibold rounded-xl text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang tra cứu...</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>Tra cứu</span>
              </>
            )}
          </button>
        </div>

        {(localError || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100"
          >
            <AlertCircle size={14} />
            <span>{localError || error}</span>
          </motion.div>
        )}
      </form>

      <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
        <p className="text-xs text-ink/70 leading-relaxed">
          <span className="font-semibold text-blue-600">Lưu ý:</span> Vui lòng nhập thông tin chính xác như khi đăng ký khám tại bệnh viện.
          Nếu cần hỗ trợ, liên hệ hotline: <span className="font-semibold">1900 xxxx</span>
        </p>
      </div>
    </div>
  );
}