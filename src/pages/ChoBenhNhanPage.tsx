import { useState, useEffect, useRef, MouseEvent, ElementType } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from "framer-motion";
import { FileText, MapPin, Pill, Users, Search, Clipboard, DollarSign, Bed, Calendar, Phone, ExternalLink, Check, Heart, Map, FileSearch } from "lucide-react";
import PatientPortalSection from "../components/public/PatientPortalSection";
import RecordRequestModal from "../components/public/RecordRequestModal";
import FeedbackModal from "../components/public/FeedbackModal";
import MapModal from "../components/public/MapModal";
import DrugLookupModal from "../components/public/DrugLookupModal";
import InpatientGuideModal from "../components/public/InpatientGuideModal";
import OutpatientGuideModal from "../components/public/OutpatientGuideModal";
import ServicesModal from "../components/public/ServicesModal";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AnimatedCounter } from "../hooks/AnimatedCounter";
import { FloatingShape } from "../hooks/FloatingShape";

const SECTIONS = [
  { key: "chi-phi-dia-diem", title: "Chi phí & Địa điểm", icon: MapPin, color: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50", textColor: "text-blue-600" },
  { key: "huong-dan-tien-ich", title: "Hướng dẫn tiện ích", icon: Users, color: "from-emerald-500 to-teal-600", bgLight: "bg-emerald-50", textColor: "text-emerald-600" },
  { key: "cong-thong-tin", title: "Cổng thông tin", icon: Search, color: "from-purple-500 to-pink-600", bgLight: "bg-purple-50", textColor: "text-purple-600" }
];

const sectionData: Record<string, { heroImage: string; description: string; items: ItemData[] }> = {
  "chi-phi-dia-diem": {
    heroImage: "/images/pages/hero-chi-phi.jpeg",
    description: "Thông tin về chi phí điều trị và địa điểm bệnh viện",
    items: [
      { name: "Chi phí điều trị công khai", desc: "Bảng giá dịch vụ y tế niêm yết công khai", action: "Xem bảng giá", icon: DollarSign, img: "/images/pages/chiphi-1.jpeg", highlight: true },
      { name: "Cơ sở điều trị", desc: "107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng", action: "Bản đồ", icon: MapPin, img: "/images/pages/coso-1.jpeg" },
      { name: "Danh mục thuốc BHYT", desc: "Danh mục thuốc được bảo hiểm y tế chi trả", action: "Tra cứu", icon: Pill, img: "/images/pages/duoc-1.jpeg" }
    ]
  },
  "huong-dan-tien-ich": {
    heroImage: "/images/pages/hero-tongquat.jpeg",
    description: "Hướng dẫn các tiện ích dành cho bệnh nhân",
    items: [
      { name: "Dịch vụ điều trị", desc: "Hướng dẫn các dịch vụ y tế tại bệnh viện", action: "Tìm hiểu thêm", icon: FileText, img: "/images/pages/khamtongquat-1.jpeg", highlight: true },
      { name: "Dành cho bệnh nhân nội trú", desc: "Quy định nhập viện, thăm nom, ăn ở", action: "Xem hướng dẫn", icon: Bed, img: "/images/pages/coso-2.jpeg" },
      { name: "Dành cho thăm khám ngoại trú", desc: "Quy trình đăng ký, khám bệnh, nhận kết quả", action: "Xem hướng dẫn", icon: Calendar, img: "/images/pages/bacsi-1.jpeg" }
    ]
  },
  "cong-thong-tin": {
    heroImage: "/images/pages/hero-congthongtin.jpeg",
    description: "Các cổng thông tin và tra cứu trực tuyến",
    items: [
      { name: "Tra cứu bệnh sử online", desc: "Xem lịch sử khám bệnh, kết quả xét nghiệm", action: "Đăng nhập", icon: Clipboard, img: "/images/pages/timmach-1.jpeg", highlight: true },
      { name: "Yêu cầu trích sao hồ sơ", desc: "Lấy bản sao hồ sơ y tế, giấy chứng nhận", action: "Gửi yêu cầu", icon: FileSearch, img: "/images/pages/hoso-1.jpeg" },
      { name: "Góp ý chất lượng phục vụ", desc: "Đóng góp ý kiến để cải thiện dịch vụ", action: "Gửi góp ý", icon: Phone, img: "/images/pages/bacsi-1.jpeg" }
    ]
  }
};

const stats = [
  { value: 24, label: "Giờ cấp cứu" },
  { value: 100, label: "Bệnh nhân", suffix: "+" },
  { value: 15, label: "Năm kinh nghiệm" },
  { value: 50, label: "Bác sĩ", suffix: "+" }
];

type ItemData = {
  name: string;
  desc: string;
  action: string;
  icon: ElementType;
  img: string;
  highlight?: boolean;
  onAction?: () => void;
};

interface InfoCardProps {
  item: ItemData;
  dept: typeof SECTIONS[0];
  index: number;
}

function InfoCard({ item, dept, index }: InfoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;
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
      onClick={item.onAction}
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
            background: `radial-gradient(circle at 50% 50%, ${dept.textColor.includes("blue") ? "rgba(59,130,246,0.12)" : dept.textColor.includes("emerald") ? "rgba(16,185,129,0.12)" : "rgba(147,51,234,0.12)"} 0%, transparent 70%)`
          }}
        />

        <motion.div
          className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`}
          style={{
            padding: "2px",
            background: `linear-gradient(${dept.color.includes("blue") ? "135deg, #3b82f6, #6366f1" : dept.color.includes("emerald") ? "135deg, #10b981, #14b8a6" : "135deg, #a855f7, #ec4899"}, transparent)`,
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
        </div>

        <div className="p-6 flex-grow flex flex-col relative" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 ${dept.bgLight} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className={`w-6 h-6 ${dept.textColor}`} />
            </div>
            <div>
              <motion.h3
                className="font-display font-bold text-lg text-green-dark mb-1 group-hover:text-brand-green transition-colors duration-300"
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
            </div>
          </div>
          <div className={`mt-auto flex items-center gap-2 ${dept.textColor} font-semibold text-sm`}>
            {item.action}
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChoBenhNhanPage() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("chi-phi-dia-diem");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isRecordRequestOpen, setIsRecordRequestOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isDrugLookupOpen, setIsDrugLookupOpen] = useState(false);
  const [isInpatientGuideOpen, setIsInpatientGuideOpen] = useState(false);
  const [isOutpatientGuideOpen, setIsOutpatientGuideOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrollToPortal, setScrollToPortal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
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
      if (sectionData[tab as keyof typeof sectionData]) {
        setActiveTab(tab);
      }
    }
  }, [location]);

  useEffect(() => {
    if (scrollToPortal && portalRef.current) {
      portalRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setScrollToPortal(false);
    }
  }, [scrollToPortal]);

  const handleTraCuuBenhSu = () => {
    setActiveTab("cong-thong-tin");
    setScrollToPortal(true);
  };

  const handleRecordRequest = () => {
    setIsRecordRequestOpen(true);
  };

  const handleFeedback = () => {
    setIsFeedbackOpen(true);
  };

  const handleOpenMap = () => {
    setIsMapOpen(true);
  };

  const handleOpenDrugLookup = () => {
    setIsDrugLookupOpen(true);
  };

  const handleOpenInpatientGuide = () => {
    setIsInpatientGuideOpen(true);
  };

  const handleOpenOutpatientGuide = () => {
    setIsOutpatientGuideOpen(true);
  };

  const handleOpenServices = () => {
    setIsServicesOpen(true);
  };

  const getItemOnAction = (itemName: string) => {
    if (activeTab === "chi-phi-dia-diem") {
      if (itemName === "Cơ sở điều trị") return handleOpenMap;
      if (itemName === "Danh mục thuốc BHYT") return handleOpenDrugLookup;
    }
    if (activeTab === "huong-dan-tien-ich") {
      if (itemName === "Dịch vụ điều trị") return handleOpenServices;
      if (itemName === "Dành cho bệnh nhân nội trú") return handleOpenInpatientGuide;
      if (itemName === "Dành cho thăm khám ngoại trú") return handleOpenOutpatientGuide;
    }
    return undefined;
  };

  const currentSection = SECTIONS.find(d => d.key === activeTab)!;
  const currentData = sectionData[activeTab as keyof typeof sectionData];
  const featuredItem = currentData.items.find(item => item.highlight) || currentData.items[0];

  return (
    <Layout>
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-green-dark via-brand-green to-emerald-700">
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
              <Heart className="w-4 h-4" />
              <span>Chăm sóc bệnh nhân tận tâm</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-display font-bold text-white mb-6"
            >
              <motion.span className="inline-block" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                Dành cho
              </motion.span>
              <motion.span className="inline-block ml-3 text-peach" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                bệnh nhân
              </motion.span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="text-white/80 text-lg max-w-2xl mx-auto mb-12">
              Thông tin hướng dẫn và dịch vụ hỗ trợ bệnh nhân tốt nhất
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
            {SECTIONS.map(sec => {
              const Icon = sec.icon;
              const isActive = activeTab === sec.key;
              return (
                <motion.button key={sec.key} onClick={() => setActiveTab(sec.key)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${isActive ? `bg-gradient-to-r ${sec.color} text-white shadow-lg` : "bg-gray-100 text-ink/70 hover:bg-gray-200"}`}>
                  <Icon className="w-5 h-5" />
                  <span>{sec.title}</span>
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
              {activeTab === "cong-thong-tin" ? (
                <motion.div ref={portalRef} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{
                      background: `linear-gradient(135deg, rgba(147,51,234,0.05) 0%, transparent 50%)`,
                      borderRadius: "24px"
                    }}>
                      <motion.div
                        className="relative h-80 lg:h-96 overflow-hidden rounded-3xl cursor-pointer"
                        initial={{ clipPath: "inset(100% 0 0 0)" }}
                        animate={{ clipPath: "inset(0% 0 0 0)" }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={handleTraCuuBenhSu}
                      >
                        <motion.img src={featuredItem.img} alt={featuredItem.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <motion.span className="inline-flex bg-purple-100 text-purple-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                            {currentSection.title}
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
                          Thông tin hữu ích
                        </motion.h3>
                        <motion.p initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-ink/70 leading-relaxed mb-6">
                          {currentData.description}
                        </motion.p>
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
                          {["Hỗ trợ 24/7 qua hotline", "Quy trình đơn giản", "Thông tin minh bạch", "Chăm sóc tận tâm"].map((item, idx) => (
                            <motion.div key={item} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-ink/80 font-medium">{item}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </div>

                    <PatientPortalSection
                      onOpenRecordRequest={handleRecordRequest}
                      onOpenFeedback={handleFeedback}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {[
                      { name: "Yêu cầu trích sao hồ sơ", desc: "Lấy bản sao hồ sơ y tế, giấy chứng nhận", action: "Gửi yêu cầu", icon: FileSearch, img: "/images/pages/hoso-1.jpeg", onAction: handleRecordRequest },
                      { name: "Góp ý chất lượng phục vụ", desc: "Đóng góp ý kiến để cải thiện dịch vụ", action: "Gửi góp ý", icon: Phone, img: "/images/pages/bacsi-1.jpeg", onAction: handleFeedback }
                    ].map((item, idx) => (
                      <InfoCard item={item} dept={currentSection} index={idx} />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{
                      background: `linear-gradient(135deg, ${currentSection.textColor.includes("blue") ? "rgba(59,130,246,0.05)" : currentSection.textColor.includes("emerald") ? "rgba(16,185,129,0.05)" : "rgba(147,51,234,0.05)"} 0%, transparent 50%)`,
                      borderRadius: "24px"
                    }}>
                      <motion.div className="relative h-80 lg:h-96 overflow-hidden rounded-3xl" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
                        <motion.img src={featuredItem.img} alt={featuredItem.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <motion.span className={`inline-flex ${currentSection.bgLight} ${currentSection.textColor} text-xs font-bold px-4 py-1.5 rounded-full mb-4`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                            {currentSection.title}
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
                          Thông tin hữu ích
                        </motion.h3>
                        <motion.p initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-ink/70 leading-relaxed mb-6">
                          {currentData.description}
                        </motion.p>
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
                          {["Hỗ trợ 24/7 qua hotline", "Quy trình đơn giản", "Thông tin minh bạch", "Chăm sóc tận tâm"].map((item, idx) => (
                            <motion.div key={item} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }} className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentSection.color} flex items-center justify-center`}>
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-ink/80 font-medium">{item}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentData.items.filter(item => !item.highlight).map((item, idx) => {
                      const itemWithAction = {
                        ...item,
                        onAction: item.onAction || getItemOnAction(item.name)
                      };
                      return (
                        <InfoCard
                          item={itemWithAction}
                          dept={currentSection}
                          index={idx}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <RecordRequestModal
        isOpen={isRecordRequestOpen}
        onClose={() => setIsRecordRequestOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />

      <DrugLookupModal
        isOpen={isDrugLookupOpen}
        onClose={() => setIsDrugLookupOpen(false)}
      />

      <InpatientGuideModal
        isOpen={isInpatientGuideOpen}
        onClose={() => setIsInpatientGuideOpen(false)}
      />

      <OutpatientGuideModal
        isOpen={isOutpatientGuideOpen}
        onClose={() => setIsOutpatientGuideOpen(false)}
      />

      <ServicesModal
        isOpen={isServicesOpen}
        onClose={() => setIsServicesOpen(false)}
      />
    </Layout>
  );
}