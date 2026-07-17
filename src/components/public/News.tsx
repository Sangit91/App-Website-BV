import React, { useState, useEffect } from "react";
import { Calendar, ArrowRight, X, Printer, Download, Eye, FileText, Clock, Share2, Layers, ShieldCheck, AlertCircle } from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { NewsItem } from "../../types";
import { DEPARTMENTS } from "../../data";

export default function News() {
  const { news } = useHospital();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<"news" | "tenders">("news");
  const [activeTenderDept, setActiveTenderDept] = useState<string>("PHÒNG CNTT");
  
  // State for live countdown timer in the tender widget
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 25, seconds: 12 });

  useEffect(() => {
    // Only tick when a tender article is open
    if (!selectedNews || !isTenderPost(selectedNews)) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedNews]);

  // Helper to check if a news item is a procurement/tender post
  function isTenderPost(item: NewsItem): boolean {
    if (item.isTender === true) return true;
    const titleLower = item.title.toLowerCase();
    const tagLower = item.tag.toLowerCase();
    return (
      titleLower.includes("thầu") || 
      titleLower.includes("đấu thầu") || 
      titleLower.includes("mua sắm") ||
      tagLower.includes("thầu") ||
      item.id === "news-2" // Make our second item "Thông báo" act as a tender/program with deadline
    );
  }

  const handleOpenReader = (item: NewsItem) => {
    // Reset timer to randomized active countdown for high fidelity demo
    setTimeLeft({
      days: Math.floor(Math.random() * 5) + 2,
      hours: Math.floor(Math.random() * 23),
      minutes: Math.floor(Math.random() * 59),
      seconds: Math.floor(Math.random() * 59)
    });
    setSelectedNews(item);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="tin-tuc" className="bg-cream-white py-16 md:py-20 border-b border-green-800/10">
      {/* Injecting Print Stylesheet for perfect A4 Print Optimization */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide everything in the page */
          body * {
            visibility: hidden;
            background: transparent !important;
          }
          /* Except the document area */
          #print-document-area, #print-document-area * {
            visibility: visible;
          }
          #print-document-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: #22302A !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className="max-w-[1180px] mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center max-w-[680px] mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 bg-[#EAF7EE] text-[#164B36] font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#2FA968]/20 mb-3">
            <FileText size={13} className="text-[#2FA968]" /> Cổng thông tin công cộng
          </span>
          <h2 className="font-display font-bold text-[28px] md:text-[32px] text-green-dark">
            Tin Tức Y Khoa & Thông Báo Đấu Thầu
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto my-3 rounded-full"></div>
          <p className="text-ink/80 text-sm md:text-base leading-relaxed">
            Cập nhật nhanh nhất các thông báo mua sắm, mời thầu y tế công khai, cùng kiến thức bảo vệ sức khỏe cộng đồng thường kỳ.
          </p>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-green-dark/5 p-1 rounded-2xl inline-flex gap-1 border border-green-800/5">
            <button
              onClick={() => setActiveMainTab("news")}
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === "news"
                  ? "bg-[#164B36] text-white shadow"
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
                  ? "bg-[#164B36] text-white shadow"
                  : "text-green-dark hover:bg-green-dark/5"
              }`}
            >
              <Layers size={14} />
              <span>Cổng Thông Tin Đấu Thầu</span>
            </button>
          </div>
        </div>

        {activeMainTab === "news" ? (
          /* Normal News Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.filter(item => !item.isTender).map((item) => {
              const isTender = isTenderPost(item);
              return (
                <article
                  key={item.id}
                  onClick={() => handleOpenReader(item)}
                  className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full text-left cursor-pointer"
                >
                  {/* News Thumbnail Image (16:10 ratio) */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-mint/20 shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {isTender && (
                      <div className="absolute top-3 left-3 bg-[#164B36] text-[#EAF7EE] font-mono text-[10px] font-bold py-1 px-3 rounded-full flex items-center gap-1.5 shadow">
                        <span className="w-2 h-2 bg-peach rounded-full animate-pulse"></span>
                        MỜI THẦU / KHẨN
                      </div>
                    )}
                  </div>

                  {/* Card Body content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Category Tag & Date */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide bg-brand-green/10 text-brand-green`}>
                          {item.tag}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-ink/50 font-medium">
                          <Calendar size={13} className="text-brand-green" />
                          <span>{item.date}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-[15.5px] md:text-[16.5px] text-green-dark leading-snug group-hover:text-brand-green transition-colors duration-200 line-clamp-2 min-h-[44px]">
                        {item.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs md:text-[13px] text-ink/75 leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>
                    </div>

                    {/* Read More link */}
                    <div className="pt-5 mt-5 border-t border-green-800/5 flex items-center justify-between text-xs font-bold text-brand-green uppercase tracking-wider">
                      <span className="group-hover:underline">Xem chi tiết văn bản</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Bidding Tenders divided into specific Blocks/Departments */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Block Menu */}
            <div className="lg:col-span-1 space-y-2">
              <p className="text-[11px] font-bold text-green-dark/40 uppercase tracking-wider text-left mb-3 px-1">
                Khối phòng ban đăng thầu
              </p>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none">
                {DEPARTMENTS.map((dept) => {
                  const count = news.filter(n => n.isTender && n.tenderDept === dept).length;
                  const isActive = activeTenderDept === dept;
                  return (
                    <button
                      key={dept}
                      onClick={() => setActiveTenderDept(dept)}
                      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold whitespace-nowrap cursor-pointer transition-all border shrink-0 ${
                        isActive
                          ? "bg-[#164B36] text-white border-transparent shadow"
                          : "bg-white text-green-dark/80 border-green-800/10 hover:border-[#2FA968]"
                      }`}
                    >
                      <span className="truncate">{dept}</span>
                      <span className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-[#FFA265] text-green-dark"
                          : count > 0
                          ? "bg-green-dark/10 text-green-dark"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Bidding posts for active department */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-green-800/10 flex items-center justify-between gap-4 text-left">
                <div>
                  <h4 className="font-display font-extrabold text-sm text-[#164B36] uppercase tracking-wide">
                    {activeTenderDept}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Danh sách các thông báo mua sắm thiết bị, vật tư, xây lắp do {activeTenderDept} đăng tải và quản lý.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-[#EAF7EE] text-[#164B36] py-1 px-3 rounded-full border border-[#2FA968]/20 text-[10px] font-bold">
                  <ShieldCheck size={12} className="text-[#2FA968]" />
                  <span>Chính xác & Công khai</span>
                </div>
              </div>

              {news.filter(n => n.isTender && n.tenderDept === activeTenderDept).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {news.filter(n => n.isTender && n.tenderDept === activeTenderDept).map((item) => {
                    return (
                      <article
                        key={item.id}
                        onClick={() => handleOpenReader(item)}
                        className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group text-left cursor-pointer"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-mint/20 shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 bg-[#164B36] text-[#EAF7EE] font-mono text-[9px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 shadow">
                            <span className="w-1.5 h-1.5 bg-[#FFA265] rounded-full animate-pulse"></span>
                            ĐANG MỞ THẦU
                          </div>
                        </div>

                        {/* Card details */}
                        <div className="p-5 flex-grow flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                              <span className="text-peach-dark uppercase font-bold tracking-wider bg-[#FFA265]/10 px-2.5 py-0.5 rounded-md text-[9px]">
                                {item.tenderDept || "Thầu Phụ"}
                              </span>
                              <span>{item.date}</span>
                            </div>

                            <h3 className="font-display font-bold text-sm text-green-dark leading-snug group-hover:text-brand-green line-clamp-2 min-h-[40px]">
                              {item.title}
                            </h3>

                            <p className="text-xs text-ink/70 leading-relaxed line-clamp-3">
                              {item.summary}
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-green-800/5 flex items-center justify-between text-[11px] font-bold text-[#2FA968] uppercase tracking-wider">
                            <span>Tải HSMT & Nộp hồ sơ</span>
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* Beautiful empty state */
                <div className="bg-white border border-green-800/[0.04] rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-[#FCFBF7] rounded-full flex items-center justify-center border border-green-800/5 text-gray-400">
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

      {/* ========================================================= */}
      {/* 3C. HIGH-PRECISION DOCUMENT READER POPUP */}
      {/* ========================================================= */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="w-full max-w-4xl bg-cream-white rounded-[28px] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
            
            {/* Header Control Panel (no-print) */}
            <div className="bg-green-dark px-6 py-4 text-white flex justify-between items-center shrink-0 border-b border-[#2FA968]/20 no-print">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#FFA265]" />
                <span className="font-display font-bold text-sm tracking-wide text-gray-200">
                  Cổng Công Bố Văn Bản & Thủ Tục Hành Chính Công Khai
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {/* Print button (A4 optimized) */}
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

            {/* Main Document Content Area */}
            <div className="overflow-y-auto p-6 md:p-12 flex-grow bg-[#FCFBF7]" id="print-document-area">
              <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Document Letterhead (Shown nicely for print/display) */}
                <div className="border-b-2 border-green-800/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="leading-tight">
                    <p className="font-display font-bold text-[12px] text-green-dark tracking-wide uppercase">
                      SỞ Y TẾ TỈNH QUẢNG NAM
                    </p>
                    <p className="font-sans font-bold text-[13px] text-brand-green uppercase">
                      BVĐK KV MIỀN NÚI PHÍA BẮC
                    </p>
                    <p className="font-sans text-[11px] text-gray-500">
                      Số: {selectedNews.id.toUpperCase()}-2026/TB-BV
                    </p>
                  </div>
                  <div className="text-left md:text-right font-sans text-[11px] text-gray-500">
                    <p className="font-bold text-green-dark">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="italic">Độc lập - Tự do - Hạnh phúc</p>
                    <p className="mt-1">Đại Lộc, ngày {selectedNews.date}</p>
                  </div>
                </div>

                {/* Post Category Tag & Print Indicator */}
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="bg-green-dark/10 text-green-dark px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {isTenderPost(selectedNews) ? "Thông báo mời thầu" : selectedNews.tag}
                  </span>
                  <span className="text-gray-400 italic flex items-center gap-1">
                    <Clock size={12} /> Bản điện tử chính thức
                  </span>
                </div>

                {/* Main Article Title */}
                <h1 className="font-display font-bold text-2xl md:text-3xl text-green-dark leading-tight tracking-tight text-left">
                  {selectedNews.title}
                </h1>

                {/* 3C. Post Metadata Bar */}
                <div className="bg-mint/40 border border-[#2FA968]/10 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#2FA968]" />
                    <span>Thời điểm đăng tải: <span className="text-[#164B36] font-bold">09:15:22 - {selectedNews.date}</span></span>
                  </div>
                  <div>
                    <span>Cơ quan ban hành: <span className="text-[#164B36] font-bold">Phòng Kế hoạch tổng hợp - BV MNPB QN</span></span>
                  </div>
                </div>

                {/* 3C. STRICT BIDDING STATUS WIDGET (For Tenders) */}
                {isTenderPost(selectedNews) && (
                  <div className="bg-[#EAF7EE] border-l-4 border-green-dark p-6 rounded-r-2xl space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-display font-bold text-[#164B36] text-[15px] flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green"></span>
                        </span>
                        ĐANG MỞ THẦU CÔNG KHAI
                      </h3>
                      
                      {/* Live countdown timer */}
                      <div className="bg-[#164B36] text-white px-3.5 py-1.5 rounded-lg font-mono text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm">
                        <Clock size={13} className="text-[#FFA265] animate-spin" />
                        <span>Hạn đóng thầu còn: <span className="text-[#FFA265]">{timeLeft.days} ngày {timeLeft.hours} giờ {timeLeft.minutes} phút {timeLeft.seconds} giây</span></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-green-800/10 text-xs text-gray-700">
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Thời điểm mở thầu chính thức</p>
                        <p className="text-green-dark font-mono font-bold mt-0.5">
                          {selectedNews.tenderStartDate || "08:00:00 ngày 15/07/2026"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Thời điểm khóa thầu hồ sơ</p>
                        <p className="text-red-700 font-mono font-bold mt-0.5">
                          {selectedNews.tenderEndDate || "17:00:00 ngày 25/07/2026"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/60 p-3 rounded-xl border border-[#2FA968]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-[#2FA968]" />
                        <div>
                          <p className="font-sans font-bold text-[12.5px] text-[#164B36] truncate max-w-[280px]">
                            {selectedNews.tenderFile ? selectedNews.tenderFile.name : "Hồ sơ mời thầu chi tiết (PDF)"}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Dung lượng: {selectedNews.tenderFile ? selectedNews.tenderFile.size : "2.4 MB"} • Lượt tải: {selectedNews.tenderFile ? "1" : "182"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={selectedNews.tenderFile?.url || "#download"}
                        download={selectedNews.tenderFile?.name || "HS_MOI_THAU_MNPB_2026.pdf"}
                        onClick={(e) => {
                          if (!selectedNews.tenderFile?.url) {
                            e.preventDefault();
                            alert("Đã bắt đầu tải tệp đính kèm: HS_MOI_THAU_MNPB_2026.pdf");
                          }
                        }}
                        className="flex items-center gap-1.5 bg-[#2FA968] hover:bg-[#1a7c46] text-white text-[11.5px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        <Download size={13} />
                        Tải Hồ Sơ Thầu
                      </a>
                    </div>
                  </div>
                )}

                {/* Rich Content Text */}
                <div className="font-sans text-ink text-[14.5px] leading-relaxed space-y-5 text-left">
                  {selectedNews.content ? (
                    selectedNews.content.split("\n\n").map((paragraph, idx) => {
                      // Check if it's a heading (e.g., starts with Roman/Arabic numerals like "I. ", "II. ")
                      const isHeading = paragraph.trim().match(/^(I|II|III|IV|V|1|2|3)\.\s+/);
                      if (isHeading) {
                        return (
                          <h3 key={idx} className="font-display font-bold text-base text-green-dark pt-3 border-l-2 border-brand-green pl-3">
                            {paragraph.trim()}
                          </h3>
                        );
                      }
                      
                      // Check if it's the "Kính gửi" line or similar greeting
                      const isGreeting = paragraph.trim().toLowerCase().startsWith("kính gửi:") || paragraph.trim().toLowerCase().startsWith("kính gửi ");
                      if (isGreeting) {
                        return (
                          <p key={idx} className="font-bold">
                            {paragraph}
                          </p>
                        );
                      }

                      // Check if it's a footer note
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

                {/* Sign-off area */}
                <div className="pt-8 border-t border-green-800/10 flex justify-end">
                  <div className="text-center font-sans text-xs max-w-[250px]">
                    <p className="font-bold uppercase text-[#164B36]">TL. GIÁM ĐỐC</p>
                    <p className="font-bold text-gray-500">TRƯỞNG PHÒNG KẾ HOẠCH TỔNG HỢP</p>
                    <div className="h-16"></div> {/* Mock signature space */}
                    <p className="font-bold font-display text-[#164B36] text-[13px]">BSCKI. Nguyễn Hoàng Nam</p>
                    <p className="text-gray-400 italic">(Đã ký đóng dấu đỏ điện tử)</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Controls / Actions (no-print) */}
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
