import { useMemo, useState } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card, Button } from "../../ui";
import EditModal from "../ui/EditModal";
import { Plus, Lock } from "lucide-react";

export default function ShiftsTab() {
  const { schedules, doctors, updateScheduleShift } = useHospital() as ReturnType<typeof useHospital> & {
    updateScheduleShift: (doctorId: string, day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday", shift: "Ca Sáng" | "Ca Chiều" | "Nghỉ") => void;
  };
  const { activeUser } = useAdmin();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const isSuperAdmin = activeUser?.role === "Super Admin";
  const isDeptAdmin = activeUser?.role === "Department Admin";
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

  // Bác sĩ chưa có lịch trực → gợi ý tạo mới
  const doctorsWithoutSchedule = useMemo(() => {
    const scheduleDoctorIds = new Set(schedules.map(s => s.doctorId));
    return doctors.filter(d => !scheduleDoctorIds.has(d.id));
  }, [doctors, schedules]);

  const canAdd = isSuperAdmin || isDeptAdmin;

  const handleAddSubmit = (data: Record<string, string | number | boolean | File | null>) => {
    const doctorId = data.doctorId as string;
    if (!doctorId) return;
    // Tạo schedule mặc định "Nghỉ" cả tuần — backend PATCH tự upsert
    fetch(`/api/v1/doctors/${doctorId}/schedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monday: "nghi", tuesday: "nghi", wednesday: "nghi",
        thursday: "nghi", friday: "nghi", saturday: "nghi", sunday: "nghi",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create schedule");
        // Reload schedules từ API
        return fetch('/api/v1/doctors/schedules').then(r => r.json());
      })
      .then((dbSchedules) => {
        const shiftMap: Record<string, string> = {
          ca_sang: "Ca Sáng", ca_chieu: "Ca Chiều", nghi: "Nghỉ",
        };
        const mapped = dbSchedules.map((s: any) => ({
          doctorId: s.doctorId,
          doctorName: s.doctor?.fullName || "",
          monday: shiftMap[s.monday] || "Nghỉ",
          tuesday: shiftMap[s.tuesday] || "Nghỉ",
          wednesday: shiftMap[s.wednesday] || "Nghỉ",
          thursday: shiftMap[s.thursday] || "Nghỉ",
          friday: shiftMap[s.friday] || "Nghỉ",
          saturday: shiftMap[s.saturday] || "Nghỉ",
          sunday: shiftMap[s.sunday] || "Nghỉ",
        }));
        localStorage.setItem("hosp_schedules", JSON.stringify(mapped));
        window.location.reload();
      })
      .catch((err) => console.error("Failed to add schedule:", err));
    setIsAddOpen(false);
  };

  const addFields = [
    {
      name: "doctorId",
      label: "Chọn Bác Sĩ",
      type: "select" as const,
      required: true,
      description: "Tạo hoặc cập nhật lịch trực cho bác sĩ (mặc định Nghỉ cả tuần)",
      hint: "Chọn bác sĩ cần thêm hoặc thay đổi phân ca",
      options: doctors.map(d => ({
        value: d.id,
        label: `${d.title} ${d.name} (${d.specialtyName || "Chưa phân khoa"})${doctorsWithoutSchedule.find(ds => ds.id === d.id) ? " — chưa có lịch" : ""}`,
      })),
    },
  ];

  return (
    <div className="space-y-6">
      <Card variant="default" padding="md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-base text-green-dark">Ma Trận Lịch Trực Tuần Tra Lâm Sàng</h3>
            <p className="text-xs text-ink/70 mt-1">
              Cập nhật phân ca trực của bác sĩ giúp bệnh nhân dễ dàng tra cứu tại trang chủ. Tổng số: <strong>{schedules.length}</strong> bác sĩ đã phân ca.
            </p>
          </div>
          {canAdd && (
            <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
              <Plus size={14} />
              <span>Thêm phân ca</span>
            </Button>
          )}
        </div>
        {isDoctorRole && (
          <div className="bg-mint p-3.5 rounded-xl border border-brand-green/30 mt-4 text-xs font-semibold">
            <span>Bạn đang đăng nhập với vai trò Bác Sĩ Trực. Bạn có thể thay đổi lịch phân ca trực cá nhân bên dưới.</span>
          </div>
        )}
      </Card>

      <Card variant="default" padding="lg">
        {schedules.length === 0 ? (
          <div className="text-center py-12 text-ink/50">
            <p className="font-semibold mb-2">Chưa có lịch trực nào được phân ca</p>
            <p className="text-xs">Nhấn nút "Thêm phân ca" ở trên để bắt đầu.</p>
          </div>
        ) : (
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
                                onChange={(e) => updateScheduleShift(s.doctorId, dayKey, e.target.value as "Ca Sáng" | "Ca Chiều" | "Nghỉ")}
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
        )}
      </Card>

      <EditModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSubmit}
        title="Thêm Phân Ca Trực Cho Bác Sĩ"
        fields={addFields}
        initialData={{}}
        size="md"
      />
    </div>
  );
}
