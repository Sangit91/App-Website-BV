import { useHospital } from "../../../context/HospitalContext";
import { Card } from "../../ui";

export default function LogsTab() {
  const { logs } = useHospital();

  return (
    <div className="space-y-6">
      <Card variant="default" padding="md">
        <h3 className="font-display font-bold text-base text-green-dark">Lịch Sử Kiểm Toán An Toàn Y Khoa</h3>
        <p className="text-xs text-ink/75 mt-1">
          Đây là nhật ký giao dịch chỉ đọc để ghi nhận toàn bộ các thao tác nghiệp vụ, hành vi phê duyệt lịch khám bệnh,
          cấu hình chuyên môn, phân công lịch trực nhằm tuân thủ quy chuẩn quản lý dữ liệu an toàn.
        </p>
      </Card>

      <Card variant="default" padding="lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                <th className="p-3">Thời Gian Hệ Thống</th>
                <th className="p-3">Quản Trị Viên Phụ Trách</th>
                <th className="p-3 text-brand-green">Hành Động Đã Thực Thi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5 text-ink/90">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-cream-white transition-colors">
                  <td className="p-3 text-ink/50 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 font-semibold text-green-dark whitespace-nowrap">{log.user}</td>
                  <td className="p-3 font-medium text-[11px] text-green-dark">{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}