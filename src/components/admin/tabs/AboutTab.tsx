import { useState } from "react";
import { Info, Users, Building2, Award, Handshake, Plus } from "lucide-react";
import { SectionCard, ItemCard, AddCard, EditModal, ConfirmDialog, ImageUploader } from "../ui";
import { Button } from "../../ui";

interface Director {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
}

interface Facility {
  id: string;
  title: string;
  description: string;
  image: string;
  items: string[];
}

interface WhyChooseItem {
  id: string;
  text: string;
}

export default function AboutTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Giới thiệu</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung trang Giới thiệu bệnh viện</p>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">4 Sections</span>
      </div>

      <AboutSection />
      <LeadershipSection />
      <PartnersSection />
      <FacilitiesSection />
    </div>
  );
}

function AboutSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<WhyChooseItem | null>(null);

  const [whyChooseItems, setWhyChooseItems] = useState<WhyChooseItem[]>([
    { id: "1", text: "Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm" },
    { id: "2", text: "Trang thiết bị y tế hiện đại, tiên tiến" },
    { id: "3", text: "Quy trình khám chữa bệnh chuyên nghiệp" },
    { id: "4", text: "Thái độ phục vụ tận tâm, chu đáo" },
    { id: "5", text: "Chi phí hợp lý, minh bạch" }
  ]);

  const handleOpenEdit = (item: WhyChooseItem | null = null) => {
    setEditingItem(item || { id: "", text: "" });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingItem?.id && whyChooseItems.find(i => i.id === editingItem.id)) {
      setWhyChooseItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
    } else {
      setWhyChooseItems(prev => [...prev, { id: crypto.randomUUID(), ...formData } as WhyChooseItem]);
    }
    setIsEditOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setWhyChooseItems(prev => prev.filter(i => i.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Về chúng tôi"
        description="Nội dung giới thiệu tổng quan về bệnh viện"
        icon={<Info size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${whyChooseItems.length} điểm`}
        badgeColor="green"
      >
        <div className="p-5">
          <div className="space-y-3">
            {whyChooseItems.map((item, idx) => (
              <ItemCard
                key={item.id}
                title={item.text}
                description="Điểm nổi bật"
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(item),
                  onDelete: () => setDeleteConfirm(item.id)
                }}
              />
            ))}
            <AddCard title="Thêm điểm nổi bật" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="green" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingItem(null); }}
        onSubmit={handleSave}
        title={editingItem && whyChooseItems.find(i => i.id === editingItem.id) ? "Chỉnh sửa điểm nổi bật" : "Thêm điểm nổi bật mới"}
        fields={[
          {
            name: "text",
            label: "Nội dung điểm nổi bật",
            type: "textarea",
            rows: 2,
            required: true,
            description: "Mô tả ngắn gọn điểm nổi bật",
            hint: "Tối đa 100 ký tự, viết ngắn gọn, dễ hiểu",
            suggestions: [
              "Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm",
              "Trang thiết bị y tế hiện đại, tiên tiến",
              "Quy trình khám chữa bệnh chuyên nghiệp",
              "Thái độ phục vụ tận tâm, chu đáo",
              "Chi phí hợp lý, minh bạch"
            ]
          }
        ]}
        initialData={(editingItem || {}) as Record<string, string | number | boolean | File | null>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa điểm nổi bật?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}

function LeadershipSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);

  const [directors, setDirectors] = useState<Director[]>([
    { id: "1", name: "BS CKII Nguyễn Thống Nhất", role: "Giám đốc", image: "/images/doctors/giamdoc-1.jpeg", bio: "Bác sĩ chuyên khoa II với hơn 20 năm kinh nghiệm" },
    { id: "2", name: "BSCK II Lê Minh Dũng", role: "Phó Giám đốc", image: "/images/doctors/phogiamdoc-1.jpeg", bio: "Phó Giám đốc phụ trách chuyên môn" },
    { id: "3", name: "BS CKII Nguyễn Đình Hoàng", role: "Phó Giám đốc", image: "/images/doctors/phogiamdoc-2.jpeg", bio: "Phó Giám đốc phụ trách hành chính" }
  ]);

  const roleOptions = [
    { value: "Giám đốc", label: "Giám đốc" },
    { value: "Phó Giám đốc", label: "Phó Giám đốc" },
    { value: "Trưởng phòng", label: "Trưởng phòng" },
    { value: "Phó phòng", label: "Phó phòng" },
    { value: "Trưởng khoa", label: "Trưởng khoa" }
  ];

  const handleOpenEdit = (director: Director | null = null) => {
    setEditingDirector(director || {
      id: crypto.randomUUID(),
      name: "",
      role: "Giám đốc",
      image: "",
      bio: ""
    });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingDirector && directors.find(d => d.id === editingDirector.id)) {
      setDirectors(prev => prev.map(d => d.id === editingDirector.id ? { ...d, ...formData } : d));
    } else {
      setDirectors(prev => [...prev, { id: crypto.randomUUID(), ...formData } as Director]);
    }
    setIsEditOpen(false);
    setEditingDirector(null);
  };

  const handleDelete = (id: string) => {
    setDirectors(prev => prev.filter(d => d.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Ban Lãnh đạo"
        description="Thông tin Giám đốc và các Phó Giám đốc"
        icon={<Users size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${directors.length} người`}
        badgeColor="blue"
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {directors.map((director, idx) => (
              <ItemCard
                key={director.id}
                title={director.name}
                description={director.role}
                image={director.image}
                imageAlt={director.name}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(director),
                  onDelete: () => setDeleteConfirm(director.id)
                }}
                footer={director.bio ? <p className="text-xs text-ink/60 mt-2 line-clamp-2">{director.bio}</p> : undefined}
              />
            ))}
            <AddCard title="Thêm lãnh đạo" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="blue" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingDirector(null); }}
        onSubmit={handleSave}
        title={editingDirector && directors.find(d => d.id === editingDirector.id) ? "Chỉnh sửa lãnh đạo" : "Thêm lãnh đạo mới"}
        size="lg"
        fields={[
          { name: "name", label: "Họ tên", required: true, description: "Họ tên đầy đủ", hint: "VD: BS CKII Nguyễn Văn A" },
          { name: "role", label: "Chức vụ", type: "select", options: roleOptions, description: "Chức vụ hiện tại" },
          { name: "image", label: "Ảnh lãnh đạo", type: "image", description: "Ảnh chân dung" },
          { name: "bio", label: "Tiểu sử", type: "textarea", rows: 2, description: "Kinh nghiệm, trình độ", hint: "VD: Bác sĩ chuyên khoa II với hơn 20 năm kinh nghiệm" }
        ]}
        initialData={(editingDirector || {}) as Record<string, string | number | boolean | File | null>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa lãnh đạo?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}

function PartnersSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const [partners, setPartners] = useState<Partner[]>([
    { id: "1", name: "BHYT Quảng Nam", website: "https://bhytquangnam.vn" },
    { id: "2", name: "Bảo Việt", website: "https://baoviet.com.vn" },
    { id: "3", name: "PTI", website: "https://pti.com.vn" },
    { id: "4", name: "PJICO", website: "https://pjico.com.vn" },
    { id: "5", name: "Manulife", website: "https://manulife.com.vn" },
    { id: "6", name: "Prudential", website: "https://prudential.com.vn" }
  ]);

  const handleOpenEdit = (partner: Partner | null = null) => {
    setEditingPartner(partner || {
      id: crypto.randomUUID(),
      name: "",
      website: ""
    });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingPartner && partners.find(p => p.id === editingPartner.id)) {
      setPartners(prev => prev.map(p => p.id === editingPartner.id ? { ...p, ...formData } : p));
    } else {
      setPartners(prev => [...prev, { id: crypto.randomUUID(), ...formData } as Partner]);
    }
    setIsEditOpen(false);
    setEditingPartner(null);
  };

  const handleDelete = (id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Đối tác"
        description="Logo và thông tin các đối tác của bệnh viện"
        icon={<Handshake size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${partners.length} đối tác`}
        badgeColor="amber"
      >
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {partners.map((partner, idx) => (
              <ItemCard
                key={partner.id}
                title={partner.name}
                description={partner.website || "Chưa có website"}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(partner),
                  onDelete: () => setDeleteConfirm(partner.id)
                }}
              />
            ))}
            <AddCard title="Thêm đối tác" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="amber" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingPartner(null); }}
        onSubmit={handleSave}
        title={editingPartner && partners.find(p => p.id === editingPartner.id) ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
        fields={[
          { name: "name", label: "Tên đối tác", required: true, description: "Tên công ty/bảo hiểm", hint: "VD: BHYT Quảng Nam, Bảo Việt, Prudential" },
          { name: "website", label: "Website", description: "Địa chỉ website", hint: "VD: https://bhytquangnam.vn" }
        ]}
        initialData={(editingPartner || {}) as Record<string, string | number | boolean | File | null>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa đối tác?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}

function FacilitiesSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: "1",
      title: "Cơ sở – Trang thiết bị",
      description: "Hệ thống phòng mổ và thiết bị y tế hiện đại",
      image: "/images/pages/coso-1.jpeg",
      items: ["5 phòng mổ hiện đại", "200 giường bệnh", "Thiết bị MRI, CT Scanner", "Phòng ICU với 20 giường"]
    },
    {
      id: "2",
      title: "Hình ảnh bệnh viện",
      description: "Không gian khám chữa bệnh thoáng mát",
      image: "/images/pages/coso-2.jpeg",
      items: ["Không gian sạch sẽ, thoáng mát", "Khu vườn cây xanh mát", "Phòng chờ hiện đại", "Khuôn viên rộng 5 hecta"]
    },
    {
      id: "3",
      title: "Tiện nghi – Sang trọng",
      description: "Các tiện ích cho bệnh nhân và người nhà",
      image: "/images/pages/coso-2.jpeg",
      items: ["Wifi miễn phí toàn bệnh viện", "Nhà hàng cao cấp", "Khu vui chơi trẻ em", "Bãi đỗ xe rộng rãi"]
    }
  ]);

  const handleOpenEdit = (facility: Facility | null = null) => {
    setEditingFacility(facility || {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      image: "",
      items: []
    });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingFacility && facilities.find(f => f.id === editingFacility.id)) {
      setFacilities(prev => prev.map(f => f.id === editingFacility.id ? { ...f, ...formData } : f));
    } else {
      setFacilities(prev => [...prev, { id: crypto.randomUUID(), ...formData, items: [] } as Facility]);
    }
    setIsEditOpen(false);
    setEditingFacility(null);
  };

  const handleDelete = (id: string) => {
    setFacilities(prev => prev.filter(f => f.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Cơ sở vật chất"
        description="Hình ảnh và mô tả các tiện ích của bệnh viện"
        icon={<Building2 size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${facilities.length} mục`}
        badgeColor="purple"
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {facilities.map((facility, idx) => (
              <ItemCard
                key={facility.id}
                title={facility.title}
                description={facility.description}
                image={facility.image}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(facility),
                  onDelete: () => setDeleteConfirm(facility.id)
                }}
                footer={
                  <div className="space-y-1 mt-2">
                    {facility.items.slice(0, 3).map((item, i) => (
                      <p key={i} className="text-xs text-ink/60 flex items-center gap-1">
                        <span className="w-1 h-1 bg-brand-green rounded-full" />
                        {item}
                      </p>
                    ))}
                    {facility.items.length > 3 && (
                      <p className="text-[10px] text-brand-green font-semibold">+{facility.items.length - 3} more</p>
                    )}
                  </div>
                }
              />
            ))}
            <AddCard title="Thêm cơ sở" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="blue" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingFacility(null); }}
        onSubmit={handleSave}
        title={editingFacility && facilities.find(f => f.id === editingFacility.id) ? "Chỉnh sửa cơ sở" : "Thêm cơ sở mới"}
        size="lg"
        fields={[
          { name: "title", label: "Tiêu đề", required: true, description: "Tên tiện ích/cơ sở", hint: "VD: Cơ sở vật chất, Hình ảnh bệnh viện" },
          { name: "description", label: "Mô tả", type: "textarea", rows: 2, description: "Mô tả ngắn gọn", hint: "Mô tả 1-2 câu về cơ sở vật chất" },
          { name: "image", label: "Hình ảnh", type: "image", description: "Ảnh minh họa cơ sở" }
        ]}
        initialData={(editingFacility || {}) as Record<string, string | number | boolean | File | null>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa cơ sở?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}