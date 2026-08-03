import React, { useState, useMemo, useRef, MouseEvent, ElementType } from "react";
import { motion, useInView, useMotionValue } from "framer-motion";
import { Calendar, ArrowRight, FileText, Layers, ShieldCheck, AlertCircle } from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { NewsItem } from "../../types";
import { DEPARTMENTS } from "../../data";
import { isTenderPost, getTenderStatus, getStatusBadge } from "../../lib/tender";
import NewsDetailModal from "./NewsDetailModal";

interface AnimatedCardProps {
  key?: string;
  children: React.ReactNode;
  index: number;
}

function AnimatedCard({ children, index }: AnimatedCardProps) {
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

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMoveInner = (e: MouseEvent<HTMLDivElement>) => {
    handleMouseMove(e);
    rotateX.set((e.nativeEvent.offsetY / (cardRef.current?.offsetHeight || 1) - 0.5) * 8);
    rotateY.set((e.nativeEvent.offsetX / (cardRef.current?.offsetWidth || 1) - 0.5) * -8);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMoveInner}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); rotateX.set(0); rotateY.set(0); }}
      className="group cursor-pointer"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function News() {
  const { news } = useHospital();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<"news" | "tenders">("news");
  const [activeTenderDept, setActiveTenderDept] = useState<string>("PHÒNG CNTT");

  const handleOpenReader = (item: NewsItem) => {
    setSelectedNews(item);
  };

  const tendersWithStatus = useMemo(() => {
    return news.filter(item => item.isTender).map(item => ({
      ...item,
      tenderStatus: getTenderStatus(item)
    }));
  }, [news]);

  return (
    <section id="tin-tuc" className="bg-cream-white py-16 md:py-20 border-b border-green-800/10">
      <div className="max-w-[1180px] mx-auto px-4">

        <div className="text-center max-w-[680px] mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 bg-mint text-green-dark font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-brand-green/20 mb-3">
            <FileText size={13} className="text-brand-green" /> Cổng thông tin công cộng
          </span>
          <h2 className="font-display font-bold text-[28px] md:text-[32px] text-green-dark">
            Tin Tức Y Khoa & Thông Báo Đấu Thầu
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto my-3 rounded-full"></div>
          <p className="text-ink/80 text-sm md:text-base leading-relaxed">
            Cập nhật nhanh nhất các thông báo mua sắm, mời thầu y tế công khai, cùng kiến thức bảo vệ sức khỏe cộng đồng thường kỳ.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-green-dark/5 p-1 rounded-2xl inline-flex gap-1 border border-green-800/5">
            <button
              onClick={() => setActiveMainTab("news")}
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === "news"
                  ? "bg-green-dark text-white shadow"
                  : "text-green-dark hover:bg-green-dark/5"
              }`}
            >
              <FileText size={14} />
              <span>Bản Tin Y Khoa & Sự Kiện</span>
            </button>
            <button
              onClick={() => setActiveMainTab("tenders")}
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === "tenders"
                  ? "bg-green-dark text-white shadow"
                  : "text-green-dark hover:bg-green-dark/5"
              }`}
            >
              <Layers size={14} />
              <span>Cổng Thông Tin Đấu Thầu</span>
            </button>
          </div>
        </div>

        {activeMainTab === "news" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.filter(item => !item.isTender).map((item, idx) => {
              const isTender = isTenderPost(item);
              return (
                <AnimatedCard key={item.id} index={idx}>
                  <article
                    onClick={() => handleOpenReader(item)}
                    className="bg-white border border-green-800/5 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group h-full text-left cursor-pointer hover:border-brand-green/30"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-mint/20 shrink-0">
                      <motion.img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      />
                      {isTender && (
                        <div className="absolute top-3 left-3 bg-green-dark text-mint font-mono text-[10px] font-bold py-1 px-3 rounded-full flex items-center gap-1.5 shadow">
                          <span className="w-2 h-2 bg-peach rounded-full animate-pulse"></span>
                          MỜI THẦU / KHẨN
                        </div>
                      )}
                    </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide bg-brand-green/10 text-brand-green`}>
                          {item.tag}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-ink/50 font-medium">
                          <Calendar size={13} className="text-brand-green" />
                          <span>{item.date}</span>
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-[15.5px] md:text-[16.5px] text-green-dark leading-snug group-hover:text-brand-green transition-colors duration-200 line-clamp-2 min-h-[44px]">
                        {item.title}
                      </h3>

                      <p className="text-xs md:text-[13px] text-ink/75 leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-green-800/5 flex items-center justify-between text-xs font-bold text-brand-green uppercase tracking-wider">
                      <span className="group-hover:underline">Xem chi tiết văn bản</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
                </AnimatedCard>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-2">
              <p className="text-[11px] font-bold text-green-dark/40 uppercase tracking-wider text-left mb-3 px-1">
                Khối phòng ban đăng thầu
              </p>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none">
                {DEPARTMENTS.map((dept) => {
                  const deptTenders = tendersWithStatus.filter(n => n.tenderDept === dept);
                  const openCount = deptTenders.filter(n => n.tenderStatus === "Đang mở").length;
                  const isActive = activeTenderDept === dept;
                  return (
                    <button
                      key={dept}
                      onClick={() => setActiveTenderDept(dept)}
                      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold whitespace-nowrap cursor-pointer transition-all border shrink-0 ${
                        isActive
                          ? "bg-green-dark text-white border-transparent shadow"
                          : "bg-white text-green-dark/80 border-green-800/10 hover:border-brand-green"
                      }`}
                    >
                      <span className="truncate">{dept}</span>
                      <span className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-peach text-green-dark"
                          : openCount > 0
                          ? "bg-green-dark/10 text-green-dark"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {deptTenders.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-green-800/10 flex items-center justify-between gap-4 text-left">
                <div>
                  <h4 className="font-display font-extrabold text-sm text-green-dark uppercase tracking-wide">
                    {activeTenderDept}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Danh sách các thông báo mua sắm thiết bị, vật tư, xây lắp do {activeTenderDept} đăng tải và quản lý.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-mint text-green-dark py-1 px-3 rounded-full border border-brand-green/20 text-[10px] font-bold">
                  <ShieldCheck size={12} className="text-brand-green" />
                  <span>Chính xác & Công khai</span>
                </div>
              </div>

              {tendersWithStatus.filter(n => n.tenderDept === activeTenderDept).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tendersWithStatus.filter(n => n.tenderDept === activeTenderDept).map((item, idx) => {
                    const statusBadge = getStatusBadge(item.tenderStatus);
                    return (
                      <AnimatedCard key={item.id} index={idx}>
                        <article
                          onClick={() => handleOpenReader(item)}
                          className="bg-white border border-green-800/5 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group text-left cursor-pointer hover:border-brand-green/30"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-mint/20 shrink-0">
                            <motion.img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.5 }}
                            />
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            <span className={`${statusBadge.bg} ${statusBadge.text} font-mono text-[9px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 shadow`}>
                              {item.tenderStatus === "Đang mở" && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>}
                              {statusBadge.label}
                            </span>
                            {item.tenderNumber && (
                              <span className="bg-green-dark/90 text-white font-mono text-[8px] font-bold py-0.5 px-2 rounded-md">
                                {item.tenderNumber}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5 flex-grow flex flex-col justify-between">
                          <div className="space-y-3">
                            <h3 className="font-display font-bold text-sm text-green-dark leading-snug group-hover:text-brand-green line-clamp-2 min-h-[40px]">
                              {item.title}
                            </h3>

                            <p className="text-xs text-ink/70 leading-relaxed line-clamp-3">
                              {item.summary}
                            </p>

                            {item.tenderEstimateValue && (
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium">
                                <span className="text-gray-400">Giá trị:</span>
                                <span className="text-green-dark font-bold">{item.tenderEstimateValue}</span>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 mt-4 border-t border-green-800/5 flex items-center justify-between text-[11px] font-bold text-brand-green uppercase tracking-wider">
                            <span>Tải HSMT & Nộp hồ sơ</span>
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </article>
                      </AnimatedCard>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-green-800/[0.04] rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-cream-white rounded-full flex items-center justify-center border border-green-800/5 text-gray-400">
                    <AlertCircle size={24} />
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-display font-extrabold text-sm text-green-dark">Chưa có thông báo mời thầu mới</h5>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                      {activeTenderDept} hiện tại chưa công bố dự án mua sắm hoặc đấu thầu thiết bị vật tư nào mới trong đợt này. Quý nhà thầu vui lòng đăng nhập/quay lại sau.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </section>
  );
}