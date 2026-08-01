import { useState, useEffect } from "react";
import { SectionCard, ItemCard, AddCard, EditModal, ConfirmDialog } from "../../ui";
import { Home, Zap, Heart, Users, FileText, Star, Settings } from "lucide-react";
import { Button } from "../../../ui";
import { useHospital } from "../../../../context/HospitalContext";
import { useSiteContent } from "../../../../context/SiteContentContext";
import { DEFAULT_HOME, type SiteHome, type SiteHomeHero, type SiteQuickAction, type SiteWhyChooseReason, type SiteStatistic, type SiteTestimonial } from "../../../../data/siteHome";

type FieldValue = string | number | boolean | File | null;

export default function HomeTab() {
  const { getSection, saveSection } = useSiteContent();
  const { news } = useHospital();
  const [data, setData] = useState<SiteHome>(DEFAULT_HOME);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const heroNews = news.filter(n => n.tag === "Sự kiện" || n.tag === "Thông báo")[0];
    const fallback = heroNews?.image || "/images/bg-hero.jpg";
    setData(getSection("home", { ...DEFAULT_HOME, hero: { ...DEFAULT_HOME.hero, backgroundImage: fallback } }));
  }, [getSection, news]);

  const persist = async (next: SiteHome) => {
    setData(next);
    setSaving(true);
    try {
      await saveSection("home", next);
    } catch (err) {
      console.error("Error saving home section:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Trang chủ</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung hiển thị trên trang chủ bệnh viện</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs font-semibold text-brand-green animate-pulse">Đang lưu...</span>}
          <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">6 Sections</span>
        </div>
      </div>

      <HeroSection data={data} onPersist={persist} />
      <QuickActionsSection data={data} onPersist={persist} />
      <WhyChooseUsSection data={data} onPersist={persist} />
      <StatisticsSection data={data} onPersist={persist} />
      <FeaturedNewsSection />
      <TestimonialsSection data={data} onPersist={persist} />
    </div>
  );
}

function HeroSection({ data, onPersist }: { data: SiteHome; onPersist: (next: SiteHome) => Promise<void> }) {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingData, setEditingData] = useState<SiteHomeHero | null>(null);
  const hero = data.hero;

  const handleOpenEdit = () => {
    setEditingData(hero);
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedHero: SiteHomeHero = {
      title: (formData.title as string) || "",
      subtitle: (formData.subtitle as string) || "",
      ctaText: (formData.ctaText as string) || "",
      ctaLink: (formData.ctaLink as string) || "/",
      backgroundImage: ((formData.backgroundImage as string) || "").trim()
    };
    await onPersist({ ...data, hero: { ...hero, ...updatedHero } });
    setIsEditOpen(false);
    setEditingData(null);
  };

  return (
    <>
      <SectionCard
        title="Hero Section"
        description="Banner chính hiển thị ở đầu trang chủ"
        icon={<Home size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge="Quan trọng"
        badgeColor="green"
        actions={
          <button
            onClick={handleOpenEdit}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-brand-green/10 text-gray-500 hover:text-brand-green transition-colors cursor-pointer"
          >
            <Settings size={14} />
          </button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-green-dark uppercase tracking-wider">Tiêu đề chính</label>
                <p className="text-sm text-green-dark font-semibold mt-1">{hero.title}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-green-dark uppercase tracking-wider">Phụ đề</label>
                <p className="text-xs text-ink/70 mt-1">{hero.subtitle}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-green-dark uppercase tracking-wider">Nút CTA</label>
                <p className="text-xs text-ink/70 mt-1">{hero.ctaText} → {hero.ctaLink}</p>
              </div>
            </div>
            <div className="relative h-40 rounded-xl overflow-hidden bg-gray-100">
              {hero.backgroundImage ? (
                <img src={hero.backgroundImage} alt="Hero background" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Home size={32} />
                </div>
              )}
              <div className="absolute bottom-2 right-2">
                <span className="text-[9px] font-bold bg-black/50 text-white px-2 py-1 rounded">Hero Image</span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingData(null); }}
        onSubmit={handleSave}
        title="Chỉnh sửa Hero Section"
        fields={[
          { name: "title", label: "Tiêu đề chính", required: true, description: "Tiêu đề lớn trên hero", hint: "VD: Chăm sóc sức khỏe toàn diện" },
          { name: "subtitle", label: "Phụ đề", type: "textarea", rows: 2, description: "Câu giới thiệu ngắn", hint: "VD: Hệ thống y tế chất lượng cao với đội ngũ bác sĩ giàu kinh nghiệm" },
          { name: "ctaText", label: "Text nút bấm", description: "Nội dung hiển thị trên nút", hint: "VD: Đặt lịch khám, Xem thêm, Liên hệ ngay" },
          { name: "ctaLink", label: "Link nút bấm", description: "Đường dẫn khi click", hint: "Bắt đầu bằng / VD: /dat-lich, /chuyen-khoa, /lien-he" },
          { name: "backgroundImage", label: "Ảnh nền", type: "image", description: "Ảnh hero section" }
        ]}
        initialData={(editingData || hero) as unknown as Record<string, FieldValue>}
      />
    </>
  );
}

