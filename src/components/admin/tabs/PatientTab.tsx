import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, FileText, List, Plus, CheckCircle, Calendar, Clock, User, Ambulance, Shield, Stethoscope, Wallet, Edit, Trash2, LucideIcon } from "lucide-react";
import { SectionCard, ItemCard, AddCard, EditModal, ConfirmDialog } from "../ui";
import { Button } from "../../ui";
import { useSiteContent } from "../../../context/SiteContentContext";
import { DEFAULT_PATIENT, type SitePatient, type SiteProcessStep, type SiteBringItem, type SiteFaq } from "../../../data/sitePatient";

type FieldValue = string | number | boolean | File | null;

const ICON_MAP: Record<string, LucideIcon> = {
  calendar: Calendar,
  check: CheckCircle,
  user: User,
  stethoscope: Stethoscope,
  wallet: Wallet,
  clipboard: List,
  clock: Clock,
  card: FileText,
  shield: Shield,
  document: FileText,
  pill: FileText,
  referral: FileText,
  ambulance: Ambulance
};

const ICON_OPTIONS = Object.keys(ICON_MAP).map(key => ({ value: key, label: key }));

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.35, ease: "easeOut" as const }
  })
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" as const }
  })
};

export default function PatientTab() {
  const { getSection, saveSection } = useSiteContent();
  const [data, setData] = useState<SitePatient>(DEFAULT_PATIENT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(getSection("patient", DEFAULT_PATIENT));
  }, [getSection]);

  const persist = async (next: SitePatient) => {
    setData(next);
    setSaving(true);
    try {
      await saveSection("patient", next);
    } catch (err) {
      console.error("Error saving patient section:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green/20 to-green-dark/20 flex items-center justify-center shadow-sm">
            <Heart size={18} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-green-dark">Cho bệnh nhân</h2>
            <p className="text-[11px] text-ink/50">Cập nhật nội dung trang Hướng dẫn bệnh nhân</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs font-semibold text-brand-green animate-pulse">Đang lưu...</span>}
          <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">3 Sections</span>
        </div>
      </div>

      <motion.div custom={0} initial="hidden" animate="visible" variants={sectionVariants}>
        <ProcessSection data={data} onPersist={persist} />
      </motion.div>
      <motion.div custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
        <WhatToBringSection data={data} onPersist={persist} />
      </motion.div>
      <motion.div custom={2} initial="hidden" animate="visible" variants={sectionVariants}>
        <FaqSection data={data} onPersist={persist} />
      </motion.div>
    </motion.div>
  );
}

function ProcessSection({ data, onPersist }: { data: SitePatient; onPersist: (next: SitePatient) => Promise<void> }) {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<SiteProcessStep | null>(null);
  const steps = data.processSteps;

  const handleOpenEdit = (step: SiteProcessStep | null = null) => {
    setEditingStep(step || {
      id: crypto.randomUUID(),
      step: steps.length + 1,
      title: "",
      desc: "",
      icon: "calendar"
    });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedStep: SiteProcessStep = {
      id: editingStep?.id || crypto.randomUUID(),
      step: editingStep?.step || steps.length + 1,
      title: (formData.title as string) || "",
      desc: (formData.desc as string) || "",
      icon: (formData.icon as string) || "calendar"
    };
    const next: SitePatient = {
      ...data,
      processSteps: steps.find(s => s.id === editingStep?.id)
        ? steps.map(s => (s.id === editingStep?.id ? { ...s, ...updatedStep } : s))
        : [...steps, { ...updatedStep, step: steps.length + 1 }]
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingStep(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, processSteps: steps.filter(s => s.id !== id).map((s, i) => ({ ...s, step: i + 1 })) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Quy trình khám bệnh"
        description="Các bước khám bệnh theo thứ tự"
        icon={<Heart size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${steps.length} bước`}
        badgeColor="green"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm bước
          </Button>
        }
      >
        <div className="p-5">
          <div className="flex flex-wrap gap-4">
            {steps.map((step, idx) => {
              const Icon = ICON_MAP[step.icon] || Calendar;
              const colors = [
                { bg: "bg-blue-50", border: "border-l-blue-400", iconBg: "bg-blue-100", iconCol: "text-blue-600" },
                { bg: "bg-emerald-50", border: "border-l-emerald-400", iconBg: "bg-emerald-100", iconCol: "text-emerald-600" },
                { bg: "bg-amber-50", border: "border-l-amber-400", iconBg: "bg-amber-100", iconCol: "text-amber-600" },
                { bg: "bg-purple-50", border: "border-l-purple-400", iconBg: "bg-purple-100", iconCol: "text-purple-600" },
                { bg: "bg-rose-50", border: "border-l-rose-400", iconBg: "bg-rose-100", iconCol: "text-rose-600" },
                { bg: "bg-cyan-50", border: "border-l-cyan-400", iconBg: "bg-cyan-100", iconCol: "text-cyan-600" },
              ];
              const c = colors[idx % colors.length];
              return (
                <motion.div key={step.id} custom={idx} initial="hidden" animate="visible" variants={itemVariants}>
                  <div className={`group w-52 bg-white border border-green-800/5 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-green/20 transition-all duration-300 border-l-4 ${c.border}`}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`relative w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <Icon size={20} className={c.iconCol} />
                          <span className={`absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold ${c.iconBg} ${c.iconCol} ring-2 ring-white`}>
                            {step.step}
                          </span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenEdit(step)} className="p-1 rounded-md text-gray-400 hover:text-brand-green hover:bg-brand-green/5 transition-colors cursor-pointer" title="Sửa">
                            <Edit size={12} />
                          </button>
                          <button onClick={() => setDeleteConfirm(step.id)} className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Xóa">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-display font-bold text-sm text-green-dark">{step.title}</h4>
                      <p className="text-[11px] text-ink/60 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <AddCard title="Thêm bước" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="green" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingStep(null); }}
        onSubmit={handleSave}
        title={editingStep && steps.find(s => s.id === editingStep.id) ? "Chỉnh sửa bước" : "Thêm bước mới"}
        fields={[
          { name: "title", label: "Tiêu đề bước", required: true, description: "Tên bước trong quy trình", hint: "VD: Đăng ký lịch hẹn, Đến bệnh viện" },
          { name: "desc", label: "Mô tả", type: "textarea", rows: 2, description: "Mô tả chi tiết bước", hint: "Mô tả ngắn gọn action cần thực hiện" },
          { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, description: "Icon minh họa" }
        ]}
        initialData={(editingStep || {}) as Record<string, FieldValue>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa bước?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}

function WhatToBringSection({ data, onPersist }: { data: SitePatient; onPersist: (next: SitePatient) => Promise<void> }) {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<SiteBringItem | null>(null);
  const items = data.whatToBring;

  const handleOpenEdit = (item: SiteBringItem | null = null) => {
    setEditingItem(item || { id: crypto.randomUUID(), text: "", icon: "card" });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedItem: SiteBringItem = {
      id: editingItem?.id || crypto.randomUUID(),
      text: (formData.text as string) || "",
      icon: (formData.icon as string) || "card"
    };
    const next: SitePatient = {
      ...data,
      whatToBring: items.find(i => i.id === editingItem?.id)
        ? items.map(i => (i.id === editingItem?.id ? { ...i, ...updatedItem } : i))
        : [...items, updatedItem]
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, whatToBring: items.filter(i => i.id !== id) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Giấy tờ cần mang theo"
        description="Danh sách giấy tờ bệnh nhân cần chuẩn bị"
        icon={<FileText size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${items.length} items`}
        badgeColor="amber"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm giấy tờ
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => {
              const Icon = ICON_MAP[item.icon] || FileText;
              const bringColors = [
                { bg: "bg-amber-50", iconBg: "bg-amber-100", iconCol: "text-amber-600", border: "border-l-amber-400" },
                { bg: "bg-blue-50", iconBg: "bg-blue-100", iconCol: "text-blue-600", border: "border-l-blue-400" },
                { bg: "bg-emerald-50", iconBg: "bg-emerald-100", iconCol: "text-emerald-600", border: "border-l-emerald-400" },
                { bg: "bg-purple-50", iconBg: "bg-purple-100", iconCol: "text-purple-600", border: "border-l-purple-400" },
                { bg: "bg-rose-50", iconBg: "bg-rose-100", iconCol: "text-rose-600", border: "border-l-rose-400" },
                { bg: "bg-cyan-50", iconBg: "bg-cyan-100", iconCol: "text-cyan-600", border: "border-l-cyan-400" },
              ];
              const c = bringColors[idx % bringColors.length];
              return (
                <motion.div key={item.id} custom={idx} initial="hidden" animate="visible" variants={itemVariants}>
                  <div className={`group bg-white border border-green-800/5 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-green/20 transition-all duration-300 border-l-4 ${c.border}`}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <Icon size={18} className={c.iconCol} />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenEdit(item)} className="p-1 rounded-md text-gray-400 hover:text-brand-green hover:bg-brand-green/5 transition-colors cursor-pointer" title="Sửa">
                            <Edit size={12} />
                          </button>
                          <button onClick={() => setDeleteConfirm(item.id)} className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Xóa">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-display font-bold text-sm text-green-dark leading-tight mb-2">{item.text}</h4>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={11} className="text-brand-green" />
                        <span className="text-[10px] text-ink/50 font-medium">Bắt buộc</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <AddCard title="Thêm giấy tờ" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="amber" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingItem(null); }}
        onSubmit={handleSave}
        title={editingItem && items.find(i => i.id === editingItem.id) ? "Chỉnh sửa giấy tờ" : "Thêm giấy tờ mới"}
        fields={[
          { name: "text", label: "Nội dung", type: "textarea", rows: 2, required: true },
          { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS }
        ]}
        initialData={(editingItem || {}) as Record<string, FieldValue>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa giấy tờ?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}

function FaqSection({ data, onPersist }: { data: SitePatient; onPersist: (next: SitePatient) => Promise<void> }) {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<SiteFaq | null>(null);
  const faqs = data.faqs;

  const handleOpenEdit = (faq: SiteFaq | null = null) => {
    setEditingFaq(faq || { id: crypto.randomUUID(), question: "", answer: "" });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedFaq: SiteFaq = {
      id: editingFaq?.id || crypto.randomUUID(),
      question: (formData.question as string) || "",
      answer: (formData.answer as string) || ""
    };
    const next: SitePatient = {
      ...data,
      faqs: faqs.find(f => f.id === editingFaq?.id)
        ? faqs.map(f => (f.id === editingFaq?.id ? { ...f, ...updatedFaq } : f))
        : [...faqs, updatedFaq]
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingFaq(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, faqs: faqs.filter(f => f.id !== id) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Câu hỏi thường gặp (FAQ)"
        description="Các câu hỏi và câu trả lời cho bệnh nhân"
        icon={<List size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${faqs.length} câu hỏi`}
        badgeColor="blue"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm FAQ
          </Button>
        }
      >
        <div className="p-5">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div key={faq.id} custom={idx} initial="hidden" animate="visible" variants={itemVariants}>
                <ItemCard
                  title={faq.question}
                  description={faq.answer}
                  index={idx}
                  actions={{
                    onEdit: () => handleOpenEdit(faq),
                    onDelete: () => setDeleteConfirm(faq.id)
                  }}
                />
              </motion.div>
            ))}
            <AddCard title="Thêm FAQ" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="blue" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingFaq(null); }}
        onSubmit={handleSave}
        title={editingFaq && faqs.find(f => f.id === editingFaq.id) ? "Chỉnh sửa FAQ" : "Thêm FAQ mới"}
        size="lg"
        fields={[
          { name: "question", label: "Câu hỏi", required: true, description: "Câu hỏi thường gặp", hint: "VD: Giờ làm việc của bệnh viện?, Làm sao đặt lịch khám?" },
          { name: "answer", label: "Câu trả lời", type: "textarea", rows: 3, required: true, description: "Câu trả lời ngắn gọn", hint: "Trả lời ngắn gọn, dễ hiểu (1-3 câu)" }
        ]}
        initialData={(editingFaq || {}) as Record<string, FieldValue>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa FAQ?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}
