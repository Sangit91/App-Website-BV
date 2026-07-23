import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { MessageSquare, X, Check, Star } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

type ServiceType = 'kham-benh' | 'noi-tru' | 'cap-cuu' | 'ban-si' | 'Other';
type Rating = 1 | 2 | 3 | 4 | 5;

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: 'kham-benh', label: 'Khám bệnh' },
  { value: 'noi-tru', label: 'Nội trú' },
  { value: 'cap-cuu', label: 'Cấp cứu' },
  { value: 'ban-si', label: 'Bán sỉ' },
  { value: 'Other', label: 'Khác' }
];

export default function FeedbackModal({
  isOpen,
  onClose,
  patientName
}: FeedbackModalProps) {
  const [service_type, setServiceType] = useState<ServiceType>('kham-benh');
  const [rating, setRating] = useState<Rating>(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/feedback-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patientName || "Khách vãng lai",
          service_type,
          rating,
          content,
          contact_phone: null,
          contact_email: null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể gửi góp ý");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      alert(error.message || "Không thể gửi góp ý");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setServiceType('kham-benh');
    setRating(5);
    setContent('');
    onClose();
  };

  if (isSubmitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="sm">
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-8 h-8 text-brand-green" />
          </motion.div>
          <h3 className="font-display font-bold text-xl text-green-dark mb-2">Cảm ơn bạn!</h3>
          <p className="text-sm text-ink/70 mb-6">
            Ý kiến của bạn đã được ghi nhận.
            <br />
            Chúng tôi sẽ cải thiện dịch vụ tốt hơn.
          </p>
          <Button variant="primary" onClick={handleClose}>Đóng</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="overflow-hidden">
        <div className="bg-gradient-to-r from-brand-green/5 to-emerald-5 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green/20 to-emerald-10 flex items-center justify-center">
                <MessageSquare size={20} className="text-brand-green" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-green-dark">Góp ý chất lượng dịch vụ</h3>
                <p className="text-xs text-ink/50 mt-0.5">Đánh giá và đóng góp ý kiến để cải thiện</p>
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
          {patientName && (
            <div className="p-3 bg-gray-50 rounded-xl text-sm">
              <span className="text-ink/60">Bệnh nhân: </span>
              <span className="font-semibold text-green-dark">{patientName}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
              Dịch vụ sử dụng
            </label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setServiceType(type.value)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    service_type === type.value
                      ? 'bg-brand-green text-white'
                      : 'bg-gray-100 text-ink/70 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
              Đánh giá tổng quan
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star as Rating)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={32}
                    className={star <= rating ? 'text-peach fill-peach' : 'text-gray-300'}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-semibold text-green-dark">
                {rating === 5 ? 'Rất hài lòng' :
                 rating === 4 ? 'Hài lòng' :
                 rating === 3 ? 'Bình thường' :
                 rating === 2 ? 'Không hài lòng' : 'Rất không hài lòng'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
              Nội dung góp ý
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ tại bệnh viện..."
              rows={4}
              className="w-full px-4 py-3 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none"
            />
            <p className="text-xs text-ink/40">
              Nội dung góp ý sẽ được xử lý bảo mật và chỉ sử dụng để cải thiện chất lượng dịch vụ.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
            <Button type="button" variant="ghost" size="md" onClick={handleClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang gửi...
                </span>
              ) : (
                'Gửi góp ý'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}