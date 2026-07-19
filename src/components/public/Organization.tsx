import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, ShieldCheck, Landmark, GitFork, X, PhoneCall, Info, Layers, ChevronDown } from "lucide-react";

interface Member {
  name: string;
  title: string;
  role: string;
  image: string;
  quote: string;
  email: string;
}

interface DeptNode {
  id: string;
  name: string;
  leader: string;
  phone: string;
  staffCount: number;
  description: string;
  details?: string;
}

interface Division {
  id: string;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  bgLight: string;
  textColor: string;
  departments: DeptNode[];
}

const iconMap: Record<string, React.ReactNode> = {
  Landmark: <Landmark size={18} />,
  Users: <Users size={18} />,
  Layers: <Layers size={18} />
};

export default function Organization() {
  const [selectedDept, setSelectedDept] = useState<DeptNode | null>(null);
  const [activeDivision, setActiveDivision] = useState<string>("clinical");
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const [divisions, setDivisions] = useState<Record<string, Division>>({});
  const [loading, setLoading] = useState(true);
  const INITIAL_DISPLAY = 6;

  useEffect(() => {
    fetch("/api/organization")
      .then(res => res.json())
      .then(data => {
        setDivisions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch organization:", err);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (division: string) => {
    setIsExpanded(prev => ({ ...prev, [division]: !prev[division] }));
  };

const directors: Member[] = [
    {
      name: "PGS. TS. BS. Trần Văn Trình",
      title: "Thầy thuốc Nhân dân - Giám đốc Bệnh viện",
      role: "Chỉ đạo chung, phụ trách Chiến lược phát triển, Nhân sự cấp cao và Hợp tác quốc tế.",
      image: "/images/components/org-1.jpeg",
      quote: "Đặt y đức và sự hài lòng của bệnh nhân làm kim chỉ nam cho mọi hoạt động điều trị.",
      email: "tranvantrinh.director@mnpb.gov.vn"
    },
    {
      name: "BSCKII. Nguyễn Thị Minh Tuyết",
      title: "Thầy thuốc Ưu tú - Phó Giám đốc Lâm sàng",
      role: "Phụ trách chuyên môn điều trị, Đội ngũ Y bác sĩ, Hội đồng Khoa học và Kiểm soát nhiễm khuẩn.",
      image: "/images/components/org-2.jpeg",
      quote: "Chất lượng lâm sàng quyết định sự sống còn và uy tín của một cơ sở y tế.",
      email: "minhtuyet.clinical@mnpb.gov.vn"
    },
    {
      name: "ThS. BS. Lê Phan Quốc Bảo",
      title: "Phó Giám đốc Kế hoạch - Hành chính & Vật tư",
      role: "Phụ trách cơ sở vật chất, Trang thiết bị y tế hiện đại, Công nghệ thông tin và Công tác xã hội.",
      image: "/images/components/org-3.jpeg",
      quote: "Hạ tầng hiện đại, quy trình tinh gọn là bệ đỡ vững chắc cho các y bác sĩ cứu người.",
      email: "quocbao.admin@mnpb.gov.vn"
    }
  ];

  return (
    <section id="gioi-thieu" className="py-20 bg-cream-white border-b border-green-800/10 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-mint/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-peach/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-[1180px] mx-auto px-4 text-center">
        {/* Header Title */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-[#EAF7EE] text-[#164B36] font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#2FA968]/20 mb-4">
            <Landmark size={13} className="text-[#2FA968]" /> Uy Tín & Trách Nhiệm
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-green-dark tracking-tight mb-4">
            Cơ Cấu Tổ Chức & Ban Giám Đốc
          </h2>
          <p className="font-sans text-ink text-sm md:text-base leading-relaxed">
            Hệ thống quản lý lâm sàng hiện đại, chuyên nghiệp cùng tinh thần tận hiến hết mình vì đồng bào miền núi phía Bắc Quảng Nam. Chúng tôi cam kết mang lại quy trình chăm sóc khép kín, y đức sáng ngời.
          </p>
        </div>

        {/* SECTION 1: BAN GIÁM ĐỐC */}
        <div className="mb-24">
          <div className="flex items-center justify-center gap-2 mb-10">
            <span className="w-8 h-px bg-[#2FA968]"></span>
            <h3 className="font-display font-bold text-xl md:text-2xl text-green-dark">Ban Giám Đốc Bệnh Viện</h3>
            <span className="w-8 h-px bg-[#2FA968]"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {directors.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left h-full"
              >
                {/* Photo container */}
                <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90"></div>
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="text-[#FFA265] text-xs font-bold font-sans uppercase tracking-wider mb-1">
                      {member.title.split(" - ")[0]}
                    </p>
                    <h4 className="font-display font-bold text-lg text-white leading-snug">
                      {member.name}
                    </h4>
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded bg-[#EAF7EE] text-[#164B36] font-sans font-bold text-[11px] mb-3">
                      {member.title.split(" - ")[1] || "Ban Giám Đốc"}
                    </span>
                    <p className="font-sans text-ink text-[13px] leading-relaxed mb-4">
                      {member.role}
                    </p>
                  </div>
                  
                  {/* Quote bubble & Contact */}
                  <div className="pt-4 border-t border-green-800/10">
                    <p className="font-sans italic text-[12.5px] text-[#164B36] mb-3 leading-relaxed relative pl-4 border-l-2 border-[#2FA968]">
                      "{member.quote}"
                    </p>
                    <p className="font-mono text-[11px] text-gray-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-peach"></span>
                      {member.email}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 2: SƠ ĐỒ TỔ CHỨC (INTERACTIVE TREE DIAGRAM) */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-8 h-px bg-[#2FA968]"></span>
            <h3 className="font-display font-bold text-xl md:text-2xl text-green-dark">Sơ đồ tổ chức Bệnh viện</h3>
            <span className="w-8 h-px bg-[#2FA968]"></span>
          </div>
          <p className="font-sans text-gray-600 text-[13.5px] max-w-2xl mx-auto mb-10">
            Hệ thống tổ chức gồm 3 khối: Hành chính (9 phòng/ban), Lâm sàng (21 khoa) và Cận lâm sàng (6 khoa). Click chọn khối để xem chi tiết các đơn vị và liên hệ nội bộ.
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-10 h-10 border-4 border-[#2FA968] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-ink/60 font-sans text-sm">Đang tải dữ liệu tổ chức...</span>
            </div>
          ) : Object.keys(divisions).length === 0 ? (
            <div className="text-center py-16 text-ink/40">
              <p>Không có dữ liệu tổ chức</p>
            </div>
          ) : (
          <>
          {/* Division Select Buttons (Warm Green theme) */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {Object.entries(divisions).map(([key, value]) => {
              const isActive = activeDivision === key;
              const div = value as Division;
              return (
                <button
                  key={key}
                  onClick={() => setActiveDivision(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-[13.5px] font-bold cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? "bg-green-dark text-[#EAF7EE] shadow-md border-transparent scale-105"
                      : "bg-white text-ink border-green-800/10 hover:border-[#2FA968] hover:bg-[#EAF7EE]"
                  }`}
                >
                  <span className={`${isActive ? "text-[#FFA265]" : "text-[#2FA968]"}`}>
                    {iconMap[div.icon] || <Users size={18} />}
                  </span>
                  <span>{div.name}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Org Tree Grid */}
          <div className="relative bg-white border border-green-800/10 rounded-[28px] p-6 md:p-10 shadow-sm max-w-[1000px] mx-auto overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#EAF7EE] text-[#164B36] font-mono text-[10px] font-bold py-1 px-3.5 rounded-bl-xl border-l border-b border-green-800/10 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#2FA968] rounded-full animate-ping"></span>
              Cơ cấu động 2026
            </div>

            {/* Tree root (Giám Đốc & Ban giám đốc) */}
            <div className="flex flex-col items-center mb-10">
              <div className="bg-gradient-to-r from-green-dark to-[#1f5b43] text-white py-3.5 px-8 rounded-2xl shadow-md border border-[#2FA968]/30 inline-flex flex-col items-center max-w-[280px]">
                <span className="font-sans text-[11px] text-[#FFA265] uppercase font-bold tracking-wider mb-0.5">Báo cáo tối cao</span>
                <span className="font-display font-bold text-sm text-center">Ban Giám Đốc Bệnh Viện</span>
                <span className="font-sans text-[11px] text-gray-300 mt-1">Sát sao chuyên môn - Uy tín cộng đồng</span>
              </div>
              
              {/* Connector lines */}
              <div className="w-0.5 h-8 bg-[#2FA968]/30 my-1"></div>
              <div className="w-[80%] md:w-[60%] h-px bg-[#2FA968]/30"></div>
            </div>

            {/* Dynamic Child Nodes depending on Active Division */}
            <div className="relative">
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {(isExpanded[activeDivision] 
                    ? divisions[activeDivision].departments 
                    : divisions[activeDivision].departments.slice(0, INITIAL_DISPLAY)
                  ).map((dept, index) => (
                    <motion.button
                      key={dept.id}
                      layout
                      onClick={() => setSelectedDept(dept)}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ 
                        duration: 0.35, 
                        delay: isExpanded[activeDivision] ? (index - INITIAL_DISPLAY) * 0.04 : index * 0.05,
                        layout: { duration: 0.4, ease: "easeOut" }
                      }}
                      className="group bg-[#FCFBF7] border border-green-800/10 hover:border-[#2FA968] rounded-2xl p-5 text-left hover:shadow-lg hover:shadow-[#2FA968]/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full cursor-pointer"
                    >
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-[#EAF7EE]/40 group-hover:bg-[#2FA968]/10 rounded-full transition-all duration-500 group-hover:scale-150 group-hover:right-[-20px] group-hover:bottom-[-20px]"></div>
                      
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`inline-block py-0.5 px-2 rounded-md font-sans font-bold text-[10px] text-white ${divisions[activeDivision].color}`}>
                            {divisions[activeDivision].name.split(" ")[1] || "Khối"}
                          </span>
                          <Info size={14} className="text-[#2FA968] opacity-40 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                        
                        <h4 className="font-display font-bold text-[14.5px] text-green-dark group-hover:text-[#2FA968] transition-colors leading-snug mb-2">
                          {dept.name}
                        </h4>
                        <p className="font-sans text-gray-500 text-[12.5px] line-clamp-2 leading-relaxed mb-4">
                          {dept.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-green-800/[0.06] flex justify-between items-center text-[12px] font-sans">
                        <span className="text-gray-600 font-medium">Trưởng khoa: <span className="text-[#164B36] font-bold">{dept.leader.replace("BSCKII. ", "").replace("BSCKI. ", "").replace("ThS. BS. ", "").replace("DS. CKI. ", "").replace("ThS. ", "")}</span></span>
                        <span className="text-gray-400 font-mono text-[11px] bg-white border border-gray-100 px-1.5 py-0.5 rounded">
                          {dept.staffCount} NS
                        </span>
                      </div>
                    </motion.button>
                  ))}
                  
                  {/* Show More / Show Less button */}
                  {divisions[activeDivision].departments.length > INITIAL_DISPLAY && (
                    <motion.button
                      layout
                      onClick={() => toggleExpand(activeDivision)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="col-span-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-[#EAF7EE] to-[#d5f2dd] hover:from-[#d5f2dd] hover:to-[#c8ebe0] border-2 border-[#2FA968]/30 hover:border-[#2FA968] text-brand-green hover:text-green-dark font-bold text-[13px] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <motion.span
                        animate={{ rotate: isExpanded[activeDivision] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                      <span className="transition-all duration-300">
                        {isExpanded[activeDivision] 
                          ? "Thu gọn danh sách" 
                          : `Xem thêm ${divisions[activeDivision].departments.length - INITIAL_DISPLAY} khoa/phòng`
                        }
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Decorative corner element */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#EAF7EE]/20 to-transparent rounded-bl-[40px] -z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#FFA265]/10 to-transparent rounded-tr-[40px] -z-10 pointer-events-none"></div>
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      {/* DETAILED DEPARTMENT MODAL */}
      <AnimatePresence>
        {selectedDept && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-[#2FA968]/20 rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl text-left"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-dark to-[#123e2d] px-6 py-5 text-white flex justify-between items-center relative">
                <div>
                  <p className="text-[#FFA265] text-[11px] font-sans font-bold uppercase tracking-widest mb-1">
                    Cơ cấu tổ chức Bệnh viện
                  </p>
                  <h3 className="font-display font-bold text-lg md:text-xl leading-tight">
                    {selectedDept.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDept(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 font-sans">
                {/* Description */}
                <div className="bg-[#EAF7EE] border-l-4 border-[#2FA968] p-4 rounded-r-xl">
                  <h4 className="font-display font-bold text-[13px] text-[#164B36] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Layers size={13} className="text-[#2FA968]" /> Chức năng cốt lõi
                  </h4>
                  <p className="text-ink text-[13.5px] leading-relaxed">
                    {selectedDept.description}
                  </p>
                </div>

                {/* Extended Details */}
                {selectedDept.details && (
                  <div className="space-y-1">
                    <h5 className="font-display font-bold text-[13px] text-green-dark">Thông tin bổ sung</h5>
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      {selectedDept.details}
                    </p>
                  </div>
                )}

                {/* Leadership & Personnel statistics */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-green-800/10 text-[13.5px]">
                  <div>
                    <span className="text-gray-400 block text-[11px] uppercase font-bold tracking-wider mb-0.5">Lãnh đạo đơn vị</span>
                    <span className="text-[#164B36] font-bold font-display">{selectedDept.leader}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px] uppercase font-bold tracking-wider mb-0.5">Nhân sự hiện tại</span>
                    <span className="text-green-dark font-bold font-display">{selectedDept.staffCount} Y bác sĩ & Điều dưỡng</span>
                  </div>
                </div>

                {/* Contact information */}
                <div className="bg-[#FCFBF7] border border-green-800/10 p-3.5 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EAF7EE] text-[#2FA968] flex items-center justify-center shrink-0">
                    <PhoneCall size={16} />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Đường dây nóng khoa phòng</span>
                    <span className="text-green-dark font-mono font-bold text-[13px]">{selectedDept.phone}</span>
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={() => setSelectedDept(null)}
                  className="px-5 py-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold cursor-pointer transition-all duration-200"
                >
                  Đóng lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
