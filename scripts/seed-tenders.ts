import { PrismaClient } from "../server/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env["DATABASE_URL"] || "postgresql://postgres:devpass@localhost:5432/bvdh_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TENDER_DATA: Array<{
  title: string;
  tenderNumber: string;
  deptId: string;
  estimate: string;
  method: string;
  receivedLocation: string;
  contactName: string;
  contactPhone: string;
  summary: string;
  endDate: Date;
  startDate: Date;
}> = [
  {
    title: "Mua sắm thiết bị mạng và máy chủ năm 2026",
    tenderNumber: "CNTT-2026-001",
    deptId: "PHÒNG CNTT",
    estimate: "850.000.000 VNĐ",
    method: "Đấu thầu rộng rãi",
    receivedLocation: "Phòng CNTT - Tầng 3, Khu Hành Chính",
    contactName: "KS. Nguyễn Văn A",
    contactPhone: "0912.345.678",
    summary: "Mua sắm hệ thống máy chủ, thiết bị mạng và phần mềm quản lý bệnh viện phục vụ chuyển đổi số.",
    endDate: new Date("2026-09-15T17:00:00"),
    startDate: new Date("2026-08-01"),
  },
  {
    title: "Dịch vụ bảo trì hạ tầng CNTT năm 2026-2027",
    tenderNumber: "CNTT-2026-002",
    deptId: "PHÒNG CNTT",
    estimate: "320.000.000 VNĐ",
    method: "Chỉ định thầu",
    receivedLocation: "Phòng CNTT - Tầng 3, Khu Hành Chính",
    contactName: "KS. Trần Thị B",
    contactPhone: "0987.654.321",
    summary: "Bảo trì hệ thống mạng, máy chủ và thiết bị văn phòng định kỳ 12 tháng.",
    endDate: new Date("2026-08-30T17:00:00"),
    startDate: new Date("2026-08-15"),
  },
  {
    title: "Mua sắm thiết bị y tế khoa Ngoại",
    tenderNumber: "VTTBYT-2026-001",
    deptId: "PHÒNG VTTBYT",
    estimate: "1.200.000.000 VNĐ",
    method: "Đấu thầu rộng rãi",
    receivedLocation: "Phòng VTTBYT - Tầng 1, Khu Khám Bệnh",
    contactName: "CN. Lê Văn C",
    contactPhone: "0905.123.456",
    summary: "Mua sắm bàn mổ điện, đèn mổ và thiết bị phẫu thuật nội soi cho khoa Ngoại.",
    endDate: new Date("2026-09-30T17:00:00"),
    startDate: new Date("2026-09-01"),
  },
  {
    title: "Mua sắm vật tư tiêu hao y tế quý IV/2026",
    tenderNumber: "VTTBYT-2026-002",
    deptId: "PHÒNG VTTBYT",
    estimate: "560.000.000 VNĐ",
    method: "Mua sắm trực tiếp",
    receivedLocation: "Kho VTTBYT - Tầng trệt",
    contactName: "CN. Phạm Thị D",
    contactPhone: "0918.765.432",
    summary: "Cung cấp vật tư tiêu hao y tế các loại phục vụ công tác điều trị hàng ngày.",
    endDate: new Date("2026-08-20T17:00:00"),
    startDate: new Date("2026-08-01"),
  },
  {
    title: "Mua sắm hóa chất xét nghiệm đợt 3/2026",
    tenderNumber: "XN-2026-001",
    deptId: "XÉT NGHIỆM",
    estimate: "780.000.000 VNĐ",
    method: "Đấu thầu rộng rãi",
    receivedLocation: "Khoa Xét Nghiệm - Tầng 2",
    contactName: "BS. Hoàng Văn E",
    contactPhone: "0933.456.789",
    summary: "Cung cấp hóa chất, sinh phẩm xét nghiệm huyết học, sinh hóa, vi sinh.",
    endDate: new Date("2026-09-20T17:00:00"),
    startDate: new Date("2026-09-01"),
  },
  {
    title: "Bảo trì máy xét nghiệm tự động",
    tenderNumber: "XN-2026-002",
    deptId: "XÉT NGHIỆM",
    estimate: "280.000.000 VNĐ",
    method: "Chỉ định thầu",
    receivedLocation: "Khoa Xét Nghiệm - Tầng 2",
    contactName: "CN. Ngô Thị F",
    contactPhone: "0977.123.789",
    summary: "Bảo trì, hiệu chuẩn máy xét nghiệm sinh hóa, huyết học tự động định kỳ.",
    endDate: new Date("2026-08-25T17:00:00"),
    startDate: new Date("2026-08-10"),
  },
  {
    title: "Đấu thầu thuốc Generic năm 2026-2027",
    tenderNumber: "DUOC-2026-001",
    deptId: "DƯỢC",
    estimate: "2.500.000.000 VNĐ",
    method: "Đấu thầu rộng rãi",
    receivedLocation: "Khoa Dược - Nhà D",
    contactName: "DS. Trương Văn G",
    contactPhone: "0909.888.777",
    summary: "Đấu thầu thuốc generic các nhóm: tim mạch, tiêu hóa, hô hấp, thần kinh.",
    endDate: new Date("2026-10-15T17:00:00"),
    startDate: new Date("2026-10-01"),
  },
  {
    title: "Mua sắm thuốc đặc trị cho điều trị nội trú",
    tenderNumber: "DUOC-2026-002",
    deptId: "DƯỢC",
    estimate: "1.800.000.000 VNĐ",
    method: "Đấu thầu rộng rãi",
    receivedLocation: "Khoa Dược - Nhà D",
    contactName: "DS. Lê Thị H",
    contactPhone: "0911.222.333",
    summary: "Cung cấp thuốc đặc trị phục vụ điều trị nội trú tại các khoa lâm sàng.",
    endDate: new Date("2026-09-10T17:00:00"),
    startDate: new Date("2026-08-20"),
  },
  {
    title: "Mua sắm văn phòng phẩm và thiết bị văn phòng",
    tenderNumber: "HCQT-2026-001",
    deptId: "PHÒNG HCQT",
    estimate: "180.000.000 VNĐ",
    method: "Mua sắm trực tiếp",
    receivedLocation: "Phòng HCQT - Tầng 1 Khu Hành Chính",
    contactName: "CN. Đặng Văn I",
    contactPhone: "0922.334.455",
    summary: "Cung cấp văn phòng phẩm, giấy in, mực in và thiết bị văn phòng năm 2026.",
    endDate: new Date("2026-08-15T17:00:00"),
    startDate: new Date("2026-08-01"),
  },
  {
    title: "Dịch vụ vệ sinh bệnh viện năm 2026-2027",
    tenderNumber: "HCQT-2026-002",
    deptId: "PHÒNG HCQT",
    estimate: "450.000.000 VNĐ",
    method: "Đấu thầu rộng rãi",
    receivedLocation: "Phòng HCQT - Tầng 1 Khu Hành Chính",
    contactName: "CN. Vũ Thị K",
    contactPhone: "0933.556.677",
    summary: "Dịch vụ vệ sinh công nghiệp, thu gom rác thải y tế và bảo dưỡng cảnh quan.",
    endDate: new Date("2026-09-05T17:00:00"),
    startDate: new Date("2026-08-15"),
  },
  {
    title: "Kiểm toán tài chính năm tài khóa 2026",
    tenderNumber: "KT-2026-001",
    deptId: "PHÒNG KẾ TOÁN HÀNH CHÍNH",
    estimate: "150.000.000 VNĐ",
    method: "Chỉ định thầu",
    receivedLocation: "Phòng Kế Toán - Tầng 2 Khu Hành Chính",
    contactName: "CN. Mai Văn L",
    contactPhone: "0944.667.788",
    summary: "Dịch vụ kiểm toán độc lập báo cáo tài chính năm 2026 của bệnh viện.",
    endDate: new Date("2026-12-30T17:00:00"),
    startDate: new Date("2026-12-01"),
  },
  {
    title: "Mua sắm máy điều hòa trung tâm khu khám bệnh",
    tenderNumber: "KT-2026-002",
    deptId: "PHÒNG KẾ TOÁN HÀNH CHÍNH",
    estimate: "920.000.000 VNĐ",
    method: "Đấu thầu rộng rãi",
    receivedLocation: "Phòng Kế Toán - Tầng 2 Khu Hành Chính",
    contactName: "CN. Lý Thị M",
    contactPhone: "0955.778.899",
    summary: "Lắp đặt hệ thống điều hòa trung tâm cho khu khám bệnh mới.",
    endDate: new Date("2026-10-30T17:00:00"),
    startDate: new Date("2026-10-01"),
  },
];

