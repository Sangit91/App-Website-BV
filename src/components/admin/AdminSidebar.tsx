import React, { ReactNode } from "react";
import { useAdmin } from "../../context/AdminContext";
import {
  Sliders, Home, Info, Layers, Briefcase, Heart,
  Newspaper, FileText, Phone, MapPin,
  Calendar, Users, CalendarRange, User,
  ClipboardList, Settings, LogOut, ArrowLeft, ShieldAlert,
  ChevronRight, MessageSquare, FileStack
} from "lucide-react";
import { Button } from "../ui";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  roles?: string[];
  badge?: number;
  subItems?: { id: string; label: string; icon: ReactNode; badge?: number }[];
}

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onBackToHome: () => void;
  pendingCount?: number;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  onBackToHome,
  pendingCount = 0
}: AdminSidebarProps) {
  const { activeUser } = useAdmin();

  const navItems: NavItem[] = [
    { id: "overview", label: "Tổng quan nghiệp vụ", icon: <Sliders size={16} />, roles: ["Super Admin", "Receptionist"] },
    {
      id: "content",
      label: "Quản lý Nội dung",
      icon: <Home size={16} />,
      roles: ["Super Admin"],
      subItems: [
        { id: "home", label: "Trang chủ", icon: <Home size={14} /> },
        { id: "about", label: "Giới thiệu", icon: <Info size={14} /> },
        { id: "specialties", label: "Chuyên khoa", icon: <Layers size={14} /> },
        { id: "services", label: "Dịch vụ", icon: <Briefcase size={14} /> },
        { id: "patient", label: "Cho bệnh nhân", icon: <Heart size={14} /> },
        { id: "news", label: "Tin tức", icon: <Newspaper size={14} /> },
        { id: "tender", label: "Thông tin thầu", icon: <FileText size={14} /> },
        { id: "contact", label: "Liên hệ / Footer", icon: <Phone size={14} /> },
      ]
    },
    {
      id: "people",
      label: "Quản lý Nhân sự",
      icon: <Users size={16} />,
      roles: ["Super Admin"],
      subItems: [
        { id: "doctors", label: "Bác sĩ", icon: <User size={14} /> },
        { id: "shifts", label: "Phân ca", icon: <CalendarRange size={14} /> },
      ]
    },
    {
      id: "operations",
      label: "Quản lý Hoạt động",
      icon: <Calendar size={16} />,
      roles: ["Super Admin", "Receptionist", "Doctor"],
      subItems: [
        { id: "bookings", label: "Đặt lịch khám", icon: <Calendar size={14} />, badge: pendingCount },
        { id: "patients", label: "Bệnh nhân", icon: <Heart size={14} /> },
        { id: "logs", label: "Nhật ký hệ thống", icon: <ClipboardList size={14} /> },
        { id: "feedback", label: "Phản hồi góp ý", icon: <MessageSquare size={14} /> },
        { id: "record-requests", label: "Trích sao hồ sơ", icon: <FileStack size={14} /> },
      ]
    },
  ];

  const filteredItems = navItems.filter(item =>
    !item.roles || item.roles.includes(activeUser?.role || "")
  );

  const roleLabel = activeUser?.role === "Super Admin"
    ? "Admin Tối Cao"
    : activeUser?.role === "Receptionist"
    ? "Lễ Tân Phòng Khám"
    : activeUser?.role === "Doctor"
    ? "Bác Sĩ Trực"
    : activeUser?.department;

  const isSubItemActive = (item: NavItem) => {
    if (!item.subItems) return false;
    return item.subItems.some(sub => sub.id === activeTab);
  };

  const isActive = (item: NavItem) => {
    if (item.subItems) return isSubItemActive(item);
    return activeTab === item.id;
  };

  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(
    navItems.filter(item => isSubItemActive(item)).map(item => item.id)
  );

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-full md:w-[280px] bg-green-dark flex flex-col border-r border-brand-green/20 shrink-0 overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-brand-green w-6 h-6 shrink-0" />
          <div>
            <h2 className="font-display font-bold text-sm tracking-wide text-mint uppercase">BVĐK Quản trị</h2>
            <p className="text-[10px] text-mint/60 mt-0.5 font-medium">Miền Núi Quảng Nam</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-white/5 bg-green-dark/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center text-white font-bold text-xs">
          {activeUser?.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">{activeUser?.name}</p>
          <span className="inline-block text-[9px] font-bold bg-peach/20 text-peach border border-peach/30 px-1.5 py-0.5 rounded-md mt-0.5 uppercase">
            {roleLabel}
          </span>
        </div>
      </div>

      <nav className="flex-grow p-3 overflow-y-auto space-y-1">
        {filteredItems.map(item => (
          <div key={item.id}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => toggleGroup(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive(item)
                      ? "bg-brand-green/20 text-brand-green"
                      : "text-mint/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`transition-transform ${expandedGroups.includes(item.id) ? "rotate-90" : ""}`}
                  />
                </button>

                {expandedGroups.includes(item.id) && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-white/10 pl-3">
                    {item.subItems.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => onTabChange(sub.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                          activeTab === sub.id
                            ? "bg-brand-green text-white shadow-sm"
                            : "text-mint/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className={activeTab === sub.id ? "text-white/80" : "text-mint/40"}>
                          {sub.icon}
                        </span>
                        <span className="flex-1 text-left">{sub.label}</span>
                        {sub.badge && sub.badge > 0 && (
                          <span className="w-5 h-5 bg-peach text-green-dark rounded-full text-[10px] font-extrabold flex items-center justify-center">
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === item.id
                    ? "bg-brand-green text-white shadow-md"
                    : "text-mint/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="w-5 h-5 bg-peach text-green-dark rounded-full text-[10px] font-extrabold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/5 bg-green-dark/50 space-y-1.5 shrink-0">
        <Button
          variant="ghost"
          size="md"
          onClick={onBackToHome}
          className="w-full justify-start text-mint border border-brand-green/20 bg-white/5 hover:bg-brand-green/20"
        >
          <ArrowLeft size={16} />
          <span>Quay lại Trang chủ</span>
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={onLogout}
          className="w-full justify-start text-peach hover:bg-white/5"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </aside>
  );
}