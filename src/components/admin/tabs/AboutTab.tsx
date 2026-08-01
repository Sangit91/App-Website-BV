import { useState, useEffect } from "react";
import { Info, Users, Building2, Handshake } from "lucide-react";
import { SectionCard, ItemCard, AddCard, EditModal, ConfirmDialog } from "../ui";
import { Button } from "../../ui";
import { useSiteContent } from "../../../context/SiteContentContext";
import { DEFAULT_ABOUT, type SiteAbout, type SiteFacility, type SiteWhyChoose, type SiteDirector } from "../../../data/siteAbout";

type FieldValue = string | number | boolean | File | null;

export default function AboutTab() {
  const { getSection, saveSection } = useSiteContent();
  const [data, setData] = useState<SiteAbout>(DEFAULT_ABOUT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(getSection("about", DEFAULT_ABOUT));
  }, [getSection]);

  const persist = async (next: SiteAbout) => {
    setData(next);
    setSaving(true);
    try {
      await saveSection("about", next);
    } catch (err) {
      console.error("Error saving about section:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Giới thiệu</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung trang Giới thiệu bệnh viện</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs font-semibold text-brand-green animate-pulse">Đang lưu...</span>}
          <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">4 Sections</span>
        </div>
      </div>

      <WhyChooseSection data={data} onPersist={persist} />
      <LeadershipSection data={data} onPersist={persist} />
      <PartnersSection data={data} onPersist={persist} />
      <FacilitiesSection data={data} onPersist={persist} />
    </div>
  );
}

