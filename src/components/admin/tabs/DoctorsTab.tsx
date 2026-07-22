import { useState } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card, Button } from "../../ui";
import EditModal from "../ui/EditModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Plus, Edit, Trash2, ShieldAlert } from "lucide-react";

export default function DoctorsTab() {
  const { doctors, specialties, addDoctor, updateDoctor, deleteDoctor } = useHospital();
  const { activeUser } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<typeof doctors[0] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const isSuperAdmin = activeUser?.role === "Super Admin";
  const canEdit = isSuperAdmin;

  const handleOpen = (doc: typeof doctors[0] | null = null) => {
    if (!canEdit) return;
    setEditing(doc);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = (data: Record<string, string | number | boolean | File | null>) => {
    const selectedSpec = specialties.find(s => s.id === data.specialtyId);
    const specNameString = selectedSpec?.name || "Ngoại khoa";
    const finalImage = (data.image as string)?.trim() || "/images/doctors/doctor-placeholder.jpeg";

    const payload = {
      id: editing?.id || crypto.randomUUID(),
      name: data.name as string,
      title: data.title as string,
      specialtyId: data.specialtyId as string,
      specialtyName: specNameString,
      image: finalImage,
      experience: (data.experience as string) || "",
      schedule: data.schedule as string
    };

    if (editing) {
      updateDoctor({ ...editing, ...payload });
    } else {
      addDoctor(payload);
    }
    handleClose();
  };

  const handleDelete = (id: string, name: string) => {
    if (!canEdit) return;
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteDoctor(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Tên Bác Sĩ",
      type: "text" as const,
      required: true,
      description: "Họ và tên đầy đủ",
      hint: "VD: Nguyễn Văn A"
    },
    {
      name: "title",
      label: "Học hàm học vị",
      type: "text" as const,
      required: true,
      description: "Danh xưng chuyên môn",
      hint: "VD: BS. CKI., ThS. BS., GS. TS."
    },
    {
      name: "specialtyId",
      label: "Chuyên Khoa Phụ Trách",
      type: "select" as const,
      required: true,
      description: "Khoa mà bác sĩ trực thuộc",
      hint: "Chọn chuyên khoa phù hợp",
      options: specialties.map(s => ({ value: s.id, label: s.name }))
    },
    {
      name: "image",
      label: "Ảnh đại diện (URL)",
      type: "image" as const,
      description: "Đường dẫn ảnh bác sĩ",
      hint: "Để trống sẽ dùng ảnh mặc định"
    },
    {
      name: "experience",
      label: "Kinh nghiệm chuyên môn",
      type: "textarea" as const,
      description: "Quá trình công tác và thành tựu",
      hint: "VD: 10 năm kinh nghiệm trong phẫu thuật tim mạch",
      rows: 2
    },
    {
      name: "schedule",
      label: "Thời gian trực định kỳ",
      type: "text" as const,
      required: true,
      description: "Khung giờ làm việc chuẩn",
      hint: "VD: Thứ Hai - Thứ Sáu (08:00 - 17:00)"
    }
  ];

  const initialData = editing ? {
    name: editing.name,
    title: editing.title,
    specialtyId: editing.specialtyId,
    image: editing.image,
    experience: editing.experience || "",
    schedule: editing.schedule
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-green-dark">Cơ sở dữ liệu Bác Sĩ Điều Trị</h3>
        <Button variant="primary" size="md" onClick={() => handleOpen(null)} disabled={!canEdit}>
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
                        className={canEdit ? "p-1.5 rounded-lg bg-mint text-brand-green hover:bg-mint/80 cursor-pointer transition-all" : "p-1.5 rounded-lg bg-ink/10 text-ink/30 cursor-not-allowed"}>
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(d.id, d.name)} disabled={!canEdit}
                        className={canEdit ? "p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer transition-all" : "p-1.5 rounded-lg bg-ink/10 text-ink/30 cursor-not-allowed"}>
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

      <EditModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={editing ? "Cập Nhật Hồ Sơ Bác Sĩ" : "Thêm Mới Thầy Thuốc"}
        fields={fields}
        initialData={initialData}
        size="lg"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa bác sĩ"
        message={"Bạn có chắc chắn muốn xóa bác sĩ \"" + (deleteTarget?.name || "") + "\"? Hành động này không thể hoàn tác."}
        confirmText="Xóa bỏ"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </div>
  );
}
