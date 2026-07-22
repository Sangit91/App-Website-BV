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
├── services/             # Business logic
├── db/                   # Mock data
└── middleware/           # Auth middleware
```

---

## 🚧 Backup gần nhất

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
| Spec v2.9 review + Database gap analysis | ✅ Hoàn thành (2026-07-22) |
| dactaupdate.md updated with DB gaps | ✅ Hoàn thành |
| Expert System Review Report (report-review.md) | ✅ Hoàn thành |
| AGENTS.md updated with v2.10 spec (Public Form API, DB Layer rules, Data Retention, ENUM-Badge sync) | ✅ Hoàn thành |

**Admin Tabs hiện tại (15 tabs):**
- 13 hoàn thành: Overview, Bookings, Patients, Shifts, Specialties, Doctors, News, Organization, Logs, Services, PatientTab, Tender, Contact
- 2 pending: FeedbackTab, RecordRequestsTab (chờ Phase 49)

---

## 🚧 Pending Tasks

### Phase 49 (Ngay lập tức)
1. **Implement feedback_requests + record_requests API:**
   - Tạo in-memory storage (sau này migrate PostgreSQL)
   - Kết nối FeedbackModal → API (hiện chỉ mock submit 1.5s)
   - Kết nối RecordRequestModal → API
   - Tạo FeedbackTab + RecordRequestsTab trong admin
   - Spec: dac-ta-uiux-tong-hop-v2.9.md mục 21.2–21.4

2. **Bổ sung field-level chi tiết cho 6 bảng Nhóm B:**
   - service_groups: thêm id, slug, sort_order, is_active
   - services: thêm id, slug, sort_order, is_active, price
   - news_categories: thêm id, slug, description, sort_order
   - price_list: thêm id (PK), service_id FK, group_id FK, is_active
   - testimonials: thêm full schema (id, patient_name, service_id, rating, content, is_approved)
   - contact_messages: thêm full schema
   - lab_test_requests: thêm full schema
   - teleconsult_requests: thêm full schema

### Phase 50 (2-3 tuần)
- Database migration: PostgreSQL + Prisma
- Migrate tất cả 22 bảng (spec mục 15 + 21)

### Phase 51 (1-2 tuần)
- Security hardening (JWT, 2FA, rate limiting)

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
8. **Spec v2.10** bổ sung field-level đầy đủ 9 bảng (21.8), appointments.status 5 giá trị (21.9), retention policy (21.10), contact_phone/email cho feedback_requests (21.11)
9. **AGENTS.md** đã update 4 section: Public Form API Standards, Database Layer rules, Data Retention Governance, ENUM-Badge sync
10. **Database spec score: ~4.5/5** — đủ đầy đủ để mở rộng, Phase 49 có thể bắt đầu được

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