import React, { useState, useEffect, useMemo, useRef, MouseEvent, ElementType } from "react";
import { motion, useInView, useMotionValue } from "framer-motion";
import { Calendar, ArrowRight, X, Printer, Download, FileText, Clock, Share2, Layers, ShieldCheck, AlertCircle, CheckCircle, Phone, MapPin } from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { NewsItem, TenderStatus } from "../../types";
import { DEPARTMENTS } from "../../data";

function getTenderStatus(item: NewsItem): TenderStatus {
  if (!item.tenderEndDate) return "Đang mở";
  const endDateStr = item.tenderEndDate.replace(" ngày ", "/").replace(/\//g, "-");
  const parts = item.tenderEndDate.match(/(\d{2}):(\d{2}):(\d{2}) ngày (\d{2})\/(\d{2})\/(\d{4})/);
  if (!parts) return "Đang mở";
  const [, hours, minutes, seconds, day, month, year] = parts;
  const endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
  const now = new Date();
  if (endDate < now) return "Đã đóng";
  const daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 7) return "Sắp mở";
  return "Đang mở";
}

function parseEndDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.match(/(\d{2}):(\d{2}):(\d{2}) ngày (\d{2})\/(\d{2})\/(\d{4})/);
  if (!parts) return null;
  const [, hours, minutes, seconds, day, month, year] = parts;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
}

function getTimeLeft(endDateStr: string): { days: number; hours: number; minutes: number; seconds: number; expired: boolean } {
  const endDate = parseEndDate(endDateStr);
  if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}

