import { useState, useEffect, useMemo } from "react";
import { Card, Badge, Button } from "../../ui";
import { Search, MessageSquare, Star, Eye, Check, X, ChevronDown } from "lucide-react";

type FeedbackStatus = 'moi' | 'dang_xu_ly' | 'da_xu_ly';
type ServiceType = 'kham-benh' | 'noi-tru' | 'cap-cuu' | 'ban-si' | 'other';

interface FeedbackRequest {
  id: string;
  patient_name: string;
  service_type: ServiceType;
  rating: number;
  content: string;
  status: FeedbackStatus;
  admin_response: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<FeedbackStatus, { label: string; className: string }> = {
  moi: { label: "Mới", className: "bg-peach/20 text-peach" },
  dang_xu_ly: { label: "Đang xử lý", className: "bg-blue-100 text-blue-700" },
  da_xu_ly: { label: "Đã xử lý", className: "bg-mint text-green-dark" }
};

const SERVICE_LABELS: Record<ServiceType, string> = {
  'kham-benh': 'Khám bệnh',
  'noi-tru': 'Nội trú',
  'cap-cuu': 'Cấp cứu',
  'ban-si': 'Bán sỉ',
  'other': 'Khác'
};

export default function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRequest | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/v1/feedback-requests");
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalized = data.map(item => ({
          id: item.id,
          patient_name: item.patientName || item.patient_name || "",
          service_type: (item.serviceType || item.service_type || "other") as ServiceType,
          rating: item.rating || 0,
          content: item.content || "",
          status: (item.status || "moi") as FeedbackStatus,
          admin_response: item.adminResponse || item.admin_response || null,
          contact_phone: item.contactPhone || item.contact_phone || null,
          contact_email: item.contactEmail || item.contact_email || null,
          created_at: item.createdAt || item.created_at || new Date().toISOString(),
          updated_at: item.updatedAt || item.updated_at || new Date().toISOString()
        }));
        setFeedbacks(normalized);
      } else {
        setFeedbacks([]);
      }
    } catch {
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return feedbacks.filter(f => {
      const matchSearch =
        f.patient_name.toLowerCase().includes(search.toLowerCase()) ||
        f.content.toLowerCase().includes(search.toLowerCase()) ||
        f.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || f.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [feedbacks, search, statusFilter]);

  const handleOpenDetail = (feedback: FeedbackRequest) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.admin_response || "");
    setDetailModalOpen(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedFeedback || !responseText.trim()) return;
    setIsReplying(true);
    try {
      const res = await fetch(`/api/v1/feedback-requests/${selectedFeedback.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "da_xu_ly",
          admin_response: responseText,
          responded_by: "admin-001"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedbacks(prev =>
        prev.map(f =>
          f.id === selectedFeedback.id
            ? { ...f, status: "da_xu_ly" as FeedbackStatus, admin_response: responseText, updated_at: new Date().toISOString() }
            : f
        )
      );
      setDetailModalOpen(false);
    } catch (error: any) {
      alert(error.message || "Không thể cập nhật phản hồi");
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (id: string, status: FeedbackStatus) => {
    try {
      const res = await fetch(`/api/v1/feedback-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedbacks(prev =>
        prev.map(f => (f.id === id ? { ...f, status, updated_at: new Date().toISOString() } : f))
      );
    } catch (error: any) {
      alert(error.message || "Không thể cập nhật trạng thái");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={12} className={s <= rating ? "text-peach fill-peach" : "text-gray-300"} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Phản hồi góp ý</h2>
          <p className="text-sm text-ink/60 mt-1">Xem và xử lý ý kiến đóng góp từ bệnh nhân</p>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">
          {feedbacks.length} ý kiến
        </span>
      </div>

      <Card variant="default" padding="md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              placeholder="Tìm theo tên, nội dung, mã..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cream-white border border-green-800/10 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-green text-green-dark"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "moi", "dang_xu_ly", "da_xu_ly"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === s
                    ? "bg-brand-green text-white"
                    : "bg-gray-100 text-ink/70 hover:bg-gray-200"
                }`}
              >
                {s === "all" ? "Tất cả" : STATUS_CONFIG[s as FeedbackStatus].label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card variant="default" padding="lg">
        {loading ? (
          <div className="text-center py-12 text-ink/50 text-sm">Đang tải dữ liệu...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-ink/50 text-sm">Không có ý kiến nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                  <th className="p-3">Mã</th>
                  <th className="p-3">Người gửi</th>
                  <th className="p-3">Dịch vụ</th>
                  <th className="p-3">Đánh giá</th>
                  <th className="p-3">Nội dung</th>
                  <th className="p-3">Liên hệ</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map(f => (
                  <tr key={f.id} className="hover:bg-cream-white transition-colors">
                    <td className="p-3 font-mono font-bold text-green-dark">{f.id}</td>
                    <td className="p-3 font-bold text-green-dark">{f.patient_name}</td>
                    <td className="p-3 text-ink/70">{SERVICE_LABELS[f.service_type] || f.service_type}</td>
                    <td className="p-3">{renderStars(f.rating)}</td>
                    <td className="p-3 max-w-xs">
                      <p className="text-ink/70 line-clamp-2">{f.content}</p>
                    </td>
                    <td className="p-3 text-ink/50 text-xs">
                      {f.contact_phone && <div>{f.contact_phone}</div>}
                      {f.contact_email && <div>{f.contact_email}</div>}
                    </td>
                    <td className="p-3">
                      <Badge className={STATUS_CONFIG[f.status].className}>
                        {STATUS_CONFIG[f.status].label}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(f)}
                          className="p-1.5 rounded-lg bg-brand-green/10 hover:bg-brand-green/20 text-brand-green cursor-pointer transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={14} />
                        </button>
                        {f.status === "moi" && (
                          <button
                            onClick={() => handleStatusChange(f.id, "dang_xu_ly")}
                            className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 cursor-pointer transition-colors"
                            title="Đánh dấu đang xử lý"
                          >
                            <MessageSquare size={14} />
                          </button>
                        )}
                        {f.status !== "da_xu_ly" && (
                          <button
                            onClick={() => handleStatusChange(f.id, "da_xu_ly")}
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

      {detailModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-ink/5 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-green-dark">Chi tiết góp ý</h3>
                  <p className="text-xs text-ink/50 mt-0.5">
                    {selectedFeedback.id} · {new Date(selectedFeedback.created_at).toLocaleDateString("vi-VN")}
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
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-ink/50">Người gửi</p>
                  <p className="font-semibold text-green-dark">{selectedFeedback.patient_name}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50">Dịch vụ</p>
                  <p className="font-semibold text-ink">{SERVICE_LABELS[selectedFeedback.service_type]}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50">Đánh giá</p>
                  {renderStars(selectedFeedback.rating)}
                </div>
                <Badge className={STATUS_CONFIG[selectedFeedback.status].className}>
                  {STATUS_CONFIG[selectedFeedback.status].label}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Nội dung góp ý</p>
                <p className="text-sm text-ink/80 bg-gray-50 p-4 rounded-xl">{selectedFeedback.content}</p>
              </div>

              {(selectedFeedback.contact_phone || selectedFeedback.contact_email) && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Thông tin liên hệ</p>
                  <div className="flex gap-4">
                    {selectedFeedback.contact_phone && (
                      <span className="text-xs text-ink/70">📞 {selectedFeedback.contact_phone}</span>
                    )}
                    {selectedFeedback.contact_email && (
                      <span className="text-xs text-ink/70">✉️ {selectedFeedback.contact_email}</span>
                    )}
                  </div>
                </div>
              )}

              {selectedFeedback.admin_response && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Phản hồi đã gửi</p>
                  <p className="text-sm text-ink/80 bg-mint p-4 rounded-xl border border-brand-green/20">
                    {selectedFeedback.admin_response}
                  </p>
                </div>
              )}

              {selectedFeedback.status !== "da_xu_ly" && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-dark uppercase tracking-wide">Phản hồi của bạn</p>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Nhập phản hồi cho bệnh nhân..."
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
                      disabled={!responseText.trim() || isReplying}
                      onClick={handleSubmitResponse}
                    >
                      {isReplying ? "Đang gửi..." : "Gửi phản hồi & đánh dấu đã xử lý"}
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