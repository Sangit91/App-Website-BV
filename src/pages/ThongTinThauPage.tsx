import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/layout/Layout";
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from "framer-motion";
import { Server, Stethoscope, Microscope, Pill, Building2, Users, Calendar, DollarSign, Layers, ShieldCheck, AlertCircle, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { NewsItem, TenderStatus } from "../types";
import NewsDetailModal from "../components/public/NewsDetailModal";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AnimatedCounter } from "../hooks/AnimatedCounter";
import { FloatingShape } from "../hooks/FloatingShape";

const DEPARTMENTS = [
  { id: "PHÒNG CNTT", name: "Phòng Công Nghệ Thông Tin", icon: Server, color: "from-blue-500 to-cyan-600" },
  { id: "PHÒNG VTTBYT", name: "Vật Tư Thiết Bị Y Tế", icon: Stethoscope, color: "from-green-500 to-emerald-600" },
  { id: "XÉT NGHIỆM", name: "Khoa Xét Nghiệm", icon: Microscope, color: "from-purple-500 to-violet-600" },
  { id: "DƯỢC", name: "Khoa Dược", icon: Pill, color: "from-orange-500 to-amber-600" },
  { id: "PHÒNG HCQT", name: "Hành Chính Quản Trị", icon: Building2, color: "from-teal-500 to-cyan-600" },
  { id: "PHÒNG KẾ TOÁN HÀNH CHÍNH", name: "Kế Toán Hành Chính", icon: Users, color: "from-pink-500 to-rose-600" }
];

const stats = [
  { value: 15, label: "Gói thầu", suffix: "+" },
  { value: 8, label: "Phòng ban", suffix: "" },
  { value: 50, label: "Nhà thầu", suffix: "+" },
  { value: 2, label: "Tỷ đồng", suffix: "" }
];

const PAGE_SIZE = 6;

function parseTenderDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (match) {
    const [, y, m, d, h, min, s] = match;
    const date = new Date(+y, +m - 1, +d, +h, +min, +(s || 0));
    return isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

function getTenderStatus(item: NewsItem): TenderStatus {
  const endDate = parseTenderDate(item.tenderEndDate || "");
  if (!endDate) return "Đang mở";
  const now = new Date();
  if (endDate < now) return "Đã đóng";
  const daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 7) return "Sắp mở";
  return "Đang mở";
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Đang mở": return { bg: "bg-brand-green", text: "text-white", label: "ĐANG MỞ THẦU" };
    case "Sắp mở": return { bg: "bg-peach", text: "text-white", label: "SẮP ĐÓNG THẦU" };
    case "Đã đóng": return { bg: "bg-gray-400", text: "text-white", label: "ĐÃ KẾT THÚC" };
    default: return { bg: "bg-gray-200", text: "text-gray-700", label: status };
  }
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  const d = parseTenderDate(dateStr);
  if (!d) return dateStr;
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${h}:${min} - ${day}/${month}/${d.getFullYear()}`;
}

function normalizeDateSep(value: string): string {
  return (value || "").replace(/[\/\-.]/g, "/");
}

function extractDateTokens(value: string): string[] {
  return normalizeDateSep(value).match(/\d{1,2}\/\d{1,2}\/\d{4}/g) || [];
}

function matchesSearch(item: NewsItem, query: string): boolean {
  const raw = query.trim().toLowerCase();
  if (!raw) return true;

  if (item.title.toLowerCase().includes(raw)) return true;
  if (item.summary && item.summary.toLowerCase().includes(raw)) return true;

  const qNorm = normalizeDateSep(raw);
  const isFullDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(qNorm);
  const isMonthDate = /^\d{1,2}\/\d{4}$/.test(qNorm);
  if (!isFullDate && !isMonthDate) return false;

  const dateFields: string[] = [
    item.date,
    formatDateShort(item.tenderStartDate || ""),
    formatDateShort(item.tenderEndDate || ""),
  ];
  if (item.publishedAt) {
    const d = new Date(item.publishedAt);
    if (!isNaN(d.getTime())) dateFields.push(d.toLocaleDateString("vi-VN"));
  }

  return dateFields.some(f => {
    const tokens = extractDateTokens(f);
    if (tokens.length === 0) return false;
    if (isFullDate) {
      const [qd, qm, qy] = qNorm.split("/");
      return tokens.some(t => {
        const [d, m, y] = t.split("/");
        return +d === +qd && +m === +qm && y === qy;
      });
    }
    const [qm, qy] = qNorm.split("/");
    return tokens.some(t => {
      const [, m, y] = t.split("/");
      return +m === +qm && y === qy;
    });
  });
}

interface TenderCardProps {
  item: NewsItem;
  dept: { name: string; color: string };
  index: number;
  onClick: () => void;
  key?: React.Key;
}

function TenderCard({ item, dept, index, onClick }: TenderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const status = getTenderStatus(item);
  const statusBadge = getStatusBadge(status);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    <motion.div ref={cardRef} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : index * 0.1 }} style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group cursor-pointer">
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
        className="bg-white border border-green-800/5 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[16/10] overflow-hidden bg-mint/20">
          <motion.img src={item.image || "/images/pages/chiphi-1.jpeg"} alt={item.title}
            className="w-full h-full object-cover" referrerPolicy="no-referrer"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.6 }} />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={`${statusBadge.bg} ${statusBadge.text} font-mono text-[9px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 shadow`}>
              {status === "Đang mở" && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>}
              {statusBadge.label}
            </span>
            {item.tenderNumber && (
              <span className="bg-green-dark/90 text-white font-mono text-[8px] font-bold py-0.5 px-2 rounded-md">
                {item.tenderNumber}
              </span>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display font-bold text-sm text-green-dark leading-snug group-hover:text-brand-green line-clamp-2 min-h-[40px] mb-2">
            {item.title}
          </h3>
          <p className="text-xs text-ink/70 leading-relaxed line-clamp-2 mb-3">{item.summary}</p>
          {item.tenderEstimateValue && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium mb-3">
              <DollarSign size={14} className="text-brand-green" />
              <span className="font-bold">{item.tenderEstimateValue}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-green-800/5">
            <span className="text-[10px] text-ink/50 flex items-center gap-1">
              <Calendar size={12} /> {item.tenderEndDate ? formatDateShort(item.tenderEndDate) : item.date}
            </span>
            <button onClick={onClick} className="px-3 py-1.5 bg-brand-green/10 text-brand-green text-xs font-bold rounded-full hover:bg-brand-green hover:text-white transition-colors">
              Chi tiết
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ThongTinThauPage() {
  const { news } = useHospital();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeDept, setActiveDept] = useState("PHÒNG CNTT");
  const [selectedTender, setSelectedTender] = useState<NewsItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const tenders = news.filter(item => item.isTender).map(item => ({ ...item, status: getTenderStatus(item) }));
  const currentDept = DEPARTMENTS.find(d => d.id === activeDept)!;
  const deptTenders = tenders.filter(t => t.tenderDept === activeDept);
  const filteredTenders = searchQuery ? deptTenders.filter(t => matchesSearch(t, searchQuery)) : deptTenders;
  const totalPages = Math.max(1, Math.ceil(filteredTenders.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const currentTenders = filteredTenders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const applySearch = () => {
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
    setIsSearchOpen(false);
  };

  return (
    <Layout>

      <section ref={heroRef} className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-green-dark via-emerald-800 to-teal-700">
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0 z-0" style={reducedMotion ? {} : { opacity: heroOpacity, scale: heroScale }}>
          <img src="/images/pages/hero-chi-phi.jpeg" alt="Thông tin thầu" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-dark/80 via-emerald-800/70 to-teal-700/60" />
        </motion.div>

        <div className="absolute inset-0 overflow-hidden">
          <FloatingShape className="w-96 h-96 bg-brand-green -top-20 -left-20" delay={0} />
          <FloatingShape className="w-64 h-64 bg-peach -top-10 right-20" delay={1} />
          <FloatingShape className="w-80 h-80 bg-mint bottom-0 left-1/3" delay={2} />
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px"
            }} />
          </div>
        </div>

        <motion.div className="relative z-10 max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10 py-16 w-full"
          style={{ opacity: reducedMotion ? 1 : heroOpacity, scale: reducedMotion ? 1 : heroScale }}>
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium mb-6">
              <Layers className="w-4 h-4" />
              <span>Cổng thông tin công khai</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              <span className="inline-block">Thông tin</span>
              <span className="inline-block ml-3 text-peach">đấu thầu</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Thông báo mời thầu, mua sắm công của Bệnh viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                <span className="text-white text-sm">Chính xác & Công khai</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, idx) => (
                <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-display font-bold text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/60 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-800/5 shadow-sm">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <div className="flex overflow-x-auto scrollbar-hide py-4 gap-2">
            {DEPARTMENTS.map(dept => {
              const Icon = dept.icon;
              const isActive = activeDept === dept.id;
              const deptCount = tenders.filter(t => t.tenderDept === dept.id).length;
              return (
                <motion.button key={dept.id} onClick={() => { setActiveDept(dept.id); setCurrentPage(1); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${isActive ? `bg-gradient-to-r ${dept.color} text-white shadow-lg` : "bg-gray-100 text-ink/70 hover:bg-gray-200"}`}>
                  <Icon className="w-4 h-4" />
                  <span>{dept.name}</span>
                  {deptCount > 0 && (
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${isActive ? "bg-white/20" : "bg-brand-green/10 text-brand-green"}`}>
                      {deptCount}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-display font-bold text-green-dark">{currentDept.name}</h2>
              <p className="text-sm text-ink/60">Danh sách các thông báo mua sắm, mời thầu do {currentDept.name} đăng tải</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-mint text-green-dark py-1.5 px-4 rounded-full border border-brand-green/20 text-xs font-bold">
                <ShieldCheck size={14} className="text-brand-green" />
                <span>Chính xác & Công khai</span>
              </div>
              <div className={`group relative z-50 flex items-center justify-end bg-white border border-green-800/10 rounded-full overflow-hidden shadow-sm transition-all duration-300 ease-in-out h-10 ${isSearchOpen ? "w-80" : "w-10 hover:w-80 focus-within:w-80"}`}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") applySearch(); }}
                  placeholder="Nhập tiêu đề hoặc ngày đăng (dd/mm/yyyy)"
                  className={`h-full flex-1 min-w-0 bg-transparent outline-none text-sm text-green-dark placeholder:text-xs placeholder:text-ink/30 pl-4 transition-opacity duration-300 ${isSearchOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"}`}
                />
                <button
                  onClick={applySearch}
                  className={`shrink-0 mr-1.5 px-3 py-1.5 bg-brand-green hover:bg-green-700 text-white text-xs font-bold rounded-full transition-opacity duration-300 ${isSearchOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  Tìm
                </button>
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 250);
                  }}
                  aria-label="Mở tìm kiếm thầu"
                  className="w-10 h-10 shrink-0 flex items-center justify-center text-green-dark hover:bg-mint/60 transition-colors cursor-pointer"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>
          </div>

          {searchQuery && (
            <div className="mb-6 flex items-center justify-end">
              <div className="flex items-center gap-2 bg-mint/60 text-green-dark text-xs font-bold px-4 py-3 rounded-full border border-brand-green/20">
                <span>{filteredTenders.length} kết quả cho "{searchQuery}"</span>
                <button onClick={clearSearch} aria-label="Xóa tìm kiếm" className="w-6 h-6 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-green-dark cursor-pointer transition-colors">
                  <X size={13} />
                </button>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={activeDept} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              {filteredTenders.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentTenders.map((item, idx) => (
                      <TenderCard key={item.id} item={item} dept={{ name: currentDept.name, color: currentDept.color }} index={idx} onClick={() => setSelectedTender(item)} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Trang trước"
                        className="w-9 h-9 rounded-full border border-green-800/15 text-green-dark font-bold flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mint cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button
                          key={n}
                          onClick={() => setCurrentPage(n)}
                          className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${n === currentPage ? "bg-brand-green text-white shadow" : "bg-white text-green-dark border border-green-800/15 hover:bg-mint"}`}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Trang sau"
                        className="w-9 h-9 rounded-full border border-green-800/15 text-green-dark font-bold flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mint cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white border border-green-800/[0.04] rounded-3xl p-16 text-center">
                  <div className="w-16 h-16 bg-cream-white rounded-full flex items-center justify-center border border-green-800/5 text-gray-400 mx-auto mb-4">
                    <AlertCircle size={24} />
                  </div>
                  <h5 className="font-display font-extrabold text-base text-green-dark mb-2">{searchQuery ? "Không tìm thấy kết quả phù hợp" : "Chưa có thông báo mời thầu mới"}</h5>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    {searchQuery
                      ? `Không có bài viết nào khớp với "${searchQuery}" trong ${currentDept.name}. Thử lại với tiêu đề hoặc ngày/tháng khác.`
                      : `${currentDept.name} hiện tại chưa công bố dự án mua sắm hoặc đấu thầu thiết bị vật tư nào mới.`}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selectedTender && (
          <NewsDetailModal
            news={selectedTender}
            onClose={() => setSelectedTender(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}