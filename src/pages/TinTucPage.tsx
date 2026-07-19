import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import News from "../components/public/News";
import { Link } from "react-router-dom";
import { Users, FileText } from "lucide-react";

export default function TinTucPage() {
  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up" className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Tin tức & Sự kiện</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cập nhật tin tức y khoa, sự kiện bệnh viện và thông tin tuyển dụng
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up">
            <News />
          </ScrollAnimation>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollAnimation animation="fade-up" delay={100}>
              <div className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop"
                    alt="Tin tuyển dụng"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-brand-green w-5 h-5" />
                    <span className="text-sm text-ink/60">Nhân sự</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-green-dark mb-4">Tin tuyển dụng</h3>
                  <p className="text-ink/70 mb-4">Cập nhật thông tin tuyển dụng nhân sự mới nhất</p>
                  <button className="px-4 py-2 bg-brand-green text-white rounded-full text-sm font-semibold hover:bg-brand-green/90 transition-colors">
                    Xem tin tuyển dụng
                  </button>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={200}>
              <Link
                to="/thong-tin-thau"
                className="block bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop"
                    alt="Thông tin đấu thầu"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="text-brand-green w-5 h-5" />
                    <span className="text-sm text-ink/60">Đấu thầu</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-green-dark mb-4">Thông tin đấu thầu</h3>
                  <p className="text-ink/70 mb-4">Thông tin về đấu thầu và mua sắm công</p>
                  <span className="inline-block px-4 py-2 bg-brand-green text-white rounded-full text-sm font-semibold hover:bg-brand-green/90 transition-colors">
                    Xem chi tiết
                  </span>
                </div>
              </Link>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </Layout>
  );
}