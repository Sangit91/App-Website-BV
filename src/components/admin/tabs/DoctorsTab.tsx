import { useState, FormEvent } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card, Button } from "../../ui";
import { Plus, Edit, Trash2, ShieldAlert } from "lucide-react";

export default function DoctorsTab() {
  const { doctors, specialties, addDoctor, updateDoctor, deleteDoctor } = useHospital();
  const { activeUser } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<typeof doctors[0] | null>(null);
  const [form, setForm] = useState({
    name: "", title: "BS. CKI.", specialtyId: "", image: "", experience: "", schedule: ""
  });

  const isSuperAdmin = activeUser?.role === "Super Admin";
  const canEdit = isSuperAdmin;

  const handleOpen = (doc: typeof doctors[0] | null = null) => {
    if (!canEdit) return;
    if (doc) {
      setEditing(doc);
      setForm({
        name: doc.name, title: doc.title, specialtyId: doc.specialtyId,
        image: doc.image, experience: doc.experience, schedule: doc.schedule
      });
    } else {
      setEditing(null);
      setForm({ name: "", title: "BS. CKI.", specialtyId: specialties[0]?.id || "", image: "", experience: "", schedule: "Thứ Hai - Thứ Sáu (08:00 - 17:00)" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.title.trim() || !form.specialtyId) return;

    const selectedSpec = specialties.find(s => s.id === form.specialtyId);
    const specNameString = selectedSpec?.name || "Ngoại khoa";
    const finalImage = form.image.trim() || "https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400";

    if (editing) {
      updateDoctor({ ...editing, ...form, specialtyName: specNameString, image: finalImage });
    } else {
      addDoctor({ ...form, specialtyName: specNameString, image: finalImage });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (!canEdit) return;
    if (confirm(`Bạn có chắc chắn muốn xóa bác sĩ ${name}?`)) {
      deleteDoctor(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-green-dark">Cơ sở dữ liệu Bác Sĩ Điều Trị</h3>
        <Button variant="primary" size="md" onClick={() => handleOpen()} disabled={!canEdit}>
          <Plus size={14} />
          <span>Thêm Bác Sĩ Mới</span>
        </Button>
      </div>

      {!canEdit && (
        <div className="bg-peach/10 text-peach-dark p-3 rounded-xl text-xs flex items-center gap-2 border border-peach/20 font-semibold">
          <ShieldAlert size={14} />
          <span>Quyền hạn vai trò của bạn ({activeUser?.role}) bị hạn chế thêm/sửa đổi thông tin Bác sĩ.</span>
        </div>
      )}

      <Card variant="default" padding="lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                <th className="p-3">Ảnh</th>
                <th className="p-3">Họ Tên & Học Hàm</th>
                <th className="p-3">Khoa Phụ Trách</th>
                <th className="p-3">Kinh nghiệm lâm sàn</th>
                <th className="p-3">Khung giờ trực tiêu chuẩn</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {doctors.map((d) => (
                <tr key={d.id} className="hover:bg-cream-white transition-colors">
                  <td className="p-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-green/20">
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="block font-bold text-green-dark">{d.name}</span>
                    <span className="block text-[10px] text-peach font-semibold">{d.title}</span>
                  </td>
                  <td className="p-3 font-semibold text-brand-green">{d.specialtyName}</td>
                  <td className="p-3 max-w-[200px] truncate text-ink/75">{d.experience}</td>
                  <td className="p-3 font-mono text-[11px] font-medium">{d.schedule}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => handleOpen(d)} disabled={!canEdit}
                        className={`p-1.5 rounded-lg transition-all ${canEdit ? "bg-mint text-brand-green hover:bg-mint/80 cursor-pointer" : "bg-ink/10 text-ink/30 cursor-not-allowed"}`}>
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(d.id, d.name)} disabled={!canEdit}
                        className={`p-1.5 rounded-lg transition-all ${canEdit ? "bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer" : "bg-ink/10 text-ink/30 cursor-not-allowed"}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl border border-green-800/10">
            <div className="bg-gradient-to-r from-brand-green to-green-dark p-5 text-white flex justify-between items-center">
              <h3 className="font-display font-bold text-base">{editing ? "Cập Nhật Hồ Sơ Bác Sĩ" : "Thêm Mới Thầy Thuốc"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-green-dark">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Tên Bác Sĩ</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Học hàm học vị</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Chuyên Khoa Phụ Trách</label>
                <select value={form.specialtyId} onChange={(e) => setForm({ ...form, specialtyId: e.target.value })}
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green">
                  {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Ảnh đại diện (URL)</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Để trống để dùng ảnh mặc định"
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Kinh nghiệm chuyên môn</label>
                <textarea value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} rows={2}
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Thời gian trực định kỳ</label>
                <input type="text" required value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green" />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-ink/5">
                <Button type="button" variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
                <Button type="submit" variant="primary" size="md">{editing ? "Cập Nhật" : "Tạo mới"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}