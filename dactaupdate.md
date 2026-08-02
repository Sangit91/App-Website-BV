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

## Database Status — Verified against Prisma schema (2026-08-01)

> Cross-check `prisma/schema.prisma` (25 models) vs spec v2.13 mục 15 + đối chiếu thay đổi Phase 84-90 (2026-08-01). Kết quả:

### Nhóm A — Đã có đầy đủ trong schema ✅

`patients` (từ Phase 84: bỏ cột `cccd` plaintext → `cccdHash String? @unique @map("cccd_hash")` + `cccdEncrypted @map("cccd_encrypted")`, AES-256-GCM), `appointments` (có cancel fields: `cancelledAt` + `cancelReason` + `cancelledBy` + index `phone`), `admin_users` (10 fields + MFA + department_id), `doctors`, `doctor_schedules`, `specialties`, `news` (tender fields inline; từ Phase 80: `tender_start_date`/`tender_end_date` đổi `@db.Date` → `@db.Timestamp(3)` lưu giờ; thêm `tender_dept`; từ Phase 93: thêm `tender_file Json?` để lưu file hồ sơ thầu — xem mục 36), `organization_units` (tree structure), `feedback_requests` (v2.6 + `contactPhone`/`contactEmail` cho ẩn danh), `record_requests` (`requestCode` UNIQUE), `record_request_files`, `notification_logs` (polymorphic + `@@index([createdAt])` sẵn sàng cleanup), `service_groups`, `services`, `news_categories`, `price_list`, `testimonials`, `contact_messages`, `activity_logs` (từ Phase 85: thêm `durationMs`/`dataAccessed`/`patientId` + index `createdAt`/`userId`/`patientId` — compliance PHI audit), `medical_records`, `clinical_tests`, `consent_policies` (`policy_version` nullable từ Phase 84), `patient_consents` (index `[patientId, policyVersion, isAgreed]`), `treatment_history`, `site_content` (từ Phase 90: key-value JSON store cho nội dung tĩnh — `key String @id` + `value Json default "{}"` + `updatedAt`).

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

- `activity_logs`: từ Phase 85 đã có `@@index([createdAt])` (cùng `userId`/`patientId`). Tuy nhiên theo Data Retention Governance, `activity_logs` là log **tuân thủ (compliance)** → **KHÔNG được** viết job cleanup. Index phục vụ truy vấn audit, không phải để cleanup.
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
| Hướng dẫn BN | PatientGuideTab.tsx | CRUD | — | — |
| Tender | TenderTab.tsx | CRUD | CRUD khoa mình | — |
| Contact | ContactTab.tsx | CRUD | — | — |
| Phản hồi | FeedbackTab.tsx | CRUD đầy đủ | Xem + phản hồi khoa mình | Không |
| Yêu cầu trích sao | RecordRequestsTab.tsx | CRUD đầy đủ | Xem + xử lý khoa mình | Không |

