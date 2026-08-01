import { useState } from "react";
import { motion } from "framer-motion";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card, Button } from "../../ui";
import EditModal from "../ui/EditModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Plus, Edit, Trash2, ShieldAlert, Heart, Baby, Stethoscope, Ambulance, Microscope, Ear, Syringe, Activity } from "lucide-react";
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

const iconMap: Record<string, typeof Heart> = {
  general: Activity,
  cardiology: Heart,
  obstetrics: Baby,
  pediatrics: Baby,
  emergency: Ambulance,
  diagnostics: Microscope,
  ent: Ear,
  odontology: Syringe,
};

const colorMap: Record<string, string> = {
  general: "bg-blue-100 text-blue-700",
  cardiology: "bg-red-100 text-red-700",
  obstetrics: "bg-pink-100 text-pink-700",
  pediatrics: "bg-cyan-100 text-cyan-700",
  emergency: "bg-orange-100 text-orange-700",
  diagnostics: "bg-purple-100 text-purple-700",
  ent: "bg-teal-100 text-teal-700",
  odontology: "bg-amber-100 text-amber-700",
};

const accentMap: Record<string, string> = {
  general: "border-l-blue-400",
  cardiology: "border-l-red-400",
  obstetrics: "border-l-pink-400",
  pediatrics: "border-l-cyan-400",
  emergency: "border-l-orange-400",
  diagnostics: "border-l-purple-400",
  ent: "border-l-teal-400",
  odontology: "border-l-amber-400",
};

const stickyHeaderClass = "sticky top-0 z-10 bg-cream-white/95 backdrop-blur-sm";

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

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" as const }
    })
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green/20 to-green-dark/20 flex items-center justify-center shadow-sm">
            <Stethoscope size={18} className="text-brand-green" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-green-dark">Chuyên Khoa Lâm Sàng</h3>
            <p className="text-[11px] text-ink/50">Quản lý {specialties.length} chuyên khoa đang hoạt động</p>
          </div>
        </div>
        <Button variant="primary" size="md" onClick={() => handleOpen(null)} disabled={!canEdit}>
          <Plus size={14} />
          <span>Thêm Chuyên Khoa</span>
        </Button>
      </div>

      {!canEdit && (
        <div className="bg-peach/10 text-peach p-3 rounded-xl text-xs flex items-center gap-2 border border-peach/20 font-semibold">
          <ShieldAlert size={14} />
          <span>Quyền hạn vai trò của bạn ({activeUser?.role}) bị hạn chế thêm/sửa đổi chuyên khoa.</span>
        </div>
      )}

      <Card variant="default" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b border-ink/5 text-ink/60 font-semibold uppercase ${stickyHeaderClass}`}>
                <th className="p-3 w-10"></th>
                <th className="p-3">Tên Chuyên Khoa</th>
                <th className="p-3">Mô Tả Tóm Tắt</th>
                <th className="p-3 hidden md:table-cell">Mô tả chi tiết kỹ thuật</th>
                <th className="p-3 text-right w-24">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {specialties.map((s, i) => {
                const Icon = iconMap[s.iconType as keyof typeof iconMap] || Activity;
                const colorClass = colorMap[s.iconType as keyof typeof colorMap] || "bg-gray-100 text-gray-700";
                const accentClass = accentMap[s.iconType as keyof typeof accentMap] || "border-l-gray-400";

                return (
                  <motion.tr
                    key={s.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    className={`group hover:bg-cream-white/80 transition-all duration-200 border-l-2 ${accentClass} border-l-2`}
                  >
                    <td className="p-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm transition-transform duration-200 group-hover:scale-110 ${colorClass}`}>
                        <Icon size={14} />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-green-dark text-sm">{s.name}</span>
                        <span className="text-[10px] text-ink/40 font-mono mt-0.5">{s.id}</span>
                      </div>
                    </td>
                    <td className="p-3 max-w-[220px]">
                      <span className="text-ink/80 leading-relaxed">{s.description}</span>
                    </td>
                    <td className="p-3 max-w-[260px] hidden md:table-cell">
                      <span className="text-ink/60 leading-relaxed line-clamp-2">{s.detail}</span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
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
                  </motion.tr>
                );
              })}
              {specialties.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-ink/40">
                    <Activity size={24} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">Chưa có chuyên khoa nào</p>
                    <p className="text-xs mt-1">Nhấn "Thêm Chuyên Khoa" để bắt đầu</p>
                  </td>
                </tr>
              )}
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
