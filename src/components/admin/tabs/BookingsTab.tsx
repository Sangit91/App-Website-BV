import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useHospital } from "../../../context/HospitalContext";
import { Card, Badge, Button } from "../../ui";
import { Search, FileDown, Printer, Check, X, Edit, CalendarCheck } from "lucide-react";

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: "easeOut" as const }
  })
};

const statusColors: Record<string, string> = {
  "Chờ xác nhận": "bg-peach/10 text-peach border-l-peach",
  "Đã xác nhận": "bg-brand-green/10 text-brand-green border-l-brand-green",
  "Đã hủy": "bg-red-50 text-red-500 border-l-red-400",
};

export default function BookingsTab() {
  const { bookings, updateBookingStatus } = useHospital();
  const [search, setSearch] = useState("");
  const [excelMessage, setExcelMessage] = useState("");

  const filtered = useMemo(() => {
    return bookings.filter(b =>
      b.patientName.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.specialty.toLowerCase().includes(search.toLowerCase())
    );
  }, [bookings, search]);

  const handleExport = () => {
    setExcelMessage("Danh sách đã được xuất thành tệp Excel thành công!");
    setTimeout(() => setExcelMessage(""), 5000);
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green/20 to-green-dark/20 flex items-center justify-center shadow-sm">
            <CalendarCheck size={18} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-green-dark">Đặt lịch khám</h2>
            <p className="text-[11px] text-ink/50">Quản lý lịch hẹn khám bệnh</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">{filtered.length} lịch hẹn</span>
      </div>

      <Card variant="default" padding="md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              placeholder="Tìm mã lịch, tên, điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cream-white border border-green-800/10 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-green text-green-dark"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Button variant="secondary" size="md" onClick={handleExport}>
              <FileDown size={14} />
              <span>Xuất Excel</span>
            </Button>
            <Button variant="primary" size="md">
              <Printer size={14} />
              <span>In phiếu khám</span>
            </Button>
          </div>
        </div>
      </Card>

      {excelMessage && (
        <div className="bg-mint text-green-dark text-xs font-bold p-4 rounded-xl flex items-center gap-2 border border-brand-green/30">
          <Check size={16} />
          <span>{excelMessage}</span>
        </div>
      )}

      <Card variant="default" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white/95 backdrop-blur-sm sticky top-0 z-10">
                <th className="p-3">Mã LH</th>
                <th className="p-3">Họ Tên</th>
                <th className="p-3">Điện Thoại</th>
                <th className="p-3">Chuyên Khoa / Bác Sĩ</th>
                <th className="p-3">Ngày & Ca</th>
                <th className="p-3">Triệu chứng</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((b, i) => (
                <motion.tr key={b.id} custom={i} initial="hidden" animate="visible" variants={rowVariants}
                  className={`group hover:bg-cream-white/80 transition-all duration-200 border-l-2 ${statusColors[b.status] ? statusColors[b.status].split(' ').pop() : 'border-l-transparent'}`}>
                  <td className="p-3 font-mono font-bold text-green-dark">{b.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-brand-green/10 flex items-center justify-center text-[10px] font-bold text-brand-green shrink-0">
                        {b.patientName.charAt(0)}
                      </div>
                      <span className="font-bold">{b.patientName}</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-ink/70">{b.phone}</td>
                  <td className="p-3 space-y-0.5">
                    <span className="block font-bold text-brand-green text-[11px]">{b.specialty}</span>
                    {b.doctorName && <span className="block text-[10px] text-ink/50 italic">{b.doctorName}</span>}
                  </td>
                  <td className="p-3">
                    <span className="block font-semibold text-[11px]">{b.date}</span>
                    <span className="block text-[10px] text-ink/50">{b.timeSlot}</span>
                  </td>
                  <td className="p-3 max-w-[180px] truncate text-ink/60" title={b.symptoms}>{b.symptoms}</td>
                  <td className="p-3">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      b.status === "Chờ xác nhận" ? "bg-peach/10 text-peach" :
                      b.status === "Đã xác nhận" ? "bg-brand-green/10 text-brand-green" :
                      "bg-red-50 text-red-500"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      {b.status !== "Đã xác nhận" && (
                        <button onClick={() => updateBookingStatus(b.id, "Đã xác nhận")}
                          className="p-1.5 bg-mint hover:bg-mint/80 text-brand-green rounded-lg transition-all cursor-pointer" title="Xác nhận">
                          <Check size={14} />
                        </button>
                      )}
                      {b.status !== "Đã hủy" && (
                        <button onClick={() => updateBookingStatus(b.id, "Đã hủy")}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all cursor-pointer" title="Hủy">
                          <X size={14} />
                        </button>
                      )}
                      <button className="p-1.5 bg-cream-white hover:bg-green-800/10 text-green-dark border border-green-800/10 rounded-lg transition-all cursor-pointer" title="Sửa">
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-ink/40">
                    <CalendarCheck size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">Không tìm thấy lịch hẹn nào</p>
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
