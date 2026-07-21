import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Building2, Users, Shield, Award, ArrowRight, Check, ChevronDown } from "lucide-react";
import Organization from "../components/public/Organization";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reducedMotion;
}

const stats = [
  { value: 15, label: "Năm kinh nghiệm", suffix: "+" },
  { value: 50, label: "Bác sĩ chuyên khoa", suffix: "+" },
  { value: 200, label: "Giường bệnh" },
  { value: 24, label: "Giờ cấp cứu" }
];

const directors = [
  { name: "BS CKII Nguyễn Thống Nhất", role: "Giám đốc", img: "/images/doctors/giamdoc-1.jpeg" },
  { name: "BSCK II Lê Minh Dũng", role: "Phó Giám đốc", img: "/images/doctors/phogiamdoc-1.jpeg" },
  { name: "BS CKII Nguyễn Đình Hoàng", role: "Phó Giám đốc", img: "/images/doctors/phogiamdoc-2.jpeg" }
];

const departments = [
  {
    name: "Khối Hành Chính",
    head: "Ths. Hoàng Văn D",
    staff: 9,
    img: "/images/components/org-1.jpeg"
  },
  {
    name: "Khối Lâm Sàng",
    head: "Gs.Ts. Phạm Thị E",
    staff: 21,
    img: "/images/components/org-2.jpeg"
  },
  {
    name: "Khối Cận Lâm Sàng",
    head: "Bs.Ts. Ngô Văn F",
    staff: 6,
    img: "/images/components/org-3.jpeg"
  }
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <div ref={ref}>{count}{suffix}</div>;
}

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

