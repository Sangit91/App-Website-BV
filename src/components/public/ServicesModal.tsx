import { motion } from "framer-motion";
import { Stethoscope, Heart, Brain, Bone, Baby, Eye, Scissors, Pill, Activity } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES = [
  { icon: Heart, name: "Khoa Tim Mạch", desc: "Khám và điều trị bệnh lý tim mạch, huyết áp" },
  { icon: Brain, name: "Khoa Nội Tổng Hợp", desc: "Khám tổng quát, tiêu hóa, hô hấp, nội tiết" },
  { icon: Bone, name: "Khoa Cơ Xương Khớp", desc: "Điều trị xương khớp, cột sống, chấn thương" },
  { icon: Eye, name: "Khoa Mắt", desc: "Khám và điều trị các bệnh về mắt" },
  { icon: Baby, name: "Khoa Sản Phụ Khoa", desc: "Khám thai, sinh sản, phụ khoa" },
  { icon: Scissors, name: "Khoa Ngoại", desc: "Phẫu thuật, chấn thương, u bướu" },
  { icon: Pill, name: "Khoa Dược", desc: "Tư vấn thuốc, theo dõi dược liệu" },
  { icon: Activity, name: "Khoa Cấp Cứu", desc: "Cấp cứu 24/7, hồi sức tích cực" },
  { icon: Stethoscope, name: "Khoa Tai Mũi Họng", desc: "Khám và điều trị tai, mũi, họng" },
];

export default function ServicesModal({ isOpen, onClose }: ServicesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dịch vụ điều trị" size="lg">
      <div className="space-y-6">
        <div className="bg-mint/30 rounded-2xl p-4 border border-brand-green/10">
          <p className="text-sm text-ink/70">
            Bệnh viện cung cấp đầy đủ các dịch vụ y tế chuyên sâu với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl p-4 border border-green-800/5 hover:border-brand-green/30 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                  <Icon className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-display font-bold text-green-dark text-sm mb-1">{service.name}</h4>
                <p className="text-xs text-ink/60">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Liên hệ đặt lịch:</span> Hotline <span className="font-bold">1900 xxxx</span> hoặc đặt online qua website.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
          <Button variant="secondary" onClick={onClose}>Đóng</Button>
          <Button onClick={() => window.open("/dat-kham", "_blank")}>
            Đặt lịch khám
          </Button>
        </div>
      </div>
    </Modal>
  );
}