function QuickActionsSection({ data, onPersist }: { data: SiteHome; onPersist: (next: SiteHome) => Promise<void> }) {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<SiteQuickAction | null>(null);
  const actions = data.quickActions;

  const iconOptions = [
    { value: "calendar", label: "📅 Lịch khám" },
    { value: "stethoscope", label: "🩺 Chuyên khoa" },
    { value: "document", label: "📄 Tài liệu" },
    { value: "newspaper", label: "📰 Tin tức" },
    { value: "book", label: "📖 Hướng dẫn" },
    { value: "phone", label: "📞 Liên hệ" }
  ];

  const colorOptions = [
    { value: "from-brand-green to-emerald-600", label: "Xanh lá" },
    { value: "from-blue-500 to-cyan-600", label: "Xanh dương" },
    { value: "from-purple-500 to-violet-600", label: "Tím" },
    { value: "from-rose-500 to-pink-600", label: "Hồng" },
    { value: "from-amber-500 to-orange-600", label: "Cam" },
    { value: "from-teal-500 to-cyan-600", label: "Teal" }
  ];

  const getIconLabel = (iconValue: string) => iconOptions.find(o => o.value === iconValue)?.label || iconValue;

  const handleOpenEdit = (action: SiteQuickAction | null = null) => {
    setEditingAction(action || {
      id: crypto.randomUUID(),
      title: "",
      icon: "calendar",
      link: "/",
      color: "from-brand-green to-emerald-600"
    });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedAction: SiteQuickAction = {
      id: editingAction?.id || crypto.randomUUID(),
      title: (formData.title as string) || "",
      icon: (formData.icon as string) || "calendar",
      link: (formData.link as string) || "/",
      color: (formData.color as string) || "from-brand-green to-emerald-600"
    };
    const next: SiteHome = {
      ...data,
      quickActions: actions.find(a => a.id === editingAction?.id)
        ? actions.map(a => (a.id === editingAction?.id ? { ...a, ...updatedAction } : a))
        : [...actions, updatedAction]
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingAction(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, quickActions: actions.filter(a => a.id !== id) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Quick Actions"
        description="6 nút hành động nhanh trên trang chủ"
        icon={<Zap size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${actions.length} items`}
        badgeColor="blue"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm Action
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {actions.map((action, idx) => (
              <ItemCard
                key={action.id}
                title={action.title}
                description={getIconLabel(action.icon)}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(action),
                  onDelete: () => setDeleteConfirm(action.id)
                }}
                footer={
                  <div className={`w-full h-1 rounded-full bg-gradient-to-r ${action.color} opacity-60`} />
                }
              />
            ))}
            <AddCard title="Thêm Action" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="blue" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingAction(null); }}
        onSubmit={handleSave}
        title={editingAction && actions.find(a => a.id === editingAction.id) ? "Chỉnh sửa Quick Action" : "Thêm Quick Action mới"}
        fields={[
          { name: "title", label: "Tên hiển thị", required: true, description: "Tên hiển thị trên nút", hint: "VD: Đặt lịch khám, Chuyên khoa, Bảng giá" },
          { name: "icon", label: "Icon", type: "select", options: iconOptions, description: "Icon hiển thị trên nút" },
          { name: "link", label: "Đường dẫn", required: true, description: "Link khi click vào nút", hint: "Bắt đầu bằng / VD: /dat-lich, /tin-tuc" },
          { name: "color", label: "Màu sắc", type: "select", options: colorOptions, description: "Màu gradient của nút" }
        ]}
        initialData={(editingAction || {}) as Record<string, FieldValue>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa Quick Action?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}

function WhyChooseUsSection({ data, onPersist }: { data: SiteHome; onPersist: (next: SiteHome) => Promise<void> }) {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingReason, setEditingReason] = useState<SiteWhyChooseReason | null>(null);
  const reasons = data.whyChoose;

  const iconOptions = [
    { value: "user-check", label: "👨‍⚕️ Bác sĩ" },
    { value: "activity", label: "💉 Thiết bị" },
    { value: "clipboard", label: "📋 Quy trình" },
    { value: "heart", label: "❤️ Chăm sóc" },
    { value: "shield", label: "🛡️ An toàn" },
    { value: "clock", label: "⏰ Nhanh chóng" }
  ];

  const getIconEmoji = (iconValue: string) => iconOptions.find(o => o.value === iconValue)?.label?.match(/[\p{Emoji}]/u)?.[0] || "•";

  const handleOpenEdit = (reason: SiteWhyChooseReason | null = null) => {
    setEditingReason(reason || {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      icon: "user-check"
    });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedReason: SiteWhyChooseReason = {
      id: editingReason?.id || crypto.randomUUID(),
      title: (formData.title as string) || "",
      description: (formData.description as string) || "",
      icon: (formData.icon as string) || "user-check"
    };
    const next: SiteHome = {
      ...data,
      whyChoose: reasons.find(r => r.id === editingReason?.id)
        ? reasons.map(r => (r.id === editingReason?.id ? { ...r, ...updatedReason } : r))
        : [...reasons, updatedReason]
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingReason(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, whyChoose: reasons.filter(r => r.id !== id) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Tại sao chọn chúng tôi"
        description="4 điểm nổi bật hiển thị trên trang chủ"
        icon={<Star size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${reasons.length} items`}
        badgeColor="amber"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm lý do
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {reasons.map((reason, idx) => (
              <ItemCard
                key={reason.id}
                title={reason.title}
                description={reason.description}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(reason),
                  onDelete: () => setDeleteConfirm(reason.id)
                }}
                footer={
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-green/10 mx-auto mt-2">
                    <span className="text-lg">{getIconEmoji(reason.icon)}</span>
                  </div>
                }
              />
            ))}
            <AddCard title="Thêm lý do" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="amber" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingReason(null); }}
        onSubmit={handleSave}
        title={editingReason && reasons.find(r => r.id === editingReason.id) ? "Chỉnh sửa lý do" : "Thêm lý do mới"}
        fields={[
          { name: "title", label: "Tiêu đề", required: true, description: "Tên điểm nổi bật", hint: "VD: Đội ngũ bác sĩ giỏi, Trang thiết bị hiện đại" },
          { name: "description", label: "Mô tả", type: "textarea", rows: 2, description: "Mô tả chi tiết", hint: "Mô tả ngắn 1-2 câu, dễ hiểu" },
          { name: "icon", label: "Icon", type: "select", options: iconOptions, description: "Icon đại diện cho lý do" }
        ]}
        initialData={(editingReason || {}) as Record<string, FieldValue>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa lý do?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}

