import { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import AdminLogin from "../components/admin/AdminLogin";
import AdminSidebar from "../components/admin/AdminSidebar";
import {
  OverviewTab,
  HomeTab,
  AboutTab,
  SpecialtiesTab,
  ServicesTab,
  PatientTab,
  NewsTab,
  TenderTab,
  ContactTab,
  DoctorsTab,
  BookingsTab,
  PatientsTab,
  ShiftsTab,
  LogsTab,
  OrganizationTab,
} from "../components/admin/tabs";

export default function AdminPage() {
  const { activeUser, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState("overview");

  const pendingCount = 0;

  if (!activeUser) {
    return <AdminLogin onBackToHome={() => window.location.href = "/"} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab onNavigate={setActiveTab} />;
      case "home": return <HomeTab />;
      case "about": return <AboutTab />;
      case "specialties": return <SpecialtiesTab />;
      case "services": return <ServicesTab />;
      case "patient": return <PatientTab />;
      case "news": return <NewsTab />;
      case "tender": return <TenderTab />;
      case "contact": return <ContactTab />;
      case "doctors": return <DoctorsTab />;
      case "bookings": return <BookingsTab />;
      case "patients": return <PatientsTab />;
      case "shifts": return <ShiftsTab />;
      case "logs": return <LogsTab />;
      case "organization": return <OrganizationTab />;
      default: return <OverviewTab onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream-white flex flex-col md:flex-row font-sans text-green-dark overflow-hidden">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
        onBackToHome={() => window.location.href = "/"}
        pendingCount={pendingCount}
      />

      <main className="flex-grow flex flex-col bg-cream-white overflow-y-auto">
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}