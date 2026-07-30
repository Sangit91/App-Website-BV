import React from "react";
import { motion } from "framer-motion";
import { Heart, Baby, Activity, Stethoscope, Layers, Smile, Clock, Phone, User, Calendar, ArrowRight } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Specialty } from "../../types";

interface SpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialty: Specialty | null;
}

const SPECIALTY_CONTENT: Record<string, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  services: string[];
  highlights: string[];
  experts: string[];
}> = {
  "tim-mach": {
    icon: Heart,
    color: "text-brand-green",
    bgColor: "bg-brand-green",
    services: [
      "Siêu âm tim chuyên sâu màu 4D",
      "Đo điện tim 12 leads",
      "Đo holter điện tim 24-48h",
      "Thăm dò chức năng tim mạch",
      "Điều trị tăng huyết áp",
      "Điều trị suy tim",
      "Khám và điều trị bệnh mạch vành",
    ],
    highlights: [
      "Trang bị máy siêu âm tim chuyên sâu màu Doppler",
      "Đội ngũ bác sĩ chuyên khoa tim mạch giàu kinh nghiệm",
      "Kết nối chuyển tuyến với bệnh viện tuyến tỉnh",
    ],
    experts: [
      "BS. Nguyễn Văn Minh - Trưởng khoa Tim Mạch",
      "BS. Trần Thị Lan - Chuyên khoa Tim Mạch cấp I",
    ],
  },
  "san-khoa": {
    icon: Baby,
    color: "text-pink-500",
    bgColor: "bg-pink-500",
    services: [
      "Khám thai định kỳ trọn gói",
      "Siêu âm thai 4D",
      "Xét nghiệm máu mẹ bầu",
      "Sinh con an toàn - gây tê giảm đau",
      "Chăm sóc sau sinh",
      "Điều trị các bệnh phụ khoa",
      "Tư vấn kế hoạch hóa gia đình",
    ],
    highlights: [
      "Không gian sinh đẻ ấm cúng, thân thiện",
      "Đội ngũ nữ hộ sinh nhẹ nhàng, chu đáo",
      "Hỗ trợ sản phụ vượt cạn an tâm",
      "Bảo đảm vô khuẩn, an toàn",
    ],
    experts: [
      "BS. Lê Thị Hương - Trưởng khoa Sản",
      "BS. Phạm Thị Mai - Chuyên khoa Phụ khoa",
      "BS. Hoàng Thị Thu - Chuyên khoa Sản cấp I",
    ],
  },
  "nhi-khoa": {
    icon: Activity,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    services: [
      "Khám và điều trị bệnh lý trẻ em",
      "Tư vấn dinh dưỡng cho trẻ",
      "Tiêm chủng cho trẻ em",
      "Điều trị bệnh hô hấp ở trẻ",
      "Điều trị bệnh tiêu hóa ở trẻ",
      "Theo dõi phát triển trẻ",
    ],
    highlights: [
      "Khu vực khám Nhi được thiết kế sinh động, nhiều màu sắc",
      "Giúp trẻ quên đi nỗi sợ hãi khi đi gặp bác sĩ",
      "Bác sĩ có kinh nghiệm khám trẻ em",
    ],
    experts: [
      "BS. Đỗ Văn Hùng - Trưởng khoa Nhi",
      "BS. Nguyễn Thị Hoa - Chuyên khoa Nhi cấp I",
    ],
  },
  "cap-cuu": {
    icon: Activity,
    color: "text-red-500",
    bgColor: "bg-red-500",
    services: [
      "Cấp cứu 24/7",
      "Hồi sức tích cực",
      "Xử lý tai nạn giao thông",
      "Xử lý ngộ độc",
      "Cấp cứu tim mạch",
      "Cấp cứu hô hấp",
    ],
    highlights: [
      "Trực cấp cứu 24/7 với đội ngũ giàu kinh nghiệm",
      "Quy trình cấp cứu nhanh chóng, chuyên nghiệp",
      "Kết nối liên kết chặt chẽ với các khoa",
    ],
    experts: [
      "BS. Lê Văn Phong - Trưởng khoa Cấp cứu",
      "BS. Vũ Thị Mai - Bác sĩ Cấp cứu",
    ],
  },
  "ngoai-tong-hop": {
    icon: Stethoscope,
    color: "text-green-dark",
    bgColor: "bg-green-dark",
    services: [
      "Phẫu thuật nội soi",
      "Phẫu thuật cắt ruột thừa",
      "Phẫu thuật thoát vị",
      "Điều trị chấn thương chỉnh hình",
      "Phẫu thuật u bướu",
      "Điều trị các bệnh ngoại khoa",
    ],
    highlights: [
      "Ứng dụng công nghệ mổ nội soi tiên tiến",
      "Giảm đau đớn, hồi phục nhanh",
      "Tiết kiệm tối đa thời gian nằm viện",
    ],
    experts: [
      "BS. Trần Văn Nam - Trưởng khoa Ngoại",
      "BS. Hoàng Văn Tùng - Chuyên khoa Ngoại cấp I",
    ],
  },
  "chan-doan-hinh-anh": {
    icon: Layers,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    services: [
      "Chụp X-quang kỹ thuật số",
      "Chụp cắt lớp vi tính CT",
      "Siêu âm tổng quát",
      "Siêu âm thai",
      "Xét nghiệm máu tự động",
      "Xét nghiệm sinh hóa",
    ],
    highlights: [
      "Hệ thống máy xét nghiệm tự động hóa hoàn toàn",
      "Máy chụp CT đa dãy tiên tiến",
      "Kết quả nhanh chóng, chính xác",
    ],
    experts: [
      "BS. Lê Thị Thu - Trưởng khoa CĐHA",
      "KTV. Nguyễn Văn Đức - Kỹ thuật viên X-quang",
    ],
  },
  "tai-mui-hong": {
    icon: Activity,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    services: [
      "Khám và điều trị bệnh tai",
      "Điều trị viêm mũi xoang",
      "Điều trị viêm họng",
      "Phẫu thuật amidan, vòm",
      "Điều trị nội khoa tai mũi họng",
      "Khám định kỳ cho trẻ em",
    ],
    highlights: [
      "Điều trị nội khoa và phẫu thuật họng, xoang",
      "Phương pháp tiên tiến, an toàn",
      "Phù hợp cho cả người lớn và trẻ em",
    ],
    experts: [
      "BS. Phạm Văn Toàn - Trưởng khoa TMH",
      "BS. Trần Thị Linh - Chuyên khoa TMH",
    ],
  },
  "rang-ham-mat": {
    icon: Smile,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500",
    services: [
      "Khám và điều trị bệnh răng",
      "Nha khoa thẩm mỹ",
      "Điều trị tủy răng",
      "Niềng răng",
      "Cấy ghép implant",
      "Làm răng sứ",
    ],
    highlights: [
      "Nha khoa thẩm mỹ công nghệ cao",
      "Chăm sóc nụ cười khỏe đẹp",
      "Trang thiết bị hiện đại",
    ],
    experts: [
      "BS. Nguyễn Thị Hà - Trưởng khoa Răng Hàm Mặt",
      "BS. Lê Văn Khánh - Chuyên khoa Răng",
    ],
  },
};

