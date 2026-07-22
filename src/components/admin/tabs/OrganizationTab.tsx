import { useState, useEffect } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card, Button } from "../../ui";
import EditModal from "../ui/EditModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Plus, Edit, Trash2, RefreshCw, Search } from "lucide-react";

interface Department {
  id: string;
  name: string;
  leader: string;
  phone: string;
  staffCount: number;
  description?: string;
  details?: string;
}

interface Division {
  id: string;
  name: string;
  color: string;
  departments: Department[];
}

export default function OrganizationTab() {
  const { addLog } = useHospital();
  const { activeUser } = useAdmin();
  const [divisions, setDivisions] = useState<Record<string, Division>>({});
  const [selectedDivision, setSelectedDivision] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<{ divisionId: string; dept: Department } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ divisionId: string; deptId: string; deptName: string } | null>(null);

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

  const filteredDepts = currentDepts.filter((d: Department) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.leader.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (divisionId: string, dept: Department | null = null) => {
    if (dept) {
      setEditing({ divisionId, dept });
    } else {
      setEditing(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data: Record<string, string | number | boolean | File | null>) => {
    const form = {
      name: data.name as string,
      leader: data.leader as string,
      phone: (data.phone as string) || "",
      staffCount: Number(data.staffCount) || 0,
      description: (data.description as string) || "",
      details: (data.details as string) || ""
    };

    if (!form.name.trim() || !form.leader.trim()) return;

    try {
      let res;
      if (editing) {
        res = await fetch("/api/organization/" + editing.divisionId + "/departments/" + editing.dept.id, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch("/api/organization/" + selectedDivision + "/departments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      }

      if (res.ok) {
        await fetchData();
        addLog("Cập nhật sơ đồ tổ chức: " + (editing ? "Sửa" : "Thêm") + " khoa/phòng \"" + form.name + "\"");
      }
    } catch (err) {
      console.error("Organization CRUD error:", err);
    }
    handleCloseModal();
  };

  const handleDelete = (divisionId: string, deptId: string, deptName: string) => {
    setDeleteTarget({ divisionId, deptId, deptName });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch("/api/organization/" + deleteTarget.divisionId + "/departments/" + deleteTarget.deptId, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
        addLog("Xóa khoa/phòng \"" + deleteTarget.deptName + "\" khỏi sơ đồ tổ chức");
      }
    } catch (err) {
      console.error("Delete org dept error:", err);
    }
    setDeleteTarget(null);
  };

  const fields = [
    {
      name: "name",
      label: "Tên Khoa/Phòng",
      type: "text" as const,
      required: true,
      description: "Tên đầy đủ của khoa/phòng",
      hint: "VD: Khoa Tim Mạch, Phòng Tài Chính"
    },
    {
      name: "leader",
      label: "Trưởng khoa",
      type: "text" as const,
      required: true,
      description: "Họ tên người phụ trách",
      hint: "VD: PGS. TS. Nguyễn Văn A"
    },
    {
      name: "phone",
      label: "Số Điện Thoại",
      type: "text" as const,
      description: "Số liên hệ nội bộ",
      hint: "VD: 028 1234 5678"
    },
    {
      name: "staffCount",
      label: "Số Nhân Sự",
      type: "number" as const,
      description: "Số lượng nhân viên trong khoa/phòng",
      hint: "VD: 25"
    },
    {
      name: "description",
      label: "Mô Tả Ngắn",
      type: "textarea" as const,
      description: "Mô tả chức năng của khoa/phòng",
      hint: "VD: Chuyên điều trị các bệnh lý tim mạch",
      rows: 2
    }
  ];

  const initialData = editing ? {
    name: editing.dept.name,
    leader: editing.dept.leader,
    phone: editing.dept.phone,
    staffCount: editing.dept.staffCount,
    description: editing.dept.description || ""
  } : {};

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
            {Object.values(divisions).map((div: Division) => (
              <button key={div.id} onClick={() => setSelectedDivision(div.id)}
                className={"px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer " + (selectedDivision === div.id ? div.color + " text-white shadow-md" : "bg-white text-green-dark border border-green-800/10 hover:bg-cream-white")}>
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
                  {filteredDepts.map((dept: Department) => (
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

      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editing ? "Cập Nhật Khoa/Phòng" : "Thêm Khoa/Phòng Mới"}
        fields={fields}
        initialData={initialData}
        size="md"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa khoa/phòng"
        message={"Bạn có chắc chắn muốn xóa khoa/phòng \"" + (deleteTarget?.deptName || "") + "\"? Hành động này không thể hoàn tác."}
        confirmText="Xóa bỏ"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </div>
  );
}
