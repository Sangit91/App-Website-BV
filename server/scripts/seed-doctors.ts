import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });

interface SeedSpecialty {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  detail: string;
  sortOrder: number;
}

interface SeedDoctor {
  id: string;
  fullName: string;
  title: string;
  specialtyId: string;
  phone: string;
  image: string;
  bio: string;
}

interface SeedSchedule {
  doctorId: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

const specialties: SeedSpecialty[] = [
  { id: "spec-tim-mach", name: "Khoa Tim Mạch", slug: "khoa-tim-mach", description: "Khám và điều trị các bệnh lý tim mạch, huyết áp, mạch vành.", icon: "Heart", detail: "Khoa Tim Mạch chuyên khám, chẩn đoán và điều trị các bệnh lý tim mạch: huyết áp, rối loạn nhịp tim, suy tim, bệnh mạch vành, 외c khoa tim mạch can thiệp.", sortOrder: 1 },
  { id: "spec-san-phu-khoa", name: "Khoa Sản Phụ Khoa", slug: "khoa-san-phu-khoa", description: "Chăm sóc sức khỏe sinh sản, thai sản, phụ khoa.", icon: "Baby", detail: "Khoa Sản Phụ Khoa chăm sóc thai kỳ, sinh sản, khám phụ khoa, kế hoạch hóa gia đình, tầm soát ung thư cổ tử cung.", sortOrder: 2 },
  { id: "spec-nhi", name: "Khoa Nhi", slug: "khoa-nhi", description: "Khám và điều trị các bệnh lý trẻ em.", icon: "Baby", detail: "Khoa Nhi khám, chẩn đoán và điều trị các bệnh lý trẻ em: hô hấp, tiêu hóa, dinh dưỡng, tiêm chủng, sơ sinh.", sortOrder: 3 },
  { id: "spec-hoi-suc", name: "Khoa Hồi Sức Cấp Cứu", slug: "khoa-hoi-suc-cap-cuu", description: "Cấp cứu, hồi sức tích cực ICU 24/7.", icon: "Shield", detail: "Khoa Hồi Sức Cấp Cứu nhận cấp cứu 24/7, hồi sức tích cực ICU, thở máy, theo dõi bệnh nhân nguy kịch.", sortOrder: 4 },
  { id: "spec-ngoai-tong-hop", name: "Khoa Ngoại Tổng Hợp", slug: "khoa-ngoai-tong-hop", description: "Phẫu thuật tổng quát, chấn thương chỉnh hình.", icon: "Scissors", detail: "Khoa Ngoại Tổng Hợp phẫu thuật tổng quát, chấn thương chỉnh hình, nội soi, phẫu thuật khớp gối, trĩ.", sortOrder: 5 },
  { id: "spec-tai-mui-hong", name: "Khoa Tai Mũi Họng", slug: "khoa-tai-mui-hong", description: "Khám và phẫu thuật tai, mũi, họng.", icon: "AirVent", detail: "Khoa Tai Mũi Họng khám, chẩn đoán và phẫu thuật các bệnh lý tai, mũi, họng: viêm mũi dị ứng, viêm xoang, viêm tai giữa.", sortOrder: 6 },
];

const doctors: SeedDoctor[] = [
  { id: "doc-1", fullName: "BS. CKII. Nguyễn Thống Nhất", title: "BS. CKII", specialtyId: "spec-tim-mach", phone: "02353.747.432 x501", image: "/images/doctors/1.jpg", bio: "Giám đốc bệnh viện. 25 năm kinh nghiệm chuyên môn tim mạch can thiệp. Tốt nghiệp ĐH Y Dược TP.HCM, chuyên môn cao về điều trị suy tim và rối loạn nhịp." },
  { id: "doc-2", fullName: "BSCK II. Lê Minh Dũng", title: "BSCK II", specialtyId: "spec-ngoai-tong-hop", phone: "02353.747.432 x502", image: "/images/doctors/2.jpg", bio: "Phó Giám đốc. 20 năm kinh nghiệm phẫu thuật ngoại tổng hợp và chấn thương chỉnh hình. Chuyên gia phẫu thuật nội soi khớp gối tiên tiến." },
  { id: "doc-3", fullName: "BS. CKII. Nguyễn Đình Hoàng", title: "BS. CKII", specialtyId: "spec-hoi-suc", phone: "02353.747.432 x503", image: "/images/doctors/3.jpg", bio: "Phó Giám đốc. 18 năm kinh nghiệm hồi sức cấp cứu, ICU. Chuyên gia về thở máy và theo dõi bệnh nhân nguy kịch." },
  { id: "doc-4", fullName: "BS. CKI. Trần Văn Thanh", title: "BS. CKI", specialtyId: "spec-ngoai-tong-hop", phone: "02353.747.432 x504", image: "/images/doctors/dr-tran-van-thanh.jpg", bio: "Trưởng khoa Ngoại Tổng Hợp. 15 năm kinh nghiệm phẫu thuật nội soi, chấn thương chỉnh hình. Chuyên gia phẫu thuật khớp gối." },
  { id: "doc-5", fullName: "BS. Lê Thị Hồng Nga", title: "BS.", specialtyId: "spec-san-phu-khoa", phone: "02353.747.432 x505", image: "/images/doctors/dr-le-thi-hong-nga.jpg", bio: "Trưởng khoa Sản Phụ Khoa. 12 năm kinh nghiệm chăm sóc thai kỳ, sinh sản, phẫu thuật phụ khoa. Tầm soát ung thư cổ tử cung." },
  { id: "doc-6", fullName: "BS. Lý Thị Thu Hà", title: "BS.", specialtyId: "spec-nhi", phone: "02353.747.432 x506", image: "/images/doctors/dr-ly-thi-thu-ha.jpg", bio: "Trưởng khoa Nhi. 10 năm kinh nghiệm khám và điều trị bệnh lý trẻ em: hô hấp, tiêu hóa, dinh dưỡng, tiêm chủng." },
  { id: "doc-7", fullName: "BS. Phạm Thị Lan", title: "BS.", specialtyId: "spec-tai-mui-hong", phone: "02353.747.432 x507", image: "/images/doctors/dr-pham-thi-lan.jpg", bio: "Trưởng khoa Tai Mũi Họng. 11 năm kinh nghiệm khám và phẫu thuật tai, mũi, họng. Chuyên gia viêm xoang và viêm tai giữa." },
  { id: "doc-8", fullName: "BS. Nguyễn Văn Hùng", title: "BS.", specialtyId: "spec-tim-mach", phone: "02353.747.432 x508", image: "/images/doctors/dr-nguyen-van-hung.jpg", bio: "Bác sĩ điều trị khoa Tim Mạch. 8 năm kinh nghiệm khám và điều trị huyết áp, rối loạn nhịp tim, bệnh mạch vành." },
  { id: "doc-9", fullName: "ThS. BS. Nguyễn Thị Phương Mai", title: "ThS. BS", specialtyId: "spec-san-phu-khoa", phone: "02353.747.432 x509", image: "/images/doctors/5.jpg", bio: "Bác sĩ sản phụ khoa. 9 năm kinh nghiệm chăm sóc sản khoa, kế hoạch hóa gia đình, tư vấn thai kỳ nguy cơ cao." },
  { id: "doc-10", fullName: "BS. CKI. Phan Thanh Hải", title: "BS. CKI", specialtyId: "spec-ngoai-tong-hop", phone: "02353.747.432 x510", image: "/images/doctors/6.jpg", bio: "Bác sĩ khoa Ngoại Tổng Hợp. 13 năm kinh nghiệm phẫu thuật chấn thương chỉnh hình, nội soi tiêu hóa, phẫu thuật trĩ." },
];

const schedules: SeedSchedule[] = [
  { doctorId: "doc-1", monday: "ca_sang", tuesday: "ca_sang", wednesday: "ca_sang", thursday: "ca_sang", friday: "ca_sang", saturday: "nghi", sunday: "nghi" },
  { doctorId: "doc-2", monday: "ca_chieu", tuesday: "ca_chieu", wednesday: "ca_chieu", thursday: "ca_chieu", friday: "nghi", saturday: "nghi", sunday: "nghi" },
  { doctorId: "doc-3", monday: "nghi", tuesday: "ca_sang", wednesday: "ca_sang", thursday: "ca_sang", friday: "ca_sang", saturday: "ca_chieu", sunday: "nghi" },
  { doctorId: "doc-4", monday: "ca_sang", tuesday: "ca_sang", wednesday: "ca_sang", thursday: "ca_sang", friday: "ca_sang", saturday: "nghi", sunday: "nghi" },
  { doctorId: "doc-5", monday: "ca_chieu", tuesday: "ca_chieu", wednesday: "ca_chieu", thursday: "nghi", friday: "ca_chieu", saturday: "ca_chieu", sunday: "nghi" },
  { doctorId: "doc-6", monday: "ca_sang", tuesday: "ca_sang", wednesday: "ca_chieu", thursday: "ca_sang", friday: "ca_sang", saturday: "ca_sang", sunday: "nghi" },
  { doctorId: "doc-7", monday: "nghi", tuesday: "ca_sang", wednesday: "ca_sang", thursday: "ca_sang", friday: "ca_sang", saturday: "nghi", sunday: "nghi" },
  { doctorId: "doc-8", monday: "ca_chieu", tuesday: "ca_chieu", wednesday: "ca_chieu", thursday: "ca_chieu", friday: "ca_chieu", saturday: "nghi", sunday: "nghi" },
  { doctorId: "doc-9", monday: "ca_sang", tuesday: "ca_chieu", wednesday: "ca_sang", thursday: "ca_chieu", friday: "ca_sang", saturday: "nghi", sunday: "nghi" },
  { doctorId: "doc-10", monday: "ca_sang", tuesday: "ca_sang", wednesday: "nghi", thursday: "ca_sang", friday: "ca_sang", saturday: "ca_chieu", sunday: "nghi" },
];

async function main(): Promise<void> {
  let specInserted = 0, specUpdated = 0;
  let docInserted = 0, docUpdated = 0;
  let schedInserted = 0, schedUpdated = 0;

  for (const s of specialties) {
    const res = await pool.query(
      `INSERT INTO specialties (id, name, slug, description, icon, detail, sort_order, is_active, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon,
         detail = EXCLUDED.detail, sort_order = EXCLUDED.sort_order, is_active = true, updated_at = NOW()
       RETURNING (xmax = 0) AS inserted`,
      [s.id, s.name, s.slug, s.description, s.icon, s.detail, s.sortOrder]
    );
    if (res.rows[0].inserted) specInserted++; else specUpdated++;
  }
  console.log(`Specialties: ${specInserted} inserted, ${specUpdated} updated.`);

  for (const d of doctors) {
    const res = await pool.query(
      `INSERT INTO doctors (id, full_name, title, specialty_id, phone, image, bio, is_active, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
       ON CONFLICT (id) DO UPDATE SET
         full_name = EXCLUDED.full_name, title = EXCLUDED.title, specialty_id = EXCLUDED.specialty_id,
         phone = EXCLUDED.phone, image = EXCLUDED.image, bio = EXCLUDED.bio, is_active = true, updated_at = NOW()
       RETURNING (xmax = 0) AS inserted`,
      [d.id, d.fullName, d.title, d.specialtyId, d.phone, d.image, d.bio]
    );
    if (res.rows[0].inserted) docInserted++; else docUpdated++;
  }
  console.log(`Doctors: ${docInserted} inserted, ${docUpdated} updated.`);

  for (const s of schedules) {
    const existing = await pool.query(`SELECT id FROM doctor_schedules WHERE doctor_id = $1`, [s.doctorId]);
    if (existing.rowCount && existing.rowCount > 0) {
      await pool.query(
        `UPDATE doctor_schedules SET
           monday = $2, tuesday = $3, wednesday = $4, thursday = $5,
           friday = $6, saturday = $7, sunday = $8, updated_at = NOW()
         WHERE doctor_id = $1`,
        [s.doctorId, s.monday, s.tuesday, s.wednesday, s.thursday, s.friday, s.saturday, s.sunday]
      );
      schedUpdated++;
    } else {
      await pool.query(
        `INSERT INTO doctor_schedules (id, doctor_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [crypto.randomUUID(), s.doctorId, s.monday, s.tuesday, s.wednesday, s.thursday, s.friday, s.saturday, s.sunday]
      );
      schedInserted++;
    }
  }
  console.log(`Schedules: ${schedInserted} inserted, ${schedUpdated} updated.`);

  console.log(`Seed doctors done: ${specialties.length} specialties, ${doctors.length} doctors, ${schedules.length} schedules.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
