import { useMemo } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card } from "../../ui";
import { Lock } from "lucide-react";

export default function ShiftsTab() {
  const { schedules } = useHospital();
  const { activeUser } = useAdmin();

  const isSuperAdmin = activeUser?.role === "Super Admin";
  const isDoctorRole = activeUser?.role === "Doctor";
  const canEdit = isSuperAdmin || isDoctorRole;

  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

  const dayLabels: Record<string, string> = {
    monday: "Thứ Hai (Mon)",
    tuesday: "Thứ Ba (Tue)",
    wednesday: "Thứ Tư (Wed)",
    thursday: "Thứ Năm (Thu)",
    friday: "Thứ Sáu (Fri)",
    saturday: "Thứ Bảy (Sat)",
    sunday: "Chủ Nhật (Sun)",
  };

  return (
    <div className="space-y-6">
      <Card variant="default" padding="md">
        <h3 className="font-display font-bold text-base text-green-dark">Ma Trận Lịch Trực Tuần Tra Lâm Sàng</h3>
        <p className="text-xs text-ink/70 mt-1">
          Cập nhật phân ca trực của bác sĩ giúp bệnh nhân dễ dàng tra cứu tại trang chủ.
        </p>
        {isDoctorRole && (
          <div className="bg-mint p-3.5 rounded-xl border border-brand-green/30 mt-4 text-xs font-semibold">
            <span>Bạn đang đăng nhập với vai trò Bác Sĩ Trực. Bạn có thể thay đổi lịch phân ca trực cá nhân bên dưới.</span>
          </div>
        )}
      </Card>

      <Card variant="default" padding="lg">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-bold bg-cream-white">
                <th className="p-4 text-left">Họ Tên Bác Sĩ</th>
                {dayKeys.map(key => (
                  <th key={key} className="p-3">{dayLabels[key]}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {schedules.map((s) => {
                const isOwnSchedule = activeUser?.name.toLowerCase().includes(s.doctorName.toLowerCase());
                const canEditRow = isSuperAdmin || (isDoctorRole && isOwnSchedule);

                return (
                  <tr key={s.doctorId} className="hover:bg-cream-white transition-colors">
                    <td className="p-4 text-left font-extrabold text-green-dark whitespace-nowrap">
                      <span className="block">{s.doctorName}</span>
                      {!canEditRow && (
                        <span className="inline-flex items-center gap-1 text-[9px] text-ink/40 font-normal mt-0.5">
                          <Lock size={8} /> Chỉ xem (Locked)
                        </span>
                      )}
                    </td>
                    {dayKeys.map((dayKey) => {
                      const cellValue = s[dayKey];
                      return (
                        <td key={dayKey} className="p-3">
                          {canEditRow ? (
                            <select
                              value={cellValue}
                              onChange={(e) => {}}
                              className={`p-1.5 rounded-lg text-[11px] font-bold w-24 text-center cursor-pointer border ${
                                cellValue === "Ca Sáng"
                                  ? "bg-mint text-green-dark border-brand-green/30"
                                  : cellValue === "Ca Chiều"
                                  ? "bg-peach/10 text-peach-dark border-peach/30"
                                  : "bg-red-50 text-red-500 border-red-500/10"
                              }`}
                            >
                              <option value="Ca Sáng">Ca Sáng</option>
                              <option value="Ca Chiều">Ca Chiều</option>
                              <option value="Nghỉ">Nghỉ (Off)</option>
                            </select>
                          ) : (
                            <span className={`inline-block py-1.5 w-24 text-center rounded-lg text-[10px] font-bold ${
                              cellValue === "Ca Sáng"
                                ? "bg-green-dark/5 text-green-dark"
                                : cellValue === "Ca Chiều"
                                ? "bg-peach/10 text-peach-dark"
                                : "bg-red-50 text-red-500"
                            }`}>
                              {cellValue === "Nghỉ" ? "Nghỉ (Off)" : cellValue}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}