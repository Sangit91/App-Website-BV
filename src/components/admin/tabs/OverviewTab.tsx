import { useMemo } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { Card, Badge } from "../../ui";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface OverviewTabProps {
  onNavigate: (tab: string) => void;
}

export default function OverviewTab({ onNavigate }: OverviewTabProps) {
  const { bookings, patients, schedules } = useHospital();

  const todayDayNameEn = useMemo(() => {
    const day = new Date().getDay();
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[day];
  }, []);

  const metrics = useMemo(() => {
    const totalBookingsCount = bookings.length;
    const activePatientsCount = patients.length;
    const doctorsOnDutyCount = schedules.filter(s => {
      const shift = s[todayDayNameEn as keyof typeof s];
      return shift && shift !== "Nghỉ";
    }).length;
    const pendingConfirmations = bookings.filter(b => b.status === "Chờ xác nhận").length;
    return {
      totalBookingsCount,
      activePatientsCount,
      doctorsOnDutyCount,
      pendingConfirmations
    };
  }, [bookings, patients, schedules, todayDayNameEn]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" padding="md" className="min-h-[120px] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-ink/50 uppercase tracking-wider block">Tổng số lượt đăng ký</span>
            <h3 className="font-display font-extrabold text-3xl mt-1 text-green-dark">{metrics.totalBookingsCount}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-green mt-3">
            <CheckCircle size={14} />
            <span>+12.4% tuần này</span>
          </div>
        </Card>

        <Card variant="default" padding="md" className="min-h-[120px] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-ink/50 uppercase tracking-wider block">Bệnh nhân lưu hồ sơ</span>
            <h3 className="font-display font-extrabold text-3xl mt-1 text-green-dark">{metrics.activePatientsCount}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand-green mt-3 font-semibold">
            <span>Đồng bộ thẻ BHYT tự động</span>
          </div>
        </Card>

        <Card variant="default" padding="md" className="min-h-[120px] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-ink/50 uppercase tracking-wider block">Bác sĩ lên ca hôm nay</span>
            <h3 className="font-display font-extrabold text-3xl mt-1 text-green-dark">{metrics.doctorsOnDutyCount}</h3>
          </div>
          <div className="text-[11px] font-medium text-green-dark bg-mint px-2.5 py-1 rounded-lg self-start mt-3">
            Hoạt động 24/7 chuyên nghiệp
          </div>
        </Card>

        <Card variant="default" padding="md" className="min-h-[120px] flex flex-col justify-between border-2 border-peach">
          <div>
            <span className="text-[10px] font-extrabold text-peach uppercase tracking-wider block">Đang chờ phê duyệt gấp</span>
            <h3 className="font-display font-extrabold text-3xl mt-1 text-green-dark">{metrics.pendingConfirmations}</h3>
          </div>
          <div className="text-[10px] font-bold text-peach flex items-center gap-1 mt-3">
            <AlertTriangle size={12} />
            <span>Lễ tân cần kiểm tra sổ sách</span>
          </div>
        </Card>
      </div>

      <Card variant="default" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-green-dark">Lịch Đăng Ký Đã Ghi Nhận Gần Đây</h3>
          <button
            onClick={() => onNavigate("bookings")}
            className="text-xs text-brand-green hover:underline font-bold cursor-pointer"
          >
            Xem tất cả lịch hẹn ({bookings.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase tracking-wider bg-cream-white">
                <th className="p-3">Mã Code</th>
                <th className="p-3">Họ Tên Bệnh Nhân</th>
                <th className="p-3">Số Điện Thoại</th>
                <th className="p-3">Chuyên Khoa</th>
                <th className="p-3">Ngày Hẹn</th>
                <th className="p-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-cream-white transition-colors">
                  <td className="p-3 font-mono font-bold text-green-dark">{b.id}</td>
                  <td className="p-3 font-semibold">{b.patientName}</td>
                  <td className="p-3">{b.phone}</td>
                  <td className="p-3">
                    <span className="bg-green-dark/5 text-green-dark py-0.5 px-2 rounded-md font-medium text-[11px]">
                      {b.specialty}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{b.date} ({b.timeSlot})</td>
                  <td className="p-3">
                    <Badge variant={b.status === "Chờ xác nhận" ? "warning" : b.status === "Đã xác nhận" ? "success" : "error"}>
                      {b.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-ink/40">
                    Chưa có lượt đăng ký nào ghi nhận trên hệ thống
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