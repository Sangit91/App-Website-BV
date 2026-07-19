import { useState } from "react";
import { SectionCard, ItemCard, EditModal, ConfirmDialog } from "../../ui";
import { Home, Zap, Heart, Users, FileText, Star, Plus, Settings } from "lucide-react";
import { Button } from "../../../ui";
import { useHospital } from "../../../../context/HospitalContext";

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  link: string;
  color: string;
}

interface WhyChooseReason {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Statistic {
  value: string;
  label: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating?: number;
}

interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export default function HomeTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Trang chủ</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung hiển thị trên trang chủ bệnh viện</p>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">6 Sections</span>
      </div>

      <HeroSection />
      <QuickActionsSection />
      <WhyChooseUsSection />
      <StatisticsSection />
      <FeaturedNewsSection />
      <TestimonialsSection />
    </div>
  );
}

function HeroSection() {
  const { news } = useHospital();
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingData, setEditingData] = useState<HeroData | null>(null);

  const heroNews = news.filter(n => n.tag === "Sự kiện" || n.tag === "Thông báo")[0];

  const defaultData: HeroData = {
    title: "Chăm sóc sức khỏe toàn diện",
    subtitle: "Bệnh viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam",
    ctaText: "Đặt lịch khám ngay",
    ctaLink: "/dat-lich",
    backgroundImage: heroNews?.image || "/images/bg-hero.jpg"
  };

  const [data, setData] = useState<HeroData>(defaultData);

  const handleOpenEdit = () => {
    setEditingData(data);
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    setData(prev => ({ ...prev, ...formData }));
    setIsEditOpen(false);
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
                <p className="text-sm text-green-dark font-semibold mt-1">{data.title}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-green-dark uppercase tracking-wider">Phụ đề</label>
                <p className="text-xs text-ink/70 mt-1">{data.subtitle}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-green-dark uppercase tracking-wider">Nút CTA</label>
                <p className="text-xs text-ink/70 mt-1">{data.ctaText} → {data.ctaLink}</p>
              </div>
            </div>
            <div className="relative h-40 rounded-xl overflow-hidden bg-gray-100">
              {data.backgroundImage ? (
                <img src={data.backgroundImage} alt="Hero background" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
        title="Chỉnh sửa Hero Section"
        fields={[
          { name: "title", label: "Tiêu đề chính", required: true },
          { name: "subtitle", label: "Phụ đề", type: "textarea", rows: 2 },
          { name: "ctaText", label: "Text nút bấm" },
          { name: "ctaLink", label: "Link nút bấm" },
          { name: "backgroundImage", label: "Ảnh nền", type: "image" }
        ]}
        initialData={editingData || data}
      />
    </>
  );
}

function QuickActionsSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<QuickAction | null>(null);

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

  const [actions, setActions] = useState<QuickAction[]>([
    { id: "1", title: "Đặt lịch khám", icon: "calendar", link: "/dat-lich", color: "from-brand-green to-emerald-600" },
    { id: "2", title: "Chuyên khoa", icon: "stethoscope", link: "/chuyen-khoa", color: "from-blue-500 to-cyan-600" },
    { id: "3", title: "Bảng giá dịch vụ", icon: "document", link: "/dich-vu", color: "from-purple-500 to-violet-600" },
    { id: "4", title: "Tin tức", icon: "newspaper", link: "/tin-tuc", color: "from-rose-500 to-pink-600" },
    { id: "5", title: "Hướng dẫn", icon: "book", link: "/cho-benh-nhan", color: "from-amber-500 to-orange-600" },
    { id: "6", title: "Liên hệ", icon: "phone", link: "/lien-he", color: "from-teal-500 to-cyan-600" }
  ]);

  const getIconLabel = (iconValue: string) => iconOptions.find(o => o.value === iconValue)?.label || iconValue;

  const handleOpenEdit = (action: QuickAction | null = null) => {
    setEditingAction(action || {
      id: crypto.randomUUID(),
      title: "",
      icon: "calendar",
      link: "/",
      color: "from-brand-green to-emerald-600"
    });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingAction && actions.find(a => a.id === editingAction.id)) {
      setActions(prev => prev.map(a => a.id === editingAction.id ? { ...a, ...formData } : a));
    } else {
      setActions(prev => [...prev, { id: crypto.randomUUID(), ...formData } as QuickAction]);
    }
    setIsEditOpen(false);
    setEditingAction(null);
  };

  const handleDelete = (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
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
        badge="6 items"
        badgeColor="blue"
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit()} className="text-xs font-bold">
            <Plus size={12} /> Thêm
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingAction(null); }}
        onSubmit={handleSave}
        title={editingAction && actions.find(a => a.id === editingAction.id) ? "Chỉnh sửa Quick Action" : "Thêm Quick Action mới"}
        fields={[
          { name: "title", label: "Tên hiển thị", required: true },
          { name: "icon", label: "Icon", type: "select", options: iconOptions },
          { name: "link", label: "Đường dẫn", required: true },
          { name: "color", label: "Màu sắc", type: "select", options: colorOptions }
        ]}
        initialData={editingAction || {}}
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

function WhyChooseUsSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingReason, setEditingReason] = useState<WhyChooseReason | null>(null);

  const iconOptions = [
    { value: "user-check", label: "👨‍⚕️ Bác sĩ" },
    { value: "activity", label: "💉 Thiết bị" },
    { value: "clipboard", label: "📋 Quy trình" },
    { value: "heart", label: "❤️ Chăm sóc" },
    { value: "shield", label: "🛡️ An toàn" },
    { value: "clock", label: "⏰ Nhanh chóng" }
  ];

  const [reasons, setReasons] = useState<WhyChooseReason[]>([
    { id: "1", title: "Đội ngũ bác sĩ chuyên môn cao", description: "Bác sĩ có nhiều năm kinh nghiệm và chứng chỉ quốc tế", icon: "user-check" },
    { id: "2", title: "Trang thiết bị hiện đại", description: "Hệ thống máy móc và thiết bị y tế tiên tiến nhất", icon: "activity" },
    { id: "3", title: "Quy trình khám chuẩn quốc tế", description: "Áp dụng quy trình JCI đảm bảo chất lượng", icon: "clipboard" },
    { id: "4", title: "Chăm sóc tận tâm 24/7", description: "Đội ngũ y tá luôn sẵn sàng hỗ trợ mọi lúc", icon: "heart" }
  ]);

  const getIconEmoji = (iconValue: string) => iconOptions.find(o => o.value === iconValue)?.label?.match(/[\p{Emoji}]/u)?.[0] || "•";

  const handleOpenEdit = (reason: WhyChooseReason | null = null) => {
    setEditingReason(reason || {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      icon: "user-check"
    });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingReason && reasons.find(r => r.id === editingReason.id)) {
      setReasons(prev => prev.map(r => r.id === editingReason.id ? { ...r, ...formData } : r));
    } else {
      setReasons(prev => [...prev, { id: crypto.randomUUID(), ...formData } as WhyChooseReason]);
    }
    setIsEditOpen(false);
    setEditingReason(null);
  };

  const handleDelete = (id: string) => {
    setReasons(prev => prev.filter(r => r.id !== id));
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
            <Plus size={12} /> Thêm
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingReason(null); }}
        onSubmit={handleSave}
        title={editingReason && reasons.find(r => r.id === editingReason.id) ? "Chỉnh sửa lý do" : "Thêm lý do mới"}
        fields={[
          { name: "title", label: "Tiêu đề", required: true },
          { name: "description", label: "Mô tả", type: "textarea", rows: 2 },
          { name: "icon", label: "Icon", type: "select", options: iconOptions }
        ]}
        initialData={editingReason || {}}
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

function StatisticsSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Statistic | null>(null);

  const [stats, setStats] = useState<Statistic[]>([
    { value: "15+", label: "Năm kinh nghiệm" },
    { value: "50+", label: "Bác sĩ chuyên khoa" },
    { value: "1000+", label: "Bệnh nhân/tháng" },
    { value: "20+", label: "Chuyên khoa" }
  ]);

  const handleOpenEdit = (stat: Statistic) => {
    setEditingStat(stat);
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingStat) {
      const idx = stats.findIndex(s => s.label === editingStat.label);
      if (idx !== -1) {
        setStats(prev => prev.map((s, i) => i === idx ? { ...s, ...formData } : s));
      }
    }
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
          { name: "value", label: "Giá trị (vd: 100+)", required: true },
          { name: "label", label: "Nhãn", required: true }
        ]}
        initialData={editingStat || {}}
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

function TestimonialsSection() {
  const [enabled, setEnabled] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: "1", name: "Nguyễn Văn A", role: "Bệnh nhân", content: "Đội ngũ bác sĩ rất tận tâm, chăm sóc bệnh nhân chu đáo. Tôi rất hài lòng với dịch vụ tại đây.", rating: 5 },
    { id: "2", name: "Trần Thị B", role: "Người nhà bệnh nhân", content: "Bệnh viện sạch sẽ, hiện đại. Quy trình khám nhanh chóng, không phải chờ đợi lâu.", rating: 5 },
    { id: "3", name: "Lê Văn C", role: "Bệnh nhân", content: "Bác sĩ giỏi, máy móc thiết bị hiện đại. Chi phí hợp lý, phù hợp với người dân.", rating: 4 }
  ]);

  const handleOpenEdit = (testimonial: Testimonial | null = null) => {
    setEditingTestimonial(testimonial || {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      content: "",
      rating: 5
    });
    setIsEditOpen(true);
  };

  const handleSave = (formData: Record<string, any>) => {
    if (editingTestimonial && testimonials.find(t => t.id === editingTestimonial.id)) {
      setTestimonials(prev => prev.map(t => t.id === editingTestimonial.id ? { ...t, ...formData } : t));
    } else {
      setTestimonials(prev => [...prev, { id: crypto.randomUUID(), ...formData, rating: 5 } as Testimonial]);
    }
    setIsEditOpen(false);
    setEditingTestimonial(null);
  };

  const handleDelete = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
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
            <Plus size={12} /> Thêm
          </Button>
        }
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </div>
      </SectionCard>

      <EditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingTestimonial(null); }}
        onSubmit={handleSave}
        title={editingTestimonial && testimonials.find(t => t.id === editingTestimonial.id) ? "Chỉnh sửa cảm nhận" : "Thêm cảm nhận mới"}
        fields={[
          { name: "name", label: "Tên người gửi", required: true },
          { name: "role", label: "Vai trò (vd: Bệnh nhân)", required: true },
          { name: "content", label: "Nội dung", type: "textarea", rows: 3, required: true }
        ]}
        initialData={editingTestimonial || {}}
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