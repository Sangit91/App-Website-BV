import { useState, useMemo } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { Card } from "../../ui";
import { Search } from "lucide-react";

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
    <div className="space-y-6">
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

      <Card variant="default" padding="lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                <th className="p-3">Mã BN</th>
                <th className="p-3">Họ và Tên Bệnh Nhân</th>
                <th className="p-3">Số CCCD / Thẻ BHYT</th>
                <th className="p-3">Số Điện Thoại Liên Hệ</th>
                <th className="p-3">Lịch Sử Thăm Khám (Số Lần)</th>
                <th className="p-3">Bảo hiểm chi trả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-cream-white transition-colors">
                  <td className="p-3 font-mono font-bold text-brand-green">{p.id}</td>
                  <td className="p-3 font-bold text-green-dark">{p.name}</td>
                  <td className="p-3 font-mono text-ink/75 font-semibold">{p.cccd}</td>
                  <td className="p-3 font-semibold">{p.phone}</td>
                  <td className="p-3">
                    <span className="inline-block bg-mint text-green-dark font-bold py-0.5 px-3 rounded-full text-[11px] border border-brand-green/20">
                      {p.visitCount} lần khám
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] bg-green-dark/5 text-green-dark py-0.5 px-2 rounded-md font-semibold">
                      Có thẻ BHYT (80%)
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-ink/40 font-medium">
                    Không tìm thấy hồ sơ bệnh án hoặc bệnh nhân khớp với từ khóa
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