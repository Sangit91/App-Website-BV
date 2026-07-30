import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../components/layout/Layout";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { FloatingShape } from "../hooks/FloatingShape";
import { AnimatedCounter } from "../hooks/AnimatedCounter";
import { Phone, MapPin, Mail, Clock, Send, CheckCircle, Building2, Ambulance, Shield } from "lucide-react";

const stats = [
  { value: 15, label: "Năm phục vụ", suffix: "+", icon: Shield },
  { value: 50, label: "Bác sĩ", suffix: "+", icon: Building2 },
  { value: 100, label: "Giường bệnh", suffix: "+", icon: Ambulance },
  { value: 24, label: "Cấp cứu", suffix: "/7", icon: Clock },
];

export default function LienHePage() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", message: ""
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

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <Layout>
      {/* Parallax Hero */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={reducedMotion ? {} : { opacity: heroOpacity, scale: heroScale }}>
          <img
            src="/images/pages/hero-lienhe.jpeg"
            alt="Bệnh viện Đa khoa Quảng Nam"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-dark/90 via-green-800/80 to-brand-green/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,162,101,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,157,0.1),transparent_50%)]" />
        </motion.div>

        <div className="absolute inset-0 z-0 overflow-hidden">
          <FloatingShape className="w-72 h-72 bg-white/5" delay={0} />
          <FloatingShape className="w-56 h-56 bg-peach/5" delay={2} />
          <FloatingShape className="w-40 h-40 bg-white/4" delay={4} />
          <FloatingShape className="w-48 h-48 bg-brand-green/5" delay={1} />
        </div>

        <div className="relative z-10 max-w-[1180px] mx-auto px-4 text-center">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold mb-6">
              <MapPin size={14} />
              <span>107 Quang Trung, Đại Lộc, Đà Nẵng</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 drop-shadow-lg">
              Liên Hệ
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg">
              Thông tin liên hệ và địa chỉ của Bệnh viện Đa khoa khu vực Miền Núi Phía Bắc Quảng Nam
            </p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <stat.icon className="w-5 h-5 text-peach mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-display font-bold text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[11px] text-white/70 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          animate={reducedMotion ? { opacity: 0 } : { opacity: 0.6, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 rounded-full bg-white/60 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1180px] mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            {/* Contact Info Card */}
            <motion.div variants={fadeUp}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img src="/images/pages/coso-1.jpeg" alt="Bệnh viện mặt tiền" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-dark/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="text-white font-display font-bold text-lg drop-shadow-lg">Bệnh viện Đa khoa Quảng Nam</span>
                  </div>
                </div>
                <div className="p-8">
                  <h2 className="font-display font-bold text-xl text-green-dark mb-6">Thông tin liên hệ</h2>
                  <div className="space-y-5">
                    {[
                      { icon: MapPin, title: "Địa chỉ", content: "107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng" },
                      { icon: Phone, title: "Điện thoại", content: <>Cấp cứu: <a href="tel:02353747432" className="text-brand-green font-semibold">02353.747.432</a><br />Hotline: <a href="tel:02353747433" className="text-brand-green font-semibold">02353.747.433</a></> },
                      { icon: Mail, title: "Email", content: "benhvien@bvqnam.vn" },
                      { icon: Clock, title: "Giờ làm việc", content: <>Thứ 2 - Thứ 6: 7:00 - 17:00<br />Cấp cứu: 24/7</> },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center shrink-0">
                          <item.icon className="w-6 h-6 text-brand-green" />
                        </div>
                        <div className="pt-1">
                          <h3 className="font-semibold text-ink text-sm">{item.title}</h3>
                          <p className="text-gray-600 text-sm mt-0.5">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form Card */}
            <motion.div variants={fadeUp}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-40 overflow-hidden">
                  <img src="/images/pages/coso-2.jpeg" alt="Bệnh viện" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-green/60 to-green-dark/80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Send className="w-8 h-8 text-white/80 mx-auto mb-2" />
                      <h2 className="font-display font-bold text-xl text-white">Gửi liên hệ</h2>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  {isSubmitted ? (
                    <motion.div
                      initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-brand-green" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-green-dark mb-2">Gửi liên hệ thành công!</h3>
                      <p className="text-gray-600 mb-6">Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                      <button onClick={() => setIsSubmitted(false)} className="text-brand-green font-semibold hover:text-brand-green/80 cursor-pointer">
                        Gửi liên hệ khác
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {(["name", "email", "phone"] as const).map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field === "name" ? "Họ và tên" : field === "email" ? "Email" : "Số điện thoại"}
                          </label>
                          <input
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent bg-gray-50/50"
                            placeholder={`Nhập ${field === "name" ? "họ và tên" : field === "email" ? "email" : "số điện thoại"}`}
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} required rows={4}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent bg-gray-50/50 resize-none"
                          placeholder="Nhập nội dung liên hệ"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={reducedMotion ? {} : { scale: 1.01 }}
                        whileTap={reducedMotion ? {} : { scale: 0.98 }}
                        className="w-full py-3.5 bg-gradient-to-r from-brand-green to-green-dark text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-md"
                      >
                        {isSubmitting ? (
                          <><span className="animate-spin"><Send size={18} /></span> Đang gửi...</>
                        ) : (
                          <><Send size={18} /> Gửi liên hệ</>
                        )}
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <div className="p-6 md:p-8">
                <h2 className="font-display font-bold text-xl text-green-dark mb-1">Bản đồ vị trí</h2>
                <p className="text-gray-500 text-sm mb-4">Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam</p>
              </div>
              <div className="relative h-72 md:h-96">
                <img src="/images/pages/coso-2.jpeg" alt="Bản đồ toàn khu vực" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-dark/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
