import { useState, ChangeEvent, FormEvent } from "react";
import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import { Phone, MapPin, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function LienHePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };
  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Liên hệ</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Thông tin liên hệ và địa chỉ của Bệnh viện Đa khoa khu vực Miền Núi Phía Bắc Quảng Nam
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollAnimation animation="slide-right">
              <div className="bg-white border border-green-800/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <img
                  src="/images/pages/coso-1.jpeg"
                  alt="Bệnh viện mặt tiền"
                  className="w-full h-56 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-8">
                  <h2 className="font-display font-bold text-xl text-green-dark mb-6">Thông tin liên hệ</h2>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-brand-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink mb-1">Địa chỉ</h3>
                        <p className="text-gray-600">107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-brand-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ink mb-1">Điện thoại</h3>
                        <p className="text-gray-600">Cấp cứu: <a href="tel:02353747432" className="text-brand-green font-semibold">02353.747.432</a></p>
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
                        <h3 className="font-semibold text-ink mb-1">Giờ làm việc</h3>
                        <p className="text-gray-600">Thứ 2 - Thứ 6: 7:00 - 17:00</p>
                        <p className="text-gray-600">Cấp cứu: 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="slide-left">
              <div className="bg-white border border-green-800/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-mint/30">
                  <img
                    src="/images/pages/coso-2.jpeg"
                    alt="Bản đồ bệnh viện"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <h2 className="font-display font-bold text-xl text-green-dark mb-6">Gửi liên hệ</h2>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-brand-green" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-green-dark mb-2">Gửi liên hệ thành công!</h3>
                      <p className="text-gray-600 mb-6">Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-brand-green font-semibold hover:text-brand-green/80"
                      >
                        Gửi liên hệ khác
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          placeholder="Nhập email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          placeholder="Nhập nội dung liên hệ"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green/90 transition-colors flex items-center justify-center gap-2 disabled:bg-brand-green/60 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin">
                              <Send size={18} />
                            </span>
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Gửi liên hệ
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </ScrollAnimation>
          </div>

          <ScrollAnimation animation="fade-up" className="mt-12">
            <div className="bg-white border border-green-800/5 rounded-2xl p-8 shadow-sm">
              <h2 className="font-display font-bold text-xl text-green-dark mb-4 text-center">Bản đồ vị trí</h2>
              <div className="bg-mint/30 rounded-xl overflow-hidden h-64 flex items-center justify-center">
                <img
                  src="/images/pages/coso-2.jpeg"
                  alt="Bản đồ toàn khu vực"
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