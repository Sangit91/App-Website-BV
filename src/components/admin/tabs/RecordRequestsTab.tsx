import { useState, useEffect, useMemo } from "react";
import { Card, Badge, Button } from "../../ui";
import {
  Search, FileText, Eye, Check, X, Clock, Ban, Download, ImageIcon,
  Phone, Mail, User, FileType2, Calendar, Truck, MessageSquare,
  ClipboardList, CheckCircle2, Circle, XCircle, ZoomIn,
  Tag, ArrowRight, Activity, FolderOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAdmin } from "../../../context/AdminContext";
import { useAuthedFetch } from "../../../hooks/useAuthedFetch";

type RecordRequestStatus = 'moi' | 'dang_xu_ly' | 'da_xu_ly' | 'da_huy';

interface RecordRequestFile {
  id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  mime_type?: string | null;
}

interface RecordRequest {
  id: string;
  request_code: string;
  patient_name: string;
  patient_code: string | null;
  request_type: 'ho-so-y-te' | 'phieu-xet-nghiem' | 'anh-pha' | 'don-thuoc' | 'giay-chung-nhan' | 'other';
  date_range_from: string;
  date_range_to: string;
  delivery_method: string | null;
  reason: string;
  status: RecordRequestStatus;
  admin_notes: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  assigned_to: string | null;
  processed_by: string | null;
  files: RecordRequestFile[];
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<RecordRequestStatus, { label: string; className: string }> = {
  moi: { label: "Mới", className: "bg-peach/20 text-peach" },
  dang_xu_ly: { label: "Đang xử lý", className: "bg-blue-100 text-blue-700" },
  da_xu_ly: { label: "Đã xử lý", className: "bg-mint text-green-dark" },
  da_huy: { label: "Đã hủy", className: "bg-gray-200 text-gray-500" }
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  'ho-so-y-te': 'Hồ sơ y tế',
  'phieu-xet-nghiem': 'Phiếu xét nghiệm',
  'anh-pha': 'Ảnh phóng xạ',
  'don-thuoc': 'Đơn thuốc',
  'giay-chung-nhan': 'Giấy chứng nhận',
  'other': 'Khác'
};

const DELIVERY_METHOD_LABELS: Record<string, string> = {
  'tai-kham': 'Nhận khi tái khám',
  'nhan-tai-quay': 'Nhận tại quầy',
  'chuyen-bo-post': 'Chuyển bưu điện'
};

const TYPE_COLORS: Record<string, string> = {
  'ho-so-y-te': 'bg-blue-100 text-blue-700',
  'phieu-xet-nghiem': 'bg-purple-100 text-purple-700',
  'anh-pha': 'bg-amber-100 text-amber-700',
  'don-thuoc': 'bg-green-100 text-green-700',
  'giay-chung-nhan': 'bg-cyan-100 text-cyan-700',
  'other': 'bg-gray-100 text-gray-600',
};

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: "easeOut" as const }
  })
};

