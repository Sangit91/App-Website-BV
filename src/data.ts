import { Specialty, Doctor, Testimonial, NewsItem } from "./types";

export const SPECIALTIES: Specialty[] = [
  {
    id: "tim-mach",
    name: "Khoa Tim Mạch",
    description: "Chẩn đoán, điều trị chuyên sâu bệnh lý mạch vành, tăng huyết áp, suy tim.",
    iconType: "cardiology",
    detail: "Được trang bị máy đo điện tim, siêu âm tim chuyên sâu màu, hỗ trợ chăm sóc sức khỏe tim mạch toàn diện cho nhân dân miền núi trong khu vực."
  },
  {
    id: "san-khoa",
    name: "Khoa Sản Phụ Khoa",
    description: "Chăm sóc thai kỳ trọn gói, sinh con an toàn và điều trị phụ khoa.",
    iconType: "obstetrics",
    detail: "Không gian sinh đẻ ấm cúng, thân thiện. Đội ngũ nữ hộ sinh nhẹ nhàng, chu đáo, hỗ trợ các sản phụ vượt cạn an tâm."
  },
  {
    id: "nhi-khoa",
    name: "Khoa Nhi",
    description: "Khám và điều trị các bệnh lý trẻ em, tư vấn dinh dưỡng và tiêm chủng.",
    iconType: "pediatrics",
    detail: "Khu vực khám Nhi được thiết kế sinh động, nhiều màu sắc ấm áp, giúp trẻ quên đi nỗi sợ hãi khi đi gặp bác sĩ."
  },
  {
    id: "cap-cuu",
    name: "Khoa Hồi Sức Cấp Cứu",
    description: "Trực cấp cứu 24/7, xử lý nhanh chóng mọi ca bệnh khẩn cấp, nguy kịch.",
    iconType: "emergency",
    detail: "Phản ứng nhanh chóng, cứu sống hàng ngàn bệnh nhân nguy kịch nhờ quy trình liên kết chặt chẽ và chuyên nghiệp."
  },
  {
    id: "ngoai-tong-hop",
    name: "Khoa Ngoại Tổng Hợp",
    description: "Phẫu thuật nội soi, chấn thương chỉnh hình và các bệnh lý ngoại khoa.",
    iconType: "general",
    detail: "Ứng dụng công nghệ mổ nội soi tiên tiến giúp giảm đau đớn, hồi phục nhanh, tiết kiệm tối đa thời gian nằm viện."
  },
  {
    id: "chan-doan-hinh-anh",
    name: "Xét Nghiệm & CĐHA",
    description: "Chụp X-quang, cắt lớp vi tính CT, siêu âm và xét nghiệm tự động.",
    iconType: "diagnostics",
    detail: "Hệ thống máy xét nghiệm tự động hóa hoàn toàn cùng máy chụp CT đa dãy tiên tiến giúp đưa ra kết quả nhanh chóng, chính xác."
  },
  {
    id: "tai-mui-hong",
    name: "Khoa Tai Mũi Họng",
    description: "Khám điều trị các bệnh về tai, mũi, họng cấp và mãn tính.",
    iconType: "ent",
    detail: "Điều trị nội khoa và phẫu thuật họng, xoang bằng các phương pháp tiên tiến, an toàn cho cả người lớn và trẻ em."
  },
  {
    id: "rang-ham-mat",
    name: "Khoa Răng Hàm Mặt",
    description: "Khám răng, nha khoa thẩm mỹ, xử lý các chấn thương hàm mặt.",
    iconType: "odontology",
    detail: "Nha khoa thẩm mỹ, điều trị tủy răng công nghệ cao giúp chăm sóc nụ cười khỏe đẹp cho mọi người dân."
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: "dr-tri",
    name: "BS. CKII. Nguyễn Minh Trí",
    title: "Trưởng khoa Tim Mạch / Thầy thuốc Ưu tú",
    specialtyId: "tim-mach",
    specialtyName: "Khoa Tim Mạch",
    image: "https://images.pexels.com/photos/3714743/pexels-photo-3714743.jpeg?auto=compress&cs=tinysrgb&w=600",
    experience: "Hơn 25 năm kinh nghiệm trong lĩnh vực tim mạch, từng công tác tại các bệnh viện lớn tuyến trung ương.",
    schedule: "Thứ Hai - Thứ Sáu (07:30 - 11:30)"
  },
  {
    id: "dr-mai",
    name: "ThS. BS. Nguyễn Thị Phương Mai",
    title: "Phó khoa Sản Phụ Khoa",
    specialtyId: "san-khoa",
    specialtyName: "Khoa Sản Phụ Khoa",
    image: "https://images.pexels.com/photos/4158293/pexels-photo-4158293.jpeg?auto=compress&cs=tinysrgb&w=600",
    experience: "15 năm chuyên tâm chăm sóc sức khỏe mẹ bầu, chuyên gia về sinh thường và sinh mổ nhẹ nhàng.",
    schedule: "Thứ Hai - Thứ Năm (08:00 - 16:30)"
  },
  {
    id: "dr-hai",
    name: "BS. CKI. Phan Thanh Hải",
    title: "Bác sĩ điều trị - Khoa Nhi",
    specialtyId: "nhi-khoa",
    specialtyName: "Khoa Nhi",
    image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=600",
    experience: "12 năm kinh nghiệm nhi khoa, thấu hiểu tâm lý trẻ nhỏ, chuyên trị các bệnh lý đường hô hấp và tiêu hóa.",
    schedule: "Thứ Ba - Thứ Sáu (08:00 - 17:00)"
  },
  {
    id: "dr-hong",
    name: "BS. Lê Thị Thu Hồng",
    title: "Bác sĩ Phẫu thuật - Khoa Ngoại tổng hợp",
    specialtyId: "ngoai-tong-hop",
    specialtyName: "Khoa Ngoại Tổng Hợp",
    image: "https://images.pexels.com/photos/3825189/pexels-photo-3825189.jpeg?auto=compress&cs=tinysrgb&w=600",
    experience: "10 năm phẫu thuật nội soi ngoại khoa ổ bụng, thạc sĩ ngoại khoa uy tín nhiệt huyết.",
    schedule: "Thứ Hai - Thứ Tư (13:30 - 17:00)"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testi-1",
    patientName: "Cô Trương Thị Hoa",
    location: "Xã Đại Lộc, thành phố Đà Nẵng",
    content: "Tôi bị bệnh tim mạch mãn tính, thường xuyên mệt mỏi khó thở. Được bác sĩ Trí điều trị vô cùng tận tâm, giải thích dễ hiểu, nay tôi đã khỏe mạnh hẳn. Bệnh viện rất sạch sẽ, các cô điều dưỡng nhẹ nhàng chu đáo vô cùng ấm áp.",
    avatarColor: "bg-peach text-white"
  },
  {
    id: "testi-2",
    patientName: "Anh Nguyễn Văn Hoàng",
    location: "Xã Đại Lãnh, Đại Lộc, thành phố Đà Nẵng",
    content: "Đưa cháu nhỏ đi khám ở khoa Nhi, ấn tượng nhất là các phòng ốc trang trí rất ngộ nghĩnh, y bác sĩ dỗ dành các cháu khéo léo nên con tôi không khóc tí nào. Khám nhanh chóng, cấp thuốc đầy đủ hướng dẫn kỹ càng.",
    avatarColor: "bg-brand-green text-white"
  },
  {
    id: "testi-3",
    patientName: "Chị Phan Thị Vy",
    location: "Xã Đại Hồng, Đại Lộc, thành phố Đà Nẵng",
    content: "Tôi vừa sinh em bé tại khoa Sản tháng trước. Phòng ốc sạch mát mẻ như ở nhà, điều dưỡng hỗ trợ tắm bé và hướng dẫn cho con bú sữa mẹ từng chút một. Cảm giác ấm áp thân thiện đúng nghĩa miền núi thân thương.",
    avatarColor: "bg-green-dark text-white"
  }
];

