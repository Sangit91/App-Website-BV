import "dotenv/config";
import crypto from "crypto";
import { Pool } from "pg";
import { cccdService } from "../services/cccd.service.js";
import { SPECIALTIES, DOCTORS, TESTIMONIALS, NEWS } from "../../src/data";

const connectionString = process.env["DATABASE_URL"];
if (!connectionString) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}
const pool = new Pool({ connectionString });

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${hash}:${salt}`;
}

async function seed() {
  console.log("🌱 Starting seed...\n");

  function parseVnDate(raw: string | null | undefined): string | null {
    if (!raw) return null;
    const trimmed = String(raw).trim();
    const parts = trimmed.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!parts) return null;
    return `${parts[3]}-${parts[2].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
  }

  console.log("Clearing existing data...");
  await pool.query("TRUNCATE admin_users CASCADE");
  await pool.query("TRUNCATE specialties CASCADE");
  await pool.query("TRUNCATE doctors CASCADE");
  await pool.query("TRUNCATE doctor_schedules CASCADE");
  await pool.query("TRUNCATE news CASCADE");
  await pool.query("TRUNCATE testimonials CASCADE");
  await pool.query("TRUNCATE organization_units CASCADE");
  await pool.query("TRUNCATE patients CASCADE");
  await pool.query("TRUNCATE appointments CASCADE");
  await pool.query("TRUNCATE feedback_requests CASCADE");
  await pool.query("TRUNCATE record_requests CASCADE");
  await pool.query("TRUNCATE contact_messages CASCADE");
  await pool.query("TRUNCATE activity_logs CASCADE");
  await pool.query("TRUNCATE service_groups CASCADE");
  await pool.query("TRUNCATE services CASCADE");
  await pool.query("TRUNCATE price_list CASCADE");
  await pool.query("TRUNCATE news_categories CASCADE");
  console.log("");

  // ============================================================
  // ADMIN USERS
  // ============================================================
  console.log("Creating admin_users...");
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@123";
  const adminHash = hashPassword(adminPassword);
  await pool.query(`
    INSERT INTO admin_users (id, username, password_hash, full_name, role, is_active, created_at, updated_at)
    VALUES
      ('admin-001', 'admin', $1, 'Quản trị viên', 'Super Admin', true, NOW(), NOW()),
      ('admin-002', 'reception', $1, 'Lễ Tân Hoa', 'Receptionist', true, NOW(), NOW()),
      ('admin-003', 'bacsi', $1, 'BS. Nguyễn Văn Trung', 'Doctor', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `, [adminHash]);

  // ============================================================
  // SPECIALTIES
  // ============================================================
  console.log("Creating specialties...");
  for (const s of SPECIALTIES) {
    await pool.query(`
      INSERT INTO specialties (id, name, slug, description, icon, detail, sort_order, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        detail = EXCLUDED.detail
    `, [s.id, s.name, s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), s.description, s.iconType, s.detail, 0]);
  }

  // ============================================================
  // DOCTORS + DOCTOR SCHEDULES
  // ============================================================
  console.log("Creating doctors + schedules...");
  for (const d of DOCTORS) {
    await pool.query(`
      INSERT INTO doctors (id, full_name, title, specialty_id, phone, image, experience_year, bio, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        title = EXCLUDED.title
    `, [d.id, d.name, d.title, d.specialtyId, null, d.image, parseInt(d.experience) || null, d.experience]);

    // Fixed schedule: all doctors work Mon-Fri morning shift (per actual DOCTORS data: "Thứ Hai - Thứ Sáu (07:30 - 11:30)")
    await pool.query(`
      INSERT INTO doctor_schedules (id, doctor_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, created_at, updated_at)
      VALUES (gen_random_uuid()::text, $1, 'ca_sang', 'ca_sang', 'ca_sang', 'ca_sang', 'ca_sang', 'nghi', 'nghi', NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [d.id]);
  }

  // ============================================================
  // NEWS
  // ============================================================
  console.log("Creating news...");
  for (const n of NEWS) {
const isTender = !!(n as any).isTender;
    const tenderStartDateRaw = (n as any)["tenderStartDate"];
    const tenderEndDateRaw = (n as any)["tenderEndDate"];
    const publishedAt = new Date(n.date.split("/").reverse().join("-")).toISOString();
    const rawContactPhone = (n as any)["tenderContactPhone"] || null;
    const vals = [
      n.id,
      n.title,
      n.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      n.summary,
      n.tag,
      n.content,
      n.image,
      'Ban Biên Tập',
      false,
      isTender,
      (n as any)["tenderNumber"] || null,
      tenderStartDateRaw ? parseVnDate(tenderStartDateRaw) : null,
      tenderEndDateRaw ? parseVnDate(tenderEndDateRaw) : null,
      (n as any)["tenderMethod"] || null,
      (n as any)["tenderEstimateValue"] || null,
      (n as any)["tenderReceivedLocation"] || null,
      (n as any)["tenderContact"] || null,
      rawContactPhone ? String(rawContactPhone).substring(0, 20) : null,
      (n as any)["tenderDownloadCount"] || 0,
      true,
      publishedAt
    ];
    await pool.query(`
      INSERT INTO news (
        id, title, slug, summary, category, content, image, author, is_featured,
        is_tender, tender_number, tender_start_date, tender_end_date,
        tender_method, tender_estimate, tender_received_location, contact_name, contact_phone,
        download_count, is_active, published_at, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,NOW(),NOW())
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title
    `, vals);
  }

  // ============================================================
  // TESTIMONIALS (service_id = specialty)
  // ============================================================
  console.log("Creating testimonials...");
  for (const t of TESTIMONIALS) {
    await pool.query(`
      INSERT INTO testimonials (id, patient_name, content, rating, is_approved, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, 5, true, true, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET patient_name = EXCLUDED.patient_name
    `, [t.id, t.patientName, t.content]);
  }

  // ============================================================
  // ORGANIZATION UNITS
  // ============================================================
  console.log("Creating organization_units...");
  await pool.query(`
    INSERT INTO organization_units (id, name, unit_type, address, phone, is_active, created_at, updated_at)
    VALUES
      ('org-1', 'Khoa Tim Mạch', 'khoa_lam_sang', 'Tầng 2 Nhà A', '02353.747.432', true, NOW(), NOW()),
      ('org-2', 'Khoa Sản Phụ Khoa', 'khoa_lam_sang', 'Tầng 3 Nhà A', '02353.747.432', true, NOW(), NOW()),
      ('org-3', 'Khoa Nhi', 'khoa_lam_sang', 'Tầng 2 Nhà B', '02353.747.432', true, NOW(), NOW()),
      ('org-4', 'Khoa Hồi Sức Cấp Cứu', 'khoa_lam_sang', 'Tầng 1 Nhà A', '02353.747.432', true, NOW(), NOW()),
      ('org-5', 'Khoa Ngoại Tổng Hợp', 'khoa_lam_sang', 'Tầng 3 Nhà B', '02353.747.432', true, NOW(), NOW()),
      ('org-6', 'Phòng Công nghệ Thông tin', 'phong_ban_hanh_chinh', 'Tầng 3 Nhà A', '02353.747.432', true, NOW(), NOW()),
      ('org-7', 'Phòng Kế hoạch Tổng hợp', 'phong_ban_hanh_chinh', 'Tầng 4 Nhà A', '02353.747.432', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  // ============================================================
  // PATIENTS
  // ============================================================
  console.log("Creating patients...");
  const patients = [
    { id: "pat-001", patient_code: "BN-001", full_name: "Cô Trương Thị Hoa", cccd: "001234567890", phone: "0905777888", birth_date: "1985-06-15", gender: "nữ", address: "123 Quang Trung, Đại Lộc", visit_count: 5, registered_at: "2026-01-15" },
    { id: "pat-002", patient_code: "BN-002", full_name: "Anh Nguyễn Văn Hoàng", cccd: "002345678901", phone: "0905666777", birth_date: "1978-12-20", gender: "nam", address: "456 Lê Lợi, Đại Lộc", visit_count: 2, registered_at: "2026-02-20" },
    { id: "pat-003", patient_code: "BN-003", full_name: "Chị Phan Thị Vy", cccd: "003456789012", phone: "0905555666", birth_date: "1992-03-10", gender: "nữ", address: "789 Nguyễn Huệ, Đại Lộc", visit_count: 1, registered_at: "2026-03-10" },
    { id: "pat-004", patient_code: "BN-004", full_name: "Nguyễn Văn An", cccd: "004567890123", phone: "0905123456", birth_date: "1990-04-05", gender: "nam", address: "12 Trần Phú, Đại Lộc", visit_count: 3, registered_at: "2026-04-05" },
    { id: "pat-005", patient_code: "BN-005", full_name: "Trần Thị Bình", cccd: "005678901234", phone: "0905111222", birth_date: "1982-05-12", gender: "nữ", address: "34 Bà Triệu, Đại Lộc", visit_count: 4, registered_at: "2026-05-12" },
    { id: "pat-006", patient_code: "BN-006", full_name: "Phạm Văn Cường", cccd: "006789012345", phone: "0905888999", birth_date: "1975-06-01", gender: "nam", address: "56 Hùng Vương, Đại Lộc", visit_count: 6, registered_at: "2026-06-01" },
    { id: "pat-010", patient_code: "BN-2020-00001", full_name: "NGUYỄN VĂN MINH", cccd: "012345678901", phone: "0912345678", birth_date: "1965-03-15", gender: "nam", address: "123 Quang Trung, Xã Đại Lộc, TP Đà Nẵng", visit_count: 12, registered_at: "2020-01-15" },
    { id: "pat-011", patient_code: "BN-2021-00042", full_name: "TRẦN THỊ HOA", cccd: "023456789012", phone: "0987654321", birth_date: "1978-07-22", gender: "nữ", address: "456 Lê Lợi, Xã Đại Lộc, TP Đà Nẵng", visit_count: 8, registered_at: "2021-03-20" },
    { id: "pat-012", patient_code: "BN-2022-00156", full_name: "LÊ VĂN SƠN", cccd: "034567890123", phone: "0903123456", birth_date: "1990-11-08", gender: "nam", address: "789 Nguyễn Huệ, Xã Đại Lộc, TP Đà Nẵng", visit_count: 5, registered_at: "2022-06-10" },
  ];
  for (const p of patients) {
    await pool.query(`
      INSERT INTO patients (id, patient_code, full_name, cccd_hash, cccd_encrypted, phone, birth_date, gender, address, visit_count, registered_at, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        cccd_hash = EXCLUDED.cccd_hash,
        cccd_encrypted = EXCLUDED.cccd_encrypted
    `, [p.id, p.patient_code, p.full_name, cccdService.hashCccd(p.cccd), cccdService.encryptCccd(p.cccd), p.phone, p.birth_date, p.gender, p.address, p.visit_count, p.registered_at]);
  }

  // ============================================================
  // MEDICAL RECORDS (for demo patients)
  // ============================================================
  console.log("Creating medical records...");
  await pool.query(`
    INSERT INTO medical_records (id, patient_id, record_number, admission_date, discharge_date, diagnosis, icd10_code, treatment, notes, is_active, created_at, updated_at)
    VALUES
      ('mr-001', 'pat-010', 'BA-2024-001', '2024-03-15', '2024-03-15', 'Bệnh lý mạch vành, tăng huyết áp độ I', 'I25.10', 'Điều trị nội khoa, theo dõi và tái khám sau 2 tuần', 'Cần theo dõi huyết áp tại nhà', true, NOW(), NOW()),
      ('mr-002', 'pat-010', 'BA-2024-002', '2024-02-20', '2024-02-20', 'Viêm dạ dày mạn tính, H. pylori dương tính', 'K29.5', 'Diệt H. pylori theo phác đồ 14 ngày, ăn uống điều độ', NULL, true, NOW(), NOW()),
      ('mr-003', 'pat-010', 'BA-2024-003', '2023-11-10', '2023-11-10', 'Viêm amidan cấp tính', 'J03.90', 'Kháng sinh, hạ sốt, súc họng nước muối', NULL, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  // ============================================================
  // CLINICAL TESTS (for demo patients)
  // ============================================================
  console.log("Creating clinical tests...");
  await pool.query(`
    INSERT INTO clinical_tests (id, patient_id, medical_record_id, test_code, test_name, result_value, test_date, specimen_type, notes, created_at, updated_at)
    VALUES
      ('ct-001', 'pat-010', 'mr-001', 'LAB-240315-001', 'Lipid máu', 'Cholesterol: 220 mg/dL, HDL: 42, LDL: 148', '2024-03-15', 'xet-nghiem-mau', 'Cần điều chỉnh chế độ ăn', NOW(), NOW()),
      ('ct-002', 'pat-010', 'mr-001', 'XQA-240315-001', 'X-quang ngực thẳng', 'Tim không giãn, không dịch màng phổi', '2024-03-15', 'x-quang', NULL, NOW(), NOW()),
      ('ct-003', 'pat-010', 'mr-002', 'SA-240220-001', 'Siêu âm bụng tổng quát', 'Gan, mật, tụy, lách, thận: bình thường', '2024-02-20', 'sieu-am', NULL, NOW(), NOW()),
      ('ct-004', 'pat-010', 'mr-002', 'LAB-240220-002', 'Công thức máu', 'WBC: 7.2, RBC: 4.8, Hb: 14.2, Hct: 42%, Plt: 245', '2024-02-20', 'xet-nghiem-mau', NULL, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  // ============================================================
  // TREATMENT HISTORIES (for demo patients)
  // ============================================================
  console.log("Creating treatment histories...");
  await pool.query(`
    INSERT INTO treatment_history (id, patient_id, medical_record_id, treatment_date, diagnosis, prescription, notes, created_at, updated_at)
    VALUES
      ('th-001', 'pat-010', 'mr-001', '2024-03-15', 'Bệnh lý mạch vành, tăng huyết áp độ I', 'Aspirin 100mg 1v/ngày, Atorvastatin 20mg 1v/ngày, Amlodipin 5mg 1v/ngày', 'Tái khám sau 2 tuần', NOW(), NOW()),
      ('th-002', 'pat-010', 'mr-002', '2024-02-20', 'Viêm dạ dày mạn tính, H. pylori', 'Amoxicillin 500mg 2v x 2l/ngày, Clarithromycin 500mg 1v x 2l/ngày, Esomeprazole 40mg 1v x 2l/ngày', 'Hoàn tất phác đồ 14 ngày', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  // ============================================================
  // NEW APPOINTMENTS (for demo patients)
  // ============================================================
  console.log("Creating additional demo appointments...");
  await pool.query(`
    INSERT INTO appointments (
      id, patient_id, patient_name, patient_code, phone, service_type,
      specialty_name, doctor_name, appointment_date, time_slot, symptoms,
      status, booking_code, created_at, updated_at
    ) VALUES
      ('apt-010', 'pat-010', 'NGUYỄN VĂN MINH', 'BN-2020-00001', '0912345678', 'kham-benh',
       'Khoa Tim Mạch', 'BS. Nguyễn Văn Minh', '2026-08-15', '08:00',
       'Đau ngực trái, khó thở', 'cho_xac_nhan', 'LH-987001', NOW(), NOW()),
      ('apt-011', 'pat-011', 'TRẦN THỊ HOA', 'BN-2021-00042', '0987654321', 'kham-benh',
       'Khoa Nội Tổng Hợp', 'BS. Trần Thị Hương', '2026-08-16', '09:30',
       'Đau bụng thượng vị, ợ chua', 'cho_xac_nhan', 'LH-987002', NOW(), NOW()),
      ('apt-012', 'pat-012', 'LÊ VĂN SƠN', 'BN-2022-00156', '0903123456', 'kham-benh',
       'Khoa Tai Mũi Họng', 'BS. Lê Văn Sơn', '2026-08-17', '14:00',
       'Đau họng, nuốt đau', 'cho_xac_nhan', 'LH-987003', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  // ============================================================
  // APPOINTMENTS (from HospitalContext defaults)
  // ============================================================
  console.log("Creating appointments...");
  await pool.query(`
    INSERT INTO appointments (
      id, patient_id, patient_name, patient_code, phone, service_type,
      specialty_name, doctor_name, appointment_date, time_slot, symptoms,
      status, booking_code, created_at, updated_at
    ) VALUES
      ('apt-001', 'pat-004', 'Nguyễn Văn An', 'BN-004', '0905123456', 'kham-benh',
       'Khoa Tim Mạch', 'BS. CKII. Nguyễn Minh Trí', '2026-07-20', '08:00 - 09:00',
       'Hay bị đau tức ngực trái khi gắng sức', 'da_xac_nhan', 'LH-987213', NOW(), NOW()),
      ('apt-002', 'pat-005', 'Trần Thị Bình', 'BN-005', '0905111222', 'kham-benh',
       'Khoa Sản Phụ Khoa', 'ThS. BS. Nguyễn Thị Phương Mai', '2026-07-21', '09:30 - 10:30',
       'Khám thai định kỳ tuần thứ 24', 'da_xac_nhan', 'LH-523145', NOW(), NOW()),
      ('apt-003', 'pat-006', 'Phạm Văn Cường', 'BN-006', '0905888999', 'kham-benh',
       'Khoa Nhi', 'BS. CKI. Phan Thanh Hải', '2026-07-22', '14:00 - 15:00',
       'Cháu nhỏ sốt nhẹ kèm ho khan', 'da_xac_nhan', 'LH-812390', NOW(), NOW()),
      ('apt-004', 'pat-002', 'Lê Văn Dũng', 'BN-002', '0914222333', 'kham-benh',
       'Khoa Ngoại Tổng Hợp', 'BS. Lê Thị Thu Hồng', '2026-07-23', '15:30 - 16:30',
       'Tư vấn mổ nội soi sỏi mật', 'da_huy', 'LH-222333', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  // ============================================================
  // FEEDBACK REQUESTS (from Phase 49 mock data)
  // ============================================================
  console.log("Creating feedback_requests...");
  await pool.query(`
    INSERT INTO feedback_requests (
      id, patient_name, service_type, rating, content, status,
      admin_response, responded_by, contact_phone, created_at, updated_at
    ) VALUES
      ('fb-001', 'Nguyễn Thị Minh', 'kham-benh', 5,
       'Nhân viên tại quầy tiếp đón rất niềm nở, bác sĩ khám kỹ lưỡng. Tôi rất hài lòng với dịch vụ.',
       'da_xu_ly', 'Cảm ơn bạn đã góp ý. Chúng tôi sẽ tiếp tục duy trì chất lượng phục vụ tốt nhất.',
       'admin-001', '0905123456',
       NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
      ('fb-002', 'Trần Văn Hùng', 'noi-tru', 3,
       'Khoa Nội sạch sẽ, nhưng thời gian chờ khám hơi lâu. Cần cải thiện quy trình đặt lịch.',
       'dang_xu_ly', NULL, NULL, NULL,
       NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
      ('fb-003', 'Lê Thị Hương', 'cap-cuu', 1,
       'Tôi đợi 2 tiếng mới được gặp bác sĩ trong tình trạng đau bụng cấp. Cần cải thiện quy trình cấp cứu.',
       'moi', NULL, NULL, '0932123456',
       NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours')
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status
  `);

  // ============================================================
  // RECORD REQUESTS (from Phase 49 mock data)
  // ============================================================
  console.log("Creating record_requests...");
  await pool.query(`
    INSERT INTO record_requests (
      id, patient_name, patient_code, request_type, date_from, date_to,
      delivery_method, reason, status, admin_notes, request_code, created_at, updated_at
    ) VALUES
      ('rr-001', 'Phạm Thị Lan', 'BN-123456', 'ket-qua-kham', '2026-06-01', '2026-07-15',
       'tai-kham', 'Làm hồ sơ bảo hiểm', 'da_xu_ly',
       'Đã trả kết quả cho bệnh nhân ngày 20/07/2026', 'YC-789012',
       NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days'),
      ('rr-002', 'Hoàng Văn Đức', NULL, 'don-thuoc', '2026-07-01', '2026-07-22',
       'chuyen-bo-post', 'Gửi về tỉnh', 'dang_xu_ly',
       NULL, 'YC-345678',
       NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
      ('rr-003', 'Đặng Thị Mai', 'BN-987654', 'ho-so-y-te', '2025-01-01', '2026-07-20',
       'nhan-tai-quay', 'Xin việc mới', 'moi',
       NULL, 'YC-111222',
       NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours')
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status
  `);

  // ============================================================
  // CONTACT MESSAGES
  // ============================================================
  console.log("Creating contact_messages...");
  await pool.query(`
    INSERT INTO contact_messages (id, name, email, phone, subject, content, status, created_at, updated_at)
    VALUES
      ('cm-001', 'Nguyễn Văn A', 'nguyenvana@email.com', '0909111222',
       'Yêu cầu hỗ trợ', 'Tôi muốn đặt lịch khám cho bố mẹ tôi, xin hướng dẫn cách đăng ký online.',
       'da_xu_ly', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
      ('cm-002', 'Trần Thị B', 'tranthib@email.com', '0909222333',
       'Phản ánh dịch vụ', 'Khoa Nhi khám rất đông, thời gian chờ quá lâu. Mong bệnh viện có phương án cải thiện.',
       'dang_xu_ly', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
      ('cm-003', 'Lê Văn C', NULL, '0909333444',
       'Thắc mắc về chi phí', 'Xin hỏi chi phí khám tổng quát bao nhiêu tiền? Có bhyt giảm được không?',
       'moi', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours')
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status
  `);

  // ============================================================
  // ACTIVITY LOGS (from HospitalContext defaults)
  // ============================================================
  console.log("Creating activity_logs...");
  await pool.query(`
    INSERT INTO activity_logs (id, user_name, action, created_at)
    VALUES
      ('log-001', 'Lễ tân Hoa (Receptionist)', 'Xác nhận Lịch hẹn #LH-987213', NOW() - INTERVAL '2 days'),
      ('log-002', 'Super Admin', 'Cập nhật lịch trực BS. Nguyễn Minh Trí', NOW() - INTERVAL '1 day')
    ON CONFLICT (id) DO NOTHING
  `);

  // ============================================================
  // SERVICE GROUPS + SERVICES
  // ============================================================
  console.log("Creating service_groups + services...");
  await pool.query(`
    INSERT INTO service_groups (id, name, slug, description, is_active, created_at, updated_at)
    VALUES
      ('sg-1', 'Khám bệnh', 'kham-benh', 'Các loại hình khám bệnh tại bệnh viện', true, NOW(), NOW()),
      ('sg-2', 'Cận lâm sàng', 'can-lam-sang', 'Xét nghiệm, chẩn đoán hình ảnh', true, NOW(), NOW()),
      ('sg-3', 'Ngoại trú', 'ngoai-tru', 'Các dịch vụ ngoại trú', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  await pool.query(`
    INSERT INTO services (id, name, slug, group_id, description, price, is_active, created_at, updated_at)
    VALUES
      ('svc-1', 'Khám tổng quát', 'kham-tong-quat', 'sg-1', 'Khám tổng quát với bác sĩ chuyên khoa', 150000, true, NOW(), NOW()),
      ('svc-2', 'Khám chuyên khoa', 'kham-chuyen-khoa', 'sg-1', 'Khám với bác sĩ chuyên khoa I, II', 250000, true, NOW(), NOW()),
      ('svc-3', 'Xét nghiệm máu', 'xet-nghiem-mau', 'sg-2', 'Công thức máu, sinh hóa máu', 80000, true, NOW(), NOW()),
      ('svc-4', 'Siêu âm bụng', 'sieu-am-bung', 'sg-2', 'Siêu âm ổ bụng tổng quát', 180000, true, NOW(), NOW()),
      ('svc-5', 'Điện tim đồ', 'dien-tim-do', 'sg-2', 'Ghi điện tim 12 đạo trình', 120000, true, NOW(), NOW()),
      ('svc-6', 'Phẫu thuật nội soi', 'phau-thuat-noi-soi', 'sg-3', 'Mổ nội soi các loại', 5500000, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  // ============================================================
  // PRICE LIST
  // ============================================================
  console.log("Creating price_list...");
  await pool.query(`
    INSERT INTO price_list (id, service_id, group_id, item_name, price, unit, insurance_note, is_active, created_at, updated_at)
    VALUES
      ('pl-1', 'svc-1', 'sg-1', 'Khám tổng quát', 150000, 'lượt', 'BHYT chi trả 80%', true, NOW(), NOW()),
      ('pl-2', 'svc-2', 'sg-1', 'Khám chuyên khoa', 250000, 'lượt', 'BHYT chi trả 80%', true, NOW(), NOW()),
      ('pl-3', 'svc-3', 'sg-2', 'Xét nghiệm công thức máu', 80000, 'lượt', 'BHYT chi trả 95%', true, NOW(), NOW()),
      ('pl-4', 'svc-4', 'sg-2', 'Siêu âm ổ bụng', 180000, 'lượt', 'BHYT chi trả 80%', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  // ============================================================
  // NEWS CATEGORIES
  // ============================================================
  console.log("Creating news_categories...");
  await pool.query(`
    INSERT INTO news_categories (id, name, slug, description, sort_order, created_at, updated_at)
    VALUES
      ('nc-1', 'Tin y học', 'tin-y-hoc', 'Cập nhật y khoa, kỹ thuật mới', 1, NOW(), NOW()),
      ('nc-2', 'Thông báo', 'thong-bao', 'Thông báo từ bệnh viện', 2, NOW(), NOW()),
      ('nc-3', 'Sự kiện', 'su-kien', 'Các sự kiện y tế', 3, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `);

  console.log("\n✅ Seed completed successfully!");
  console.log("\nSummary:");
  console.log("  - 3 admin users");
  console.log("  - 8 specialties");
  console.log("  - 4 doctors + schedules");
  console.log("  - 7 news (tin tức + tenders)");
  console.log("  - 3 testimonials");
  console.log("  - 7 organization units");
  console.log("  - 6 patients");
  console.log("  - 4 appointments");
  console.log("  - 3 feedback_requests");
  console.log("  - 3 record_requests");
  console.log("  - 3 contact_messages");
  console.log("  - 2 activity_logs");
  console.log("  - 3 service_groups");
  console.log("  - 6 services");
  console.log("  - 4 price_list items");
  console.log("  - 3 news_categories");
}

seed()
  .then(() => pool.end())
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    pool.end();
    process.exit(1);
  });