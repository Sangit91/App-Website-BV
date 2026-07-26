import { useState, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin, decodeAdminToken } from "../../context/AdminContext";
import {
  ArrowLeft, ShieldCheck, Building2, Stethoscope, Eye, EyeOff,
  AlertCircle, CheckCircle, Loader2, Activity
} from "lucide-react";
import { FloatingShape } from "../../hooks/FloatingShape";

interface AdminLoginProps {
  onBackToHome: () => void;
}

type ScopeId = "admin" | "reception" | "doctor";

const scopeTabs = [
  { id: "admin" as ScopeId, label: "Quản trị", icon: ShieldCheck },
  { id: "reception" as ScopeId, label: "Lễ tân", icon: Building2 },
  { id: "doctor" as ScopeId, label: "Bác sĩ", icon: Stethoscope }
];

export default function AdminLogin({ onBackToHome }: AdminLoginProps) {
  const { login } = useAdmin();
  const [selectedScope, setSelectedScope] = useState<ScopeId>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShake, setIsShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const mousePos = useRef({ x: 0, y: 0 });
  const spotlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${e.clientX - 150}px`;
        spotlightRef.current.style.top = `${e.clientY - 150}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Vui lòng nhập tên đăng nhập và mật khẩu");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/v1/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          preferredScope: selectedScope
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Tên đăng nhập hoặc mật khẩu không đúng");
        triggerShake();
        return;
      }

      const adminUser = decodeAdminToken(data.accessToken);
      if (!adminUser) {
        setErrorMessage("Lỗi xác thực. Vui lòng thử lại.");
        triggerShake();
        return;
      }

      if (rememberMe) {
        localStorage.setItem("admin_token", data.accessToken);
      } else {
        sessionStorage.setItem("admin_token", data.accessToken);
      }

      login(adminUser, data.accessToken);
      setIsSuccess(true);

      setTimeout(() => {
        window.location.href = "/admin";
      }, 800);

    } catch {
      setErrorMessage("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const triggerShake = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 500);
  };

  const cardVariants = {
    shake: {
      x: [-10, 10, -8, 8, -4, 4, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #08140E 0%, #0F2218 50%, #08140E 100%)" }}
    >
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: `
          linear-gradient(rgba(47, 169, 104, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(47, 169, 104, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px"
      }} />

      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 255, 157, 0.15) 0%, transparent 70%)",
          top: "-100px",
          left: "-100px",
          filter: "blur(60px)"
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 162, 101, 0.1) 0%, transparent 70%)",
          bottom: "10%",
          right: "-50px",
          filter: "blur(60px)"
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <FloatingShape className="w-64 h-64 bg-brand-green/10" delay={0} />
        <FloatingShape className="w-48 h-48 bg-peach/5" delay={2} />
        <FloatingShape className="w-32 h-32 bg-brand-green/5" delay={4} />
        <FloatingShape className="w-40 h-40 bg-mint/5" delay={1} />
      </div>

      <div
        ref={spotlightRef}
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          border: "2px solid rgba(47, 169, 104, 0.2)",
          boxShadow: "0 0 60px rgba(47, 169, 104, 0.15), inset 0 0 60px rgba(47, 169, 104, 0.05)",
          opacity: 0.6
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-brand-green flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white font-display font-semibold text-sm tracking-wide">
                Bệnh Viện Đa Khoa KV Miền Núi Phía Bắc Quảng Nam
              </h1>
              <p className="text-white/50 text-[10px] font-medium">Cổng Quản trị Nội bộ</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-white/60 text-xs font-medium">
              {currentTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Hướng dẫn
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            variants={cardVariants}
            animate={isShake ? "shake" : "idle"}
            className="w-full max-w-[460px] bg-white/95 backdrop-blur-xl rounded-[28px] p-8 sm:p-10 shadow-2xl border border-brand-green/20"
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green-dark to-brand-green flex items-center justify-center mb-4 shadow-lg">
                <ShieldCheck className="text-white w-7 h-7" />
              </div>
              <h2 className="font-display font-bold text-xl text-green-dark">Đăng nhập hệ thống</h2>
              <p className="text-ink/60 text-xs mt-1">Cổng quản trị nội bộ • Chuẩn ATTT Cấp độ 3</p>
            </div>

            <div className="relative flex p-1.5 bg-mint rounded-[20px] mb-6">
              {scopeTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedScope(tab.id)}
                  className="relative flex-1 py-2.5 text-xs font-semibold z-10 transition-colors duration-200 cursor-pointer"
                >
                  {selectedScope === tab.id && (
                    <motion.div
                      layoutId="activeScopePill"
                      className="absolute inset-0 bg-gradient-to-r from-brand-green to-green-dark rounded-[16px] shadow-md"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-20 flex items-center justify-center gap-1.5 ${
                    selectedScope === tab.id ? "text-white" : "text-ink"
                  }`}>
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-xs"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-green-600 text-xs"
                >
                  <CheckCircle size={14} className="shrink-0" />
                  <span>Đăng nhập thành công! Đang chuyển hướng...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-green-dark uppercase tracking-wide mb-1.5">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-green">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    className="w-full pl-10 pr-4 py-3 bg-cream-white border border-green-800/10 rounded-xl text-sm text-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-green-dark uppercase tracking-wide mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-green">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-10 pr-12 py-3 bg-cream-white border border-green-800/10 rounded-xl text-sm text-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-brand-green transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-green-800/20 text-brand-green focus:ring-brand-green cursor-pointer"
                  />
                  <span className="text-xs text-ink/70 font-medium">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-xs text-peach hover:underline font-medium">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-brand-green to-green-dark text-white font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-brand-green/25 active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Đang xác thực...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle size={18} />
                    Đăng nhập thành công
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Xác nhận danh tính
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className="text-center pt-5 mt-5 border-t border-ink/5">
              <button
                type="button"
                onClick={onBackToHome}
                className="text-xs text-brand-green font-medium hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                Quay lại Cổng thông tin cho Bệnh nhân
              </button>
            </div>
          </motion.div>
        </main>

        <footer className="flex items-center justify-between p-6 text-[10px] text-white/50">
          <div>© 2026 Bệnh viện Đa khoa Quảng Nam • Phiên bản 2.11</div>
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-brand-green animate-pulse" />
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-brand-green/40 text-brand-green/80">
              ATTT Cấp độ 3 Active
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}