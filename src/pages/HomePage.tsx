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
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <Layout>
      <Hero
        onOpenBooking={() => {}}
        onScrollToSection={() => {}}
      />

      <QuickActions
        onOpenBooking={() => {}}
        onOpenTestLookup={() => {}}
        onOpenAI={() => {}}
        onScrollToDoctors={() => {}}
      />

      <Specialties />

      <WhyChooseUs />

      <Organization />

      <Doctors onOpenBookingWithDoctor={() => {}} />

      <Testimonials />

      <News />

      <CTABanner onOpenBooking={() => {}} />

      <section className="py-12 bg-mint/30">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-green-dark mb-2">Khám phá thêm</h2>
            <p className="text-gray-600">Tìm hiểu chi tiết hơn về Bệnh viện</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/gioi-thieu"
              className="flex items-center justify-center gap-2 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-brand-green font-semibold"
            >
              <span>Giới thiệu</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/chuyen-khoa"
              className="flex items-center justify-center gap-2 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-brand-green font-semibold"
            >
              <span>Chuyên khoa</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/dich-vu"
              className="flex items-center justify-center gap-2 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-brand-green font-semibold"
            >
              <span>Dịch vụ</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/tin-tuc"
              className="flex items-center justify-center gap-2 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all text-brand-green font-semibold"
            >
              <span>Tin tức</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}