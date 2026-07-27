import { useState, FormEvent, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, X, Calendar, Phone, Mail, FileBadge, Check, Upload, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface RecordRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientCode?: string;
}

type RequestType = "ho-so-y-te" | "giay-chung-nhan" | "ket-qua-kham" | "don-thuoc";
type DeliveryMethod = "tai-kham" | "nhan-tai-quay" | "chuyen-bo-post";

const REQUEST_TYPES: { value: RequestType; label: string; desc: string }[] = [
  { value: "ho-so-y-te", label: "Hồ sơ y tế", desc: "Bản sao toàn bộ hồ sơ y tế" },
  { value: "giay-chung-nhan", label: "Giấy chứng nhận", desc: "Giấy chứng nhận phẫu thuật, xuất viện..." },
  { value: "ket-qua-kham", label: "Kết quả khám", desc: "Tờ trình kết quả khám bệnh" },
  { value: "don-thuoc", label: "Đơn thuốc", desc: "Bản sao đơn thuốc đã kê" },
];

const DELIVERY_METHODS: { value: DeliveryMethod; label: string }[] = [
  { value: "tai-kham", label: "Nhận khi tái khám" },
  { value: "nhan-tai-quay", label: "Nhận tại quầy" },
  { value: "chuyen-bo-post", label: "Chuyển bưu điện" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RecordRequestModal({
  isOpen,
  onClose,
  patientName,
  patientCode,
}: RecordRequestModalProps) {
  const [requestType, setRequestType] = useState<RequestType>("ho-so-y-te");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("tai-kham");
  const [patientCodeInput, setPatientCodeInput] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [reason, setReason] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setRequestType("ho-so-y-te");
    setDeliveryMethod("tai-kham");
    setPatientCodeInput("");
    setContactPhone("");
    setContactEmail("");
    setDateRange({ from: "", to: "" });
    setReason("");
    setSelectedFiles([]);
    setIsUploading(false);
    setSubmitError(null);
  }, []);

  const phoneError = useMemo(() => {
    if (!contactPhone.trim()) return null;
    const digits = contactPhone.replace(/\D/g, "");
    if (digits.length !== 10) return "Số điện thoại phải đủ 10 chữ số";
    if (!/^0\d{9}$/.test(digits)) return "Số điện thoại không hợp lệ";
    return null;
  }, [contactPhone]);

  const emailError = useMemo(() => {
    if (!contactEmail.trim()) return null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) return "Email không hợp lệ";
    return null;
  }, [contactEmail]);

  const contactError = useMemo(() => {
    if (!contactPhone.trim() && !contactEmail.trim()) {
      return "Vui lòng nhập số điện thoại hoặc email để chúng tôi có thể liên hệ";
    }
    return null;
  }, [contactPhone, contactEmail]);

  const dateError = useMemo(() => {
    if (dateRange.from && dateRange.to && new Date(dateRange.from) > new Date(dateRange.to)) {
      return "Từ ngày không được sau Đến ngày";
    }
    return null;
  }, [dateRange]);

  const minToDate = dateRange.from || undefined;

  const maxFromDate = dateRange.to || undefined;

  const isFormValid = !phoneError && !emailError && !contactError && !dateError;

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).filter((f) => f.size <= MAX_FILE_SIZE);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const newFiles = Array.from(e.dataTransfer.files)
      .filter(
        (f) =>
          f.type.startsWith("image/") ||
          f.type === "application/pdf" ||
          f.type.includes("word") ||
          f.name.endsWith(".doc") ||
          f.name.endsWith(".docx")
      )
      .filter((f) => f.size <= MAX_FILE_SIZE);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!isFormValid) {
      setSubmitError(contactError || dateError || phoneError || emailError || "Vui lòng kiểm tra lại thông tin");
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
          date_from: dateRange.from || null,
          date_to: dateRange.to || null,
          delivery_method: deliveryMethod,
          reason: reason || null,
          contact_phone: contactPhone || null,
          contact_email: contactEmail || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể gửi yêu cầu");
      }

      setSubmittedCode(data.data?.requestCode || data.data?.request_code || `YC-${Date.now().toString().slice(-6)}`);
      setIsSubmitted(true);

      if (selectedFiles.length > 0) {
        setIsUploading(true);
        const requestId = data.data?.id;
        try {
          for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append("file", file);
            await fetch(`/api/v1/record-requests/${requestId}/files`, {
              method: "POST",
              body: formData,
            });
          }
        } catch {
          console.warn("Một số file không được tải lên thành công");
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Không thể gửi yêu cầu";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setIsSubmitted(false);
    setSubmittedCode(null);
    resetForm();
    onClose();
  }, [onClose, resetForm]);

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
          <Button variant="primary" onClick={handleClose}>
            Đóng
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-brand-green to-green-dark px-6 py-5 text-white shrink-0 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-lg md:text-xl text-white leading-tight">Yêu cầu trích sao hồ sơ</h2>
              <p className="text-xs md:text-sm text-mint/90 mt-0.5">Điền thông tin bên dưới để gửi yêu cầu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Đóng form"
            className="p-1.5 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {patientName ? (
              <div className="flex flex-wrap gap-4 p-3 bg-mint/60 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
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
                <label htmlFor="record-patient-code" className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                  Mã bệnh nhân (nếu có)
                </label>
                <div className="relative">
                  <FileBadge size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    id="record-patient-code"
                    name="patient_code"
                    type="text"
                    value={patientCodeInput}
                    onChange={(e) => setPatientCodeInput(e.target.value)}
                    placeholder="VD: BN-2024-00001"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="record-phone" className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                  Số điện thoại <span className="text-peach">*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    id="record-phone"
                    name="contact_phone"
                    type="tel"
                    inputMode="numeric"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="0xxxxxxxxx"
                    aria-invalid={Boolean(phoneError)}
                    aria-describedby={phoneError ? "record-phone-error" : undefined}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                      phoneError ? "border-red-400 focus:border-red-400" : "border-green-800/10 focus:border-brand-green"
                    }`}
                  />
                </div>
                {phoneError && (
                  <p id="record-phone-error" className="text-xs text-red-500">
                    {phoneError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="record-email" className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                  Email (tùy chọn)
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    id="record-email"
                    name="contact_email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="email@example.com"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "record-email-error" : undefined}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                      emailError ? "border-red-400 focus:border-red-400" : "border-green-800/10 focus:border-brand-green"
                    }`}
                  />
                </div>
                {emailError && (
                  <p id="record-email-error" className="text-xs text-red-500">
                    {emailError}
                  </p>
                )}
              </div>
            </div>

            {contactError && (
              <p className="text-xs text-red-500 -mt-1" role="alert">
                {contactError}
              </p>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">Loại hồ sơ cần trích sao</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {REQUEST_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setRequestType(type.value)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      requestType === type.value
                        ? "border-brand-green bg-brand-green/5 ring-2 ring-brand-green/20"
                        : "border-green-800/10 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${requestType === type.value ? "bg-brand-green" : "bg-gray-300"}`} />
                      <span className="text-sm font-semibold text-green-dark">{type.label}</span>
                    </div>
                    <p className="text-xs text-ink/50">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="record-date-from" className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                  Từ ngày
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
                  <input
                    id="record-date-from"
                    name="date_from"
                    type="date"
                    value={dateRange.from}
                    max={maxFromDate}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                      dateError ? "border-red-400 focus:border-red-400" : "border-green-800/10 focus:border-brand-green"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="record-date-to" className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                  Đến ngày
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
                  <input
                    id="record-date-to"
                    name="date_to"
                    type="date"
                    value={dateRange.to}
                    min={minToDate}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                      dateError ? "border-red-400 focus:border-red-400" : "border-green-800/10 focus:border-brand-green"
                    }`}
                  />
                </div>
              </div>
            </div>
            {dateError && (
              <p className="text-xs text-red-500 -mt-1" role="alert">
                {dateError}
              </p>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">Phương thức nhận</label>
              <div className="flex flex-wrap gap-2">
                {DELIVERY_METHODS.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setDeliveryMethod(method.value)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      deliveryMethod === method.value
                        ? "bg-brand-green text-white"
                        : "bg-gray-100 text-ink/70 hover:bg-gray-200"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="record-reason" className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                Lý do / Ghi chú
              </label>
              <textarea
                id="record-reason"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="VD: Làm hồ sơ bảo hiểm, xin việc..."
                rows={3}
                className="w-full px-4 py-3 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">Giấy tờ kèm theo (tùy chọn)</label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-green-800/15 rounded-xl p-6 text-center cursor-pointer hover:border-brand-green/40 transition-colors"
              >
                <Upload size={24} className="mx-auto mb-2 text-brand-green/50" />
                <p className="text-sm text-ink/60">Kéo thả file hoặc click để chọn</p>
                <p className="text-xs text-ink/40 mt-1">Chấp nhận: Ảnh, PDF, Word (tối đa 10MB mỗi file)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Chọn file đính kèm"
              />

              {selectedFiles.length > 0 && (
                <ul className="space-y-2 mt-2" aria-label="Danh sách file đã chọn">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-3 bg-mint/40 rounded-xl"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileBadge size={14} className="text-brand-green shrink-0" />
                        <span className="text-sm text-ink truncate" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-xs text-ink/40 shrink-0">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label={`Xóa file ${file.name}`}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl" role="alert">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
              <Button type="button" variant="ghost" size="md" onClick={handleClose}>
                Hủy bỏ
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting || isUploading}>
                {isSubmitting || isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isUploading ? "Đang tải file..." : "Đang gửi..."}
                  </span>
                ) : (
                  "Gửi yêu cầu"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
