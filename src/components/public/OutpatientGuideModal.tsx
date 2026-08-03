import { motion } from "framer-motion";
import { Calendar, Clipboard, FileText, ArrowRight, Check, Clock, Phone } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { DEFAULT_CONTACT } from "../../data/siteContact";

interface OutpatientGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    number: "01",
    icon: Calendar,
    title: "Đăng ký khám",
    items: [
      "Đặt lịch hẹn trước qua hotline hoặc website",
      "Hoặc đến trực tiếp quầy đăng ký tầng 1",
      "Xuất trình CCCD và BHYT (nếu có)",
      "Nhận số thứ tự và phòng khám"
    ]
  },
  {
    number: "02",
    icon: Clipboard,
    title: "Chờ khám",
    items: [
      "Ngồi chờ theo số thứ tự hiển thị trên màn hình",
      "Thời gian chờ trung bình: 15-30 phút",
      "Có thể check-in online qua ứng dụng để giảm thời gian chờ",
      "Khi được gọi, vào phòng khám theo hướng dẫn"
    ]
  },
  {
    number: "03",
    icon: FileText,
    title: "Khám bệnh",
    items: [
      "Gặp bác sĩ chuyên khoa để khám và tư vấn",
      "Thực hiện các xét nghiệm, chẩn đoán nếu cần",
      "Nhận đơn thuốc hoặc hướng dẫn điều trị",
      "Đặt lịch tái khám nếu cần theo dõi"
    ]
  },
  {
    number: "04",
    icon: ArrowRight,
    title: "Nhận kết quả",
    items: [
      "Kết quả xét nghiệm thường có sau 2-4 giờ",
      "Kết quả chẩn đoán hình ảnh có sau 1-2 ngày",
      "Check kết quả online qua cổng thông tin",
      "Hoặc quay lại bệnh viện nhận kết quả tại quầy"
    ]
  }
];

export default function OutpatientGuideModal({ isOpen, onClose }: OutpatientGuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hướng dẫn khám ngoại trú" size="lg">
      <div className="space-y-6">
        <div className="bg-mint/30 rounded-2xl p-4 border border-brand-green/10">
          <p className="text-sm text-ink/70">
            Quy trình khám bệnh ngoại trú áp dụng cho bệnh nhân đến khám và về trong ngày, không cần nhập viện.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-5 border border-green-800/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 text-[60px] font-display font-bold text-green-800/[0.03] leading-none">
                  {step.number}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand-green" />
                  </div>
                  <h4 className="font-display font-bold text-green-dark">{step.title}</h4>
                </div>
                <ul className="space-y-2">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink/70">
                      <Check size={14} className="text-brand-green shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-700">Thời gian làm việc</p>
              <p className="text-sm text-blue-600 mt-1">
                Thứ 2 - Thứ 6: 07:00 - 17:00 | Thứ 7: 07:00 - 11:30
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
          <Button variant="secondary" onClick={onClose}>Đóng</Button>
          <a
            href={`tel:${DEFAULT_CONTACT.hotline.replace(/\./g, "")}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green hover:bg-green-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Phone size={14} />
            Gọi Hotline: {DEFAULT_CONTACT.hotline}
          </a>
          <Button onClick={() => window.open("/dat-kham", "_blank")}>
            <Calendar size={16} />
            <span>Đặt lịch khám</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}