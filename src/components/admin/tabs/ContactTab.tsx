import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Mail, Link2, Clock, Plus, Globe, ExternalLink } from "lucide-react";
import { SectionCard, ItemCard, AddCard, EditModal, ConfirmDialog } from "../ui";
import { Button } from "../../ui";

const QUICK_LINKS = [
  { id: "1", label: "Trang chủ", link: "/" },
  { id: "2", label: "Giới thiệu", link: "/gioi-thieu" },
  { id: "3", label: "Chuyên khoa", link: "/chuyen-khoa" },
  { id: "4", label: "Dịch vụ", link: "/dich-vu" },
  { id: "5", label: "Tin tức", link: "/tin-tuc" },
  { id: "6", label: "Liên hệ", link: "/lien-he" }
];

const SUPPORT_LINKS = [
  { id: "1", label: "Đặt lịch khám", link: "/dat-lich" },
  { id: "2", label: "Bảng giá dịch vụ", link: "/dich-vu" },
  { id: "3", label: "Quy trình khám bệnh", link: "/cho-benh-nhan" },
  { id: "4", label: "Chính sách bảo mật", link: "/chinh-sach" },
  { id: "5", label: "Điều khoản sử dụng", link: "/dieu-khoan" }
];

interface ContactInfo {
  address: string;
  phone: string;
  hotline: string;
  email: string;
  website: string;
  workingHours: string;
}

interface QuickLink {
  id: string;
  label: string;
  link: string;
}

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

const infoItemMap: Record<string, { icon: any; color: string }> = {
  address: { icon: MapPin, color: "text-brand-green" },
  phone: { icon: Phone, color: "text-brand-green" },
  hotline: { icon: Phone, color: "text-peach" },
  email: { icon: Mail, color: "text-brand-green" },
  website: { icon: Globe, color: "text-brand-green" },
  workingHours: { icon: Clock, color: "text-brand-green" },
};

export default function ContactTab() {
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green/20 to-green-dark/20 flex items-center justify-center shadow-sm">
            <Phone size={18} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-green-dark">Liên hệ / Footer</h2>
            <p className="text-[11px] text-ink/50">Cập nhật thông tin liên hệ và Footer</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">3 Sections</span>
      </div>

      <motion.div custom={0} initial="hidden" animate="visible" variants={sectionVariants}>
        <ContactInfoSection />
      </motion.div>
      <motion.div custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
        <QuickLinksSection />
      </motion.div>
      <motion.div custom={2} initial="hidden" animate="visible" variants={sectionVariants}>
        <SupportLinksSection />
      </motion.div>
    </motion.div>
  );
}

function ContactInfoSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const defaultInfo: ContactInfo = {
    address: "107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng",
    phone: "0236 1234 567",
    hotline: "1900 1234",
    email: "bvdk.miennui@quangnam.gov.vn",
    website: "https://bvdakhoaquangnam.vn",
    workingHours: "Thứ 2 - Thứ 6: 7:00 - 17:00"
  };

  const [info, setInfo] = useState(defaultInfo);

  const handleSave = (formData: Record<string, string | number | boolean | File | null>) => {
    setInfo(prev => ({ ...prev, ...formData }));
    setIsEditOpen(false);
  };

  const infoFields: { key: keyof ContactInfo; label: string }[] = [
    { key: "address", label: "Địa chỉ" },
    { key: "phone", label: "Điện thoại" },
    { key: "hotline", label: "Hotline" },
    { key: "email", label: "Email" },
    { key: "website", label: "Website" },
    { key: "workingHours", label: "Giờ làm việc" },
  ];

  return (
    <>
      <SectionCard
        title="Thông tin liên hệ"
        description="Địa chỉ, số điện thoại, email, giờ làm việc"
        icon={<Phone size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge="Cơ bản"
        badgeColor="green"
        actions={
          <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)} className="text-xs font-bold">
            Chỉnh sửa
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoFields.map((field, idx) => {
              const meta = infoItemMap[field.key] || { icon: MapPin, color: "text-brand-green" };
              const Icon = meta.icon;
              return (
                <motion.div
                  key={field.key}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-cream-white transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-brand-green/5 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${meta.color}`}>
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-green-dark uppercase tracking-wide">{field.label}</p>
                    <p className={`text-sm ${field.key === "hotline" ? "font-bold text-peach" : "text-ink"}`}>{info[field.key]}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
        title="Chỉnh sửa thông tin liên hệ"
        size="lg"
        fields={[
          { name: "address", label: "Địa chỉ", required: true },
          { name: "phone", label: "Điện thoại" },
          { name: "hotline", label: "Hotline" },
          { name: "email", label: "Email" },
          { name: "website", label: "Website" },
          { name: "workingHours", label: "Giờ làm việc" }
        ]}
        initialData={info as unknown as Record<string, string | number | boolean | File | null>}
      />
    </>
  );
}

function QuickLinksSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [links, setLinks] = useState(QUICK_LINKS);

  const handleOpenEdit = (link: QuickLink | null = null) => {
    setEditingLink(link || { id: crypto.randomUUID(), label: "", link: "" });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, string | number | boolean | File | null>) => {
    if (editingLink && links.find(l => l.id === editingLink.id)) {
      setLinks(prev => prev.map(l => l.id === editingLink.id ? { ...l, ...formData } : l));
    } else {
      setLinks(prev => [...prev, { id: crypto.randomUUID(), ...formData } as QuickLink]);
    }
    setIsEditOpen(false);
    setEditingLink(null);
  };

  const handleDelete = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Liên kết nhanh (Footer)"
        description="Các liên kết nhanh trong Footer"
        icon={<Link2 size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${links.length} links`}
        badgeColor="blue"
      >
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {links.map((link, idx) => (
              <motion.div key={link.id} custom={idx} initial="hidden" animate="visible" variants={itemVariants}>
                <ItemCard
                  title={link.label}
                  description={link.link}
                  index={idx}
                  actions={{
                    onEdit: () => handleOpenEdit(link),
                    onDelete: () => setDeleteConfirm(link.id)
                  }}
                />
              </motion.div>
            ))}
            <AddCard title="Thêm liên kết" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="blue" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingLink(null); }}
        onSubmit={handleSave}
        title={editingLink && links.find(l => l.id === editingLink.id) ? "Chỉnh sửa liên kết" : "Thêm liên kết mới"}
        fields={[
          { name: "label", label: "Tên hiển thị", required: true, description: "Tên liên kết hiển thị", hint: "VD: Trang chủ, Giới thiệu, Liên hệ" },
          { name: "link", label: "Đường dẫn", required: true, description: "Link của liên kết", hint: "Bắt đầu bằng / VD: /gioi-thieu, /chuyen-khoa" }
        ]}
        initialData={(editingLink || {}) as Record<string, string | number | boolean | File | null>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa liên kết?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}

function SupportLinksSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [links, setLinks] = useState(SUPPORT_LINKS);

  const handleOpenEdit = (link: QuickLink | null = null) => {
    setEditingLink(link || { id: crypto.randomUUID(), label: "", link: "" });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, string | number | boolean | File | null>) => {
    if (editingLink && links.find(l => l.id === editingLink.id)) {
      setLinks(prev => prev.map(l => l.id === editingLink.id ? { ...l, ...formData } : l));
    } else {
      setLinks(prev => [...prev, { id: crypto.randomUUID(), ...formData } as QuickLink]);
    }
    setIsEditOpen(false);
    setEditingLink(null);
  };

  const handleDelete = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Hỗ trợ"
        description="Các liên kết hỗ trợ bệnh nhân"
        icon={<Phone size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${links.length} links`}
        badgeColor="amber"
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {links.map((link, idx) => (
              <motion.div key={link.id} custom={idx} initial="hidden" animate="visible" variants={itemVariants}>
                <ItemCard
                  title={link.label}
                  description={link.link}
                  index={idx}
                  actions={{
                    onEdit: () => handleOpenEdit(link),
                    onDelete: () => setDeleteConfirm(link.id)
                  }}
                />
              </motion.div>
            ))}
            <AddCard title="Thêm liên kết" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="amber" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingLink(null); }}
        onSubmit={handleSave}
        title={editingLink && links.find(l => l.id === editingLink.id) ? "Chỉnh sửa liên kết" : "Thêm liên kết hỗ trợ mới"}
        size="lg"
        fields={[
          { name: "label", label: "Tên hiển thị", required: true, description: "Tên liên kết hỗ trợ", hint: "VD: Đặt lịch khám, Bảng giá dịch vụ" },
          { name: "link", label: "Đường dẫn", required: true, description: "Link của liên kết", hint: "Bắt đầu bằng / VD: /dat-lich, /dich-vu" }
        ]}
        initialData={(editingLink || {}) as Record<string, string | number | boolean | File | null>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa liên kết?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}
