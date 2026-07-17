import React, { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import QuickActions from "./components/QuickActions";
import Specialties from "./components/Specialties";
import WhyChooseUs from "./components/WhyChooseUs";
import Organization from "./components/Organization";
import Doctors from "./components/Doctors";
import Testimonials from "./components/Testimonials";
import News from "./components/News";
import CTABanner from "./components/CTABanner";
import Footer from "./components/Footer";

// Interactive Dialog Overlays
import BookingForm from "./components/BookingForm";
import AIAdvisor from "./components/AIAdvisor";
import TestLookup from "./components/TestLookup";
import AdminDashboard from "./components/AdminDashboard";

// Lucide Icons
import { Heart, Sparkles, MessageCircle, Calendar } from "lucide-react";

export default function App() {
  // Modal states
  const [bookingOpen, setBookingOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);

  // Administrative dashboard routing state
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname === "/admin" || window.location.hash === "#/admin" || window.location.hash === "#admin";
  });

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminView(window.location.pathname === "/admin" || window.location.hash === "#/admin" || window.location.hash === "#admin");
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const handleCloseAdmin = () => {
    window.history.pushState({}, "", "/");
    setIsAdminView(false);
  };

  const handleOpenAdmin = () => {
    window.history.pushState({}, "", "/admin");
    setIsAdminView(true);
  };

  // Prepopulation helper states
  const [prepopulatedDoctor, setPrepopulatedDoctor] = useState("");
  const [prepopulatedSpecialtyId, setPrepopulatedSpecialtyId] = useState("");

  // Smooth scroll helper
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Trigger Booking Modal
  const handleOpenBooking = () => {
    setPrepopulatedDoctor("");
    setPrepopulatedSpecialtyId("");
    setBookingOpen(true);
  };

  // Trigger Booking prepopulated from a specific doctor card
  const handleOpenBookingWithDoctor = (doctorName: string, specialtyId: string) => {
    setPrepopulatedDoctor(doctorName);
    setPrepopulatedSpecialtyId(specialtyId);
    setBookingOpen(true);
  };

  if (isAdminView) {
    return <AdminDashboard onClose={handleCloseAdmin} />;
  }

  return (
    <div className="min-h-screen bg-cream-white flex flex-col antialiased">
      
      {/* 3.1. Topbar: Informational top line */}
      <Topbar />

      {/* 3.2. Sticky Header & Menu */}
      <Navbar
        onNavClick={handleScrollToSection}
        onOpenBooking={handleOpenBooking}
        onOpenAI={() => setAiOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Single-Screen Content Blocks */}
      <main className="flex-grow">
        
        {/* 3.3. Hero Introduction */}
        <Hero 
          onOpenBooking={handleOpenBooking} 
          onScrollToSection={handleScrollToSection} 
        />

        {/* 3.5. Quick Actions Utility Block (Deep green background) */}
        <QuickActions
          onOpenBooking={handleOpenBooking}
          onOpenTestLookup={() => setTestOpen(true)}
          onOpenAI={() => setAiOpen(true)}
          onScrollToDoctors={() => handleScrollToSection("bac-si")}
        />

        {/* 3.6. Featured Medical Specialties */}
        <Specialties />

        {/* 3.7. Why Choose Us (Light mint backdrop) */}
        <WhyChooseUs />

        {/* 3.7b. Organization & Leadership Structure */}
        <Organization />

        {/* 3.8. Esteemed Medical Staff */}
        <Doctors onOpenBookingWithDoctor={handleOpenBookingWithDoctor} />

        {/* 3.9. Patients Testimonials Gratitude (Hides automatically if empty) */}
        <Testimonials />

        {/* 3.10. Latest Medical News & Announcements */}
        <News />

        {/* 3.11. Quick CTA banner of the hospital footer zone */}
        <CTABanner onOpenBooking={handleOpenBooking} />

      </main>

      {/* 3.12. Deep Footer Area */}
      <Footer onScrollToSection={handleScrollToSection} onOpenAdmin={handleOpenAdmin} />

      {/* ========================================================= */}
      {/* OVERLAY POPUP FLOATING DIALOGS */}
      {/* ========================================================= */}
      
      {/* Interactive Booking & Appointment Registration Form */}
      <BookingForm
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        prepopulatedDoctor={prepopulatedDoctor}
        prepopulatedSpecialtyId={prepopulatedSpecialtyId}
      />

      {/* Remote AI Medical Assistant Chat Advisor */}
      <AIAdvisor
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Patient Lab Report / Test Results Query System */}
      <TestLookup
        isOpen={testOpen}
        onClose={() => setTestOpen(false)}
      />

      {/* FLOATING ACTION UTILITY BUBBLE AT THE RIGHT CORNER */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3 shrink-0 select-none">
        {/* Rapid AI Advice Floating trigger */}
        <button
          onClick={() => setAiOpen(true)}
          title="Tư vấn sức khỏe với Bác sĩ ảo (AI)"
          className="w-13 h-13 rounded-full bg-peach hover:bg-peach/90 hover:scale-110 text-white flex items-center justify-center shadow-lg transition-all duration-300 animate-pulse cursor-pointer group relative"
        >
          <Sparkles size={22} className="fill-white" />
          <span className="absolute right-14 bg-green-dark text-mint text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow border border-brand-green/20">
            Tư vấn sức khỏe AI
          </span>
        </button>

        {/* Rapid Online Booking Floating trigger */}
        <button
          onClick={handleOpenBooking}
          title="Đặt khám trực tuyến"
          className="w-13 h-13 rounded-full bg-brand-green hover:bg-brand-green/90 hover:scale-110 text-white flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer group relative"
        >
          <Calendar size={22} />
          <span className="absolute right-14 bg-green-dark text-mint text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow border border-brand-green/20">
            Đặt khám Online
          </span>
        </button>
      </div>

    </div>
  );
}
