export interface SiteFacility {
  id: string;
  title: string;
  description: string;
  image: string;
  items: string[];
}

export interface SiteWhyChoose {
  id: string;
  title: string;
  desc: string;
  image: string;
}

export interface SiteDirector {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface SiteAbout {
  whyChoose: SiteWhyChoose[];
  partners: string[];
  facilities: SiteFacility[];
  directors: SiteDirector[];
}

export const DEFAULT_ABOUT: SiteAbout = {
  whyChoose: [
    {
      id: "wc1",
      title: "Đội ngũ bác sĩ chuyên môn cao",
      desc: "100% bác sĩ có trình độ sau đại học, giàu kinh nghiệm và y đức",
      image: "/images/components/why-choose-1.jpeg",
    },
    {
      id: "wc2",
      title: "Trang thiết bị hiện đại",
      desc: "Hệ thống MRI, CT Scanner, máy nội soi Olympus thế hệ mới",
      image: "/images/components/why-choose-2.jpeg",
    },
    {
      id: "wc3",
      title: "Quy trình chuyên nghiệp",
      desc: "Quy trình khám chữa bệnh chuẩn quốc tế, an toàn và hiệu quả",
      image: "/images/pages/hoso-1.jpeg",
    },
    {
      id: "wc4",
      title: "Thái độ phục vụ tận tâm",
      desc: "Chăm sóc người bệnh như người nhà, 24/7 mọi lúc mọi nơi",
      image: "/images/pages/nhi-1.jpeg",
    },
  ],
  partners: ["BHYT Quảng Nam", "Bảo Việt", "PTI", "PJICO", "Manulife", "Prudential"],
  facilities: [
    {
      id: "f1",
      title: "Cơ sở – Trang thiết bị",
      description: "Hệ thống phòng mổ và thiết bị y tế hiện đại",
      image: "/images/pages/coso-1.jpeg",
      items: ["5 phòng mổ hiện đại", "200 giường bệnh", "Thiết bị MRI, CT Scanner", "Phòng ICU với 20 giường"],
    },
    {
      id: "f2",
      title: "Hình ảnh bệnh viện",
      description: "Không gian khám chữa bệnh thoáng mát",
      image: "/images/pages/coso-2.jpeg",
      items: ["Không gian sạch sẽ, thoáng mát", "Khu vườn cây xanh mát", "Phòng chờ hiện đại", "Khuôn viên rộng 5 hecta"],
    },
    {
      id: "f3",
      title: "Tiện nghi – Sang trọng",
      description: "Các tiện ích cho bệnh nhân và người nhà",
      image: "/images/pages/vip-1.jpeg",
      items: ["Wifi miễn phí toàn bệnh viện", "Nhà hàng cao cấp", "Khu vui chơi trẻ em", "Bãi đỗ xe rộng rãi"],
    },
  ],
  directors: [
    { id: "d1", name: "BS CKII Nguyễn Thống Nhất", role: "Giám đốc", image: "/images/doctors/giamdoc-1.jpeg", bio: "Bác sĩ chuyên khoa II với hơn 20 năm kinh nghiệm" },
    { id: "d2", name: "BSCK II Lê Minh Dũng", role: "Phó Giám đốc", image: "/images/doctors/phogiamdoc-1.jpeg", bio: "Phó Giám đốc phụ trách chuyên môn" },
    { id: "d3", name: "BS CKII Nguyễn Đình Hoàng", role: "Phó Giám đốc", image: "/images/doctors/phogiamdoc-2.jpeg", bio: "Phó Giám đốc phụ trách hành chính" },
  ],
};
