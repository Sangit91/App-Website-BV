import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, X, Check, AlertTriangle, ExternalLink } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface Policy {
  version: string;
  title: string;
  contentHtml: string;
  effectiveDate: string;
}

interface PatientConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onConsentGiven?: () => void;
}

type ConsentScope = "treatment_required" | "notification_opt_in" | "research_opt_in";

const SCOPES: { value: ConsentScope; label: string; description: string; required: boolean }[] = [
  {
    value: "treatment_required",
    label: "Xử lý dữ liệu khám chữa bệnh",
    description: "Cho phép xem lịch sử khám bệnh, kết quả xét nghiệm và điều trị để phục vụ chẩn đoán và điều trị.",
    required: true,
  },
  {
    value: "notification_opt_in",
    label: "Nhận thông báo nhắc lịch",
    description: "Nhận nhắc lịch khám, kết quả xét nghiệm qua SMS/Zalo/Email.",
    required: false,
  },
  {
    value: "research_opt_in",
    label: "Dữ liệu ẩn danh cho nghiên cứu",
    description: "Cho phép sử dụng dữ liệu ẩn danh để cải thiện chất lượng dịch vụ y tế.",
    required: false,
  },
];

export default function PatientConsentModal({
  isOpen,
  onClose,
  patientId,
  onConsentGiven,
}: PatientConsentModalProps) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScopes, setSelectedScopes] = useState<ConsentScope[]>(["treatment_required"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullPolicy, setShowFullPolicy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchActivePolicy();
    }
  }, [isOpen]);

  const fetchActivePolicy = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/consent/policy/active");
      if (!response.ok) {
        throw new Error("Không thể tải chính sách");
      }
      const data = await response.json();
      setPolicy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi tải chính sách");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleScope = (scope: ConsentScope) => {
    if (scope === "treatment_required") return;
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleSubmit = async () => {
    if (!policy) return;
    if (!selectedScopes.includes("treatment_required")) {
      setError("Bạn phải đồng ý xử lý dữ liệu khám chữa bệnh để tiếp tục");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/consent/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          policy_version: policy.version,
          is_agreed: true,
          agreed_scopes: selectedScopes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể lưu đồng ý");
      }

      onConsentGiven?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi lưu đồng ý");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!policy) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/v1/consent/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          policy_version: policy.version,
          is_agreed: false,
          agreed_scopes: [],
        }),
      });
      onClose();
    } catch {
      setError("Không thể ghi nhận từ chối");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-brand-green/30 border-t-brand-green rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-ink/60">Đang tải chính sách...</p>
        </div>
      </Modal>
    );
  }

  if (error && !policy) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-peach mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-green-dark mb-2">Lỗi tải chính sách</h3>
          <p className="text-sm text-ink/70 mb-6">{error}</p>
          <Button variant="primary" onClick={fetchActivePolicy}>
            Thử lại
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500/5 to-pink-5 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-10 flex items-center justify-center">
                <Shield size={20} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-green-dark">Đồng ý chính sách bảo mật</h3>
                <p className="text-xs text-ink/50 mt-0.5">Xem và xác nhận trước khi truy cập dữ liệu y tế</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-green-800/10 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-peach/10 border border-peach/20 rounded-xl text-sm text-peach flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {policy && (
            <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-dark">{policy.title}</h4>
                <span className="text-xs text-ink/50">Phiên bản {policy.version}</span>
              </div>
              {!showFullPolicy ? (
                <div className="space-y-3">
                  <p
                    className="text-sm text-ink/70 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: policy.contentHtml.slice(0, 300) + "..." }}
                  />
                  <button
                    onClick={() => setShowFullPolicy(true)}
                    className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                  >
                    Xem đầy đủ <ExternalLink size={12} />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className="text-sm text-ink/70 max-h-48 overflow-y-auto prose prose-sm prose-green"
                    dangerouslySetInnerHTML={{ __html: policy.contentHtml }}
                  />
                  <button
                    onClick={() => setShowFullPolicy(false)}
                    className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                  >
                    Thu gọn
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
              Phạm vi đồng ý <span className="text-peach">*</span>
            </label>
            {SCOPES.map((scope) => (
              <div
                key={scope.value}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedScopes.includes(scope.value)
                    ? "border-brand-green bg-brand-green/5"
                    : scope.required
                    ? "border-peach/30 bg-peach/5"
                    : "border-green-800/10 hover:border-green-800/20"
                }`}
                onClick={() => handleToggleScope(scope.value)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${
                      selectedScopes.includes(scope.value)
                        ? "bg-brand-green border-brand-green"
                        : "border-green-800/20"
                    }`}
                  >
                    {selectedScopes.includes(scope.value) && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-green-dark">{scope.label}</span>
                      {scope.required && (
                        <span className="text-xs px-2 py-0.5 bg-peach/10 text-peach rounded-full">Bắt buộc</span>
                      )}
                    </div>
                    <p className="text-xs text-ink/60 mt-1">{scope.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-ink/40 p-3 bg-gray-50 rounded-xl">
            Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, bạn có quyền rút lại sự đồng ý bất kỳ lúc nào
            tại trang Cài đặt Quyền riêng tư.
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-0">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleReject}
            disabled={isSubmitting}
          >
            Từ chối
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedScopes.includes("treatment_required")}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </span>
            ) : (
              "Đồng ý và tiếp tục"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}