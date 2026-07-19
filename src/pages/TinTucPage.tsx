import { useRef } from "react";
import Layout from "../components/layout/Layout";
import News from "../components/public/News";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Newspaper, FileText, Users, Shield } from "lucide-react";
import { useState, useEffect } from "react";

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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

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

      <News />
    </Layout>
  );
}