**Trạng thái enforce:** UI có đủ 15 tab. Backend từ Phase 85 đã enforce role-level: specialties/doctors/organization/service/testimonial write → `requireSuperAdmin`; news/feedback/record-request write → `requireAdmin` + `authorizeDepartmentAccess`; bookings GET + appointment `/search` → `requireAnyStaff` (Receptionist+Doctor). **Còn thiếu:** department ownership chi tiết cho từng record (VD: Dept Admin chỉ sửa tin của khoa mình) và matrix cho Shifts/Patients/Tender. Cần Phase tiếp: RBAC middleware department-scoped đầy đủ.

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
| Admin Auth (login/refresh/OTP) | **10 request/15 phút** | ✅ Express rate-limit trên `/api/v1/auth` |
| Login attempts | **5 lần → lockout 30 phút** | ⚠️ Partial — lockout logic trong `auth.service.ts` (loginAttempts Map) |
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
| Public form rate limit (5/IP/15ph) | ✅ Phase 86 | `server/middleware/rate-limit.middleware.ts` — mỗi form 1 bucket riêng (bookingFormLimiter/feedbackFormLimiter/recordRequestFormLimiter/consentFormLimiter/appointmentFormLimiter); lookup 30/15ph, AI 20/15ph, OTP verify 10/15ph |
| JWT access/refresh + httpOnly cookie | ✅ Phase 82 | Refresh có `jti` + in-memory store, rotation + reuse detection → revokeAllForUser; cookie `bvdh_refresh` httpOnly + secure=IS_PROD + sameSite lax + path `/api/v1/auth` |
| Audit logging `activity_logs` | ✅ Phase 85 | `activity-log.service.ts` + `activity-log.middleware.ts` (activityLogger đo duration qua `res.on("finish")`); wire toàn bộ admin write routes + 3 PHI routes (`dataAccessed: "PHI"` + patientId); schema thêm `durationMs`/`dataAccessed`/`patientId` + index |
| Security headers (helmet) | ✅ Phase 83 | helmet CSP env-aware (dev lax / prod strict `script-src 'self'`); nginx server-level CSP/Permissions-Policy/HSTS + bỏ CORS reflect-any. Lưu ý: có 2 CSP (nginx + helmet) cùng áp dụng — browser lấy intersection |
| CORS policy | ✅ Phase 83 | Chỉ allow `CORS_ORIGIN` (mặc định localhost:3000), credentials; nginx bỏ reflect-any |
| Rate limit admin auth | ✅ Phase 83 | express-rate-limit 10 req/15ph trên `/api/v1/auth/admin/*` + `/otp/*`; nginx `admin_auth` zone 50r/m |
| Login lockout (5 attempts → 30 phút) | ⚠️ Partial | Lockout logic còn trong memory Map (Phase 83), chưa persist DB — Wave E |
| Consent middleware wired to PHI routes | ✅ Phase 81 | `requirePatientReadAccess` (readToken OTP hoặc JWT admin) + `consentCheckMiddleware` trên 3 PHI routes |
| RBAC enforcement backend | ✅ Phase 85 | Role-level: specialties/doctors/organization/service/testimonial write → `requireSuperAdmin`; news/feedback/record-request write → `requireAdmin` + `authorizeDepartmentAccess`; bookings GET + appointment `/search` → `requireAnyStaff`. Department ownership chi tiết chưa có |
| PHI access log riêng (dataAccessed/purpose) | ✅ Phase 85 | 3 PHI routes log `PHI_READ_*` + `dataAccessed:"PHI"` + patientId (Nghị định 13/2023) |
| Password hash | ✅ PBKDF2-SHA512 100k | `auth.service.ts:34` + `seed.ts` chuẩn. Tương đương bcrypt cost 12 |
| CCCD encryption | ✅ Phase 84 | AES-256-GCM (`cccd.service.ts`) + `cccdHash` SHA-256 unique + bỏ cột `cccd` plaintext; lookup match qua hash, mask `0012****90` |
| Input validation (Zod) | ✅ Phase 86 | `server/validators/schemas.ts` + `middleware.ts` (validate helper, message tiếng Việt, detect thiếu trường qua `getPathValue`); wire toàn bộ route public + admin write |
| Pagination thật | ✅ Phase 86 | `server/utils/pagination.ts` (`getPagination` page/limit/skip); bookings/feedback/record-requests/doctors/news trả `X-Total-Count`; 3 route PHI trả `{data,total,page,pageSize}` giữ key records/tests/histories |
| Health check DB + graceful shutdown | ✅ Phase 86 | `/api/health` check `SELECT 1` qua Prisma (503 degraded); `server.ts` cleanup uploads/temp + SIGTERM/SIGINT shutdown + unhandledRejection; API 404 JSON trước SPA fallback; MulterError → 400 |
| Prisma soft-delete middleware | ✅ Phase 84 | `$extends` auto-filter `deletedAt: null` cho Patient + AdminUser — mở rộng cả `findUnique`/`update`/`delete`/`updateMany`/`deleteMany` |
| OTP flow thay token minting | ✅ Phase 81 | Gỡ `/token/access` + `/token/refresh` → `/otp/send` + `/otp/verify` → `readToken` (5 phút); OTP session store, MAX_OTP_ATTEMPTS=5 |
| Forgot password rate limit + token reset | ❌ Chưa có | Phase tương lai (Wave E) |
| Frontend password policy validation | ⚠️ Partial | Chưa enforce đầy đủ 8 ký tự + hoa + thường + số |
| Mass assignment protection | ✅ Phase 86 | Zod whitelisting + explicit field pick (không spread `...data` trực tiếp) trên route admin write |

