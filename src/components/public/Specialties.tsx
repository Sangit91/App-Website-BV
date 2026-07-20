import React, { useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Heart,
  Baby,
  Activity,
  Stethoscope,
  Layers,
  Smile,
  Plus,
  Minus,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { Specialty } from "../../types";

export default function Specialties() {
  const { specialties } = useHospital();
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const displayedSpecialties = showAll ? specialties : specialties.slice(0, 4);

  const getIconBadge = (type: string) => {
    const configs: Record<string, { bg: string; iconColor: string; gradient: string }> = {
      cardiology: { bg: "bg-mint", iconColor: "text-brand-green", gradient: "from-brand-green/20 to-mint/30" },
      obstetrics: { bg: "bg-peach/20", iconColor: "text-peach", gradient: "from-peach/20 to-peach/10" },
      pediatrics: { bg: "bg-peach/20", iconColor: "text-peach", gradient: "from-peach/20 to-peach/10" },
      emergency: { bg: "bg-red-50", iconColor: "text-red-500", gradient: "from-red-100/50 to-red-50/30" },
      general: { bg: "bg-mint", iconColor: "text-green-dark", gradient: "from-brand-green/10 to-mint/20" },
      diagnostics: { bg: "bg-blue-50", iconColor: "text-blue-500", gradient: "from-blue-100/50 to-blue-50/30" },
      ent: { bg: "bg-amber-50", iconColor: "text-amber-500", gradient: "from-amber-100/50 to-amber-50/30" },
      odontology: { bg: "bg-cyan-50", iconColor: "text-cyan-500", gradient: "from-cyan-100/50 to-cyan-50/30" },
    };
    return configs[type] || configs.general;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "cardiology": return <Heart size={24} />;
      case "obstetrics": return <Sparkles size={24} />;
      case "pediatrics": return <Baby size={24} />;
      case "emergency": return <Activity size={24} />;
      case "general": return <Stethoscope size={24} />;
      case "diagnostics": return <Layers size={24} />;
      case "ent": return <Activity size={24} />;
      case "odontology": return <Smile size={24} />;
      default: return <Stethoscope size={24} />;
    }
  };

  return (
    <section id="chuyen-khoa" className="bg-cream-white py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-peach/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1180px] mx-auto px-4 relative z-10">
        {/* Section Heading - Modern & Eye-catching */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-[800px] mx-auto mb-16 relative"
        >
          {/* Floating shapes behind */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[200px] h-[200px]">
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-brand-green/20 to-brand-green/5 rounded-2xl blur-xl"
            />
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-8 right-0 w-12 h-12 bg-gradient-to-br from-peach/20 to-peach/5 rounded-xl blur-lg"
            />
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-dark/10 via-brand-green/10 to-green-dark/10 text-brand-green text-xs font-bold px-5 py-2 rounded-full mb-6 border border-brand-green/20 backdrop-blur-sm shadow-sm"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Layers size={16} />
            </motion.div>
            <span className="relative">
              <span className="relative z-10">Hệ thống chuyên môn</span>
              <span className="absolute inset-0 bg-brand-green/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </motion.div>

          {/* Title with gradient and animation */}
          <h2 className="font-display font-bold text-[32px] md:text-[44px] lg:text-[48px] text-green-dark mb-6 leading-tight">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block"
            >
              Chuyên Khoa
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="inline-block ml-3 md:ml-4"
            >
              <span className="bg-gradient-to-r from-brand-green via-emerald-600 to-brand-green bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                Nổi Bật
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="block h-1.5 bg-gradient-to-r from-brand-green via-brand-green/80 to-peach mt-2 rounded-full origin-left"
              />
            </motion.span>
          </h2>

          {/* Subtitle with typing effect style */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-ink/70 text-base md:text-lg leading-relaxed max-w-[600px] mx-auto"
          >
            <span className="text-brand-green font-semibold">12+ chuyên khoa sâu</span>
            {" "}với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-8 mt-8"
          >
            {[
              { value: "12+", label: "Chuyên khoa" },
              { value: "50+", label: "Bác sĩ" },
              { value: "15K+", label: "Bệnh nhân/năm" }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
                className="text-center"
              >
                <div className="font-display font-bold text-2xl md:text-3xl text-green-dark">{stat.value}</div>
                <div className="text-xs md:text-sm text-ink/60 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedSpecialties.map((spec: Specialty, index: number) => (
            <div key={spec.id}>
              <SpecialtyCard
                spec={spec}
                index={index}
                badge={getIconBadge(spec.iconType)}
                icon={getIcon(spec.iconType)}
              />
            </div>
          ))}
        </div>

        {/* View All Toggle Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-brand-green to-green-dark hover:from-green-dark hover:to-brand-green text-white font-display text-[15px] font-bold px-8 py-3.5 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-green/30 hover:-translate-y-0.5"
          >
            <span>{showAll ? "Thu gọn bớt" : "Xem tất cả chuyên khoa"}</span>
            <motion.div
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showAll ? <Minus size={18} /> : <Plus size={18} />}
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function SpecialtyCard({
  spec,
  index,
  badge,
  icon
}: {
  spec: Specialty;
  index: number;
  badge: { bg: string; iconColor: string; gradient: string };
  icon: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        animate={isInView ? { scale: 1 } : {}}
        whileHover={{ scale: 1.03 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-green-800/5 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-green/20 hover:border-brand-green/30 h-full"
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`}
        />

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col h-full">
          {/* Icon container */}
          <motion.div
            className={`w-[60px] h-[60px] ${badge.bg} ${badge.iconColor} rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
            style={{ transform: "translateZ(30px)" }}
          >
            {icon}
          </motion.div>

          {/* Title */}
          <h3
            className="font-display font-bold text-[18px] md:text-[20px] text-green-dark mb-3 group-hover:text-brand-green transition-colors duration-300"
            style={{ transform: "translateZ(20px)" }}
          >
            {spec.name}
          </h3>

          {/* Description */}
          <p
            className="text-xs md:text-[13px] text-ink/70 leading-relaxed mb-4 flex-grow"
            style={{ transform: "translateZ(15px)" }}
          >
            {spec.description}
          </p>

          {/* Detail footer */}
          <motion.div
            className="mt-auto pt-4 border-t border-green-800/5"
            style={{ transform: "translateZ(10px)" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-ink/60 italic line-clamp-2 flex-1 pr-2">
                {spec.detail}
              </p>
              <motion.div
                className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
              >
                <ArrowRight size={14} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </motion.div>
  );
}