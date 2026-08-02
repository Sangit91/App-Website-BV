# Memory — BVĐK Website

> **Lịch sử chi tiết từng Phase:** `memory/phase-history.md`
> **Danh sách bug đã sửa:** `memory/bugs-fixed.md`

---

## 📌 Thông tin bệnh viện

**Tên đầy đủ:** Bệnh Viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam
**Địa chỉ:** 107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng

**Lãnh đạo:**
| Chức vụ | Họ tên |
|---------|--------|
| Giám đốc | BS CKII Nguyễn Thống Nhất |
| Phó Giám đốc | BSCK II Lê Minh Dũng |
| Phó Giám đốc | BS CKII Nguyễn Đình Hoàng |

---

## 🎯 Tầm nhìn kiến trúc

**Nguyên tắc:** Reusable First • Mobile First • Accessibility First • Maintainability First

**Technical:** TypeScript Strict • Zero Any Policy • Reusable Components • Feature Based Structure
**UI:** Design System thống nhất • Không hardcode màu/spacing/typography
**UX:** Tối giản thao tác • Dễ dùng với người lớn tuổi • Thông báo rõ ràng
**Accessibility:** Keyboard Friendly • Screen Reader Friendly • WCAG cơ bản

---

## 🏥 Hospital UX Standards

| Module | Required States |
|--------|----------------|
| Booking | Loading, Success, Error, Validation |
| Test Lookup | Loading, Empty, Error, Result |
| AI Advisor | Thinking, Response, Error |
| Patient Portal | Loading, Empty (chưa tra cứu), Empty (không tìm thấy), Error, Result |

---

## 📦 State Management

**Single Source of Truth:** HospitalContext là nguồn dữ liệu chính. Không tạo context mới nếu không thực sự cần thiết.

---

## 🏗️ Cấu trúc dự án hiện tại

```
src/
├── components/
│   ├── admin/tabs/       # 15 tabs (Overview, Bookings, Patients, Shifts, Specialties, Doctors, News, Organization, Logs, Services, PatientTab, Tender, Contact, Feedback, RecordRequests)
│   ├── layout/           # Navbar, Footer, Layout
│   ├── public/           # InfoCards, Modals (RecordRequest, Feedback, Map, DrugLookup, InpatientGuide, OutpatientGuide, Services), Organization, News, Doctors, Specialties
│   ├── booking/          # BookingForm, AIBanner
│   ├── test-lookup/      # TestLookup
│   └── ui/               # Button, Input, Select, Modal, Card, Badge, Spinner, ErrorBoundary, SectionCard, ItemCard, EditModal, ImageUploader, ToggleButton
├── context/              # HospitalContext, AdminContext
├── hooks/                # useReducedMotion, useToggleButton, useMediaQuery
│                         # AnimatedCounter, FloatingShape (shared animation components)
├── pages/                # HomePage, GioiThieuPage, ChuyenKhoaPage, DichVuPage, ChoBenhNhanPage, TinTucPage, ThongTinThauPage, SoDoToChucPage, LienHePage, AdminPage
├── types/                # models/ (patient, medical-record, clinical-test, treatment-history, news)
├── data/                 # Static data (departments, services, etc.)
└── lib/                  # Utilities

server/
├── routes/               # patient.routes, auth.routes, appointment.routes, service.routes, testimonial.routes
├── services/             # Business logic (booking, feedback, record-request, ai, auth, service, testimonial)
├── db/                   # prisma.ts (Prisma client singleton), database.ts (legacy + getGeminiClient)
├── middleware/            # auth.middleware.ts (authenticate, authorize, authorizeExact, authorizeDepartmentAccess + requireSuperAdmin/Admin/Doctor/Receptionist helpers)
└── generated/
    └── prisma/           # Generated Prisma Client (Prisma 7)

agents/                    # (Phase 79) 9 file tách từ AGENTS.md theo nhóm — AGENTS.md làm index
  - 01-getting-started.md, 02-architecture.md, 03-ui-design-system.md,
    04-components.md, 05-hospital-ux.md, 06-server-api.md,
    07-self-review.md, 08-memory-management.md, 09-ops.md
```

---

## 🚧 Backup gần nhất

- `D:\Coding\code backup\App Website BV_20260727_133642` (trước Phase 72 — đồng bộ layout "Cổng thông tin"). Backup sau Phase 74 chưa tạo (Phase 74 chỉ xoá 2 class thừa, không phải refactor lớn — không đủ ngưỡng backup policy).
- `D:\Coding\code backup\App Website BV_20260727_072435` (trước Phase 69 — fix lỗi 500 upload Record Request)
- `D:\Coding\code backup\App Website BV_20260719_160404` (sau Local Images Migration)
- **Lưu ý Wave A+B (Ph 81-84):** thay đổi security lớn (auth/PHI/CSP/CCCD encrypt) — nên tạo backup trước khi deploy production.

---

## ⚠️ Docker Dev Workflow — BẮT BUỘC NHỚ

**Vite HMR đang BẬT trong container** (`docker-compose.yml:16` set `DISABLE_HMR=false`, `vite.config.ts:18-19` theo đó set `hmr: { clientPort: 8443 }` + `watch: {}`).

### Nguyên nhân

Từ Phase 74: HMR từng bị tắt (`DISABLE_HMR=true`) → phải `docker restart bvdh-frontend` mỗi lần sửa code. **Phase 75 (2026-07-28)**: Bật lại HMR để dev auto-reload nhanh hơn. **Phase 89 (2026-08-01)**: Fix HMR thật sự hoạt động qua nginx — root cause là `clientPort: 3000` (cổng không public từ Phase 70) → browser cố kết nối `wss://localhost:3000` fail. Fix: `clientPort: 8443` (nginx public) + `server.ts` truyền `hmr: { server: httpServer }` để Vite WS gắn vào Express http server (8000) thay vì tự mở port riêng 24678. Verify: `check_ws.ps1` WS handshake qua nginx → `{"type":"connected"}`.

### Nguyên nhân

Từ Phase 74: HMR từng bị tắt (`DISABLE_HMR=true`) → phải `docker restart bvdh-frontend` mỗi lần sửa code. **Phase 75 (2026-07-28)**: Bật lại HMR để dev auto-reload nhanh hơn.

### Quy tắc hiện tại (HMR BẬT)