---

## Cập nhật version spec docx kế tiếp (v3.1)

> v3.0 đã cover toàn bộ Phase 68-74 (Port Policy, RecordRequestModal UX/scrollbar fix, Docker Dev Workflow, RBAC matrix, Consent Management, Patient Portal HIS, activity_logs schema).
> V3.1 chỉ cần bổ sung các gap sau (chưa có trong v3.0, phát sinh sau ngày 27/07/2026):

**Cần đề xuất bổ sung vào v3.1:**
1. ✅ **KHỐI 5.4.x** — `activity_logs`: thêm `@@index([createdAt])` (Phase 85 đã thêm cùng `userId`/`patientId`).
2. ✅ **KHỐI 6.x** — PHI access log policy: thêm fields `durationMs`/`dataAccessed`/`patientId` cho `activity_logs` theo Nghị định 13/2023 (Phase 85 đã implement + log `PHI_READ_*`).
3. ✅ **KHỐI 4.x** — Security: ghi rõ password hash hiện tại là PBKDF2-SHA512 100k iterations (`auth.service.ts:34`), tương đương bcrypt cost 12.
4. ✅ **KHỐI 4.x** — Rate limit matrix chi tiết (Phase 83+86): public form 5/IP/15ph per-bucket (booking/feedback/record-request/consent/appointment riêng), lookup 30/15ph, AI 20/15ph, OTP verify 10/15ph, admin auth 10/15ph, nginx `admin_auth` 50r/m.
5. ⚠️ **KHỐI 4.x** — Forgot password flow: rate limit 3/giờ/user, token reset 30 phút, dùng 1 lần — **chưa implement**, docx nên ghi trước (Wave E).
6. ✅ **KHỐI 3.1 (Template C3) hoặc KHỐI 5.4** — Mâu thuẫn `tender_files`: đã xoá tham chiếu bảng này — file đấu thầu lưu inline trong `news` qua các field `tender_*`.
7. ✅ **KHỐI 1.2** — Số lượng bảng: "24 bảng" (đếm theo Prisma schema thực tế, bao gồm cả consent_policies/patient_consents của KHỐI 6.2).
8. ✅ **KHỐI 3.2 (Logo)** — Thay thế "icon vuông bo góc gradient" bằng `Logo_bqn.png` (`/images/logo/Logo_bqn.png`) cho toàn bộ surface.
9. ⚠️ **KHỐI 3.6.2 (Admin Login)** — Layout hiện tại khác spec: full dark overlay (không split-screen), có role pill selector (spec cấm production), thêm time display / SYSTEM ONLINE badge / ATTT badge / wave animation / spotlight cursor. Cần quyết định giữ hay rollback.
10. ✅ **KHỐI 2.3.5 (Specialty Card)** — Icon Lucide đã được thay bằng ảnh thật JPEG (`/images/specialties/*.jpeg`).
11. ⚠️ **KHỐI 3.2 (Section 6 — Trang chủ)** — Chỉ có 6/32 chuyên khoa trong DB, spec ghi "8 thẻ nổi bật" + "12+ chuyên khoa" + "32 chuyên khoa". Cần seed thêm hoặc cập nhật spec.
12. ✅ **KHỐI 5.4.4 (Specialties)** — Field `icon` trong DB lưu `iconType`; interface TypeScript dùng `iconType` — đã map nhất quán.
13. ✅ **KHỐI 3.6.3 (Admin Navigation)** — Có 15 tabs (not 17): Home, About, Services, Patient Guide, Tender, Contact đều có. Cập nhật spec navigation.
14. ✅ **KHỐI 2.x** — Animation pattern: admin tables dùng `rowVariants` + `motion.tr` stagger; ScrollAnimation public components + prefers-reduced-motion (Phase 87).
15. ✅ **KHỐI 3.x (API versioning)** — Đồng bộ API prefix: tất cả endpoint API dùng `/api/v1/*`.
16. ✅ **KHỐI 4.x (Security middleware)** — `helmet()` (CSP env-aware) + `cors()` chỉ allow `CORS_ORIGIN`; express-rate-limit trên admin auth + OTP. Ghi nhận vào spec security section.
17. ✅ **KHỐI 4.x (Mass assignment protection)** — Zod whitelisting + explicit field pick thay `...data` spread (Phase 86).
18. ✅ **KHỐI 5.4.x (Soft delete)** — Prisma `$extends` middleware auto-filter `deletedAt: null` cho Patient + AdminUser trên `findMany`/`findFirst`/`count`/`findUnique`/`update`/`delete`/`updateMany`/`deleteMany` (Phase 84).
19. ✅ **KHỐI 6.x (Consent enforcer)** — `requirePatientReadAccess` + `consentCheckMiddleware` wire vào patient PHI routes (Phase 81). Trả 403 nếu chưa consent.
20. ✅ **KHỐI 3.6.3 (Admin Navigation)** — Rename `PatientTab` → `PatientGuideTab` để phân biệt với `PatientsTab`.
21. ✅ **KHỐI 2.6 (Tin tức — thông báo thầu)** — Cơ chế mốc thời gian cho thầu (Phase 80): `news.tender_start_date`/`tender_end_date` dùng `@db.Timestamp(3)`; admin đăng/sửa thầu đặt **3 mốc** qua `datetime-local`; web hiển thị đúng mốc admin điền, chỉ fallback ngày tạo khi mốc bỏ trống.
22. ✅ **KHỐI 3.6.3 / 3.6.4 (Admin — Tender tab)** — `TenderTab` dùng `TenderFormModal` chuyên dụng (header gradient full-bleed, 3 phân vùng, 3 input `datetime-local`).

