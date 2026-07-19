import { useState } from "react";
import { FileText, Building2, Calendar, DollarSign, Phone, Mail, Plus, Download } from "lucide-react";
import { SectionCard, ItemCard, EditModal, ConfirmDialog } from "../ui";
import { Button } from "../../ui";

const DEPARTMENTS = [
  { id: "PHÒNG CNTT", name: "Phòng Công Nghệ Thông Tin" },
  { id: "PHÒNG VTTBYT", name: "Vật Tư Thiết Bị Y Tế" },
  { id: "XÉT NGHIỆM", name: "Khoa Xét Nghiệm" },
  { id: "DƯỢC", name: "Khoa Dược" },
  { id: "PHÒNG HCQT", name: "Hành Chính Quản Trị" },
  { id: "PHÒNG KẾ TOÁN", name: "Kế Toán Hành Chính" }
];

const DEFAULT_TENDERS = [
  { id: "1", title: "Mua sắm vật tư y tế năm 2026", tenderNumber: "BHYT-2026-001", dept: "PHÒNG VTTBYT", estimateValue: "500.000.000đ", endDate: "30/08/2026", status: "Đang mở" },
  { id: "2", title: "Dịch vụ bảo trì thiết bị MRI", tenderNumber: "BHYT-2026-002", dept: "PHÒNG CNTT", estimateValue: "200.000.000đ", endDate: "15/08/2026", status: "Sắp đóng" },
  { id: "3", title: "Cung cấp thuốc generic", tenderNumber: "BHYT-2026-003", dept: "DƯỢC", estimateValue: "800.000.000đ", endDate: "01/09/2026", status: "Đang mở" }
];

interface TenderItem {
  id: string;
  title: string;
  tenderNumber: string;
  dept: string;
  estimateValue: string;
  endDate: string;
  status: string;
  fileName?: string;
  contact?: string;
  contactPhone?: string;
}

const STATUS_OPTIONS = [
  { value: "Đang mở", label: "Đang mở" },
  { value: "Sắp đóng", label: "Sắp đóng" },
  { value: "Đã đóng", label: "Đã đóng" }
];

const DEPT_OPTIONS = DEPARTMENTS.map(d => ({ value: d.id, label: d.name }));

export default function TenderTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Thông tin thầu</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật thông tin đấu thầu và mua sắm công</p>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">2 Sections</span>
      </div>

      <TenderNoticesSection />
      <DepartmentsSection />
    </div>
  );
}

function TenderNoticesSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingTender, setEditingTender] = useState<TenderItem | null>(null);
  const [tenders, setTenders] = useState(DEFAULT_TENDERS);

  const handleOpenEdit = (tender: TenderItem | null = null) => {
    setEditingTender(tender || {
      id: crypto.randomUUID(),
      title: "",
      tenderNumber: "",
      dept: "PHÒNG VTTBYT",
      estimateValue: "",
      endDate: "",
      status: "Đang mở"
    });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingTender && tenders.find(t => t.id === editingTender.id)) {
      setTenders(prev => prev.map(t => t.id === editingTender.id ? { ...t, ...formData } : t));
    } else {
      setTenders(prev => [...prev, { id: crypto.randomUUID(), ...formData } as TenderItem]);
    }
    setIsEditOpen(false);
    setEditingTender(null);
  };

  const handleDelete = (id: string) => {
    setTenders(prev => prev.filter(t => t.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Thông báo thầu"
        description="Danh sách các thông báo mời thầu"
        icon={<FileText size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${tenders.length} thông báo`}
        badgeColor="green"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            <Plus size={12} /> Thêm mới
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenders.map((tender, idx) => (
              <ItemCard
                key={tender.id}
                title={tender.title}
                description={`${tender.tenderNumber} • ${tender.dept}`}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(tender),
                  onDelete: () => setDeleteConfirm(tender.id)
                }}
                footer={
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-1 text-xs text-ink/60">
                      <DollarSign size={12} className="text-brand-green" />
                      <span>{tender.estimateValue}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ink/60">
                      <Calendar size={12} className="text-peach" />
                      <span>Hạn: {tender.endDate}</span>
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tender.status === "Đang mở" ? "bg-brand-green/10 text-brand-green" :
                      tender.status === "Sắp đóng" ? "bg-peach/10 text-peach" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {tender.status}
                    </span>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingTender(null); }}
        onSubmit={handleSave}
        title={editingTender && tenders.find(t => t.id === editingTender.id) ? "Chỉnh sửa thông báo" : "Thêm thông báo mới"}
        size="lg"
        fields={[
          { name: "title", label: "Tiêu đề thông báo", required: true },
          { name: "tenderNumber", label: "Số hiệu thầu" },
          { name: "dept", label: "Phòng ban", type: "select", options: DEPT_OPTIONS },
          { name: "estimateValue", label: "Giá trị dự toán" },
          { name: "endDate", label: "Hạn nộp hồ sơ" },
          { name: "status", label: "Trạng thái", type: "select", options: STATUS_OPTIONS }
        ]}
        initialData={editingTender || {}}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa thông báo?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}

function DepartmentsSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Phòng ban tham gia"
      description="Các phòng ban liên quan đến công tác đấu thầu"
      icon={<Building2 size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge={`${DEPARTMENTS.length} phòng ban`}
      badgeColor="blue"
    >
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map((dept, idx) => (
            <ItemCard
              key={dept.id}
              title={dept.name}
              description={dept.id}
              index={idx}
              footer={
                <div className="w-2 h-2 rounded-full bg-brand-green mt-2 mx-auto" />
              }
            />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}