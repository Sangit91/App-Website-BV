import { useState, useEffect, useRef, MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from "framer-motion";
import { Calendar, Home, Syringe, Shield, Heart, Truck, Sparkles, Baby, Plane, Stethoscope, ArrowRight, ChevronRight, Check } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AnimatedCounter } from "../hooks/AnimatedCounter";
import { FloatingShape } from "../hooks/FloatingShape";

const SERVICE_CATEGORIES = [
  { key: "dich-vu-tron-goi", title: "Dịch vụ trọn gói", icon: Calendar, color: "from-orange-500 to-amber-600", bgLight: "bg-orange-50", textColor: "text-orange-600" },
  { key: "tai-nha-van-chuyen", title: "Tại nhà & Vận chuyển", icon: Home, color: "from-blue-500 to-cyan-600", bgLight: "bg-blue-50", textColor: "text-blue-600" },
  { key: "tiem-chung", title: "Tiêm chủng", icon: Syringe, color: "from-green-500 to-emerald-600", bgLight: "bg-green-50", textColor: "text-green-600" },
  { key: "bao-hiem-vip", title: "Bảo hiểm & VIP", icon: Shield, color: "from-purple-500 to-violet-600", bgLight: "bg-purple-50", textColor: "text-purple-600" },
  { key: "goi-kham", title: "Gói khám", icon: Heart, color: "from-pink-500 to-rose-600", bgLight: "bg-pink-50", textColor: "text-pink-600" }
];

const categoryData = {
  "dich-vu-tron-goi": {
    heroImage: "/images/pages/hero-dichvu.jpeg",
    description: "Các gói dịch vụ y tế toàn diện từ khám định kỳ đến điều trị chuyên sâu",
    items: [
      { name: "Dịch vụ trọn gói", desc: "Gói khám, điều trị toàn diện", price: "Từ 5.000.000đ", img: "/images/pages/vip-1.jpeg", highlight: true },
      { name: "Kiến thức thai sản", desc: "Tư vấn, chăm sóc mẹ và bé", price: "Miễn phí", img: "/images/pages/sanphukhoa-1.jpeg" },
      { name: "Điều trị vô sinh, hiếm muộn", desc: "IVF, IUI, các phương pháp hỗ trợ", price: "Từ 15.000.000đ", img: "/images/pages/timmach-1.jpeg" },
      { name: "Dịch vụ thai sản và sinh trọn gói", desc: "Theo dõi thai kỳ, sinh con", price: "Từ 25.000.000đ", img: "/images/pages/sanphukhoa-1.jpeg" }
    ]
  },
  "tai-nha-van-chuyen": {
    heroImage: "/images/pages/hero-tainha.jpeg",
    description: "Dịch vụ chăm sóc tại nhà và vận chuyển bệnh nhân an toàn",
    items: [
      { name: "Dịch vụ khám tại nhà", desc: "Bác sĩ đến tận nhà khám", price: "Từ 500.000đ", img: "/images/pages/tainha-1.jpeg", highlight: true },
      { name: "Dịch vụ vận chuyển cấp cứu", desc: "Xe cấp cứu 24/7", price: "Theo km", img: "/images/pages/vanchuyen-1.jpeg" },
      { name: "Khám bệnh và xét nghiệm tại nhà", desc: "Lấy mẫu xét nghiệm tại nhà", price: "Từ 300.000đ", img: "/images/pages/xetnghiem-1.jpeg" }
    ]
  },
  "tiem-chung": {
    heroImage: "/images/pages/hero-tiemchung.jpeg",
    description: "Đầy đủ các loại vaccine cho trẻ em và người lớn",
    items: [
      { name: "Tiêm chủng – Vaccine", desc: "Đầy đủ các loại vaccine", price: "Từ 200.000đ", img: "/images/pages/tiemchung-1.jpeg", highlight: true },
      { name: "Dịch vụ tiêm chủng", desc: "Tiêm tại bệnh viện hoặc tại nhà", price: "Từ 150.000đ", img: "/images/pages/tiemchung-1.jpeg" },
      { name: "Tiêm vaccine tại Bệnh viện", desc: "Phòng tiêm hiện đại, an toàn", price: "Theo loại vaccine", img: "/images/pages/tiemchung-1.jpeg" },
      { name: "Tư vấn tiêm chủng trẻ em", desc: "Lịch tiêm, giấy tờ đầy đủ", price: "Miễn phí", img: "/images/pages/nhi-1.jpeg" }
    ]
  },
  "bao-hiem-vip": {
    heroImage: "/images/pages/hero-chi-phi.jpeg",
    description: "Dịch vụ cao cấp và bảo hiểm y tế toàn diện",
    items: [
      { name: "Bảo hiểm Bệnh viện", desc: "Các gói bảo hiểm y tế", price: "Theo gói", img: "/images/pages/bhyt-1.jpeg", highlight: true },
      { name: "Dịch vụ VIP", desc: "Phòng VIP, bác sĩ riêng", price: "Từ 2.000.000đ/ngày", img: "/images/pages/vip-1.jpeg" },
      { name: "Trung tâm Khám bệnh Quốc tế IMC", desc: "Dịch vụ quốc tế", price: "Liên hệ", img: "/images/pages/bacsi-1.jpeg" },
      { name: "Tour Du lịch – Sức khỏe", desc: "Kết hợp khám và du lịch", price: "Theo tour", img: "/images/pages/muangoi-1.jpeg" },
      { name: "Thẩm mỹ & Spa da liễu", desc: "Làm đẹp, chăm sóc da", price: "Từ 500.000đ", img: "/images/pages/thammy-1.jpeg" }
    ]
  },
  "goi-kham": {
    heroImage: "/images/pages/hero-tongquat.jpeg",
    description: "Các gói khám sức khỏe linh hoạt cho mọi nhu cầu",
    items: [
      { name: "Gói khám sức khỏe định kỳ", desc: "Tổng quát, toàn diện", price: "Từ 1.500.000đ", img: "/images/pages/khamtongquat-1.jpeg", highlight: true },
      { name: "Khám sức khỏe công ty", desc: "Kiểm tra sức khỏi nhân viên", price: "Từ 500.000đ/người", img: "/images/pages/bacsi-1.jpeg" },
      { name: "Khám sức khỏe tổng quát cá nhân", desc: "Gói cơ bản, nâng cao", price: "Từ 800.000đ", img: "/images/pages/khamtongquat-1.jpeg" },
      { name: "Khám xuất khẩu lao động", desc: "Giấy khám sức khỏe chuẩn", price: "Từ 300.000đ", img: "/images/pages/chiphi-1.jpeg" }
    ]
  }
};

