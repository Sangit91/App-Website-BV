# Refactoring Memory - BVĐK Website

## Tổng Quan
Dự án bệnh viện React với TypeScript + Vite + Tailwind CSS, được refactor để cải thiện maintainability và structure.

## Backup Location
- **Path:** `D:\Coding\code backup\App Website BV_20260718_192527`
- **Files backed up:** src/, server/, public/, dist/, config files
- **Note:** Không backup node_modules (có thể recreate bằng `npm install`)

### All Backups
- `D:\Coding\code backup\App Website BV_20260719_131807` (latest - before tender fix)
- `D:\Coding\code backup\App Website BV_20260718_192527`
- `D:\Coding\code backup\App Website BV_20260718_182929`
- `D:\Coding\code backup\App Website BV_20260718_181829`
- `D:\Coding\App Website BV_backup_20260717_075747`

---

## 🚧 PHASE 10: Routing Refactor + Animations (ĐÃ HOÀN THÀNH)

### Mục tiêu
Tách homepage thành các trang con riêng biệt, thêm sections tương ứng với mega menu, và hiệu ứng animation mượt mà.

### Routing Structure

| Route | Component | Sections |
|-------|-----------|----------|
| `/` | HomePage | Hero + QuickActions + All sections |
| `/gioi-thieu` | GioiThieuPage | #ve-chung-toi, #co-so-vat-chat, #quy-trinh-cham-soc |
| `/chuyen-khoa` | ChuyenKhoaPage | #ngoai-cap-cuu, #noi-tong-quat, #san-nhi, #can-lam-sang |
| `/dich-vu` | DichVuPage | #dich-vu-tron-goi, #tai-nha-van-chuyen, #tiem-chung, #bao-hiem-vip, #goi-kham |
| `/dich-vu/thong-tin-thau` | ThongTinThauPage | - |
| `/cho-benh-nhan` | ChoBenhNhanPage | #chi-phi-dia-diem, #huong-dan-tien-ich, #cong-thong-tin |
| `/tin-tuc` | TinTucPage | - |
| `/so-do-to-chuc` | SoDoToChucPage | - |
| `/lien-he` | LienHePage | - |
| `/admin` | AdminPage | - |

### Mega Menu Link-to-Section Navigation
Navbar mega menu links navigate to correct page + section hash. Full mapping in Navbar.tsx `linkSections` object.

### PHASE 10b: Image Additions (2026-07-18)
Thêm hình ảnh placeholder (picsum.photos) vào tất cả các trang:

| Trang | Hình ảnh đã thêm |
|-------|------------------|
| GioiThieuPage | Hero image, 3 facility images, 3 director avatars, 3 process images |
| ChuyenKhoaPage | 4 department hero images, 20+ department images |
| DichVuPage | 5 category hero images, 20+ service images |
| ChoBenhNhanPage | 3 section hero images, 9 info item images |
| SoDoToChucPage | 3 director avatars, 3 department images |
| LienHePage | Hospital exterior, map image, contact form header |
| TinTucPage | Recruitment image, tender image |
| ThongTinThauPage | 3 tender images, bidding guide header |

### Files tạo mới
- `src/pages/HomePage.tsx` - Homepage với đầy đủ sections + navigation links
- `src/pages/GioiThieuPage.tsx` - 3 sections: Về chúng tôi, Cơ sở vật chất, Quy trình chăm sóc
- `src/pages/ChuyenKhoaPage.tsx` - 4 sections: Ngoại & Cấp cứu, Nội tổng quát, Sản & Nhi, Cận lâm sàng
- `src/pages/DichVuPage.tsx` - 5 sections: Trọn gói, Tại nhà & Vận chuyển, Tiêm chủng, Bảo hiểm & VIP, Gói khám
- `src/pages/ThongTinThauPage.tsx`
- `src/pages/ChoBenhNhanPage.tsx` - 3 sections: Chi phí & Địa điểm, Hướng dẫn tiện ích, Cổng thông tin
- `src/pages/TinTucPage.tsx`
- `src/pages/SoDoToChucPage.tsx`
- `src/pages/LienHePage.tsx`
- `src/components/layout/Layout.tsx` - Shared layout wrapper
- `src/components/layout/PageTransition.tsx` - Page transition animations
- `src/components/ui/ScrollAnimation.tsx` - Scroll-triggered animations với Intersection Observer