function WhyChooseSection({ data, onPersist }: { data: SiteAbout; onPersist: (next: SiteAbout) => Promise<void> }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<SiteWhyChoose | null>(null);

  const handleOpenEdit = (item: SiteWhyChoose | null = null) => {
    setEditingItem(item || { id: crypto.randomUUID(), title: "", desc: "", image: "" });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedItem: SiteWhyChoose = {
      id: editingItem?.id || crypto.randomUUID(),
      title: (formData.title as string) || "",
      desc: (formData.desc as string) || "",
      image: ((formData.image as string) || "").trim(),
    };
    const next: SiteAbout = {
      ...data,
      whyChoose: data.whyChoose.find(i => i.id === editingItem?.id)
        ? data.whyChoose.map(i => (i.id === editingItem?.id ? { ...i, ...updatedItem } : i))
        : [...data.whyChoose, updatedItem],
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, whyChoose: data.whyChoose.filter(i => i.id !== id) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Tại sao chọn chúng tôi"
        description="Các giá trị nổi bật hiển thị trên trang giới thiệu"
        icon={<Info size={20} />}
        badge={`${data.whyChoose.length} điểm`}
        badgeColor="green"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm điểm nổi bật
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.whyChoose.map((item, idx) => (
              <ItemCard
                key={item.id}
                title={item.title}
                description={item.desc}
                image={item.image}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(item),
                  onDelete: () => setDeleteConfirm(item.id)
                }}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingItem(null); }}
        onSubmit={handleSave}
        title={editingItem && data.whyChoose.find(i => i.id === editingItem.id) ? "Chỉnh sửa điểm nổi bật" : "Thêm điểm nổi bật mới"}
        size="lg"
        fields={[
          { name: "title", label: "Tiêu đề", required: true, description: "Tên điểm nổi bật", hint: "VD: Đội ngũ bác sĩ chuyên môn cao" },
          { name: "desc", label: "Mô tả", type: "textarea", rows: 2, required: true, description: "Mô tả ngắn gọn điểm nổi bật" },
          { name: "image", label: "Hình ảnh", type: "image", description: "Ảnh minh họa" }
        ]}
        initialData={(editingItem || {}) as Record<string, FieldValue>}
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

function LeadershipSection({ data, onPersist }: { data: SiteAbout; onPersist: (next: SiteAbout) => Promise<void> }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingDirector, setEditingDirector] = useState<SiteDirector | null>(null);

  const roleOptions = [
    { value: "Giám đốc", label: "Giám đốc" },
    { value: "Phó Giám đốc", label: "Phó Giám đốc" },
    { value: "Trưởng phòng", label: "Trưởng phòng" },
    { value: "Phó phòng", label: "Phó phòng" },
    { value: "Trưởng khoa", label: "Trưởng khoa" }
  ];

  const handleOpenEdit = (director: SiteDirector | null = null) => {
    setEditingDirector(director || { id: crypto.randomUUID(), name: "", role: "Giám đốc", image: "", bio: "" });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedDirector: SiteDirector = {
      id: editingDirector?.id || crypto.randomUUID(),
      name: (formData.name as string) || "",
      role: (formData.role as string) || "",
      image: ((formData.image as string) || "").trim(),
      bio: (formData.bio as string) || "",
    };
    const next: SiteAbout = {
      ...data,
      directors: data.directors.find(d => d.id === editingDirector?.id)
        ? data.directors.map(d => (d.id === editingDirector?.id ? { ...d, ...updatedDirector } : d))
        : [...data.directors, updatedDirector],
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingDirector(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, directors: data.directors.filter(d => d.id !== id) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Ban Lãnh đạo"
        description="Thông tin Giám đốc và các Phó Giám đốc"
        icon={<Users size={20} />}
        badge={`${data.directors.length} người`}
        badgeColor="blue"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm lãnh đạo
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.directors.map((director, idx) => (
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
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingDirector(null); }}
        onSubmit={handleSave}
        title={editingDirector && data.directors.find(d => d.id === editingDirector.id) ? "Chỉnh sửa lãnh đạo" : "Thêm lãnh đạo mới"}
        size="lg"
        fields={[
          { name: "name", label: "Họ tên", required: true, description: "Họ tên đầy đủ", hint: "VD: BS CKII Nguyễn Văn A" },
          { name: "role", label: "Chức vụ", type: "select", options: roleOptions, description: "Chức vụ hiện tại" },
          { name: "image", label: "Ảnh lãnh đạo", type: "image", description: "Ảnh chân dung" },
          { name: "bio", label: "Tiểu sử", type: "textarea", rows: 2, description: "Kinh nghiệm, trình độ", hint: "VD: Bác sĩ chuyên khoa II với hơn 20 năm kinh nghiệm" }
        ]}
        initialData={(editingDirector || {}) as Record<string, FieldValue>}
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

function PartnersSection({ data, onPersist }: { data: SiteAbout; onPersist: (next: SiteAbout) => Promise<void> }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");

  const handleOpenEdit = (name: string | null = null) => {
    setEditingName(name);
    setNameInput(name || "");
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const nextName = (formData.name as string) || "";
    if (!nextName.trim()) return;
    const next: SiteAbout = {
      ...data,
      partners: editingName
        ? data.partners.map(p => (p === editingName ? nextName : p))
        : [...data.partners, nextName],
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingName(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, partners: data.partners.filter(p => p !== id) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Đối tác"
        description="Các đối tác bảo hiểm của bệnh viện"
        icon={<Handshake size={20} />}
        badge={`${data.partners.length} đối tác`}
        badgeColor="amber"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm đối tác
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.partners.map((partner, idx) => (
              <ItemCard
                key={partner}
                title={partner}
                description="Đối tác"
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(partner),
                  onDelete: () => setDeleteConfirm(partner)
                }}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingName(null); }}
        onSubmit={handleSave}
        title={editingName ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
        fields={[
          { name: "name", label: "Tên đối tác", required: true, description: "Tên công ty/bảo hiểm", hint: "VD: BHYT Quảng Nam, Bảo Việt, Prudential" }
        ]}
        initialData={{ name: editingName || "" }}
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

function FacilitiesSection({ data, onPersist }: { data: SiteAbout; onPersist: (next: SiteAbout) => Promise<void> }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingFacility, setEditingFacility] = useState<SiteFacility | null>(null);

  const handleOpenEdit = (facility: SiteFacility | null = null) => {
    setEditingFacility(facility || { id: crypto.randomUUID(), title: "", description: "", image: "", items: [] });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedFacility: SiteFacility = {
      id: editingFacility?.id || crypto.randomUUID(),
      title: (formData.title as string) || "",
      description: (formData.description as string) || "",
      image: ((formData.image as string) || "").trim(),
      items: editingFacility?.items || [],
    };
    const next: SiteAbout = {
      ...data,
      facilities: data.facilities.find(f => f.id === editingFacility?.id)
        ? data.facilities.map(f => (f.id === editingFacility?.id ? { ...f, ...updatedFacility } : f))
        : [...data.facilities, updatedFacility],
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingFacility(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, facilities: data.facilities.filter(f => f.id !== id) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Cơ sở vật chất"
        description="Hình ảnh và mô tả các tiện ích của bệnh viện"
        icon={<Building2 size={20} />}
        badge={`${data.facilities.length} mục`}
        badgeColor="purple"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm cơ sở
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.facilities.map((facility, idx) => (
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
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingFacility(null); }}
        onSubmit={handleSave}
        title={editingFacility && data.facilities.find(f => f.id === editingFacility.id) ? "Chỉnh sửa cơ sở" : "Thêm cơ sở mới"}
        size="lg"
        fields={[
          { name: "title", label: "Tiêu đề", required: true, description: "Tên tiện ích/cơ sở", hint: "VD: Cơ sở vật chất, Hình ảnh bệnh viện" },
          { name: "description", label: "Mô tả", type: "textarea", rows: 2, description: "Mô tả ngắn gọn", hint: "Mô tả 1-2 câu về cơ sở vật chất" },
          { name: "image", label: "Hình ảnh", type: "image", description: "Ảnh minh họa cơ sở" }
        ]}
        initialData={(editingFacility || {}) as Record<string, FieldValue>}
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
