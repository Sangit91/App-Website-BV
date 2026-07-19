import { useState, FormEvent, ChangeEvent, DragEvent } from "react";
import { useHospital } from "../../../context/HospitalContext";
import { useAdmin } from "../../../context/AdminContext";
import { Card, Button } from "../../ui";
import { Plus, Edit, Trash2, ShieldAlert, Upload, Paperclip, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEPARTMENTS } from "../../../data";
import { NewsItem, TenderFile } from "../../../types/models/news";

interface NewsForm {
  title: string;
  summary: string;
  tag: string;
  image: string;
  content: string;
  isTender: boolean;
  tenderDept?: string;
  tenderStartDate?: string;
  tenderEndDate?: string;
  tenderFile?: TenderFile;
}

export default function NewsTab() {
  const { news, addNews, updateNews, deleteNews } = useHospital();
  const { activeUser } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState<NewsForm>({
    title: "",
    summary: "",
    tag: "Tin y học",
    image: "",
    content: "",
    isTender: false,
    tenderDept: "",
    tenderStartDate: "",
    tenderEndDate: "",
    tenderFile: undefined,
  });

  const [isFileDragging, setIsFileDragging] = useState(false);
  const [tenderFile, setTenderFile] = useState<File | null>(null);

  const isSuperAdmin = activeUser?.role === "Super Admin";
  const isDeptAdmin = activeUser?.role === "Department Admin";
  const canEdit = isSuperAdmin || isDeptAdmin;

  const displayedNews = isSuperAdmin
    ? news
    : news.filter((n) => n.isTender && n.tenderDept === activeUser?.department);

  const handleOpen = (item: NewsItem | null = null) => {
    if (!canEdit) return;
    if (item) {
      setEditing(item);
      setForm({
        title: item.title,
        summary: item.summary,
        tag: item.tag,
        image: item.image,
        content: item.content || "",
        isTender: item.isTender || false,
        tenderDept: item.tenderDept || "",
        tenderStartDate: item.tenderStartDate || "",
        tenderEndDate: item.tenderEndDate || "",
        tenderFile: item.tenderFile,
      });
    } else {
      setEditing(null);
      setForm({
        title: "",
        summary: "",
        tag: "Tin y học",
        image: "",
        content: "",
        isTender: isDeptAdmin,
        tenderDept: isDeptAdmin ? (activeUser?.department || "") : "",
        tenderStartDate: "",
        tenderEndDate: "",
        tenderFile: undefined,
      });
    }
    setTenderFile(null);
    setIsModalOpen(true);
  };

  const handleTenderFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeKB = (file.size / 1024).toFixed(1);
      const tenderFileObj: TenderFile = {
        name: file.name,
        size: `${fileSizeKB} KB`,
        fileType: file.type,
      };
      setTenderFile(file);
      setForm({ ...form, tenderFile: tenderFileObj });
    }
  };

  const handleTenderFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileSizeKB = (file.size / 1024).toFixed(1);
      const tenderFileObj: TenderFile = {
        name: file.name,
        size: `${fileSizeKB} KB`,
        fileType: file.type,
      };
      setTenderFile(file);
      setForm({ ...form, tenderFile: tenderFileObj });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) return;

    const finalImage = form.image.trim() || "/images/components/news-placeholder.jpeg";
    const todayStr = new Date().toLocaleDateString("vi-VN");

    if (editing) {
      updateNews({
        ...editing,
        ...form,
        image: finalImage,
        date: todayStr,
      });
    } else {
      addNews({
        ...form,
        image: finalImage,
        date: todayStr,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (!canEdit) return;
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết ${title}?`)) {
      deleteNews(id);
    }
  };

  const handleTenderCheckbox = (checked: boolean) => {
    setForm({
      ...form,
      isTender: checked,
      tag: checked ? "Thông báo" : form.tag,
      tenderStartDate: checked ? "08:00:00 ngày 15/07/2026" : "",
      tenderEndDate: checked ? "17:00:00 ngày 25/07/2026" : "",
      tenderDept: isDeptAdmin ? (activeUser?.department || "") : form.tenderDept,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-green-dark">Hồ Sơ Bản Tin Thường Thức</h3>
        <Button variant="primary" size="md" onClick={() => handleOpen()} disabled={!canEdit}>
          <Plus size={14} />
          <span>Tạo Tin Tức Mới</span>
        </Button>
      </div>

      {!canEdit && (
        <div className="bg-peach/10 text-peach-dark p-3 rounded-xl text-xs flex items-center gap-2 border border-peach/20 font-semibold">
          <ShieldAlert size={14} />
          <span>Quyền hạn vai trò của bạn ({activeUser?.role}) bị hạn chế đăng tải hay chỉnh sửa tin tức.</span>
        </div>
      )}

      <Card variant="default" padding="lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                <th className="p-3">Hình Ảnh</th>
                <th className="p-3">Nhãn Tag / Khối thầu</th>
                <th className="p-3">Tiêu Đề Tin Tức</th>
                <th className="p-3">Tóm tắt nội dung</th>
                <th className="p-3">Ngày xuất bản</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {displayedNews.map((n) => (
                <tr key={n.id} className="hover:bg-cream-white transition-colors">
                  <td className="p-3">
                    <div className="w-14 h-10 rounded-lg overflow-hidden border border-brand-green/20">
                      <img src={n.image} alt={n.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="bg-green-dark/5 text-green-dark py-0.5 px-2 rounded-md font-extrabold text-[10px] block w-fit mb-1">{n.tag}</span>
                    {n.isTender && n.tenderDept && (
                      <span className="bg-peach/10 text-peach-dark py-0.5 px-2 rounded-md font-extrabold text-[9px] block w-fit">{n.tenderDept}</span>
                    )}
                  </td>
                  <td className="p-3 font-extrabold text-green-dark max-w-[200px] truncate">{n.title}</td>
                  <td className="p-3 max-w-[250px] truncate text-ink/70">{n.summary}</td>
                  <td className="p-3 font-semibold text-ink/60">{n.date}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpen(n)}
                        disabled={!canEdit}
                        className={`p-1.5 rounded-lg transition-all ${canEdit ? "bg-mint text-brand-green hover:bg-mint/80 cursor-pointer" : "bg-ink/10 text-ink/30 cursor-not-allowed"}`}>
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(n.id, n.title)}
                        disabled={!canEdit}
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl border border-green-800/10 max-h-[92vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-brand-green to-green-dark p-5 text-white flex justify-between items-center sticky top-0 z-10">
                <h3 className="font-display font-bold text-base">
                  {editing ? "Cập Nhật Bài Đăng Tin Tức" : "Tạo Bản Tin Y Khoa Mới"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-green-dark">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Tiêu đề tin tức</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Thông báo lịch nghỉ lễ / Đổi mới trang thiết bị..."
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Thẻ Tag</label>
                    <select
                      value={form.tag}
                      onChange={(e) => setForm({ ...form, tag: e.target.value })}
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                    >
                      <option value="Tin y học">Tin y học</option>
                      <option value="Thông báo">Thông báo</option>
                      <option value="Sự kiện">Sự kiện</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Tóm tắt ngắn (Summary)</label>
                  <textarea
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    rows={2}
                    required
                    placeholder="Bản tóm tắt xuất hiện tại trang chủ cho bà con tiện theo dõi..."
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Ảnh minh họa (Unsplash / Pexels URL)</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Dán link ảnh y tế..."
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                  />
                </div>

                <div className="bg-green-dark/5 p-4 rounded-xl border border-brand-green/20 space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="newsIsTender"
                      checked={form.isTender}
                      onChange={(e) => handleTenderCheckbox(e.target.checked)}
                      className="rounded border-brand-green/30 text-brand-green focus:ring-brand-green cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="newsIsTender" className="text-xs font-bold text-green-dark cursor-pointer select-none">
                      Đây là thông tin Đấu thầu / Mua sắm trang thiết bị y khoa
                    </label>
                  </div>

                  {form.isTender && (
                    <div className="space-y-3 pt-2 border-t border-brand-green/10">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-green-dark/70">Khối / Phòng ban quản lý thầu</label>
                        {isDeptAdmin ? (
                          <div className="p-2.5 bg-green-dark/5 text-green-dark font-bold rounded-lg text-xs border border-green-800/10">
                            {activeUser.department} (Tự động áp dụng theo tài khoản của bạn)
                          </div>
                        ) : (
                          <select
                            value={form.tenderDept || ""}
                            onChange={(e) => setForm({ ...form, tenderDept: e.target.value })}
                            className="w-full p-2 bg-white border border-green-800/10 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green text-xs font-semibold text-green-dark"
                          >
                            <option value="">-- Chọn khối/phòng --</option>
                            {DEPARTMENTS.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-green-dark/70">Thời điểm mở thầu</label>
                          <input
                            type="text"
                            value={form.tenderStartDate || ""}
                            onChange={(e) => setForm({ ...form, tenderStartDate: e.target.value })}
                            placeholder="Ví dụ: 08:00:00 ngày 15/07/2026"
                            className="w-full p-2 bg-white border border-green-800/10 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-green-dark/70">Thời điểm khóa thầu</label>
                          <input
                            type="text"
                            value={form.tenderEndDate || ""}
                            onChange={(e) => setForm({ ...form, tenderEndDate: e.target.value })}
                            placeholder="Ví dụ: 17:00:00 ngày 25/07/2026"
                            className="w-full p-2 bg-white border border-green-800/10 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-green-dark/70">Tài liệu thầu đính kèm (PDF, PNG)</label>

                        {!tenderFile && !form.tenderFile ? (
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsFileDragging(true); }}
                            onDragLeave={() => setIsFileDragging(false)}
                            onDrop={handleTenderFileDrop}
                            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                              isFileDragging
                                ? "border-brand-green bg-mint"
                                : "border-green-800/20 bg-white hover:border-brand-green/50"
                            }`}
                          >
                            <input
                              type="file"
                              id="tenderFileInput"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={handleTenderFileChange}
                              className="hidden"
                            />
                            <label htmlFor="tenderFileInput" className="cursor-pointer space-y-1 block">
                              <Upload className="mx-auto w-6 h-6 text-brand-green" />
                              <p className="text-xs font-bold text-green-dark">Kéo thả tài liệu thầu hoặc nhấp để chọn tệp</p>
                              <p className="text-[10px] text-gray-500">Chấp nhận định dạng .pdf, .png, .jpg (Tối đa 10MB)</p>
                            </label>
                          </div>
                        ) : (
                          <div className="bg-white border border-green-800/10 rounded-xl p-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Paperclip className="text-brand-green shrink-0" size={16} />
                              <div className="truncate">
                                <p className="text-xs font-bold text-green-dark truncate max-w-[220px]" title={form.tenderFile?.name}>{form.tenderFile?.name}</p>
                                {tenderFile && (
                                  <p className="text-[10px] text-gray-500">{(tenderFile.size / 1024).toFixed(1)} KB</p>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setTenderFile(null);
                                setForm({ ...form, tenderFile: undefined });
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa tệp đính kèm"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Nội dung chi tiết bài viết</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={6}
                    placeholder="Nhập nội dung chi tiết bài đăng..."
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green font-sans text-xs leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-ink/5">
                  <Button type="button" variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
                  <Button type="submit" variant="primary" size="md">{editing ? "Cập Nhật" : "Xuất Bản"}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}