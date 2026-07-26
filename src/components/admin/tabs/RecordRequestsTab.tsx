import { useState, useEffect, useMemo } from "react";
import { Card, Badge, Button } from "../../ui";
import { Search, FileText, Eye, Check, X, Clock, Ban } from "lucide-react";

type RecordRequestStatus = 'moi' | 'dang_xu_ly' | 'da_xu_ly' | 'da_huy';

interface RecordRequestFile {
  id: string;
  file_name: string;
  file_type: string;
  file_path: string;
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

export default function RecordRequestsTab() {
  const [requests, setRequests] = useState<RecordRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RecordRequestStatus | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<RecordRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/v1/record-requests");
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
            file_path: f.filePath || f.file_path || ""
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

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !adminNotes.trim()) return;
    setIsReplying(true);
    try {
      const res = await fetch(`/api/v1/record-requests/${selectedRequest.id}`, {
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
    } catch (error: any) {
      alert(error.message || "Không thể cập nhật xử lý");
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (id: string, status: RecordRequestStatus) => {
    try {
      const res = await fetch(`/api/v1/record-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r))
      );
    } catch (error: any) {
      alert(error.message || "Không thể cập nhật trạng thái");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Yêu cầu trích sao hồ sơ</h2>
          <p className="text-sm text-ink/60 mt-1">Xem và xử lý yêu cầu cấp bản sao hồ sơ y tế</p>
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
          <div className="text-center py-12 text-ink/50 text-sm">Không có yêu cầu nào</div>
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
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-cream-white transition-colors">
                    <td className="p-3 font-mono font-bold text-green-dark">{r.request_code}</td>
                    <td className="p-3 font-bold text-green-dark">{r.patient_name}</td>
                    <td className="p-3 text-ink/70">{REQUEST_TYPE_LABELS[r.request_type] || r.request_type}</td>
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
                      <Badge className={STATUS_CONFIG[r.status].className}>
                        {STATUS_CONFIG[r.status].label}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {detailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-ink/5 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-green-dark">Chi tiết yêu cầu trích sao</h3>
                  <p className="text-xs text-ink/50 mt-0.5">
                    {selectedRequest.request_code} · {new Date(selectedRequest.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl flex-wrap">
                <div>
                  <p className="text-xs text-ink/50">Người yêu cầu</p>
                  <p className="font-semibold text-green-dark">{selectedRequest.patient_name}</p>
                </div>
                {selectedRequest.patient_code && (
                  <div>
                    <p className="text-xs text-ink/50">Mã KCB</p>
                    <p className="font-semibold text-ink">{selectedRequest.patient_code}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-ink/50">Loại hồ sơ</p>
                  <p className="font-semibold text-ink">{REQUEST_TYPE_LABELS[selectedRequest.request_type]}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50">Khoảng thời gian</p>
                  <p className="font-semibold text-ink text-xs whitespace-nowrap">
                    {formatDate(selectedRequest.date_range_from)} → {formatDate(selectedRequest.date_range_to)}
                  </p>
                </div>
                {selectedRequest.delivery_method && (
                  <div>
                    <p className="text-xs text-ink/50">Nhận bản sao</p>
                    <p className="font-semibold text-ink text-xs">{DELIVERY_METHOD_LABELS[selectedRequest.delivery_method] || selectedRequest.delivery_method}</p>
                  </div>
                )}
                <Badge className={STATUS_CONFIG[selectedRequest.status].className}>
                  {STATUS_CONFIG[selectedRequest.status].label}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Lý do</p>
                <p className="text-sm text-ink/80 bg-gray-50 p-4 rounded-xl">{selectedRequest.reason}</p>
              </div>

              {selectedRequest.files && selectedRequest.files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Files đính kèm ({selectedRequest.files.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.files.map(f => (
                      <div key={f.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <FileText size={12} className="text-ink/50" />
                        <span className="text-xs text-ink/70">{f.file_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(selectedRequest.contact_phone || selectedRequest.contact_email) && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Thông tin liên hệ</p>
                  <div className="flex gap-4">
                    {selectedRequest.contact_phone && (
                      <span className="text-xs text-ink/70">📞 {selectedRequest.contact_phone}</span>
                    )}
                    {selectedRequest.contact_email && (
                      <span className="text-xs text-ink/70">✉️ {selectedRequest.contact_email}</span>
                    )}
                  </div>
                </div>
              )}

              {selectedRequest.admin_notes && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Ghi chú xử lý</p>
                  <p className="text-sm text-ink/80 bg-mint p-4 rounded-xl border border-brand-green/20">
                    {selectedRequest.admin_notes}
                  </p>
                </div>
              )}

              {selectedRequest.processed_by && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Người xử lý</p>
                  <p className="text-sm text-ink/70">{selectedRequest.processed_by}</p>
                </div>
              )}

              {selectedRequest.status !== "da_xu_ly" && selectedRequest.status !== "da_huy" && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Ghi chú của bạn</p>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Nhập ghi chú xử lý..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none"
                  />
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" size="md" onClick={() => setDetailModalOpen(false)}>
                      Đóng
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      disabled={!adminNotes.trim() || isReplying}
                      onClick={handleSubmitResponse}
                    >
                      {isReplying ? "Đang gửi..." : "Xác nhận đã xử lý"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}