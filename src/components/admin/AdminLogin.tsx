import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { useAdmin, Role } from "../../context/AdminContext";
import { DEPARTMENTS } from "../../data";
import { ArrowLeft, ShieldAlert, User, ChevronRight, AlertTriangle } from "lucide-react";

interface AdminLoginProps {
  onBackToHome: () => void;
}

export default function AdminLogin({ onBackToHome }: AdminLoginProps) {
  const { login } = useAdmin();
  const [loginRole, setLoginRole] = useState<Role>("Super Admin");
  const [loginDepartment, setLoginDepartment] = useState<string>("PHÒNG CNTT");
  const [loginName, setLoginName] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) {
      setLoginError("Vui lòng nhập tên người dùng để làm việc");
      return;
    }
    login(loginRole, loginName.trim(), loginDepartment);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-cream-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-green-800/10"
      >
        <div className="bg-gradient-to-br from-green-dark to-brand-green p-8 text-center text-white relative">
          <div className="absolute top-4 left-4">
            <button
              onClick={onBackToHome}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
              title="Quay lại Trang chủ"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/20">
            <ShieldAlert className="text-white w-8 h-8 animate-pulse" />
          </div>
          <h1 className="font-display font-bold text-xl uppercase tracking-wider">Cổng Quản Trị Lâm Sàng</h1>
          <p className="text-xs text-mint/80 mt-1">BVĐK KV Miền Núi Phía Bắc Quảng Nam</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {loginError && (
            <div className="bg-peach/10 text-peach text-xs p-3 rounded-xl flex items-center gap-2 border border-peach/20">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
              Vai trò truy cập
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["Super Admin", "Receptionist", "Doctor", "Department Admin"] as Role[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setLoginRole(role)}
                  className={`p-2.5 rounded-xl border text-center transition-all text-xs font-semibold cursor-pointer ${
                    loginRole === role
                      ? "bg-mint text-green-dark border-brand-green ring-2 ring-brand-green/30"
                      : "bg-white text-ink/70 border-ink/10 hover:bg-cream-white"
                  }`}
                >
                  {role === "Super Admin" ? "Admin Tổng" : role === "Receptionist" ? "Lễ Tân" : role === "Doctor" ? "Bác Sĩ" : "Phòng Ban Thầu"}
                </button>
              ))}
            </div>
          </div>

          {loginRole === "Department Admin" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1.5 overflow-hidden"
            >
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                Chọn phòng ban / Khối đấu thầu
              </label>
              <select
                value={loginDepartment}
                onChange={(e) => setLoginDepartment(e.target.value)}
                className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl text-xs font-semibold text-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
              Tên quản trị viên / Bác sĩ trực
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-green" />
              <input
                type="text"
                required
                placeholder="e.g. Lễ tân Hoa, BS. Trí..."
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-white border border-green-800/10 rounded-xl text-sm text-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-brand-green hover:bg-brand-green/90 text-white font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Xác nhận danh tính</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="text-center pt-3 border-t border-ink/5">
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs text-brand-green font-medium hover:underline cursor-pointer"
            >
              Trở lại Cổng thông tin cho Bệnh nhân
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}