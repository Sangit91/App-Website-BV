import { useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import { useHospital } from "../context/HospitalContext";
import { NewsItem, TenderStatus, TenderMethod } from "../types";
import { FileText, Download, Server, Stethoscope, Microscope, Pill, Building2, Users, ChevronDown, ChevronUp, X, Calendar, Clock, MapPin, Phone, BadgeCheck, DollarSign, FileCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = [
  { id: "PHÒNG CNTT", name: "Phòng Công Nghệ Thông Tin", icon: Server, color: "bg-blue-500" },
  { id: "PHÒNG VTTBYT", name: "Vật Tư Thiết Bị Y Tế", icon: Stethoscope, color: "bg-green-500" },
  { id: "XÉT NGHIỆM", name: "Khoa Xét Nghiệm", icon: Microscope, color: "bg-purple-500" },
  { id: "DƯỢC", name: "Khoa Dược", icon: Pill, color: "bg-orange-500" },
  { id: "PHÒNG HCQT", name: "Hành Chính Quản Trị", icon: Building2, color: "bg-teal-500" },
  { id: "PHÒNG KẾ TOÁN HÀNH CHÍNH", name: "Kế Toán Hành Chính", icon: Users, color: "bg-pink-500" }
];

function getTenderStatus(item: NewsItem): TenderStatus {
  if (!item.tenderEndDate) return "Đang mở";
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

function getStatusColor(status: string) {
  switch (status) {
    case "Đang mở": return "bg-brand-green text-white";
    case "Sắp mở": return "bg-peach text-white";
    case "Đã đóng": return "bg-gray-400 text-white";
    default: return "bg-gray-200 text-gray-700";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "Đang mở": return "ĐANG MỞ THẦU";
    case "Sắp mở": return "SẮP ĐÓNG";
    case "Đã đóng": return "ĐÃ KẾT THÚC";
    default: return status;
  }
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.match(/(\d{2}):(\d{2}):(\d{2}) ngày (\d{2})\/(\d{2})\/(\d{4})/);
  if (!parts) return dateStr.split(" ").pop() || dateStr;
  const [, hours, minutes, seconds, day, month, year] = parts;
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export default function ThongTinThauPage() {
  const { news } = useHospital();
  const [expandedDept, setExpandedDept] = useState<string | null>("PHÒNG VTTBYT");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTender, setSelectedTender] = useState<NewsItem | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const tenders = useMemo(() => {
    return news.filter(item => item.isTender === true).map(item => ({
      ...item,
      status: getTenderStatus(item)
    }));
  }, [news]);

  const tendersByDept = useMemo(() => {
    const filtered = statusFilter === "all"
      ? tenders
      : tenders.filter(t => t.status === statusFilter);

    const grouped: Record<string, typeof filtered> = {};
    DEPARTMENTS.forEach(dept => {
      grouped[dept.id] = filtered.filter(t => t.tenderDept === dept.id);
    });
    return grouped;
  }, [tenders, statusFilter]);

  const deptStats = useMemo(() => {
    const stats: Record<string, { open: number; coming: number; closed: number; total: number }> = {};
    DEPARTMENTS.forEach(dept => {
      const deptTenders = tenders.filter(t => t.tenderDept === dept.id);
      stats[dept.id] = {
        open: deptTenders.filter(t => t.status === "Đang mở").length,
        coming: deptTenders.filter(t => t.status === "Sắp mở").length,
        closed: deptTenders.filter(t => t.status === "Đã đóng").length,
        total: deptTenders.length
      };
    });
    return stats;
  }, [tenders]);

  const toggleDept = (deptId: string) => {
    setExpandedDept(expandedDept === deptId ? null : deptId);
  };

  const handleDownload = (item: NewsItem) => {
    if (item.tenderFile?.url) {
      window.open(item.tenderFile.url, "_blank");
      setDownloadToast(`Đã tải: ${item.tenderFile.name}`);
    } else {
      const fileName = item.tenderFile?.name || "ThongBao_Thau.pdf";
      setDownloadToast(`Đang tải: ${fileName}`);
      setTimeout(() => setDownloadToast(null), 3000);
    }
  };

  return (
    <Layout>
      {downloadToast && (
        <div className="fixed top-24 right-4 z-[200] bg-green-dark text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in-down">
          <CheckCircle size={16} className="text-[#2FA968]" />
          {downloadToast}
        </div>
      )}

      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up" className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 bg-[#EAF7EE] text-[#164B36] font-bold text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#2FA968]/20 mb-4">
              <FileCheck size={14} /> Cổng thông tin đấu thầu
            </span>
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Thông tin đấu thầu</h1>
            <p className="text-ink/80 max-w-2xl mx-auto">
              Thông báo chào giá các gói thầu của Bệnh viện theo từng phòng ban
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={100} className="flex justify-center gap-3 flex-wrap">
            {[
              { key: "all", label: "Tất cả", count: tenders.length },
              { key: "Đang mở", label: "Đang mở", count: tenders.filter(t => t.status === "Đang mở").length },
              { key: "Sắp mở", label: "Sắp mở", count: tenders.filter(t => t.status === "Sắp mở").length },
              { key: "Đã đóng", label: "Đã đóng", count: tenders.filter(t => t.status === "Đã đóng").length }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  statusFilter === filter.key
                    ? "bg-brand-green text-white shadow-md"
                    : "bg-white text-ink/70 hover:bg-mint border border-green-800/10"
                }`}
              >
                {filter.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  statusFilter === filter.key ? "bg-white/20" : "bg-mint/50"
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <div className="space-y-4">
            {DEPARTMENTS.map(dept => {
              const Icon = dept.icon;
              const deptTenders = tendersByDept[dept.id];
              const stats = deptStats[dept.id];
              const isExpanded = expandedDept === dept.id;
              const hasTenders = deptTenders.length > 0;

              if (!hasTenders && statusFilter !== "all") return null;

              return (
                <div key={dept.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-green-800/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleDept(dept.id)}
                      className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-mint/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ rotate: isExpanded ? 360 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`w-12 h-12 ${dept.color} rounded-xl flex items-center justify-center shadow-sm`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="text-left">
                          <h3 className="font-display font-bold text-lg text-green-dark">{dept.name}</h3>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-ink/60 bg-mint/40 px-2.5 py-1 rounded-full font-semibold">
                              {stats.total} thông báo
                            </span>
                            {stats.open > 0 && (
                              <span className="text-xs text-brand-green font-bold bg-brand-green/10 px-2.5 py-1 rounded-full">
                                {stats.open} đang mở
                              </span>
                            )}
                            {stats.coming > 0 && (
                              <span className="text-xs text-peach font-bold bg-peach/10 px-2.5 py-1 rounded-full">
                                {stats.coming} sắp mở
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {hasTenders ? (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-2 text-ink/50"
                        >
                          <span className="text-xs hidden sm:inline">{
                            isExpanded ? "Thu gọn" : "Xem chi tiết"
                          }</span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </motion.div>
                      ) : (
                        <span className="text-xs text-ink/40 italic bg-gray-50 px-3 py-1.5 rounded-lg">Không có thầu</span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && hasTenders && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-green-800/5 p-5">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1, duration: 0.2 }}
                              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                            >
                              {deptTenders.map((item, idx) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                                  onClick={() => setSelectedTender(item)}
                                  className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-800/5 hover:border-brand-green/30 group"
                                >
                                  <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                      src={item.image || "/images/pages/chi-phi-1.jpeg"}
                                      alt={item.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                                    <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
                                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(item.status)} shadow-lg`}>
                                        {getStatusLabel(item.status)}
                                      </span>
                                      {item.tenderNumber && (
                                        <span className="bg-[#164B36]/90 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-md shadow">
                                          {item.tenderNumber}
                                        </span>
                                      )}
                                    </div>

                                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                                      <div className="flex items-center gap-2 text-white/90 text-[11px] bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1.5">
                                        <Calendar size={11} />
                                        <span>{item.tenderEndDate ? formatDateShort(item.tenderEndDate) : item.date}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-4">
                                    <h4 className="font-bold text-green-dark text-[13px] leading-snug line-clamp-2 min-h-[36px] group-hover:text-brand-green transition-colors">
                                      {item.title}
                                    </h4>

                                    {item.tenderEstimateValue && (
                                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-600">
                                        <DollarSign size={11} className="text-brand-green" />
                                        <span className="font-medium">{item.tenderEstimateValue}</span>
                                      </div>
                                    )}

                                    {item.tenderMethod && (
                                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
                                        <BadgeCheck size={11} className="text-[#2FA968]" />
                                        <span>{item.tenderMethod}</span>
                                      </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-green-800/5 flex items-center justify-between">
                                      <span className="text-[11px] text-ink/50 font-medium">Xem chi tiết</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDownload(item);
                                        }}
                                        className="w-7 h-7 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white transition-all cursor-pointer"
                                        title="Tải hồ sơ thầu"
                                      >
                                        <Download size={12} />
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {tenders.length === 0 && (
            <div className="text-center py-16 text-ink/50">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Chưa có thông báo đấu thầu nào được đăng tải.</p>
            </div>
          )}

          <ScrollAnimation animation="fade-up" className="mt-12">
            <div className="bg-mint/30 rounded-[20px] p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-brand-green" />
                </div>
                <h2 className="font-display font-bold text-xl text-green-dark">
                  Hướng dẫn tham gia đấu thầu
                </h2>
              </div>
              <p className="text-ink/70 text-sm max-w-2xl mx-auto mb-6">
                Nhà thầu vui lòng tải file PDF có chữ ký số và đóng dấu đỏ của bệnh viện.
                Sau khi nghiên cứu, gửi hồ sơ theo thông tin liên hệ trong file.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-ink/60">
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-brand-green">📧</span> benhvien@bvqnam.vn
                </span>
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-brand-green">📞</span> 02353.747.432
                </span>
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-brand-green">📍</span> 123 Đường XYZ, TP. Quảng Nam
                </span>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <AnimatePresence>
        {selectedTender && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] overflow-y-auto"
          >
            <div className="min-h-screen flex items-start justify-center p-4 bg-black/50">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="bg-white rounded-[20px] w-full max-w-3xl my-8 overflow-hidden shadow-2xl"
              >
                <div className="relative bg-gradient-to-r from-green-dark to-brand-green p-6">
                  <button
                    onClick={() => setSelectedTender(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <FileCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-grow">
                      {selectedTender.tenderNumber && (
                        <span className="text-xs font-mono opacity-80 bg-white/20 px-2 py-0.5 rounded mb-1 inline-block">
                          {selectedTender.tenderNumber}
                        </span>
                      )}
                      <h2 className="font-display font-bold text-xl text-white mt-1 leading-tight">
                        {selectedTender.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                          {selectedTender.tenderDept || "Phòng HCQT"}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusColor(selectedTender.status)}`}>
                          {getStatusLabel(selectedTender.status)}
                        </span>
                        {selectedTender.tenderMethod && (
                          <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full">
                            {selectedTender.tenderMethod}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  {selectedTender.image && (
                    <div className="rounded-xl overflow-hidden border border-green-800/10">
                      <img
                        src={selectedTender.image}
                        alt={selectedTender.title}
                        className="w-full h-auto max-h-[300px] object-cover bg-gray-50"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {selectedTender.tenderFile?.url && selectedTender.tenderFile.fileType?.startsWith("image/") && (
                    <div className="rounded-xl overflow-hidden border border-green-800/10">
                      <img
                        src={selectedTender.tenderFile.url}
                        alt={selectedTender.tenderFile.name}
                        className="w-full h-auto max-h-[400px] object-contain bg-gray-50"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="bg-cream-white rounded-xl p-4">
                    <p className="text-ink/80 text-sm leading-relaxed">{selectedTender.summary}</p>
                  </div>

                  {selectedTender.content && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-ink/80 text-sm leading-relaxed whitespace-pre-line">{selectedTender.content}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-mint/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-brand-green text-xs font-bold mb-1">
                        <Clock size={12} />
                        Ngày đăng
                      </div>
                      <p className="text-sm font-semibold text-green-dark">{selectedTender.date}</p>
                    </div>
                    <div className="bg-peach/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-peach text-xs font-bold mb-1">
                        <Calendar size={12} />
                        Hạn nộp
                      </div>
                      <p className="text-sm font-semibold text-green-dark">
                        {selectedTender.tenderEndDate ? formatDateShort(selectedTender.tenderEndDate) : "Liên hệ bệnh viện"}
                      </p>
                    </div>
                  </div>

                  {selectedTender.tenderEstimateValue && (
                    <div className="bg-green-dark/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-brand-green text-xs font-bold mb-1">
                        <DollarSign size={12} />
                        Giá trị dự toán
                      </div>
                      <p className="text-base font-bold text-green-dark">{selectedTender.tenderEstimateValue}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTender.tenderReceivedLocation && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold mb-1">
                          <MapPin size={12} />
                          Địa điểm nộp hồ sơ
                        </div>
                        <p className="text-sm text-ink/80">{selectedTender.tenderReceivedLocation}</p>
                      </div>
                    )}
                    {selectedTender.tenderContact && (
                      <div className="bg-purple-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-purple-600 text-xs font-bold mb-1">
                          <Phone size={12} />
                          Người liên hệ
                        </div>
                        <p className="text-sm font-semibold text-green-dark">{selectedTender.tenderContact}</p>
                        {selectedTender.tenderContactPhone && (
                          <p className="text-xs text-ink/60 mt-0.5">{selectedTender.tenderContactPhone}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedTender.tenderFile && (
                    <div className="border-t border-green-800/10 pt-4">
                      <p className="text-xs font-bold text-green-dark mb-2 flex items-center gap-2">
                        <FileCheck size={14} />
                        File đính kèm:
                      </p>
                      <div className="flex items-center justify-between bg-mint/30 rounded-xl p-4">
                        <div>
                          <p className="text-sm font-semibold text-green-dark">{selectedTender.tenderFile.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-ink/60">{selectedTender.tenderFile.size}</span>
                            <span className="text-xs text-ink/40">•</span>
                            <span className="text-xs text-ink/60">Lượt tải: {selectedTender.tenderDownloadCount || 0}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(selectedTender)}
                          className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Download size={14} />
                          Tải xuống
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-green-800/10 pt-4 flex justify-end">
                    <button
                      onClick={() => setSelectedTender(null)}
                      className="px-5 py-2.5 border border-green-800/20 text-green-dark rounded-full text-sm font-semibold hover:bg-green-800/5 transition-colors cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}