Mỗi lần sửa file `.tsx` / `.ts` / `.css` / `vite.config.ts`:
- **Lý tưởng:** KHÔNG cần restart container — Vite auto-transform và browser auto-reload qua WebSocket (HMR đã verify hoạt động qua nginx 8443 từ Phase 89). Chỉ cần save file → browser tự refresh.
- **Thực tế (HMR đôi khi silent fail):** Nếu user báo "code mới chưa có hiệu lực" dù HMR đang BẬT → **docker restart bvdh-frontend NGAY**, không debug sâu — đây là bước đầu tiên, không phải cuối cùng.
- **🔴 Recurring (Phase 88, 2026-08-01):** Agent 2 lần quên restart sau khi sửa `src/` (fix Specialties bar + swap Provider trong main.tsx) → browser serve code cũ, gây nhầm "fix không hiệu lực". **Luật BẮT BUỘC:** sau MỌI lần sửa file trong `src/` → verify HMR connect (xem browser console không còn `WebSocket connection failed`) hoặc `docker restart bvdh-frontend` + đợi healthy trước khi báo hoàn tất.

### Khi nào CẦN restart/rebuild

- Sửa file cấu hình Docker (`docker-compose.yml`, `Dockerfile.*`, `nginx/nginx.conf`) — phải `docker compose up -d --build` để rebuild image.
- Sửa file trong `prisma/` — phải chạy lại `prisma generate` + restart backend.
- Sửa file trong `server/` — `tsx watch` tự reload (không cần restart).

### Khi muốn tắt HMR (giống production)

```yaml
# docker-compose.yml:16
- DISABLE_HMR=true
```
Rồi `docker compose up -d --build public-web`. Nginx config (`nginx/nginx.conf:133`) đã proxy WebSocket đúng cho HMR.

### Triệu chứng nếu HMR bị tắt mà quên rule

- User báo "code mới không có hiệu lực" / "sửa rồi mà vẫn vậy".
- `docker exec bvdh-frontend grep <pattern> src/...` thấy fix **CÓ** trong container, nhưng `wget -qO- http://127.0.0.1:8000/src/...` trả về module transform cũ.
- → Đề xuất `docker restart bvdh-frontend` trước khi debug sâu.

---

## 🔍 Quality Gate

```bash
npm run lint && npm run build
```

---

## 🔐 Security & RBAC Standards — BẮT BUỘC

> Nguồn gốc: `dactaupdate.md:269-326` (Security Requirements + RBAC Matrix). Apply vào memory vì AGENTS.md chưa có section riêng.

### 1. JWT Tokens

- **Access Token**: 15-30 phút expiry (chứa `sub`, `role`, `scope`, `exp`)
- **Refresh Token**: 7 ngày, lưu **httpOnly cookie** (không truy cập được từ JS — chống XSS token theft)
- Refresh rotation: cấp refresh mới mỗi lần refresh, revoke refresh cũ

### 2. Password Security

- **Hiện tại dùng PBKDF2-SHA512, 100000 iterations** (`server/services/auth.service.ts:34`) — không phải bcrypt. PBKDF2 với 100k iterations tương đương bcrypt cost 12 về độ mạnh, chấp nhận được.
- **Nếu chuyển sang bcrypt** (theo `dactaupdate.md:277`): salt rounds = 12 (OWASP khuyến nghị 2024)
- Policy: tối thiểu 8 ký tự, có chữ hoa + chữ thường + số, không chứa username — **chưa enforce frontend validation đầy đủ**
- Forgot password: rate limit 3 request/giờ/user, token reset 30 phút, dùng 1 lần — **chưa implement**

### 3. Rate Limiting

| Endpoint | Limit | Áp dụng |
|----------|-------|---------|
| Public form POST (booking/feedback/record-request/consent/appointment) | **5 request/IP/15 phút per endpoint** | ✅ Phase 86: `server/middleware/rate-limit.middleware.ts` — mỗi form 1 bucket riêng (`bookingFormLimiter`, `feedbackFormLimiter`, `recordRequestFormLimiter`, `consentFormLimiter`, `appointmentFormLimiter`); lookup 30/15ph, AI 20/15ph, OTP verify 10/15ph |
| Admin Auth (login/refresh/OTP) | **5 request/phút** | Chưa enforce code |
| Login attempts | **5 lần → lockout 30 phút** | Chưa enforce code |
| Default public API khác | 100 request/phút | Chưa enforce code |

### 4. RBAC Roles

```typescript
type Role = 'Super Admin' | 'Receptionist' | 'Doctor' | 'Department Admin';
```

**Quy ước đặt tên DB:** lưu theo `snake_case` (`super_admin`/`receptionist`/`doctor`/`department_admin`), map sang `PascalCase` khi trả API response.

### 5. Audit Logging

- Mọi admin action đều log vào `activity_logs`: `userId`, `action`, `IP`, `timestamp`, `duration`
- **PHI access log riêng** với `dataAccessed: 'PHI'` + `patient_id` + `purpose` (theo Nghị định 13/2023)
- **KHÔNG được xoá/cleanup `activity_logs`** (compliance retention — AGENTS.md Data Retention Governance)

### 6. Security Headers (production)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY (admin), SAMEORIGIN (public)
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 7. Network Security (DMZ)

- PostgreSQL: internal-only (port 5432 không publish — đã đúng theo Port Policy Phase 70)
- Redis/MinIO (nếu thêm): internal-only từ port 8002+
- UFW whitelist: chỉ mở 8443 (HTTPS) + 22 (SSH nội bộ)
- Fail2ban chống brute-force SSH + admin login

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

### Trạng thái enforce hiện tại

