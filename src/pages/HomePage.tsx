import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Hero from "../components/public/Hero";
import QuickActions from "../components/public/QuickActions";
import Specialties from "../components/public/Specialties";
import WhyChooseUs from "../components/public/WhyChooseUs";
import Organization from "../components/public/Organization";
import Doctors from "../components/public/Doctors";
import Testimonials from "../components/public/Testimonials";
import News from "../components/public/News";
import CTABanner from "../components/public/CTABanner";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const handleOpenBooking = () => {
    window.dispatchEvent(new CustomEvent("bvdk:open-booking"));
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenTestLookup = () => {
    window.dispatchEvent(new CustomEvent("bvdk:open-test-lookup"));
  };

  const handleOpenAI = () => {
    window.dispatchEvent(new CustomEvent("bvdk:open-ai"));
  };

  const handleScrollToDoctors = () => {
    const el = document.getElementById("bac-si");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenBookingWithDoctor = (doctorName: string, specialtyId: string) => {
    window.dispatchEvent(new CustomEvent("bvdk:open-booking-with-doctor", {
      detail: { doctorName, specialtyId }
    }));
  };

  return (
    <Layout>
      <Hero
        onOpenBooking={handleOpenBooking}
        onScrollToSection={handleScrollToSection}
      />

      <QuickActions
        onOpenBooking={handleOpenBooking}
        onOpenTestLookup={handleOpenTestLookup}
        onOpenAI={handleOpenAI}
        onScrollToDoctors={handleScrollToDoctors}
      />

      <Specialties />

      <WhyChooseUs />

      <Organization />

      <Doctors onOpenBookingWithDoctor={handleOpenBookingWithDoctor} />

      <Testimonials />

      <News />

      <CTABanner onOpenBooking={handleOpenBooking} />

      <section className="py-12 bg-mint/30">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up" className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-green-dark mb-2">Khám phá thêm</h2>
            <p className="text-gray-600">Tìm hiểu chi tiết hơn về Bệnh viện</p>
          </ScrollAnimation>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScrollAnimation animation="fade-up" delay={0.05}>
              <Link
                to="/gioi-thieu"
                className="flex items-center justify-center gap-2 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-brand-green font-semibold w-full"
              >
                <span>Giới thiệu</span>
                <ArrowRight size={16} />
              </Link>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.1}>
              <Link
                to="/chuyen-khoa"
                className="flex items-center justify-center gap-2 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-brand-green font-semibold w-full"
              >
                <span>Chuyên khoa</span>
                <ArrowRight size={16} />
              </Link>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.15}>
              <Link
                to="/dich-vu"
                className="flex items-center justify-center gap-2 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-brand-green font-semibold w-full"
              >
                <span>Dịch vụ</span>
                <ArrowRight size={16} />
              </Link>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.2}>
              <Link
                to="/tin-tuc"
                className="flex items-center justify-center gap-2 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-brand-green font-semibold w-full"
              >
                <span>Tin tức</span>
                <ArrowRight size={16} />
              </Link>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </Layout>
  );
}