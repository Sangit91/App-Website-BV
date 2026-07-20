import { useState } from "react";
import { Heart, FileText, List, Plus, CheckCircle, Calendar, Clock, User, Ambulance, Shield } from "lucide-react";
import { SectionCard, ItemCard, AddCard, EditModal, ConfirmDialog } from "../ui";
import { Button } from "../../ui";

const PROCESS_STEPS = [
  { id: "1", step: 1, title: "Đăng ký lịch hẹn", desc: "Qua website, điện thoại hoặc trực tiếp", icon: "calendar" },
  { id: "2", step: 2, title: "Xác nhận lịch hẹn", desc: "Nhận SMS/email xác nhận thời gian khám", icon: "check" },
  { id: "3", step: 3, title: "Đến bệnh viện", desc: "Đến quầy lễ tân với CCCD và mã lịch hẹn", icon: "user" },
  { id: "4", step: 4, title: "Khám và chẩn đoán", desc: "Gặp bác sĩ chuyên khoa", icon: "stethoscope" },
  { id: "5", step: 5, title: "Thanh toán", desc: "Thanh toán tại quầy thu ngân", icon: "wallet" },
  { id: "6", step: 6, title: "Nhận kết quả", desc: "Kết quả xét nghiệm, đơn thuốc", icon: "clipboard" }
];

const WHAT_TO_BRING = [
  { id: "1", text: "Chứng minh nhân dân / Căn cước công dân", icon: "card" },
  { id: "2", text: "Thẻ BHYT (nếu có)", icon: "shield" },
  { id: "3", text: "Kết quả xét nghiệm, siêu âm trước đó", icon: "document" },
  { id: "4", text: "Đơn thuốc đang dùng", icon: "pill" },
  { id: "5", text: "Giấy chuyển tuyến (nếu có)", icon: "referral" },
  { id: "6", text: "Tiền mặt / Thẻ thanh toán", icon: "wallet" }
];

const ICON_MAP: Record<string, any> = {
  calendar: Calendar,
  check: CheckCircle,
  user: User,
  stethoscope: Heart,
  wallet: FileText,
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

interface ProcessItem {
  id: string;
  step: number;
  title: string;
  desc: string;
  icon: string;
}

interface BringItem {
  id: string;
  text: string;
  icon: string;
}

export default function PatientTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Cho bệnh nhân</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung trang Hướng dẫn bệnh nhân</p>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">3 Sections</span>
      </div>

      <ProcessSection />
      <WhatToBringSection />
      <FaqSection />
    </div>
  );
}

function ProcessSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<ProcessItem | null>(null);
  const [steps, setSteps] = useState(PROCESS_STEPS);

  const handleOpenEdit = (step: ProcessItem | null = null) => {
    setEditingStep(step || {
      id: crypto.randomUUID(),
      step: steps.length + 1,
      title: "",
      desc: "",
      icon: "calendar"
    });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingStep && steps.find(s => s.id === editingStep.id)) {
      setSteps(prev => prev.map(s => s.id === editingStep.id ? { ...s, ...formData } : s));
    } else {
      setSteps(prev => [...prev, { id: crypto.randomUUID(), ...formData, step: prev.length + 1 } as ProcessItem]);
    }
    setIsEditOpen(false);
    setEditingStep(null);
  };

  const handleDelete = (id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, step: i + 1 })));
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
      >
        <div className="p-5">
          <div className="flex flex-wrap gap-4">
            {steps.map((step, idx) => {
              const Icon = ICON_MAP[step.icon] || Calendar;
              return (
                <ItemCard
                  key={step.id}
                  title={`Bước ${step.step}`}
                  description={`${step.title} - ${step.desc}`}
                  index={idx}
                  actions={{
                    onEdit: () => handleOpenEdit(step),
                    onDelete: () => setDeleteConfirm(step.id)
                  }}
                  footer={
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center mt-2 mx-auto">
                      <Icon size={18} className="text-brand-green" />
                    </div>
                  }
                />
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
          { name: "title", label: "Tiêu đề bước", required: true },
          { name: "desc", label: "Mô tả", type: "textarea", rows: 2 },
          { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS }
        ]}
        initialData={editingStep || {}}
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

function WhatToBringSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<BringItem | null>(null);
  const [items, setItems] = useState(WHAT_TO_BRING);

  const handleOpenEdit = (item: BringItem | null = null) => {
    setEditingItem(item || { id: crypto.randomUUID(), text: "", icon: "card" });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingItem && items.find(i => i.id === editingItem.id)) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
    } else {
      setItems(prev => [...prev, { id: crypto.randomUUID(), ...formData } as BringItem]);
    }
    setIsEditOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
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
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <ItemCard
                key={item.id}
                title={item.text}
                description="Giấy tờ cần thiết"
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(item),
                  onDelete: () => setDeleteConfirm(item.id)
                }}
                footer={
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <CheckCircle size={14} className="text-brand-green" />
                    <span className="text-xs text-ink/60">Bắt buộc</span>
                  </div>
                }
              />
            ))}
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
        initialData={editingItem || {}}
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

function FaqSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<{id: string; question: string; answer: string} | null>(null);

  const [faqs, setFaqs] = useState([
    { id: "1", question: "Giờ làm việc của bệnh viện?", answer: "Thứ 2 - Thứ 6: 7:00 - 17:00. Cấp cứu 24/7." },
    { id: "2", question: "Làm sao để đặt lịch khám?", answer: "Qua website, gọi hotline hoặc đến trực tiếp quầy lễ tân." },
    { id: "3", question: "Bệnh viện có hỗ trợ BHYT không?", answer: "Có, bệnh viện chấp nhận BHYT theo quy định của Bộ Y tế." },
    { id: "4", question: "Thời gian chờ khám trung bình?", answer: "Khoảng 15-30 phút sau giờ hẹn, tùy tình trạng." }
  ]);

  const handleOpenEdit = (faq: typeof faqs[0] | null = null) => {
    setEditingFaq(faq || { id: crypto.randomUUID(), question: "", answer: "" });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingFaq && faqs.find(f => f.id === editingFaq.id)) {
      setFaqs(prev => prev.map(f => f.id === editingFaq.id ? { ...f, ...formData } : f));
    } else {
      setFaqs(prev => [...prev, { id: crypto.randomUUID(), ...formData }]);
    }
    setIsEditOpen(false);
    setEditingFaq(null);
  };

  const handleDelete = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
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
      >
        <div className="p-5">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <ItemCard
                key={faq.id}
                title={faq.question}
                description={faq.answer}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(faq),
                  onDelete: () => setDeleteConfirm(faq.id)
                }}
              />
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
          { name: "question", label: "Câu hỏi", required: true },
          { name: "answer", label: "Câu trả lời", type: "textarea", rows: 3, required: true }
        ]}
        initialData={editingFaq || {}}
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