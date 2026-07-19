import { ReactNode } from "react";
import { useAdmin } from "../../context/AdminContext";
import {
  Sliders, Calendar, Users, CalendarRange, Layers, User,
  Newspaper, Landmark, ClipboardList,
  LogOut, ArrowLeft, ShieldAlert
} from "lucide-react";
import { Button } from "../ui";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  roles?: string[];
  badge?: number;
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
    { id: "bookings", label: "Lịch hẹn khám bệnh", icon: <Calendar size={16} />, roles: ["Super Admin", "Receptionist"], badge: pendingCount },
    { id: "patients", label: "Quản lý Bệnh nhân", icon: <Users size={16} />, roles: ["Super Admin", "Receptionist"] },
    { id: "shifts", label: "Lịch trực Bác sĩ", icon: <CalendarRange size={16} />, roles: ["Super Admin", "Doctor"] },
    { id: "specialties", label: "Quản lý Chuyên khoa", icon: <Layers size={16} />, roles: ["Super Admin"] },
    { id: "doctors", label: "Quản lý Bác sĩ", icon: <User size={16} />, roles: ["Super Admin"] },
    { id: "news", label: "Quản lý Tin tức", icon: <Newspaper size={16} />, roles: ["Super Admin", "Department Admin"] },
    { id: "organization", label: "Sơ đồ Tổ chức", icon: <Landmark size={16} />, roles: ["Super Admin"] },
    { id: "logs", label: "Nhật ký hoạt động", icon: <ClipboardList size={16} />, roles: ["Super Admin", "Receptionist"] },
  ];

  const filteredItems = navItems.filter(item =>
    item.roles?.includes(activeUser?.role || "")
  );

  const roleLabel = activeUser?.role === "Super Admin"
    ? "Admin Tối Cao"
    : activeUser?.role === "Receptionist"
    ? "Lễ Tân Phòng Khám"
    : activeUser?.role === "Doctor"
    ? "Bác Sĩ Trực"
    : activeUser?.department;

  return (
    <aside className="w-full md:w-[260px] bg-green-dark flex flex-col border-r border-brand-green/20 shrink-0">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-brand-green w-5 h-5 shrink-0" />
            <h2 className="font-display font-bold text-sm tracking-wide text-mint uppercase">Lâm Sàng Portal</h2>
          </div>
          <p className="text-[10px] text-mint/60 mt-1 font-medium italic">BVĐK Miền Núi Quảng Nam</p>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-white/5 bg-green-dark/50 flex items-center gap-3">
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

      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-mint/40 px-3 uppercase tracking-wider mb-2">Chức năng quản trị</p>

        {filteredItems.map(item => (
          <button
            key={item.id}
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
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 bg-green-dark/50 space-y-2 shrink-0">
        <Button
          variant="ghost"
          size="md"
          onClick={onLogout}
          className="w-full justify-start text-peach hover:bg-white/5"
        >
          <LogOut size={16} />
          <span>Đăng xuất tài khoản</span>
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={onBackToHome}
          className="w-full justify-start text-mint border border-brand-green/20 bg-white/5 hover:bg-brand-green/20"
        >
          <ArrowLeft size={16} />
          <span>Quay lại Trang chủ</span>
        </Button>
      </div>
    </aside>
  );
}