**Bổ sung mới (Phase 81-86 — chưa có trong v3.0):**
23. **KHỐI 6.x (OTP Flow thay token minting)** — Phase 81 gỡ `/token/access` + `/token/refresh`, thay bằng `/otp/send` + `/otp/verify` → `readToken` (hiệu lực 5 phút). `server/services/otp.service.ts` (OTP session store, MAX_OTP_ATTEMPTS=5, TTL 5min). `/otp/send` dev trả `devOtp`. Spec HIS API Standards (mục 21.x) cần thay mục "Authentication Flow" cũ bằng OTP flow cho PHI + JWT cho admin.
24. **KHỐI 4.x (Refresh token rotation + reuse detection)** — Phase 82: refresh token có `jti` + in-memory store; mỗi lần refresh → revoke cũ + cấp mới; replay refresh cũ → revokeAllForUser. Cookie `bvdh_refresh` httpOnly + secure=IS_PROD + sameSite lax + path `/api/v1/auth`. Thêm `/admin/logout`.
25. **KHỐI 4.x (Fail-fast secrets)** — Phase 82: `CONSENT_SECRET` throw khi thiếu (production); `ADMIN_DEFAULT_PASSWORD` env (fallback "Admin@123" chỉ dev).
26. **KHỐI 4.x (CCCD encryption)** — Phase 84: schema Patient bỏ cột `cccd` plaintext → `cccdHash` (SHA-256 unique) + `cccdEncrypted` (AES-256-GCM qua `cccd.service.ts`). Lookup bệnh nhân match qua hash, hiển thị mask `0012****90`. Spec mục 15.1 cần ghi rõ không lưu CCCD plaintext.
27. **KHỐI 4.x (Zod validation toàn bộ route)** — Phase 86: `server/validators/schemas.ts` + `middleware.ts` — `validate` helper (message tiếng Việt, detect thiếu trường qua `getPathValue` vì Zod v4 không expose `received`). Wire public + admin write routes.
28. **KHỐI 3.x (Pagination thật)** — Phase 86: `server/utils/pagination.ts` — list endpoints trả `X-Total-Count` header + shape `{data,total}` (frontend không break vì giữ key cũ); 3 route PHI trả `{data,total,page,pageSize}` giữ key `records/tests/histories`.
29. **KHỐI 5.4 (Health check + graceful shutdown)** — Phase 86: `/api/health` check `SELECT 1` qua Prisma (503 degraded); `server.ts` cleanup uploads/temp + SIGTERM/SIGINT shutdown + unhandledRejection; API 404 JSON "API endpoint không tồn tại" trước SPA fallback; MulterError → 400.
30. **KHỐI 3.x (Per-form rate limit bucket)** — Phase 86: mỗi form 1 bucket riêng (không chặn chéo) — spec Public Form API Standards cần ghi rõ hành vi per-endpoint bucket.
31. **KHỐI 4.x (Audit logging middleware)** — Phase 85: `activity-log.middleware.ts` đo duration qua `res.on("finish")` + ghi log tự động cho toàn bộ admin write routes + 3 PHI routes — spec Audit Logging cần ghi pattern middleware tự động thay vì gọi service thủ công.
32. **KHỐI 4.x (RBAC enforce helpers)** — Phase 85: `auth.middleware.ts` bổ sung `requireSuperAdmin`/`requireAdmin`/`requireAnyStaff` (Receptionist+Doctor) + `authorizeDepartmentAccess`. Spec RBAC matrix cần ghi mapping route → helper cụ thể.
**Bổ sung mới (Phase 90 — chưa có trong v3.0):**

