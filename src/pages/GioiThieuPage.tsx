import { useState, useEffect, useRef, MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from "framer-motion";
import { Info, Users, Building2, Award, Heart, ArrowRight, Check, Activity, ChevronDown, X, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
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

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reducedMotion) {
      setCount(value);
      return;
    }
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
  }, [isInView, value, reducedMotion]);

  return <div ref={ref}>{count}{suffix}</div>;
}

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 ${className}`}
      animate={reducedMotion ? {} : {
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1]
      }}
      transition={reducedMotion ? {} : {
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

const whyChooseItems = [
  "Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm",
  "Trang thiết bị y tế hiện đại, tiên tiến",
  "Quy trình khám chữa bệnh chuyên nghiệp",
  "Thái độ phục vụ tận tâm, chu đáo",
  "Chi phí hợp lý, minh bạch"
];

const partners = [
  "BHYT Quảng Nam", "Bảo Việt", "PTI", "PJICO", "Manulife", "Prudential"
];

const directors = [
  { name: "BS CKII Nguyễn Thống Nhất", role: "Giám đốc", img: "/images/doctors/giamdoc-1.jpeg" },
  { name: "BSCK II Lê Minh Dũng", role: "Phó Giám đốc", img: "/images/doctors/phogiamdoc-1.jpeg" },
  { name: "BS CKII Nguyễn Đình Hoàng", role: "Phó Giám đốc", img: "/images/doctors/phogiamdoc-2.jpeg" }
];

const facilities = [
  {
    title: "Cơ sở – Trang thiết bị",
    icon: Building2,
    image: "/images/pages/coso-1.jpeg",
    items: ["5 phòng mổ hiện đại", "200 giường bệnh", "Thiết bị MRI, CT Scanner", "Phòng ICU với 20 giường"]
  },
  {
    title: "Hình ảnh bệnh viện",
    icon: Award,
    image: "/images/pages/coso-2.jpeg",
    items: ["Không gian sạch sẽ, thoáng mát", "Khu vườn cây xanh mát", "Phòng chờ hiện đại", "Khuôn viên rộng 5 hecta"]
  },
  {
    title: "Tiện nghi – Sang trọng",
    icon: Heart,
    image: "/images/pages/coso-2.jpeg",
    items: ["Wifi miễn phí toàn bệnh viện", "Nhà hàng cao cấp", "Khu vui chơi trẻ em", "Bãi đỗ xe rộng rãi"]
  }
];

const careProcesses = [
  {
    num: "1",
    title: "Quy trình chăm sóc khép kín",
    desc: "Từ tiếp nhận đến xuất viện, mỗi bước đều được theo dõi và chăm sóc tận tình",
    img: "/images/pages/khamtongquat-1.jpeg"
  },
  {
    num: "2",
    title: "Hướng dẫn đặt khám nhanh",
    desc: "Đặt lịch khám trực tuyến qua website hoặc hotline, tiết kiệm thời gian chờ đợi",
    img: "/images/pages/timmach-1.jpeg"
  },
  {
    num: "3",
    title: "Hỗ trợ bảo hiểm trực tiếp",
    desc: "Bệnh viện liên kết với nhiều công ty bảo hiểm, hỗ trợ thanh toán trực tiếp",
    img: "/images/pages/daliem-1.jpeg"
  }
];

interface FeatureCardProps {
  item: {
    title: string;
    icon: LucideIcon;
    image: string;
    items: string[];
  };
  index: number;
  color: string;
  onClick: () => void;
}

function FeatureCard({ item, index, color, onClick }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const colorMap: Record<string, { bg: string; text: string }> = {
    green: { bg: "bg-brand-green/10", text: "text-brand-green" },
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" }
  };

  const colors = colorMap[color] || colorMap.green;

  const rotateX = useTransform(mouseY, [-0.5, 0.5], reducedMotion ? [0, 0] : [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], reducedMotion ? [0, 0] : [-8, 8]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={isHovered && !reducedMotion ? { scale: 1.02 } : { scale: 1 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-green-800/5 transition-all duration-300 h-full flex flex-col"
      >
        {/* Image container with reveal animation */}
        <motion.div
          className="relative h-48 overflow-hidden"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={isInView ? { clipPath: "inset(0% 0 0 0)" } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : index * 0.1 + 0.2 }}
        >
          <motion.img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            animate={isInView ? { scale: reducedMotion ? 1 : [1.2, 1] } : {}}
            transition={{ duration: reducedMotion ? 0 : 1.2, delay: reducedMotion ? 0 : index * 0.1 + 0.2 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Icon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: reducedMotion ? 0 : index * 0.1 + 0.4 }}
            className={`absolute top-4 left-4 ${colors.bg} ${colors.text} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm`}
          >
            <item.icon className="w-6 h-6" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          <motion.h3
            className="font-display font-bold text-lg text-green-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: reducedMotion ? 0 : index * 0.1 + 0.3 }}
          >
            {item.title}
          </motion.h3>

          {/* Checklist items with staggered animation */}
          <div className="space-y-2 flex-grow">
            {item.items.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: reducedMotion ? 0 : index * 0.1 + 0.4 + i * 0.08 }}
                className="flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-brand-green" />
                </div>
                <span className="text-ink/75 text-sm">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ProcessCardProps {
  item: typeof careProcesses[0];
  index: number;
}

function ProcessCard({ item, index }: ProcessCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useTransform(mouseY, [-0.5, 0.5], reducedMotion ? [0, 0] : [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], reducedMotion ? [0, 0] : [-8, 8]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={isHovered && !reducedMotion ? { scale: 1.02 } : { scale: 1 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-green-800/5 transition-all duration-300 h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            animate={isInView ? { scale: reducedMotion ? 1 : [1.2, 1] } : {}}
            transition={{ duration: reducedMotion ? 0 : 1.2, delay: reducedMotion ? 0 : index * 0.1 + 0.2 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Number badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: reducedMotion ? 0 : index * 0.1 + 0.3 }}
            className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-brand-green to-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
          >
            {item.num}
          </motion.div>
        </div>

        <div className="p-6 text-center flex-grow">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: reducedMotion ? 0 : index * 0.1 + 0.4 }}
            className="font-display font-bold text-lg text-green-dark mb-2"
          >
            {item.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: reducedMotion ? 0 : index * 0.1 + 0.5 }}
            className="text-ink/75 text-sm"
          >
            {item.desc}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GioiThieuPage() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{ title: string; icon: LucideIcon; image: string; items: string[] } | null>(null);
  const [selectedValue, setSelectedValue] = useState<{ image: string; icon: typeof Heart; title: string; desc: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <Layout>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-green-dark via-green-800 to-brand-green">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-300 via-green-400 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-teal-400 via-green-600 to-transparent" />
        </div>

        {/* Floating shapes */}
        <FloatingShape className="w-96 h-96 bg-brand-green top-10 -left-20" delay={0} />
        <FloatingShape className="w-64 h-64 bg-emerald-400 top-40 right-20" delay={2} />
        <FloatingShape className="w-48 h-48 bg-teal-300 bottom-20 left-1/3" delay={4} />
        <FloatingShape className="w-32 h-32 bg-mint bottom-40 right-1/4" delay={1} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <motion.div
          className="relative max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10 py-20 w-full"
          style={{ opacity: reducedMotion ? 1 : heroOpacity, scale: reducedMotion ? 1 : heroScale }}
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Info className="w-4 h-4" />
              <span>Giới thiệu Bệnh viện</span>
            </motion.div>

            {/* Title with split animation */}
            <motion.h1
              className="text-5xl md:text-6xl font-display font-bold text-white mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Về
              </motion.span>
              <motion.span
                className="inline-block ml-3 text-peach"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Chúng Tôi
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-white/80 text-lg md:text-xl leading-relaxed mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Bệnh viện Đa khoa khu vực Miền Núi Phía Bắc Quảng Nam - Nơi mang đến dịch vụ y tế chất lượng cao cho người dân
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
                >
                  <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
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
          animate={reducedMotion ? {} : { y: [0, 10, 0] }}
          transition={reducedMotion ? {} : { duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 bg-white rounded-full"
              animate={reducedMotion ? {} : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={reducedMotion ? {} : { duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Về Chúng Tôi Section */}
      <section ref={contentRef} id="ve-chung-toi" className="py-24">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2
              className="text-4xl font-display font-bold text-green-dark mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Về chúng tôi
            </motion.h2>
            <motion.div
              className="w-20 h-1 bg-brand-green mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          {/* Summary Cards - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Award, label: "Kinh nghiệm", value: "15+ năm", color: "bg-peach/20 text-peach" },
              { icon: Users, label: "Bác sĩ", value: "50+ chuyên khoa", color: "bg-brand-green/10 text-brand-green" },
              { icon: Heart, label: "Giường bệnh", value: "200+ giường", color: "bg-blue-50 text-blue-600" }
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-green-800/5 text-center"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-lg text-green-dark mb-1">{item.value}</h3>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Expandable Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-mint/30 rounded-3xl p-8"
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between mb-6 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-brand-green" />
                <span className="font-display font-bold text-lg text-green-dark">Thông tin chi tiết</span>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-green-dark" />
              </motion.div>
            </button>

            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Why Choose */}
                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="font-display font-bold text-lg text-green-dark mb-4">Tại sao chọn Bệnh viện?</h4>
                      <ul className="space-y-3">
                        {whyChooseItems.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-brand-green" />
                            </div>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Partners */}
                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="font-display font-bold text-lg text-green-dark mb-4">Đối tác Bảo hiểm</h4>
                      <div className="flex flex-wrap gap-3">
                        {partners.map((partner, idx) => (
                          <motion.span
                            key={partner}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-mint/50 px-4 py-2 rounded-full text-green-dark font-semibold text-sm"
                          >
                            {partner}
                          </motion.span>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-green-800/5">
                        <h4 className="font-display font-bold text-lg text-green-dark mb-4">Ban Giám Đốc</h4>
                        <div className="flex justify-center gap-6">
                          {directors.map((leader, idx) => (
                            <motion.div
                              key={leader.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + idx * 0.1 }}
                              className="text-center"
                            >
                              <img
                                src={leader.img}
                                alt={leader.name}
                                className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-2 border-brand-green/20"
                                referrerPolicy="no-referrer"
                              />
                              <p className="font-semibold text-ink text-xs">{leader.name}</p>
                              <p className="text-gray-400 text-[10px]">{leader.role}</p>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Link
                            to="/so-do-to-chuc"
                            className="inline-flex items-center gap-2 text-brand-green font-semibold text-sm hover:text-brand-green/80 transition-colors"
                          >
                            <Info size={14} />
                            Xem sơ đồ tổ chức đầy đủ
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Cơ sở vật chất Section */}
      <section id="co-so-vat-chat" className="py-24 bg-mint/30">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-green-dark mb-4">Cơ sở vật chất</h2>
            <div className="w-20 h-1 bg-brand-green mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility, idx) => (
              <FeatureCard
                item={facility}
                index={idx}
                color={["green", "blue", "purple"][idx]}
                onClick={() => setSelectedFeature(facility)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quy trình chăm sóc Section */}
      <section id="quy-trinh-cham-soc" className="py-24">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-green-dark mb-4">Quy trình chăm sóc</h2>
            <div className="w-20 h-1 bg-brand-green mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {careProcesses.map((item, idx) => (
              <div key={item.num}>
                <ProcessCard item={item} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhyChooseUs */}
      <section className="bg-mint/30 py-24">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-green-dark mb-4">Tại sao chọn chúng tôi?</h2>
              <div className="w-20 h-1 bg-brand-green mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  image: "/images/components/why-choose-1.jpeg",
                  icon: Activity,
                  title: "Đội ngũ bác sĩ chuyên môn cao",
                  desc: "100% bác sĩ có trình độ sau đại học, giàu kinh nghiệm và y đức"
                },
                {
                  image: "/images/components/why-choose-2.jpeg",
                  icon: Building2,
                  title: "Trang thiết bị hiện đại",
                  desc: "Hệ thống MRI, CT Scanner, máy nội soi Olympus thế hệ mới"
                },
                {
                  image: "/images/pages/coso-1.jpeg",
                  icon: Heart,
                  title: "Quy trình chuyên nghiệp",
                  desc: "Quy trình khám chữa bệnh chuẩn quốc tế, an toàn và hiệu quả"
                },
                {
                  image: "/images/pages/khamtongquat-1.jpeg",
                  icon: Users,
                  title: "Thái độ phục vụ tận tâm",
                  desc: "Chăm sóc người bệnh như người nhà, 24/7 mọi lúc mọi nơi"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                const colors = [
                  "from-brand-green/80 to-green-800/90",
                  "from-blue-600/80 to-blue-800/90",
                  "from-peach/80 to-orange-700/90",
                  "from-purple-600/80 to-purple-800/90"
                ];
                const iconBg = ["bg-brand-green/20", "bg-blue-100", "bg-peach/30", "bg-purple-100"];
                const iconColor = ["text-brand-green", "text-blue-600", "text-peach", "text-purple-600"];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => setSelectedValue(item)}
                    className="group relative overflow-hidden rounded-3xl shadow-lg cursor-pointer"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors[idx]} opacity-90 transition-opacity duration-300 group-hover:opacity-80`} />
                    </div>

                    {/* Content */}
                    <div className="relative p-8 min-h-[280px] flex flex-col justify-end">
                      {/* Icon */}
                      <div className={`absolute top-6 left-6 w-14 h-14 ${iconBg[idx]} rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className={`w-7 h-7 ${iconColor[idx]}`} />
                      </div>

                      {/* Badge */}
                      <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        0{idx + 1}
                      </div>

                      {/* Text */}
                      <div>
                        <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-peach transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      {/* Bottom decorative line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sơ đồ tổ chức Section */}
      <section id="so-do-to-chuc" className="py-24">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl font-display font-bold text-green-dark mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Sơ đồ tổ chức
              </motion.h2>
              <motion.div
                className="w-20 h-1 bg-brand-green mx-auto rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
            </div>

            <div className="bg-mint/30 rounded-3xl p-8">
              <Organization />
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedFeature && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-cream-white rounded-[28px] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
              <div className="bg-green-dark px-6 py-4 text-white flex justify-between items-center shrink-0 border-b border-brand-green/20">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-peach" />
                  <span className="font-display font-bold text-sm tracking-wide text-gray-200">Cơ sở vật chất</span>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-10 flex-grow bg-cream-white">
                <div className="max-w-xl mx-auto space-y-6">
                  {selectedFeature.image && (
                    <div className="w-full h-56 rounded-2xl overflow-hidden">
                      <img src={selectedFeature.image} alt={selectedFeature.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div>
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-green-dark leading-tight">{selectedFeature.title}</h1>
                    <div className="w-16 h-1 bg-brand-green rounded-full mt-3" />
                  </div>
                  <ul className="space-y-3">
                    {selectedFeature.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-3 text-ink text-[15px]">
                        <Check size={16} className="text-brand-green mt-0.5 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100 shrink-0">
                <button onClick={() => setSelectedFeature(null)} className="px-5 py-2 rounded-full bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold cursor-pointer transition-all">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedValue && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-cream-white rounded-[28px] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
              <div className="bg-green-dark px-6 py-4 text-white flex justify-between items-center shrink-0 border-b border-brand-green/20">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-peach" />
                  <span className="font-display font-bold text-sm tracking-wide text-gray-200">Giá trị cốt lõi</span>
                </div>
                <button
                  onClick={() => setSelectedValue(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-10 flex-grow bg-cream-white">
                <div className="max-w-xl mx-auto space-y-6">
                  {selectedValue.image && (
                    <div className="w-full h-56 rounded-2xl overflow-hidden">
                      <img src={selectedValue.image} alt={selectedValue.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div>
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-green-dark leading-tight">{selectedValue.title}</h1>
                    <div className="w-16 h-1 bg-brand-green rounded-full mt-3" />
                  </div>
                  <p className="text-ink text-[15px] leading-relaxed">{selectedValue.desc}</p>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100 shrink-0">
                <button onClick={() => setSelectedValue(null)} className="px-5 py-2 rounded-full bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold cursor-pointer transition-all">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}