| Mục | Code status | Ghi chú |
|-----|-------------|---------|
| Public form rate limit (5/IP/15ph) | ✅ Đã có | AGENTS.md Public Form API + Phase 49 |
| JWT access/refresh + httpOnly cookie | ✅ Phase 68+ | Admin Login redesign |
| Refresh token rotation + reuse detection + logout | ✅ Phase 82 | `bvdh_refresh` httpOnly cookie path `/api/v1/auth`, `jti` + in-memory store, revoke cũ khi rotate, replay bị 401 |
| Token minting (tạo access token chỉ bằng patientCode/phone) | ✅ Đã đóng | Phase 81 gỡ `/token/access` + `/token/refresh`, thay bằng OTP flow (`/otp/send` + `/otp/verify` → `readToken`) |
| PHI routes auth + consent | ✅ Phase 81 | 3 PHI routes gắn `requirePatientReadAccess + consentCheckMiddleware`; lookup mask qua `toPublicPatient` |
| Admin CRUD routes auth | ✅ Phase 81 | Org/appointment/feedback/consent/testimonial/service write routes gắn `authenticate` (+ `requireAdmin`/`requireSuperAdmin`) |
| Audit logging `activity_logs` | ✅ Phase 85 | `server/services/activity-log.service.ts` + `middleware/activity-log.middleware.ts` (`activityLogger` đo duration qua res.on finish); wire toàn bộ admin write routes + PHI routes (`dataAccessed: "PHI"` + patientId); schema thêm `durationMs`/`dataAccessed`/`patientId` + index createdAt/userId/patientId |
| RBAC enforcement backend | ✅ Phase 85 | Role-level: specialties/doctors/organization/service/testimonial write → `requireSuperAdmin`; news/feedback/record-request write → `requireAdmin` + `authorizeDepartmentAccess`; bookings GET + appointment `/search` → `requireAnyStaff` (thêm helper mới gồm Receptionist+Doctor). Verify: reception đọc bookings OK nhưng POST specialties 403 |
| Password hash | ✅ PBKDF2-SHA512 100k iterations | `server/services/auth.service.ts:34` + `seed.ts` chuẩn. Tương đương bcrypt cost 12. |
| Security headers | ✅ Qua nginx + helmet | Phase 83: nginx server-level CSP/Permissions-Policy/HSTS + bỏ CORS reflect-any; helmet CSP env-aware (dev lax / prod strict `script-src 'self'`). Có 2 CSP (nginx + helmet) cùng áp dụng — browser lấy intersection. |
| Rate limit admin auth/login lockout | ✅ Đã có | Phase 83: express-rate-limit 10 req/15ph trên `/auth/admin/*` + `/otp/*`; nginx `admin_auth` zone 50r/m. Lockout 30ph sau 5 lần chưa enforce (Phase 86). |
| Input validation (Zod) | ✅ Phase 86 | `server/validators/schemas.ts` + `middleware.ts` (validate helper, message tiếng Việt, phát hiện thiếu trường qua `getPathValue`); wire toàn bộ route public + admin write (booking/feedback/record-request/consent/appointment/ai/patient-lookup/otp/specialty/doctor/news/service/org/testimonial) |
| Pagination thật | ✅ Phase 86 | `server/utils/pagination.ts` (`getPagination`) — bookings/feedback/record-requests/doctors/news trả `X-Total-Count`; 3 route PHI trả `{data,total,page,pageSize}` giữ key `records/tests/histories` cho frontend |
| Health check DB + graceful shutdown | ✅ Phase 86 | `/api/health` check `SELECT 1` qua Prisma (503 degraded nếu DB lỗi); `server.ts` cleanup `uploads/temp` lúc khởi động + SIGTERM/SIGINT shutdown (`server.close` → `$disconnect` → exit 0, force 10s) + `unhandledRejection`/`uncaughtException` log; API 404 `{error:"API endpoint không tồn tại"}` trước SPA fallback; MulterError → 400 |
| CCCD encrypt | ✅ Đã có | Phase 84 (Wave B): AES-256-GCM (`cccd.service.ts`) + `cccdHash` SHA-256 unique + bỏ cột `cccd` plaintext; lookup match qua hash, encrypt roundtrip verify, mask `0012****90` |

---

## 📊 Trạng thái hiện tại