export default function RecordRequestsTab() {
  const { accessToken } = useAdmin();
  const authedFetch = useAuthedFetch();
  const [requests, setRequests] = useState<RecordRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RecordRequestStatus | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<RecordRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [previewModalFile, setPreviewModalFile] = useState<RecordRequestFile | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
    try {
      const res = await authedFetch("/api/v1/record-requests");
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalized = data.map(item => ({
          id: item.id,
          request_code: item.requestCode || item.request_code || "",
          patient_name: item.patientName || item.patient_name || "",
          patient_code: item.patientCode || item.patient_code || null,
          request_type: item.requestType || item.request_type || "other",
          date_range_from: item.dateFrom || item.dateRangeFrom || item.date_range_from || "",
          date_range_to: item.dateTo || item.dateRangeTo || item.date_range_to || "",
          delivery_method: item.deliveryMethod || item.delivery_method || null,
          reason: item.reason || "",
          status: (item.status || "moi") as RecordRequestStatus,
          admin_notes: item.adminNotes || item.admin_notes || null,
          contact_phone: item.contactPhone || item.contact_phone || null,
          contact_email: item.contactEmail || item.contact_email || null,
          assigned_to: item.assignedTo || item.assigned_to || null,
          processed_by: item.processedBy || item.processed_by || null,
          files: (item.files || []).map((f: any) => ({
            id: f.id,
            file_name: f.fileName || f.file_name || "",
            file_type: f.fileType || f.file_type || "",
            file_path: f.filePath || f.file_path || "",
            mime_type: f.mimeType || f.mime_type || null
          })),
          created_at: item.createdAt || item.created_at || new Date().toISOString(),
          updated_at: item.updatedAt || item.updated_at || new Date().toISOString()
        }));
        setRequests(normalized);
      } else {
        setRequests([]);
      }
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
    };
    fetchRequests();
  }, []);

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchSearch =
        r.patient_name.toLowerCase().includes(search.toLowerCase()) ||
        r.request_code.toLowerCase().includes(search.toLowerCase()) ||
        r.reason.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, search, statusFilter]);

  const handleOpenDetail = (req: RecordRequest) => {
    setSelectedRequest(req);
    setAdminNotes(req.admin_notes || "");
    setDetailModalOpen(true);
  };

  useEffect(() => {
    if (!detailModalOpen || !selectedRequest) {
      setPreviewUrls(prev => {
        Object.values(prev).forEach(url => URL.revokeObjectURL(url));
        return {};
      });
      return;
    }

    const images = selectedRequest.files.filter(f => isImage(f.mime_type));
    if (images.length === 0) return;

    let cancelled = false;
    const fetched: Record<string, string> = {};

    (async () => {
      for (const f of images) {
        const res = await authedFetch(fileUrl(selectedRequest.id, f.id));
        if (!res.ok) {
          console.warn(`[record-requests] fetch preview failed for file ${f.id}: HTTP ${res.status}`);
          continue;
        }
        const blob = await res.blob();
        if (cancelled) {
          URL.revokeObjectURL(URL.createObjectURL(blob));
          continue;
        }
        fetched[f.id] = URL.createObjectURL(blob);
      }
      if (!cancelled) setPreviewUrls(fetched);
    })();

    return () => {
      cancelled = true;
      Object.values(fetched).forEach(url => URL.revokeObjectURL(url));
    };
  }, [detailModalOpen, selectedRequest, authedFetch]);

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !adminNotes.trim()) return;
    setIsReplying(true);
    try {
      const res = await authedFetch(`/api/v1/record-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "da_xu_ly",
          admin_notes: adminNotes,
          processed_by: "admin-001"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRequests(prev =>
        prev.map(r =>
          r.id === selectedRequest.id
            ? { ...r, status: "da_xu_ly" as RecordRequestStatus, admin_notes: adminNotes, updated_at: new Date().toISOString() }
            : r
        )
      );
      setDetailModalOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thể cập nhật xử lý");
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (id: string, status: RecordRequestStatus) => {
    try {
      const res = await authedFetch(`/api/v1/record-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thể cập nhật trạng thái");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const fileUrl = (requestId: string, fileId: string) =>
    `/api/v1/record-requests/${requestId}/files/${fileId}`;

  const handleViewFile = async (requestId: string, file: RecordRequestFile) => {
    if (!accessToken) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }
    const url = fileUrl(requestId, file.id);
    const res = await authedFetch(url);
    if (!res.ok) {
      alert(`Không thể mở file (HTTP ${res.status}). Vui lòng thử lại.`);
      return;
    }
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  };

  const handleOpenPreviewModal = (file: RecordRequestFile) => {
    if (!isImage(file.mime_type) && !isPdf(file.mime_type)) return;
    setPreviewModalFile(file);
  };

  const handleDownloadFile = async (requestId: string, file: RecordRequestFile) => {
    if (!accessToken) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }
    const url = fileUrl(requestId, file.id);
    const res = await authedFetch(url);
    if (!res.ok) {
      alert(`Không thể tải file (HTTP ${res.status}). Vui lòng thử lại.`);
      return;
    }
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = file.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  };

  const isImage = (mime?: string | null) => !!mime && mime.startsWith("image/");
  const isPdf = (mime?: string | null) => mime === "application/pdf";

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green/20 to-green-dark/20 flex items-center justify-center shadow-sm">
            <FolderOpen size={18} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-green-dark">Yêu cầu trích sao hồ sơ</h2>
            <p className="text-[11px] text-ink/50">Xem và xử lý yêu cầu cấp bản sao hồ sơ y tế</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">
          {requests.length} yêu cầu
        </span>
      </div>

      <Card variant="default" padding="md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã yêu cầu, lý do..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cream-white border border-green-800/10 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-green text-green-dark"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "moi", "dang_xu_ly", "da_xu_ly", "da_huy"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === s
                    ? "bg-brand-green text-white"
                    : "bg-gray-100 text-ink/70 hover:bg-gray-200"
                }`}
              >
                {s === "all" ? "Tất cả" : STATUS_CONFIG[s as RecordRequestStatus].label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card variant="default" padding="lg">
        {loading ? (
          <div className="text-center py-12 text-ink/50 text-sm">Đang tải dữ liệu...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-ink/40">
            <FolderOpen size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Không có yêu cầu nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                  <th className="p-3">Mã yêu cầu</th>
                  <th className="p-3">Người yêu cầu</th>
                  <th className="p-3">Loại hồ sơ</th>
                  <th className="p-3">Khoảng thời gian</th>
                  <th className="p-3">Lý do</th>
                  <th className="p-3">Liên hệ</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((r, i) => (
                  <motion.tr key={r.id} custom={i} initial="hidden" animate="visible" variants={rowVariants}
                    className="group hover:bg-cream-white/80 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-brand-green">
                    <td className="p-3 font-mono font-bold text-green-dark">{r.request_code}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-green/10 flex items-center justify-center text-[10px] font-bold text-brand-green shrink-0">
                          {r.patient_name.charAt(0)}
                        </div>
                        <span className="font-bold text-green-dark">{r.patient_name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[r.request_type] || 'bg-gray-100 text-gray-600'}`}>
                        {REQUEST_TYPE_LABELS[r.request_type] || r.request_type}
                      </span>
                    </td>
                    <td className="p-3 text-ink/60 text-xs whitespace-nowrap">
                      {formatDate(r.date_range_from)} → {formatDate(r.date_range_to)}
                    </td>
                    <td className="p-3 max-w-xs">
                      <p className="text-ink/70 line-clamp-2">{r.reason}</p>
                    </td>
                    <td className="p-3 text-ink/50 text-xs">
                      {r.contact_phone && <div>{r.contact_phone}</div>}
                      {r.contact_email && <div>{r.contact_email}</div>}
                    </td>
                    <td className="p-3">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_CONFIG[r.status].className}`}>
                        {STATUS_CONFIG[r.status].label}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenDetail(r)}
                          className="p-1.5 rounded-lg bg-brand-green/10 hover:bg-brand-green/20 text-brand-green cursor-pointer transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={14} />
                        </button>
                        {r.status === "moi" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(r.id, "dang_xu_ly")}
                              className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 cursor-pointer transition-colors"
                              title="Đánh dấu đang xử lý"
                            >
                              <Clock size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(r.id, "da_huy")}
                              className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-500 cursor-pointer transition-colors"
                              title="Hủy yêu cầu"
                            >
                              <Ban size={14} />
                            </button>
                          </>
                        )}
                        {r.status === "dang_xu_ly" && (
                          <button
                            onClick={() => handleStatusChange(r.id, "da_xu_ly")}
                            className="p-1.5 rounded-lg bg-mint hover:bg-mint/80 text-green-dark cursor-pointer transition-colors"
                            title="Đánh dấu đã xử lý"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AnimatePresence>
        {detailModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-green-800/10 my-auto"
            >
              {/* Header Gradient Xanh Luxury */}
              <div className="bg-gradient-to-r from-green-dark via-green-900 to-brand-green text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-bold bg-white/20 text-white px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
                        <Tag size={12} /> {selectedRequest.request_code}
                      </span>
                      <Badge className={STATUS_CONFIG[selectedRequest.status].className}>
                        {STATUS_CONFIG[selectedRequest.status].label}
                      </Badge>
                    </div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                      Chi tiết yêu cầu trích sao hồ sơ
                    </h3>
                    <p className="text-xs text-white/70 flex items-center gap-1.5">
                      <Calendar size={13} /> Khởi tạo ngày {new Date(selectedRequest.created_at).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={() => setDetailModalOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer transition-all hover:scale-105 shrink-0"
                    aria-label="Đóng modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Body 2 Cột */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 bg-gray-50/50">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Cột Trái: Glass Card Thông tin Bệnh nhân & Đề nghị (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Thẻ Bệnh nhân */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-green-800/10 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-green-dark font-bold text-xs uppercase tracking-wide border-b border-ink/5 pb-2">
                        <User size={15} className="text-brand-green" />
                        <span>Thông tin đối tượng</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-ink/40">Họ và tên bệnh nhân</p>
                          <p className="font-bold text-green-dark text-sm">{selectedRequest.patient_name}</p>
                        </div>
                        {selectedRequest.patient_code && (
                          <div>
                            <p className="text-ink/40">Mã bệnh nhân / KCB (HIS)</p>
                            <p className="font-mono font-semibold text-ink bg-gray-100 px-2 py-0.5 rounded inline-block">
                              {selectedRequest.patient_code}
                            </p>
                          </div>
                        )}
                        {(selectedRequest.contact_phone || selectedRequest.contact_email) && (
                          <div className="pt-1 space-y-1">
                            <p className="text-ink/40">Kênh liên hệ</p>
                            {selectedRequest.contact_phone && (
                              <div className="flex items-center gap-1.5 font-medium text-ink/80">
                                <Phone size={13} className="text-brand-green" />
                                <span>{selectedRequest.contact_phone}</span>
                              </div>
                            )}
                            {selectedRequest.contact_email && (
                              <div className="flex items-center gap-1.5 font-medium text-ink/80 truncate">
                                <Mail size={13} className="text-brand-green" />
                                <span className="truncate">{selectedRequest.contact_email}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thẻ Chi tiết Yêu cầu */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-green-800/10 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-green-dark font-bold text-xs uppercase tracking-wide border-b border-ink/5 pb-2">
                        <FileType2 size={15} className="text-brand-green" />
                        <span>Đặc tả hồ sơ đề nghị</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-ink/40">Loại hồ sơ yêu cầu</p>
                          <p className="font-semibold text-green-dark bg-mint/50 text-green-dark px-2.5 py-1 rounded-lg border border-brand-green/20 inline-block mt-0.5">
                            {REQUEST_TYPE_LABELS[selectedRequest.request_type] || selectedRequest.request_type}
                          </p>
                        </div>
                        <div>
                          <p className="text-ink/40">Khoảng thời gian điều trị/KCB</p>
                          <p className="font-medium text-ink bg-gray-50 p-2 rounded-lg border border-ink/5 flex items-center justify-between text-[11px] mt-0.5">
                            <span>{formatDate(selectedRequest.date_range_from)}</span>
                            <ArrowRight size={12} className="text-ink/30" />
                            <span>{formatDate(selectedRequest.date_range_to)}</span>
                          </p>
                        </div>
                        {selectedRequest.delivery_method && (
                          <div>
                            <p className="text-ink/40">Phương thức nhận bản sao</p>
                            <p className="font-medium text-ink flex items-center gap-1.5 mt-0.5">
                              <Truck size={13} className="text-brand-green" />
                              {DELIVERY_METHOD_LABELS[selectedRequest.delivery_method] || selectedRequest.delivery_method}
                            </p>
                          </div>
                        )}
                        <div className="pt-1">
                          <p className="text-ink/40 mb-1">Lý do yêu cầu trích sao</p>
                          <div className="bg-cream-white p-3 rounded-xl border border-green-800/10 text-ink/80 text-xs italic leading-relaxed">
                            "{selectedRequest.reason}"
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cột Phải: Timeline, Files đính kèm, Admin Note (7 cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Visual Progress Timeline */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-green-800/10 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-green-dark font-bold text-xs uppercase tracking-wide border-b border-ink/5 pb-2">
                        <Activity size={15} className="text-brand-green" />
                        <span>Tiến trình xử lý</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 relative pt-2">
                        {/* Step 1: Mới */}
                        <div className="flex flex-col items-center text-center space-y-1 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            selectedRequest.status !== 'da_huy'
                              ? 'bg-brand-green text-white shadow-xs'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <CheckCircle2 size={16} />
                          </div>
                          <p className="text-[11px] font-bold text-green-dark">Tiếp nhận</p>
                          <p className="text-[10px] text-ink/40">Đã khởi tạo</p>
                        </div>

                        {/* Step 2: Đang xử lý */}
                        <div className="flex flex-col items-center text-center space-y-1 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            selectedRequest.status === 'dang_xu_ly'
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                              : selectedRequest.status === 'da_xu_ly'
                              ? 'bg-brand-green text-white'
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          }`}>
                            {selectedRequest.status === 'dang_xu_ly' ? <Clock size={16} /> : selectedRequest.status === 'da_xu_ly' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          </div>
                          <p className="text-[11px] font-bold text-green-dark">Xử lý hồ sơ</p>
                          <p className="text-[10px] text-ink/40">Tra cứu & sao chép</p>
                        </div>

                        {/* Step 3: Đã xử lý / Đã hủy */}
                        <div className="flex flex-col items-center text-center space-y-1 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            selectedRequest.status === 'da_xu_ly'
                              ? 'bg-brand-green text-white ring-4 ring-green-100'
                              : selectedRequest.status === 'da_huy'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          }`}>
                            {selectedRequest.status === 'da_xu_ly' ? <CheckCircle2 size={16} /> : selectedRequest.status === 'da_huy' ? <XCircle size={16} /> : <Circle size={16} />}
                          </div>
                          <p className="text-[11px] font-bold text-green-dark">
                            {selectedRequest.status === 'da_huy' ? 'Đã hủy' : 'Hoàn thành'}
                          </p>
                          <p className="text-[10px] text-ink/40">
                            {selectedRequest.status === 'da_huy' ? 'Yêu cầu bị từ chối' : 'Sẵn sàng trả kết quả'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Files Đính Kèm Grid (Hover Lift) */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-green-800/10 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                        <div className="flex items-center gap-2 text-green-dark font-bold text-xs uppercase tracking-wide">
                          <ClipboardList size={15} className="text-brand-green" />
                          <span>Tài liệu đính kèm ({selectedRequest.files?.length || 0})</span>
                        </div>
                      </div>

                      {selectedRequest.files && selectedRequest.files.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {selectedRequest.files.map(f => {
                            const previewUrl = previewUrls[f.id];
                            return (
                              <div
                                key={f.id}
                                className="group relative border border-green-800/10 hover:border-brand-green/40 rounded-xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col"
                              >
                                {isImage(f.mime_type) ? (
                                  <button
                                    onClick={() => handleOpenPreviewModal(f)}
                                    className="w-full aspect-4/3 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer relative group/img"
                                    title={`Mở xem ${f.file_name}`}
                                    aria-label={`Xem ảnh ${f.file_name}`}
                                  >
                                    {previewUrl ? (
                                      <img
                                        src={previewUrl}
                                        alt={f.file_name}
                                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[11px] text-ink/40">
                                        Đang tải...
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                                      <ZoomIn size={22} className="text-white drop-shadow-md" />
                                    </div>
                                  </button>
                                ) : (
                                  <div
                                    onClick={() => handleOpenPreviewModal(f)}
                                    className="w-full aspect-4/3 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-1 cursor-pointer group/pdf hover:bg-red-50/50 transition-colors"
                                  >
                                    <FileText size={32} className="text-red-500/70 group-hover/pdf:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-red-600 uppercase bg-red-100 px-1.5 py-0.5 rounded">PDF</span>
                                  </div>
                                )}
                                <div className="p-2 space-y-1.5 bg-white flex-1 flex flex-col justify-between">
                                  <p className="text-[11px] font-medium text-ink/80 truncate" title={f.file_name}>
                                    {f.file_name}
                                  </p>
                                  <div className="flex items-center gap-1 pt-1 border-t border-ink/5">
                                    <button
                                      onClick={() => handleOpenPreviewModal(f)}
                                      className="flex-1 text-[10px] font-semibold bg-brand-green/10 hover:bg-brand-green/20 text-brand-green px-2 py-1 rounded-md cursor-pointer transition-colors text-center"
                                      title="Xem xem trước"
                                    >
                                      {isImage(f.mime_type) ? <ImageIcon size={10} className="inline mr-1" /> : <Eye size={10} className="inline mr-1" />}
                                      Xem
                                    </button>
                                    <button
                                      onClick={() => handleDownloadFile(selectedRequest.id, f)}
                                      className="text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 text-ink/70 p-1.5 rounded-md cursor-pointer transition-colors"
                                      title="Tải về"
                                    >
                                      <Download size={11} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-ink/50 italic py-2">Không có tệp đính kèm nào được tải lên.</p>
                      )}
                    </div>

                    {/* Ghi chú & Thao tác của Admin */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-green-800/10 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 text-green-dark font-bold text-xs uppercase tracking-wide border-b border-ink/5 pb-2">
                        <MessageSquare size={15} className="text-brand-green" />
                        <span>Phản hồi & Xử lý Yêu cầu</span>
                      </div>

                      {selectedRequest.admin_notes && (
                        <div className="space-y-1 bg-mint/40 p-3.5 rounded-xl border border-brand-green/20">
                          <p className="text-[11px] font-bold text-green-dark flex items-center justify-between">
                            <span>Ghi chú đã lưu:</span>
                            {selectedRequest.processed_by && (
                              <span className="text-[10px] text-ink/50 font-normal">Xử lý bởi: {selectedRequest.processed_by}</span>
                            )}
                          </p>
                          <p className="text-xs text-ink/80">{selectedRequest.admin_notes}</p>
                        </div>
                      )}

                      {selectedRequest.status !== "da_xu_ly" && selectedRequest.status !== "da_huy" ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-ink/60 mb-1">
                              Cập nhật ghi chú xử lý / Hướng dẫn trả kết quả
                            </label>
                            <textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Ví dụ: Đã chuẩn bị hồ sơ bản sao, hẹn bệnh nhân nhận tại Quầy số 3 vào 14h00 ngày 29/07..."
                              rows={3}
                              className="w-full px-3.5 py-2.5 text-xs border border-green-800/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none bg-cream-white/50 text-green-dark"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-1.5">
                              {selectedRequest.status === "moi" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(selectedRequest.id, "dang_xu_ly")}
                                  className="text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                                >
                                  <Clock size={13} /> Chuyển "Đang xử lý"
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleStatusChange(selectedRequest.id, "da_huy")}
                                className="text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                              >
                                <Ban size={13} /> Hủy yêu cầu
                              </button>
                            </div>

                            <Button
                              variant="primary"
                              size="md"
                              disabled={!adminNotes.trim() || isReplying}
                              onClick={handleSubmitResponse}
                              className="shadow-sm hover:shadow-md"
                            >
                              <CheckCircle2 size={15} className="mr-1.5" />
                              {isReplying ? "Đang lưu..." : "Xác nhận đã hoàn tất"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          <Button variant="ghost" size="md" onClick={() => setDetailModalOpen(false)}>
                            Đóng
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Preview File Riêng (Image Zoom & PDF Preview) */}
      <AnimatePresence>
        {previewModalFile && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="bg-zinc-900 text-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-white/10"
            >
              {/* Header Preview */}
              <div className="p-4 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-lg bg-white/10">
                    {isImage(previewModalFile.mime_type) ? <ImageIcon size={18} className="text-brand-green" /> : <FileText size={18} className="text-red-400" />}
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-sm text-white truncate">{previewModalFile.file_name}</h4>
                    <p className="text-[11px] text-zinc-400">
                      {previewModalFile.mime_type || "File đính kèm"} · Yêu cầu #{selectedRequest.request_code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadFile(selectedRequest.id, previewModalFile)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Tải về"
                  >
                    <Download size={14} /> Tải về
                  </button>
                  <button
                    onClick={() => setPreviewModalFile(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                    title="Đóng"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Body Preview */}
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-zinc-950/80 min-h-[300px]">
                {previewUrls[previewModalFile.id] ? (
                  isImage(previewModalFile.mime_type) ? (
                    <img
                      src={previewUrls[previewModalFile.id]}
                      alt={previewModalFile.file_name}
                      className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                    />
                  ) : isPdf(previewModalFile.mime_type) ? (
                    <iframe
                      src={previewUrls[previewModalFile.id]}
                      title={previewModalFile.file_name}
                      className="w-full h-[75vh] rounded-lg border-0 bg-white"
                    />
                  ) : (
                    <div className="text-center p-8 text-zinc-400 space-y-3">
                      <FileText size={48} className="mx-auto text-zinc-600" />
                      <p>Định dạng file không hỗ trợ xem trực tiếp.</p>
                      <button
                        onClick={() => handleDownloadFile(selectedRequest.id, previewModalFile)}
                        className="px-4 py-2 bg-brand-green text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Download size={14} /> Tải tệp tin về
                      </button>
                    </div>
                  )
                ) : (
                  <div className="text-center p-8 text-zinc-400 space-y-2">
                    <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs">Đang tải bản xem trước tệp...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}