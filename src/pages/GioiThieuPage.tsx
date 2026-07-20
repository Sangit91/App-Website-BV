import { useState, useEffect, useRef, MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from "framer-motion";
import { Info, Users, Building2, Award, Heart, ArrowRight, Check, Activity, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
}

function FeatureCard({ item, index, color }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
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

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-green-800/5 transition-all duration-300 h-full flex flex-col"
      >
        {/* Image container with reveal animation */}
        <motion.div
          className="relative h-48 overflow-hidden"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={isInView ? { clipPath: "inset(0% 0 0 0)" } : {}}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
        >
          <motion.img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Icon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.1 + 0.4 }}
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
            transition={{ delay: index * 0.1 + 0.3 }}
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
                transition={{ delay: index * 0.1 + 0.4 + i * 0.08 }}
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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-green-800/5 transition-all duration-300 h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Number badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-brand-green to-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
          >
            {item.num}
          </motion.div>
        </div>

        <div className="p-6 text-center flex-grow">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="font-display font-bold text-lg text-green-dark mb-2"
          >
            {item.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.5 }}
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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

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
          style={{ opacity: heroOpacity, scale: heroScale }}
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
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

      {/* Về Chúng Tôi Section */}
      <section id="ve-chung-toi" className="py-24">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-green-dark mb-4">Về chúng tôi</h2>
            <div className="w-20 h-1 bg-brand-green mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Why Choose */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-green-800/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-peach/20 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-peach" />
                </div>
                <h3 className="font-display font-bold text-xl text-green-dark">Tại sao lại chọn Bệnh viện?</h3>
              </div>

              <ul className="space-y-4 mb-6">
                {whyChooseItems.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-brand-green" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/pages/khamtongquat-1.jpeg"
                  alt="Bệnh viện hiện đại"
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* Right - Partners & Directors */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Partners */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-green-800/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-brand-green" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-green-dark">Đối tác của Bệnh viện</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {partners.map((partner, idx) => (
                    <motion.div
                      key={partner}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-mint/50 rounded-xl p-3 text-center hover:bg-mint transition-colors"
                    >
                      <span className="font-semibold text-green-dark text-sm">{partner}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Directors */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-green-800/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-green-dark">Ban Giám Đốc</h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {directors.map((leader, idx) => (
                    <motion.div
                      key={leader.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-center"
                    >
                      <div className="relative inline-block">
                        <img
                          src={leader.img}
                          alt={leader.name}
                          className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-brand-green/20"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="font-semibold text-ink text-sm">{leader.name}</p>
                      <p className="text-xs text-gray-500">{leader.role}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-green-800/5">
                  <Link
                    to="/so-do-to-chuc"
                    className="inline-flex items-center gap-2 text-brand-green font-semibold hover:text-brand-green/80 transition-colors"
                  >
                    <Info size={18} />
                    Xem sơ đồ tổ chức đầy đủ
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cơ sở vật chất Section */}
      <section id="co-so-vat-chat" className="py-24 bg-mint/30">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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

      {/* WhyChooseUs & Organization */}
      <section className="bg-mint/30 py-24">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10 space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
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
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -6, scale: 1.01 }}
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

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-green-800/5"
          >
            <h3 className="text-2xl font-display font-bold text-green-dark mb-6 text-center">Sơ đồ tổ chức</h3>
            <div className="flex justify-center">
              <Link
                to="/so-do-to-chuc"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-green to-emerald-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                <Building2 size={18} />
                Xem sơ đồ tổ chức
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}