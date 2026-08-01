import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { FileText, Building2, Calendar, Gavel, Server, Stethoscope, Microscope, Pill, Users, Edit, Trash2, LucideIcon, DollarSign, X, Clock, Phone, HelpCircle } from "lucide-react";
import { SectionCard, AddCard, EditModal, ConfirmDialog } from "../ui";
import { Button, Modal } from "../../ui";

interface TenderDept {
  id: string;
  name: string;
  icon: string;
  color: string;
  image: string;
  description: string;
}

const DEPT_ICONS: Record<string, LucideIcon> = {
  Server, Stethoscope, Microscope, Pill, Building2, Users,
};

const DEFAULT_DEPTS: TenderDept[] = [
  { id: "PHÒNG CNTT", name: "Phòng Công Nghệ Thông Tin", icon: "Server", color: "from-blue-500 to-cyan-600", image: "/images/pages/coso-1.jpeg", description: "Quản trị hệ thống CNTT bệnh viện" },
  { id: "PHÒNG VTTBYT", name: "Vật Tư Thiết Bị Y Tế", icon: "Stethoscope", color: "from-green-500 to-emerald-600", image: "/images/pages/chiphi-1.jpeg", description: "Mua sắm trang thiết bị y tế" },
  { id: "XÉT NGHIỆM", name: "Khoa Xét Nghiệm", icon: "Microscope", color: "from-purple-500 to-violet-600", image: "/images/pages/xetnghiem-1.jpeg", description: "Vật tư xét nghiệm, hóa chất" },
  { id: "DƯỢC", name: "Khoa Dược", icon: "Pill", color: "from-orange-500 to-amber-600", image: "/images/pages/duoc-1.jpeg", description: "Đấu thầu thuốc, dược phẩm" },
  { id: "PHÒNG HCQT", name: "Hành Chính Quản Trị", icon: "Building2", color: "from-teal-500 to-cyan-600", image: "/images/pages/coso-2.jpeg", description: "Hành chính, văn phòng phẩm" },
  { id: "PHÒNG KẾ TOÁN", name: "Kế Toán Hành Chính", icon: "Users", color: "from-pink-500 to-rose-600", image: "/images/pages/bhyt-1.jpeg", description: "Kế toán, tài chính dự án" },
];

interface TenderItem {
  id: string;
  title: string;
  tenderNumber: string;
  dept: string;
  estimateValue: string;
  publishDate: string;
  startDate: string;
  endDate: string;
  status: string;
  fileName?: string;
  contact?: string;
  contactPhone?: string;
}

const DEFAULT_TENDERS: TenderItem[] = [
  { id: "1", title: "Mua sắm vật tư y tế năm 2026", tenderNumber: "BHYT-2026-001", dept: "PHÒNG VTTBYT", estimateValue: "500.000.000đ", publishDate: "2026-07-25T08:00", startDate: "2026-08-01T08:00", endDate: "2026-08-30T17:00", status: "Đang mở", contact: "CN. Nguyễn Văn An", contactPhone: "0235.3862.888" },
  { id: "2", title: "Dịch vụ bảo trì thiết bị MRI", tenderNumber: "BHYT-2026-002", dept: "PHÒNG CNTT", estimateValue: "200.000.000đ", publishDate: "2026-07-20T08:00", startDate: "2026-08-01T08:00", endDate: "2026-08-15T11:30", status: "Sắp đóng", contact: "KS. Trần Thị Bích", contactPhone: "0235.3862.889" },
  { id: "3", title: "Cung cấp thuốc generic", tenderNumber: "BHYT-2026-003", dept: "DƯỢC", estimateValue: "800.000.000đ", publishDate: "2026-07-28T08:00", startDate: "2026-08-05T08:00", endDate: "2026-09-01T17:00", status: "Đang mở", contact: "DS. Lê Thị Mai", contactPhone: "0235.3862.890" },
];

const STATUS_OPTIONS = [
  { value: "Đang mở", label: "Đang mở" },
  { value: "Sắp đóng", label: "Sắp đóng" },
  { value: "Đã đóng", label: "Đã đóng" },
];

const iconOptions = Object.keys(DEPT_ICONS).map(k => ({ value: k, label: k }));

function toDatetimeLocal(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}T${h}:${min}`;
}

function formatTenderDateTime(value?: string): string {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (match) {
    const [, y, m, d, h, min] = match;
    return `${h}:${min} - ${d}/${m}/${y}`;
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${h}:${min} - ${day}/${month}/${d.getFullYear()}`;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.35, ease: "easeOut" as const }
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" as const }
  }),
};