async function main() {
  for (const t of TENDER_DATA) {
    const slug = t.title.toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    await prisma.news.create({
      data: {
        title: t.title,
        slug: `${slug}-${Date.now()}`,
        summary: t.summary,
        category: "Thông báo",
        content: `<p>${t.summary}</p><p>Bệnh viện Đa khoa Khu vực Miền Núi Phía Bắc Quảng Nam trân trọng thông báo mời thầu gói: <strong>${t.title}</strong>.</p><p>Số hiệu thầu: ${t.tenderNumber}</p><p>Phương thức: ${t.method}</p><p>Giá trị dự toán: ${t.estimate}</p><p>Địa điểm nộp hồ sơ: ${t.receivedLocation}</p>`,
        author: "Phòng HCQT",
        isFeatured: false,
        isTender: true,
        tenderNumber: t.tenderNumber,
        tenderStartDate: t.startDate,
        tenderEndDate: t.endDate,
        tenderMethod: t.method,
        tenderEstimate: t.estimate,
        tenderReceived: t.receivedLocation,
        tenderDept: t.deptId,
        contactName: t.contactName,
        contactPhone: t.contactPhone,
        downloadCount: 0,
        isActive: true,
        publishedAt: new Date(),
      },
    });
    console.log(`Created tender: ${t.tenderNumber} - ${t.title}`);
  }
  console.log(`\nDone! Created ${TENDER_DATA.length} tender notices.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
