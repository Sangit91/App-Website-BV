import { useState, useEffect, useRef, MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from "framer-motion";
import { Activity, Scissors, Stethoscope, Baby, Microscope, ArrowRight, ChevronRight, X } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AnimatedCounter } from "../hooks/AnimatedCounter";
import { FloatingShape } from "../hooks/FloatingShape";

const DEPARTMENTS = [
  { key: "ngoai-cap-cuu", title: "Ngoại & Cấp cứu", icon: Scissors, color: "from-red-500 to-rose-600", bgLight: "bg-red-50", textColor: "text-red-600" },
  { key: "noi-tong-quat", title: "Nội tổng quát", icon: Stethoscope, color: "from-blue-500 to-cyan-600", bgLight: "bg-blue-50", textColor: "text-blue-600" },
  { key: "san-nhi", title: "Sản & Nhi", icon: Baby, color: "from-pink-500 to-rose-600", bgLight: "bg-pink-50", textColor: "text-pink-600" },
  { key: "can-lam-sang", title: "Cận lâm sàng", icon: Microscope, color: "from-purple-500 to-violet-600", bgLight: "bg-purple-50", textColor: "text-purple-600" }
];

const departmentData = {
  "ngoai-cap-cuu": {
    heroImage: "/images/pages/hero-chuyenkhoa.jpeg",
    items: [
      { name: "Khoa Ngoại chung", desc: "Phẫu thuật tổng quát, cấp cứu ngoại", img: "/images/pages/ngoai-1.jpeg", highlight: true },
      { name: "Khoa Răng Hàm Mặt", desc: "Phẫu thuật răng, hàm, mặt", img: "/images/pages/ranghamach-1.jpeg" },
      { name: "Khoa Tai – Mũi – Họng", desc: "Phẫu thuật tai, mũi, họng", img: "/images/pages/taimuihong-1.jpeg" },
      { name: "Khoa Hồi sức tích cực ICU", desc: "Hồi sức cấp cứu 24/7", img: "/images/pages/icu-1.jpeg" },
      { name: "Khoa ung bướu", desc: "Phẫu thuật, hóa trị, xạ trị", img: "/images/pages/ungbuou-1.jpeg" }
    ]
  },
  "noi-tong-quat": {
    heroImage: "/images/pages/hero-tongquat.jpeg",
    items: [
      { name: "Khoa Nội chung", desc: "Khám và điều trị các bệnh nội khoa", img: "/images/pages/noi-1.jpeg", highlight: true },
      { name: "Khoa Tim mạch", desc: "Tim mạch can thiệp, phẫu thuật", img: "/images/pages/timmach-1.jpeg" },
      { name: "Khoa Nội tiết", desc: "Đái tháo đường, tuyến giáp", img: "/images/pages/timmach-1.jpeg" },
      { name: "Khoa Thận nhân tạo", desc: "Lọc máu, chạy thận nhân tạo", img: "/images/pages/timmach-1.jpeg" },
      { name: "Khoa Cơ Xương Khớp", desc: "Xương khớp, phục hồi chức năng", img: "/images/pages/noi-1.jpeg" },
      { name: "Khoa Da Liễu", desc: "Da liễu, thẩm mỹ da", img: "/images/pages/thammy-1.jpeg" },
      { name: "Khoa Tâm lý & Sức khỏe", desc: "Tâm thần, tâm lý trị liệu", img: "/images/pages/tamly-1.jpeg" }
    ]
  },
  "san-nhi": {
    heroImage: "/images/pages/hero-thaisan.jpeg",
    items: [
      { name: "Khoa Sản phụ khoa", desc: "Mangled sản, phụ khoa", img: "/images/pages/sanphukhoa-1.jpeg", highlight: true },
      { name: "Khoa Nhi & Sơ sinh", desc: "Nhi khoa, sơ sinh", img: "/images/pages/nhi-1.jpeg" },
      { name: "Khoa Thẩm mỹ và chăm sóc trị liệu", desc: "Thẩm mỹ, spa y tế", img: "/images/pages/thammy-1.jpeg" }
    ]
  },
  "can-lam-sang": {
    heroImage: "/images/pages/hero-chuyenkhoa.jpeg",
    items: [
      { name: "Khoa Dược", desc: "Cung ứng thuốc, tư vấn dược", img: "/images/pages/duoc-1.jpeg", highlight: true },
      { name: "Khoa Mắt", desc: "Mắt, phẫu thuật khúc xạ", img: "/images/pages/mat-1.jpeg" },
      { name: "Khoa Xét nghiệm và Giải phẫu", desc: "Xét nghiệm, giải phẫu bệnh", img: "/images/pages/xetnghiem-1.jpeg" },
      { name: "Khoa Y tế dự phòng", desc: "Phòng bệnh, tiêm chủng", img: "/images/pages/tiemchung-1.jpeg" },
      { name: "Khoa Chẩn đoán hình ảnh", desc: "MRI, CT, X-quang, siêu âm", img: "/images/pages/xetnghiem-1.jpeg" }
    ]
  }
};

