import React from "react";
import { Calendar, Play, CheckCircle, Star, ShieldCheck, Award } from "lucide-react";

interface HeroProps {
  onOpenBooking: () => void;
  onScrollToSection: (id: string) => void;
}

export default function Hero({ onOpenBooking, onScrollToSection }: HeroProps) {
  return (
    <section id="trang-chu" className="relative pt-6 md:pt-14 pb-0 overflow-hidden bg-cream-white">
      <div className="max-w-[1180px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Side: 55% content */}
        <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
          
          {/* Subtle Tagline */}
          <div className="inline-flex items-center space-x-2 bg-brand-green/10 text-brand-green px-4 py-1.5 rounded-full w-max text-[13px] font-semibold tracking-wide">
            <Award size={14} className="text-peach animate-spin-slow" />
            <span>Đơn vị Anh hùng Lao động thời kỳ đổi mới</span>
          </div>

          {/* Heading H1 (Fredoka rounded, warm feel) */}
          <h1 className="font-display font-bold text-green-dark text-[36px] sm:text-[44px] md:text-[48px] leading-[1.15] tracking-tight">
            Chăm sóc bằng <span className="text-brand-green relative inline-block">Cả Trái Tim</span> <br />
            Y đức sáng, Sức khỏe an lành
          </h1>

          {/* Slogan details (Be Vietnam Pro) */}
          <p className="text-ink/80 text-base md:text-lg leading-relaxed max-w-[620px]">
            Bệnh viện Đa khoa Khu vực Miền núi Phía Bắc Quảng Nam cam kết mang lại dịch vụ y tế kỹ thuật cao, thân thiện và ấm áp. Nơi tình thương xoa dịu nỗi đau, mang niềm tin sức khỏe đến mọi gia đình.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Primary button */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2.5 bg-brand-green hover:bg-brand-green/90 text-white font-sans text-[15px] font-bold px-7 py-3.5 rounded-full cursor-pointer shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
            >
              <Calendar size={18} />
              <span>Đặt lịch khám ngay</span>
            </button>

            {/* Outline button */}
            <button
              onClick={() => onScrollToSection("gioi-thieu")}
              className="flex items-center gap-2 bg-white hover:bg-brand-green/5 border-2 border-mint text-green-dark hover:border-brand-green/30 font-sans text-[15px] font-bold px-7 py-3.5 rounded-full cursor-pointer transition-all duration-300"
            >
              <span>Xem giới thiệu bệnh viện</span>
              <Play size={14} className="fill-green-dark text-green-dark ml-1" />
            </button>
          </div>

          {/* 3 Real Metric counters */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-green/10 max-w-[580px]">
            <div className="flex flex-col">
              <span className="font-display text-[26px] md:text-[32px] font-bold text-green-dark">22+</span>
              <span className="text-xs md:text-[13px] font-semibold text-ink/75">Chuyên khoa sâu</span>
            </div>
            <div className="flex flex-col border-l border-brand-green/10 pl-4 md:pl-6">
              <span className="font-display text-[26px] md:text-[32px] font-bold text-green-dark">150+</span>
              <span className="text-xs md:text-[13px] font-semibold text-ink/75">Bác sĩ chuyên khoa giỏi</span>
            </div>
            <div className="flex flex-col border-l border-brand-green/10 pl-4 md:pl-6">
              <span className="font-display text-[26px] md:text-[32px] font-bold text-brand-green">200K+</span>
              <span className="text-xs md:text-[13px] font-semibold text-ink/75">Lượt khám bệnh/năm</span>
            </div>
          </div>

        </div>

        {/* Right Side: 45% image (Responsive columns) */}
        <div className="lg:col-span-5 relative flex justify-center items-center mt-6 lg:mt-0">
          
          {/* Main Wave Organic Blob holding image */}
          <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] overflow-hidden bg-gradient-to-br from-mint via-brand-green/20 to-peach/20 blob-mask shadow-2xl">
            <img 
              src="https://images.pexels.com/photos/3985161/pexels-photo-3985161.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Đội ngũ bác sĩ BVĐK Miền Núi Phía Bắc Quảng Nam" 
              className="w-full h-full object-cover brightness-[1.03]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Floating Card 1: Ticket alert */}
          <div className="absolute top-[10%] left-[-5%] sm:left-[-10%] bg-white/95 backdrop-blur-sm p-3.5 rounded-[20px] shadow-lg border border-brand-green/10 flex items-center space-x-3 animate-bounce-slow max-w-[210px] select-none">
            <div className="w-10 h-10 bg-mint rounded-[14px] flex items-center justify-center text-brand-green shrink-0">
              <CheckCircle size={20} className="fill-mint" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wider text-brand-green font-bold">Đặt lịch khám</p>
              <p className="text-xs font-bold text-green-dark">Đã xác nhận thành công!</p>
            </div>
          </div>

          {/* Floating Card 2: 5-Star Rating feedback */}
          <div className="absolute bottom-[12%] right-[-5%] sm:right-[-8%] bg-white/95 backdrop-blur-sm p-3.5 rounded-[20px] shadow-lg border border-brand-green/10 flex flex-col space-y-1.5 animate-bounce-delayed max-w-[190px] text-left select-none">
            <div className="flex items-center space-x-1 text-peach">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-current" />
              ))}
            </div>
            <p className="text-[11px] font-semibold text-ink/90 leading-tight">
              &quot;Bác sĩ ân cần, phục vụ rất chu đáo!&quot;
            </p>
            <span className="text-[10px] font-bold text-brand-green">Chị Thủy - Đại Lộc</span>
          </div>

          {/* Circle background accents */}
          <div className="absolute -z-10 w-72 h-72 bg-peach/10 rounded-full blur-3xl -bottom-10 -left-10"></div>
          <div className="absolute -z-10 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl -top-10 -right-10"></div>
        </div>

      </div>

      {/* Wave Vector Divider (SVG) to transition nicely into Quick Actions (Green Dark #164B36) */}
      <div className="w-full relative bottom-[-1px] left-0 right-0 z-10 leading-none overflow-hidden mt-16">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[60px] md:h-[90px] fill-green-dark"
        >
          <path d="M0,0 C150,90 350,120 600,100 C850,80 1050,90 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
