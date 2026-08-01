import React from "react";
import { Phone, CalendarDays } from "lucide-react";
import ScrollAnimation from "../ui/ScrollAnimation";
import { useSiteContent } from "../../context/SiteContentContext";
import { DEFAULT_CONTACT } from "../../data/siteContact";

interface CTABannerProps {
  onOpenBooking: () => void;
}

export default function CTABanner({ onOpenBooking }: CTABannerProps) {
  const { getSection } = useSiteContent();
  const contact = getSection("contact", DEFAULT_CONTACT);
  return (
    <section className="bg-cream-white py-12 md:py-16">
      <div className="max-w-[1180px] mx-auto px-4">
        
        {/* Banner container (Radius Large - 28px, gradient green theme) */}
        <ScrollAnimation animation="scale-up" className="relative">
          <div className="relative bg-gradient-to-r from-brand-green via-[#228e51] to-green-dark p-8 md:p-14 rounded-[28px] text-white shadow-xl overflow-hidden select-none text-left">
          
          {/* Circular decorative blobs in background */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-peach/15 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading and description */}
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-peach text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest w-max block">
                Tổng đài tư vấn trực tuyến
              </span>
              <h2 className="font-display font-bold text-[26px] sm:text-[32px] md:text-[36px] leading-tight text-white">
                Bạn cần chúng tôi hỗ trợ <br className="hidden sm:inline" />
                Chăm sóc Sức khỏe hôm nay?
              </h2>
              <p className="text-sm md:text-base text-mint/90 max-w-[620px] leading-relaxed">
                Đừng ngần ngại liên hệ với chúng tôi để nhận tư vấn, đặt lịch khám trực tiếp hoặc nhận hướng dẫn y tế từ xa từ những y bác sĩ tận tâm nhất của bệnh viện.
              </p>
            </div>

            {/* Right Column: CTA Buttons */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              {/* Button 1: Booking CTA */}
              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2.5 bg-peach hover:bg-peach/90 text-white font-sans text-sm md:text-base font-bold px-6 py-3.5 rounded-full cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <CalendarDays size={18} />
                <span>Đặt lịch khám nhanh</span>
              </button>

              {/* Button 2: Emergency Hotline */}
              <a
                href={`tel:${contact.emergency.replace(/\./g, "")}`}
                className="flex items-center justify-center gap-2.5 bg-white hover:bg-mint text-green-dark font-sans text-sm md:text-base font-bold px-6 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 border-2 border-transparent"
              >
                <Phone size={18} className="text-brand-green animate-pulse" />
                <span>Hotline: {contact.emergency}</span>
              </a>
            </div>

          </div>

        </div>
        </ScrollAnimation>

      </div>
    </section>
  );
}
