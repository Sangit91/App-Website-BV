import React, { useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const INITIAL_DISPLAY = 6;

  const toggleExpand = (division: string) => {
    setIsExpanded(prev => ({ ...prev, [division]: !prev[division] }));
  };

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
    administrative: {
      name: "Khối Hành Chính",
      icon: <Landmark size={18} />,
      color: "bg-slate-600",
      borderColor: "border-slate-400/30",
      bgLight: "bg-slate-50",
      textColor: "text-slate-900",
      departments: [
        {
          id: "phong-tccb",
          name: "Phòng Tổ chức Cán bộ",
          leader: "Bà Phạm Thị Tuyết Mai",
          phone: "02353.747.432 (Mã nhánh: 303)",
          staffCount: 8,
          description: "Quản lý nhân sự, đào tạo phát triển nguồn nhân lực và thi đua khen thưởng.",
          details: "Phụ trách các chương trình hợp tác chuyển giao kỹ thuật của các bệnh viện tuyến Trung ương."
        },
        {
          id: "phong-ke-hoach",
          name: "Phòng Kế hoạch Tổng hợp",
          leader: "ThS. Nguyễn Hoàng Nam",
          phone: "02353.747.432 (Mã nhánh: 301)",
          staffCount: 12,
          description: "Điều phối kế hoạch chuyên môn, báo cáo thống kê, quản lý chất lượng.",
          details: "Đầu mối tiếp nhận, xử lý thắc mắc, quản lý quy trình khám chữa bệnh liên thông."
        },
        {
          id: "phong-hcqg",
          name: "Phòng Hành chính Quản trị",
          leader: "Ông Trần Minh Tuấn",
          phone: "02353.747.432 (Mã nhánh: 307)",
          staffCount: 10,
          description: "Quản lý hành chính, văn thư, lưu trữ và các công tác đối nội, đối ngoại.",
          details: "Đảm bảo hệ thống văn phòng phẩm, quản lý cơ sở vật chất và an ninh trật tự bệnh viện."
        },
        {
          id: "phong-ke-toan",
          name: "Phòng Kế toán Tài chính",
          leader: "Bà Nguyễn Thị Lan",
          phone: "02353.747.432 (Mã nhánh: 309)",
          staffCount: 9,
          description: "Quản lý thu chi, hạch toán kế toán, báo cáo tài chính và thanh toán bảo hiểm.",
          details: "Giám sát quyết toán ngân sách nhà nước, quản lý quỹ lương và các chế độ đãi ngộ."
        },
        {
          id: "phong-dieu-duong",
          name: "Phòng Điều dưỡng",
          leader: "CN. Nguyễn Thị Thu Vân",
          phone: "02353.747.432 (Mã nhánh: 305)",
          staffCount: 10,
          description: "Đào tạo kỹ năng giao tiếp, quản lý vệ sinh buồng bệnh, chăm sóc người bệnh toàn diện.",
          details: "Giám sát chất lượng y đức điều dưỡng, thực thi phong trào 'Bệnh viện xanh - sạch - đẹp'."
        },
        {
          id: "phong-vattu",
          name: "Phòng Vật tư - Thiết bị Y tế",
          leader: "Ông Lê Văn Hùng",
          phone: "02353.747.432 (Mã nhánh: 311)",
          staffCount: 11,
          description: "Quản lý mua sắm, cung ứng vật tư y tế, trang thiết bị và bảo trì máy móc.",
          details: "Tiếp nhận và xử lý các yêu cầu vật tư từ các khoa phòng, đảm bảo chất lượng và tiến độ."
        },
        {
          id: "phong-cl",
          name: "Phòng Quản lý Chất lượng",
          leader: "ThS. Đỗ Thị Hương",
          phone: "02353.747.432 (Mã nhánh: 313)",
          staffCount: 7,
          description: "Kiểm soát chất lượng bệnh viện, quản lý hồ sơ bệnh án, đánh giá JCIA/HACCP.",
          details: "Thực hiện khảo sát sự hài lòng người bệnh, cập nhật tiêu chuẩn chất lượng quốc gia."
        },
        {
          id: "phong-cntt",
          name: "Phòng Công nghệ Thông tin",
          leader: "KS. Nguyễn Đình Phong",
          phone: "02353.747.432 (Mã nhánh: 315)",
          staffCount: 6,
          description: "Vận hành hệ thống HIS, bệnh án điện tử, mạng nội bộ và an toàn thông tin.",
          details: "Đảm bảo hệ thống máy chủ, sao lưu dữ liệu và hỗ trợ kỹ thuật 24/7 cho các đơn vị."
        },
        {
          id: "to-ctxh",
          name: "Tổ Công tác Xã hội",
          leader: "Bà Trần Thị Mai",
          phone: "02353.747.432 (Mã nhánh: 317)",
          staffCount: 4,
          description: "Hỗ trợ người bệnh có hoàn cảnh khó khăn, kết nối nguồn lực từ thiện và chăm sóc giảm nhẹ.",
          details: "Phối hợp với các tổ chức xã hội để hỗ trợ chi phí điều trị cho bệnh nhân nghèo."
        }
      ]
    },
    clinical: {
      name: "Khối Lâm Sàng",
      icon: <Users size={18} />,
      color: "bg-[#2FA968]",
      borderColor: "border-[#2FA968]/30",
      bgLight: "bg-[#EAF7EE]",
      textColor: "text-[#164B36]",
      departments: [
        {
          id: "khoa-kham-benh",
          name: "Khoa Khám bệnh",
          leader: "BSCKI. Nguyễn Thị Mai",
          phone: "02353.747.432 (Mã nhánh: 101)",
          staffCount: 25,
          description: "Tiếp đón, phân loại và khám bệnh ban đầu cho bệnh nhân. Đăng ký khám chuyên khoa.",
          details: "Quản lý hệ thống đặt lịch khám online, kết nối chuyển tuyến và tiếp nhận bệnh nhân ngoại trú."
        },
        {
          id: "khoa-cc",
          name: "Khoa Cấp cứu",
          leader: "BSCKII. Vũ Hoàng Sơn",
          phone: "02353.747.432 (Mã nhánh: 102)",
          staffCount: 30,
          description: "Tiếp nhận cấp cứu 24/7, sơ cứu, chuyển tuyến bệnh nhân nguy kịch.",
          details: "Quy trình báo động đỏ liên viện phản ứng nhanh trong 3 phút, giúp cứu sống nhiều ca nguy kịch."
        },
        {
          id: "khoa-noi-tq",
          name: "Khoa Nội tổng hợp",
          leader: "BSCKI. Nguyễn Thị Thu Hà",
          phone: "02353.747.432 (Mã nhánh: 103)",
          staffCount: 28,
          description: "Điều trị bệnh lý nội khoa: Huyết áp, Đái tháo đường, COPD, viêm phổi.",
          details: "Quản lý bệnh nhân ngoại trú chất lượng cao, phối hợp liên phòng khám giảm thủ tục bảo hiểm."
        },
        {
          id: "khoa-tim-mach",
          name: "Khoa Tim mạch",
          leader: "BSCKII. Trần Văn Minh",
          phone: "02353.747.432 (Mã nhánh: 104)",
          staffCount: 22,
          description: "Chẩn đoán và điều trị bệnh lý tim mạch: bệnh mạch vành, suy tim, rối loạn nhịp tim.",
          details: "Trang bị máy đo điện tim, siêu âm tim màu, theo dõi Holter 24h và thăm dò chức năng tim mạch."
        },
        {
          id: "khoa-tieu-hoa",
          name: "Khoa Nội tiêu hóa",
          leader: "BSCKI. Hoàng Thị Lan",
          phone: "02353.747.432 (Mã nhánh: 105)",
          staffCount: 20,
          description: "Điều trị các bệnh lý đường tiêu hóa: viêm loét dạ dày, trĩ, viêm đại tràng.",
          details: "Thực hiện nội soi dạ dày - đại tràng, siêu âm bụng và xét nghiệm HP."
        },
        {
          id: "khoa-than-tiet-nieu",
          name: "Khoa Nội thận – Tiết niệu – Nội tiết",
          leader: "ThS. BS. Lê Thị Hương",
          phone: "02353.747.432 (Mã nhánh: 106)",
          staffCount: 24,
          description: "Điều trị bệnh thận, tiết niệu, nội tiết: suy thận, sỏi thận, đái tháo đường, tuyến giáp.",
          details: "Hệ thống lọc máu hiện đại, theo dõi điện giải và chức năng thận liên tục cho bệnh nhân nặng."
        },
        {
          id: "khoa-truyen-nhiem",
          name: "Khoa Truyền nhiễm",
          leader: "BSCKI. Phạm Văn Tùng",
          phone: "02353.747.432 (Mã nhánh: 107)",
          staffCount: 18,
          description: "Điều trị các bệnh truyền nhiễm: sốt xuất huyết, viêm gan, HIV/AIDS, COVID-19.",
          details: "Khu vực cách ly đạt chuẩn, hệ thống lọc khí và phòng xét nghiệm riêng biệt."
        },
        {
          id: "khoa-icu",
          name: "Khoa Hồi sức tích cực – Chống độc",
          leader: "BSCKII. Nguyễn Văn Đức",
          phone: "02353.747.432 (Mã nhánh: 108)",
          staffCount: 35,
          description: "Hồi sức cấp cứu bệnh nhân nặng, chống độc, hỗ trợ hô hấp và tuần hoàn.",
          details: "Giường ICU hiện đại, máy thở, theo dõi đa thông số và đội ngũ được đào tạo chuyên sâu."
        },
        {
          id: "khoa-ngoai-tq",
          name: "Khoa Ngoại tổng hợp",
          leader: "BSCKII. Lê Văn Lâm",
          phone: "02353.747.432 (Mã nhánh: 109)",
          staffCount: 32,
          description: "Phẫu thuật nội soi ổ bụng, nội soi tiết niệu, bướu cổ và các phẫu thuật thường quy.",
          details: "2 phòng mổ áp lực dương hiện đại, ứng dụng kỹ thuật ít xâm lấn giúp hồi phục nhanh."
        },
        {
          id: "khoa-ngoai-than-kinh",
          name: "Khoa Ngoại thần kinh",
          leader: "BSCKI. Trịnh Minh Tuấn",
          phone: "02353.747.432 (Mã nhánh: 110)",
          staffCount: 20,
          description: "Phẫu thuật não, cột sống, dây thần kinh ngoại biên và điều trị chấn thương sọ não.",
          details: "Hệ thống neuronavigation và kính vi phẫu hiện đại hỗ trợ các ca mổ thần kinh phức tạp."
        },
        {
          id: "khoa-ctch",
          name: "Khoa Ngoại chấn thương chỉnh hình",
          leader: "ThS. BS. Bùi Văn Hùng",
          phone: "02353.747.432 (Mã nhánh: 111)",
          staffCount: 26,
          description: "Điều trị gãy xương, trật khớp, tổn thương dây chằng và phẫu thuật thay khớp.",
          details: "Phòng mổ chấn thương chỉnh hình với hệ thống C-arm, thay khớp háng và khớp gối nhân tạo."
        },
        {
          id: "khoa-phu-san",
          name: "Khoa Phụ sản",
          leader: "ThS. BS. Trần Thị Kiều",
          phone: "02353.747.432 (Mã nhánh: 112)",
          staffCount: 28,
          description: "Đỡ đẻ, mổ đẻ, quản lý thai kỳ trọn gói, tầm soát dị tật thai nhi và ung thư cổ tử cung.",
          details: "Khu đỡ đẻ gia đình ấm áp, hỗ trợ kề vai sau sinh với đội ngũ hộ sinh nhẹ nhàng 24/7."
        },
        {
          id: "khoa-nhi",
          name: "Khoa Nhi",
          leader: "BSCKI. Phan Thanh Hải",
          phone: "02353.747.432 (Mã nhánh: 113)",
          staffCount: 22,
          description: "Cấp cứu và điều trị nội trú nhi khoa, hồi sức sơ sinh, vàng da sinh lý.",
          details: "Phòng bệnh thân thiện với trẻ nhỏ, giảm áp lực tâm lý cho bé và người nhà trong điều trị."
        },
        {
          id: "khoa-da-lieu",
          name: "Khoa Da liễu",
          leader: "BSCKI. Nguyễn Thị Thanh",
          phone: "02353.747.432 (Mã nhánh: 114)",
          staffCount: 15,
          description: "Khám và điều trị bệnh da: eczema, vảy nến, mụn, nấm da, dị ứng da liễu.",
          details: "Kết hợp điều trị bằng quang trị liệuUVB và các phác đồ thuốc sinh học hiện đại."
        },
        {
          id: "khoa-mat",
          name: "Khoa Mắt",
          leader: "BSCKI. Đặng Thị Hòa",
          phone: "02353.747.432 (Mã nhánh: 115)",
          staffCount: 14,
          description: "Khám và điều trị bệnh lý mắt: đục thủy tinh thể, glaucoma, viêm kết mạc.",
          details: "Phẫu thuật Mổ Phaco đục thủy tinh thể, đo thị lực và phẫu thuật lác."
        },
        {
          id: "khoa-rang-ham-mat",
          name: "Khoa Răng hàm mặt",
          leader: "ThS. BS. Nguyễn Văn Quang",
          phone: "02353.747.432 (Mã nhánh: 116)",
          staffCount: 18,
          description: "Khám răng, nhổ răng, điều trị tủy, trồng implant, chỉnh nha và phẫu thuật hàm mặt.",
          details: "Ghế nha đơn vị hiện đại, máy X-quang Panorama, hệ thống vô trùng đạt chuẩn."
        },
        {
          id: "khoa-tai-mui-hong",
          name: "Khoa Tai mũi họng",
          leader: "BSCKI. Trần Văn Kiên",
          phone: "02353.747.432 (Mã nhánh: 117)",
          staffCount: 16,
          description: "Khám và điều trị bệnh tai, mũi, họng: viêm amidan, viêm xoang, ù tai, giảm thính lực.",
          details: "Nội soi tai mũi họng, đo thính lực và phẫu thuật vá màng nhĩ, cắt amidan nội soi."
        },
        {
          id: "khoa-ga-me",
          name: "Khoa Phẫu thuật – Gây mê hồi sức",
          leader: "BSCKII. Lê Thị Mai",
          phone: "02353.747.432 (Mã nhánh: 118)",
          staffCount: 28,
          description: "Thực hiện gây mê, hồi sức trước và sau mổ, quản lý đau sau phẫu thuật.",
          details: "Đội ngũ gây mê viên giàu kinh nghiệm, phòng hồi sức sau mổ (PACU) với 12 giường."
        },
        {
          id: "khoa-y-duoc",
          name: "Khoa Y dược cổ truyền",
          leader: "BSCKI. Hoàng Văn Nam",
          phone: "02353.747.432 (Mã nhánh: 119)",
          staffCount: 12,
          description: "Điều trị bằng y học cổ truyền: châm cứu, xoa bóp, bốc thuốc,Yoga trị liệu.",
          details: "Kết hợp y học hiện đại và y học cổ truyền mang lại hiệu quả tối ưu cho người bệnh."
        },
        {
          id: "khoa-vl-pt",
          name: "Khoa Vật lý trị liệu – Phục hồi chức năng",
          leader: "ThS. Phạm Thị Lan",
          phone: "02353.747.432 (Mã nhánh: 120)",
          staffCount: 14,
          description: "Phục hồi chức năng sau tai biến, chấn thương, phẫu thuật: tập vận động, điện trị liệu.",
          details: "Hệ thống máy tập hiện đại, bể sục thủy trị liệu, phòng tập gym phục hồi chức năng."
        },
        {
          id: "khoa-ung-buou",
          name: "Khoa Ung bướu – Huyết học",
          leader: "BSCKII. Nguyễn Thị Phương",
          phone: "02353.747.432 (Mã nhánh: 121)",
          staffCount: 20,
          description: "Chẩn đoán và điều trị ung thư các vị trí, bệnh lý máu: hóa trị, xạ trị, truyền máu.",
          details: "Phối hợp với các trung tâm ung bướu tuyến trung ương, hóa trị ung thư tại chỗ."
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
          id: "khoa-cdha",
          name: "Khoa Chẩn đoán Hình Ảnh",
          leader: "BSCKI. Nguyễn Minh Khang",
          phone: "02353.747.432 (Mã nhánh: 201)",
          staffCount: 20,
          description: "Chụp CT đa dãy, MRI, X-quang kỹ thuật số, siêu âm màu 4D, đo mật độ xương.",
          details: "Hình ảnh độ phân giải cao kết nối PACS trực tiếp đến phòng khám, rút ngắn thời gian chờ."
        },
        {
          id: "khoa-xet-nghiem",
          name: "Khoa Xét nghiệm",
          leader: "ThS. Đỗ Thị Thanh",
          phone: "02353.747.432 (Mã nhánh: 202)",
          staffCount: 22,
          description: "Xét nghiệm sinh hóa, huyết học, miễn dịch, vi sinh hoàn toàn tự động hóa.",
          details: "Hệ thống quản lý chất lượng ISO 15189, kết quả nhanh chính xác trong ngày."
        },
        {
          id: "khoa-duoc",
          name: "Khoa Dược",
          leader: "DS. CKI. Nguyễn Văn Hoàng",
          phone: "02353.747.432 (Mã nhánh: 203)",
          staffCount: 18,
          description: "Cung ứng thuốc đầy đủ, chất lượng cao cho bệnh nhân nội trú và bảo hiểm.",
          details: "Kho thuốc đạt chuẩn GSP kiểm soát nhiệt độ tự động, đảm bảo hoạt tính thuốc nguyên vẹn."
        },
        {
          id: "khoa-ksnk",
          name: "Khoa Kiểm soát Nhiễm khuẩn",
          leader: "CN. Trần Thị Hương",
          phone: "02353.747.432 (Mã nhánh: 204)",
          staffCount: 12,
          description: "Giám sát và phòng ngừa nhiễm khuẩn bệnh viện, quản lý kháng sinh hợp lý.",
          details: "Theo dõi tỷ lệ nhiễm khuẩn, đào tạo staff về vệ sinh tay và khử khuẩn thiết bị y tế."
        },
        {
          id: "khoa-gpb",
          name: "Khoa Giải phẫu Bệnh",
          leader: "BSCKI. Lê Thị Bích",
          phone: "02353.747.432 (Mã nhánh: 205)",
          staffCount: 8,
          description: "Xét nghiệm tế bào học, mô bệnh học, sinh thiết chẩn đoán ung thư và bệnh lý khác.",
          details: "Hợp tác chuyên gia bệnh học tuyến trung ương để xác nhận chẩn đoán khó."
        },
        {
          id: "khoa-dd",
          name: "Khoa Dinh dưỡng",
          leader: "CN. Nguyễn Thị Minh",
          phone: "02353.747.432 (Mã nhánh: 206)",
          staffCount: 10,
          description: "Tư vấn dinh dưỡng cho bệnh nhân nội trú, chế độ ăn đặc biệt và dinh dưỡng lâm sàng.",
          details: "Xây dựng thực đơn cá nhân hóa cho bệnh nhân ung thư, suy thận, đái tháo đường."
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
            <h3 className="font-display font-bold text-xl md:text-2xl text-green-dark">Sơ đồ tổ chức Bệnh viện</h3>
            <span className="w-8 h-px bg-[#2FA968]"></span>
          </div>
          <p className="font-sans text-gray-600 text-[13.5px] max-w-2xl mx-auto mb-10">
            Hệ thống tổ chức gồm 3 khối: Hành chính (9 phòng/ban), Lâm sàng (21 khoa) và Cận lâm sàng (6 khoa). Click chọn khối để xem chi tiết các đơn vị và liên hệ nội bộ.
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
