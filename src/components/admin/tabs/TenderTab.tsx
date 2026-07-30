import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Building2, Calendar, DollarSign, Phone, Mail, Plus, Download, Briefcase, Gavel } from "lucide-react";
import { SectionCard, ItemCard, AddCard, EditModal, ConfirmDialog } from "../ui";
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

const statusColorMap: Record<string, string> = {
  "Đang mở": "bg-brand-green/10 text-brand-green border-l-brand-green",
  "Sắp đóng": "bg-peach/10 text-peach border-l-peach",
  "Đã đóng": "bg-gray-100 text-gray-500 border-l-gray-400",
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35, ease: "easeOut" }
  })
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" }
  })
};

export default function TenderTab() {
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green/20 to-green-dark/20 flex items-center justify-center shadow-sm">
            <Gavel size={18} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-green-dark">Thông tin thầu</h2>
            <p className="text-[11px] text-ink/50">Cập nhật thông tin đấu thầu và mua sắm công</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">2 Sections</span>
      </div>

      <motion.div custom={0} initial="hidden" animate="visible" variants={sectionVariants}>
        <TenderNoticesSection />
      </motion.div>
      <motion.div custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
        <DepartmentsSection />
      </motion.div>
    </motion.div>
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
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tenders.map((tender, idx) => (
              <motion.div key={tender.id} custom={idx} initial="hidden" animate="visible" variants={itemVariants}>
                <ItemCard
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
              </motion.div>
            ))}
            <AddCard title="Thêm thông báo" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="green" />
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
          { name: "title", label: "Tiêu đề thông báo", required: true, description: "Tên gói thầu/mua sắm", hint: "VD: Mua sắm vật tư y tế năm 2026" },
          { name: "tenderNumber", label: "Số hiệu thầu", description: "Mã số thông báo", hint: "VD: BHYT-2026-001" },
          { name: "dept", label: "Phòng ban", type: "select", options: DEPT_OPTIONS, description: "Phòng ban phụ trách" },
          { name: "estimateValue", label: "Giá trị dự toán", description: "Số tiền dự toán", hint: "VD: 500.000.000đ" },
          { name: "endDate", label: "Hạn nộp hồ sơ", description: "Ngày kết thúc nộp", hint: "VD: 30/08/2026" },
          { name: "status", label: "Trạng thái", type: "select", options: STATUS_OPTIONS, description: "Tình trạng thầu" }
        ]}
        initialData={(editingTender || {}) as Record<string, string | number | boolean | File | null>}
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
            <motion.div key={dept.id} custom={idx} initial="hidden" animate="visible" variants={itemVariants}>
              <ItemCard
                title={dept.name}
                description={dept.id}
                index={idx}
                footer={
                  <div className="w-2 h-2 rounded-full bg-brand-green mt-2 mx-auto" />
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
