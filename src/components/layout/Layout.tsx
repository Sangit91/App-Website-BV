import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BookingForm from "../booking/BookingForm";
import AIAdvisor from "../ai/AIAdvisor";
import TestLookup from "../test-lookup/TestLookup";
import { Sparkles, Calendar, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import PageTransition from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [prepopulatedDoctor, setPrepopulatedDoctor] = useState("");
  const [prepopulatedSpecialtyId, setPrepopulatedSpecialtyId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenBooking = () => {
      setPrepopulatedDoctor("");
      setPrepopulatedSpecialtyId("");
      setBookingOpen(true);
    };

    const handleOpenBookingWithDoctor = (e: CustomEvent) => {
      setPrepopulatedDoctor(e.detail.doctorName);
      setPrepopulatedSpecialtyId(e.detail.specialtyId);
      setBookingOpen(true);
    };

    const handleOpenTestLookup = () => {
      setTestOpen(true);
    };

    const handleOpenAI = () => {
      setAiOpen(true);
    };

    window.addEventListener("bvdk:open-booking", handleOpenBooking);
    window.addEventListener("bvdk:open-booking-with-doctor", handleOpenBookingWithDoctor as EventListener);
    window.addEventListener("bvdk:open-test-lookup", handleOpenTestLookup);
    window.addEventListener("bvdk:open-ai", handleOpenAI);

    return () => {
      window.removeEventListener("bvdk:open-booking", handleOpenBooking);
      window.removeEventListener("bvdk:open-booking-with-doctor", handleOpenBookingWithDoctor as EventListener);
      window.removeEventListener("bvdk:open-test-lookup", handleOpenTestLookup);
      window.removeEventListener("bvdk:open-ai", handleOpenAI);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenBooking = () => {
    setPrepopulatedDoctor("");
    setPrepopulatedSpecialtyId("");
    setBookingOpen(true);
  };

  const handleOpenAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-cream-white flex flex-col antialiased">
      <Topbar />

      <Navbar
        onNavClick={(id) => {
          if (id.startsWith("/")) {
            if (id.includes("#")) {
              const [path, hash] = id.split("#");
              navigate(path);
              window.location.hash = hash;
            } else {
              navigate(id);
            }
          } else {
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        }}
        onOpenBooking={handleOpenBooking}
        onOpenAI={() => setAiOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      <main className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer onScrollToSection={(id) => {
        if (id.startsWith("/")) {
          if (id.includes("#")) {
            const [path, hash] = id.split("#");
            navigate(path);
            window.location.hash = hash;
          } else {
            navigate(id);
          }
        } else {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }} onOpenAdmin={handleOpenAdmin} />

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

        {showBackToTop && (
          <button
            onClick={scrollToTop}
            title=" Quay lại đầu trang"
            className="w-13 h-13 rounded-full bg-white hover:bg-mint border-2 border-brand-green/30 hover:border-brand-green text-brand-green hover:text-brand-green/90 flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer group relative"
          >
            <ArrowUp size={22} />
            <span className="absolute right-14 bg-green-dark text-mint text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow border border-brand-green/20">
              Quay lại đầu trang
            </span>
          </button>
        )}
      </div>
    </div>
  );
}