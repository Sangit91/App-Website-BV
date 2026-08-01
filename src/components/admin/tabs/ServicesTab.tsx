import { useState, useEffect } from "react";
import { Briefcase, List } from "lucide-react";
import { SectionCard, ItemCard, AddCard, EditModal, ConfirmDialog } from "../ui";
import { useSiteContent } from "../../../context/SiteContentContext";
import {
  DEFAULT_SERVICES,
  SERVICE_ICON_MAP,
  SERVICE_COLOR_OPTIONS,
  type SiteServiceCategory,
  type SiteServiceItem,
} from "../../../data/siteServices";

type FieldValue = string | number | boolean | File | null;

export default function ServicesTab() {
  const { getSection, saveSection } = useSiteContent();
  const [data, setData] = useState<SiteServiceCategory[]>(DEFAULT_SERVICES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loaded = getSection("services", DEFAULT_SERVICES);
    const normalized = loaded.map(cat => ({
      ...cat,
      items: cat.items.map(item => ({ ...item, id: item.id || `s-${crypto.randomUUID()}` })),
    }));
    setData(normalized);
  }, [getSection]);

  const persist = async (next: SiteServiceCategory[]) => {
    setData(next);
    setSaving(true);
    try {
      await saveSection("services", next);
    } catch (err) {
      console.error("Error saving services section:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Dịch vụ</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung trang Dịch vụ bệnh viện</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs font-semibold text-brand-green animate-pulse">Đang lưu...</span>}
          <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">{data.length} Categories</span>
        </div>
      </div>

      <ServiceCategoriesSection data={data} onPersist={persist} />
      <ServiceItemsSection data={data} onPersist={persist} />
    </div>
  );
}

function ServiceCategoriesSection({ data, onPersist }: { data: SiteServiceCategory[]; onPersist: (next: SiteServiceCategory[]) => Promise<void> }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SiteServiceCategory | null>(null);

  const iconOptions = Object.keys(SERVICE_ICON_MAP).map(key => ({ value: key, label: key }));

  const handleOpenEdit = (category: SiteServiceCategory | null = null) => {
    setEditingCategory(category || data[0]);
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    if (!editingCategory) return;
    const next = data.map(cat =>
      cat.key === editingCategory.key
        ? {
            ...cat,
            title: (formData.title as string) || cat.title,
            icon: (formData.icon as string) || cat.icon,
            color: (formData.color as string) || cat.color,
            description: (formData.description as string) || cat.description,
          }
        : cat
    );
    await onPersist(next);
    setIsEditOpen(false);
    setEditingCategory(null);
  };

  return (
    <>
      <SectionCard
        title="Danh mục dịch vụ"
        description="Các loại dịch vụ của bệnh viện"
        icon={<List size={20} />}
        badge={`${data.length} danh mục`}
        badgeColor="green"
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data.map((cat, idx) => {
              const Icon = SERVICE_ICON_MAP[cat.icon] || SERVICE_ICON_MAP.Calendar;
              return (
                <ItemCard
                  key={cat.key}
                  title={cat.title}
                  description={cat.key}
                  index={idx}
                  actions={{
                    onEdit: () => handleOpenEdit(cat)
                  }}
                  footer={
                    <div className={`w-full h-1 rounded-full bg-gradient-to-r ${cat.color} mt-2 opacity-70`} />
                  }
                />
              );
            })}
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingCategory(null); }}
        onSubmit={handleSave}
        title="Chỉnh sửa danh mục"
        fields={[
          { name: "title", label: "Tên danh mục", required: true, description: "Tên loại dịch vụ", hint: "VD: Dịch vụ trọn gói, Tiêm chủng, Gói khám" },
          { name: "icon", label: "Icon", type: "select", options: iconOptions, description: "Icon đại diện" },
          { name: "color", label: "Màu sắc", type: "select", options: SERVICE_COLOR_OPTIONS, description: "Màu gradient hiển thị" },
          { name: "description", label: "Mô tả", type: "textarea", rows: 2, description: "Mô tả danh mục hiển thị trên trang công khai" }
        ]}
        initialData={(editingCategory || {}) as Record<string, FieldValue>}
      />
    </>
  );
}

