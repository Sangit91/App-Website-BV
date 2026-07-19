import React, { useState } from "react";
import { 
  Heart, 
  Baby, 
  Activity, 
  Stethoscope, 
  Layers, 
  Smile, 
  Plus, 
  Minus,
  Sparkles
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { Specialty } from "../../types";

export default function Specialties() {
  const { specialties } = useHospital();
  const [showAll, setShowAll] = useState(false);

  // We can display 4 specialties by default, and expand to 8 when clicked
  const displayedSpecialties = showAll ? specialties : specialties.slice(0, 4);

  // Helper to map icon types to beautiful styled badge containers
  const getIconBadge = (type: string) => {
    switch (type) {
      case "cardiology":
        return {
          bg: "bg-mint",
          iconColor: "text-brand-green",
          icon: <Heart size={24} className="fill-mint" />
        };
      case "obstetrics":
        return {
          bg: "bg-peach/15",
          iconColor: "text-peach",
          icon: <Sparkles size={24} className="fill-peach/10" />
        };
      case "pediatrics":
        return {
          bg: "bg-peach/15",
          iconColor: "text-peach",
          icon: <Baby size={24} />
        };
      case "emergency":
        return {
          bg: "bg-red-50",
          iconColor: "text-red-500",
          icon: <Activity size={24} />
        };
      case "general":
        return {
          bg: "bg-mint",
          iconColor: "text-green-dark",
          icon: <Stethoscope size={24} />
        };
      case "diagnostics":
        return {
          bg: "bg-blue-50",
          iconColor: "text-blue-500",
          icon: <Layers size={24} />
        };
      case "ent":
        return {
          bg: "bg-amber-50",
          iconColor: "text-amber-500",
          icon: <Activity size={24} />
        };
      case "odontology":
        return {
          bg: "bg-cyan-50",
          iconColor: "text-cyan-500",
          icon: <Smile size={24} />
        };
      default:
        return {
          bg: "bg-mint",
          iconColor: "text-brand-green",
          icon: <Stethoscope size={24} />
        };
    }
  };

  return (
    <section id="chuyen-khoa" className="bg-cream-white py-16 md:py-20 border-b border-green-800/10">
      <div className="max-w-[1180px] mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center max-w-[680px] mx-auto mb-12 md:mb-16">
          <p className="text-brand-green text-xs font-bold uppercase tracking-widest mb-2">Hệ thống chuyên môn</p>
          <h2 className="font-display font-bold text-[28px] md:text-[32px] text-green-dark">
            Chuyên Khoa Nổi Bật hàng đầu
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto my-3 rounded-full"></div>
          <p className="text-ink/80 text-sm md:text-base">
            Bệnh viện cung cấp đầy đủ các chuyên khoa sâu với dịch vụ khám chữa bệnh chất lượng cao, tận tâm, giúp bà con vùng cao an tâm gửi gắm sức khỏe.
          </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedSpecialties.map((spec: Specialty) => {
            const badge = getIconBadge(spec.iconType);
            return (
              <div
                key={spec.id}
                className="bg-white border border-green-800/5 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer hover:border-brand-green/30"
              >
                <div>
                  {/* Squircle Badge icon container (Radius Small - 14px, size 50px) */}
                  <div className={`w-[50px] h-[50px] ${badge.bg} ${badge.iconColor} squircle flex items-center justify-center mb-5 shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                    {badge.icon}
                  </div>

                  <h3 className="font-display font-bold text-[18px] md:text-[20px] text-green-dark mb-2.5 group-hover:text-brand-green transition-colors duration-200">
                    {spec.name}
                  </h3>
                  
                  <p className="text-xs md:text-[13px] text-ink/75 leading-relaxed mb-4">
                    {spec.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-green-800/[0.04] text-[12px] text-ink/70 bg-mint/20 p-3 rounded-xl leading-relaxed italic">
                  {spec.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Toggle Button */}
        <div className="text-center mt-12 md:mt-16">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 bg-white hover:bg-brand-green hover:text-white border-2 border-brand-green text-brand-green font-display text-[15px] font-bold px-6 py-2.5 rounded-full cursor-pointer transition-all duration-300 shadow-sm"
          >
            <span>{showAll ? "Thu gọn bớt chuyên khoa" : "Xem tất cả chuyên khoa"}</span>
            {showAll ? <Minus size={16} /> : <Plus size={16} />}
          </button>
        </div>

      </div>
    </section>
  );
}