export default function SpecialtyModal({ isOpen, onClose, specialty }: SpecialtyModalProps) {
  if (!isOpen || !specialty) return null;

  const content = SPECIALTY_CONTENT[specialty.id] || {
    icon: Stethoscope,
    color: "text-brand-green",
    bgColor: "bg-brand-green",
    services: [],
    highlights: [],
    experts: [],
  };

  const Icon = content.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={specialty.name}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header với icon */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-16 h-16 ${content.bgColor}/10 rounded-2xl flex items-center justify-center mb-4`}
        >
          <Icon className={`w-8 h-8 ${content.color}`} />
        </motion.div>

        {/* Mô tả */}
        <div className="bg-mint/20 rounded-2xl p-4 border border-brand-green/10">
          <p className="text-sm text-ink/80 leading-relaxed">
            {specialty.description}
          </p>
        </div>

        {/* Dịch vụ */}
        <div>
          <h4 className="font-display font-bold text-green-dark text-[15px] mb-3 flex items-center gap-2">
            <Layers size={16} className={content.color} />
            Dịch vụ của khoa
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {content.services.map((service, idx) => (
              <motion.div
                key={`service-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-start gap-2 text-sm"
              >
                <div className={`w-1.5 h-1.5 ${content.color} rounded-full mt-2 shrink-0`} />
                <span className="text-ink/70">{service}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Điểm nổi bật */}
        <div className="bg-peach/10 rounded-2xl p-4 border border-peach/20">
          <h4 className="font-display font-bold text-green-dark text-[15px] mb-3 flex items-center gap-2">
            <Activity size={16} className="text-peach" />
            Điểm nổi bật
          </h4>
          <ul className="space-y-2">
            {content.highlights.map((highlight, idx) => (
              <motion.li
                key={`highlight-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-2 text-sm"
              >
                <span className="text-brand-green font-bold">✓</span>
                <span className="text-ink/70">{highlight}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Đội ngũ bác sĩ */}
        <div>
          <h4 className="font-display font-bold text-green-dark text-[15px] mb-3 flex items-center gap-2">
            <User size={16} className={content.color} />
            Đội ngũ chuyên gia
          </h4>
          <div className="space-y-2">
            {content.experts.map((expert, idx) => (
              <motion.div
                key={`expert-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-2 text-sm"
              >
                <User size={14} className="text-ink/40" />
                <span className="text-ink/70">{expert}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Thông tin thời gian & liên hệ */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-brand-green/5 rounded-xl p-3 flex items-center gap-2">
            <Clock size={16} className="text-brand-green" />
            <div>
              <p className="text-[11px] text-ink/60">Giờ làm việc</p>
              <p className="text-xs font-semibold text-green-dark">Thứ 2 - Thứ 7</p>
            </div>
          </div>
          <div className="bg-brand-green/5 rounded-xl p-3 flex items-center gap-2">
            <Phone size={16} className="text-brand-green" />
            <div>
              <p className="text-[11px] text-ink/60">Hotline</p>
              <p className="text-xs font-semibold text-green-dark">1900 xxxx</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button onClick={() => window.open("/dat-kham", "_blank")}>
            <Calendar size={16} className="mr-2" />
            Đặt lịch khám
          </Button>
        </div>
      </div>
    </Modal>
  );
}