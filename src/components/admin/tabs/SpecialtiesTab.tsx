import { useState } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card, Button } from "../../ui";
import EditModal from "../ui/EditModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Plus, Edit, Trash2, ShieldAlert } from "lucide-react";
import { IconType } from "../../../types/models/specialty";

const iconTypeOptions = [
  { value: "general", label: "Tổng quát" },
  { value: "cardiology", label: "Tim mạch" },
  { value: "obstetrics", label: "Sản phụ" },
  { value: "pediatrics", label: "Nhi" },
  { value: "emergency", label: "Cấp cứu" },
  { value: "diagnostics", label: "Chẩn đoán" },
  { value: "ent", label: "Tai mũi họng" },
  { value: "odontology", label: "Răng hàm mặt" }
];

export default function SpecialtiesTab() {
  const { specialties, addSpecialty, updateSpecialty, deleteSpecialty } = useHospital();
  const { activeUser } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<typeof specialties[0] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const isSuperAdmin = activeUser?.role === "Super Admin";
  const canEdit = isSuperAdmin;

  const handleOpen = (spec: typeof specialties[0] | null = null) => {
    if (!canEdit) return;
    setEditing(spec);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = (data: Record<string, string | number | boolean | File | null>) => {
    const payload = {
      id: editing?.id || crypto.randomUUID(),
      name: data.name as string,
      description: data.description as string,
      detail: (data.detail as string) || "",
      iconType: data.iconType as IconType
    };

    if (editing) {
      updateSpecialty({ ...editing, ...payload });
    } else {
      addSpecialty(payload);
    }
    handleClose();
  };

  const handleDelete = (id: string, name: string) => {
    if (!canEdit) return;
    setDeleteTarget({ id, name });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteSpecialty(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Tên chuyên khoa",
      type: "text" as const,
      required: true,
      description: "Tên hiển thị trên giao diện",
      hint: "VD: Khoa Xét Nghiệm, Khoa Tim Mạch"
    },
    {
      name: "description",
      label: "Mô tả tóm tắt",
      type: "text" as const,
      required: true,
      description: "Mô tả ngắn gọn chức năng chuyên khoa",
      hint: "VD: Thực hiện các loại xét nghiệm máu, nước tiểu"
    },
    {
      name: "detail",
      label: "Mô tả chi tiết kỹ thuật",
      type: "textarea" as const,
      description: "Thông tin trang thiết bị, kỹ thuật chuyên sâu",
      hint: "VD: Hệ thống xét nghiệm tự động cobas 8000, máy sinh hóa",
      rows: 3
    },
    {
      name: "iconType",
      label: "Loại biểu tượng",
      type: "select" as const,
      required: true,
      description: "Icon đại diện cho chuyên khoa",
      hint: "Chọn biểu tượng phù hợp với chuyên khoa",
      options: iconTypeOptions
    }
  ];

  const initialData = editing ? {
    name: editing.name,
    description: editing.description,
    detail: editing.detail || "",
    iconType: editing.iconType
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-green-dark">Danh Sách Chuyên Khoa Lâm Sàng</h3>
        <Button variant="primary" size="md" onClick={() => handleOpen(null)} disabled={!canEdit}>
          <Plus size={14} />
          <span>Thêm Chuyên Khoa Mới</span>
        </Button>
      </div>

      {!canEdit && (
        <div className="bg-peach/10 text-peach p-3 rounded-xl text-xs flex items-center gap-2 border border-peach/20 font-semibold">
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

      <EditModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title={editing ? "Cập Nhật Chuyên Khoa" : "Thêm Chuyên Khoa Mới"}
        fields={fields}
        initialData={initialData}
        size="md"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa chuyên khoa"
        message={`Bạn có chắc chắn muốn xóa chuyên khoa "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa bỏ"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </div>
  );
}
