export interface SiteHomeHero {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export interface SiteQuickAction {
  id: string;
  title: string;
  icon: string;
  link: string;
  color: string;
}

export interface SiteWhyChooseReason {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SiteStatistic {
  value: string;
  label: string;
}

export interface SiteTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating?: number;
}

export interface SiteHome {
  hero: SiteHomeHero;
  quickActions: SiteQuickAction[];
  whyChoose: SiteWhyChooseReason[];
  stats: SiteStatistic[];
  testimonials: SiteTestimonial[];
}

export const DEFAULT_HOME: SiteHome = {
  hero: {
    title: "Chăm sóc sức khỏe toàn diện",
    subtitle: "Bệnh viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam",
    ctaText: "Đặt lịch khám ngay",
    ctaLink: "/dat-lich",
    backgroundImage: "/images/bg-hero.jpg",
  },
  quickActions: [
    { id: "1", title: "Đặt lịch khám", icon: "calendar", link: "/dat-lich", color: "from-brand-green to-emerald-600" },
    { id: "2", title: "Chuyên khoa", icon: "stethoscope", link: "/chuyen-khoa", color: "from-blue-500 to-cyan-600" },
    { id: "3", title: "Bảng giá dịch vụ", icon: "document", link: "/dich-vu", color: "from-purple-500 to-violet-600" },
    { id: "4", title: "Tin tức", icon: "newspaper", link: "/tin-tuc", color: "from-rose-500 to-pink-600" },
    { id: "5", title: "Hướng dẫn", icon: "book", link: "/cho-benh-nhan", color: "from-amber-500 to-orange-600" },
    { id: "6", title: "Liên hệ", icon: "phone", link: "/lien-he", color: "from-teal-500 to-cyan-600" },
  ],
  whyChoose: [
    { id: "1", title: "Đội ngũ bác sĩ chuyên môn cao", description: "Bác sĩ có nhiều năm kinh nghiệm và chứng chỉ quốc tế", icon: "user-check" },
    { id: "2", title: "Trang thiết bị hiện đại", description: "Hệ thống máy móc và thiết bị y tế tiên tiến nhất", icon: "activity" },
    { id: "3", title: "Quy trình khám chuẩn quốc tế", description: "Áp dụng quy trình JCI đảm bảo chất lượng", icon: "clipboard" },
    { id: "4", title: "Chăm sóc tận tâm 24/7", description: "Đội ngũ y tá luôn sẵn sàng hỗ trợ mọi lúc", icon: "heart" },
  ],
  stats: [
    { value: "15+", label: "Năm kinh nghiệm" },
    { value: "50+", label: "Bác sĩ chuyên khoa" },
    { value: "1000+", label: "Bệnh nhân/tháng" },
    { value: "20+", label: "Chuyên khoa" },
  ],
  testimonials: [
    { id: "1", name: "Nguyễn Văn A", role: "Bệnh nhân", content: "Đội ngũ bác sĩ rất tận tâm, chăm sóc bệnh nhân chu đáo. Tôi rất hài lòng với dịch vụ tại đây.", rating: 5 },
    { id: "2", name: "Trần Thị B", role: "Người nhà bệnh nhân", content: "Bệnh viện sạch sẽ, hiện đại. Quy trình khám nhanh chóng, không phải chờ đợi lâu.", rating: 5 },
    { id: "3", name: "Lê Văn C", role: "Bệnh nhân", content: "Bác sĩ giỏi, máy móc thiết bị hiện đại. Chi phí hợp lý, phù hợp với người dân.", rating: 4 },
  ],
};
