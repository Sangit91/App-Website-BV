import { useState } from "react";
import { Phone, MapPin, Mail, Link2, Clock, Plus } from "lucide-react";
import { SectionCard, ItemCard, EditModal, ConfirmDialog } from "../ui";
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

export default function ContactTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Liên hệ / Footer</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật thông tin liên hệ và Footer</p>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">3 Sections</span>
      </div>

      <ContactInfoSection />
      <QuickLinksSection />
      <SupportLinksSection />
    </div>
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

  const handleSave = (formData: Record<string, any>) => {
    setInfo(prev => ({ ...prev, ...formData }));
    setIsEditOpen(false);
  };

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
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-green mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-green-dark uppercase">Địa chỉ</p>
                  <p className="text-sm text-ink">{info.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-brand-green mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-green-dark uppercase">Điện thoại</p>
                  <p className="text-sm text-ink">{info.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-peach mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-green-dark uppercase">Hotline</p>
                  <p className="text-sm text-ink font-semibold">{info.hotline}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-brand-green mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-green-dark uppercase">Email</p>
                  <p className="text-sm text-ink">{info.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Link2 size={16} className="text-brand-green mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-green-dark uppercase">Website</p>
                  <p className="text-sm text-ink">{info.website}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-brand-green mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-green-dark uppercase">Giờ làm việc</p>
                  <p className="text-sm text-ink">{info.workingHours}</p>
                </div>
              </div>
            </div>
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
        initialData={info}
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

  const handleSave = (formData: Record<string, any>) => {
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
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            <Plus size={12} /> Thêm
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {links.map((link, idx) => (
              <ItemCard
                key={link.id}
                title={link.label}
                description={link.link}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(link),
                  onDelete: () => setDeleteConfirm(link.id)
                }}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingLink(null); }}
        onSubmit={handleSave}
        title={editingLink && links.find(l => l.id === editingLink.id) ? "Chỉnh sửa liên kết" : "Thêm liên kết mới"}
        fields={[
          { name: "label", label: "Tên hiển thị", required: true },
          { name: "link", label: "Đường dẫn", required: true }
        ]}
        initialData={editingLink || {}}
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

  const handleSave = (formData: Record<string, any>) => {
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
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            <Plus size={12} /> Thêm
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {links.map((link, idx) => (
              <ItemCard
                key={link.id}
                title={link.label}
                description={link.link}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(link),
                  onDelete: () => setDeleteConfirm(link.id)
                }}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingLink(null); }}
        onSubmit={handleSave}
        title={editingLink && links.find(l => l.id === editingLink.id) ? "Chỉnh sửa liên kết" : "Thêm liên kết mới"}
        fields={[
          { name: "label", label: "Tên hiển thị", required: true },
          { name: "link", label: "Đường dẫn", required: true }
        ]}
        initialData={editingLink || {}}
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