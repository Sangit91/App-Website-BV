import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useHospital } from "../../../context/HospitalContext";
import { Card } from "../../ui";
import { Search, Users, Shield, Phone, Activity, AlertCircle } from "lucide-react";

function maskSensitiveValue(value: string): string {
  if (!value || value.length < 4) return value;
  if (value.length === 9) return value.slice(0, 3) + "-" + "*".repeat(3) + "-" + value.slice(-2);
  if (value.length === 12) return value.slice(0, 3) + "-" + "*".repeat(4) + "-" + "*".repeat(4) + "-" + value.slice(-1);
  if (value.length === 10 && value.startsWith("0")) return value.slice(0, 3) + "-" + "*".repeat(3) + "-" + value.slice(-4);
  const visibleChars = Math.max(2, Math.floor(value.length * 0.2));
  return value.slice(0, visibleChars) + "*".repeat(Math.min(value.length - visibleChars * 2, value.length - 4)) + value.slice(-visibleChars);
}

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: "easeOut" as const }
  })
};

export default function PatientsTab() {
  const { patients } = useHospital();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return patients.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cccd.includes(search) ||
      p.phone.includes(search)
    );
  }, [patients, search]);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green/20 to-green-dark/20 flex items-center justify-center shadow-sm">
            <Users size={18} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-green-dark">Bệnh nhân</h2>
            <p className="text-[11px] text-ink/50">Tra cứu hồ sơ bệnh nhân</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">{filtered.length} bệnh nhân</span>
      </div>

      <Card variant="default" padding="md">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            placeholder="Tra cứu CCCD/BHYT, Số điện thoại hoặc tên bệnh nhân..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-cream-white border border-green-800/10 rounded-[999px] text-xs focus:outline-none focus:ring-2 focus:ring-brand-green text-green-dark font-medium"
          />
        </div>
      </Card>

      <Card variant="default" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white/95 backdrop-blur-sm sticky top-0 z-10">
                <th className="p-3">Mã BN</th>
                <th className="p-3">Họ và Tên</th>
                <th className="p-3">Số CCCD / Thẻ BHYT</th>
                <th className="p-3">Số Điện Thoại</th>
                <th className="p-3">Số Lần Khám</th>
                <th className="p-3">Bảo hiểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((p, i) => (
                <motion.tr key={p.id} custom={i} initial="hidden" animate="visible" variants={rowVariants}
                  className="group hover:bg-cream-white/80 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-brand-green">
                  <td className="p-3 font-mono font-bold text-brand-green">{p.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-brand-green/10 flex items-center justify-center text-[10px] font-bold text-brand-green shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-bold text-green-dark">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-ink/60 font-semibold text-[10px]">{maskSensitiveValue(p.cccd)}</td>
                  <td className="p-3 font-semibold text-ink/70">{maskSensitiveValue(p.phone)}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 bg-mint text-green-dark font-bold py-1 px-3 rounded-full text-[11px] border border-brand-green/20">
                      <Activity size={10} />
                      {p.visitCount} lần
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] bg-green-dark/5 text-green-dark py-1 px-2.5 rounded-md font-semibold">
                      <Shield size={10} />
                      Có BHYT (80%)
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-ink/40">
                    <Users size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">Không tìm thấy bệnh nhân nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
