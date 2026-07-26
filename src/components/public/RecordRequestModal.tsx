import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { FileText, X, Calendar, User, Phone, Mail, FileBadge, Check } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface RecordRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientCode?: string;
}

type RequestType = 'ho-so-y-te' | 'giay-chung-nhan' | 'ket-qua-kham' | 'don-thuoc';
type DeliveryMethod = 'tai-kham' | 'nhan-tai-quay' | 'chuyen-bo-post';

const REQUEST_TYPES: { value: RequestType; label: string; desc: string }[] = [
  { value: 'ho-so-y-te', label: 'Hồ sơ y tế', desc: 'Bản sao toàn bộ hồ sơ y tế' },
  { value: 'giay-chung-nhan', label: 'Giấy chứng nhận', desc: 'Giấy chứng nhận phẫu thuật, xuất viện...' },
  { value: 'ket-qua-kham', label: 'Kết quả khám', desc: 'Tờ trình kết quả khám bệnh' },
  { value: 'don-thuoc', label: 'Đơn thuốc', desc: 'Bản sao đơn thuốc đã kê' }
];

export default function RecordRequestModal({
  isOpen,
  onClose,
  patientName,
  patientCode
}: RecordRequestModalProps) {
  const [requestType, setRequestType] = useState<RequestType>('ho-so-y-te');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('tai-kham');
  const [patientCodeInput, setPatientCodeInput] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!contactPhone.trim() && !contactEmail.trim()) {
      alert("Vui lòng nhập số điện thoại hoặc email để chúng tôi có thể liên hệ khi cần.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/record-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName || "Khách vãng lai",
          patient_code: patientCode || patientCodeInput || null,
          request_type: requestType,
          date_from: dateRange.from,
          date_to: dateRange.to,
          delivery_method: deliveryMethod,
          reason: reason || null,
          contact_phone: contactPhone || null,
          contact_email: contactEmail || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể gửi yêu cầu");
      }

      setSubmittedCode(data.data?.requestCode || data.data?.request_code || `YC-${Date.now().toString().slice(-6)}`);
      setIsSubmitted(true);
    } catch (error: any) {
      alert(error.message || "Không thể gửi yêu cầu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setSubmittedCode(null);
    setRequestType('ho-so-y-te');
    setPatientCodeInput('');
    setContactPhone('');
    setContactEmail('');
    setDateRange({ from: '', to: '' });
    setReason('');
    onClose();
  };

  if (isSubmitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-8 h-8 text-brand-green" />
          </motion.div>
          <h3 className="font-display font-bold text-xl text-green-dark mb-2">Yêu cầu đã được tiếp nhận</h3>
          <p className="text-sm text-ink/70 mb-6">
            Mã yêu cầu: <span className="font-bold text-brand-green">{submittedCode}</span>
            <br />
            Thời gian xử lý: 3-5 ngày làm việc
          </p>
          <Button variant="primary" onClick={handleClose}>Đóng</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="overflow-hidden">
        <div className="bg-gradient-to-r from-brand-green/5 to-emerald-5 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green/20 to-emerald-10 flex items-center justify-center">
                <FileText size={20} className="text-brand-green" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-green-dark">Yêu cầu trích sao hồ sơ</h3>
                <p className="text-xs text-ink/50 mt-0.5">Điền thông tin bên dưới để gửi yêu cầu</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-green-800/10 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {patientName ? (
            <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <User size={14} className="text-brand-green" />
                <span className="text-ink/60">Bệnh nhân:</span>
                <span className="font-semibold text-green-dark">{patientName}</span>
              </div>
              {(patientCode || patientCodeInput) && (
                <div className="flex items-center gap-2 text-sm">
                  <FileBadge size={14} className="text-brand-green" />
                  <span className="text-ink/60">Mã KCB:</span>
                  <span className="font-semibold text-green-dark">{patientCode || patientCodeInput}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                Mã bệnh nhân (nếu có)
              </label>
              <div className="relative">
                <FileBadge size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  value={patientCodeInput}
                  onChange={(e) => setPatientCodeInput(e.target.value)}
                  placeholder="VD: BN-2024-00001"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                Số điện thoại <span className="text-peach">*</span>
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="0xxxxxxxxx"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                Email (tùy chọn)
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-ink/50 -mt-2">Ít nhất 1 trong 2 trường phải được điền để nhân viên có thể liên hệ khi cần</p>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
              Loại hồ sơ cần trích sao
            </label>
            <div className="grid grid-cols-2 gap-3">
              {REQUEST_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setRequestType(type.value)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    requestType === type.value
                      ? 'border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20'
                      : 'border-green-800/10 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${requestType === type.value ? 'bg-brand-green' : 'bg-gray-300'}`} />
                    <span className="text-sm font-semibold text-green-dark">{type.label}</span>
                  </div>
                  <p className="text-xs text-ink/50">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                Từ ngày
              </label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                Đến ngày
              </label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
              Phương thức nhận
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'tai-kham', label: 'Nhận khi tái khám' },
                { value: 'nhan-tai-quay', label: 'Nhận tại quầy' },
                { value: 'chuyen-bo-post', label: 'Chuyển bưu điện' }
              ].map(method => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setDeliveryMethod(method.value as DeliveryMethod)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    deliveryMethod === method.value
                      ? 'bg-brand-green text-white'
                      : 'bg-gray-100 text-ink/70 hover:bg-gray-200'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
              Lý do / Ghi chú
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Làm hồ sơ bảo hiểm, xin việc..."
              rows={3}
              className="w-full px-4 py-3 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
            <Button type="button" variant="ghost" size="md" onClick={handleClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang gửi...
                </span>
              ) : (
                'Gửi yêu cầu'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}