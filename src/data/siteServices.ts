import { Calendar, Home, Syringe, Shield, Heart, Truck, Plane, type LucideIcon } from "lucide-react";

export interface SiteServiceItem {
  id: string;
  name: string;
  desc: string;
  price: string;
  img: string;
  highlight?: boolean;
}

export interface SiteServiceCategory {
  key: string;
  title: string;
  icon: string;
  color: string;
  bgLight: string;
  textColor: string;
  heroImage: string;
  description: string;
  items: SiteServiceItem[];
}

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Calendar,
  Home,
  Syringe,
  Shield,
  Heart,
  Truck,
  Plane,
};

export const SERVICE_COLOR_OPTIONS = [
  { value: "from-orange-500 to-amber-600", label: "Cam" },
  { value: "from-blue-500 to-cyan-600", label: "Xanh dương" },
  { value: "from-green-500 to-emerald-600", label: "Xanh lá" },
  { value: "from-purple-500 to-violet-600", label: "Tím" },
  { value: "from-pink-500 to-rose-600", label: "Hồng" },
  { value: "from-teal-500 to-cyan-600", label: "Teal" },
];

export const DEFAULT_SERVICES: SiteServiceCategory[] = [
  {
    key: "dich-vu-tron-goi",
    title: "Dịch vụ trọn gói",
    icon: "Calendar",
    color: "from-orange-500 to-amber-600",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
    heroImage: "/images/pages/hero-dichvu.jpeg",
    description: "Các gói dịch vụ y tế toàn diện từ khám định kỳ đến điều trị chuyên sâu",
    items: [
      { id: "s1", name: "Dịch vụ trọn gói", desc: "Gói khám, điều trị toàn diện", price: "Từ 5.000.000đ", img: "/images/pages/vip-1.jpeg", highlight: true },
      { id: "s2", name: "Kiến thức thai sản", desc: "Tư vấn, chăm sóc mẹ và bé", price: "Miễn phí", img: "/images/pages/sanphukhoa-1.jpeg" },
      { id: "s3", name: "Điều trị vô sinh, hiếm muộn", desc: "IVF, IUI, các phương pháp hỗ trợ", price: "Từ 15.000.000đ", img: "/images/pages/timmach-1.jpeg" },
      { id: "s4", name: "Dịch vụ thai sản và sinh trọn gói", desc: "Theo dõi thai kỳ, sinh con", price: "Từ 25.000.000đ", img: "/images/pages/sanphukhoa-1.jpeg" },
    ],
  },
  {
    key: "tai-nha-van-chuyen",
    title: "Tại nhà & Vận chuyển",
    icon: "Home",
    color: "from-blue-500 to-cyan-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    heroImage: "/images/pages/hero-tainha.jpeg",
    description: "Dịch vụ chăm sóc tại nhà và vận chuyển bệnh nhân an toàn",
    items: [
      { id: "s5", name: "Dịch vụ khám tại nhà", desc: "Bác sĩ đến tận nhà khám", price: "Từ 500.000đ", img: "/images/pages/tainha-1.jpeg", highlight: true },
      { id: "s6", name: "Dịch vụ vận chuyển cấp cứu", desc: "Xe cấp cứu 24/7", price: "Theo km", img: "/images/pages/vanchuyen-1.jpeg" },
      { id: "s7", name: "Khám bệnh và xét nghiệm tại nhà", desc: "Lấy mẫu xét nghiệm tại nhà", price: "Từ 300.000đ", img: "/images/pages/xetnghiem-1.jpeg" },
    ],
  },
  {
    key: "tiem-chung",
    title: "Tiêm chủng",
    icon: "Syringe",
    color: "from-green-500 to-emerald-600",
    bgLight: "bg-green-50",
    textColor: "text-green-600",
    heroImage: "/images/pages/hero-tiemchung.jpeg",
    description: "Đầy đủ các loại vaccine cho trẻ em và người lớn",
    items: [
      { id: "s8", name: "Tiêm chủng – Vaccine", desc: "Đầy đủ các loại vaccine", price: "Từ 200.000đ", img: "/images/pages/tiemchung-1.jpeg", highlight: true },
      { id: "s9", name: "Dịch vụ tiêm chủng", desc: "Tiêm tại bệnh viện hoặc tại nhà", price: "Từ 150.000đ", img: "/images/pages/tiemchung-1.jpeg" },
      { id: "s10", name: "Tiêm vaccine tại Bệnh viện", desc: "Phòng tiêm hiện đại, an toàn", price: "Theo loại vaccine", img: "/images/pages/tiemchung-1.jpeg" },
      { id: "s11", name: "Tư vấn tiêm chủng trẻ em", desc: "Lịch tiêm, giấy tờ đầy đủ", price: "Miễn phí", img: "/images/pages/nhi-1.jpeg" },
    ],
  },
  {
    key: "bao-hiem-vip",
    title: "Bảo hiểm & VIP",
    icon: "Shield",
    color: "from-purple-500 to-violet-600",
    bgLight: "bg-purple-50",
    textColor: "text-purple-600",
    heroImage: "/images/pages/hero-chi-phi.jpeg",
    description: "Dịch vụ cao cấp và bảo hiểm y tế toàn diện",
    items: [
      { id: "s12", name: "Bảo hiểm Bệnh viện", desc: "Các gói bảo hiểm y tế", price: "Theo gói", img: "/images/pages/bhyt-1.jpeg", highlight: true },
      { id: "s13", name: "Dịch vụ VIP", desc: "Phòng VIP, bác sĩ riêng", price: "Từ 2.000.000đ/ngày", img: "/images/pages/vip-1.jpeg" },
      { id: "s14", name: "Trung tâm Khám bệnh Quốc tế IMC", desc: "Dịch vụ quốc tế", price: "Liên hệ", img: "/images/pages/bacsi-1.jpeg" },
      { id: "s15", name: "Tour Du lịch – Sức khỏe", desc: "Kết hợp khám và du lịch", price: "Theo tour", img: "/images/pages/muangoi-1.jpeg" },
      { id: "s16", name: "Thẩm mỹ & Spa da liễu", desc: "Làm đẹp, chăm sóc da", price: "Từ 500.000đ", img: "/images/pages/thammy-1.jpeg" },
    ],
  },
  {
    key: "goi-kham",
    title: "Gói khám",
    icon: "Heart",
    color: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50",
    textColor: "text-pink-600",
    heroImage: "/images/pages/hero-tongquat.jpeg",
    description: "Các gói khám sức khỏe linh hoạt cho mọi nhu cầu",
    items: [
      { id: "s17", name: "Gói khám sức khỏe định kỳ", desc: "Tổng quát, toàn diện", price: "Từ 1.500.000đ", img: "/images/pages/khamtongquat-1.jpeg", highlight: true },
      { id: "s18", name: "Khám sức khỏe công ty", desc: "Kiểm tra sức khỏi nhân viên", price: "Từ 500.000đ/người", img: "/images/pages/bacsi-1.jpeg" },
      { id: "s19", name: "Khám sức khỏe tổng quát cá nhân", desc: "Gói cơ bản, nâng cao", price: "Từ 800.000đ", img: "/images/pages/khamtongquat-1.jpeg" },
      { id: "s20", name: "Khám xuất khẩu lao động", desc: "Giấy khám sức khỏe chuẩn", price: "Từ 300.000đ", img: "/images/pages/chiphi-1.jpeg" },
    ],
  },
];