function StatisticsSection({ data, onPersist }: { data: SiteHome; onPersist: (next: SiteHome) => Promise<void> }) {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<SiteStatistic | null>(null);
  const stats = data.stats;

  const handleOpenEdit = (stat: SiteStatistic) => {
    setEditingStat(stat);
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    if (!editingStat) return;
    const updatedStat: SiteStatistic = {
      value: (formData.value as string) || "",
      label: (formData.label as string) || ""
    };
    await onPersist({
      ...data,
      stats: stats.map(s => (s.label === editingStat.label ? { ...s, ...updatedStat } : s))
    });
    setIsEditOpen(false);
    setEditingStat(null);
  };

  return (
    <>
      <SectionCard
        title="Thống kê"
        description="Các số liệu hiển thị trên trang chủ"
        icon={<Users size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${stats.length} items`}
        badgeColor="purple"
      >
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <ItemCard
                key={stat.label}
                title={stat.value}
                description={stat.label}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(stat)
                }}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingStat(null); }}
        onSubmit={handleSave}
        title="Chỉnh sửa thống kê"
        fields={[
          { name: "value", label: "Giá trị", required: true, description: "Số liệu thống kê", hint: "VD: 100+, 50+, 1M+", prefix: "" },
          { name: "label", label: "Nhãn", required: true, description: "Mô tả số liệu", hint: "VD: Năm kinh nghiệm, Bác sĩ chuyên khoa" }
        ]}
        initialData={(editingStat || {}) as Record<string, FieldValue>}
      />
    </>
  );
}

function FeaturedNewsSection() {
  const { news } = useHospital();
  const [enabled, setEnabled] = useState(true);

  const hospitalNews = news.filter(n => !n.isTender).slice(0, 3);

  return (
    <SectionCard
      title="Tin tức nổi bật"
      description="Tin tức hiển thị trên trang chủ (từ mục Tin tức)"
      icon={<FileText size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge={`${hospitalNews.length} items`}
      badgeColor="green"
    >
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hospitalNews.map((item, idx) => (
            <ItemCard
              key={item.id}
              title={item.title}
              description={item.summary}
              image={item.image}
              index={idx}
            />
          ))}
        </div>
        <p className="text-xs text-ink/50 mt-4 text-center">Tin tức được quản lý trong mục "Quản lý Tin tức"</p>
      </div>
    </SectionCard>
  );
}

function TestimonialsSection({ data, onPersist }: { data: SiteHome; onPersist: (next: SiteHome) => Promise<void> }) {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<SiteTestimonial | null>(null);
  const testimonials = data.testimonials;

  const handleOpenEdit = (testimonial: SiteTestimonial | null = null) => {
    setEditingTestimonial(testimonial || {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      content: "",
      rating: 5
    });
    setIsEditOpen(true);
  };

  const handleSave = async (formData: Record<string, FieldValue>) => {
    const updatedTestimonial: SiteTestimonial = {
      id: editingTestimonial?.id || crypto.randomUUID(),
      name: (formData.name as string) || "",
      role: (formData.role as string) || "",
      content: (formData.content as string) || "",
      rating: typeof formData.rating === "number" ? formData.rating : editingTestimonial?.rating || 5
    };
    const next: SiteHome = {
      ...data,
      testimonials: testimonials.find(t => t.id === editingTestimonial?.id)
        ? testimonials.map(t => (t.id === editingTestimonial?.id ? { ...t, ...updatedTestimonial } : t))
        : [...testimonials, updatedTestimonial]
    };
    await onPersist(next);
    setIsEditOpen(false);
    setEditingTestimonial(null);
  };

  const handleDelete = async (id: string) => {
    await onPersist({ ...data, testimonials: testimonials.filter(t => t.id !== id) });
    setDeleteConfirm(null);
  };

  return (
    <>
      <SectionCard
        title="Cảm nhận bệnh nhân"
        description="Nhận xét của bệnh nhân hiển thị trên trang chủ"
        icon={<Heart size={20} />}
        enabled={enabled}
        onEnabledChange={setEnabled}
        badge={`${testimonials.length} items`}
        badgeColor="rose"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            Thêm cảm nhận
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {testimonials.map((item, idx) => (
              <ItemCard
                key={item.id}
                title={item.name}
                description={item.content}
                index={idx}
                actions={{
                  onEdit: () => handleOpenEdit(item),
                  onDelete: () => setDeleteConfirm(item.id)
                }}
                footer={
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-rose-500">{item.role}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`text-xs ${star <= (item.rating || 5) ? "text-peach" : "text-gray-300"}`}>★</span>
                      ))}
                    </div>
                  </div>
                }
              />
            ))}
            <AddCard title="Thêm cảm nhận" description="Nhấn để thêm" onClick={() => handleOpenEdit()} color="rose" />
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingTestimonial(null); }}
        onSubmit={handleSave}
        title={editingTestimonial && testimonials.find(t => t.id === editingTestimonial.id) ? "Chỉnh sửa cảm nhận" : "Thêm cảm nhận mới"}
        fields={[
          { name: "name", label: "Tên người gửi", required: true, description: "Họ tên người gửi cảm nhận", hint: "VD: Nguyễn Văn A" },
          { name: "role", label: "Vai trò", required: true, description: "Vai trò/đối tượng", hint: "VD: Bệnh nhân, Người nhà bệnh nhân, Khách hàng" },
          { name: "content", label: "Nội dung", type: "textarea", rows: 3, required: true, description: "Nội dung cảm nhận", hint: "Viết cảm nhận thực tế, ngắn gọn 2-3 câu" }
        ]}
        initialData={(editingTestimonial || {}) as Record<string, FieldValue>}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Xóa cảm nhận?"
        message="Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </>
  );
}