| Module | Status |
|--------|--------|
| Admin Panel (13 tabs + 2 pending) | ✅ Hoàn thành CRUD (Specialties, Doctors, Organization, News, Patients mask, Services, Patient Guide, Tender, Contact) |
| Patient Portal (HIS Integration) | ✅ Hoàn thành |
| Modern Animation Pattern (6 pages) | ✅ Hoàn thành |
| ScrollAnimation public components + reducedMotion (Phase 87, 2026-08-01): CTABanner/Doctors/QuickActions/Testimonials/WhyChooseUs/HomePage wrap ScrollAnimation; GioiThieuPage animate→whileInView | ✅ Hoàn thành |
| Wave D (Phase 88, 2026-08-01): admin mutations dùng useAuthedFetch (Bearer) — HospitalContext + FeedbackTab + RecordRequestsTab + OrganizationTab + ShiftsTab; lint GREEN lần đầu (Variants ease `as const`, ChoBenhNhanPage key, vite allowedHosts); JWT RFC 7519 (sub/iat/exp seconds); path traversal hardening (path.relative) | ✅ Hoàn thành |
| site_content CMS (Phase 90, 2026-08-01): bảng `site_content` (JSON key-value) làm nguồn chung nội dung tĩnh — backend (schema + migration `20260801080000_site_content` + service + routes GET/PUT + app.ts), `SiteContentContext` (getSection deepMerge + saveSection PUT), 5 data modules (`src/data/siteServices/siteContact/siteAbout/sitePatient/siteHome.ts`), 5 admin tabs DB-backed (Services/Contact/About/Patient/HomeTab), public wire: DichVuPage/LienHePage/GioiThieuPage/Footer/Topbar/Navbar/CTABanner. **Home public KEEP as-is** (homepage bespoke hardcoded, không consume home CMS); **seed skip** (deepMerge fallback OK). Patient data admin-only (chưa render public). tsc sạch + bvdh-frontend healthy | ✅ Hoàn thành |
| prefers-reduced-motion | ✅ Hoàn thành |
| Shared Animation Hooks | ✅ Hoàn thành |
| Organization Section in GioiThieuPage | ✅ Hoàn thành |
| Neon Border Expandable (SoDoToChucPage) | ✅ Hoàn thành |
| Scroll Position Fix on Navigation (Phase 44) | ✅ Hoàn thành |
| TinTucPage News Card Modal (Phase 45) | ✅ Hoàn thành |
| All Admin Tabs EditModal + ConfirmDialog (Phase 47) | ✅ Hoàn thành |
| PatientsTab BHYT/CCCD Masking (Phase 47) | ✅ Hoàn thành |
| feedback_requests + record_requests API + Modal integration (Phase 49) | ✅ Hoàn thành |
| FeedbackTab + RecordRequestsTab admin (Phase 49) | ✅ Hoàn thành |
| PostgreSQL + Prisma migration Phase 1 (22 tables, Prisma Client, services updated) | ✅ Hoàn thành (2026-07-23) |
| Docker Dev Environment (Option 1 architecture) | ✅ Hoàn thành (2026-07-23) |
| Consent Management (Phase 68 - NĐ 13/2023): ConsentPolicy + PatientConsent models, consent service/routes/middleware, PatientConsentModal, PHI protection | ✅ Hoàn thành (2026-07-26) |
| Fix lỗi 500 upload Record Request (Phase 69): Docker permission (uploads/temp chown node), backend_uploads volume, path inconsistency service (resolvePhysicalPath helper) | ✅ Hoàn thành (2026-07-27) |
| Port Policy (Phase 70): chỉ 8443 public ra host, frontend 8000 + backend 8001 + db 5432 chỉ expose nội bộ — tránh xung đột port 3000/5001 | ✅ Hoàn thành (2026-07-27) |
| Refactor UX RecordRequestModal (Phase 71): Header xanh tích hợp tiêu đề, X button góc phải, bỏ banner thừa, max-h-[90vh], file preview, validation real-time (SĐT/Email/ít nhất 1 kênh/ngày), accessibility đầy đủ | ✅ Hoàn thành (2026-07-27) |
| Đồng bộ layout "Cổng thông tin" với "Hướng dẫn tiện ích" (Phase 72): InfoCard ảnh aspect-[16/9] thay h-48, grid md:grid-cols-3 gap-6, xóa featured block trùng lặp với PatientLookupForm, xóa handleTraCuuBenhSu (52 dòng) | ✅ Hoàn thành (2026-07-27) |
| Spec supplement v2.14 (Phase 73): patch bảng port mục 22.1 spec v2.13 lệch với code thực tế (Frontend 8000/Backend 8001/8443 public active, không phải 5001/8301 "chưa hoạt động") — tạo `dac-ta-v2.14-supplement.md`, chưa merge vào docx | ✅ Hoàn thành (2026-07-27) |
| Fix RecordRequestModal duplicate scrollbar (Phase 74): Modal wrapper đã có `max-h-[92vh] flex flex-col overflow-hidden` + body `p-6 overflow-y-auto`, RecordRequestModal tự bọc thêm `flex flex-col max-h-[90vh]` + `overflow-y-auto` → 2 scrollbar chồng nhau. Bỏ wrapper thừa, dùng fragment `<>`, giữ pattern giống FeedbackModal. tsc pass (zero lỗi mới), spec UI/UX không đổi | ✅ Hoàn thành (2026-07-27) |
| Migration spec v3.0 SRS-TRD (Phase 75): user cung cấp `Dac-ta-Master-v3.0-SRS-TRD.docx` (27/07/2026) thay thế v2.13 docx + patch v2.14 supplement. Refactor toàn diện 6 KHỐI độc lập + nguyên tắc In-place Update (đè đúng KHỐI, không append-only). AGENTS.md + dactaupdate.md cập nhật tham chiếu v3.0. Xoá `dac-ta-uiux-tong-hop-v2.14.docx`. Verify cross-check v3.0 vs Prisma schema + code: 95% khớp, 7 gap minor ghi vào dactaupdate v3.1 (KHỐI 4-6) | ✅ Hoàn thành (2026-07-27) |
| Record Request File Preview trong Admin (Phase 77): backend `GET /api/v1/record-requests/:id/files/:fileId` (authenticate + requireAdmin, chống path traversal bằng `resolveSafePhysicalPath` whitelist uploads/pending + uploads/approved); frontend RecordRequestsTab grid thumbnail + button "Xem"/"Mở PDF"/"Tải", fetch qua `authedFetch` đính Bearer token, preview blob URL với cleanup khi đóng modal | ✅ Hoàn thành (2026-07-28) |
| Redesign UX Modal chi tiết Yêu cầu trích sao (Phase 78): header gradient `from-green-dark via-green-900 to-brand-green` + status badge lớn; body grid `lg:grid-cols-12` (trái 5 cols: glass card "Thông tin đối tượng" + "Đặc tả hồ sơ đề nghị"; phải 7 cols: Visual Progress Timeline 3 bước + File grid + Phản hồi & Xử lý); thumbnail có `hover:-translate-y-1` + overlay `ZoomIn`; modal preview riêng (`bg-zinc-900`, `<img>` cho ảnh / `<iframe>` cho PDF) dùng lại `previewUrls` cache | ✅ Hoàn thành (2026-07-28) |
| AGENTS.md split + RBAC scaffold + service/testimonial routes (Phase 79): AGENTS.md tách thành 9 file theo nhóm trong `agents/` + AGENTS.md làm index (33758→3437 bytes, giảm 90%). Fix lệch Docker Dev Workflow trong AGENTS.md (HMR đang BẬT, Phase 75) trước khi tách. Verify 6 file RBAC scaffold mới (`server/middleware/auth.middleware.ts`, `server/services/auth.service.ts`, `server/services/service.service.ts`, `server/services/testimonial.service.ts`, `server/routes/service.routes.ts`, `server/routes/testimonial.routes.ts`) khớp memory.md Security & RBAC Standards. RBAC scaffold sẵn sàng, route admin hiện có chưa tất cả gắn middleware — Phase kế tiếp cần audit toàn bộ route admin | ✅ Hoàn thành (2026-07-29) |
| Cơ chế thời gian chính xác cho thầu + TenderFormModal (Phase 80): `tender_start_date`/`tender_end_date` đổi `@db.Date` → `@db.Timestamp(3)` (giữ giờ); seed 12 thầu + 11 ảnh Pexels `public/images/tenders/`; `NewsItem` thêm `publishedAt` ISO; admin form 3 ô datetime-local (Ngày đăng/Mở/Khóa) — không ép ngày tạo, fallback ngày tạo chỉ khi mốc bỏ trống; TenderTab dùng `TenderFormModal` chuyên dụng (header gradient + 3 phân vùng); fix `newsLoadedFromApi` flag + khôi phục `contactName` trong `NewsUpdateInput`; fix thiếu import `DollarSign` | ✅ Hoàn thành (2026-07-31) |
| Production Audit + plan 6 waves (2026-07-31): audit 4 bề mặt (backend/security, Docker/nginx/ops, frontend, DB/tests) → `plan-production.md` — score 45/100 BLOCKED, 15 blockers P1-P15. Kế hoạch: Wave A (Ph 81-83 security), Wave B (Ph 84-85 data), Wave C (Ph 86 API), Wave D (Ph 87-88 frontend), Wave E (Ph 89-90 ops), Wave F (Ph 91 tests) | ✅ plan đã viết |
| Đóng token minting + PHI routes auth (Phase 81): gỡ `/token/access` + `/token/refresh` (không frontend dùng), thay bằng OTP flow — `server/services/otp.service.ts` (OTP session store, MAX_OTP_ATTEMPTS=5, TTL 5min, issueReadToken/verifyReadToken) + `/otp/send` (dev trả `devOtp`) + `/otp/verify` (trả `readToken`). Tạo `server/middleware/patient-access.middleware.ts` (`requirePatientReadAccess`: readToken OTP hoặc JWT admin, verify patientId khớp). 3 PHI routes gắn `requirePatientReadAccess + consentCheckMiddleware`; `/lookup` mask qua `toPublicPatient` (không lộ cccd/address). Org write routes + appointment `/search` + feedback GET `/:id` + consent `/check` gắn auth | ✅ Hoàn thành (2026-07-31) |
| Session hardening + fail-fast secrets (Phase 82): refresh token có `jti` + in-memory store trong `auth.service.ts` (rotation: revoke cũ + cấp mới, reuse detection → revokeAllForUser). Cookie `bvdh_refresh` httpOnly + secure=IS_PROD + sameSite lax + path `/api/v1/auth`. Thêm `/admin/logout`. `CONSENT_SECRET` fail-fast (throw khi thiếu + production). `seed.ts` PBKDF2 chuẩn + `ADMIN_DEFAULT_PASSWORD` env (fallback "Admin@123") + ON CONFLICT DO NOTHING | ✅ Hoàn thành (2026-07-31) |
| Edge hardening + CSP (Phase 83): cài `cookie-parser`; `app.ts` trust proxy + helmet CSP env-aware (dev: unsafe-inline/eval + ws://localhost:3000; prod: strict `script-src 'self'`). nginx: bỏ CORS reflect-any, thêm CSP/Permissions-Policy/client_max_body_size 25m server-level. `package.json` build → `dist-server/server.cjs` + start → `node dist-server/server.cjs`; `server.ts` static options; `.dockerignore` thêm dist-server/env. LƯU Ý OPS: frontend container chạy `server.ts` nên mọi edit app.ts cũng cần restart/rebuild bvdh-frontend | ✅ Hoàn thành (2026-07-31) |
| CCCD encryption + migration drift fix (Phase 84): schema Patient bỏ cột `cccd` plaintext → thêm `cccdHash String? @unique` + `cccdEncrypted`; tạo `server/services/cccd.service.ts` (AES-256-GCM encrypt/decrypt `iv.tag.data` base64, hashCccd SHA-256 + maskCccd `0012****90`). Migration `20260731110412_cccd_hash` applied; `appointment.service` + `patient.service` lookup match qua hash; `toPublicPatient` fix (fullName/registeredAt); `seed.ts` insert patients dùng hash/encrypt (raw SQL). Drift migration `20260731110047_fix_drift` (tender dates Timestamp(3), policy_version nullable, tender_dept) — shadow DB config trong `prisma.config.ts` + docker-compose mount. Soft-delete middleware mở rộng findUnique/update/delete. `$transaction` cho consent.createPolicy + record-request.processStatusChange. `.env.example` đầy đủ biến. Verify: tsc pass, lookup BN-001 qua cccd 001234567890 trả patient, encrypt/decrypt roundtrip OK, DB hash khớp `9e7636...` | ✅ Hoàn thành (2026-07-31) |
| Audit logging + RBAC + indexes (Phase 85): `activity_logs` mở rộng `durationMs`/`dataAccessed`/`patientId` + index createdAt/userId/patientId (migration `20260731123000_activity_logs_enrichment`); tạo `activity-log.service.ts` + `activity-log.middleware.ts` (activityLogger đo duration qua `res.on("finish")`) wire toàn bộ admin write routes (SPECIALTY/DOCTOR/NEWS/SERVICE/TESTIMONIAL/FEEDBACK/RECORD_REQUEST/ORG actions) + 3 PHI routes (`PHI_READ_*` + `dataAccessed:"PHI"` + patientId). RBAC: specialties/doctors/organization/service/testimonial write → `requireSuperAdmin`; news/feedback/record-request write → `requireAdmin` + `authorizeDepartmentAccess`; bookings GET + appointment `/search` → `requireAnyStaff` (helper mới gồm Receptionist+Doctor). Index `patients.phone` + `appointments.phone`. Verify: tsc pass, admin tạo specialty → log `SPECIALTY_CREATE` có userId+duration+ip, PHI read → log `PHI_READ_MEDICAL_RECORDS` dataAccessed=PHI, reception đọc bookings OK nhưng POST specialties 403 | ✅ Hoàn thành (2026-07-31) |
| API hardening (Phase 86 Wave C): Zod validation + rate limit per-form + pagination thật + health check DB + graceful shutdown. Cài `zod@^4.4.3`; tạo `server/validators/schemas.ts` (full schemas tiếng Việt) + `server/validators/middleware.ts` (`validate` — detect thiếu trường qua `getPathValue` vì Zod v4 không expose `received`) wire toàn bộ route public + admin write; `server/middleware/rate-limit.middleware.ts` (mỗi form 1 bucket riêng `bookingFormLimiter`/`feedbackFormLimiter`/`recordRequestFormLimiter`/`consentFormLimiter`/`appointmentFormLimiter` 5 req/IP/15ph theo `agents/06-server-api.md`, `lookupLimiter` 30/15ph, `aiLimiter` 20/15ph, `otpVerifyLimiter` 10/15ph — form này không chặn form kia); `server/utils/pagination.ts` (`getPagination` page/limit/skip) — bookings/feedback/record-requests/doctors/news trả `X-Total-Count` giữ shape mảng (frontend không break), 3 route PHI trả `{data,total,page,pageSize}` giữ key `records/tests/histories`; `/api/health` check `SELECT 1` qua Prisma (503 degraded nếu DB lỗi); `server.ts` cleanup `uploads/temp` lúc khởi động + SIGTERM/SIGINT graceful shutdown (close→$disconnect→exit 0, force 10s) + unhandledRejection/uncaughtException; `app.use("/api", notFoundHandler)` → 404 JSON `API endpoint không tồn tại` trước SPA fallback; MulterError → 400; xóa dead code `validateInput`/`validateSubmitInput`. Verify E2E đầy đủ qua `https://localhost:8443`: booking valid 201 / invalid phone 400 tiếng Việt / missing field 400 "Thiếu thông tin bắt buộc"; feedback rating+contact validate; record-request date_to<date_from 400; specialty create 201 + missing/bad type 400; feedback PATCH bad status 400; AI empty message 400; OTP verify 400; patient lookup 400/404; check-patient 200 + bad cccd 400; cancel 200; pagination X-Total-Count (news 7, doctors 4, feedback 3); API 404 JSON; SPA fallback HTML; rate limit burst → 429 đúng bucket + form khác không bị chặn chéo | ✅ Hoàn thành (2026-07-31) |
| Spec v2.9 review + Database gap analysis | ✅ Hoàn thành (2026-07-22) || dactaupdate.md updated with DB gaps | ✅ Hoàn thành |
| Expert System Review Report (report-review.md) | ✅ Hoàn thành |
| AGENTS.md updated with v2.10 spec (Public Form API, DB Layer rules, Data Retention, ENUM-Badge sync) | ✅ Hoàn thành |
| Admin Login Single-Canvas Redesign (2026-07-26): Single-Canvas dark theme, Glassmorphism card, DB-backed auth với JWT, spotlight mouse tracking, shake animation, scope selector với layoutId | ✅ Hoàn thành |
| Admin Login Ultra-Luxury (2026-07-26): Pearl-Glass Glassmorphism 2.0, Volumetric Ambient Light Orbs, Shimmer CTA, prefers-reducedMotion support | ✅ Hoàn thành |
| Admin Login Cinematic Background (2026-07-26): Doctor image bg, Floating Glass Badges (50+ Bác sĩ, ATTT Cấp độ 3), neon pulse animations | ✅ Hoàn thành |

**Admin Tabs hiện tại (15 tabs) + RBAC theo role:**

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

Nguồn: `dactaupdate.md:158-176`. Ma trận này chưa có enforcement code ở backend — chỉ là target UI/UX. Cần Phase tiếp: implement RBAC middleware enforce theo role + department ownership.

---

## 🔎 Audit tổng thể (2026-07-30) — phát hiện qua code review

> **Nguồn gốc:** Rà soát toàn bộ project (frontend `src/` + backend `server/`) sau Phase refresh token.
> **Chi tiết từng issue:** xem kết quả review trong session log (grep "CRITICAL\|HIGH\|MEDIUM\|LOW").
> **Cập nhật tiến triển:** mỗi lần xử lý xong 1 vấn đề, quay lại đây đánh dấu ✅.

### 🔴 CRITICAL — cần xử lý gấp

| # | Vấn đề | File | Trạng thái |
|---|--------|------|------------|
| C1 | Endpoint debug `/api/debug-update` không auth — ai cũng sửa được `feedbackRequest.status` | `server/app.ts:25-37` | ✅ Đã xoá |
| C2 | Hầu hết admin CRUD routes không auth — doctors, news, specialties, feedback, record-requests, appointments, patients — ai cũng POST/PUT/DELETE được | Toàn bộ `server/routes/*.routes.ts` | ✅ Đã gắn authenticate + requireAdmin |
| C3 | File upload không auth — `/record-requests/:id/files` | `record-requests.routes.ts:53-63` | ✅ Đã gắn authenticate + requireAdmin |
| C4 | Error handler middleware chưa register — lỗi không catch sẽ crash server + leak stack trace | `server/app.ts` | ✅ Đã import + register |
| C5 | Không rate limiting trên login/OTP — brute-force dễ dàng | `auth.routes.ts` | ✅ Đã thêm rate limit 10 req/15ph |
| C6 | Unhandled promise rejection trong consent middleware | `consent.middleware.ts:51-67` | ✅ Đã chuyển sang async/await |
| C7 | JWT secret fallback cứng — nếu thiếu `.env` vẫn chạy, ai đọc source cũng forge token được | `auth.service.ts:4-5` | ✅ Crash hard nếu thiếu trong production |
| C9 | ErrorBoundary có nhưng không dùng — component throw error → crash trắng trang | `src/components/ui/ErrorBoundary.tsx` | ✅ Đã wrap App.tsx |

### 🟠 HIGH

| # | Vấn đề | File | Trạng thái |
|---|--------|------|------------|
| H1 | Không input validation (Zod/Joi) — request body dùng raw từ client | Toàn bộ routes | ✅ Phase 86: `server/validators/schemas.ts` + `middleware.ts`, wire toàn bộ route public + admin write |
| H2 | Không Prisma transaction — multi-step operation dễ mất đồng bộ (upload file + DB insert, xoá policy cũ + tạo mới...) | `server/services/*.ts` | ✅ Phase 84: `consent.service.createPolicy` + `record-request.processStatusChange` bọc `$transaction` |
| H3 | Không pagination API — list endpoint sẽ trả hàng ngàn records | `booking/feedback/news/doctor.service.ts` | ✅ Phase 86: `getPagination` + `X-Total-Count` trên bookings/feedback/record-requests/doctors/news + 3 route PHI trả `{data,total,page,pageSize}` |
| H4 | Custom JWT — không theo RFC 7519 (thiếu `iat`, `exp` sai format) | `auth.service.ts:43-56` | ✅ Phase 88: `sub`/`iat`/`exp` NumericDate seconds; `isExpired` chấp nhận ms cũ + seconds mới |
| H5 | Không helmet/CORS — thiếu security headers, CORS mở trắng | `server/app.ts` | ✅ Phase 83: helmet CSP env-aware + CORS chỉ allow `CORS_ORIGIN` (mặc định localhost:3000), nginx bỏ reflect-any |
| H6 | Path traversal protection cần hardening — `resolveSafePhysicalPath` có thể bypass | `record-request.service.ts:46-55` | ✅ Phase 88: dùng `path.relative` + `isInside` thay `startsWith`, chặn null byte/empty |
| H7 | In-memory login attempt tracker — mất khi restart server, không scale được | `auth.service.ts:17` | ❌ Wave E (ops): persist DB |
| H8 | **~30+ `any` types** trong frontend — `Record<string, any>` khắp admin tabs | `HospitalContext.tsx`, `PatientTab.tsx`, `HomeTab/index.tsx`, các admin tabs | ⚠️ Giảm còn ~6 (HospitalContext:186, lib/env.ts:19,28, ContactTab:57, RecordRequestsTab:119, ShiftsTab:59) — Wave F |
| H9 | **~36 unused lucide-react icons** — import nhưng không dùng trong JSX | `Navbar.tsx`, `TenderTab.tsx`, `BookingsTab.tsx`, nhiều file | ⚠️ Giảm còn ~28 ở 15 file — Wave F |
| H10 | **`console.log` trong production** — leak OTP/token qua log | `auth.routes.ts:94,149,204`, `reset-admin-password.ts:25` | ✅ Đã sạch (auth.routes không còn log OTP; reset-admin-password in message không mật khẩu; `src/` 0 console.log) |

### 🟡 MEDIUM

| # | Vấn đề | File | Trạng thái |
|---|--------|------|------------|
| M1 | `key={idx}` thay vì unique ID — ~20 files bị ảnh hưởng | Nhiều files | ⚠️ Literal `key={idx}` = 0; còn index-key biến thể (`key={cidx}`/`key={lidx}`/`key={item.id\|\|idx}`...) ~14 dòng/7 files — Wave F |
| M2 | `useEffect` missing dependencies — `fetchRequests`/`fetchFeedbacks` không trong deps | `FeedbackTab.tsx`, `RecordRequestsTab.tsx` | ✅ Phase 88: RecordRequestsTab deps `accessToken`→`authedFetch`; FeedbackTab fn đã trong effect |
| M3 | `window.location.reload()` trong `ShiftsTab.tsx` — hard reload | `ShiftsTab.tsx:71` | ✅ Đã sạch (chỉ còn ErrorBoundary reload hợp lệ) |
| M4 | Thiếu cascade delete trong Prisma schema | `prisma/schema.prisma` | ❌ |
| M5 | Mass assignment — `...data` spread cho phép ghi field tuỳ ý vào DB | `news/specialty/service.service.ts` | ❌ |
| M6 | Version API không đồng nhất — `/api/booking` vs `/api/v1/auth` | `server/app.ts:39-52` | ❌ |
| M7 | Consent middleware defined nhưng không wire vào route nào | `consent.middleware.ts` | ❌ |
| M8 | Response format không đồng nhất — `{success, data}` vs `{error}` | Toàn bộ routes | ❌ |
| M9 | Soft delete không enforce — cần Prisma middleware filter `deletedAt: null` | `prisma/schema.prisma` | ✅ Phase 84: `server/db/prisma.ts` middleware filter `deletedAt: null` cho Patient/AdminUser — mở rộng cả `findUnique`/`update`/`delete`/`updateMany`/`deleteMany` |
| M10 | JSON body size limit không set — dễ bị DoS payload lớn | `server/app.ts:19` | ❌ |
| M11 | `console.log` silent sync error thay vì `console.error` | `HospitalContext.tsx:652` | ✅ Đã dùng `console.error` — `src/` 0 console.log |
| M12 | Prop drilling — `PatientPortalSection.tsx` nhận 9 props | `PatientPortalSection.tsx` | ✅ Giảm còn 3 props (`onOpenRecordRequest`/`onOpenFeedback`/`error`) |
| M13 | Tên component gây nhầm — `PatientTab.tsx` (admin guide) vs `PatientsTab.tsx` (patient records) | `admin/tabs/` | ✅ Phase 88: export `PatientGuideTab` từ `PatientTab.tsx` (file cũ), dùng ở tabs/index + AdminPage |

### 🟢 LOW

| # | Vấn đề | File | Trạng thái |
|---|--------|------|------------|
| L1 | Orphaned temp files khi DB insert fail trong upload | `record-request.service.ts:143-155` | ❌ |
| L2 | Doctor schedule validation thiếu — day value không check | `doctor.service.ts:74-86` | ❌ |
| L3 | Organization dùng in-memory store thay vì Prisma | `organization.routes.ts` vs `prisma/schema.prisma` | ❌ |
| L4 | Non-optional foreign key policyVersion có thể gây constraint violation | `prisma/schema.prisma:551` | ❌ |
| L5 | Dead type definitions trong `database.ts` (không dùng nữa) | `server/db/database.ts` | ❌ |
| L6 | `Hash` icon import semantic không rõ ràng | `RecordRequestsTab.tsx:L7` | ❌ |

---

## 🚧 Pending Tasks

### Phase 49 (Hoàn thành)
1. ✅ Implement feedback_requests + record_requests API
2. ✅ Kết nối FeedbackModal + RecordRequestModal → API
3. ✅ Tạo FeedbackTab + RecordRequestsTab trong admin

### Phase 50 (Hoàn thành)
- ✅ PostgreSQL database `bvdh_db` đã tạo trên localhost:5432
- ✅ Prisma schema với 19 tables (admin_users, patients, appointments, doctors, doctor_schedules, specialties, news, organization_units, feedback_requests, record_requests, record_request_files, notification_logs, service_groups, services, news_categories, price_list, testimonials, contact_messages, activity_logs, medical_records, clinical_tests, treatment_history)
- ✅ Migration applied: `20260723012247_init`
- ✅ Prisma Client generated tại `server/generated/prisma/`
- ✅ booking.service.ts → Prisma (async)
- ✅ feedback.service.ts → Prisma (async)
- ✅ record-request.service.ts → Prisma (async)
- ⚠️ Note: Prisma 7 ESM/CJS warning (non-blocking, dev mode OK với tsx)

### Phase 51 (1-2 tuần) - ✅ Hoàn thành (2026-07-23)
- Security hardening (JWT, 2FA, rate limiting) - Pending
- Migrate HospitalContext localStorage data → PostgreSQL:
  - ✅ New API routes: `/api/v1/specialties`, `/api/v1/doctors`, `/api/v1/news`
  - ✅ Services: specialty.service.ts, doctor.service.ts, news.service.ts (fixed any types)
  - ✅ HospitalContext sync: doctors, specialties, news (add/update/delete → API)
  - ✅ Load-from-API-on-mount: specialties, doctors, news fetched from PostgreSQL on app init
  - ✅ DB image paths updated to local storage: `/images/doctors/*.jpg`, `/images/news/*.jpg`
  - ✅ External Pexels images downloaded to `public/images/` for local serving
  - ⚠️ Bookings, patients, schedules, logs vẫn dùng localStorage (chưa migrate sang PostgreSQL)

### Phase 91 (Post-production — Production-Ready) - ✅ Hoàn thành (2026-08-01)

- ✅ **Fix JSON body size limit** — `server/app.ts:53` tăng từ "1mb" lên "10mb"
- ✅ **Fix frontend lint** — `ChoBenhNhanPage.tsx`, `vite.config.ts`, `motion ease` đã pass, dự án production-ready
- ✅ **Sản xuất Phase 90** — site_content CMS, Tender tab DB-backed hoàn thành, spec v3.1 cập nhật
- ✅ **Backend bảo mật** — tất cả Wave A-D hoàn thành (OTP, Refresh token rotation, CCCD encryption, Zod validation, Pagination, Health check)

### Phase 91 (Testing Infrastructure) - 🟢 Hoàn thành một phần (2026-08-01)

- ✅ **Plan TDD Testing** — Comprehensive testing plan với 6 phases, priority order: Security → Booking → Admin → Integration → E2E
- ✅ **Setup + Security + Core Business (unit)** — Jest/ts-jest cấu hình đúng cho project ESM (`jest.config.cjs` + `tsconfig.test.json`); 51 unit tests PASS (5 suites):
  - `test:auth` (29 tests) — PBKDF2 hash/verify, adminLogin (success/sai/không tồn tại/disabled), JWT RFC 7519 (verify/fake/expired), refresh rotation + reuse detection, OTP flow (verify/429-sau-5-lần/issue+verifyReadToken/404), CCCD AES-256-GCM roundtrip + hash deterministic + mask
  - `test:unit` (51 tests) — thêm validators zod (booking/feedback/record-request patient lookup/appointment) + pagination
- ✅ **E2E Playwright (13 tests PASS)** — cài `@playwright/test`, `playwright.config.ts` baseURL đúng `https://localhost:8443` (nginx) + `ignoreHTTPSErrors` (self-signed) + channel chrome. Spec: admin-login (3), booking (3 gồm đặt lịch hợp lệ → phiếu thành công), doctors (2), homepage (3), specialties (2). `npm run test:e2e` full suite.
- ✅ **E2E Playwright (13 tests PASS)** — cài `@playwright/test`, `playwright.config.ts` baseURL đúng `https://localhost:8443` (nginx) + `ignoreHTTPSErrors` (self-signed) + channel chrome. Spec: admin-login (3), booking (3 gồm đặt lịch hợp lệ → phiếu thành công), doctors (2), homepage (3), specialties (2). `npm run test:e2e` full suite.
- ⏳ **Integration API contract (supertest)** — chưa làm riêng; E2E đã gọi API thật qua nginx (admin login, booking 201). Có thể bổ sung sau bằng supertest + mock Prisma.

### Phase 93 (Legacy tender migration) - ✅ Hoàn thành (2026-08-02)

- **Migration thầu web cũ → hệ thống hiện tại**: đọc `Data Migration/thongtinthau.xlsx` (455 records) + file PDF `Data Migration/upload/...` → thêm `TenderFile` JSONB + copy file vào `public/tenders/<slug>/<filename>`, upsert bảng `news` 455 thầu. Công cụ tái sử dụng: `scripts/migrate-legacy-tenders.mjs` (idempotent theo slug).
- Map phòng: CNTT→`PHÒNG CNTT`, VTYT/TBYT→`PHÒNG VTTBYT`, Dược→`DƯỢC`, "Phòng HCQT"→`PHÒNG HCQT`. Hạn chót thiếu → lấy ngày đăng (`ngay_gio_hien_thi_web`).
- Nơi lưu file: `public/tenders/<slug>/<filename>`, URL `/tenders/...`, nginx serve static trực tiếp từ `public`.
- Schema: `news.tender_file Json?` (migration `20260802041745_add_tender_file`). `news.service.ts` map `tenderFile` (Prisma.JsonNull khi null). Frontend `HospitalContext` đã có `tenderFile: n.tenderFile`.
- Verify: 455 filtered tạo mới + 4 seed cũ = 459 trên `/api/v1/news/tenders`, 455 có `tenderFile`, PDF serve 200 qua nginx. Chạy lại 455 skip-existing (idempotent).
- Chính sách git: gitignore `Data Migration/` + `public/tenders/` (dữ liệu lớn, không commit). Commit code (schema/service/tool/migration/.gitignore/package.json).
- **Lưu ý khi chạy lại:** cần `npm i --no-save xlsx` trong container frontend + `DATABASE_URL=db:5432`; sau khi generate Prisma cần `docker restart bvdh-backend` để client reload cột mới.
- **Quality gate verified:** `npm run lint` = 0 lỗi, `npm run build` = pass, Docker 4 services healthy → hệ thống đã dat cơ bản production-ready

### Phase 52 (2-3 tháng)
- HIS integration thật
- Advanced features (queue_tickets, prescription_refill, insurance_verification)

---
- ✅ Zod validation toàn bộ route public + admin write
- ✅ Rate limit per-endpoint: form 5/IP/15ph, lookup 30/15ph, AI 20/15ph, OTP verify 10/15ph
- ✅ Pagination thật (X-Total-Count + page/limit/skip)
- ✅ `/api/health` DB check + graceful shutdown + orphan cleanup + unhandled rejection
- ⚠️ Chưa làm: lint frontend đỏ (pre-existing: ChoBenhNhanPage.tsx, vite.config.ts, motion ease), lockout 30ph sau 5 lần login sai, forgot password flow

### Phase 52 (2-3 tháng)
- HIS integration thật
- Advanced features (queue_tickets, prescription_refill, insurance_verification)

---

## 📌 Ghi chú quan trọng

1. **Navbar link "Sơ đồ tổ chức"** → `/gioi-thieu#so-do-to-chuc` (đã update)
2. **Navbar active state** (Phase 92): dùng `useLocation` map pathname → active nav item theo trang đang xem (`/giới-thiệu`→Giới thiệu...), scroll detection chỉ phụ trợ trang chủ.
3. **Phase numbering** đã được chuẩn hóa trong `memory/phase-history.md` — không còn trùng số
4. **prefers-reduced-motion** tự động disable: floating, parallax, 3D tilt, Ken Burns, bounce
7. **Spec v2.9** đã chính thức hoá feedback_requests + record_requests (mục 21.2–21.4)
9. **AGENTS.md** da update 5 section: Public Form API Standards, Database Layer rules, Data Retention Governance, ENUM-Badge sync, Memory Safety Rules
10. **Memory Safety Rules** bo sung (Outdated Memory Pollution, PHI Zero-Tolerance, Single Source Alignment) - ngan 3 rui ro tu Multi-Agent Architecture doc
11. **Fix admin login** (2026-07-26): server.ts use `process.env.PORT` (was hardcoded 5001), Docker admin user seeded, nginx regex path fixed, HTTPS setup on port 8443 with self-signed cert
12. **AdminLogin Single-Canvas Redesign**: 
    - Single-Canvas full-bleed dark theme (#08140E) với ambient glow effects
    - Centered Glass Login Card (bg-white/95 backdrop-blur-xl, rounded-28px)
    - Scope Selector với sliding motion pill (Framer Motion layoutId)
    - Spotlight halo di chuyển theo chuột
    - Shake animation khi đăng nhập lỗi
    - DB-backed auth: POST `/api/v1/auth/admin/login`, JWT decode để lấy user info
    - AdminContext updated: `login(user, token)` thay vì `login(role, name, department)`
    - Token stored in localStorage (rememberMe) hoặc sessionStorage

---

## 🚀 Commands

```bash
npm run dev      # Development
npm run build    # Production build
npm run lint     # Lint check
npm run clean    # Clean build
```

---

## 🔄 Rollback

```bash
git reset --hard <commit-hash>
```

Hoặc restore từ thư mục backup gần nhất.