function ServiceItemsSection({ data, onPersist }: { data: SiteServiceCategory[]; onPersist: (next: SiteServiceCategory[]) => Promise<void> }) {
  const [activeCategory, setActiveCategory] = useState(data[0]?.key || "");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<SiteServiceItem | null>(null);

  const currentCategory = data.find(c => c.key === activeCategory) || data[0];
  const currentServices = currentCategory?.items || [];

  const handleOpenEdit = (service: SiteServiceItem | null = null) => {
    setEditingService(service || {
      id: crypto.randomUUID(),
      name: "",
      desc: "",
      price: "",
      img: "",
      highlight: false
    });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    if (!currentCategory) return;
    const highlight = formData.highlight === "true" || formData.highlight === true;
    const updatedItem: SiteServiceItem = {
      id: editingService?.id || crypto.randomUUID(),
      name: (formData.name as string) || "",
      desc: (formData.desc as string) || "",
      price: (formData.price as string) || "",
      img: ((formData.img as string) || "").trim(),
      highlight,
    };

    const next = data.map(cat => {
      if (cat.key !== currentCategory.key) return cat;
      if (currentServices.find(s => s.id === editingService?.id)) {
        return { ...cat, items: cat.items.map(s => (s.id === editingService?.id ? { ...s, ...updatedItem } : s)) };
      }
      return { ...cat, items: [...cat.items, updatedItem] };
    });
    await onPersist(next);
    setIsEditOpen(false);
    setEditingService(null);
  };

  const handleDelete = async (id: string) => {
    if (!currentCategory) return;
    const next = data.map(cat =>
      cat.key === currentCategory.key ? { ...cat, items: cat.items.filter(s => s.id !== id) } : cat
    );
    await onPersist(next);
    setDeleteConfirm(null);
  };

  const highlightOptions = [
    { value: "false", label: "Không" },
    { value: "true", label: "Có" },
  ];

  return (
    <>
      <SectionCard
        title={`Chi tiết dịch vụ: ${currentCategory?.title || ""}`}
        description="Các dịch vụ cụ thể trong từng danh mục"
        icon={<Briefcase size={20} />}
        badge={`${currentServices.length} dịch vụ`}
        badgeColor="blue"
      >
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {data.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? `bg-gradient-to-r ${cat.color} text-white shadow`
                    : "bg-gray-100 text-ink/70 hover:bg-gray-200"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentServices.map((service, idx) => (
              <ItemCard
                key={service.id}
                title={service.name}
                description={service.desc}
                image={service.img}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(service),
                  onDelete: () => setDeleteConfirm(service.id)
                }}
                footer={
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-brand-green">{service.price}</span>
                    {service.highlight && (
                      <span className="text-[9px] font-bold bg-peach/20 text-peach px-2 py-0.5 rounded">Nổi bật</span>
                    )}
                  </div>
                }
              />
            ))}
            <AddCard title="Thêm dịch vụ" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="blue" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingService(null); }}
        onSubmit={handleSave}
        title={editingService && currentServices.find(s => s.id === editingService.id) ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        size="lg"
        fields={[
          { name: "name", label: "Tên dịch vụ", required: true, description: "Tên dịch vụ cụ thể", hint: "VD: Dịch vụ trọn gói, Kiến thức thai sản" },
          { name: "desc", label: "Mô tả", type: "textarea", rows: 2, description: "Mô tả ngắn về dịch vụ", hint: "Mô tả 1-2 câu, dễ hiểu" },
          { name: "price", label: "Giá tham khảo", description: "Giá dịch vụ", hint: "VD: Từ 500.000đ, Miễn phí, Theo gói" },
          { name: "img", label: "Hình ảnh", type: "image", description: "Ảnh minh họa dịch vụ" },
          { name: "highlight", label: "Nổi bật", type: "select", options: highlightOptions, description: "Hiển thị làm dịch vụ nổi bật" }
        ]}
        initialData={{
          ...(editingService || {}),
          highlight: editingService?.highlight ? "true" : "false",
        } as Record<string, FieldValue>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa dịch vụ?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}