const tenderColors = [
  { bg: "bg-blue-50", border: "border-l-blue-400", iconBg: "bg-blue-100", iconCol: "text-blue-600" },
  { bg: "bg-emerald-50", border: "border-l-emerald-400", iconBg: "bg-emerald-100", iconCol: "text-emerald-600" },
  { bg: "bg-amber-50", border: "border-l-amber-400", iconBg: "bg-amber-100", iconCol: "text-amber-600" },
  { bg: "bg-purple-50", border: "border-l-purple-400", iconBg: "bg-purple-100", iconCol: "text-purple-600" },
];

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
        <DepartmentsSection />
      </motion.div>
      <motion.div custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
        <TenderNoticesSection />
      </motion.div>
    </motion.div>
  );
}

function DepartmentsSection() {
  const [enabled, setEnabled] = useState(true);
  const [depts, setDepts] = useState<TenderDept[]>(DEFAULT_DEPTS);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editing, setEditing] = useState<TenderDept | null>(null);

  const handleOpenEdit = (dept: TenderDept | null = null) => {
    setEditing(dept || {
      id: "", name: "", icon: "Building2", color: "from-blue-500 to-cyan-600",
      image: "/images/pages/coso-1.jpeg", description: "",
    });
    setIsEditOpen(true);
  };

  const handleSave = (data: Record<string, string | number | boolean | File | null>) => {
    if (editing && depts.find(d => d.id === editing.id)) {
      setDepts(prev => prev.map(d => d.id === editing.id ? { ...d, ...data } : d));
    } else {
      const newDept: TenderDept = {
        id: data.id as string,
        name: data.name as string,
        icon: data.icon as string,
        color: data.color as string,
        image: data.image as string,
        description: data.description as string,
      };
      setDepts(prev => [...prev, newDept]);
    }
    setIsEditOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setDepts(prev => prev.filter(d => d.id !== id));
    setDeleteConfirm(null);
  };

  const deptFields = [
    {
      name: "id", label: "Mã phòng ban", type: "text" as const, required: true,
      hint: "VD: PHÒNG CNTT, PHÒNG VTTBYT",
      disabled: editing && depts.find(d => d.id === editing.id) ? true : undefined,
    },
    { name: "name", label: "Tên phòng ban", type: "text" as const, required: true, hint: "VD: Phòng Công Nghệ Thông Tin" },
    {
      name: "icon", label: "Biểu tượng", type: "select" as const, required: true,
      options: iconOptions,
    },
    { name: "image", label: "Đường dẫn ảnh", type: "text" as const, hint: "VD: /images/pages/coso-1.jpeg" },
    { name: "description", label: "Mô tả", type: "text" as const, hint: "VD: Quản trị hệ thống CNTT bệnh viện" },
  ];

  const initialData = editing ? {
    id: editing.id, name: editing.name, icon: editing.icon,
    image: editing.image, description: editing.description,
  } : {};

  return (
    <>
      <SectionCard
        title="Phòng ban tham gia"
        description="Các phòng ban liên quan đến công tác đấu thầu"
        icon={<Building2 size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${depts.length} phòng ban`}
        badgeColor="blue"
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {depts.map((dept, idx) => {
              const IconComp = DEPT_ICONS[dept.icon] || Building2;
              const deptColors = [
                { bg: "bg-blue-50", iconBg: "bg-blue-100", iconCol: "text-blue-600", border: "border-l-blue-400" },
                { bg: "bg-emerald-50", iconBg: "bg-emerald-100", iconCol: "text-emerald-600", border: "border-l-emerald-400" },
                { bg: "bg-purple-50", iconBg: "bg-purple-100", iconCol: "text-purple-600", border: "border-l-purple-400" },
                { bg: "bg-amber-50", iconBg: "bg-amber-100", iconCol: "text-amber-600", border: "border-l-amber-400" },
                { bg: "bg-cyan-50", iconBg: "bg-cyan-100", iconCol: "text-cyan-600", border: "border-l-cyan-400" },
                { bg: "bg-rose-50", iconBg: "bg-rose-100", iconCol: "text-rose-600", border: "border-l-rose-400" },
              ];
              const c = deptColors[idx % deptColors.length];
              return (
                <motion.div key={dept.id} custom={idx} initial="hidden" animate="visible" variants={itemVariants}>
                  <div className={`group bg-white border border-green-800/5 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-green/20 transition-all duration-300 border-l-4 ${c.border}`}>
                    <div className="relative h-28 overflow-hidden">
                      <img src={dept.image} alt={dept.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center shadow`}>
                          <IconComp size={16} className={c.iconCol} />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(dept)} className="p-1 rounded-md bg-white/90 text-gray-600 hover:text-brand-green hover:bg-white cursor-pointer shadow-sm" title="Sửa">
                          <Edit size={12} />
                        </button>
                        <button onClick={() => setDeleteConfirm(dept.id)} className="p-1 rounded-md bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white cursor-pointer shadow-sm" title="Xóa">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-display font-bold text-sm text-green-dark leading-tight">{dept.name}</h4>
                      <p className="text-[10px] text-ink/50 font-mono mt-0.5">{dept.id}</p>
                      {dept.description && (
                        <p className="text-[11px] text-ink/60 mt-1 leading-relaxed line-clamp-2">{dept.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <AddCard title="Thêm phòng ban" onClick={() => handleOpenEdit()} color="blue" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditing(null); }}
        onSubmit={handleSave}
        title={editing && depts.find(d => d.id === editing.id) ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
        fields={deptFields}
        initialData={initialData}
        size="lg"
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa phòng ban?"
        message={`Xóa phòng ban "${depts.find(d => d.id === deleteConfirm)?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        variant="danger"
      />
    </>
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
      id: crypto.randomUUID(), title: "", tenderNumber: "",
      dept: "PHÒNG VTTBYT", estimateValue: "",
      publishDate: toDatetimeLocal(new Date().toISOString()),
      startDate: "", endDate: "", status: "Đang mở",
      contact: "", contactPhone: "",
    });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, string | number | boolean | File | null>) => {
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

  const deptOptions = DEFAULT_DEPTS.map(d => ({ value: d.id, label: d.name }));

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
          <div className="flex flex-wrap gap-4">
            {tenders.map((tender, idx) => {
              const c = tenderColors[idx % tenderColors.length];
              const IconComp = DollarSign;
              const statusColor =
                tender.status === "Đang mở" ? "bg-brand-green/10 text-brand-green" :
                tender.status === "Sắp đóng" ? "bg-peach/10 text-peach" :
                "bg-gray-100 text-gray-500";
              return (
                <motion.div key={tender.id} custom={idx} initial="hidden" animate="visible" variants={itemVariants}>
                  <div className={`group w-60 bg-white border border-green-800/5 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-green/20 transition-all duration-300 border-l-4 ${c.border}`}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <IconComp size={18} className={c.iconCol} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                          {tender.status}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-green-dark leading-snug line-clamp-2 min-h-[38px]">{tender.title}</h4>
                      <p className="text-[10px] text-ink/50 font-mono mt-1">{tender.tenderNumber} • {tender.dept}</p>
                      <div className="mt-3 pt-3 border-t border-green-800/5 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-green-dark">{tender.estimateValue}</span>
                          <p className="text-[9px] text-ink/40 flex items-center gap-1 mt-0.5">
                            <Calendar size={9} /> Mở: {formatTenderDateTime(tender.startDate) || "—"}
                          </p>
                          <p className="text-[9px] text-peach/80 flex items-center gap-1 mt-0.5">
                            <Calendar size={9} /> Hạn: {formatTenderDateTime(tender.endDate) || "—"}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenEdit(tender)} className="p-1 rounded-md text-gray-400 hover:text-brand-green hover:bg-brand-green/5 transition-colors cursor-pointer" title="Sửa">
                            <Edit size={12} />
                          </button>
                          <button onClick={() => setDeleteConfirm(tender.id)} className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Xóa">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <AddCard title="Thêm thông báo" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="green" />
          </div>
        </div>
      </SectionCard>

      <TenderFormModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingTender(null); }}
        onSubmit={handleSave}
        initialTender={editingTender}
        deptOptions={deptOptions}
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

interface TenderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string | number | boolean | File | null>) => void;
  initialTender: TenderItem | null;
  deptOptions: { value: string; label: string }[];
}

function TenderFormModal({ isOpen, onClose, onSubmit, initialTender, deptOptions }: TenderFormModalProps) {
  const isEdit = !!initialTender && initialTender.title.trim() !== "";
  const [form, setForm] = useState({
    title: initialTender?.title || "",
    tenderNumber: initialTender?.tenderNumber || "",
    dept: initialTender?.dept || "PHÒNG VTTBYT",
    estimateValue: initialTender?.estimateValue || "",
    publishDate: initialTender?.publishDate || "",
    startDate: initialTender?.startDate || "",
    endDate: initialTender?.endDate || "",
    status: initialTender?.status || "Đang mở",
    contact: initialTender?.contact || "",
    contactPhone: initialTender?.contactPhone || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: initialTender?.title || "",
        tenderNumber: initialTender?.tenderNumber || "",
        dept: initialTender?.dept || "PHÒNG VTTBYT",
        estimateValue: initialTender?.estimateValue || "",
        publishDate: initialTender?.publishDate || toDatetimeLocal(new Date().toISOString()),
        startDate: initialTender?.startDate || "",
        endDate: initialTender?.endDate || "",
        status: initialTender?.status || "Đang mở",
        contact: initialTender?.contact || "",
        contactPhone: initialTender?.contactPhone || "",
      });
      setErrors({});
    }
  }, [isOpen, initialTender]);

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    if (errors[key as string]) setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrors({ title: "Tiêu đề thông báo là bắt buộc" });
      return;
    }
    onSubmit({ ...form });
  };

  const inputCls = (err?: string) => `w-full px-4 py-3 text-sm border rounded-xl transition-all focus:outline-none ${
    err
      ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
      : "border-green-800/10 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
  }`;

  const labelCls = "block text-xs font-bold text-green-dark mb-1.5";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton={false}>
      <div className="-m-6 flex flex-col">
        <div className="bg-gradient-to-r from-brand-green to-green-dark p-6 text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shadow-lg">
              <Gavel size={22} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl">{isEdit ? "Chỉnh sửa thông báo thầu" : "Đăng thông báo thầu mới"}</h3>
              <p className="text-xs text-mint/80 mt-0.5">Đặt các mốc thời gian để hiển thị chính xác trên website</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/15 text-mint transition-colors cursor-pointer" aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-green/10 flex items-center justify-center">
                <FileText size={13} className="text-brand-green" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-dark/70">Thông tin cơ bản</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Tiêu đề thông báo <span className="text-rose-500">*</span></label>
                <input type="text" value={form.title} onChange={set("title")} placeholder="VD: Mua sắm vật tư y tế năm 2026" className={inputCls(errors.title)} />
                {errors.title && <p className="text-xs text-rose-500 mt-1.5">{errors.title}</p>}
              </div>
              <div>
                <label className={labelCls}>Số hiệu thầu</label>
                <input type="text" value={form.tenderNumber} onChange={set("tenderNumber")} placeholder="VD: BHYT-2026-001" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Phòng ban</label>
                <select value={form.dept} onChange={set("dept")} className={`${inputCls()} appearance-none cursor-pointer`}>
                  {deptOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Giá trị dự toán</label>
                <input type="text" value={form.estimateValue} onChange={set("estimateValue")} placeholder="VD: 500.000.000đ" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Trạng thái</label>
                <select value={form.status} onChange={set("status")} className={`${inputCls()} appearance-none cursor-pointer`}>
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-green/15 bg-mint/10 p-4 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-6 h-6 rounded-lg bg-brand-green/15 flex items-center justify-center">
                <Clock size={13} className="text-brand-green" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-dark/70">Mốc thời gian hiển thị</h4>
              <span className="text-[10px] text-ink/40 italic ml-auto flex items-center gap-1">
                <HelpCircle size={11} /> Bỏ trống sẽ dùng ngày tạo/ngày đăng
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`${labelCls} flex items-center gap-1.5`}><Calendar size={12} className="text-brand-green" /> Ngày đăng thầu</label>
                <input type="datetime-local" value={form.publishDate} onChange={set("publishDate")} className={inputCls()} />
              </div>
              <div>
                <label className={`${labelCls} flex items-center gap-1.5`}><Calendar size={12} className="text-brand-green" /> Thời điểm mở thầu</label>
                <input type="datetime-local" value={form.startDate} onChange={set("startDate")} className={inputCls()} />
              </div>
              <div>
                <label className={`${labelCls} flex items-center gap-1.5`}><Calendar size={12} className="text-brand-green" /> Thời điểm khóa thầu</label>
                <input type="datetime-local" value={form.endDate} onChange={set("endDate")} className={inputCls()} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`${labelCls} flex items-center gap-1.5`}><Phone size={12} className="text-brand-green" /> Người liên hệ</label>
              <input type="text" value={form.contact} onChange={set("contact")} placeholder="VD: CN. Nguyễn Văn An" className={inputCls()} />
            </div>
            <div>
              <label className={`${labelCls} flex items-center gap-1.5`}><Phone size={12} className="text-brand-green" /> Số điện thoại</label>
              <input type="text" value={form.contactPhone} onChange={set("contactPhone")} placeholder="VD: 0235.3862.888" className={inputCls()} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>Hủy bỏ</Button>
            <Button type="submit" variant="primary" size="md">Lưu thay đổi</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
