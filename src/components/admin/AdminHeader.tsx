import { Button } from "../ui";

const PAGE_TITLES: Record<string, string> = {
  overview: "Báo Cáo Hoạt Động Lâm Sàng",
  bookings: "Danh Sách Đăng Ký Lịch Khám",
  patients: "Hồ Sơ & Danh Sách Bệnh Nhân",
  shifts: "Bảng Phân Ca & Trực Tuần",
  specialties: "Cơ cấu Chuyên khoa Lâm sàng",
  doctors: "Cơ sở dữ liệu Bác sĩ Trực thuộc",
  news: "Nội dung Tin Tức & Y học Thường Thức",
  organization: "Sơ Đồ Tổ Chức Bệnh Viện",
  logs: "Nhật Ký Ghi Chép Bảo Mật (Audit Logs)",
};

interface AdminHeaderProps {
  activeTab: string;
}

export default function AdminHeader({ activeTab }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-green-800/10 pb-5 gap-4">
      <div>
        <p className="text-xs font-extrabold text-brand-green uppercase tracking-widest">Hệ thống đồng bộ trực tuyến</p>
        <h1 className="font-display font-bold text-2xl text-green-dark">
          {PAGE_TITLES[activeTab] || "Báo Cáo Hoạt Động Lâm Sàng"}
        </h1>
      </div>

      <div className="flex items-center gap-2 text-[11px] bg-mint text-green-dark border border-brand-green/25 font-bold py-1.5 px-3.5 rounded-full shrink-0">
        <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping" />
        <span>HỆ THỐNG LIVE SYNC SẴN SÀNG</span>
      </div>
    </div>
  );
}