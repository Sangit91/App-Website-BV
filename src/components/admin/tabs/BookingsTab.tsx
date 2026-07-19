import { useState, useMemo } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { Card, Badge, Button } from "../../ui";
import { Search, FileDown, Printer, Check, X, Edit } from "lucide-react";

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
    <div className="space-y-6">
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
              <span>Xuất danh sách (Excel)</span>
            </Button>
            <Button variant="primary" size="md">
              <Printer size={14} />
              <span>In phiếu khám ngày</span>
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

      <Card variant="default" padding="lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                <th className="p-3">Mã LH</th>
                <th className="p-3">Họ Tên Người Bệnh</th>
                <th className="p-3">Điện Thoại</th>
                <th className="p-3">Chuyên Khoa / Bác Sĩ</th>
                <th className="p-3">Ngày & Ca Khám</th>
                <th className="p-3">Triệu chứng lâm sàng</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3 text-right">Thao Tác Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-cream-white transition-colors">
                  <td className="p-3 font-mono font-bold text-green-dark">{b.id}</td>
                  <td className="p-3 font-bold">{b.patientName}</td>
                  <td className="p-3 font-semibold">{b.phone}</td>
                  <td className="p-3 space-y-0.5">
                    <span className="block font-bold text-brand-green">{b.specialty}</span>
                    <span className="block text-[10px] text-ink/75 italic">{b.doctorName || "Khám bác sĩ khoa"}</span>
                  </td>
                  <td className="p-3">
                    <span className="block font-semibold">{b.date}</span>
                    <span className="block text-[10px] text-ink/60">{b.timeSlot}</span>
                  </td>
                  <td className="p-3 max-w-[200px] truncate" title={b.symptoms}>{b.symptoms}</td>
                  <td className="p-3">
                    <Badge variant={b.status === "Chờ xác nhận" ? "warning" : b.status === "Đã xác nhận" ? "success" : "error"}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status !== "Đã xác nhận" && (
                        <button
                          onClick={() => updateBookingStatus(b.id, "Đã xác nhận")}
                          className="p-1.5 bg-mint hover:bg-mint/80 text-brand-green rounded-lg transition-all cursor-pointer"
                          title="Phê duyệt xác nhận"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      {b.status !== "Đã hủy" && (
                        <button
                          onClick={() => updateBookingStatus(b.id, "Đã hủy")}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all cursor-pointer"
                          title="Hủy lịch hẹn"
                        >
                          <X size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => {}}
                        className="p-1.5 bg-cream-white hover:bg-green-800/10 text-green-dark border border-green-800/10 rounded-lg transition-all cursor-pointer"
                        title="Sửa đổi thông tin"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-ink/40 font-medium">
                    Không tìm thấy lịch hẹn nào tương thích với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}