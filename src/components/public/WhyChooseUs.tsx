import React from "react";
import { Check, ShieldCheck, HeartHandshake, Award, Sparkles } from "lucide-react";
import ScrollAnimation from "../ui/ScrollAnimation";

export default function WhyChooseUs() {
  return (
    <section id="gioi-thieu" className="bg-mint py-16 md:py-20">
      <div className="max-w-[1180px] mx-auto px-4 space-y-16 md:space-y-24">
        
        {/* Section Heading */}
        <ScrollAnimation animation="fade-up" className="text-center max-w-[680px] mx-auto">
          <p className="text-brand-green text-xs font-bold uppercase tracking-widest mb-2">Giá trị cốt lõi</p>
          <h2 className="font-display font-bold text-[28px] md:text-[32px] text-green-dark">
            Vì sao nên gửi gắm niềm tin tại BVĐK KV Miền Núi Phía Bắc Quảng Nam?
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto my-3 rounded-full"></div>
          <p className="text-ink/80 text-sm md:text-base">
            Chúng tôi tự hào là điểm tựa y tế vững chắc hàng đầu cho nhân dân trong khu vực bằng năng lực chuyên môn và tinh thần cống hiến vượt trội.
          </p>
        </ScrollAnimation>

        {/* Row 1: Đội ngũ chuyên môn cao (Image Left - Text Right) */}
        <ScrollAnimation animation="slide-left" className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left: Image (Radius Large - 28px) */}
          <div className="lg:col-span-6 relative">
            <div className="w-full h-[320px] md:h-[400px] overflow-hidden rounded-[28px] shadow-lg">
              <img
                src="/images/components/why-choose-1.jpeg"
                alt="Đội ngũ bác sĩ chuyên môn tận tâm"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Small floating overlay badge */}
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-[20px] shadow-md border border-brand-green/10 flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-peach/10 rounded-xl flex items-center justify-center text-peach">
                <HeartHandshake size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-green-dark">Y đức là vàng</p>
                <p className="text-[10px] text-ink/70">Khám chữa bằng cả cái tâm</p>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="lg:col-span-6 text-left space-y-5">
            <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 text-brand-green px-3.5 py-1 rounded-full text-xs font-bold">
              <Award size={13} />
              <span>Chuyên môn & Y đức</span>
            </div>
            <h3 className="font-display font-bold text-[22px] md:text-[24px] text-green-dark leading-snug">
              Đội ngũ y bác sĩ đầu ngành tận tâm, giàu y đức
            </h3>
            <p className="text-ink/80 text-sm md:text-base leading-relaxed">
              Các y bác sĩ tại bệnh viện đều được đào tạo bài bản từ các trường đại học y danh tiếng trong và ngoài nước. Trải qua hàng chục năm rèn nghề, chúng tôi không chỉ giỏi chuyên môn mà luôn coi nỗi đau của người bệnh như nỗi đau của chính mình.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "100% bác sĩ có trình độ sau đại học",
                "Phục vụ ân cần, thấu hiểu bệnh nhân",
                "Chăm sóc người bệnh chu đáo 24/7",
                "Nhiệt huyết chuyển giao công nghệ mới"
              ].map((item, idx) => (
                <li key={item} className="flex items-center gap-2 text-xs md:text-sm font-semibold text-ink/90">
                  <span className="w-5 h-5 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0">
                    <Check size={12} className="stroke-[3px]" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollAnimation>

        {/* Row 2: Thiết bị hiện đại (Text Left - Image Right on Desktop) */}
        <ScrollAnimation animation="slide-right" className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left: Text Content (Reordered to left for desktop grid layout) */}
          <div className="lg:col-span-6 lg:order-1 text-left space-y-5">
            <div className="inline-flex items-center space-x-1.5 bg-peach/15 text-peach px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles size={13} className="fill-peach/10" />
              <span>Công nghệ cao</span>
            </div>
            <h3 className="font-display font-bold text-[22px] md:text-[24px] text-green-dark leading-snug">
              Trang thiết bị hiện đại hàng đầu khu vực miền núi
            </h3>
            <p className="text-ink/80 text-sm md:text-base leading-relaxed">
              Vượt qua rào cản địa lý vùng cao, chúng tôi không ngừng đầu tư các dòng máy móc cận lâm sàng hiện đại bậc nhất: Hệ thống chụp cắt lớp vi tính CT đa dãy, Cộng hưởng từ MRI, siêu âm tim màu Doppler 4D, máy nội soi Olympus thế hệ mới giúp chẩn đoán bệnh chính xác và can thiệp nhanh chóng.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Chẩn đoán hình ảnh chính xác vượt trội",
                "Trang bị máy nội soi Olympus tiên tiến",
                "Kết quả xét nghiệm tự động hóa nhanh",
                "Phòng mổ áp lực âm tiêu chuẩn quốc tế"
              ].map((item, idx) => (
                <li key={item} className="flex items-center gap-2 text-xs md:text-sm font-semibold text-ink/90">
                  <span className="w-5 h-5 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0">
                    <Check size={12} className="stroke-[3px]" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Image (Radius Large - 28px) */}
          <div className="lg:col-span-6 lg:order-2 relative">
            <div className="w-full h-[320px] md:h-[400px] overflow-hidden rounded-[28px] shadow-lg">
              <img
                src="/images/components/why-choose-2.jpeg"
                alt="Trang thiết bị y tế hiện đại hàng đầu tại bệnh viện"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            
              {/* Small floating overlay badge */}
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-[20px] shadow-md border border-brand-green/10 flex items-center space-x-2.5">
                <div className="w-9 h-9 bg-mint rounded-xl flex items-center justify-center text-brand-green">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-green-dark">Chuẩn quốc tế</p>
                  <p className="text-[10px] text-ink/70">An toàn & vô trùng tuyệt đối</p>
                </div>
              </div>
          </div>
        </ScrollAnimation>

      </div>
    </section>
  );
}
