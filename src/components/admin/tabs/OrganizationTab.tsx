import { useState, useEffect, FormEvent } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card, Button } from "../../ui";
import { Plus, Edit, Trash2, RefreshCw, Search } from "lucide-react";

export default function OrganizationTab() {
  const { addLog } = useHospital();
  const { activeUser } = useAdmin();
  const [divisions, setDivisions] = useState<Record<string, any>>({});
  const [selectedDivision, setSelectedDivision] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<{ divisionId: string; dept: any } | null>(null);
  const [form, setForm] = useState({ name: "", leader: "", phone: "", staffCount: 0, description: "", details: "" });

  const isSuperAdmin = activeUser?.role === "Super Admin";

  useEffect(() => {
    if (isSuperAdmin) fetchData();
  }, [isSuperAdmin]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/organization");
      if (res.ok) {
        const data = await res.json();
        setDivisions(data);
        if (!selectedDivision && Object.keys(data).length > 0) {
          setSelectedDivision(Object.keys(data)[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch organization data:", err);
    }
  };

  const currentDepts = divisions[selectedDivision]?.departments || [];

  const filteredDepts = currentDepts.filter((d: any) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.leader.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (divisionId: string, dept: any = null) => {
    if (dept) {
      setEditing({ divisionId, dept });
      setForm({ name: dept.name, leader: dept.leader, phone: dept.phone, staffCount: dept.staffCount, description: dept.description, details: dept.details || "" });
    } else {
      setEditing(null);
      setForm({ name: "", leader: "", phone: "", staffCount: 0, description: "", details: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.leader.trim()) return;

    try {
      let res;
      if (editing) {
        res = await fetch(`/api/organization/${editing.divisionId}/departments/${editing.dept.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
        });
      } else {
        res = await fetch(`/api/organization/${selectedDivision}/departments`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
        });
      }

      if (res.ok) {
        await fetchData();
        addLog(`Cập nhật sơ đồ tổ chức: ${editing ? "Sửa" : "Thêm"} khoa/phòng "${form.name}"`);
      }
    } catch (err) {
      console.error("Organization CRUD error:", err);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (divisionId: string, deptId: string, deptName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khoa/phòng "${deptName}"?`)) return;
    try {
      const res = await fetch(`/api/organization/${divisionId}/departments/${deptId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
        addLog(`Xóa khoa/phòng "${deptName}" khỏi sơ đồ tổ chức`);
      }
    } catch (err) {
      console.error("Delete org dept error:", err);
    }
  };

  if (!isSuperAdmin) return null;

  return (
    <div className="space-y-6">
      {Object.keys(divisions).length === 0 && (
        <div className="bg-mint p-4 rounded-xl text-xs font-semibold text-green-dark flex items-center gap-2 border border-brand-green/30">
          <RefreshCw size={14} className="animate-spin" />
          <span>Đang tải dữ liệu sơ đồ tổ chức...</span>
        </div>
      )}

      {Object.keys(divisions).length > 0 && (
        <>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {Object.values(divisions).map((div: any) => (
              <button key={div.id} onClick={() => setSelectedDivision(div.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedDivision === div.id ? `${div.color} text-white shadow-md` : "bg-white text-green-dark border border-green-800/10 hover:bg-cream-white"}`}>
                {div.name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input type="text" placeholder="Tìm kiếm khoa/phòng..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-green-800/10 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <Button variant="primary" size="md" onClick={() => handleOpenModal(selectedDivision)}>
              <Plus size={14} />
              <span>Thêm Khoa/Phòng Mới</span>
            </Button>
          </div>

          <Card variant="default" padding="lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                    <th className="p-3">Tên Khoa/Phòng</th>
                    <th className="p-3">Trưởng khoa</th>
                    <th className="p-3">Số Điện Thoại</th>
                    <th className="p-3">Số NV</th>
                    <th className="p-3">Mô tả</th>
                    <th className="p-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {filteredDepts.map((dept: any) => (
                    <tr key={dept.id} className="hover:bg-cream-white transition-colors">
                      <td className="p-3 font-bold text-green-dark">{dept.name}</td>
                      <td className="p-3 font-semibold">{dept.leader}</td>
                      <td className="p-3 text-ink/70">{dept.phone}</td>
                      <td className="p-3">
                        <span className="bg-green-dark/5 text-green-dark font-mono px-2 py-0.5 rounded-md text-[11px]">{dept.staffCount}</span>
                      </td>
                      <td className="p-3 max-w-[200px] truncate text-ink/60">{dept.description}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleOpenModal(selectedDivision, dept)}
                            className="p-1.5 bg-mint text-brand-green rounded-lg transition-all cursor-pointer">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(selectedDivision, dept.id, dept.name)}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg transition-all cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDepts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-ink/40 font-medium">Chưa có khoa/phòng nào trong khối này</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl border border-green-800/10">
            <div className="bg-gradient-to-r from-brand-green to-green-dark p-5 text-white flex justify-between items-center">
              <h3 className="font-display font-bold text-base">{editing ? "Cập Nhật Khoa/Phòng" : "Thêm Khoa/Phòng Mới"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-green-dark">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Tên Khoa/Phòng <span className="text-red-500">*</span></label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Trưởng khoa <span className="text-red-500">*</span></label>
                <input type="text" required value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })}
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Số Điện Thoại</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Số Nhân Sự</label>
                  <input type="number" min="0" value={form.staffCount} onChange={(e) => setForm({ ...form, staffCount: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Mô Tả Ngắn</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-ink/5">
                <Button type="button" variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
                <Button type="submit" variant="primary" size="md">{editing ? "Cập Nhật" : "Thêm Mới"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}