### Files sửa
- `src/App.tsx` - Thêm routes mới
- `src/components/layout/Navbar.tsx` - Đổi từ scroll sang navigate + link-to-section mapping
- `src/components/layout/Layout.tsx` - Hash navigation support
- `src/index.css` - Thêm scroll animation CSS classes

### Homepage Content (v2)
- Hero, QuickActions, Specialties, WhyChooseUs, Organization, Doctors, Testimonials, News, CTABanner
- Plus "Khám phá thêm" section với links đến các trang chi tiết

---

## ✅ TẤT CẢ CÁC PHASE ĐÃ HOÀN THÀNH

### PHASE 0: Backup ✅
- **Date:** 2026-07-17 07:57:47
- **Action:** Sao chép toàn bộ project (trừ node_modules) vào folder backup
- **Verification:** 31 files copied thành công

### PHASE 1: Git + .gitignore ✅
- Tạo `.gitignore` với các rules cho node_modules, dist, .env, logs, OS files, backup folders
- Initialized git repository với commit đầu tiên

### PHASE 2a: Folder Structure ✅
- **Created directories:**
  - `src/components/ui/` - Reusable UI primitives
  - `src/components/layout/` - Layout components
  - `src/components/public/` - Public page sections
  - `src/components/booking/` - Booking-related components
  - `src/components/ai/` - AI Advisor components
  - `src/components/test-lookup/` - Test lookup components
  - `src/components/admin/` - Admin dashboard components
  - `src/pages/` - Page components
  - `src/hooks/` - Custom React hooks
  - `src/lib/api/` - API client
  - `src/lib/utils/` - Utilities
  - `src/types/models/` - TypeScript model types
  - `src/data/` - Static data

### PHASE 2b: Shared Types Module ✅
- Thay thế `src/types.ts` bằng structured types module
- **New structure:**
  ```
  src/types/index.ts                    - Barrel export
  src/types/models/specialty.ts         - Specialty type
  src/types/models/doctor.ts           - Doctor type
  src/types/models/testimonial.ts       - Testimonial type
  src/types/models/news.ts              - NewsItem type
  src/types/models/booking.ts          - Booking type + CreateBookingInput
  src/types/models/test-result.ts       - TestResult type
  src/types/models/patient.ts          - Patient type
  src/types/models/schedule.ts          - DoctorSchedule type + ShiftType
  src/types/models/audit-log.ts         - AuditLog type
  src/types/models/auth.ts             - ActiveUser type + Role
  src/types/models/quick-action.ts     - QuickAction type
  ```

### PHASE 3: React Router ✅
- **Dependencies added:** `react-router-dom`
- Created `src/pages/PublicPage.tsx` và `src/pages/AdminPage.tsx`
- Refactored `src/App.tsx` to use `<BrowserRouter>` + `<Routes>`
- Admin routing now uses proper URL path `/admin`

### PHASE 4: UI Component Library ✅
- Created reusable components: Button, Input, Select, Modal, Card, Badge, Spinner, ErrorBoundary
- Located at `src/components/ui/`

### PHASE 5: Context Splitting ✅ (Deferred - kept original context)
- **Status:** Deferred - HospitalContext kept as-is due to complexity

### PHASE 6: Server Refactor ✅
- Split server.ts into modular architecture:
  - `server/app.ts` - Express app setup
  - `server/routes/` - booking.routes.ts, test-result.routes.ts, ai.routes.ts
  - `server/services/` - booking.service.ts, test-result.service.ts, ai.service.ts
  - `server/db/database.ts` - In-memory database
  - `server/middleware/error.middleware.ts` - Error handling

### PHASE 7: Folder Structure Migration ✅
- Di chuyển tất cả components vào đúng folders theo feature
- All imports updated to use correct relative paths

### PHASE 8: Error Boundaries + UX ✅
- Created `src/components/ui/ErrorBoundary.tsx`
- Added back-to-top button that appears when scrolling

### PHASE 9: Environment Config ✅
- Created `.env.example`
- Created `src/lib/env.ts` - Environment validation
- Created `src/vite-env.d.ts` - Vite type definitions

