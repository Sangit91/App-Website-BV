import { useState, FormEvent } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card, Button } from "../../ui";
import { Plus, Edit, Trash2, ShieldAlert } from "lucide-react";

export default function SpecialtiesTab() {
  const { specialties, addSpecialty, updateSpecialty, deleteSpecialty } = useHospital();
  const { activeUser } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<typeof specialties[0] | null>(null);
  const [form, setForm] = useState({ name: "", description: "", iconType: "general" as any, detail: "" });

  const isSuperAdmin = activeUser?.role === "Super Admin";
  const canEdit = isSuperAdmin;

  const handleOpen = (spec: typeof specialties[0] | null = null) => {
    if (!canEdit) return;
    if (spec) {
      setEditing(spec);
      setForm({ name: spec.name, description: spec.description, iconType: spec.iconType, detail: spec.detail });
    } else {
      setEditing(null);
      setForm({ name: "", description: "", iconType: "general", detail: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;

    if (editing) {
      updateSpecialty({ ...editing, ...form });
    } else {
      addSpecialty({ ...form, id: crypto.randomUUID() });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (!canEdit) return;
    if (confirm(`Bạn có chắc chắn muốn xóa chuyên khoa ${name}?`)) {
      deleteSpecialty(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-green-dark">Danh Sách Chuyên Khoa Lâm Sàng</h3>
        <Button variant="primary" size="md" onClick={() => handleOpen()} disabled={!canEdit}>
          <Plus size={14} />
          <span>Thêm Chuyên Khoa Mới</span>
        </Button>
      </div>

      {!canEdit && (
        <div className="bg-peach/10 text-peach-dark p-3 rounded-xl text-xs flex items-center gap-2 border border-peach/20 font-semibold">
          <ShieldAlert size={14} />
          <span>Quyền hạn vai trò của bạn ({activeUser?.role}) bị hạn chế thêm/sửa đổi chuyên khoa.</span>
        </div>
      )}

      <Card variant="default" padding="lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                <th className="p-3">Mã Code</th>
                <th className="p-3">Tên Chuyên Khoa</th>
                <th className="p-3">Mô Tả Tóm Tắt</th>
                <th className="p-3">Mô tả chi tiết kỹ thuật</th>
                <th className="p-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {specialties.map((s) => (
                <tr key={s.id} className="hover:bg-cream-white transition-colors">
                  <td className="p-3 font-mono font-bold text-green-dark">{s.id}</td>
                  <td className="p-3 font-extrabold text-green-dark">{s.name}</td>
                  <td className="p-3 max-w-[200px] truncate">{s.description}</td>
                  <td className="p-3 max-w-[300px] truncate">{s.detail}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpen(s)}
                        disabled={!canEdit}
                        className={`p-1.5 rounded-lg transition-all ${canEdit ? "bg-mint text-brand-green hover:bg-mint/80 cursor-pointer" : "bg-ink/10 text-ink/30 cursor-not-allowed"}`}
                        title="Chỉnh sửa"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        disabled={!canEdit}
                        className={`p-1.5 rounded-lg transition-all ${canEdit ? "bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer" : "bg-ink/10 text-ink/30 cursor-not-allowed"}`}
                        title="Xóa bỏ"
                      >
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
              <h3 className="font-display font-bold text-base">
                {editing ? "Cập Nhật Chuyên Khoa" : "Thêm Chuyên Khoa Mới"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-green-dark">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Tên chuyên khoa</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Khoa Xét Nghiệm"
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Mô tả tóm tắt ngắn</label>
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Thực hiện xét nghiệm máu tự động..."
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider">Mô tả chi tiết</label>
                <textarea
                  value={form.detail}
                  onChange={(e) => setForm({ ...form, detail: e.target.value })}
                  rows={3}
                  placeholder="Mô tả trang thiết bị, kỹ thuật..."
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
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