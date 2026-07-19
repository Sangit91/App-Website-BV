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
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Tin tá»©c & Sá»± kiá»‡n</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cáº­p nháº­t tin tá»©c y khoa, sá»± kiá»‡n bá»‡nh viá»‡n vÃ  thÃ´ng tin tuyá»ƒn dá»¥ng
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
                    src="/images/pages/tainha-1.jpeg"
                    alt="Tin tuyá»ƒn dá»¥ng"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-brand-green w-5 h-5" />
                    <span className="text-sm text-ink/60">NhÃ¢n sá»±</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-green-dark mb-4">Tin tuyá»ƒn dá»¥ng</h3>
                  <p className="text-ink/70 mb-4">Cáº­p nháº­t thÃ´ng tin tuyá»ƒn dá»¥ng nhÃ¢n sá»± má»›i nháº¥t</p>
                  <button className="px-4 py-2 bg-brand-green text-white rounded-full text-sm font-semibold hover:bg-brand-green/90 transition-colors">
                    Xem tin tuyá»ƒn dá»¥ng
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
                    src="/images/pages/bhyt-1.jpeg"
                    alt="ThÃ´ng tin Ä‘áº¥u tháº§u"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="text-brand-green w-5 h-5" />
                    <span className="text-sm text-ink/60">Äáº¥u tháº§u</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-green-dark mb-4">ThÃ´ng tin Ä‘áº¥u tháº§u</h3>
                  <p className="text-ink/70 mb-4">ThÃ´ng tin vá» Ä‘áº¥u tháº§u vÃ  mua sáº¯m cÃ´ng</p>
                  <span className="inline-block px-4 py-2 bg-brand-green text-white rounded-full text-sm font-semibold hover:bg-brand-green/90 transition-colors">
                    Xem chi tiáº¿t
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