33. **KHỐI 3.1 (CMS nội dung tĩnh `site_content`)** — Phase 90: bảng `site_content` (key-value JSON) làm nguồn chung cho 5 phần nội dung tĩnh (Services/Contact/About/Patient/Home). Backend: model `SiteContent` (key String @id, value Json, updatedAt) + migration `20260801080000_site_content`; `GET /api/v1/site-content` + `GET /:key` public; `PUT /:key` → `authenticate` + `requireSuperAdmin` + `activityLogger` (SITE_CONTENT_UPDATE). Frontend: `SiteContentContext` — `getSection<T>(key, fallback)` deep-merge (DB value đè fallback, key thiếu giữ fallback → không cần seed) + `saveSection` (PUT qua authedFetch); 5 data modules `src/data/site{Services,Contact,About,Patient,Home}.ts` chứa defaults; 5 admin tabs DB-backed (Services/Contact/About/Patient/HomeTab). Public wire: DichVuPage/LienHePage/GioiThieuPage/Footer/Topbar/Navbar/CTABanner. **Quyết định:** public homepage KEEP as-is (Hero/QuickActions/WhyChooseUs/Testimonials/stats là bespoke hardcoded, không consume home CMS); Patient data admin-only (chưa render public). Spec cần ghi rõ nguồn dữ liệu nội dung tĩnh là `site_content` (DB) thay vì hardcode.

34. **KHỐI 3.6.3 (Admin — Tender tab DB-backed)** — Phase 90: `TenderTab` đọc `news` từ database (qua `useHospital`), status tự tính từ `tenderEndDate` (≤7 ngày còn lại → "Sắp mở", hết hạn → "Đã đóng", còn lại "Đang mở") thay vì status thủ công; `DEPT_META` map theo `tenderDept` (đồng bộ với bảng khoa); `HospitalContext.addNews/updateNews` + `seed.ts` thêm `tenderDept`.

**Bổ sung mới (Phase 91 — sau v3.0, chưa có trong v3.1):**

