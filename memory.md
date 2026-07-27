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
├── routes/               # patient.routes, auth.routes, appointment.routes
├── services/             # Business logic (booking, feedback, record-request, ai)
├── db/                   # prisma.ts (Prisma client singleton), database.ts (legacy + getGeminiClient)
├── middleware/            # Auth middleware
└── generated/
    └── prisma/           # Generated Prisma Client (Prisma 7)
```

---

## 🚧 Backup gần nhất

- `D:\Coding\code backup\App Website BV_20260727_133642` (trước Phase 72 — đồng bộ layout "Cổng thông tin")
- `D:\Coding\code backup\App Website BV_20260727_072435` (trước Phase 69 — fix lỗi 500 upload Record Request)
- `D:\Coding\code backup\App Website BV_20260719_160404` (sau Local Images Migration)

---

## 🔍 Quality Gate

```bash
npm run lint && npm run build
```

---

## 📊 Trạng thái hiện tại

| Module | Status |
|--------|--------|
| Admin Panel (13 tabs + 2 pending) | ✅ Hoàn thành CRUD (Specialties, Doctors, Organization, News, Patients mask, Services, Patient Guide, Tender, Contact) |
| Patient Portal (HIS Integration) | ✅ Hoàn thành |
| Modern Animation Pattern (6 pages) | ✅ Hoàn thành |
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
| Spec v2.9 review + Database gap analysis | ✅ Hoàn thành (2026-07-22) |
| dactaupdate.md updated with DB gaps | ✅ Hoàn thành |
| Expert System Review Report (report-review.md) | ✅ Hoàn thành |
| AGENTS.md updated with v2.10 spec (Public Form API, DB Layer rules, Data Retention, ENUM-Badge sync) | ✅ Hoàn thành |
| Admin Login Single-Canvas Redesign (2026-07-26): Single-Canvas dark theme, Glassmorphism card, DB-backed auth với JWT, spotlight mouse tracking, shake animation, scope selector với layoutId | ✅ Hoàn thành |
| Admin Login Ultra-Luxury (2026-07-26): Pearl-Glass Glassmorphism 2.0, Volumetric Ambient Light Orbs, Shimmer CTA, prefers-reducedMotion support | ✅ Hoàn thành |
| Admin Login Cinematic Background (2026-07-26): Doctor image bg, Floating Glass Badges (50+ Bác sĩ, ATTT Cấp độ 3), neon pulse animations | ✅ Hoàn thành |

**Admin Tabs hiện tại (15 tabs):**
- 15 hoàn thành: Overview, Bookings, Patients, Shifts, Specialties, Doctors, News, Organization, Logs, Services, PatientTab, Tender, Contact, Feedback, RecordRequests

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

### Phase 52 (2-3 tháng)
- HIS integration thật
- Advanced features (queue_tickets, prescription_refill, insurance_verification)

---

## 📌 Ghi chú quan trọng

1. **Navbar link "Sơ đồ tổ chức"** → `/gioi-thieu#so-do-to-chuc` (đã update)
2. **Shared Animation Hooks** (Phase 40): Dùng `useReducedMotion`, `AnimatedCounter`, `FloatingShape` từ `src/hooks/`
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