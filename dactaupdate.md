# Design Document - BVĐK Website

> **Nguồn tham chiếu chính:** `Dac-ta-Master-v3.0-SRS-TRD.docx` (single source of truth — Master Production-Ready SRS/TRD, 27/07/2026)
> File này ghi nhận các thay đổi lớn chưa có trong spec chính v3.0, dùng làm cơ sở nâng cấp version docx lần kế tiếp (v3.1).
> **Lịch sử:** v2.x đã deprecated — toàn bộ nội dung v2.13 + patch v2.14 đã merge vào v3.0. Nhật ký Phase 1-74 đã dọn sạch khỏi file này (audit trail nằm trong `memory/phase-history.md`).

---

## Thông tin bệnh viện

**Tên đầy đủ:** Bệnh Viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam

**Địa chỉ:** 107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng

**Lãnh đạo:**

| Chức vụ | Họ tên |
|---------|--------|
| Giám đốc | BS CKII Nguyễn Thống Nhất |
| Phó Giám đốc | BSCK II Lê Minh Dũng |
| Phó Giám đốc | BS CKII Nguyễn Đình Hoàng |

---

## Database Status — Verified against Prisma schema (2026-07-27)

> Cross-check `prisma/schema.prisma` (24 models) vs spec v2.13 mục 15. Kết quả:

### Nhóm A — Đã có đầy đủ trong schema ✅

`patients`, `appointments` (có cancel fields: `cancelledAt` + `cancelReason` + `cancelledBy`), `admin_users` (10 fields + MFA + department_id), `doctors`, `doctor_schedules`, `specialties`, `news` (v2.5 tender fields inline), `organization_units` (tree structure), `feedback_requests` (v2.6 + `contactPhone`/`contactEmail` cho ẩn danh), `record_requests` (`requestCode` UNIQUE), `record_request_files`, `notification_logs` (polymorphic + `@@index([createdAt])` sẵn sàng cleanup), `service_groups`, `services`, `news_categories`, `price_list`, `testimonials`, `contact_messages`, `activity_logs` (có `userId`/`details`/`ipAddress`/`userAgent`), `medical_records`, `clinical_tests`, `consent_policies`, `patient_consents`, `treatment_history`.

### Nhóm C — Roadmap, chưa triển khai 📋

| Bảng | Mục spec | Khi nào triển khai |
|------|----------|-------------------|
| `prescription_refill_requests` | 21.5 | Cấp lại đơn thuốc online |
| `insurance_verifications` | 21.5 | Kiểm tra quyền lợi BHYT |
| `appointment_reminders` | 21.5 | Nhắc lịch khám |
| `queue_tickets` | 21.5 | Hàng đợi số thứ tự khám |
| `lab_test_requests` | 8.5 | Đặt lịch xét nghiệm online |
| `teleconsult_requests` | 8.5 | Tư vấn từ xa |

**Nguyên tắc (mục 21.1):** 6 bảng này chỉ tạo khi tính năng được phê duyệt — tránh bảng rỗng.

### Cần bổ sung trước khi bật cleanup job

- `activity_logs`: thêm `@@index([createdAt])` trước khi bật job cleanup tuân thủ pháp luật. Hiện schema chưa có index này.
- `notification_logs`: đã có `@@index([createdAt])` → sẵn sàng bật job cleanup 180 ngày (theo AGENTS.md Data Retention Governance).

---

## File Storage Naming Convention — Đã thống nhất ✅

Mọi bảng file đính kèm dùng cột `file_path` (không dùng `storage_path`/`file_url`/`path`...). Hiện chỉ có `record_request_files` (file_path @db.Text) — bảng `tender_files` không tồn tại theo spec v2.13 (News dùng inline tender_* fields).

---

## Admin Tabs — RBAC Matrix theo role

> Spec mục 9.2 + 21.4 + Phase 49 bổ sung 2 tabs.

| Tab | File | Super Admin | Dept Admin | Doctor |
|-----|------|-------------|------------|--------|
| Tổng quan | OverviewTab.tsx | Read | Read | Read |
| Lịch hẹn | BookingsTab.tsx | CRUD | CRUD khoa mình | Read |
| Bệnh nhân | PatientsTab.tsx | Read | Read | Read |
| Lịch trực | ShiftsTab.tsx | CRUD | CRUD khoa mình | Read |
| Chuyên khoa | SpecialtiesTab.tsx | CRUD | — | — |
| Bác sĩ | DoctorsTab.tsx | CRUD | — | Read |
| Tin tức | NewsTab.tsx | CRUD | CRUD khoa mình | CRUD (bài của mình) |
| Tổ chức | OrganizationTab.tsx | CRUD | — | — |
| Nhật ký | LogsTab.tsx | Read | Read | Read |
| Services | ServicesTab.tsx | CRUD | — | — |
| Patient Guide | PatientTab.tsx | CRUD | — | — |
| Tender | TenderTab.tsx | CRUD | CRUD khoa mình | — |
| Contact | ContactTab.tsx | CRUD | — | — |
| Phản hồi | FeedbackTab.tsx | CRUD đầy đủ | Xem + phản hồi khoa mình | Không |
| Yêu cầu trích sao | RecordRequestsTab.tsx | CRUD đầy đủ | Xem + xử lý khoa mình | Không |