const stats = [
  { value: 12, label: "Chuyên khoa", icon: Activity },
  { value: 50, label: "Bác sĩ", suffix: "+" },
  { value: 200, label: "Giường bệnh" },
  { value: 5, label: "Phòng mổ" }
];

interface ServiceCardProps {
  key?: string;
  item: {
    name: string;
    desc: string;
    img: string;
    highlight?: boolean;
  };
  dept: typeof DEPARTMENTS[0];
  index: number;
  onClick: () => void;
}

function ServiceCard({ item, dept, index, onClick }: ServiceCardProps) {
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
      onClick={onClick}
      className="group cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={isHovered && !reducedMotion ? { scale: 1.02 } : { scale: 1 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-green-800/5 transition-all duration-300"
      >
        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${dept.textColor === "text-red-600" ? "rgba(239,68,68,0.15)" : dept.textColor === "text-blue-600" ? "rgba(59,130,246,0.15)" : dept.textColor === "text-pink-600" ? "rgba(236,72,153,0.15)" : "rgba(147,51,234,0.15)"} 0%, transparent 70%)`
          }}
        />

        {/* Glow border animation */}
        <motion.div
          className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`}
          style={{
            padding: "2px",
            background: `linear-gradient(${dept.textColor.includes("red") ? "135deg, #ef4444, #f97316" : dept.textColor.includes("blue") ? "135deg, #3b82f6, #06b6d4" : dept.textColor.includes("pink") ? "135deg, #ec4899, #f43f5e" : "135deg, #a855f7, #6366f1"}, transparent)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude"
          }}
        />

        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            animate={isInView ? { scale: reducedMotion ? 1 : [1.2, 1] } : { scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 1.2, delay: reducedMotion ? 0 : index * 0.1 + 0.2 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reducedMotion ? 0 : index * 0.1 + 0.3 }}
            className={`absolute top-4 left-4 ${dept.bgLight} ${dept.textColor} text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}
          >
            {dept.title}
          </motion.div>

          {/* Arrow icon on hover */}
          <motion.div
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 transform translate-x-4 transition-all duration-300"
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
          >
            <ArrowRight className="w-4 h-4 text-green-dark" />
          </motion.div>
        </div>

        <div className="p-6 relative" style={{ transform: "translateZ(30px)" }}>
          <motion.h3
            className="font-display font-bold text-lg text-green-dark mb-2 group-hover:text-brand-green transition-colors duration-300"
            style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0)" }}
          >
            {item.name}
          </motion.h3>
          <motion.p
            className="text-sm text-ink/70 leading-relaxed"
            style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)" }}
          >
            {item.desc}
          </motion.p>

          {/* Learn more link */}
          <motion.div
            className="flex items-center gap-1 mt-4 text-brand-green font-semibold text-sm opacity-0 transform -translate-y-2 transition-all duration-300"
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          >
            <span>Tìm hiểu thêm</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChuyenKhoaPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("ngoai-cap-cuu");
  const [selectedSpecialty, setSelectedSpecialty] = useState<{ name: string; desc: string; img: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const tabNavRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const scrollToTabNav = () => {
    tabNavRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (location.hash) {
      const tab = location.hash.replace("#", "");
      if (departmentData[tab as keyof typeof departmentData]) {
        setActiveTab(tab);
      }
    }
  }, [location]);

  const currentDept = DEPARTMENTS.find(d => d.key === activeTab)!;
  const currentData = departmentData[activeTab as keyof typeof departmentData];
  const featuredItem = currentData.items.find(item => item.highlight) || currentData.items[0];

  return (
    <Layout>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-green-dark via-green-800 to-brand-green">
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0 z-0" style={reducedMotion ? {} : { opacity: heroOpacity, scale: heroScale }}>
          <img src="/images/pages/hero-chuyenkhoa.jpeg" alt="Chuyên khoa" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-dark/80 via-green-800/70 to-brand-green/60" />
        </motion.div>

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
          style={{ opacity: reducedMotion ? 1 : heroOpacity, scale: reducedMotion ? 1 : heroScale }}
        >
          <div className="text-center">
            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Activity className="w-4 h-4" />
              <span>Hệ thống y tế chuyên sâu</span>
            </motion.div>

            {/* Title with split animation */}
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
                Chuyên
              </motion.span>
              <motion.span
                className="inline-block ml-3 text-peach"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Khoa
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/80 text-lg max-w-2xl mx-auto mb-12"
            >
              Hệ thống chuyên khoa đa dạng, trang thiết bị hiện đại, đội ngũ bác sĩ chuyên môn cao
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors"
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
          onClick={scrollToTabNav}
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

      {/* Tab Navigation */}
      <section ref={tabNavRef} className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-800/5 shadow-sm">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <div className="flex overflow-x-auto scrollbar-hide py-4 gap-2">
            {DEPARTMENTS.map(dept => {
              const Icon = dept.icon;
              const isActive = activeTab === dept.key;
              return (
                <motion.button
                  key={dept.key}
                  onClick={() => setActiveTab(dept.key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? `bg-gradient-to-r ${dept.color} text-white shadow-lg`
                      : "bg-gray-100 text-ink/70 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{dept.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Featured Item */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  style={{
                    background: `linear-gradient(135deg, ${currentDept.textColor.includes("red") ? "rgba(239,68,68,0.05)" : currentDept.textColor.includes("blue") ? "rgba(59,130,246,0.05)" : currentDept.textColor.includes("pink") ? "rgba(236,72,153,0.05)" : "rgba(147,51,234,0.05)"} 0%, transparent 50%)`,
                    borderRadius: "24px"
                  }}
                >
                  {/* Featured Image */}
                  <motion.div
                    className="relative h-80 lg:h-96 overflow-hidden rounded-3xl"
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ clipPath: "inset(0% 0 0 0)" }}
                    transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <motion.img
                      src={featuredItem.img}
                      alt={featuredItem.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      initial={{ scale: reducedMotion ? 1 : 1.2 }}
                      animate={{ scale: reducedMotion ? 1 : 1 }}
                      transition={{ duration: reducedMotion ? 0 : 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <motion.span
                        className={`inline-flex ${currentDept.bgLight} ${currentDept.textColor} text-xs font-bold px-4 py-1.5 rounded-full mb-4`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: reducedMotion ? 0 : 0.5 }}
                      >
                        {currentDept.title}
                      </motion.span>
                      <motion.h2
                        className="text-3xl font-display font-bold text-white mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reducedMotion ? 0 : 0.6 }}
                      >
                        {featuredItem.name}
                      </motion.h2>
                      <motion.p
                        className="text-white/80 text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reducedMotion ? 0 : 0.7 }}
                      >
                        {featuredItem.desc}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Featured Content */}
                  <div className="flex flex-col justify-center p-8">
                    <motion.h3
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-display font-bold text-green-dark mb-4"
                    >
                      Dịch vụ nổi bật
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-ink/70 leading-relaxed mb-6"
                    >
                      Với đội ngũ bác sĩ chuyên môn cao và trang thiết bị hiện đại,
                      chúng tôi cung cấp các dịch vụ y tế chất lượng cao, an toàn và hiệu quả.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3"
                    >
                      {["Đội ngũ bác sĩ giàu kinh nghiệm", "Trang thiết bị hiện đại", "Quy trình chuẩn quốc tế", "Chăm sóc tận tâm 24/7"].map((item, idx) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentDept.color}`} />
                          <span className="text-ink/80 font-medium">{item}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Services Grid */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-display font-bold text-green-dark mb-6"
              >
                Các khoa khác
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentData.items.filter(item => !item.highlight).map((item, idx) => (
                  <ServiceCard key={item.name} item={item} dept={currentDept} index={idx} onClick={() => setSelectedSpecialty(item)} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selectedSpecialty && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-cream-white rounded-[28px] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
              <div className="bg-green-dark px-6 py-4 text-white flex justify-between items-center shrink-0 border-b border-brand-green/20">
                <div className="flex items-center gap-2">
                  <Stethoscope size={18} className="text-peach" />
                  <span className="font-display font-bold text-sm tracking-wide text-gray-200">Chi tiết chuyên khoa</span>
                </div>
                <button
                  onClick={() => setSelectedSpecialty(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-10 flex-grow bg-cream-white">
                <div className="max-w-xl mx-auto space-y-6">
                  {selectedSpecialty.img && (
                    <div className="w-full h-56 rounded-2xl overflow-hidden">
                      <img
                        src={selectedSpecialty.img}
                        alt={selectedSpecialty.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-green-dark leading-tight">
                      {selectedSpecialty.name}
                    </h1>
                    <div className="w-16 h-1 bg-brand-green rounded-full mt-3" />
                  </div>
                  <p className="text-ink text-[15px] leading-relaxed">
                    {selectedSpecialty.desc}
                  </p>
                  <div className="bg-mint/40 border border-brand-green/10 rounded-xl p-5">
                    <p className="text-sm text-green-dark font-medium leading-relaxed">
                      Để được tư vấn và đặt lịch khám với chuyên khoa này, vui lòng liên hệ bệnh viện qua số hotline hoặc đến trực tiếp quầy tiếp nhận.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setSelectedSpecialty(null)}
                  className="px-5 py-2 rounded-full bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold cursor-pointer transition-all"
                >
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