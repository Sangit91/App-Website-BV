import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, Calendar, Heart, ChevronDown, ChevronRight, Landmark, Users, Briefcase, FileText, Settings } from "lucide-react";
import HospitalLogo from "./HospitalLogo";

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  onOpenBooking: () => void;
  onOpenAI: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onNavClick, onOpenBooking, onOpenAI, onOpenAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("trang-chu");
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple active section detection based on scroll position
      const sections = ["trang-chu", "gioi-thieu", "chuyen-khoa", "dich-vu", "bac-si", "tin-tuc", "lien-he"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menuId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredMenu(menuId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 150);
  };

  const menuRoutes: Record<string, string> = {
    "gioi-thieu": "/gioi-thieu",
    "chuyen-khoa": "/chuyen-khoa",
    "dich-vu": "/dich-vu",
    "benh-nhan": "/cho-benh-nhan",
    "tin-tuc": "/tin-tuc"
  };

  // Link to section mapping for mega menu navigation
  const linkSections: Record<string, string> = {
    // Gioi Thieu
    "Tại sao lại chọn Bệnh viện": "/gioi-thieu#ve-chung-toi",
    "Đối tác của Bệnh viện": "/gioi-thieu#ve-chung-toi",
    "Ban Giám Đốc": "/so-do-to-chuc",
    "Sơ đồ tổ chức": "/so-do-to-chuc",
    "Cơ sở – Trang thiết bị": "/gioi-thieu#co-so-vat-chat",
    "Hình ảnh bệnh viện": "/gioi-thieu#co-so-vat-chat",
    "Tiện nghi – sang trọng": "/gioi-thieu#co-so-vat-chat",
    "Quy trình chăm sóc khép kín": "/gioi-thieu#quy-trinh-cham-soc",
    "Hướng dẫn đặt khám nhanh": "/gioi-thieu#quy-trinh-cham-soc",
    "Hỗ trợ bảo hiểm trực tiếp": "/gioi-thieu#quy-trinh-cham-soc",
    // Chuyen Khoa
    "Ngoại & Cấp cứu": "/chuyen-khoa#ngoai-cap-cuu",
    "Khoa Ngoại chung": "/chuyen-khoa#ngoai-cap-cuu",
    "Khoa Răng Hàm Mặt": "/chuyen-khoa#ngoai-cap-cuu",
    "Khoa Tai – Mũi – Họng": "/chuyen-khoa#ngoai-cap-cuu",
    "Khoa Hồi sức tích cực ICU": "/chuyen-khoa#ngoai-cap-cuu",
    "Khoa ung bướu": "/chuyen-khoa#ngoai-cap-cuu",
    "Nội tổng quát": "/chuyen-khoa#noi-tong-quat",
    "Khoa Nội chung": "/chuyen-khoa#noi-tong-quat",
    "Khoa Tim mạch": "/chuyen-khoa#noi-tong-quat",
    "Khoa Nội tiết": "/chuyen-khoa#noi-tong-quat",
    "Khoa Thận nhân tạo": "/chuyen-khoa#noi-tong-quat",
    "Khoa Cơ Xương Khớp": "/chuyen-khoa#noi-tong-quat",
    "Khoa Da Liễu": "/chuyen-khoa#noi-tong-quat",
    "Khoa Tâm lý & Sức khỏe": "/chuyen-khoa#noi-tong-quat",
    "Sản & Nhi": "/chuyen-khoa#san-nhi",
    "Khoa Sản phụ khoa": "/chuyen-khoa#san-nhi",
    "Khoa Nhi & Sơ sinh": "/chuyen-khoa#san-nhi",
    "Khoa Thẩm mỹ và chăm sóc trị liệu": "/chuyen-khoa#san-nhi",
    "Cận lâm sàng": "/chuyen-khoa#can-lam-sang",
    "Khoa Dược": "/chuyen-khoa#can-lam-sang",
    "Khoa Mắt": "/chuyen-khoa#can-lam-sang",
    "Khoa Xét nghiệm và Giải phẫu": "/chuyen-khoa#can-lam-sang",
    "Khoa Y tế dự phòng": "/chuyen-khoa#can-lam-sang",
    "Khoa Chẩn đoán hình ảnh": "/chuyen-khoa#can-lam-sang",
    // Dich Vu
    "Dịch vụ trọn gói": "/dich-vu#dich-vu-tron-goi",
    "Kiến thức thai sản": "/dich-vu#dich-vu-tron-goi",
    "Điều trị vô sinh, hiếm muộn": "/dich-vu#dich-vu-tron-goi",
    "Dịch vụ thai sản và sinh trọn gói": "/dich-vu#dich-vu-tron-goi",
    "Tại nhà & Vận chuyển": "/dich-vu#tai-nha-van-chuyen",
    "Dịch vụ khám tại nhà": "/dich-vu#tai-nha-van-chuyen",
    "Dịch vụ vận chuyển cấp cứu": "/dich-vu#tai-nha-van-chuyen",
    "Khám bệnh và xét nghiệm tại nhà": "/dich-vu#tai-nha-van-chuyen",
    "Tiêm chủng": "/dich-vu#tiem-chung",
    "Tiêm chủng – Vaccine": "/dich-vu#tiem-chung",
    "Dịch vụ tiêm chủng": "/dich-vu#tiem-chung",
    "Tiêm vaccine tại Bệnh viện": "/dich-vu#tiem-chung",
    "Tư vấn tiêm chủng trẻ em": "/dich-vu#tiem-chung",
    "Bảo hiểm & VIP": "/dich-vu#bao-hiem-vip",
    "Bảo hiểm Bệnh viện": "/dich-vu#bao-hiem-vip",
    "Dịch vụ VIP": "/dich-vu#bao-hiem-vip",
    "Trung tâm Khám bệnh Quốc tế IMC": "/dich-vu#bao-hiem-vip",
    "Tour Du lịch – Sức khỏe": "/dich-vu#bao-hiem-vip",
    "Thẩm mỹ & Spa da liễu": "/dich-vu#bao-hiem-vip",
    "Gói khám": "/dich-vu#goi-kham",
    "Gói khám sức khỏe định kỳ": "/dich-vu#goi-kham",
    "Khám sức khỏe công ty": "/dich-vu#goi-kham",
    "Khám sức khỏe tổng quát cá nhân": "/dich-vu#goi-kham",
    "Khám xuất khẩu lao động": "/dich-vu#goi-kham",
    // Cho benh nhan
    "Chi phí & Địa điểm": "/cho-benh-nhan#chi-phi-dia-diem",
    "Chi phí điều trị công khai": "/cho-benh-nhan#chi-phi-dia-diem",
    "Cơ sở điều trị": "/cho-benh-nhan#chi-phi-dia-diem",
    "Danh mục thuốc BHYT": "/cho-benh-nhan#chi-phi-dia-diem",
    "Hướng dẫn tiện ích": "/cho-benh-nhan#huong-dan-tien-ich",
    "Dịch vụ điều trị": "/cho-benh-nhan#huong-dan-tien-ich",
    "Dành cho bệnh nhân nội trú": "/cho-benh-nhan#huong-dan-tien-ich",
    "Dành cho thăm khám ngoại trú": "/cho-benh-nhan#huong-dan-tien-ich",
    "Cổng thông tin": "/cho-benh-nhan#cong-thong-tin",
    "Tra cứu bệnh sử online": "/cho-benh-nhan#cong-thong-tin",
    "Yêu cầu trích sao hồ sơ": "/cho-benh-nhan#cong-thong-tin",
    "Góp ý chất lượng phục vụ": "/cho-benh-nhan#cong-thong-tin",
    // Tin tuc
    "Tin tuyển dụng nhân sự": "/tin-tuc",
    "Thông tin sự kiện bệnh viện": "/tin-tuc",
    "Ưu đãi – Giảm giá khám": "/tin-tuc",
    "Lời khuyên cho sức khỏe": "/tin-tuc",
    "Bác sĩ tư vấn trực tuyến": "/tin-tuc",
    "Thư viện ảnh Gallery": "/tin-tuc",
    "Thông báo thầu & Mua sắm công": "/thong-tin-thau",
  };

  const getLinkRoute = (link: string): string => {
    return linkSections[link] || menuRoutes[hoveredMenu] || "/";
  };

  const getMobileLinkRoute = (link: string, menuId: string): string => {
    return linkSections[link] || menuRoutes[menuId] || "/";
  };

  const toggleMobileExpanded = (menuId: string) => {
    setMobileExpanded(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    setHoveredMenu(null);
    onNavClick(id);
  };

  // Mega Menu Catalog contents
  const megaMenuData: Record<string, any> = {
    "gioi-thieu": {
      title: "GIỚI THIỆU",
      columns: [
        {
          title: "Về chúng tôi",
          links: ["Tại sao lại chọn Bệnh viện", "Đối tác của Bệnh viện", "Ban Giám Đốc", "Sơ đồ tổ chức"]
        },
        {
          title: "Cơ sở vật chất",
          links: ["Cơ sở – Trang thiết bị", "Hình ảnh bệnh viện", "Tiện nghi – sang trọng"]
        },
        {
          title: "Quy trình chăm sóc",
          links: ["Quy trình chăm sóc khép kín", "Hướng dẫn đặt khám nhanh", "Hỗ trợ bảo hiểm trực tiếp"]
        }
      ]
    },
    "chuyen-khoa": {
      title: "CHUYÊN KHOA",
      columns: [
        {
          title: "Ngoại & Cấp cứu",
          links: ["Khoa Ngoại chung", "Khoa Răng Hàm Mặt", "Khoa Tai – Mũi – Họng", "Khoa Hồi sức tích cực ICU", "Khoa ung bướu"]
        },
        {
          title: "Nội tổng quát",
          links: ["Khoa Nội chung", "Khoa Tim mạch", "Khoa Nội tiết", "Khoa Thận nhân tạo", "Khoa Cơ Xương Khớp", "Khoa Da Liễu", "Khoa Tâm lý & Sức khỏe"]
        },
        {
          title: "Sản & Nhi",
          links: ["Khoa Sản phụ khoa", "Khoa Nhi & Sơ sinh", "Khoa Thẩm mỹ và chăm sóc trị liệu"]
        },
        {
          title: "Cận lâm sàng",
          links: ["Khoa Dược", "Khoa Mắt", "Khoa Xét nghiệm và Giải phẫu", "Khoa Y tế dự phòng", "Khoa Chẩn đoán hình ảnh"]
        }
      ]
    },
    "dich-vu": {
      title: "DỊCH VỤ",
      columns: [
        {
          title: "Trọn gói",
          links: ["Dịch vụ trọn gói", "Kiến thức thai sản", "Điều trị vô sinh, hiếm muộn", "Dịch vụ thai sản và sinh trọn gói"]
        },
        {
          title: "Tại nhà & Vận chuyển",
          links: ["Dịch vụ khám tại nhà", "Dịch vụ vận chuyển cấp cứu", "Khám bệnh và xét nghiệm tại nhà"]
        },
        {
          title: "Tiêm chủng",
          links: ["Tiêm chủng – Vaccine", "Dịch vụ tiêm chủng", "Tiêm vaccine tại Bệnh viện", "Tư vấn tiêm chủng trẻ em"]
        },
        {
          title: "Bảo hiểm & VIP",
          links: ["Bảo hiểm Bệnh viện", "Dịch vụ VIP", "Trung tâm Khám bệnh Quốc tế IMC", "Tour Du lịch – Sức khỏe", "Thẩm mỹ & Spa da liễu"]
        },
        {
          title: "Gói khám",
          links: ["Gói khám sức khỏe định kỳ", "Khám sức khỏe công ty", "Khám sức khỏe tổng quát cá nhân", "Khám xuất khẩu lao động"]
        }
      ]
    },
    "benh-nhan": {
      title: "DÀNH CHO BỆNH NHÂN",
      columns: [
        {
          title: "Chi phí & Địa điểm",
          links: ["Chi phí điều trị công khai", "Cơ sở điều trị", "Danh mục thuốc BHYT"]
        },
        {
          title: "Hướng dẫn tiện ích",
          links: ["Dịch vụ điều trị", "Dành cho bệnh nhân nội trú", "Dành cho thăm khám ngoại trú"]
        },
        {
          title: "Cổng thông tin",
          links: ["Tra cứu bệnh sử online", "Yêu cầu trích sao hồ sơ", "Góp ý chất lượng phục vụ"]
        }
      ]
    },
    "tin-tuc": {
      title: "TIN TỨC & ĐỘI NGŨ",
      columns: [
        {
          title: "Thông tin sự kiện",
          links: ["Tin tuyển dụng nhân sự", "Thông tin sự kiện bệnh viện", "Ưu đãi – Giảm giá khám"]
        },
        {
          title: "Y khoa & Sức khỏe",
          links: ["Lời khuyên cho sức khỏe", "Bác sĩ tư vấn trực tuyến", "Thư viện ảnh Gallery", "Thông báo thầu & Mua sắm công"]
        }
      ]
    }
  };

  const navItems = [
    { label: "Trang chủ", id: "trang-chu", hasMega: false, route: "/" },
    { label: "Giới thiệu", id: "gioi-thieu", hasMega: true, route: "/gioi-thieu" },
    { label: "Chuyên khoa", id: "chuyen-khoa", hasMega: true, route: "/chuyen-khoa" },
    { label: "Dịch vụ", id: "dich-vu", hasMega: true, route: "/dich-vu" },
    { label: "Cho bệnh nhân", id: "benh-nhan", hasMega: true, route: "/cho-benh-nhan" },
    { label: "Tin tức", id: "tin-tuc", hasMega: true, route: "/tin-tuc" }
  ];

  return (
    <header
      id="hospital-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-cream-white py-3"
      } border-b border-green-800/10`}
    >
      <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10 flex justify-between items-center relative">
        
        {/* Logo and Hospital Name */}
        <div
          onClick={() => handleLinkClick("/")}
          className="flex items-center space-x-2.5 cursor-pointer group select-none shrink-0 ml-1"
        >
          <HospitalLogo className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 group-hover:scale-105 transition-transform duration-300" />
          <div className="leading-tight flex flex-col justify-center">
            <span className="font-display font-bold text-[11px] xl:text-[12px] 2xl:text-[13px] text-green-dark uppercase tracking-wide">
              BỆNH VIỆN ĐA KHOA KHU VỰC
            </span>
            <span className="font-sans font-bold text-[12px] xl:text-[13.5px] 2xl:text-[14px] text-brand-green whitespace-nowrap">
              Miền Núi Phía Bắc Quảng Nam
            </span>
          </div>
        </div>

        {/* Center: Mega Menu Navigation (Hover trigger on desktop) */}
        <nav className="hidden xl:flex items-center xl:space-x-1.5 2xl:space-x-3">
          {navItems.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => item.hasMega && handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
              className="relative py-1.5"
            >
              <button
                onClick={() => handleLinkClick(item.route || "/")}
                className={`px-3 py-1.5 rounded-full text-[13px] xl:text-[14px] font-sans font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                  activeSection === item.id || hoveredMenu === item.id
                    ? "bg-[#EAF7EE] text-brand-green font-bold"
                    : "text-ink hover:text-brand-green hover:bg-mint/50"
                }`}
              >
                <span>{item.label}</span>
                {item.hasMega && (
                  <ChevronDown size={11} className={`transition-transform duration-200 ${hoveredMenu === item.id ? "rotate-180 text-brand-green" : "text-gray-400"}`} />
                )}
              </button>
            </div>
          ))}
        </nav>

        {/* Right side: Urgent Hotline, Admin & Booking CTA */}
        <div className="hidden xl:flex items-center 2xl:space-x-4 shrink-0">
          {/* Hotline Button with Pulsing Signal */}
          <a
            href="tel:02353747432"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-mint border border-[#2FA968]/20 text-green-dark hover:bg-[#d5f2dd] transition-colors duration-200 group whitespace-nowrap"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-peach opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-peach"></span>
            </div>
            <Phone size={12} className="text-brand-green group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-display font-bold text-[11px] xl:text-[11.5px] text-[#164B36]">Cấp cứu: 02353.747.432</span>
          </a>

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 border border-[#2FA968]/20 hover:border-[#2FA968]/50 bg-[#EAF7EE] hover:bg-[#d5f2dd] text-[#164B36] font-sans text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-semibold px-4 py-2 rounded-full cursor-pointer transition-all duration-300 whitespace-nowrap"
            title="Cổng thông tin quản lý lâm sàng"
          >
            <span className="w-1.5 h-1.5 bg-[#2FA968] rounded-full animate-pulse"></span>
            <span>Cổng Quản Trị</span>
          </button>

          {/* Booking CTA Button */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 bg-[#2FA968] hover:bg-[#258752] text-white font-sans text-[12px] xl:text-[12.5px] 2xl:text-[13px] font-semibold px-5 py-2 rounded-full cursor-pointer shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all duration-300 whitespace-nowrap"
          >
            <Calendar size={12} />
            <span>Đặt lịch khám</span>
          </button>
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="flex xl:hidden items-center space-x-2.5 shrink-0">
          <a
            href="tel:02353747432"
            className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-mint text-brand-green border border-brand-green/10"
            title="Gọi Cấp Cứu"
          >
            <Phone size={14} className="animate-bounce" />
          </a>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl bg-mint text-green-dark border border-brand-green/10 hover:bg-brand-green/10 transition-colors duration-200"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP MEGA MENU FLOATING DROPDOWN PANEL */}
        {/* ========================================================= */}
        {hoveredMenu && megaMenuData[hoveredMenu] && (
          <div
            onMouseEnter={() => handleMouseEnter(hoveredMenu)}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 right-0 top-full mt-0.5 bg-white border border-[#2FA968]/20 shadow-xl rounded-b-[24px] overflow-hidden z-50 animate-fade-in py-8 px-10 hidden xl:block"
          >
            <div className="max-w-[1180px] mx-auto">
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-green-800/[0.08]">
                <span className="w-1.5 h-3.5 bg-brand-green rounded-full"></span>
                <span className="font-display font-bold text-xs text-brand-green tracking-wider uppercase">
                  Danh mục chính » {megaMenuData[hoveredMenu].title}
                </span>
              </div>

              {/* Grid Column Layout based on dynamic catalog length */}
              <div className={`grid gap-8 ${
                megaMenuData[hoveredMenu].columns.length === 5 ? "grid-cols-5" :
                megaMenuData[hoveredMenu].columns.length === 4 ? "grid-cols-4" :
                megaMenuData[hoveredMenu].columns.length === 3 ? "grid-cols-3" : "grid-cols-2"
              }`}>
                {megaMenuData[hoveredMenu].columns.map((col: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="font-display font-bold text-[13.5px] text-green-dark border-b border-[#2FA968]/10 pb-1 flex items-center gap-1">
                      <span className="text-[#FFA265] text-sm">✦</span>
                      {col.title}
                    </h4>
                    <ul className="space-y-2">
                      {col.links.map((link: string, linkIdx: number) => (
                        <li key={linkIdx}>
                          <button
                            onClick={() => {
                              if (link.includes("Đặt khám") || link.includes("đặt khám")) {
                                onOpenBooking();
                              } else if (link.includes("bệnh sử") || link.includes("Tra cứu")) {
                                onOpenAI();
                              } else {
                                handleLinkClick(getLinkRoute(link));
                              }
                            }}
                            className="font-sans text-[13px] text-gray-600 hover:text-brand-green font-medium flex items-center gap-1 transition-colors hover:translate-x-0.5 transform duration-150 cursor-pointer text-left w-full"
                          >
                            <span className="text-brand-green/40 text-[10px]">›</span>
                            <span>{link}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MOBILE DRAWER ACCORDION NAVIGATION */}
      {/* ========================================================= */}
      {isOpen && (
        <div className="fixed inset-0 top-[60px] z-40 bg-cream-white/98 backdrop-blur-md flex flex-col p-5 animate-fade-in block xl:hidden overflow-y-auto">
          <div className="flex flex-col space-y-3.5 mb-8">
            <h3 className="font-display text-green-dark font-bold text-[15px] border-b border-green-800/10 pb-2">Danh mục điều hướng</h3>
            
            {navItems.map((item) => {
              const isExpanded = !!mobileExpanded[item.id];
              return (
                <div key={item.id} className="border-b border-green-800/[0.04] pb-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (item.hasMega) {
                          toggleMobileExpanded(item.id);
                        } else {
                          handleLinkClick(item.id);
                        }
                      }}
                      className="text-left py-2 px-1 text-[14.5px] font-sans font-bold text-ink hover:text-brand-green flex-grow"
                    >
                      {item.label}
                    </button>
                    {item.hasMega && (
                      <button
                        onClick={() => toggleMobileExpanded(item.id)}
                        className="p-2 text-gray-400 hover:text-brand-green"
                      >
                        <ChevronRight size={16} className={`transition-transform duration-200 ${isExpanded ? "rotate-90 text-brand-green" : ""}`} />
                      </button>
                    )}
                  </div>

                  {/* Mobile Accordion Child list */}
                  {item.hasMega && isExpanded && megaMenuData[item.id] && (
                    <div className="mt-1 pl-4 pr-2 py-2 bg-mint/40 rounded-xl space-y-4">
                      {megaMenuData[item.id].columns.map((col: any, cidx: number) => (
                        <div key={cidx} className="space-y-1.5">
                          <h4 className="font-display font-bold text-[12.5px] text-green-dark border-b border-green-800/[0.06] pb-0.5">
                            {col.title}
                          </h4>
                          <ul className="space-y-1">
                            {col.links.map((link: string, lidx: number) => (
                              <li key={lidx}>
                                <button
                                  onClick={() => {
                                    setIsOpen(false);
                                    if (link.includes("Đặt khám") || link.includes("đặt khám")) {
                                      onOpenBooking();
                                    } else if (link.includes("bệnh sử") || link.includes("Tra cứu")) {
                                      onOpenAI();
                                    } else {
                                      onNavClick(getMobileLinkRoute(link, item.id));
                                    }
                                  }}
                                  className="text-left w-full py-1 text-[12.5px] text-gray-600 hover:text-brand-green font-sans font-medium"
                                >
                                  • {link}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons at mobile drawer bottom */}
          <div className="flex flex-col space-y-2.5 pt-4 border-t border-brand-green/10 mt-auto">
            <a
              href="tel:02353747432"
              className="flex items-center justify-center gap-2.5 w-full bg-peach text-white font-display font-bold py-2 px-4 rounded-full shadow-md text-center text-xs"
            >
              <Phone size={14} />
              <span>CẤP CỨU KHẨN CẤP: 02353.747.432</span>
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBooking();
              }}
              className="flex items-center justify-center gap-2.5 w-full bg-brand-green text-white font-sans font-bold py-2 px-4 rounded-full shadow-md text-xs"
            >
              <Calendar size={14} />
              <span>Đặt lịch khám trực tuyến</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAI();
              }}
              className="flex items-center justify-center gap-2.5 w-full bg-green-dark text-mint font-sans font-bold py-2 px-4 rounded-full shadow-md border border-brand-green/20 text-xs"
            >
              <Heart size={14} className="text-peach animate-pulse" />
              <span>Tư vấn sức khỏe AI</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-1.5 w-full bg-[#EAF7EE] text-[#164B36] font-sans font-bold py-2 px-4 rounded-full shadow-md border border-[#2FA968]/30 text-xs"
            >
              <span className="w-1.5 h-1.5 bg-[#2FA968] rounded-full animate-ping"></span>
              <span>Cổng Quản Trị Hệ Thống (Admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