function getStatusBadge(status: TenderStatus) {
  switch (status) {
    case "Đang mở":
      return { bg: "bg-brand-green", text: "text-white", label: "ĐANG MỞ THẦU" };
    case "Sắp mở":
      return { bg: "bg-peach", text: "text-white", label: "SẮP ĐÓNG THẦU" };
    case "Đã đóng":
      return { bg: "bg-gray-400", text: "text-white", label: "ĐÃ KẾT THÚC" };
  }
}

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
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    if (!selectedNews || !isTenderPost(selectedNews) || !selectedNews.tenderEndDate) return;

    const updateTimer = () => {
      const tl = getTimeLeft(selectedNews.tenderEndDate!);
      setTimeLeft(tl);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [selectedNews]);

  function isTenderPost(item: NewsItem): boolean {
    if (item.isTender === true) return true;
    const titleLower = item.title.toLowerCase();
    const tagLower = item.tag.toLowerCase();
    return (
      titleLower.includes("thầu") ||
      titleLower.includes("đấu thầu") ||
      titleLower.includes("mua sắm") ||
      tagLower.includes("thầu")
    );
  }

  const handleOpenReader = (item: NewsItem) => {
    setSelectedNews(item);
    if (isTenderPost(item) && item.tenderEndDate) {
      const tl = getTimeLeft(item.tenderEndDate);
      setTimeLeft(tl);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (item: NewsItem) => {
    if (item.tenderFile?.url) {
      window.open(item.tenderFile.url, "_blank");
      setDownloadToast(`Đã tải: ${item.tenderFile.name}`);
    } else {
      const fileName = item.tenderFile?.name || "HS_MOI_THAU.pdf";
      setDownloadToast(`Đang tải: ${fileName}`);
      setTimeout(() => setDownloadToast(null), 3000);
    }
  };

  const tendersWithStatus = useMemo(() => {
    return news.filter(item => item.isTender).map(item => ({
      ...item,
      tenderStatus: getTenderStatus(item)
    }));
  }, [news]);

  const selectedTenderStatus = selectedNews && isTenderPost(selectedNews) ? getTenderStatus(selectedNews) : null;

  return (
    <section id="tin-tuc" className="bg-cream-white py-16 md:py-20 border-b border-green-800/10">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; background: transparent !important; }
          #print-document-area, #print-document-area * { visibility: visible; }
          #print-document-area { position: absolute; left: 0; top: 0; width: 100%; background: white !important; color: #22302A !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
        }
      `}} />

      {/* Download Toast */}
      {downloadToast && (
        <div className="fixed top-24 right-4 z-[200] bg-green-dark text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in-down">
          <CheckCircle size={16} className="text-brand-green" />
          {downloadToast}
        </div>
      )}

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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="w-full max-w-4xl bg-cream-white rounded-[28px] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">

            <div className="bg-green-dark px-6 py-4 text-white flex justify-between items-center shrink-0 border-b border-brand-green/20 no-print">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-peach" />
                <span className="font-display font-bold text-sm tracking-wide text-gray-200">
                  Cổng Công Bố Văn Bản & Thủ Tục Hành Chính Công Khai
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePrint}
                  title="In ấn tài liệu (Bản cứng A4)"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">In Lưu Trữ (A4)</span>
                </button>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-6 md:p-12 flex-grow bg-cream-white" id="print-document-area">
              <div className="max-w-3xl mx-auto space-y-8">

                <div className="border-b-2 border-green-800/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="leading-tight">
                    <p className="font-display font-bold text-[12px] text-green-dark tracking-wide uppercase">
                      SỞ Y TẾ TỈNH QUẢNG NAM
                    </p>
                    <p className="font-sans font-bold text-[13px] text-brand-green uppercase">
                      BVĐK KV MIỀN NÚI PHÍA BẮC
                    </p>
                    <p className="font-sans text-[11px] text-gray-500">
                      Số: {selectedNews.tenderNumber || selectedNews.id.toUpperCase()}-2026/TB-BV
                    </p>
                  </div>
                  <div className="text-left md:text-right font-sans text-[11px] text-gray-500">
                    <p className="font-bold text-green-dark">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="italic">Độc lập - Tự do - Hạnh phúc</p>
                    <p className="mt-1">Đại Lộc, ngày {selectedNews.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="bg-green-dark/10 text-green-dark px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {isTenderPost(selectedNews) ? "Thông báo mời thầu" : selectedNews.tag}
                  </span>
                  <span className="text-gray-400 italic flex items-center gap-1">
                    <Clock size={12} /> Bản điện tử chính thức
                  </span>
                </div>

                <h1 className="font-display font-bold text-2xl md:text-3xl text-green-dark leading-tight tracking-tight text-left">
                  {selectedNews.title}
                </h1>

                <div className="bg-mint/40 border border-brand-green/10 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-green" />
                    <span>Thời điểm đăng tải: <span className="text-green-dark font-bold">{selectedNews.date}</span></span>
                  </div>
                  <div>
                    <span>Cơ quan ban hành: <span className="text-green-dark font-bold">Phòng Kế hoạch tổng hợp - BV MNPB QN</span></span>
                  </div>
                </div>

                {isTenderPost(selectedNews) && (
                  <div className="bg-mint border-l-4 border-green-dark p-6 rounded-r-2xl space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {selectedTenderStatus && (
                        <h3 className="font-display font-bold text-green-dark text-[15px] flex items-center gap-2">
                          {selectedTenderStatus === "Đang mở" && (
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green"></span>
                            </span>
                          )}
                          {getStatusBadge(selectedTenderStatus).label}
                        </h3>
                      )}

                      {selectedTenderStatus !== "Đã đóng" && selectedNews.tenderEndDate && !timeLeft.expired && (
                        <div className="bg-green-dark text-white px-3.5 py-1.5 rounded-lg font-mono text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm">
                          <Clock size={13} className="text-peach" />
                          <span>Hạn đóng thầu còn: <span className="text-peach">{timeLeft.days} ngày {timeLeft.hours} giờ {timeLeft.minutes} phút {timeLeft.seconds} giây</span></span>
                        </div>
                      )}

                      {selectedTenderStatus === "Đã đóng" && (
                        <div className="bg-gray-400 text-white px-3.5 py-1.5 rounded-lg font-mono text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm">
                          <CheckCircle size={13} className="text-white/80" />
                          <span>Thầu đã kết thúc</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-green-800/10 text-xs text-gray-700">
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Thời điểm mở thầu chính thức</p>
                        <p className="text-green-dark font-mono font-bold mt-0.5">
                          {selectedNews.tenderStartDate || "Liên hệ bệnh viện"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Thời điểm khóa thầu hồ sơ</p>
                        <p className="text-red-700 font-mono font-bold mt-0.5">
                          {selectedNews.tenderEndDate || "Liên hệ bệnh viện"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-green-800/10">
                      {selectedNews.tenderMethod && (
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Hình thức thầu</p>
                          <p className="text-green-dark font-semibold text-[12px] mt-0.5">{selectedNews.tenderMethod}</p>
                        </div>
                      )}
                      {selectedNews.tenderEstimateValue && (
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Giá trị dự toán</p>
                          <p className="text-green-dark font-bold text-[12px] mt-0.5">{selectedNews.tenderEstimateValue}</p>
                        </div>
                      )}
                    </div>

                    {selectedNews.tenderReceivedLocation && (
                      <div className="pt-3 border-t border-green-800/10">
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Địa điểm nộp hồ sơ</p>
                        <div className="flex items-center gap-2 text-[12px] text-green-dark">
                          <MapPin size={14} className="text-peach" />
                          <span>{selectedNews.tenderReceivedLocation}</span>
                        </div>
                      </div>
                    )}

                    {selectedNews.tenderContact && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-green-800/10">
                        <div>
                          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Người liên hệ</p>
                          <p className="text-green-dark font-semibold text-[12px] mt-0.5">{selectedNews.tenderContact}</p>
                        </div>
                        {selectedNews.tenderContactPhone && (
                          <div>
                            <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Điện thoại</p>
                            <div className="flex items-center gap-1.5 text-[12px] text-green-dark font-semibold mt-0.5">
                              <Phone size={12} className="text-peach" />
                              <span>{selectedNews.tenderContactPhone}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-white/60 p-3 rounded-xl border border-brand-green/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-brand-green" />
                        <div>
                          <p className="font-sans font-bold text-[12.5px] text-green-dark truncate max-w-[280px]">
                            {selectedNews.tenderFile?.name || "Hồ sơ mời thầu chi tiết (PDF)"}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Dung lượng: {selectedNews.tenderFile?.size || "N/A"} • Lượt tải: {selectedNews.tenderDownloadCount || 0}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(selectedNews)}
                        className="flex items-center gap-1.5 bg-brand-green hover:bg-green-700 text-white text-[11.5px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        <Download size={13} />
                        Tải Hồ Sơ Thầu
                      </button>
                    </div>
                  </div>
                )}

                <div className="font-sans text-ink text-[14.5px] leading-relaxed space-y-5 text-left">
                  {selectedNews.content ? (
                    selectedNews.content.split("\n\n").map((paragraph, idx) => {
                      const isHeading = paragraph.trim().match(/^(I|II|III|IV|V|1|2|3)\.\s+/);
                      if (isHeading) {
                        return (
                          <h3 key={idx} className="font-display font-bold text-base text-green-dark pt-3 border-l-2 border-brand-green pl-3">
                            {paragraph.trim()}
                          </h3>
                        );
                      }

                      const isGreeting = paragraph.trim().toLowerCase().startsWith("kính gửi:");
                      if (isGreeting) {
                        return (
                          <p key={idx} className="font-bold">
                            {paragraph}
                          </p>
                        );
                      }

                      const isNote = paragraph.trim().toLowerCase().includes("mọi thông tin phản hồi") || paragraph.trim().toLowerCase().includes("xin vui lòng gửi về");
                      if (isNote) {
                        return (
                          <p key={idx} className="italic text-gray-500 pt-4 text-xs">
                            {paragraph}
                          </p>
                        );
                      }

                      return (
                        <p key={idx}>
                          {paragraph}
                        </p>
                      );
                    })
                  ) : (
                    <>
                      <p className="font-bold">Kính gửi: Các cơ quan, doanh nghiệp cung ứng trang thiết bị y tế và toàn thể nhân dân khu vực miền núi phía Bắc tỉnh Quảng Nam.</p>

                      <p>Căn cứ theo kế hoạch phát triển kỹ thuật lâm sàng của Ủy ban Nhân dân tỉnh Quảng Nam và Sở Y tế đối với bệnh viện đa khoa hạng II khu vực miền núi, Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam chính thức thông báo triển khai hoạt động và công bố văn bản pháp lý liên quan.</p>

                      <p>Mục tiêu của kế hoạch này nhằm mang lại dịch vụ y tế công bằng, chuyên sâu và nâng cao chất lượng chẩn đoán điều trị cho đồng bào các dân tộc thiểu số và nhân dân huyện Đại Lộc, Nam Giang, Đông Giang, Tây Giang.</p>

                      <h3 className="font-display font-bold text-base text-green-dark pt-3 border-l-2 border-brand-green pl-3">I. Nội dung chi tiết & Kế hoạch hành động</h3>
                      <p>Toàn bộ quy trình tiếp nhận, chăm sóc khép kín đạt tiêu chuẩn của Bộ Y tế. Các khoa phòng liên kết chặt chẽ nhằm xử trí nhanh chóng mọi tình huống cấp cứu, chấn thương chỉnh hình cũng như chuyển giao kỹ thuật từ các chuyên gia hàng đầu trung ương.</p>

                      <h3 className="font-display font-bold text-base text-green-dark pt-3 border-l-2 border-brand-green pl-3">II. Hồ sơ năng lực và pháp lý</h3>
                      <p>Hồ sơ năng lực của các đơn vị dự thầu cần tuân thủ nghiêm ngặt các quy định về nguồn gốc thiết bị, chế độ bảo hành dài hạn và hướng dẫn đào tạo vận hành lâm sàng tại chỗ cho đội ngũ bác sĩ của chúng tôi.</p>

                      <p className="italic text-gray-500 pt-4 text-xs">Mọi thông tin phản hồi hoặc yêu cầu làm rõ hồ sơ mời thầu xin vui lòng gửi về Phòng Kế hoạch tổng hợp - Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam hoặc liên hệ qua đường dây nóng công khai.</p>
                    </>
                  )}
                </div>

                <div className="pt-8 border-t border-green-800/10 flex justify-end">
                  <div className="text-center font-sans text-xs max-w-[250px]">
                    <p className="font-bold uppercase text-green-dark">TL. GIÁM ĐỐC</p>
                    <p className="font-bold text-gray-500">TRƯỞNG PHÒNG KẾ HOẠCH TỔNG HỢP</p>
                    <div className="h-16"></div>
                    <p className="font-bold font-display text-green-dark text-[13px]">BSCKI. Nguyễn Hoàng Nam</p>
                    <p className="text-gray-400 italic">(Đã ký đóng dấu đỏ điện tử)</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-t border-gray-100 shrink-0 no-print">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Share2 size={13} />
                <span>Chia sẻ tài liệu này qua Email, Zalo hoặc mạng xã hội</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                >
                  <Printer size={13} /> In ra giấy
                </button>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-5 py-2 rounded-full bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold cursor-pointer transition-all"
                >
                  Đóng tài liệu
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}