---

## Bugs Đã Sửa

### Lỗi "API endpoint không tồn tại" khi truy cập trang chủ (2026-07-17)
- **Nguyên nhân:** Trong `server/app.ts`, `notFoundHandler` và `errorHandler` được đăng ký TRƯỚC `vite.middlewares`. Khi request đến `/`, Express chạy `notFoundHandler` trước và trả về lỗi "API endpoint không tồn tại" thay vì để Vite serve index.html.
- **Sửa chữa:**
  1. **`server/app.ts`:** Xóa `notFoundHandler` và `errorHandler` khỏi đây
  2. **`server.ts`:** Thêm chúng SAU `vite.middlewares`
- **Thứ tự middleware đúng:**
  1. API routes
  2. `vite.middlewares` (serve index.html cho SPA)
  3. `notFoundHandler` + `errorHandler` (chỉ catch request còn lại)

---

## Các Thay Đổi Bổ Sung (Sau Refactoring)

### Navbar Improvements (2026-07-17)
- Mở rộng container max-width từ 1440px lên 1580px
- Thêm `2xl:px-10` padding cho màn hình lớn
- Tăng khoảng cách menu: `xl:space-x-1.5 2xl:space-x-3`
- Tăng khoảng cách nút bên phải: `2xl:space-x-4`
- Tăng padding các nút (Hotline, Admin, Booking)
- Tăng font-size logo trên các màn hình lớn

### Organization Chart Updates (2026-07-17)
- Cập nhật đầy đủ 36 khoa/phòng theo sơ đồ tổ chức chính thức:
  - Khối Hành Chính: 9 phòng/ban
  - Khối Lâm Sàng: 21 khoa
  - Khối Cận Lâm Sàng: 6 khoa
- Hiển thị mặc định 6 đơn vị, nút "Xem thêm" để expand/collapse

### UI Enhancements (2026-07-17)
- Đổi browser tab title: "My Google AI Studio App" → "WEBSITE BQN - CNTT"
- Thêm favicon SVG cho bệnh viện
- Thêm margin vào logo để tránh overflow
- Thêm nút Back-to-Top button

### Tender Card Styling (2026-07-19)
- Đổi aspect ratio từ `aspect-[4/5]` sang `aspect-square` để cân đối hình vuông
- Áp dụng design: `bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-800/5 hover:border-brand-green/30 group`
- Điều chỉnh padding, font sizes, icon sizes phù hợp với square layout
- File: `src/pages/ThongTinThauPage.tsx`

### Tender Information Full Overhaul (2026-07-19)
**Files fixed:**
- `src/types/models/news.ts` - Thêm TenderStatus, TenderMethod types và các trường: tenderNumber, tenderMethod, tenderEstimateValue, tenderReceivedLocation, tenderContact, tenderContactPhone, tenderDownloadCount
- `src/data.ts` - Cập nhật NEWS data với đầy đủ thông tin tender (số hiệu thầu, giá trị, hình thức, người liên hệ, địa điểm)
- `src/components/public/News.tsx` - Fix timer đếm ngược thực từ tenderEndDate, status badge chính xác, loại bỏ hardcoded text, tăng font size, thay alert() bằng toast notification
- `src/pages/ThongTinThauPage.tsx` - Tăng font size tối thiểu 11px, hiển thị tenderNumber thay vì database ID, thêm thông tin đầy đủ, cải thiện UI/UX cards

**Các vấn đề đã fix:**
1. Timer đếm ngược dùng mock data random → tính toán thực từ tenderEndDate
2. Font size 8-10px quá nhỏ → tăng lên tối thiểu 11-13px
3. Database ID lộ cho người dùng → hiển thị tenderNumber chuyên nghiệp
4. Hardcoded text khắp nơi → dùng data thực từ item
5. Status badge luôn hiện "ĐANG MỞ THẦU" → kiểm tra trạng thái thực theo thời gian
6. alert() trong production → thay bằng toast notification
7. Thiếu thông tin quan trọng (số hiệu, giá trị, hình thức, người liên hệ) → bổ sung đầy đủ

---

## Git History

