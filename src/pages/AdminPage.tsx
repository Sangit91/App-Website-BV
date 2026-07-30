import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import AdminLogin from "../components/admin/AdminLogin";
import AdminSidebar from "../components/admin/AdminSidebar";
import {
  OverviewTab,
  HomeTab,
  AboutTab,
  SpecialtiesTab,
  ServicesTab,
  PatientGuideTab,
  NewsTab,
  TenderTab,
  ContactTab,
  DoctorsTab,
  BookingsTab,
  PatientsTab,
  ShiftsTab,
  LogsTab,
  OrganizationTab,
  FeedbackTab,
  RecordRequestsTab,
} from "../components/admin/tabs";

const tabLabels: Record<string, string> = {
  overview: "Tổng quan",
  home: "Trang chủ",
  about: "Giới thiệu",
  specialties: "Chuyên khoa",
  services: "Dịch vụ",
  patient: "Cho bệnh nhân",
  news: "Tin tức",
  tender: "Thông tin thầu",
  contact: "Liên hệ",
  doctors: "Bác sĩ",
  bookings: "Đặt lịch khám",
  patients: "Bệnh nhân",
  shifts: "Phân ca",
  logs: "Nhật ký",
  organization: "Tổ chức",
  feedback: "Phản hồi",
  "record-requests": "Trích sao hồ sơ",
};

export default function AdminPage() {
  const { activeUser, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const pendingCount = 0;

  if (!activeUser) {
    return <AdminLogin onBackToHome={() => navigate("/", { replace: true })} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab onNavigate={setActiveTab} />;
      case "home": return <HomeTab />;
      case "about": return <AboutTab />;
      case "specialties": return <SpecialtiesTab />;
      case "services": return <ServicesTab />;
      case "patient": return <PatientGuideTab />;
      case "news": return <NewsTab />;
      case "tender": return <TenderTab />;
      case "contact": return <ContactTab />;
      case "doctors": return <DoctorsTab />;
      case "bookings": return <BookingsTab />;
      case "patients": return <PatientsTab />;
      case "shifts": return <ShiftsTab />;
      case "logs": return <LogsTab />;
      case "organization": return <OrganizationTab />;
      case "feedback": return <FeedbackTab />;
      case "record-requests": return <RecordRequestsTab />;
      default: return <OverviewTab onNavigate={setActiveTab} />;
    }
  };

  const roleBadge = activeUser?.role === "Super Admin"
    ? "bg-brand-green text-white"
    : activeUser?.role === "Receptionist"
    ? "bg-peach text-green-dark"
    : activeUser?.role === "Doctor"
    ? "bg-blue-400 text-white"
    : "bg-purple-400 text-white";

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Chào buổi sáng";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream-white flex flex-col md:flex-row font-sans text-green-dark overflow-hidden">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
        onBackToHome={() => navigate("/", { replace: true })}
        pendingCount={pendingCount}
      />

      <main className="flex-grow flex flex-col bg-cream-white overflow-y-auto relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-green/[0.03] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-peach/[0.03] blur-3xl" />
        </div>

        <div className="sticky top-0 z-30 bg-cream-white/90 backdrop-blur-md border-b border-green-800/5">
          <div className="px-6 md:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/images/logo/Logo_bqn.png" alt="BVĐK Quảng Nam" className="w-8 h-8 object-contain" />
                <div>
                  <h1 className="text-sm font-display font-bold text-green-dark">BVĐK Quảng Nam</h1>
                  <p className="text-[10px] text-ink/50 font-medium">Cổng Quản trị Nội bộ</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-green-800/10">
                <span className="text-xs text-ink/60 font-medium">{getTimeGreeting()},</span>
                <span className="text-xs font-bold text-green-dark">{activeUser?.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBadge}`}>
                  {activeUser?.role === "Super Admin" ? "Admin" : activeUser?.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-ink/40 font-mono">{tabLabels[activeTab] || activeTab}</span>
            </div>
          </div>
        </div>

        <div className="flex-grow px-6 md:px-8 py-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
