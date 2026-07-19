import React from "react";
import { Check, ShieldCheck, HeartHandshake, Award, Sparkles } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section id="gioi-thieu" className="bg-mint py-16 md:py-20">
      <div className="max-w-[1180px] mx-auto px-4 space-y-16 md:space-y-24">
        
        {/* Section Heading */}
        <div className="text-center max-w-[680px] mx-auto">
          <p className="text-brand-green text-xs font-bold uppercase tracking-widest mb-2">GiÃ¡ trá»‹ cá»‘t lÃµi</p>
          <h2 className="font-display font-bold text-[28px] md:text-[32px] text-green-dark">
            VÃ¬ sao nÃªn gá»­i gáº¯m niá»m tin táº¡i BVÄK KV Miá»n NÃºi PhÃ­a Báº¯c Quáº£ng Nam?
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto my-3 rounded-full"></div>
          <p className="text-ink/80 text-sm md:text-base">
            ChÃºng tÃ´i tá»± hÃ o lÃ  Ä‘iá»ƒm tá»±a y táº¿ vá»¯ng cháº¯c hÃ ng Ä‘áº§u cho nhÃ¢n dÃ¢n trong khu vá»±c báº±ng nÄƒng lá»±c chuyÃªn mÃ´n vÃ  tinh tháº§n cá»‘ng hiáº¿n vÆ°á»£t trá»™i.
          </p>
        </div>

        {/* Row 1: Äá»™i ngÅ© chuyÃªn mÃ´n cao (Image Left - Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left: Image (Radius Large - 28px) */}
          <div className="lg:col-span-6 relative">
            <div className="w-full h-[320px] md:h-[400px] overflow-hidden rounded-[28px] shadow-lg">
              <img
                src="/images/components/why-choose-1.jpeg"
                alt="Äá»™i ngÅ© bÃ¡c sÄ© chuyÃªn mÃ´n táº­n tÃ¢m"
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
                <p className="text-xs font-bold text-green-dark">Y Ä‘á»©c lÃ  vÃ ng</p>
                <p className="text-[10px] text-ink/70">KhÃ¡m chá»¯a báº±ng cáº£ cÃ¡i tÃ¢m</p>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="lg:col-span-6 text-left space-y-5">
            <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 text-brand-green px-3.5 py-1 rounded-full text-xs font-bold">
              <Award size={13} />
              <span>ChuyÃªn mÃ´n & Y Ä‘á»©c</span>
            </div>
            <h3 className="font-display font-bold text-[22px] md:text-[24px] text-green-dark leading-snug">
              Äá»™i ngÅ© y bÃ¡c sÄ© Ä‘áº§u ngÃ nh táº­n tÃ¢m, giÃ u y Ä‘á»©c
            </h3>
            <p className="text-ink/80 text-sm md:text-base leading-relaxed">
              CÃ¡c y bÃ¡c sÄ© táº¡i bá»‡nh viá»‡n Ä‘á»u Ä‘Æ°á»£c Ä‘Ã o táº¡o bÃ i báº£n tá»« cÃ¡c trÆ°á»ng Ä‘áº¡i há»c y danh tiáº¿ng trong vÃ  ngoÃ i nÆ°á»›c. Tráº£i qua hÃ ng chá»¥c nÄƒm rÃ¨n nghá», chÃºng tÃ´i khÃ´ng chá»‰ giá»i chuyÃªn mÃ´n mÃ  luÃ´n coi ná»—i Ä‘au cá»§a ngÆ°á»i bá»‡nh nhÆ° ná»—i Ä‘au cá»§a chÃ­nh mÃ¬nh.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "100% bÃ¡c sÄ© cÃ³ trÃ¬nh Ä‘á»™ sau Ä‘áº¡i há»c",
                "Phá»¥c vá»¥ Ã¢n cáº§n, tháº¥u hiá»ƒu bá»‡nh nhÃ¢n",
                "ChÄƒm sÃ³c ngÆ°á»i bá»‡nh chu Ä‘Ã¡o 24/7",
                "Nhiá»‡t huyáº¿t chuyá»ƒn giao cÃ´ng nghá»‡ má»›i"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs md:text-sm font-semibold text-ink/90">
                  <span className="w-5 h-5 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0">
                    <Check size={12} className="stroke-[3px]" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 2: Thiáº¿t bá»‹ hiá»‡n Ä‘áº¡i (Text Left - Image Right on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left: Text Content (Reordered to left for desktop grid layout) */}
          <div className="lg:col-span-6 lg:order-1 text-left space-y-5">
            <div className="inline-flex items-center space-x-1.5 bg-peach/15 text-peach px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles size={13} className="fill-peach/10" />
              <span>CÃ´ng nghá»‡ cao</span>
            </div>
            <h3 className="font-display font-bold text-[22px] md:text-[24px] text-green-dark leading-snug">
              Trang thiáº¿t bá»‹ hiá»‡n Ä‘áº¡i hÃ ng Ä‘áº§u khu vá»±c miá»n nÃºi
            </h3>
            <p className="text-ink/80 text-sm md:text-base leading-relaxed">
              VÆ°á»£t qua rÃ o cáº£n Ä‘á»‹a lÃ½ vÃ¹ng cao, chÃºng tÃ´i khÃ´ng ngá»«ng Ä‘áº§u tÆ° cÃ¡c dÃ²ng mÃ¡y mÃ³c cáº­n lÃ¢m sÃ ng hiá»‡n Ä‘áº¡i báº­c nháº¥t: Há»‡ thá»‘ng chá»¥p cáº¯t lá»›p vi tÃ­nh CT Ä‘a dÃ£y, Cá»™ng hÆ°á»Ÿng tá»« MRI, siÃªu Ã¢m tim mÃ u Doppler 4D, mÃ¡y ná»™i soi Olympus tháº¿ há»‡ má»›i giÃºp cháº©n Ä‘oÃ¡n bá»‡nh chÃ­nh xÃ¡c vÃ  can thiá»‡p nhanh chÃ³ng.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Cháº©n Ä‘oÃ¡n hÃ¬nh áº£nh chÃ­nh xÃ¡c vÆ°á»£t trá»™i",
                "Trang bá»‹ mÃ¡y ná»™i soi Olympus tiÃªn tiáº¿n",
                "Káº¿t quáº£ xÃ©t nghiá»‡m tá»± Ä‘á»™ng hÃ³a nhanh",
                "PhÃ²ng má»• Ã¡p lá»±c Ã¢m tiÃªu chuáº©n quá»‘c táº¿"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs md:text-sm font-semibold text-ink/90">
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
                alt="Trang thiáº¿t bá»‹ y táº¿ hiá»‡n Ä‘áº¡i hÃ ng Ä‘áº§u táº¡i bá»‡nh viá»‡n"
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
                <p className="text-xs font-bold text-green-dark">Chuáº©n quá»‘c táº¿</p>
                <p className="text-[10px] text-ink/70">An toÃ n & vÃ´ trÃ¹ng tuyá»‡t Ä‘á»‘i</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