```
17eb385 - config: add .env.example and environment validation
821f62e - feat: add ErrorBoundary component for error handling
f51a987 - refactor: split server.ts into modular architecture
8b13daf - feat: add UI component library
310dd4b - refactor: reorganize components into feature-based folder structure
4a208a6 - feat: setup React Router for proper routing
b7123d8 - refactor: create shared types module in src/types/
42e8db8 - chore: add new folder structure for refactoring
5a2af96 - chore: add .gitignore and initial project files
c7c280c - feat: show only 6 departments initially, add expand/collapse button
7d5fed3 - fix: add margin to logo to prevent overflow
be5f547 - feat: add hospital favicon to browser tab
cb85e2b - fix: expand navbar container width to 1580px
09c2404 - feat: add back to top button that appears when scrolling
c593409 - feat: update organization chart with full department structure
103a63d - chore: rename browser tab title to WEBSITE BQN - CNTT
```

---

## Files Created

- `AGENT.md` - Comprehensive agent instructions (v2 - updated 2026-07-18)
- PHASE 10 pages (2026-07-18):
  - `src/pages/HomePage.tsx` (v2 - full content)
  - `src/pages/GioiThieuPage.tsx` (v2 - 3 sections)
  - `src/pages/ChuyenKhoaPage.tsx` (v2 - 4 department categories)
  - `src/pages/DichVuPage.tsx` (v2 - 5 service categories)
  - `src/pages/ThongTinThauPage.tsx`
  - `src/pages/ChoBenhNhanPage.tsx` (v2 - 3 info sections)
  - `src/pages/TinTucPage.tsx`
  - `src/pages/SoDoToChucPage.tsx`
  - `src/pages/LienHePage.tsx`
  - `src/components/layout/Layout.tsx`
  - `src/components/layout/PageTransition.tsx`
  - `src/components/ui/ScrollAnimation.tsx`
  - `src/index.css` (updated with animation classes)

## Current Project Structure

```
src/
├── components/
│   ├── ui/                 # Button, Input, Select, Modal, Card, Badge, Spinner, ErrorBoundary, ScrollAnimation
│   ├── layout/             # Topbar, Navbar, Footer, HospitalLogo, Layout, PageTransition
│   ├── public/             # Hero, Specialties, Doctors, News, Testimonials, Organization, QuickActions, CTABanner
│   ├── booking/            # BookingForm
│   ├── ai/                 # AIAdvisor
│   ├── test-lookup/        # TestLookup
│   └── admin/              # AdminDashboard
├── pages/
│   ├── HomePage.tsx        # Route: /
│   ├── GioiThieuPage.tsx   # Route: /gioi-thieu
│   ├── ChuyenKhoaPage.tsx  # Route: /chuyen-khoa
│   ├── DichVuPage.tsx      # Route: /dich-vu
│   ├── ThongTinThauPage.tsx # Route: /dich-vu/thong-tin-thau
│   ├── ChoBenhNhanPage.tsx # Route: /cho-benh-nhan
│   ├── TinTucPage.tsx      # Route: /tin-tuc
│   ├── SoDoToChucPage.tsx  # Route: /so-do-to-chuc
│   ├── LienHePage.tsx      # Route: /lien-he
│   └── AdminPage.tsx       # Route: /admin
├── context/
│   └── HospitalContext.tsx
├── types/
│   ├── index.ts
│   └── models/             # All shared TypeScript types
├── data/
├── hooks/
├── lib/
│   ├── env.ts             # Environment validation
│   └── index.ts
├── App.tsx                 # Router setup với 10 routes
├── main.tsx
├── index.css
└── vite-env.d.ts

server/
├── app.ts                  # Express app
├── routes/                 # API routes
├── services/              # Business logic
├── db/database.ts          # In-memory database
└── middleware/             # Error handling
```

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# TypeScript check
npm run lint

# Rollback to specific commit
git reset --hard <commit-hash>
```

---

## Rollback Procedure

Nếu cần rollback toàn bộ:
1. `git reset --hard <commit-hash>` (xem git log)
2. Hoặc copy files từ backup folder: `D:\Coding\code backup\App Website BV_20260718_182929`

**Backup folder:** `D:\Coding\code backup\App Website BV_20260718_182929` (trước PHASE 10)