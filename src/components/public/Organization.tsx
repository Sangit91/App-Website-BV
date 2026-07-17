import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, ShieldCheck, Landmark, GitFork, X, PhoneCall, Info, Layers } from "lucide-react";

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
  name: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgLight: string;
  textColor: string;
  departments: DeptNode[];
}

export default function Organization() {
  const [selectedDept, setSelectedDept] = useState<DeptNode | null>(null);
  const [activeDivision, setActiveDivision] = useState<string>("clinical");

  const directors: Member[] = [
    {
      name: "PGS. TS. BS. Trần Văn Trình",
      title: "Thầy thuốc Nhân dân - Giám đốc Bệnh viện",
      role: "Chỉ đạo chung, phụ trách Chiến lược phát triển, Nhân sự cấp cao và Hợp tác quốc tế.",
      image: "https://images.pexels.com/photos/3279196/pexels-photo-3279196.jpeg?auto=compress&cs=tinysrgb&w=600",
      quote: "Đặt y đức và sự hài lòng của bệnh nhân làm kim chỉ nam cho mọi hoạt động điều trị.",
      email: "tranvantrinh.director@mnpb.gov.vn"
    },
    {
      name: "BSCKII. Nguyễn Thị Minh Tuyết",
      title: "Thầy thuốc Ưu tú - Phó Giám đốc Lâm sàng",
      role: "Phụ trách chuyên môn điều trị, Đội ngũ Y bác sĩ, Hội đồng Khoa học và Kiểm soát nhiễm khuẩn.",
      image: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600",
      quote: "Chất lượng lâm sàng quyết định sự sống còn và uy tín của một cơ sở y tế.",
      email: "minhtuyet.clinical@mnpb.gov.vn"
    },
    {
      name: "ThS. BS. Lê Phan Quốc Bảo",
      title: "Phó Giám đốc Kế hoạch - Hành chính & Vật tư",
      role: "Phụ trách cơ sở vật chất, Trang thiết bị y tế hiện đại, Công nghệ thông tin và Công tác xã hội.",
      image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=600",
      quote: "Hạ tầng hiện đại, quy trình tinh gọn là bệ đỡ vững chắc cho các y bác sĩ cứu người.",
      email: "quocbao.admin@mnpb.gov.vn"
    }
  ];

  const divisions: Record<string, Division> = {
    clinical: {
      name: "Khối Lâm Sàng (Điều Trị)",
      icon: <Users size={18} />,
      color: "bg-[#2FA968]",
      borderColor: "border-[#2FA968]/30",
      bgLight: "bg-[#EAF7EE]",
      textColor: "text-[#164B36]",
      departments: [
        {
          id: "khoa-ngoai",
          name: "Khoa Ngoại Tổng Hợp",
          leader: "BSCKII. Lê Văn Lâm",
          phone: "02353.747.432 (Mã nhánh: 102)",
          staffCount: 32,
          description: "Phẫu thuật nội soi ổ bụng, nội soi tiết niệu, chấn thương chỉnh hình và lồng ngực.",
          details: "Khoa được trang bị 2 phòng mổ áp lực dương hiện đại, ứng dụng các kỹ thuật ít xâm lấn giúp bệnh nhân hồi phục nhanh sau mổ."
        },
        {
          id: "khoa-noi",
          name: "Khoa Nội Tổng Hợp",
          leader: "BSCKI. Nguyễn Thị Thu Hà",
          phone: "02353.747.432 (Mã nhánh: 104)",
          staffCount: 28,
          description: "Điều trị các bệnh lý nội khoa mãn tính: Huyết áp, Đái tháo đường, Phổi tắc nghẽn CODP.",
          details: "Thực hiện quản lý bệnh nhân ngoại trú chất lượng cao, phối hợp liên phòng khám giúp đơn giản hóa thủ tục nhận thuốc bảo hiểm."
        },
        {
          id: "khoa-san",
          name: "Khoa Sản Phụ Khoa",
          leader: "ThS. BS. Trần Thị Kiều",
          phone: "02353.747.432 (Mã nhánh: 106)",
          staffCount: 24,
          description: "Đỡ đẻ, mổ đẻ, quản lý thai kỳ trọn gói, tầm soát dị tật thai nhi và ung thư cổ tử cung.",
          details: "Khu đỡ đẻ gia đình ấm áp, hỗ trợ kề vai sau sinh ngay tại phòng sinh cùng sự phục vụ 24/7 của đội ngũ hộ sinh nhẹ nhàng."
        },
        {
          id: "khoa-nhi",
          name: "Khoa Nhi & Sơ Sinh",
          leader: "BSCKI. Phan Thanh Hải",
          phone: "02353.747.432 (Mã nhánh: 108)",
          staffCount: 20,
          description: "Cấp cứu và điều trị nội trú nhi khoa, hồi sức tích cực sơ sinh, vàng da sinh lý.",
          details: "Thiết kế phòng bệnh thân thiện với trẻ nhỏ, giảm thiểu áp lực tâm lý cho các bé và người nhà trong suốt quá trình điều trị."
        },
        {
          id: "khoa-cap-cuu",
          name: "Khoa Hồi Sức Tích Cực - ICU & Cấp Cứu",
          leader: "BSCKII. Vũ Hoàng Sơn",
          phone: "02353.747.432 (Mã nhánh: 101)",
          staffCount: 35,
          description: "Tiếp nhận cấp cứu 24/7, hồi sức tích cực chống độc cho bệnh nhân nặng lâm sàng.",
          details: "Quy trình báo động đỏ liên viện và nội viện phản ứng nhanh trong vòng 3 phút, giúp cứu sống nhiều ca bệnh nguy kịch khó khăn."
        }
      ]
    },
    paraclinical: {
      name: "Khối Cận Lâm Sàng",
      icon: <ShieldCheck size={18} />,
      color: "bg-[#FFA265]",
      borderColor: "border-[#FFA265]/30",
      bgLight: "bg-orange-50",
      textColor: "text-orange-950",
      departments: [
        {
          id: "khoa-duoc",
          name: "Khoa Dược & Cung Ứng",
          leader: "DS. CKI. Nguyễn Văn Hoàng",
          phone: "02353.747.432 (Mã nhánh: 201)",
          staffCount: 15,
          description: "Bảo đảm cung ứng thuốc đầy đủ, chất lượng cao, đúng quy định cho bệnh nhân nội trú & bảo hiểm.",
          details: "Hệ thống kho thuốc đạt tiêu chuẩn GSP kiểm soát nhiệt độ tự động, đảm bảo hoạt tính thuốc nguyên vẹn."
        },
        {
          id: "khoa-xet-nghiem",
          name: "Khoa Xét Nghiệm & Huyết Học",
          leader: "ThS. Đỗ Thị Thanh",
          phone: "02353.747.432 (Mã nhánh: 203)",
          staffCount: 18,
          description: "Thực hiện xét nghiệm sinh hóa, huyết học, miễn dịch và vi sinh tự động hóa hoàn toàn.",
          details: "Hệ thống quản lý chất lượng đạt chuẩn ISO 15189, liên thông kết quả giúp rút ngắn thời gian chẩn đoán của bác sĩ điều trị."
        },
        {
          id: "khoa-cdha",
          name: "Khoa Chẩn Đoán Hình Ảnh",
          leader: "BSCKI. Nguyễn Minh Khang",
          phone: "02353.747.432 (Mã nhánh: 205)",
          staffCount: 16,
          description: "Chụp cắt lớp vi tính CT đa dãy, Cộng hưởng từ MRI, Siêu âm màu 4D, X-quang kỹ thuật số.",
          details: "Hình ảnh độ phân giải cao kết nối mạng PACS trực tiếp đến phòng khám, giảm tối đa thời gian chờ đợi nhận phim của bệnh nhân."
        }
      ]
    },
    administrative: {
      name: "Khối Phòng Chức Năng",
      icon: <Landmark size={18} />,
      color: "bg-green-dark",
      borderColor: "border-green-dark/30",
      bgLight: "bg-slate-50",
      textColor: "text-slate-950",
      departments: [
        {
          id: "phong-khth",
          name: "Phòng Kế Hoạch Tổng Hợp",
          leader: "ThS. Nguyễn Hoàng Nam",
          phone: "02353.747.432 (Mã nhánh: 301)",
          staffCount: 12,
          description: "Điều phối kế hoạch chuyên môn, báo cáo thống kê, quản lý chất lượng và ứng dụng bệnh án điện tử.",
          details: "Đầu mối tiếp nhận, xử lý thắc mắc, quản lý quy trình khám chữa bệnh liên thông đồng bộ."
        },
        {
          id: "phong-tccb",
          name: "Phòng Tổ Chức Cán Bộ",
          leader: "Bà Phạm Thị Tuyết Mai",
          phone: "02353.747.432 (Mã nhánh: 303)",
          staffCount: 8,
          description: "Quản lý nhân sự, đào tạo phát triển nguồn nhân lực chất lượng cao và thi đua khen thưởng.",
          details: "Phụ trách các chương trình hợp tác chuyển giao kỹ thuật của các bệnh viện tuyến Trung ương về cho Quảng Nam."
        },
        {
          id: "phong-dieu-duong",
          name: "Phòng Điều Dưỡng",
          leader: "CN. Nguyễn Thị Thu Vân",
          phone: "02353.747.432 (Mã nhánh: 305)",
          staffCount: 10,
          description: "Đào tạo kỹ năng giao tiếp, quản lý vệ sinh buồng bệnh, chăm sóc người bệnh toàn diện.",
          details: "Giám sát chất lượng y đức điều dưỡng, thực thi phong trào 'Bệnh viện xanh - sạch - đẹp - ấm áp thân thương'."
        }
      ]
    }
  };

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
            <h3 className="font-display font-bold text-xl md:text-2xl text-green-dark">Sơ đồ cơ cấu chức năng lâm sàng</h3>
            <span className="w-8 h-px bg-[#2FA968]"></span>
          </div>
          <p className="font-sans text-gray-600 text-[13.5px] max-w-2xl mx-auto mb-10">
            Hệ thống các khoa lâm sàng, cận lâm sàng và phòng chức năng kết nối chặt chẽ. Click chọn khối danh mục để hiển thị chi tiết sơ đồ nhân sự và liên hệ nội bộ.
          </p>

          {/* Division Select Buttons (Warm Green theme) */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {Object.entries(divisions).map(([key, value]) => {
              const isActive = activeDivision === key;
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
                    {value.icon}
                  </span>
                  <span>{value.name}</span>
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDivision}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {divisions[activeDivision].departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept)}
                    className="group bg-[#FCFBF7] border border-green-800/10 hover:border-[#2FA968] rounded-2xl p-5 text-left hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full cursor-pointer"
                  >
                    <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-[#EAF7EE]/40 group-hover:bg-[#2FA968]/5 rounded-full transition-colors duration-300"></div>
                    
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`inline-block py-0.5 px-2 rounded-md font-sans font-bold text-[10px] text-white ${divisions[activeDivision].color}`}>
                          {divisions[activeDivision].name.split(" ")[1] || "Khối"}
                        </span>
                        <Info size={14} className="text-[#2FA968] opacity-40 group-hover:opacity-100 transition-opacity" />
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
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
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
                    Cơ cấu tổ chức lâm sàng
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
