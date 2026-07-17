export interface DeptNode {
  id: string;
  name: string;
  leader: string;
  phone: string;
  staffCount: number;
  description: string;
  details?: string;
}

export interface Division {
  id: string;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  bgLight: string;
  textColor: string;
  departments: DeptNode[];
}

export const divisionsData: Record<string, Division> = {
  administrative: {
    id: "administrative",
    name: "Khối Hành Chính",
    icon: "Landmark",
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
    id: "clinical",
    name: "Khối Lâm Sàng",
    icon: "Users",
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
        id: "khoa-san-phu-khoa",
        name: "Khoa Sản – Phụ khoa",
        leader: "BSCKII. Trần Thị Lan",
        phone: "02353.747.432 (Mã nhánh: 112)",
        staffCount: 28,
        description: "Chăm sóc thai sản, đỡ đẻ, phẫu thuật phụ khoa và điều trị bệnh phụ nữ.",
        details: "Phòng mổ sản hiện đại, theo dõi monitor thai và hỗ trợ sinh non cho mẹ và bé."
      },
      {
        id: "khoa-nhi",
        name: "Khoa Nhi",
        leader: "BSCKI. Hoàng Minh Tuấn",
        phone: "02353.747.432 (Mã nhánh: 113)",
        staffCount: 22,
        description: "Khám và điều trị bệnh lý cho trẻ em từ sơ sinh đến 15 tuổi.",
        details: "Khu vực khám nhi riêng biệt, đội ngũ bác sĩ chuyên khoa nhi tận tình, chu đáo."
      },
      {
        id: "khoa-mat",
        name: "Khoa Mắt",
        leader: "BSCKI. Nguyễn Thị Hương",
        phone: "02353.747.432 (Mã nhánh: 114)",
        staffCount: 15,
        description: "Điều trị các bệnh lý về mắt: đục thủy tinh thể, glaucoma, viêm kết mạc.",
        details: "Trang bị máy đo khúc xạ, soi đáy mắt và phẫu thuật mắt hiện đại."
      },
      {
        id: "khoa-tai-mui-hong",
        name: "Khoa Tai Mũi Họng",
        leader: "BSCKII. Lê Minh Đức",
        phone: "02353.747.432 (Mã nhánh: 115)",
        staffCount: 18,
        description: "Điều trị bệnh tai, mũi, họng và các khối u vùng đầu cổ.",
        details: "Hệ thống nội soi tai mũi họng, đo thính lực và phẫu thuật vá màng nhĩ."
      },
      {
        id: "khoa-da-lieu",
        name: "Khoa Da liễu",
        leader: "ThS. BS. Trần Thị Hà",
        phone: "02353.747.432 (Mã nhánh: 116)",
        staffCount: 14,
        description: "Điều trị các bệnh da: eczema, psoriasis, mụn rộp, nấm da và các bệnh lây truyền qua đường tình dục.",
        details: "Áp dụng phương pháp điều trị bằng ánh sáng và laser cho các bệnh da mãn tính."
      },
      {
        id: "khoa-yhct",
        name: "Khoa Y học Cổ truyền",
        leader: "BSCKI. Phạm Văn Bình",
        phone: "02353.747.432 (Mã nhánh: 117)",
        staffCount: 16,
        description: "Kết hợp y học hiện đại và y học cổ truyền, châm cứu, bấm huyệt, điều trị phục hồi.",
        details: "Phòng khám YHCT kết hợp với vật lý trị liệu, phục hồi chức năng cho bệnh nhân sau tai biến."
      },
      {
        id: "khoa-vl-pt",
        name: "Khoa Vật lý trị liệu – Phục hồi chức năng",
        leader: "ThS. Nguyễn Thị Minh",
        phone: "02353.747.432 (Mã nhánh: 118)",
        staffCount: 20,
        description: "Phục hồi chức năng vận động sau tai biến, chấn thương, phẫu thuật thần kinh cột sống.",
        details: "Trang bị máy điện trị liệu, tập vận động dưới nước và hệ thống robot phục hồi."
      },
      {
        id: "khoa-phcn",
        name: "Khoa Phục hồi Chức năng",
        leader: "BSCKI. Đặng Văn Minh",
        phone: "02353.747.432 (Mã nhánh: 119)",
        staffCount: 18,
        description: "Điều trị phục hồi cho bệnh nhân sau tai biến, chấn thương, giúp tăng cường vận động.",
        details: "Kết hợp y học cổ truyền và vật lý trị liệu hiện đại để phục hồi toàn diện."
      },
      {
        id: "khoa-roi-loan-tamthan",
        name: "Khoa Rối loạn Tâm thần",
        leader: "BSCKII. Hoàng Thị Lan",
        phone: "02353.747.432 (Mã nhánh: 120)",
        staffCount: 15,
        description: "Điều trị các rối loạn tâm thần: trầm cảm, lo âu, tâm thần phân liệt.",
        details: "Khu điều trị nội trú riêng biệt, tư vấn tâm lý và trị liệu nhóm cho bệnh nhân."
      },
      {
        id: "khoa-tham-my",
        name: "Khoa Thẩm mỹ",
        leader: "BSCKI. Trần Thị Thanh",
        phone: "02353.747.432 (Mã nhánh: 121)",
        staffCount: 12,
        description: "Cung cấp các dịch vụ thẩm mỹ: laser, filler, botox và phẫu thuật thẩm mỹ.",
        details: "Phòng mổ thẩm mỹ đạt chuẩn, sử dụng công nghệ laser tiên tiến và vật liệu an toàn."
      }
    ]
  },
  paraclinical: {
    id: "paraclinical",
    name: "Khối Cận Lâm Sàng",
    icon: "Layers",
    color: "bg-[#FFA265]",
    borderColor: "border-[#FFA265]/30",
    bgLight: "bg-[#FFF5EE]",
    textColor: "text-[#B45309]",
    departments: [
      {
        id: "khoa-cdha",
        name: "Khoa Chẩn đoán Hình ảnh",
        leader: "BSCKII. Nguyễn Văn Hùng",
        phone: "02353.747.432 (Mã nhánh: 201)",
        staffCount: 22,
        description: "Thực hiện X-quang, siêu âm, CT-Scan, MRI và các thăm dò hình ảnh chuyên sâu.",
        details: "Máy CT-Scan 128 lát cắt, MRI 1.5T và hệ thống PACS lưu trữ hình ảnh y khoa."
      },
      {
        id: "khoa-tdcn",
        name: "Khoa Thăm dò Chức năng",
        leader: "BSCKI. Đỗ Minh Tuấn",
        phone: "02353.747.432 (Mã nhánh: 202)",
        staffCount: 16,
        description: "Điện tim, điện não đồ, điện cơ, Holter давления và các xét nghiệm chức năng.",
        details: "Máy điện tim 12 lead, Holter 24h và thiết bị đo chức năng hô hấp hiện đại."
      },
      {
        id: "khoa-xn",
        name: "Khoa Xét nghiệm",
        leader: "ThS. BS. Lê Thị Hương",
        phone: "02353.747.432 (Mã nhánh: 203)",
        staffCount: 24,
        description: "Thực hiện các xét nghiệm huyết học, sinh hóa, vi sinh, miễn dịch và phân tích nước tiểu.",
        details: "Hệ thống xét nghiệm tự động hóa hoàn toàn, kết quả chính xác trong 2 giờ."
      },
      {
        id: "khoa-gpbl",
        name: "Khoa Giải phẫu Bệnh lý",
        leader: "BSCKI. Trần Văn Phúc",
        phone: "02353.747.432 (Mã nhánh: 204)",
        staffCount: 10,
        description: "Xem xét mẫu mô bệnh học, tế bào học, chẩn đoán ung thư và các bệnh lý khác.",
        details: "Phòng xét nghiệm mô bệnh học đạt chuẩn, hệ thống nhuộm hóa mô miễn dịch."
      },
      {
        id: "khoa-dược",
        name: "Khoa Dược",
        leader: "DS. CKI. Nguyễn Thị Lan",
        phone: "02353.747.432 (Mã nhánh: 205)",
        staffCount: 18,
        description: "Cung ứng thuốc, tư vấn sử dụng thuốc an toàn, theo dõi phản ứng có hại của thuốc.",
        details: "Hệ thống phân phát thuốc tự động, kiểm soát tồn kho và hạn sử dụng thuốc realtime."
      },
      {
        id: "khoa-ksnk",
        name: "Khoa Kiểm soát Nhiễm khuẩn",
        leader: "CN. Phạm Thị Hà",
        phone: "02353.747.432 (Mã nhánh: 206)",
        staffCount: 12,
        description: "Giám sát và phòng ngừa nhiễm khuẩn bệnh viện, kiểm soát sử dụng kháng sinh.",
        details: "Quy trình khử khuẩn, tiệt trùng dụng cụ và giám sát định kỳ môi trường bệnh viện."
      }
    ]
  }
};