35. **KHỐI 4.x (JSON body size limit cho production)** — Phase 91: `server/app.ts` `express.json({ limit: "10mb" })` (tăng từ "1mb" lên "10mb”) để hỗ trợ các file lớn hơn trong upload/patient portal và APIs. Spec Security Headers cần ghi rõ body size limit.

36. **KHỐI 5.4 (News tender file)** — Phase 93: model `News` thêm cột `tenderFile Json? @map("tender_file")` (JSON `{name,size,url,fileType}`) — file hồ sơ thầu đính kèm. `news.service.ts` map `tenderFile` khi create/update (Prisma.JsonNull khi null). Migration `20260802041745_add_tender_file`. File PDF serve từ `public/tenders/<slug>/<filename>` (nginx static), URL `/tenders/...`. Công cụ nhập thầu web cũ: `scripts/migrate-legacy-tenders.mjs` (đọc Excel + copy file + upsert news, idempotent theo slug). Spec nên ghi rõ News lưu file thầu qua `tender_file` thay vì bảng riêng `tender_files`.

37. **KHỐI 5.4 (News tender image theo chủ đề)** — Phase 94: `news.image` cho bài thầu gán ảnh đại diện **theo chủ đề** (phân nhóm tiêu đề → 12 chủ đề: surgery/laboratory/medical-equipment/documents/medicine-vial/software-it/computer-office/camera-network/ppe/elevator/cleaning/transport/general). Tool `scripts/import-tender-images.ts` tải ảnh Wikimedia Commons (miễn phí, no key, `iiurlwidth=960`) về `public/images/tenders/<theme>.jpg` + **FALLBACK** dùng ảnh chuyên đề seed có sẵn khi Wikimedia rate-limit. **Lưu ý quan trọng:** ảnh mới thêm vào `public/images/*` **KHÔNG** tự xuất hiện ở `dist/` — phải `npm run build` (Vite copy `public/`→`dist/`) + `docker restart bvdh-frontend`, nếu không server serve `dist/` cũ sẽ fallback `text/html` SPA cho ảnh. Đã ghi `memory/bugs-fixed.md`. Spec nên ghi rõ nguồn ảnh thầu là file tĩnh trong `public/images/tenders/` và workflow build khi thêm ảnh.

**Kết luận:** Tuy các bản ghi trong dactaupdate.md có từ “hoàn thành” (✅) cho các mục security/OTP/flow logging, chúng **chưa thực sự hoàn thành** — memory.md Phase 81-86 đã xác nhận nhiều mục vẫn **chưa có code**, tương ứng với status “chưa implement” hoặc “chưa enforce code” trong bảng. Danh sách vẫn còn:
- Log PHI riêng (dataAccessed/purpose) cho `activity_logs`
- Ngăn chặn cleanup job cho `activity_logs`
- Message “đã mã hóa” khi tạo patient mới
- Forgot password flow (rate limit 3/giờ/user, token reset 30 phút, dùng 1 lần)
- Frontend validation đầy đủ cho password policy (8 ký tự + hoa + thường + số)
- Mass assignment protection cho admin routes
- RBAC enforce department-level ownership
- Middleware `authorizeDepartmentAccess` cho admin dashboard routes
- ✅ OTP flow, ✅ Refresh token rotation, ✅ CCCD encryption, ✅ Zod validation, ✅ Pagination thật, ✅ Health check + graceful shutdown, ✅ Per-form rate limit bucket, ✅ Audit logging middleware, ✅ RBAC enforce helpers
- ✅ Frontend lint (ChoBenhNhanPage.tsx, vite.config.ts, motion ease) - xác nhận PASSED
**Quy ước:**
- Đánh version v3.1
- Áp dụng nguyên tắc In-place Update: cập nhật đè trực tiếp vào đúng KHỐI liên quan (KHỐI 3-6), không nối đuôi chương mới.
- Ghi Changelog tóm tắt KHỐI 1.5: "v3.1 — OTP flow thay token minting, refresh rotation + reuse detection, CCCD encryption, Zod validation toàn bộ route, pagination thật, per-form rate limit bucket, health check + graceful shutdown, audit logging middleware, RBAC enforce helpers, activity_logs index + PHI audit fields, password hash clarification, rate limit matrix, logo thật, admin login redesign, specialty images, admin tabs mở rộng, CMS nội dung tĩnh site_content, Tender tab DB-backed, News.tender_file (file hồ sơ thầu), ảnh đại diện thầu theo chủ đề + workflow build public→dist khi thêm ảnh".
- Audit trail chi tiết: `memory/phase-history.md` Phase tương ứng.
