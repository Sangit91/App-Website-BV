import React from "react";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "../data";

export default function Testimonials() {
  // Guard clause: If there is no testimonial data, hide this section completely!
  if (!TESTIMONIALS || TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section id="phan-hoi" className="bg-mint py-16 md:py-20 border-b border-green-800/10">
      <div className="max-w-[1180px] mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center max-w-[680px] mx-auto mb-12 md:mb-16">
          <p className="text-brand-green text-xs font-bold uppercase tracking-widest mb-2">Lời tri ân ấm áp</p>
          <h2 className="font-display font-bold text-[28px] md:text-[32px] text-green-dark">
            Ý Kiến Phản Hồi Từ Người Bệnh
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto my-3 rounded-full"></div>
          <p className="text-ink/80 text-sm md:text-base">
            Không có phần thưởng nào cao quý hơn niềm vui sướng và những lời tri ân, gửi gắm mộc mạc chân tình từ bà con nhân dân sau những ca điều trị thành công.
          </p>
        </div>

        {/* Testimonials Grid - 3 Column cards (Radius Medium - 20px) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testi) => (
            <div
              key={testi.id}
              className="bg-white border border-green-800/[0.03] p-6 rounded-[20px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left relative group overflow-hidden"
            >
              {/* Quote Icon Background Accent */}
              <Quote className="absolute right-6 top-6 text-mint/50 w-12 h-12 -z-10 group-hover:scale-110 transition-transform duration-300" />

              <div className="space-y-4">
                {/* 5-Star Indicator */}
                <div className="flex items-center space-x-1 text-peach">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>

                {/* Testimonial Quote content */}
                <p className="text-xs md:text-[13.5px] text-ink/85 leading-relaxed italic">
                  &quot;{testi.content}&quot;
                </p>
              </div>

              {/* Patient Author card info */}
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-green-800/5">
                {/* Avatar with warm orange colors */}
                <div className="w-10 h-10 rounded-full bg-peach/20 text-peach flex items-center justify-center font-display font-bold text-sm shrink-0">
                  {testi.patientName.charAt(testi.patientName.lastIndexOf(" ") + 1) || testi.patientName.charAt(0)}
                </div>
                
                <div className="leading-tight text-left">
                  <p className="font-sans font-bold text-xs md:text-sm text-green-dark">
                    {testi.patientName}
                  </p>
                  <p className="text-[10px] md:text-[11px] font-semibold text-brand-green">
                    {testi.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
