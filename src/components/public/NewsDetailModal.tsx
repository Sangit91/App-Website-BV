import { useState, useEffect } from "react";
import { X, Printer, Download, FileText, Clock, Share2, Calendar, MapPin, Phone, CheckCircle } from "lucide-react";
import { NewsItem } from "../../types";
import { isTenderPost, getTenderStatus, formatTenderDate, getTimeLeft, getStatusBadge } from "../../lib/tender";

interface NewsDetailModalProps {
  news: NewsItem;
  onClose: () => void;
}

const EMPTY_TIME = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };

export default function NewsDetailModal({ news, onClose }: NewsDetailModalProps) {
  const [timeLeft, setTimeLeft] = useState(EMPTY_TIME);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const isTender = isTenderPost(news);
  const selectedTenderStatus = isTender ? getTenderStatus(news) : null;
  const statusBadge = selectedTenderStatus ? getStatusBadge(selectedTenderStatus) : null;

  useEffect(() => {
    if (!isTender || !news.tenderEndDate) {
      setTimeLeft(EMPTY_TIME);
      return;
    }
    const updateTimer = () => setTimeLeft(getTimeLeft(news.tenderEndDate!));
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [news]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (news.tenderFile?.url) {
      window.open(news.tenderFile.url, "_blank");
      setDownloadToast(`Đã tải: ${news.tenderFile.name}`);
    } else {
      const fileName = news.tenderFile?.name || "HS_MOI_THAU.pdf";
      setDownloadToast(`Đang tải: ${fileName}`);
      setTimeout(() => setDownloadToast(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; background: transparent !important; }
          #print-document-area, #print-document-area * { visibility: visible; }
          #print-document-area { position: absolute; left: 0; top: 0; width: 100%; background: white !important; color: #22302A !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
        }
      ` }} />

      {downloadToast && (
        <div className="fixed top-24 right-4 z-[200] bg-green-dark text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in-down">
          <CheckCircle size={16} className="text-brand-green" />
          {downloadToast}
        </div>
      )}

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
              onClick={onClose}
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
                  SỞ Y TẾ THÀNH PHỐ ĐÀ NẴNG
                </p>
                <p className="font-sans font-bold text-[13px] text-brand-green uppercase">
                  BỆNH VIỆN ĐA KHOA KHU VỰC MIỀN NÚI PHÍA BẮC QUẢNG NAM
                </p>
                <p className="font-sans text-[11px] text-gray-500">
                  Số: {news.tenderNumber || news.id.toUpperCase()}-2026/TB-BV
                </p>
              </div>
              <div className="text-left md:text-right font-sans text-[11px] text-gray-500">
                <p className="font-bold text-green-dark">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="italic">Độc lập - Tự do - Hạnh phúc</p>
                <p className="mt-1">Đại Lộc, ngày {news.date}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-sans">
              <span className="bg-green-dark/10 text-green-dark px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {isTender ? "Thông báo mời thầu" : news.tag}
              </span>
              <span className="text-gray-400 italic flex items-center gap-1">
                <Clock size={12} /> Bản điện tử chính thức
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl md:text-3xl text-green-dark leading-tight tracking-tight text-left">
              {news.title}
            </h1>

            <div className="bg-mint/40 border border-brand-green/10 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-brand-green" />
                <span>Thời điểm đăng tải: <span className="text-green-dark font-bold">{news.date}</span></span>
              </div>
              <div>
                <span>Cơ quan ban hành: <span className="text-green-dark font-bold">Phòng Kế hoạch tổng hợp - BV MNPB QN</span></span>
              </div>
            </div>

            {isTender && (
              <div className="bg-mint border-l-4 border-green-dark p-6 rounded-r-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {selectedTenderStatus && statusBadge && (
                    <h3 className="font-display font-bold text-green-dark text-[15px] flex items-center gap-2">
                      {selectedTenderStatus === "Đang mở" && (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green"></span>
                        </span>
                      )}
                      {statusBadge.label}
                    </h3>
                  )}

                  {selectedTenderStatus !== "Đã đóng" && news.tenderEndDate && !timeLeft.expired && (
                    <div className="bg-green-dark text-white px-3.5 py-2 rounded-lg font-mono text-[12px] md:text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm leading-snug">
                      <Clock size={13} className="text-peach shrink-0" />
                      <span className="text-peach">Hạn đóng thầu còn:</span>
                      <span className="whitespace-nowrap">{timeLeft.days} ngày {timeLeft.hours} giờ {timeLeft.minutes} phút {timeLeft.seconds} giây</span>
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
                      {formatTenderDate(news.tenderStartDate || "") || news.date || "Liên hệ bệnh viện"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Thời điểm khóa thầu hồ sơ</p>
                    <p className="text-red-700 font-mono font-bold mt-0.5">
                      {formatTenderDate(news.tenderEndDate || "") || news.date || "Liên hệ bệnh viện"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-green-800/10">
                  {news.tenderMethod && (
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Hình thức thầu</p>
                      <p className="text-green-dark font-semibold text-[12px] mt-0.5">{news.tenderMethod}</p>
                    </div>
                  )}
                  {news.tenderEstimateValue && (
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Giá trị dự toán</p>
                      <p className="text-green-dark font-bold text-[12px] mt-0.5">{news.tenderEstimateValue}</p>
                    </div>
                  )}
                </div>

                {news.tenderReceivedLocation && (
                  <div className="pt-3 border-t border-green-800/10">
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Địa điểm nộp hồ sơ</p>
                    <div className="flex items-center gap-2 text-[12px] text-green-dark">
                      <MapPin size={14} className="text-peach" />
                      <span>{news.tenderReceivedLocation}</span>
                    </div>
                  </div>
                )}

                {news.tenderContact && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-green-800/10">
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Người liên hệ</p>
                      <p className="text-green-dark font-semibold text-[12px] mt-0.5">{news.tenderContact}</p>
                    </div>
                    {news.tenderContactPhone && (
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Điện thoại</p>
                        <div className="flex items-center gap-1.5 text-[12px] text-green-dark font-semibold mt-0.5">
                          <Phone size={12} className="text-peach" />
                          <span>{news.tenderContactPhone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-white/60 p-3 rounded-xl border border-brand-green/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText size={18} className="text-brand-green shrink-0" />
                    <div className="min-w-0">
                      <p className="font-sans font-bold text-[12.5px] text-green-dark truncate whitespace-nowrap max-w-[280px]">
                        {news.tenderFile?.name || "Hồ sơ mời thầu chi tiết (PDF)"}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        Dung lượng: {news.tenderFile?.size || "N/A"} • Lượt tải: {news.tenderDownloadCount || 0}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 bg-brand-green hover:bg-green-700 text-white text-[11.5px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition-colors shrink-0"
                  >
                    <Download size={13} />
                    Tải Hồ Sơ Thầu
                  </button>
                </div>
              </div>
            )}

            <div className="font-sans text-ink text-[14.5px] leading-relaxed space-y-5 text-left">
              {news.content ? (
                news.content.split("\n\n").map((paragraph, idx) => {
                  const isHeading = paragraph.trim().match(/^(I|II|III|IV|V|1|2|3)\.\s+/);
                  if (isHeading) {
                    return (
                      <h3 key={`${paragraph}-${idx}`} className="font-display font-bold text-base text-green-dark pt-3 border-l-2 border-brand-green pl-3">
                        {paragraph.trim()}
                      </h3>
                    );
                  }

                  const isGreeting = paragraph.trim().toLowerCase().startsWith("kính gửi:");
                  if (isGreeting) {
                    return (
                      <p key={`${paragraph}-${idx}`} className="font-bold">
                        {paragraph}
                      </p>
                    );
                  }

                  const isNote = paragraph.trim().toLowerCase().includes("mọi thông tin phản hồi") || paragraph.trim().toLowerCase().includes("xin vui lòng gửi về");
                  if (isNote) {
                    return (
                      <p key={`${paragraph}-${idx}`} className="italic text-gray-500 pt-4 text-xs">
                        {paragraph}
                      </p>
                    );
                  }

                  return (
                    <p key={`${paragraph}-${idx}`}>
                      {paragraph}
                    </p>
                  );
                })
              ) : (
                <>
                  <p className="font-bold">Kính gửi: Các cơ quan, doanh nghiệp cung ứng trang thiết bị y tế và toàn thể nhân dân khu vực miền núi phía Bắc tỉnh Quảng Nam.</p>
                  <p>{news.summary}</p>
                  <p className="italic text-gray-500 pt-4 text-xs">Mọi thông tin phản hồi hoặc yêu cầu làm rõ hồ sơ mời thầu xin vui lòng gửi về Phòng Kế hoạch tổng hợp - Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam.</p>
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
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold cursor-pointer transition-all"
            >
              Đóng tài liệu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}