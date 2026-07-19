import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import { Phone, MapPin, Mail, Clock, Send } from "lucide-react";

export default function LienHePage() {
  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">LiÃªn há»‡</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ThÃ´ng tin liÃªn há»‡ vÃ  Ä‘á»‹a chá»‰ cá»§a Bá»‡nh viá»‡n Äa khoa khu vá»±c Miá»n NÃºi PhÃ­a Báº¯c Quáº£ng Nam
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollAnimation animation="slide-right">
              <div className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/pages/hero-lienhe.jpeg"
                  alt="Bá»‡nh viá»‡n máº·t tiá»n"
                  className="w-full h-56 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-8">
                  <h2 className="font-display font-bold text-xl text-green-dark mb-6">ThÃ´ng tin liÃªn há»‡</h2>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-brand-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink mb-1">Äá»‹a chá»‰</h3>
                        <p className="text-gray-600">123 ÄÆ°á»ng XYZ, PhÆ°á»ng ABC, TP. Quáº£ng Nam</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-brand-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink mb-1">Äiá»‡n thoáº¡i</h3>
                        <p className="text-gray-600">Cáº¥p cá»©u: <a href="tel:02353747432" className="text-brand-green font-semibold">02353.747.432</a></p>
                        <p className="text-gray-600">Hotline: <a href="tel:02353747433" className="text-brand-green font-semibold">02353.747.433</a></p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center shrink-0">
                        <Mail className="w-6 h-6 text-brand-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink mb-1">Email</h3>
                        <p className="text-gray-600">benhvien@bvqnam.vn</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-brand-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink mb-1">Giá» lÃ m viá»‡c</h3>
                        <p className="text-gray-600">Thá»© 2 - Thá»© 6: 7:00 - 17:00</p>
                        <p className="text-gray-600">Cáº¥p cá»©u: 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="slide-left">
              <div className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-mint/30">
                  <img
                    src="/images/pages/hero-gioithieu.jpeg"
                    alt="Báº£n Ä‘á»“ bá»‡nh viá»‡n"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <h2 className="font-display font-bold text-xl text-green-dark mb-6">Gá»­i liÃªn há»‡</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Há» vÃ  tÃªn</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                        placeholder="Nháº­p há» vÃ  tÃªn"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                        placeholder="Nháº­p email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sá»‘ Ä‘iá»‡n thoáº¡i</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                        placeholder="Nháº­p sá»‘ Ä‘iá»‡n thoáº¡i"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ná»™i dung</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                        placeholder="Nháº­p ná»™i dung liÃªn há»‡"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      Gá»­i liÃªn há»‡
                    </button>
                  </form>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          <ScrollAnimation animation="fade-up" className="mt-12">
            <div className="bg-white border border-green-800/[0.04] rounded-[20px] p-8 shadow-sm">
              <h2 className="font-display font-bold text-xl text-green-dark mb-4 text-center">Báº£n Ä‘á»“ vá»‹ trÃ­</h2>
              <div className="bg-mint/30 rounded-xl overflow-hidden h-64 flex items-center justify-center">
                <img
                  src="/images/pages/hero-gioithieu.jpeg"
                  alt="Báº£n Ä‘á»“ toÃ n khu vá»±c"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
}