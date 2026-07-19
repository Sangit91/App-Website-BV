import { useRef, useState } from "react";
import Layout from "../components/layout/Layout";
import News from "../components/public/News";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Newspaper, FileText, Users, Shield, ArrowRight, Calendar, Heart, Stethoscope, Gavel, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useHospital } from "../context/HospitalContext";

const NEWS_TABS = [
  { key: "benh-vien", title: "Tin tức bệnh viện", icon: Newspaper, color: "from-green-500 to-emerald-600" },
  { key: "y-khoa", title: "Y khoa & Sức khoẻ", icon: Heart, color: "from-rose-500 to-pink-600" },
  { key: "tuyen-dung", title: "Tuyển dụng", icon: Users, color: "from-amber-500 to-orange-600" }
];

const stats = [
  { value: 50, label: "Bài viết", suffix: "+" },
  { value: 12, label: "Chuyên khoa", suffix: "+" },
  { value: 5000, label: "Lượt xem", suffix: "+" },
  { value: 24, label: "Giờ cập nhật" }
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <div ref={ref}>{count}{suffix}</div>;
}

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 ${className}`}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function TinTucPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { news } = useHospital();
  const [activeTab, setActiveTab] = useState("benh-vien");
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const hospitalNews = news.filter(item => !item.isTender && item.tag !== "Tin y học");
  const medicalNews = news.filter(item => item.tag === "Tin y học");

  const currentTabData = NEWS_TABS.find(t => t.key === activeTab)!;

  return (
    <Layout>
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-green-dark via-emerald-800 to-teal-700">
        <div className="absolute inset-0 overflow-hidden">
          <FloatingShape className="w-96 h-96 bg-brand-green -top-20 -left-20" delay={0} />
          <FloatingShape className="w-64 h-64 bg-peach -top-10 right-20" delay={1} />
          <FloatingShape className="w-80 h-80 bg-mint bottom-0 left-1/3" delay={2} />
          <FloatingShape className="w-48 h-48 bg-white/10 top-1/3 right-1/4" delay={3} />
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px"
            }} />
          </div>
        </div>

        <motion.div
          className="relative z-10 max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10 py-20 w-full"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Newspaper className="w-4 h-4" />
              <span>Cập nhật thông tin y khoa</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-display font-bold text-white mb-6"
            >
              <motion.span className="inline-block" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                Tin tức
              </motion.span>
              <motion.span className="inline-block ml-3 text-peach" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                & Sự kiện
              </motion.span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="text-white/80 text-lg max-w-2xl mx-auto mb-12">
              Cập nhật tin tức y khoa, sự kiện bệnh viện và thông tin tuyển dụng
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, idx) => (
                <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/70 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <motion.div className="w-1.5 h-3 bg-white rounded-full" animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      <section className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-800/5 shadow-sm">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <div className="flex overflow-x-auto scrollbar-hide py-4 gap-2">
            {NEWS_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${isActive ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` : "bg-gray-100 text-ink/70 hover:bg-gray-200"}`}>
                  <Icon className="w-5 h-5" />
                  <span>{tab.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

<section className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <AnimatePresence mode="wait">
            {activeTab === "benh-vien" && (
              <motion.div key="benh-vien" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-green-950/5 rounded-3xl overflow-hidden border border-green-800/5">
                    {hospitalNews[0] && (
                      <motion.div className="relative h-80 lg:h-96 overflow-hidden" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
                        <motion.img src={hospitalNews[0].image} alt={hospitalNews[0].title} className="w-full h-full object-cover" referrerPolicy="no-referrer" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <motion.span className="inline-flex bg-brand-green/90 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                            {hospitalNews[0].tag}
                          </motion.span>
                          <motion.h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 line-clamp-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            {hospitalNews[0].title}
                          </motion.h2>
                          <motion.p className="text-white/80 text-sm line-clamp-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                            {hospitalNews[0].summary}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                    <div className="flex flex-col justify-center p-8">
                      <motion.h3 initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-display font-bold text-green-dark mb-4">
                        Tin tức bệnh viện
                      </motion.h3>
                      <motion.p initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-ink/70 leading-relaxed mb-6">
                        Thông tin thông báo, sự kiện và hoạt động của Bệnh viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam. Cập nhật liên tục các thông tin quan trọng dành cho bệnh nhân và người nhà.
                      </motion.p>
                      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
                        {["Thông báo quan trọng", "Sự kiện y khoa", "Hoạt động tình nguyện", "Cập nhật thường xuyên"].map((item, idx) => (
                          <motion.div key={item} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-ink/80 font-medium">{item}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <Link to="/thong-tin-thau" className="block mb-12 group">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative overflow-hidden bg-gradient-to-r from-green-dark via-emerald-700 to-teal-600 rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                          <Gavel className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-2 bg-peach/20 text-peach text-xs font-bold px-3 py-1 rounded-full mb-2">
                            <FileCheck size={12} /> Thông báo
                          </span>
                          <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-1">Thông báo thầu và mua sắm công</h3>
                          <p className="text-white/70 text-sm">Cập nhật thông tin đấu thầu, mua sắm công của Bệnh viện</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-3 rounded-full text-white font-semibold text-sm transition-colors shrink-0">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {hospitalNews.length > 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hospitalNews.slice(1).map((item, idx) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="bg-white border border-green-800/5 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          <div className="absolute top-3 right-3 bg-brand-green/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {item.tag}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-xs text-ink/50 mb-3">
                            <Calendar size={14} className="text-brand-green" />
                            <span>{item.date}</span>
                          </div>
                          <h3 className="font-display font-bold text-lg text-green-dark mb-2 group-hover:text-brand-green transition-colors line-clamp-2">{item.title}</h3>
                          <p className="text-sm text-ink/70 line-clamp-3">{item.summary}</p>
                          <div className="mt-4 pt-4 border-t border-green-800/5 flex items-center justify-between text-sm font-semibold text-brand-green">
                            <span>Xem chi tiết</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : hospitalNews.length === 0 ? (
                  <div className="text-center py-16 text-ink/50">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Chưa có tin tức bệnh viện nào được đăng tải.</p>
                  </div>
                ) : null}
              </motion.div>
            )}

            {activeTab === "y-khoa" && (
              <motion.div key="y-khoa" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-rose-950/5 rounded-3xl overflow-hidden border border-green-800/5">
                    {medicalNews[0] && (
                      <motion.div className="relative h-80 lg:h-96 overflow-hidden" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
                        <motion.img src={medicalNews[0].image} alt={medicalNews[0].title} className="w-full h-full object-cover" referrerPolicy="no-referrer" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <motion.span className="inline-flex bg-rose-500/90 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                            {medicalNews[0].tag}
                          </motion.span>
                          <motion.h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 line-clamp-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            {medicalNews[0].title}
                          </motion.h2>
                          <motion.p className="text-white/80 text-sm line-clamp-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                            {medicalNews[0].summary}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                    <div className="flex flex-col justify-center p-8">
                      <motion.h3 initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-display font-bold text-green-dark mb-4">
                        Y khoa & Sức khoẻ
                      </motion.h3>
                      <motion.p initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-ink/70 leading-relaxed mb-6">
                        Kiến thức y khoa, phòng bệnh và chăm sóc sức khoẻ cho cộng đồng. Chia sẻ những thông tin hữu ích về sức khỏe từ đội ngũ bác sĩ chuyên môn.
                      </motion.p>
                      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
                        {["Phòng bệnh hiệu quả", "Kiến thức y khoa", "Chăm sóc sức khỏe", "Cập nhật liên tục"].map((item, idx) => (
                          <motion.div key={item} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-ink/80 font-medium">{item}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {medicalNews.length > 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medicalNews.slice(1).map((item, idx) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="bg-white border border-green-800/5 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          <div className="absolute top-3 right-3 bg-rose-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {item.tag}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-xs text-ink/50 mb-3">
                            <Stethoscope size={14} className="text-rose-500" />
                            <span>{item.date}</span>
                          </div>
                          <h3 className="font-display font-bold text-lg text-green-dark mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">{item.title}</h3>
                          <p className="text-sm text-ink/70 line-clamp-3">{item.summary}</p>
                          <div className="mt-4 pt-4 border-t border-green-800/5 flex items-center justify-between text-sm font-semibold text-rose-500">
                            <span>Đọc thêm</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : medicalNews.length === 0 ? (
                  <div className="text-center py-16 text-ink/50">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Chưa có bài viết y khoa nào được đăng tải.</p>
                  </div>
                ) : null}
              </motion.div>
            )}

            {activeTab === "tuyen-dung" && (
              <motion.div key="tuyen-dung" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-amber-950/5 rounded-3xl overflow-hidden border border-green-800/5">
                    <motion.div className="relative h-80 lg:h-96 overflow-hidden" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
                      <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                        <Users className="w-24 h-24 text-amber-300" />
                      </div>
                    </motion.div>
                    <div className="flex flex-col justify-center p-8">
                      <motion.h3 initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-display font-bold text-green-dark mb-4">
                        Tuyển dụng
                      </motion.h3>
                      <motion.p initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-ink/70 leading-relaxed mb-6">
                        Cơ hội nghề nghiệp tại Bệnh viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam. Gia nhập đội ngũ y bác sĩ và nhân viên tận tâm.
                      </motion.p>
                      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
                        {["Môi trường làm việc chuyên nghiệp", "Được đào tạo chuyên môn", "Chế độ đãi ngộ hấp dẫn", "Cơ hội thăng tiến"].map((item, idx) => (
                          <motion.div key={item} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-ink/80 font-medium">{item}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white border border-green-800/5 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                      <Users className="w-20 h-20 text-amber-300" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">Nhân sự</span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-green-dark mb-4">Tin tuyển dụng</h3>
                      <p className="text-sm text-ink/70 mb-4">Cập nhật thông tin tuyển dụng nhân sự mới nhất tại bệnh viện</p>
                      <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all">
                        Xem tin tuyển dụng
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white border border-green-800/5 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                      <Shield className="w-20 h-20 text-emerald-300" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Đấu thầu</span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-green-dark mb-4">Thông tin đấu thầu</h3>
                      <p className="text-sm text-ink/70 mb-4">Thông tin về đấu thầu và mua sắm công của bệnh viện</p>
                      <Link to="/thong-tin-thau" className="inline-block px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all">
                        Xem chi tiết
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}