const stats = [
  { value: 50, label: "Dịch vụ", suffix: "+" },
  { value: 5000, label: "Bệnh nhân", suffix: "+" },
  { value: 98, label: "Hài lòng", suffix: "%" },
  { value: 24, label: "Giờ hỗ trợ" }
];

interface ServiceCardProps {
  key?: string;
  item: { name: string; desc: string; price: string; img: string };
  dept: typeof SERVICE_CATEGORIES[0];
  index: number;
  onBook?: () => void;
}

function ServiceCard({ item, dept, index, onBook }: ServiceCardProps) {
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
        animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-green-800/5 transition-all duration-300 h-full flex flex-col"
      >
        <motion.div
          className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${dept.textColor.includes("orange") ? "rgba(249,115,22,0.12)" : dept.textColor.includes("blue") ? "rgba(59,130,246,0.12)" : dept.textColor.includes("green") ? "rgba(34,197,94,0.12)" : dept.textColor.includes("purple") ? "rgba(147,51,234,0.12)" : "rgba(236,72,153,0.12)"} 0%, transparent 70%)`
          }}
        />

        <motion.div
          className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`}
          style={{
            padding: "2px",
            background: `linear-gradient(${dept.color.includes("orange") ? "135deg, #f97316, #fbbf24" : dept.color.includes("blue") ? "135deg, #3b82f6, #06b6d4" : dept.color.includes("green") ? "135deg, #22c55e, #10b981" : dept.color.includes("purple") ? "135deg, #a855f7, #8b5cf6" : "135deg, #ec4899, #f43f5e"}, transparent)`,
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
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className={`absolute top-4 left-4 ${dept.bgLight} ${dept.textColor} text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}
          >
            {dept.title}
          </motion.div>
          <motion.div
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 transform translate-x-4 transition-all duration-300"
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
          >
            <ArrowRight className="w-4 h-4 text-green-dark" />
          </motion.div>
        </div>

        <div className="p-6 flex-grow flex flex-col relative" style={{ transform: "translateZ(30px)" }}>
          <motion.h3
            className="font-display font-bold text-lg text-green-dark mb-2 group-hover:text-brand-green transition-colors duration-300"
            style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0)" }}
          >
            {item.name}
          </motion.h3>
          <motion.p
            className="text-sm text-ink/70 leading-relaxed flex-grow"
            style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)" }}
          >
            {item.desc}
          </motion.p>
          <motion.div
            className="flex items-center justify-between pt-4 mt-4 border-t border-green-800/5"
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 8, opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-brand-green font-bold">{item.price}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onBook?.(); }}
              className={`px-4 py-2 bg-gradient-to-r ${dept.color} text-white text-sm font-semibold rounded-full hover:shadow-lg transition-all cursor-pointer`}
            >
              Đặt lịch
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DichVuPage() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("dich-vu-tron-goi");
  const heroRef = useRef<HTMLDivElement>(null);
  const tabNavRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const scrollToTabNav = () => {
    tabNavRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (location.hash) {
      const tab = location.hash.replace("#", "");
      if (categoryData[tab as keyof typeof categoryData]) {
        setActiveTab(tab);
      }
    }
  }, [location]);

  const currentCat = SERVICE_CATEGORIES.find(d => d.key === activeTab)!;
  const currentData = categoryData[activeTab as keyof typeof categoryData];
  const featuredItem = currentData.items.find(item => item.highlight) || currentData.items[0];

  return (
    <Layout>
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-green via-green-800 to-green-dark">
        <div className="absolute inset-0 overflow-hidden">
          <FloatingShape className="w-96 h-96 bg-peach -top-20 -left-20" delay={0} />
          <FloatingShape className="w-64 h-64 bg-white/10 -top-10 right-20" delay={1} />
          <FloatingShape className="w-80 h-80 bg-mint bottom-0 left-1/3" delay={2} />
          <FloatingShape className="w-48 h-48 bg-white/5 top-1/3 right-1/4" delay={3} />
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>Dịch vụ y tế chất lượng cao</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-display font-bold text-white mb-6"
            >
              <motion.span className="inline-block" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                Dịch vụ
              </motion.span>
              <motion.span className="inline-block ml-3 text-peach" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                y tế
              </motion.span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="text-white/80 text-lg max-w-2xl mx-auto mb-12">
              Đa dạng dịch vụ chăm sóc sức khỏe chất lượng cao, từ khám bệnh đến điều trị chuyên sâu
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, idx) => (
                <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/70 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

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
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      <section ref={tabNavRef} className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-800/5 shadow-sm">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <div className="flex overflow-x-auto scrollbar-hide py-4 gap-2">
            {SERVICE_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.key;
              return (
                <motion.button key={cat.key} onClick={() => setActiveTab(cat.key)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${isActive ? `bg-gradient-to-r ${cat.color} text-white shadow-lg` : "bg-gray-100 text-ink/70 hover:bg-gray-200"}`}>
                  <Icon className="w-5 h-5" />
                  <span>{cat.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{
                  background: `linear-gradient(135deg, ${currentCat.textColor.includes("orange") ? "rgba(249,115,22,0.05)" : currentCat.textColor.includes("blue") ? "rgba(59,130,246,0.05)" : currentCat.textColor.includes("green") ? "rgba(34,197,94,0.05)" : currentCat.textColor.includes("purple") ? "rgba(147,51,234,0.05)" : "rgba(236,72,153,0.05)"} 0%, transparent 50%)`,
                  borderRadius: "24px"
                }}>
                  <motion.div className="relative h-80 lg:h-96 overflow-hidden rounded-3xl" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
                    <motion.img src={featuredItem.img} alt={featuredItem.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <motion.span className={`inline-flex ${currentCat.bgLight} ${currentCat.textColor} text-xs font-bold px-4 py-1.5 rounded-full mb-4`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                        {currentCat.title}
                      </motion.span>
                      <motion.h2 className="text-3xl font-display font-bold text-white mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                        {featuredItem.name}
                      </motion.h2>
                      <motion.p className="text-white/80 text-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                        {featuredItem.desc}
                      </motion.p>
                    </div>
                  </motion.div>

                  <div className="flex flex-col justify-center p-8">
                    <motion.h3 initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-display font-bold text-green-dark mb-4">
                      Dịch vụ nổi bật
                    </motion.h3>
                    <motion.p initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-ink/70 leading-relaxed mb-6">
                      {currentData.description}
                    </motion.p>
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
                      {["Đội ngũ bác sĩ chuyên môn cao", "Trang thiết bị hiện đại", "Quy trình chuẩn quốc tế", "Hỗ trợ 24/7"].map((item, idx) => (
                        <motion.div key={item} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentCat.color} flex items-center justify-center`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-ink/80 font-medium">{item}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentData.items.filter(item => !item.highlight).map((item, idx) => (
                  <ServiceCard key={item.name} item={item} dept={currentCat} index={idx} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}