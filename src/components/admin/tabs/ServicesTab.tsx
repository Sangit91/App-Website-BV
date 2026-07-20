import { useState } from "react";
import { Briefcase, List, Calendar, Home, Syringe, Shield, Heart, Truck, Plane, Plus } from "lucide-react";
import { SectionCard, ItemCard, AddCard, EditModal, ConfirmDialog, ImageUploader } from "../ui";
import { Button } from "../../ui";
import { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Calendar, Home, Syringe, Shield, Heart, Truck, Plane
};

const DEFAULT_CATEGORIES = [
  { key: "dich-vu-tron-goi", title: "Dịch vụ trọn gói", icon: "Calendar", color: "from-orange-500 to-amber-600" },
  { key: "tai-nha-van-chuyen", title: "Tại nhà & Vận chuyển", icon: "Home", color: "from-blue-500 to-cyan-600" },
  { key: "tiem-chung", title: "Tiêm chủng", icon: "Syringe", color: "from-green-500 to-emerald-600" },
  { key: "bao-hiem-vip", title: "Bảo hiểm & VIP", icon: "Shield", color: "from-purple-500 to-violet-600" },
  { key: "goi-kham", title: "Gói khám", icon: "Heart", color: "from-pink-500 to-rose-600" }
];

const DEFAULT_SERVICES: Record<string, ServiceItem[]> = {
  "dich-vu-tron-goi": [
    { id: "1", name: "Dịch vụ trọn gói", desc: "Gói khám, điều trị toàn diện", price: "Từ 5.000.000đ", img: "/images/pages/vip-1.jpeg", highlight: true },
    { id: "2", name: "Kiến thức thai sản", desc: "Tư vấn, chăm sóc mẹ và bé", price: "Miễn phí", img: "/images/pages/sanphukhoa-1.jpeg" },
    { id: "3", name: "Điều trị vô sinh, hiếm muộn", desc: "IVF, IUI, các phương pháp hỗ trợ", price: "Từ 15.000.000đ", img: "/images/pages/timmach-1.jpeg" }
  ],
  "tai-nha-van-chuyen": [
    { id: "4", name: "Dịch vụ khám tại nhà", desc: "Bác sĩ đến tận nhà khám", price: "Từ 500.000đ", img: "/images/pages/tainha-1.jpeg", highlight: true },
    { id: "5", name: "Dịch vụ vận chuyển cấp cứu", desc: "Xe cấp cứu 24/7", price: "Theo km", img: "/images/pages/vanchuyen-1.jpeg" }
  ],
  "tiem-chung": [
    { id: "6", name: "Tiêm chủng – Vaccine", desc: "Đầy đủ các loại vaccine", price: "Từ 200.000đ", img: "/images/pages/tiemchung-1.jpeg", highlight: true }
  ],
  "bao-hiem-vip": [
    { id: "7", name: "Bảo hiểm Bệnh viện", desc: "Các gói bảo hiểm y tế", price: "Theo gói", img: "/images/pages/bhyt-1.jpeg", highlight: true }
  ],
  "goi-kham": [
    { id: "8", name: "Gói khám sức khỏe định kỳ", desc: "Tổng quát, toàn diện", price: "Từ 1.500.000đ", img: "/images/pages/khamtongquat-1.jpeg", highlight: true }
  ]
};

interface ServiceItem {
  id: string;
  name: string;
  desc: string;
  price: string;
  img: string;
  highlight?: boolean;
}

export default function ServicesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Dịch vụ</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung trang Dịch vụ bệnh viện</p>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">5 Categories</span>
      </div>

      <ServiceCategoriesSection />
      <ServiceItemsSection />
    </div>
  );
}

function ServiceCategoriesSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof DEFAULT_CATEGORIES[0] | null>(null);

  const iconOptions = Object.keys(ICON_MAP).map(key => ({ value: key, label: key }));

  const colorOptions = [
    { value: "from-orange-500 to-amber-600", label: "Cam" },
    { value: "from-blue-500 to-cyan-600", label: "Xanh dương" },
    { value: "from-green-500 to-emerald-600", label: "Xanh lá" },
    { value: "from-purple-500 to-violet-600", label: "Tím" },
    { value: "from-pink-500 to-rose-600", label: "Hồng" },
    { value: "from-teal-500 to-cyan-600", label: "Teal" }
  ];

  const handleOpenEdit = (category: typeof DEFAULT_CATEGORIES[0] | null = null) => {
    setEditingCategory(category || DEFAULT_CATEGORIES[0]);
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    setIsEditOpen(false);
    setEditingCategory(null);
  };

  return (
    <>
      <SectionCard
        title="Danh mục dịch vụ"
        description="Các loại dịch vụ của bệnh viện"
        icon={<List size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge="5 danh mục"
        badgeColor="green"
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {DEFAULT_CATEGORIES.map((cat, idx) => {
              const Icon = ICON_MAP[cat.icon] || Calendar;
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
          { name: "color", label: "Màu sắc", type: "select", options: colorOptions, description: "Màu gradient hiển thị" }
        ]}
        initialData={editingCategory || {}}
      />
    </>
  );
}

function ServiceItemsSection() {
  const [enabled, setEnabled] = useState(true);
  const [activeCategory, setActiveCategory] = useState("dich-vu-tron-goi");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [services, setServices] = useState<Record<string, ServiceItem[]>>(DEFAULT_SERVICES);

  const currentServices = services[activeCategory] || [];
  const currentCategory = DEFAULT_CATEGORIES.find(c => c.key === activeCategory) || DEFAULT_CATEGORIES[0];

  const handleOpenEdit = (service: ServiceItem | null = null) => {
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

  const handleSave = (formData: Record<string, any>) => {
    if (editingService && currentServices.find(s => s.id === editingService.id)) {
      setServices(prev => ({
        ...prev,
        [activeCategory]: prev[activeCategory].map(s => s.id === editingService.id ? { ...s, ...formData } : s)
      }));
    } else {
      setServices(prev => ({
        ...prev,
        [activeCategory]: [...(prev[activeCategory] || []), { id: crypto.randomUUID(), ...formData, highlight: false } as ServiceItem]
      }));
    }
    setIsEditOpen(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    setServices(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].filter(s => s.id !== id)
    }));
    setDeleteConfirm(null);
  };

  return (
    <>
<SectionCard
        title={`Chi tiết dịch vụ: ${currentCategory.title}`}
        description="Các dịch vụ cụ thể trong từng danh mục"
        icon={<Briefcase size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${currentServices.length} dịch vụ`}
        badgeColor="blue"
      >
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {DEFAULT_CATEGORIES.map(cat => (
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
          { name: "img", label: "Hình ảnh", type: "image", description: "Ảnh minh họa dịch vụ" }
        ]}
        initialData={editingService || {}}
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