export default function SoDoToChucPage() {
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOrgExpanded, setIsOrgExpanded] = useState(false);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-green-dark via-green-800 to-brand-green">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingShape className="w-96 h-96 bg-brand-green -top-20 -left-20" delay={0} />
          <FloatingShape className="w-64 h-64 bg-peach -top-10 right-20" delay={1} />
          <FloatingShape className="w-80 h-80 bg-mint bottom-0 left-1/3" delay={2} />
          <FloatingShape className="w-48 h-48 bg-white/10 top-1/3 right-1/4" delay={3} />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px"
            }} />
          </div>
        </div>

        <motion.div
          className="relative z-10 max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10 py-20 w-full"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="text-center">
            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Building2 className="w-4 h-4" />
              <span>Cơ cấu tổ chức bệnh viện</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-display font-bold text-white mb-6"
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Sơ đồ
              </motion.span>
              <motion.span
                className="inline-block ml-3 text-peach"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                tổ chức
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12"
            >
              Cơ cấu tổ chức và hệ thống các khoa phòng của Bệnh viện Đa khoa khu vực Miền Núi Phía Bắc Quảng Nam
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                >
                  <div className="text-4xl font-display font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/70 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          style={{ transform: "translateX(-50%)" }}
          onClick={scrollToContent}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 bg-white rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Content Section */}
      <section ref={contentRef} className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          {/* Ban Giám Đốc */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <motion.h2
                className="text-3xl font-display font-bold text-green-dark mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Ban Giám Đốc
              </motion.h2>
              <motion.div
                className="w-20 h-1 bg-brand-green mx-auto rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
            </div>

            <div className="bg-mint/30 rounded-3xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {directors.map((leader, idx) => (
                  <motion.div
                    key={leader.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="bg-white rounded-3xl p-6 text-center shadow-lg border border-green-800/5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="relative inline-block mb-4">
                      <motion.img
                        src={leader.img}
                        alt={leader.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-brand-green/20"
                        referrerPolicy="no-referrer"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-green rounded-full flex items-center justify-center shadow-lg">
                        {idx === 0 ? (
                          <Award className="w-5 h-5 text-white" />
                        ) : (
                          <Shield className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                    <h4 className="font-display font-bold text-lg text-green-dark">{leader.name}</h4>
                    <p className="text-sm text-gray-500">{leader.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Các Khối Chính */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <motion.h2
                className="text-3xl font-display font-bold text-green-dark mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Các Khối Chính
              </motion.h2>
              <motion.div
                className="w-20 h-1 bg-brand-green mx-auto rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {departments.map((dept, idx) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="bg-white border border-green-800/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer hover:border-brand-green/30"
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={dept.img}
                      alt={dept.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      initial={{ scale: 1.2, clipPath: "inset(100% 0 0 0)" }}
                      animate={{ scale: 1, clipPath: "inset(0% 0 0 0)" }}
                      transition={{ duration: 1.2, delay: 0.1 + idx * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      style={{ transformOrigin: "center center" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Department badge */}
                    <motion.div
                      className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                    >
                      <span className="text-green-dark font-semibold text-xs">Khối {idx + 1}</span>
                    </motion.div>

                    <motion.div
                      className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <ArrowRight className="w-4 h-4 text-green-dark" />
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg text-green-dark mb-3 group-hover:text-brand-green transition-colors duration-200">{dept.name}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink/75">Trưởng khối: <strong>{dept.head}</strong></span>
                      <span className="bg-mint px-3 py-1 rounded-full text-brand-green font-semibold">{dept.staff} khoa</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Featured Department Card */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center mb-8">
                <motion.h3
                  className="text-2xl font-display font-bold text-green-dark mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Khối Lâm Sàng - 21 Khoa
                </motion.h3>
                <motion.div
                  className="w-16 h-1 bg-brand-green mx-auto rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gradient-to-br from-mint/50 to-cream-white rounded-3xl p-8">
                {/* Featured Image */}
                <motion.div
                  className="relative h-80 lg:h-96 overflow-hidden rounded-3xl"
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: "inset(0% 0 0 0)" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.img
                    src="/images/components/org-2.jpeg"
                    alt="Khối Lâm Sàng"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.span
                      className="inline-flex bg-brand-green/90 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Khối Lâm Sàng
                    </motion.span>
                    <motion.h4
                      className="text-3xl font-display font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      21 Khoa Phòng
                    </motion.h4>
                    <motion.p
                      className="text-white/80 text-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      Chuyên khoa điều trị đa dạng
                    </motion.p>
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  className="flex flex-col justify-center"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <ul className="space-y-4 mb-6">
                    {["Khoa Nội tổng hợp", "Khoa Ngoại & Cấp cứu", "Khoa Sản - Phụ khoa", "Khoa Nhi & Sơ sinh", "Khoa Tim mạch", "Khoa Hồi sức ICU"].map((item, idx) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-brand-green" />
                        </div>
                        <span className="text-ink">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <button className="inline-flex items-center gap-2 bg-brand-green hover:bg-green-dark text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300 cursor-pointer">
                      <span>Xem tất cả khoa</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Organization Chart - Expandable */}
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="text-center mb-8">
                <motion.h2
                  className="text-3xl font-display font-bold text-green-dark mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Sơ đồ tổ chức chi tiết
                </motion.h2>
                <motion.div
                  className="w-20 h-1 bg-brand-green mx-auto rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                />
              </div>

              {/* Neon Border Expandable Card */}
              <motion.div
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setIsOrgExpanded(!isOrgExpanded)}
              >
                {/* Animated gradient border */}
                <div className="absolute -inset-[2px] rounded-[22px] bg-gradient-to-r from-brand-green via-emerald-300 to-brand-green opacity-50 group-hover:opacity-100 blur-sm transition-all duration-500 animate-pulse" />

                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-[2px] rounded-[22px] bg-gradient-to-r from-brand-green/20 via-emerald-400/30 to-brand-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ filter: 'blur(8px)' }}
                />

                {/* Card background */}
                <div className="relative bg-gradient-to-br from-green-dark via-green-900 to-green-dark rounded-3xl p-[2px]">
                  <div className="bg-gradient-to-br from-green-dark via-green-900 to-green-dark rounded-[20px] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6">
                      <div className="flex items-center gap-5">
                        {/* Animated Icon Container */}
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                          <div className="absolute inset-0 bg-brand-green/50 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <motion.div
                            className="relative w-14 h-14 bg-gradient-to-br from-brand-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-green/30"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <Building2 className="w-7 h-7 text-white" />
                          </motion.div>
                        </motion.div>

                        {/* Text Content */}
                        <div>
                          <motion.h3
                            className="text-xl font-display font-bold text-white mb-1"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            Sơ đồ tổ chức
                          </motion.h3>
                          <p className="text-white/60 text-sm">Cơ cấu tổ chức đầy đủ của bệnh viện</p>
                        </div>
                      </div>

                      {/* Right side - status badge + chevron */}
                      <div className="flex items-center gap-4">
                        {/* Animated dot indicator */}
                        <motion.div
                          className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.span
                            className="w-2 h-2 rounded-full bg-brand-green"
                            animate={isOrgExpanded ? {
                              scale: [1, 1.5, 1],
                              opacity: [1, 0.5, 1]
                            } : { scale: 1, opacity: 1 }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-white/70 text-sm font-medium">
                            {isOrgExpanded ? "Đang mở" : "Nhấn để xem"}
                          </span>
                        </motion.div>

                        {/* Chevron with rotation */}
                        <motion.div
                          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10"
                          animate={{ rotate: isOrgExpanded ? 180 : 0 }}
                          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <ChevronDown className="w-6 h-6 text-white" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {isOrgExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          {/* Decorative line */}
                          <motion.div
                            className="mx-8 h-px bg-gradient-to-r from-transparent via-brand-green/50 to-transparent"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          />

                          <div className="p-8 pt-6">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                              <Organization />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
        </div>
      </section>
    </Layout>
  );
}