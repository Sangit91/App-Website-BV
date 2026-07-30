import { motion } from "framer-motion";
import { Bed, Users, Clock, Utensils, Shield, X, Check } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface InpatientGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GUIDELINES = [
  {
    icon: Bed,
    title: "Nhập viện",
    items: [
      "Xuất trình giấy chuyển tuyến hoặc đặt lịch trước",
      "Làm thủ tục nhập viện tại quầy tiếp nhận",
      "Nộp các giấy tờ cần thiết: CCCD, BHYT, giấy chuyển tuyến",
      "Nhận phòng và giường theo phân bổ của bệnh viện"
    ]
  },
  {
    icon: Users,
    title: "Thăm nom",
    items: [
      "Giờ thăm nom: 14:00 - 20:00 hàng ngày",
      "Mỗi bệnh nhân tối đa 2 người thăm cùng lúc",
      "Không mang thực phẩm lạ vào khu điều trị",
      "Trẻ em dưới 12 tuổi không được vào khu nội trú"
    ]
  },
  {
    icon: Utensils,
    title: "Ăn uống",
    items: [
      "Bữa ăn được phục vụ theo chế độ dinh dưỡng của bác sĩ",
      "Thực đơn được phân chia: sáng, trưa, chiều, tối",
      "Người nhà có thể đặt suất ăn tại căng tin tầng 1",
      "Tuyệt đối không mang thức ăn từ bên ngoài khi chưa được cho phép"
    ]
  },
  {
    icon: Shield,
    title: "An ninh & Quy định",
    items: [
      "Khu nội trú có camera an ninh 24/7",
      "Không hút thuốc trong khuôn viên bệnh viện",
      "Không sử dụng các thiết bị điện tử gây ồn",
      "Bảo quản tài sản cá nhân cẩn thận"
    ]
  }
];

export default function InpatientGuideModal({ isOpen, onClose }: InpatientGuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hướng dẫn bệnh nhân nội trú" size="lg">
      <div className="space-y-6">
        <div className="bg-mint/30 rounded-2xl p-4 border border-brand-green/10">
          <p className="text-sm text-ink/70">
            Bệnh nhân nội trú là những người được chỉ định nhập viện và theo dõi điều trị tại bệnh viện từ 1 ngày trở lên. Vui lòng tuân thủ các quy định sau để đảm bảo an toàn và chất lượng điều trị.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GUIDELINES.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-5 border border-green-800/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-display font-bold text-green-dark">{section.title}</h4>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
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

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-sm text-amber-700">
            <span className="font-semibold">Lưu ý:</span> Trong trường hợp khẩn cấp, vui lòng liên hệ hotline <span className="font-bold">1900 xxxx</span> hoặc đến Khoa Cấp cứu 24/7 tại tầng 1.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
          <Button variant="secondary" onClick={onClose}>Đóng</Button>
          <Button onClick={() => window.print()}>In hướng dẫn</Button>
        </div>
      </div>
    </Modal>
  );
}