export const NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "BVĐK KV Miền Núi Phía Bắc Quảng Nam triển khai kỹ thuật phẫu thuật nội soi khớp gối tiên tiến",
    summary: "Người dân khu vực miền núi Quảng Nam nay đã có thể tiếp cận kỹ thuật phẫu thuật hiện đại ngay tại địa phương, giảm thiểu chi phí đi lại và hồi phục nhanh chóng.",
    tag: "Tin y học",
    date: "12/07/2026",
    image: "https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: "Căn cứ theo quyết định phê duyệt danh mục chuyên môn của Sở Y tế tỉnh Quảng Nam, Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam chính thức đưa vào vận hành hệ thống trang thiết bị hỗ trợ phẫu thuật nội soi khớp gối tiên tiến thế hệ mới.\n\nĐây là bước tiến vượt bậc trong công tác nâng cao năng lực lâm sàng tại chỗ cho đội ngũ y bác sĩ ngoại chấn thương chỉnh hình của bệnh viện. Nhờ đó, người dân khu vực huyện Đại Lộc, Nam Giang, Đông Giang, Tây Giang khi gặp các chấn thương thể thao, thoái hóa khớp gối phức tạp sẽ được phẫu thuật trực tiếp tại viện bởi các chuyên gia giàu kinh nghiệm mà không cần phải chuyển tuyến lên tuyến tỉnh hay trung ương như trước đây.\n\nViệc làm chủ kỹ thuật cao này không chỉ giúp giảm tải đáng kể cho các bệnh viện tuyến trên mà quan trọng hơn là giảm thiểu gánh nặng tài chính, chi phí đi lại và sinh hoạt cho người bệnh cùng gia đình trong quá trình điều trị nội trú lâu dài."
  },
  {
    id: "news-2",
    title: "Thông báo về lịch khám bệnh miễn phí và cấp phát thuốc cho đồng bào vùng cao khó khăn",
    summary: "Chương trình thiện nguyện 'Áo ấm Blouse trắng' sẽ diễn ra vào cuối tuần này tại các xã vùng sâu vùng xa huyện Đại Lộc nhằm hỗ trợ y tế cộng đồng.",
    tag: "Thông báo",
    date: "10/07/2026",
    image: "https://images.pexels.com/photos/6625841/pexels-photo-6625841.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: "Kính gửi: Toàn thể nhân dân trên địa bàn huyện Đại Lộc và các khu vực lân cận.\n\nThực hiện sứ mệnh chăm sóc sức khỏe cộng đồng toàn diện, đặc biệt là đồng bào các dân tộc vùng cao và các hộ gia đình có hoàn cảnh đặc biệt khó khăn, Ban Giám đốc Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam kết hợp cùng Đoàn thanh niên Cộng sản Hồ Chí Minh tổ chức chương trình khám bệnh, tư vấn sức khỏe miễn phí và cấp phát thuốc thường kỳ 'Áo ấm Blouse trắng'.\n\nChương trình sẽ chính thức diễn ra vào ngày thứ Bảy tuần này tại Trạm y tế xã vùng sâu. Các nội dung thăm khám bao gồm: Khám nội tổng quát, sàng lọc tim mạch và huyết áp, khám nhi khoa, tư vấn chăm sóc răng miệng, siêu âm tổng quát và cấp phát miễn phí các loại thuốc bổ, thuốc điều trị bệnh lý thông thường."
  },
  {
    id: "news-3",
    title: "Bệnh viện đón tiếp đoàn chuyên gia quốc tế chuyển giao công nghệ siêu âm tim 4D mới",
    summary: "Đợt chuyển giao trang thiết bị y khoa hiện đại hỗ trợ nâng cao chất lượng chẩn đoán hình ảnh tim mạch cho bệnh nhi và sản phụ vùng núi Quảng Nam.",
    tag: "Sự kiện",
    date: "05/07/2026",
    image: "https://images.pexels.com/photos/7088487/pexels-photo-7088487.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: "Trong khuôn khổ chương trình hợp tác quốc tế và chuyển giao kỹ thuật y khoa chất lượng cao, Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam đã tổ chức lễ tiếp nhận và chuyển giao trang thiết bị máy siêu âm tim mạch 4D cao cấp từ đoàn chuyên gia y tế nước ngoài.\n\nHệ thống máy siêu âm thế hệ mới này tích hợp các thuật toán dựng hình thời gian thực tiên tiến, giúp tăng cường độ chính xác tối đa trong chẩn đoán các bệnh lý dị tật tim bẩm sinh ở thai nhi và trẻ sơ sinh, đồng thời đánh giá huyết động học toàn diện cho bệnh nhân tim mạch người lớn.\n\nBên cạnh việc bàn giao máy, đoàn chuyên gia cũng thực hiện khóa đào tạo tập huấn lâm sàng kéo dài một tuần nhằm hướng dẫn thực hành siêu âm thực tế trên bệnh nhân tại khoa Thăm dò chức năng và chẩn đoán hình ảnh của bệnh viện."
  },
  {
    id: "tender-1",
    tenderNumber: "TB-2026-001/CNTT",
    title: "Yêu cầu báo giá: Nâng cấp hệ thống Switch trung tâm và tủ Rack bảo mật thông tin",
    summary: "Phòng CNTT thông báo mời thầu và nhận báo giá gói thầu nâng cấp hệ thống mạng switch trung tâm cho toàn viện.",
    tag: "Thông báo",
    date: "14/07/2026",
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: "Kính gửi: Các đơn vị cung ứng giải pháp và hạ tầng mạng viễn thông.\n\nPhòng Công nghệ thông tin - Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam xin thông báo mời báo giá cho gói thầu mua sắm, lắp đặt và cấu hình hệ thống Switch trung tâm (Core Switch) phục vụ mở rộng mạng LAN nội bộ.\n\nYêu cầu kỹ thuật: Thiết bị chính hãng mới 100%, bảo hành tối thiểu 24 tháng, hỗ trợ kết nối quang đa sợi tốc độ 10Gbps.\n\nMọi chi tiết xin vui lòng xem tài liệu kỹ thuật đính kèm bên dưới.",
    isTender: true,
    tenderMethod: "Mua sắm trực tiếp",
    tenderEstimateValue: "350.000.000 VNĐ",
    tenderStartDate: "09:00:00 ngày 15/07/2026",
    tenderEndDate: "17:00:00 ngày 25/07/2026",
    tenderDept: "PHÒNG CNTT",
    tenderReceivedLocation: "Phòng Công nghệ thông tin - Tầng 3 Nhà A",
    tenderContact: "Nguyễn Văn Minh",
    tenderContactPhone: "02353.747.432 (máy lẻ 301)",
    tenderFile: { name: "Yêu_cầu_báo_giá_Switch_CNTT_2026.pdf", size: "1.8 MB" },
    tenderDownloadCount: 24
  },
  {
    id: "tender-2",
    tenderNumber: "TB-2026-002/VTTBYT",
    title: "Mời thầu mua sắm: Hệ thống phẫu thuật nội soi khớp và dao mổ siêu âm thế hệ mới",
    summary: "Phòng Vật tư Thiết bị Y tế thông báo mời thầu gói cung cấp trang thiết bị phẫu thuật nội soi hiện đại năm 2026.",
    tag: "Thông báo",
    date: "13/07/2026",
    image: "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: "Kính gửi: Các nhà thầu cung cấp trang thiết bị y tế đủ năng lực hành nghề pháp lý.\n\nPhòng Vật tư Thiết bị Y tế thông báo mời thầu rộng rãi gói thầu mua sắm 'Hệ thống phẫu thuật nội soi khớp gối và dao mổ siêu âm hỗ trợ điều trị ngoại khoa'.\n\nNguồn vốn: Ngân sách nhà nước và quỹ phát triển hoạt động sự nghiệp của bệnh viện.\n\nHồ sơ dự thầu cần nộp trực tiếp tại phòng Vật tư trước thời điểm khóa thầu quy định.",
    isTender: true,
    tenderMethod: "Đấu thầu rộng rãi",
    tenderEstimateValue: "2.850.000.000 VNĐ",
    tenderStartDate: "08:00:00 ngày 14/07/2026",
    tenderEndDate: "11:30:00 ngày 28/07/2026",
    tenderDept: "PHÒNG VTTBYT",
    tenderReceivedLocation: "Phòng Vật tư Thiết bị Y tế - Tầng 2 Nhà B",
    tenderContact: "Trần Thị Hương",
    tenderContactPhone: "02353.747.432 (máy lẻ 201)",
    tenderFile: { name: "HSMT_ThietBi_NoiSoi_2026.pdf", size: "3.2 MB" },
    tenderDownloadCount: 42
  },
  {
    id: "tender-3",
    tenderNumber: "TB-2026-003/XN",
    title: "Mời thầu: Cung ứng hóa chất xét nghiệm miễn dịch tự động và sinh phẩm chẩn đoán",
    summary: "Khoa Xét nghiệm kính mời báo giá cung cấp hóa chất và sinh phẩm xét nghiệm phục vụ điều trị lâm sàng.",
    tag: "Thông báo",
    date: "12/07/2026",
    image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: "Kính gửi: Các doanh nghiệp cung cấp hóa chất, vật tư xét nghiệm lâm sàng.\n\nKhoa Xét nghiệm tổ chức tiếp nhận báo giá và hồ sơ năng lực của các đơn vị đối với danh mục 42 loại hóa chất xét nghiệm miễn dịch tự động thế hệ mới.\n\nThời gian nộp hồ sơ xin tuân thủ đúng quy định mở thầu và đóng thầu của bệnh viện miền núi phía Bắc Quảng Nam.",
    isTender: true,
    tenderMethod: "Mua sắm trực tiếp",
    tenderEstimateValue: "680.000.000 VNĐ",
    tenderStartDate: "08:30:00 ngày 15/07/2026",
    tenderEndDate: "17:00:00 ngày 30/07/2026",
    tenderDept: "XÉT NGHIỆM",
    tenderReceivedLocation: "Khoa Xét nghiệm - Tầng 1 Nhà C",
    tenderContact: "BS. Lê Thị Lan",
    tenderContactPhone: "02353.747.432 (máy lẻ 101)",
    tenderFile: { name: "Danh_muc_hoa_chat_xet_nghiem.pdf", size: "2.1 MB" },
    tenderDownloadCount: 18
  },
  {
    id: "tender-4",
    tenderNumber: "TB-2026-004/DƯỢC",
    title: "Thông báo mời thầu: Cung cấp thuốc biệt dược và dịch truyền y khoa đợt III",
    summary: "Khoa Dược thông báo đấu thầu rộng rãi danh mục thuốc thiết yếu và dịch truyền chất lượng cao.",
    tag: "Thông báo",
    date: "11/07/2026",
    image: "https://images.pexels.com/photos/3652103/pexels-photo-3652103.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: "Kính gửi: Các công ty dược phẩm, cơ sở phân phối dược chất lượng cao trong nước.\n\nKhoa Dược - Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam thông báo kế hoạch lựa chọn nhà thầu cung ứng thuốc biệt dược gốc, dịch truyền y khoa năm tài chính 2026.\n\nYêu cầu hồ sơ chứng minh xuất xứ nguồn gốc sản phẩm, giấy phép lưu hành hợp lệ do Bộ Y tế Việt Nam cấp phép còn hiệu lực.",
    isTender: true,
    tenderMethod: "Đấu thầu rộng rãi",
    tenderEstimateValue: "1.250.000.000 VNĐ",
    tenderStartDate: "09:00:00 ngày 12/07/2026",
    tenderEndDate: "15:00:00 ngày 26/07/2026",
    tenderDept: "DƯỢC",
    tenderReceivedLocation: "Khoa Dược - Tầng 1 Nhà A",
    tenderContact: "DS. Phạm Văn Hùng",
    tenderContactPhone: "02353.747.432 (máy lẻ 102)",
    tenderFile: { name: "HSMT_Thuoc_DichTruyen_Dot3.pdf", size: "4.5 MB" },
    tenderDownloadCount: 31
  }
];

export const DEPARTMENTS = [
  "PHÒNG CNTT",
  "PHÒNG VTTBYT",
  "XÉT NGHIỆM",
  "DƯỢC",
  "PHÒNG HCQT",
  "PHÒNG KẾ TOÁN HÀNH CHÍNH"
];
