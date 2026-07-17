import React from "react";
import { CalendarDays, ClipboardCheck, Sparkles, UserCheck } from "lucide-react";

interface QuickActionsProps {
  onOpenBooking: () => void;
  onOpenTestLookup: () => void;
  onOpenAI: () => void;
  onScrollToDoctors: () => void;
}

export default function QuickActions({
  onOpenBooking,
  onOpenTestLookup,
  onOpenAI,
  onScrollToDoctors,
}: QuickActionsProps) {
  const actions = [
    {
      id: "booking",
      title: "Đặt khám Online",
      description: "Đăng ký đặt lịch hẹn trước với bác sĩ chuyên khoa, giảm bớt thời gian chờ đợi.",
      icon: <CalendarDays className="text-peach" size={26} />,
      onClick: onOpenBooking,
    },
    {
      id: "test-results",
      title: "Tra cứu kết quả xét nghiệm",
      description: "Xem trực tuyến kết quả xét nghiệm máu, siêu âm và chẩn đoán hình ảnh nhanh chóng.",
      icon: <ClipboardCheck className="text-brand-green" size={26} />,
      onClick: onOpenTestLookup,
    },
    {
      id: "ai-consult",
      title: "Tư vấn sức khỏe từ xa (AI)",
      description: "Chat trực tiếp với Trợ lý Bác sĩ Trí tuệ Nhân tạo để nhận tư vấn sức khỏe ban đầu.",
      icon: <Sparkles className="text-peach animate-pulse" size={26} />,
      onClick: onOpenAI,
    },
    {
      id: "doctors",
      title: "Lịch làm việc của bác sĩ",
      description: "Tra cứu chi tiết lịch trực khám, học vị chuyên môn và đặt hẹn trực tiếp với bác sĩ.",
      icon: <UserCheck className="text-brand-green" size={26} />,
      onClick: onScrollToDoctors,
    },
  ];

  return (
    <section id="dich-vu" className="bg-green-dark text-white py-12 md:py-20 relative z-20">
      <div className="max-w-[1180px] mx-auto px-4">
        
        {/* Section Heading inside dark area */}
        <div className="text-center max-w-[680px] mx-auto mb-10 md:mb-14">
          <p className="text-peach text-xs font-bold uppercase tracking-widest mb-2">Tiện ích phục vụ người bệnh</p>
          <h2 className="font-display font-bold text-[28px] md:text-[32px] text-mint">
            Chủ động chăm sóc sức khỏe của bạn
          </h2>
          <p className="text-mint/80 text-sm md:text-base mt-3">
            Hệ thống cổng thông tin trực tuyến hỗ trợ người bệnh tiếp cận các dịch vụ y tế của Bệnh viện nhanh chóng, minh bạch và an toàn nhất.
          </p>
        </div>

        {/* 4 Columns Glassmorphism Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((act) => (
            <div
              key={act.id}
              onClick={act.onClick}
              className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/[0.2] p-6 rounded-[20px] shadow-lg transition-all duration-300 transform hover:translate-y-[-6px] cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden select-none"
            >
              <div className="flex flex-col space-y-4">
                {/* Icon Container with Squircle layout */}
                <div className="w-12 h-12 bg-white/10 rounded-[14px] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  {act.icon}
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-[17px] md:text-[18px] text-mint group-hover:text-peach transition-colors duration-200">
                    {act.title}
                  </h3>
                  <p className="text-xs md:text-[13px] text-mint/75 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="mt-6 flex items-center space-x-1.5 text-peach text-xs font-bold uppercase tracking-wider group-hover:underline">
                <span>Trực tuyến ngay</span>
                <span>→</span>
              </div>

              {/* Backglow accent on hover */}
              <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-brand-green/10 rounded-full blur-xl group-hover:bg-brand-green/20 transition-all duration-300"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
