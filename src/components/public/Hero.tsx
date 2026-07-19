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
            <span>ÄÆ¡n vá»‹ Anh hÃ¹ng Lao Ä‘á»™ng thá»i ká»³ Ä‘á»•i má»›i</span>
          </div>

          {/* Heading H1 (Fredoka rounded, warm feel) */}
          <h1 className="font-display font-bold text-green-dark text-[36px] sm:text-[44px] md:text-[48px] leading-[1.15] tracking-tight">
            ChÄƒm sÃ³c báº±ng <span className="text-brand-green relative inline-block">Cáº£ TrÃ¡i Tim</span> <br />
            Y Ä‘á»©c sÃ¡ng, Sá»©c khá»e an lÃ nh
          </h1>

          {/* Slogan details (Be Vietnam Pro) */}
          <p className="text-ink/80 text-base md:text-lg leading-relaxed max-w-[620px]">
            Bá»‡nh viá»‡n Äa khoa Khu vá»±c Miá»n nÃºi PhÃ­a Báº¯c Quáº£ng Nam cam káº¿t mang láº¡i dá»‹ch vá»¥ y táº¿ ká»¹ thuáº­t cao, thÃ¢n thiá»‡n vÃ  áº¥m Ã¡p. NÆ¡i tÃ¬nh thÆ°Æ¡ng xoa dá»‹u ná»—i Ä‘au, mang niá»m tin sá»©c khá»e Ä‘áº¿n má»i gia Ä‘Ã¬nh.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Primary button */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2.5 bg-brand-green hover:bg-brand-green/90 text-white font-sans text-[15px] font-bold px-7 py-3.5 rounded-full cursor-pointer shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
            >
              <Calendar size={18} />
              <span>Äáº·t lá»‹ch khÃ¡m ngay</span>
            </button>

            {/* Outline button */}
            <button
              onClick={() => onScrollToSection("gioi-thieu")}
              className="flex items-center gap-2 bg-white hover:bg-brand-green/5 border-2 border-mint text-green-dark hover:border-brand-green/30 font-sans text-[15px] font-bold px-7 py-3.5 rounded-full cursor-pointer transition-all duration-300"
            >
              <span>Xem giá»›i thiá»‡u bá»‡nh viá»‡n</span>
              <Play size={14} className="fill-green-dark text-green-dark ml-1" />
            </button>
          </div>

          {/* 3 Real Metric counters */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-green/10 max-w-[580px]">
            <div className="flex flex-col">
              <span className="font-display text-[26px] md:text-[32px] font-bold text-green-dark">22+</span>
              <span className="text-xs md:text-[13px] font-semibold text-ink/75">ChuyÃªn khoa sÃ¢u</span>
            </div>
            <div className="flex flex-col border-l border-brand-green/10 pl-4 md:pl-6">
              <span className="font-display text-[26px] md:text-[32px] font-bold text-green-dark">150+</span>
              <span className="text-xs md:text-[13px] font-semibold text-ink/75">BÃ¡c sÄ© chuyÃªn khoa giá»i</span>
            </div>
            <div className="flex flex-col border-l border-brand-green/10 pl-4 md:pl-6">
              <span className="font-display text-[26px] md:text-[32px] font-bold text-brand-green">200K+</span>
              <span className="text-xs md:text-[13px] font-semibold text-ink/75">LÆ°á»£t khÃ¡m bá»‡nh/nÄƒm</span>
            </div>
          </div>

        </div>

        {/* Right Side: 45% image (Responsive columns) */}
        <div className="lg:col-span-5 relative flex justify-center items-center mt-6 lg:mt-0">
          
          {/* Main Wave Organic Blob holding image */}
          <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] overflow-hidden bg-gradient-to-br from-mint via-brand-green/20 to-peach/20 blob-mask shadow-2xl group">
            <img 
              src="/images/components/hero.jpeg"
              alt="Äá»™i ngÅ© bÃ¡c sÄ© BVÄK Miá»n NÃºi PhÃ­a Báº¯c Quáº£ng Nam"
              className="w-full h-full object-cover brightness-[1.03] group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Floating Card 1: Ticket alert */}
          <div className="absolute top-[10%] left-[-5%] sm:left-[-10%] bg-white/95 backdrop-blur-sm p-3.5 rounded-[20px] shadow-lg border border-brand-green/10 flex items-center space-x-3 animate-bounce-slow max-w-[210px] select-none">
            <div className="w-10 h-10 bg-mint rounded-[14px] flex items-center justify-center text-brand-green shrink-0">
              <CheckCircle size={20} className="fill-mint" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wider text-brand-green font-bold">Äáº·t lá»‹ch khÃ¡m</p>
              <p className="text-xs font-bold text-green-dark">ÄÃ£ xÃ¡c nháº­n thÃ nh cÃ´ng!</p>
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
              &quot;BÃ¡c sÄ© Ã¢n cáº§n, phá»¥c vá»¥ ráº¥t chu Ä‘Ã¡o!&quot;
            </p>
            <span className="text-[10px] font-bold text-brand-green">Chá»‹ Thá»§y - Äáº¡i Lá»™c</span>
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