class OrganizationService {
  getAll(): Record<string, Division> {
    return divisionsData;
  }

  getByDivision(divisionId: string): Division | null {
    return divisionsData[divisionId] || null;
  }

  getDepartment(divisionId: string, deptId: string): DeptNode | null {
    const division = divisionsData[divisionId];
    if (!division) return null;
    return division.departments.find(d => d.id === deptId) || null;
  }

  createDepartment(divisionId: string, dept: Omit<DeptNode, 'id'>): DeptNode | null {
    const division = divisionsData[divisionId];
    if (!division) return null;

    const id = `dept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newDept: DeptNode = { ...dept, id };
    division.departments.push(newDept);
    return newDept;
  }

  updateDepartment(divisionId: string, deptId: string, updates: Partial<DeptNode>): DeptNode | null {
    const division = divisionsData[divisionId];
    if (!division) return null;

    const index = division.departments.findIndex(d => d.id === deptId);
    if (index === -1) return null;

    division.departments[index] = { ...division.departments[index], ...updates };
    return division.departments[index];
  }

  deleteDepartment(divisionId: string, deptId: string): boolean {
    const division = divisionsData[divisionId];
    if (!division) return false;

    const index = division.departments.findIndex(d => d.id === deptId);
    if (index === -1) return false;

    division.departments.splice(index, 1);
    return true;
  }

  createDivision(division: Omit<Division, 'departments'>): Division | null {
    if (divisionsData[division.id]) return null;
    divisionsData[division.id] = { ...division, departments: [] };
    return divisionsData[division.id];
  }

  updateDivision(divisionId: string, updates: Partial<Division>): Division | null {
    if (!divisionsData[divisionId]) return null;
    divisionsData[divisionId] = { ...divisionsData[divisionId], ...updates };
    return divisionsData[divisionId];
  }
}

export const organizationService = new OrganizationService();