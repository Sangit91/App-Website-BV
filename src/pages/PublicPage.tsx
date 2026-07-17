import { useState } from "react";
import Topbar from "../components/layout/Topbar";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/public/Hero";
import QuickActions from "../components/public/QuickActions";
import Specialties from "../components/public/Specialties";
import WhyChooseUs from "../components/public/WhyChooseUs";
import Organization from "../components/public/Organization";
import Doctors from "../components/public/Doctors";
import Testimonials from "../components/public/Testimonials";
import News from "../components/public/News";
import CTABanner from "../components/public/CTABanner";
import Footer from "../components/layout/Footer";
import BookingForm from "../components/booking/BookingForm";
import AIAdvisor from "../components/ai/AIAdvisor";
import TestLookup from "../components/test-lookup/TestLookup";
import { Sparkles, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PublicPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [prepopulatedDoctor, setPrepopulatedDoctor] = useState("");
  const [prepopulatedSpecialtyId, setPrepopulatedSpecialtyId] = useState("");
  const navigate = useNavigate();

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenBooking = () => {
    setPrepopulatedDoctor("");
    setPrepopulatedSpecialtyId("");
    setBookingOpen(true);
  };

  const handleOpenBookingWithDoctor = (doctorName: string, specialtyId: string) => {
    setPrepopulatedDoctor(doctorName);
    setPrepopulatedSpecialtyId(specialtyId);
    setBookingOpen(true);
  };

  const handleOpenAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-cream-white flex flex-col antialiased">
      <Topbar />
      
      <Navbar
        onNavClick={handleScrollToSection}
        onOpenBooking={handleOpenBooking}
        onOpenAI={() => setAiOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      <main className="flex-grow">
        <Hero 
          onOpenBooking={handleOpenBooking} 
          onScrollToSection={handleScrollToSection} 
        />

        <QuickActions
          onOpenBooking={handleOpenBooking}
          onOpenTestLookup={() => setTestOpen(true)}
          onOpenAI={() => setAiOpen(true)}
          onScrollToDoctors={() => handleScrollToSection("bac-si")}
        />

        <Specialties />
        <WhyChooseUs />
        <Organization />
        <Doctors onOpenBookingWithDoctor={handleOpenBookingWithDoctor} />
        <Testimonials />
        <News />
        <CTABanner onOpenBooking={handleOpenBooking} />
      </main>

      <Footer onScrollToSection={handleScrollToSection} onOpenAdmin={handleOpenAdmin} />

      <BookingForm
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        prepopulatedDoctor={prepopulatedDoctor}
        prepopulatedSpecialtyId={prepopulatedSpecialtyId}
      />

      <AIAdvisor
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onOpenBooking={handleOpenBooking}
      />

      <TestLookup
        isOpen={testOpen}
        onClose={() => setTestOpen(false)}
      />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3 shrink-0 select-none">
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