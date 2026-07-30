import { useState, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin, decodeAdminToken } from "../../context/AdminContext";
import {
  ArrowLeft, ShieldCheck, Building2, Stethoscope, Eye, EyeOff,
  AlertCircle, CheckCircle, Loader2
} from "lucide-react";
import { FloatingShape } from "../../hooks/FloatingShape";
import { useReducedMotion } from "../../hooks/useReducedMotion";

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
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
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

  const spotlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.targetX = e.clientX - 150;
      mousePos.current.targetY = e.clientY - 150;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.15;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.15;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0px)`;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [reducedMotion]);

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

      const store = rememberMe ? localStorage : sessionStorage;
      store.setItem("admin_token", data.accessToken);
      if (data.refreshToken) store.setItem("admin_refresh_token", data.refreshToken);

      login(adminUser, data.accessToken, data.refreshToken);
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/admin", { replace: true });
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
      style={{ background: "linear-gradient(145deg, #030A07 0%, #0A1F14 50%, #030A07 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-20 mix-blend-luminosity"
        style={{
          backgroundImage: `url('/images/doctors/1.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(60%) contrast(1.1)"
        }}
      />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 157, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 157, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px"
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 255, 157, 0.35) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(130px)"
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 162, 101, 0.25) 0%, transparent 70%)",
          top: "15%",
          right: "10%",
          filter: "blur(130px)"
        }}
      />

      {!reducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          <FloatingShape className="w-72 h-72 bg-brand-green/8" delay={0} />
          <FloatingShape className="w-56 h-56 bg-peach/4" delay={2} />
          <FloatingShape className="w-40 h-40 bg-brand-green/5" delay={4} />
          <FloatingShape className="w-48 h-48 bg-mint/4" delay={1} />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden contain-strict z-0">
        <svg
          className="absolute w-full h-full opacity-20 will-change-transform"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FF9D" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2FA968" stopOpacity="1" />
              <stop offset="100%" stopColor="#00FF9D" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          <path
            d="M-50,450 C100,380 200,520 350,480 C500,440 550,380 700,420 C850,460 900,520 1050,480 C1200,440 1300,380 1500,420"
            fill="none"
            stroke="url(#waveGradient1)"
            strokeWidth="1.5"
            style={{ animation: "waveFloat1 8s ease-in-out infinite" }}
          />
          <path
            d="M-50,500 C80,440 180,580 320,530 C460,480 520,420 680,460 C840,500 920,560 1080,510 C1240,460 1340,400 1500,450"
            fill="none"
            stroke="url(#waveGradient1)"
            strokeWidth="1.5"
            style={{ animation: "waveFloat2 10s ease-in-out infinite 1s" }}
          />
          <path
            d="M-50,400 C120,320 250,480 400,420 C550,360 620,300 780,350 C940,400 1000,460 1160,410 C1320,360 1380,300 1500,360"
            fill="none"
            stroke="url(#waveGradient1)"
            strokeWidth="1.5"
            style={{ animation: "waveFloat3 12s ease-in-out infinite 2s" }}
          />
        </svg>
      </div>

      <div
        ref={spotlightRef}
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(0, 255, 157, 0.08) 0%, transparent 70%)",
          border: "1px solid rgba(0, 255, 157, 0.15)",
          boxShadow: "0 0 60px rgba(0, 255, 157, 0.1)"
        }}
      />

      <div
        className="absolute top-20 left-8 z-20"
        style={{ animation: reducedMotion ? "none" : "floatBadge 6s ease-in-out infinite" }}
      >
        <div className="px-5 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full bg-[#00FF9D]"
              style={{
                boxShadow: "0 0 8px #00FF9D, 0 0 16px #00FF9D",
                animation: reducedMotion ? "none" : "neonPulse 2s ease-in-out infinite"
              }}
            />
            <span className="text-white/90 text-xs font-semibold tracking-wide whitespace-nowrap">
              50+ Bác sĩ Chuyên khoa
            </span>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-24 right-8 z-20"
        style={{ animation: reducedMotion ? "none" : "floatBadge 6s ease-in-out infinite 3s" }}
      >
        <div className="px-5 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full bg-[#FFA265]"
              style={{
                boxShadow: "0 0 8px #FFA265, 0 0 16px #FFA265",
                animation: reducedMotion ? "none" : "neonPulse 2s ease-in-out infinite 0.5s"
              }}
            />
            <span className="text-white/90 text-xs font-semibold tracking-wide whitespace-nowrap">
              Bệnh viện Thông minh Cấp độ 3
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-[12px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #2FA968 0%, #164B36 100%)",
                boxShadow: "0 4px 20px rgba(47, 169, 104, 0.4), 0 0 40px rgba(47, 169, 104, 0.2)"
              }}
            >
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white/90 font-display font-semibold text-sm tracking-wide">
                Bệnh Viện Đa Khoa KV Miền Núi Phía Bắc Quảng Nam
              </h1>
              <p className="text-white/40 text-[10px] font-medium">Cổng Quản trị Nội bộ</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#EAF7EE] text-xs font-mono font-medium tracking-wider"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {currentTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/15 text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white hover:border-white/25 transition-all cursor-pointer"
            >
              Hướng dẫn
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
          >
          <motion.div
            variants={cardVariants}
            animate={isShake ? "shake" : "idle"}
            className="w-full max-w-[460px] bg-white/90 backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 border border-white/80 ring-2 ring-[#00FF9D]/30"
            style={{
              boxShadow: "0 20px 80px rgba(0, 255, 157, 0.15), 0 8px 32px rgba(0, 255, 157, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
            }}
          >
              <div className="text-center mb-7">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <img src="/images/logo/Logo_bqn.png" alt="BVĐK Quảng Nam" className="w-full h-full object-contain" />
                  <div
                    className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-[#00FF9D]"
                    style={{
                      boxShadow: "0 0 8px #00FF9D, 0 0 16px #00FF9D",
                      animation: reducedMotion ? "none" : "pulse 2s ease-in-out infinite"
                    }}
                  />
                </div>
                <h2 className="font-display font-bold text-2xl text-[#164B36] mb-1">
                  Đăng nhập hệ thống
                </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF7EE] text-[#164B36] text-xs font-semibold">
                <span>Cổng quản trị nội bộ</span>
                <span className="w-1 h-1 rounded-full bg-[#2FA968]" />
                <span>Chuẩn ATTT Cấp độ 3</span>
              </div>
            </div>

            <div className="relative flex p-1.5 bg-[#EAF7EE]/80 backdrop-blur-md rounded-[22px] mb-6 border border-[#2FA968]/15">
              {scopeTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedScope(tab.id)}
                  className="relative flex-1 py-2.5 text-xs font-semibold z-10 transition-colors duration-200 cursor-pointer"
                >
                  {selectedScope === tab.id && (
                    <motion.div
                      layoutId="activeLuxuryPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#2FA968] to-[#164B36] rounded-[18px]"
                      style={{
                        boxShadow: "0 4px 16px rgba(47, 169, 104, 0.35)"
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-20 flex items-center justify-center gap-1.5 ${
                    selectedScope === tab.id ? "text-white" : "text-[#22302A]"
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
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="mb-5 p-3.5 rounded-xl bg-red-50/90 backdrop-blur-sm border border-red-200/60 flex items-center gap-2.5 text-red-600 text-xs"
                >
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mb-5 p-3.5 rounded-xl bg-green-50/90 backdrop-blur-sm border border-green-200/60 flex items-center gap-2.5 text-green-600 text-xs"
                >
                  <CheckCircle size={15} className="shrink-0" />
                  <span>Đăng nhập thành công! Đang chuyển hướng...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#164B36] uppercase tracking-wider mb-2">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2FA968] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FCFBF7] border border-[#2FA968]/20 rounded-[18px] text-sm text-[#164B36] placeholder:text-[#22302A]/40 focus:outline-none focus:ring-2 focus:ring-[#2FA968]/30 focus:border-[#2FA968]/50 transition-all"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#164B36] uppercase tracking-wider mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2FA968] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-11 pr-12 py-3.5 bg-[#FCFBF7] border border-[#2FA968]/20 rounded-[18px] text-sm text-[#164B36] placeholder:text-[#22302A]/40 focus:outline-none focus:ring-2 focus:ring-[#2FA968]/30 focus:border-[#2FA968]/50 transition-all"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22302A]/40 hover:text-[#2FA968] transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-[#2FA968]/30 text-[#2FA968] focus:ring-[#2FA968]/30 focus:ring-offset-0 cursor-pointer bg-white"
                  />
                  <span className="text-xs text-[#22302A]/70 font-medium">Ghi nhớ đăng nhập</span>
                </label>
                <a
                  href="#"
                  className="text-xs text-[#FFA265] font-semibold hover:underline hover:text-[#FFA265]/80 transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="relative overflow-hidden w-full py-4 rounded-full bg-gradient-to-r from-[#2FA968] via-[#239056] to-[#164B36] text-white font-bold text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] group"
                style={{
                  boxShadow: "0 10px 30px rgba(47, 169, 104, 0.35), 0 4px 12px rgba(47, 169, 104, 0.25)"
                }}
              >
                <div
                  className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out"
                  style={{ opacity: reducedMotion ? 0 : 1 }}
                />

                {isLoading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <Loader2 size={18} className="animate-spin" />
                    Đang xác thực...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <CheckCircle size={18} />
                    Đăng nhập thành công
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Xác nhận danh tính
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className="text-center pt-6 mt-6 border-t border-[#22302A]/[0.08]">
              <button
                type="button"
                onClick={onBackToHome}
                className="text-xs text-[#2FA968] font-semibold hover:underline cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} />
                Quay lại Cổng thông tin cho Bệnh nhân
              </button>
            </div>
          </motion.div>
          </motion.div>
        </main>

        <footer className="flex items-center justify-between px-8 py-5 text-[11px] text-white/40">
          <div>© 2026 Bệnh viện Đa khoa Quảng Nam • Phiên bản 2.11</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full bg-[#00FF9D]"
                style={{
                  boxShadow: "0 0 6px #00FF9D",
                  animation: reducedMotion ? "none" : "pulse 2.5s ease-in-out infinite"
                }}
              />
              <span className="text-white/50 font-medium">SYSTEM ONLINE</span>
            </div>
          </div>
          <div
            className="px-3 py-1 rounded-full bg-[#0A241A]/90 border border-[#2FA968]/40 text-[#2FA968] font-semibold"
          >
            ● ATTT Cấp độ 3 Active
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes neonPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px currentColor, 0 0 16px currentColor; }
          50% { opacity: 0.6; box-shadow: 0 0 4px currentColor, 0 0 8px currentColor; }
        }
        @keyframes waveFloat1 {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-30px) translateY(-10px); }
        }
        @keyframes waveFloat2 {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(20px) translateY(8px); }
        }
        @keyframes waveFloat3 {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-15px) translateY(-5px); }
        }
      `}</style>
    </div>
  );
}