**Trạng thái enforce:** UI có đủ 15 tab, backend có role check cơ bản, **chưa enforce matrix chi tiết + department ownership**. Cần Phase tiếp: RBAC middleware đầy đủ.

---

## Deployment Architecture — DMZ Server (chốt 2026-07-23)

### PHƯƠNG ÁN A: Docker Containers trên Single VM ✅ ĐÃ IMPLEMENT

```
┌─────────────────────────────────────────────────────────────┐
│                     DMZ SERVER (Single VM)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Docker Engine                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ bvdh-       │  │ bvdh-       │  │ bvdh-db     │   │  │
│  │  │ frontend    │  │ backend     │  │ (Postgres)  │   │  │
│  │  │ :8000 int   │  │ :8001 int   │  │ :5432 int   │   │  │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────┘   │  │
│  │         │                │                            │  │
│  │  ┌──────┴────────────────┴──────┐                    │  │
│  │  │     bvdh-nginx (Reverse)     │                    │  │
│  │  │  :8443 → HTTPS (public)     │                    │  │
│  │  └──────────────────────────────┘                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

- **Chỉ port 8443 public ra host** — mọi request đi qua nginx (HTTPS, self-signed trong dev).
- Frontend 8000 + Backend 8001 + DB 5432 chỉ `expose` nội bộ, không publish.
- Trình duyệt truy cập `https://localhost:8443` (dev) hoặc `https://bvdh.vn` (prod).
- Tránh xung đột với các app mặc định ở 80/443/3000/5432 trên máy dev.

Chi tiết: AGENTS.md section "Port Policy (Bắt buộc — không thay đổi trừ khi có tài liệu kiến trúc)" + "Docker Dev Workflow — BẮT BUỘC NHỚ".

---

## Security & RBAC Standards

> Nguồn: cross-check `dactaupdate.md:269-326` (2026-07-23) với code thực tế (2026-07-27).

### 1. JWT Tokens

- **Access Token**: 15-30 phút expiry (chứa `sub`, `role`, `scope`, `exp`) — ✅ Phase 68+ Admin Login
- **Refresh Token**: 7 ngày, lưu **httpOnly cookie** (chống XSS) — ✅ Phase 68+
- Refresh rotation: cấp refresh mới mỗi lần refresh, revoke refresh cũ

### 2. Password Security

- **Hiện tại dùng PBKDF2-SHA512, 100000 iterations** (`server/services/auth.service.ts:34`) — tương đương bcrypt cost 12, chấp nhận được OWASP.
- Nếu chuyển sang bcrypt: salt rounds = 12 (OWASP 2024)
- Policy: tối thiểu 8 ký tự, có chữ hoa + chữ thường + số, không chứa username — **chưa enforce frontend đầy đủ**
- Forgot password: rate limit 3/giờ/user, token reset 30 phút, dùng 1 lần — **chưa implement**

### 3. Rate Limiting

| Endpoint | Limit | Code status |
|----------|-------|-------------|
| Public form (feedback/record-request/contact/lab-test/teleconsult) | **5 request/IP/15 phút** | ✅ Phase 49 |
| Admin Auth (login/refresh/OTP) | **5 request/phút** | ❌ Chưa enforce |
| Login attempts | **5 lần → lockout 30 phút** | ❌ Chưa enforce |
| Default public API khác | 100 request/phút | ❌ Chưa enforce |

### 4. RBAC Roles

```typescript
type Role = 'Super Admin' | 'Receptionist' | 'Doctor' | 'Department Admin';
```

**Đặt tên DB:** snake_case (`super_admin`/`Receptionist`/`doctor`/`department_admin`), map sang PascalCase khi trả API response. Field `AdminUser.role` (schema:20) đang lưu PascalCase theo comment — cần verify seed/migration.

### 5. Audit Logging

- Mọi admin action log vào `activity_logs`: `userId` (nullable), `userName`, `action`, `details` (JSON-payload), `ipAddress`, `userAgent`, `createdAt` — schema đã có đủ fields (dòng 460-471).
- **PHI access log riêng** với `dataAccessed: 'PHI'` + `patient_id` + `purpose` (Nghị định 13/2023) — **chưa enforce code**.
- `activity_logs` **KHÔNG được cleanup** (compliance retention — AGENTS.md Data Retention).

### 6. Security Headers (production — qua nginx)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY (admin), SAMEORIGIN (public)
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

✅ Đã set trong `nginx/nginx.conf` (verify Phase 70).

### 7. Network Security (DMZ)

- PostgreSQL: internal-only (port 5432 không publish — ✅ đúng Port Policy Phase 70)
- Redis/MinIO nếu thêm: internal-only từ port 8002+
- UFW whitelist: 8443 (HTTPS) + 22 (SSH nội bộ)
- Fail2ban: chống brute-force SSH + admin login

### 8. RBAC Permissions Matrix

