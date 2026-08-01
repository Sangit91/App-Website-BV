import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Heart, Award, ShieldCheck, ArrowUpRight } from "lucide-react";
import HospitalLogo from "./HospitalLogo";
import { useSiteContent } from "../../context/SiteContentContext";
import { DEFAULT_CONTACT } from "../../data/siteContact";

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onOpenAdmin?: () => void;
}

export default function Footer({ onScrollToSection, onOpenAdmin }: FooterProps) {
  const currentYear = 2026;
  const { getSection } = useSiteContent();
  const contact = getSection("contact", DEFAULT_CONTACT);

  const quickLinks = [
    { label: "Giới thiệu bệnh viện", id: "gioi-thieu" },
    { label: "Chuyên khoa lâm sàng", id: "chuyen-khoa" },
    { label: "Dịch vụ & Tiện ích", id: "dich-vu" },
    { label: "Đội ngũ thầy thuốc", id: "bac-si" },
    { label: "Tin tức y khoa", id: "tin-tuc" },
  ];

  const supportLinks = [
    { label: "Hướng dẫn quy trình khám", url: "# quy-trinh" },
    { label: "Quy định bảo hiểm y tế (BHYT)", url: "# bhyt" },
    { label: "Bảng giá dịch vụ khám chữa bệnh", url: "# bang-gia" },
    { label: "Đăng ký khám sức khỏe định kỳ", url: "# dang-ky" },
    { label: "Chính sách bảo mật dữ liệu bệnh án", url: "# bao-mat" },
  ];

  return (
    <footer id="lien-he" className="bg-green-dark text-mint pt-16 pb-8 border-t border-green-800/20 relative z-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-green/3 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-peach/3 blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="max-w-[1180px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 text-left relative z-10"
      >
        
        {/* Column 1: Intro (4 Cols on desktop) */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="lg:col-span-4 space-y-5">
          <div className="flex items-center space-x-3 select-none">
            <HospitalLogo className="w-10 h-10 shrink-0" />
            <div className="leading-tight">
              <span className="font-display font-bold text-xs text-mint uppercase tracking-wider block">
                BỆNH VIỆN ĐA KHOA KHU VỰC
              </span>
              <span className="font-sans font-bold text-sm text-peach">
                Miền Núi Phía Bắc Quảng Nam
              </span>
            </div>
          </div>
          
          <p className="text-xs md:text-[13px] text-mint/80 leading-relaxed">
            Điểm tựa chăm sóc y tế kỹ thuật cao, tin cậy và ấm áp hàng đầu cho nhân dân các huyện miền núi phía Bắc Quảng Nam. Cam kết không ngừng đổi mới y đức, giữ vững trọn vẹn niềm tin của cộng đồng.
          </p>

          {/* Awards and credentials icons */}
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <Award size={14} className="text-peach" />
              <span className="text-[10px] font-bold text-mint">Cấp nhà nước</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <ShieldCheck size={14} className="text-brand-green" />
              <span className="text-[10px] font-bold text-mint">Đạt Chuẩn BHYT</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3 pt-2">
            {["Facebook", "Youtube", "Zalo"].map((net) => (
              <a
                key={net}
                href={`#${net}`}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-green hover:text-white border border-white/10 flex items-center justify-center text-xs font-semibold transition-all"
              >
                {net.charAt(0)}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Column 2: Quick Links (2 Cols on desktop) */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } } }} className="lg:col-span-2 space-y-4">
          <h3 className="font-display font-bold text-[16px] text-peach border-b border-white/10 pb-2">
            Liên Kết Nhanh
          </h3>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => onScrollToSection(link.id)}
                  className="text-xs md:text-[13px] hover:text-peach text-mint/85 flex items-center gap-1 group cursor-pointer"
                >
                  <span className="text-brand-green group-hover:translate-x-0.5 transition-transform">›</span>
                  <span>{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 3: Patient Support (3 Cols on desktop) */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } } }} className="lg:col-span-3 space-y-4">
          <h3 className="font-display font-bold text-[16px] text-peach border-b border-white/10 pb-2">
            Hỗ Trợ Người Bệnh
          </h3>
          <ul className="space-y-2.5">
            {supportLinks.map((link, idx) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  className="text-xs md:text-[13px] hover:text-peach text-mint/85 flex items-center gap-1 group"
                >
                  <span className="text-brand-green group-hover:translate-x-0.5 transition-transform">›</span>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
            {onOpenAdmin && (
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-xs md:text-[13px] text-brand-green font-bold hover:text-peach flex items-center gap-1 group cursor-pointer"
                >
                  <span className="text-brand-green group-hover:translate-x-0.5 transition-transform">›</span>
                  <span>Cổng Quản Trị Hệ Thống (Admin)</span>
                </button>
              </li>
            )}
          </ul>
        </motion.div>

        {/* Column 4: Location Contact Info (3 Cols on desktop) */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } } }} className="lg:col-span-3 space-y-4">
          <h3 className="font-display font-bold text-[16px] text-peach border-b border-white/10 pb-2">
            Thông Tin Liên Hệ
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-xs md:text-[13px] text-mint/85">
              <MapPin size={16} className="text-peach shrink-0 mt-0.5" />
              <span>{contact.address}.</span>
            </li>
            <li className="flex items-center gap-2 text-xs md:text-[13px] text-mint/85">
              <Phone size={15} className="text-brand-green shrink-0" />
              <span>Cấp cứu: {contact.emergency}</span>
            </li>
            <li className="flex items-center gap-2 text-xs md:text-[13px] text-mint/85">
              <Phone size={15} className="text-brand-green shrink-0" />
              <span>Đường dây nóng: {contact.hotline}</span>
            </li>
            <li className="flex items-center gap-2 text-xs md:text-[13px] text-mint/85">
              <Mail size={15} className="text-peach shrink-0" />
              <span className="break-all">{contact.email}</span>
            </li>
            <li className="flex items-center gap-2 text-xs md:text-[13px] text-mint/85">
              <Clock size={15} className="text-peach shrink-0" />
              <span>{contact.workingHours}</span>
            </li>
          </ul>
        </motion.div>

      </motion.div>

      {/* Copyright bottom section */}
      <div className="max-w-[1180px] mx-auto px-4 mt-12 pt-6 border-t border-white/5 text-center space-y-2 relative z-10 text-[11px] md:text-xs">
        <p className="text-mint/60">
          © {currentYear} Bệnh viện Đa khoa Khu vực Miền núi Phía Bắc Quảng Nam. Bảo lưu mọi quyền.
        </p>
        <p className="text-mint/40 flex items-center justify-center gap-1">
          <Heart size={10} className="text-peach fill-peach animate-pulse" />
          <span>Hệ thống quản lý dữ liệu bệnh nhân được mã hóa bảo mật tối đa theo quy chuẩn Bộ Y tế Việt Nam.</span>
        </p>
      </div>
    </footer>
  );
}
