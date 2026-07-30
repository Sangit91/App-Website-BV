import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });

interface SeedItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: Date;
  image: string;
  content: string;
  isTender: boolean;
  isFeatured: boolean;
  tenderNumber: string | null;
  tenderMethod: string | null;
  tenderEstimate: string | null;
  tenderStartDate: Date | null;
  tenderEndDate: Date | null;
  tenderDept: string | null;
  tenderReceived: string | null;
  contactName: string | null;
  contactPhone: string | null;
  downloadCount: number;
}

function parseDate(s: string): Date {
  const [d, m, y] = s.split("/").map((x) => parseInt(x, 10));
  return new Date(y, m - 1, d);
}

function parseTenderStart(s: string): Date | null {
  const m = s.match(/(\d{2}):(\d{2}):\d{2}\s+ngày\s+(\d{2})/);
  if (!m) return null;
  const [, , , d] = m;
  return new Date(2026, 6, parseInt(d, 10));
}

function parseTenderEnd(s: string): Date | null {
  const m = s.match(/(\d{2}):(\d{2}):\d{2}\s+ngày\s+(\d{2})/);
  if (!m) return null;
  const [, , , d] = m;
  return new Date(2026, 6, parseInt(d, 10));
}

const items: SeedItem[] = [
  {
    id: "news-1",
    title: "BVĐK KV Miền Núi Phía Bắc Quảng Nam triển khai kỹ thuật phẫu thuật nội soi khớp gối tiên tiến",
    summary: "Người dân khu vực miền núi Quảng Nam nay đã có thể tiếp cận kỹ thuật phẫu thuật hiện đại ngay tại địa phương, giảm thiểu chi phí đi lại và hồi phục nhanh chóng.",
    category: "Tin y học",
    publishedAt: parseDate("12/07/2026"),
    image: "/images/news/news-1.jpg",
    content: "Căn cứ theo quyết định phê duyệt danh mục chuyên môn của Sở Y tế tỉnh Quảng Nam, Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam chính thức đưa vào vận hành hệ thống trang thiết bị hỗ trợ phẫu thuật nội soi khớp gối tiên tiến thế hệ mới.\n\nĐây là bước tiến vượt bậc trong công tác nâng cao năng lực lâm sàng tại chỗ cho đội ngũ y bác sĩ ngoại chấn thương chỉnh hình của bệnh viện. Nhờ đó, người dân khu vực huyện Đại Lộc, Nam Giang, Đông Giang, Tây Giang khi gặp các chấn thương thể thao, thoái hóa khớp gối phức tạp sẽ được phẫu thuật trực tiếp tại viện bởi các chuyên gia giàu kinh nghiệm mà không cần phải chuyển tuyến lên tuyến tỉnh hay trung ương như trước đây.\n\nViệc làm chủ kỹ thuật cao này không chỉ giúp giảm tải đáng kể cho các bệnh viện tuyến trên mà quan trọng hơn là giảm thiểu gánh nặng tài chính, chi phí đi lại và sinh hoạt cho người bệnh cùng gia đình trong quá trình điều trị nội trú lâu dài.",
    isTender: false,
    isFeatured: true,
    tenderNumber: null,
    tenderMethod: null,
    tenderEstimate: null,
    tenderStartDate: null,
    tenderEndDate: null,
    tenderDept: null,
    tenderReceived: null,
    contactName: null,
    contactPhone: null,
    downloadCount: 0,
  },
  {
    id: "news-2",
    title: "Thông báo về lịch khám bệnh miễn phí và cấp phát thuốc cho đồng bào vùng cao khó khăn",
    summary: "Chương trình thiện nguyện 'Áo ấm Blouse trắng' sẽ diễn ra vào cuối tuần này tại các xã vùng sâu vùng xa huyện Đại Lộc nhằm hỗ trợ y tế cộng đồng.",
    category: "Thông báo",
    publishedAt: parseDate("10/07/2026"),
    image: "/images/news/news-2.jpg",
    content: "Kính gửi: Toàn thể nhân dân trên địa bàn huyện Đại Lộc và các khu vực lân cận.\n\nThực hiện sứ mệnh chăm sóc sức khỏe cộng đồng toàn diện, đặc biệt là đồng bào các dân tộc vùng cao và các hộ gia đình có hoàn cảnh đặc biệt khó khăn, Ban Giám đốc Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam kết hợp cùng Đoàn thanh niên Cộng sản Hồ Chí Minh tổ chức chương trình khám bệnh, tư vấn sức khỏe miễn phí và cấp phát thuốc thường kỳ 'Áo ấm Blouse trắng'.\n\nChương trình sẽ chính thức diễn ra vào ngày thứ Bảy tuần này tại Trạm y tế xã vùng sâu. Các nội dung thăm khám bao gồm: Khám nội tổng quát, sàng lọc tim mạch và huyết áp, khám nhi khoa, tư vấn chăm sóc răng miệng, siêu âm tổng quát và cấp phát miễn phí các loại thuốc bổ, thuốc điều trị bệnh lý thông thường.",
    isTender: false,
    isFeatured: false,
    tenderNumber: null,
    tenderMethod: null,
    tenderEstimate: null,
    tenderStartDate: null,
    tenderEndDate: null,
    tenderDept: null,
    tenderReceived: null,
    contactName: null,
    contactPhone: null,
    downloadCount: 0,
  },
  {
    id: "news-3",
    title: "Bệnh viện đón tiếp đoàn chuyên gia quốc tế chuyển giao công nghệ siêu âm tim 4D mới",
    summary: "Đợt chuyển giao trang thiết bị y khoa hiện đại hỗ trợ nâng cao chất lượng chẩn đoán hình ảnh tim mạch cho bệnh nhi và sản phụ vùng núi Quảng Nam.",
    category: "Sự kiện",
    publishedAt: parseDate("05/07/2026"),
    image: "/images/news/news-3.jpg",
    content: "Trong khuôn khổ chương trình hợp tác quốc tế và chuyển giao kỹ thuật y khoa chất lượng cao, Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam đã tổ chức lễ tiếp nhận và chuyển giao trang thiết bị máy siêu âm tim mạch 4D cao cấp từ đoàn chuyên gia y tế nước ngoài.\n\nHệ thống máy siêu âm thế hệ mới này tích hợp các thuật toán dựng hình thời gian thực tiên tiến, giúp tăng cường độ chính xác tối đa trong chẩn đoán các bệnh lý dị tật tim bẩm sinh ở thai nhi và trẻ sơ sinh, đồng thời đánh giá huyết động học toàn diện cho bệnh nhân tim mạch người lớn.\n\nBên cạnh việc bàn giao máy, đoàn chuyên gia cũng thực hiện khóa đào tạo tập huấn lâm sàng kéo dài một tuần nhằm hướng dẫn thực hành siêu âm thực tế trên bệnh nhân tại khoa Thăm dò chức năng và chẩn đoán hình ảnh của bệnh viện.",
    isTender: false,
    isFeatured: false,
    tenderNumber: null,
    tenderMethod: null,
    tenderEstimate: null,
    tenderStartDate: null,
    tenderEndDate: null,
    tenderDept: null,
    tenderReceived: null,
    contactName: null,
    contactPhone: null,
    downloadCount: 0,
  },
  {
    id: "tender-1",
    title: "Yêu cầu báo giá: Nâng cấp hệ thống Switch trung tâm và tủ Rack bảo mật thông tin",
    summary: "Phòng CNTT thông báo mời thầu và nhận báo giá gói thầu nâng cấp hệ thống mạng switch trung tâm cho toàn viện.",
    category: "Thông báo",
    publishedAt: parseDate("14/07/2026"),
    image: "/images/news/tender-1.jpg",
    content: "Kính gửi: Các đơn vị cung ứng giải pháp và hạ tầng mạng viễn thông.\n\nPhòng Công nghệ thông tin - Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam xin thông báo mời báo giá cho gói thầu mua sắm, lắp đặt và cấu hình hệ thống Switch trung tâm (Core Switch) phục vụ mở rộng mạng LAN nội bộ.\n\nYêu cầu kỹ thuật: Thiết bị chính hãng mới 100%, bảo hành tối thiểu 24 tháng, hỗ trợ kết nối quang đa sợi tốc độ 10Gbps.\n\nMọi chi tiết xin vui lòng xem tài liệu kỹ thuật đính kèm bên dưới.",
    isTender: true,
    isFeatured: false,
    tenderNumber: "TB-2026-001/CNTT",
    tenderMethod: "Mua sắm trực tiếp",
    tenderEstimate: "350.000.000 VNĐ",
    tenderStartDate: parseTenderStart("09:00:00 ngày 15/07/2026"),
    tenderEndDate: parseTenderEnd("17:00:00 ngày 25/07/2026"),
    tenderDept: "PHÒNG CNTT",
    tenderReceived: "Phòng Công nghệ thông tin - Tầng 3 Nhà A",
    contactName: "Nguyễn Văn Minh",
    contactPhone: "02353.747.432 x301",
    downloadCount: 24,
  },
  {
    id: "tender-2",
    title: "Mời thầu mua sắm: Hệ thống phẫu thuật nội soi khớp và dao mổ siêu âm thế hệ mới",
    summary: "Phòng Vật tư Thiết bị Y tế thông báo mời thầu gói cung cấp trang thiết bị phẫu thuật nội soi hiện đại năm 2026.",
    category: "Thông báo",
    publishedAt: parseDate("13/07/2026"),
    image: "/images/news/tender-2.jpg",
    content: "Kính gửi: Các nhà thầu cung cấp trang thiết bị y tế đủ năng lực hành nghề pháp lý.\n\nPhòng Vật tư Thiết bị Y tế thông báo mời thầu rộng rãi gói thầu mua sắm 'Hệ thống phẫu thuật nội soi khớp gối và dao mổ siêu âm hỗ trợ điều trị ngoại khoa'.\n\nNguồn vốn: Ngân sách nhà nước và quỹ phát triển hoạt động sự nghiệp của bệnh viện.\n\nHồ sơ dự thầu cần nộp trực tiếp tại phòng Vật tư trước thời điểm khóa thầu quy định.",
    isTender: true,
    isFeatured: false,
    tenderNumber: "TB-2026-002/VTTBYT",
    tenderMethod: "Đấu thầu rộng rãi",
    tenderEstimate: "2.850.000.000 VNĐ",
    tenderStartDate: parseTenderStart("08:00:00 ngày 14/07/2026"),
    tenderEndDate: parseTenderEnd("11:30:00 ngày 28/07/2026"),
    tenderDept: "PHÒNG VTTBYT",
    tenderReceived: "Phòng Vật tư Thiết bị Y tế - Tầng 2 Nhà B",
    contactName: "Trần Thị Hương",
    contactPhone: "02353.747.432 x201",
    downloadCount: 42,
  },
  {
    id: "tender-3",
    title: "Mời thầu: Cung ứng hóa chất xét nghiệm miễn dịch tự động và sinh phẩm chẩn đoán",
    summary: "Khoa Xét nghiệm kính mời báo giá cung cấp hóa chất và sinh phẩm xét nghiệm phục vụ điều trị lâm sàng.",
    category: "Thông báo",
    publishedAt: parseDate("12/07/2026"),
    image: "/images/news/tender-3.jpg",
    content: "Kính gửi: Các doanh nghiệp cung cấp hóa chất, vật tư xét nghiệm lâm sàng.\n\nKhoa Xét nghiệm tổ chức tiếp nhận báo giá và hồ sơ năng lực của các đơn vị đối với danh mục 42 loại hóa chất xét nghiệm miễn dịch tự động thế hệ mới.\n\nThời gian nộp hồ sơ xin tuân thủ đúng quy định mở thầu và đóng thầu của bệnh viện miền núi phía Bắc Quảng Nam.",
    isTender: true,
    isFeatured: false,
    tenderNumber: "TB-2026-003/XN",
    tenderMethod: "Mua sắm trực tiếp",
    tenderEstimate: "680.000.000 VNĐ",
    tenderStartDate: parseTenderStart("08:30:00 ngày 15/07/2026"),
    tenderEndDate: parseTenderEnd("17:00:00 ngày 30/07/2026"),
    tenderDept: "XÉT NGHIỆM",
    tenderReceived: "Khoa Xét nghiệm - Tầng 1 Nhà C",
    contactName: "BS. Lê Thị Lan",
    contactPhone: "02353.747.432 x101",
    downloadCount: 18,
  },
  {
    id: "tender-4",
    title: "Thông báo mời thầu: Cung cấp thuốc biệt dược và dịch truyền y khoa đợt III",
    summary: "Khoa Dược thông báo đấu thầu rộng rãi danh mục thuốc thiết yếu và dịch truyền chất lượng cao.",
    category: "Thông báo",
    publishedAt: parseDate("11/07/2026"),
    image: "/images/news/tender-4.jpg",
    content: "Kính gửi: Các công ty dược phẩm, cơ sở phân phối dược chất lượng cao trong nước.\n\nKhoa Dược - Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam thông báo kế hoạch lựa chọn nhà thầu cung ứng thuốc biệt dược gốc, dịch truyền y khoa năm tài chính 2026.\n\nYêu cầu hồ sơ chứng minh xuất xứ nguồn gốc sản phẩm, giấy phép lưu hành hợp lệ do Bộ Y tế Việt Nam cấp phép còn hiệu lực.",
    isTender: true,
    isFeatured: false,
    tenderNumber: "TB-2026-004/DƯỢC",
    tenderMethod: "Đấu thầu rộng rãi",
    tenderEstimate: "1.250.000.000 VNĐ",
    tenderStartDate: parseTenderStart("09:00:00 ngày 12/07/2026"),
    tenderEndDate: parseTenderEnd("15:00:00 ngày 26/07/2026"),
    tenderDept: "DƯỢC",
    tenderReceived: "Khoa Dược - Tầng 1 Nhà A",
    contactName: "DS. Phạm Văn Hùng",
    contactPhone: "02353.747.432 x102",
    downloadCount: 31,
  },
];

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main(): Promise<void> {
  let inserted = 0;
  let updated = 0;

  for (const it of items) {
    const slug = slugify(it.title).slice(0, 80) || `seed-${it.id}`;
    const res = await pool.query(
      `INSERT INTO news (
        id, title, slug, summary, category, content, image,
        is_featured, is_tender, tender_number, tender_method, tender_estimate,
        tender_start_date, tender_end_date, tender_received_location,
        contact_name, contact_phone, download_count, is_active, published_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15,
        $16, $17, $18, true, $19, NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        category = EXCLUDED.category,
        content = EXCLUDED.content,
        image = EXCLUDED.image,
        is_featured = EXCLUDED.is_featured,
        is_tender = EXCLUDED.is_tender,
        tender_number = EXCLUDED.tender_number,
        tender_method = EXCLUDED.tender_method,
        tender_estimate = EXCLUDED.tender_estimate,
        tender_start_date = EXCLUDED.tender_start_date,
        tender_end_date = EXCLUDED.tender_end_date,
        tender_received_location = EXCLUDED.tender_received_location,
        contact_name = EXCLUDED.contact_name,
        contact_phone = EXCLUDED.contact_phone,
        download_count = EXCLUDED.download_count,
        is_active = true,
        published_at = EXCLUDED.published_at,
        updated_at = NOW()
      RETURNING (xmax = 0) AS inserted`,
      [
        it.id, it.title, slug, it.summary, it.category, it.content, it.image,
        it.isFeatured, it.isTender, it.tenderNumber, it.tenderMethod, it.tenderEstimate,
        it.tenderStartDate, it.tenderEndDate, it.tenderReceived,
        it.contactName, it.contactPhone, it.downloadCount, it.publishedAt,
      ]
    );
    if (res.rows[0].inserted) inserted++; else updated++;
  }

  console.log(`Seed news done: ${inserted} inserted, ${updated} updated (total ${items.length} items).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