| Permission | Super Admin | Receptionist | Doctor | Dept Admin |
|------------|-------------|--------------|--------|------------|
| users:read | ✅ | ✅ | ❌ | ❌ |
| users:write | ✅ | ❌ | ❌ | ❌ |
| users:delete | ✅ | ❌ | ❌ | ❌ |
| appointments:read | ✅ | ✅ | ✅ (own) | ✅ |
| appointments:write | ✅ | ✅ | ❌ | ✅ |
| appointments:cancel | ✅ | ✅ | ❌ | ✅ |
| medical-records:read | ✅ | ❌ | ✅ (own patients) | ❌ |
| medical-records:write | ✅ | ❌ | ❌ | ❌ |
| reports:read | ✅ | ❌ | ❌ | ✅ |
| reports:export | ✅ | ❌ | ❌ | ❌ |
| settings:read | ✅ | ❌ | ❌ | ✅ |
| settings:write | ✅ | ❌ | ❌ | ❌ |

### Trạng thái enforce tổng hợp

| Mục | Code status | Ghi chú |
|-----|-------------|---------|
| Public form rate limit (5/IP/15ph) | ✅ Có | Phase 49 + AGENTS.md Public Form API |
| JWT access/refresh + httpOnly cookie | ✅ Có | Phase 68+ Admin Login redesign |
| Audit logging `activity_logs` | ✅ Schema đủ | Có `userId`/`details`/`ipAddress`/`userAgent`. Cần verify service thực tế ghi |
| Security headers | ✅ Có | Qua `nginx/nginx.conf` |
| RBAC enforcement backend | ⚠️ Partial | Role check cơ bản, chưa enforce matrix + department ownership |
| PHI access log riêng (dataAccessed/purpose) | ❌ Chưa có | Cần Phase tiếp (Nghị định 13/2023) |
| Bcrypt salt 12 | ⚠️ PBKDF2-SHA512 100k | Tương đương bcrypt cost 12, OWASP chấp nhận |
| Rate limit admin auth + login lockout | ❌ Chưa có | Phase tương lai |
| Forgot password rate limit + token reset | ❌ Chưa có | Phase tương lai |
| Frontend password policy validation | ⚠️ Partial | Chưa enforce đầy đủ 8 ký tự + hoa + thường + số |

---

## Cập nhật version spec docx kế tiếp (v3.1)

> v3.0 đã cover toàn bộ Phase 68-74 (Port Policy, RecordRequestModal UX/scrollbar fix, Docker Dev Workflow, RBAC matrix, Consent Management, Patient Portal HIS, activity_logs schema).
> V3.1 chỉ cần bổ sung các gap sau (chưa có trong v3.0, phát sinh sau ngày 27/07/2026):

**Cần đề xuất bổ sung vào v3.1:**
1. **KHỐI 5.4.x** — `activity_logs`: thêm `@@index([createdAt])` trước khi bật job cleanup tuân thủ pháp luật. Hiện schema chưa có index này (trong khi `notification_logs` đã có).
2. **KHỐI 6.x** — PHI access log policy: thêm fields `dataAccessed`/`purpose` cho `activity_logs` theo Nghị định 13/2023 (v3.0 KHỐI 6 đã ghi Consent Management, chưa ghi riêng PHI access audit).
3. **KHỐI 4.x** — Security: ghi rõ password hash hiện tại là PBKDF2-SHA512 100k iterations (không phải bcrypt cost 12 như dactaupdate đề xuất cũ), chấp nhận được OWASP.
4. **KHỐI 4.x** — Rate limit matrix chi tiết: phân biệt public form (5/IP/15ph ✅) vs admin auth (5/phút ❌ chưa enforce) vs login lockout (5 lần → 30 phút ❌) vs default public (100/phút ❌).
5. **KHỐI 4.x** — Forgot password flow: rate limit 3/giờ/user, token reset 30 phút, dùng 1 lần — chưa implement, docx nên ghi trước.
6. **KHỐI 3.1 (Template C3) hoặc KHỐI 5.4** — Sửa mâu thuẫn `tender_files`: v3.0 dòng 1919 (template C3) ghi "lưu trong bảng tender_files" nhưng schema không có bảng này (file đấu thầu lưu inline trong `news` qua các field `tender_*`). Cần xoá bỏ tham chiếu `tender_files` hoặc quyết định tạo bảng riêng nếu cần quan hệ file 1-n.
7. **KHỐI 1.2** — Số lượng bảng: "19+ bảng" nên làm rõ thành "24 bảng" (đếm theo Prisma schema thực tế, bao gồm cả consent_policies/patient_consents của KHỐI 6.2).

**Quy ước:**
- Đánh version v3.1
- Áp dụng nguyên tắc In-place Update: cập nhật đè trực tiếp vào đúng KHỐI liên quan (KHỐI 4-6), không nối đuôi chương mới.
- Ghi Changelog tóm tắt KHỐI 1.5: "v3.1 — bổ sung activity_logs index, PHI audit policy, password hash clarification, rate limit matrix, forgot password flow".
- Audit trail chi tiết: `memory/phase-history.md` Phase tương ứng.
