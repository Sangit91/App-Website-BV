# Refactoring Memory - BVĐK Website

## Tổng Quan
Dự án bệnh viện React với TypeScript + Vite + Tailwind CSS, được refactor để cải thiện maintainability và structure.

## Backup Location
- **Path:** `D:\Coding\App Website BV_backup_20260717_075747`
- **Files backed up:** 31 files (src/, server.ts, config files, .gitignore)
- **Note:** Không backup node_modules (có thể recreate bằng `npm install`)

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

## Current Project Structure

```
src/
├── components/
│   ├── ui/                 # Button, Input, Select, Modal, Card, Badge, Spinner, ErrorBoundary
│   ├── layout/             # Topbar, Navbar, Footer, HospitalLogo
│   ├── public/             # Hero, Specialties, Doctors, News, Testimonials, Organization, etc.
│   ├── booking/            # BookingForm
│   ├── ai/                 # AIAdvisor
│   ├── test-lookup/        # TestLookup
│   └── admin/              # AdminDashboard
├── pages/
│   ├── PublicPage.tsx
│   └── AdminPage.tsx
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
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts

server/
├── app.ts                  # Express app
├── routes/                 # API routes
├── services/              # Business logic
├── db/database.ts          # In-memory database
├── middleware/             # Error handling
└── tsconfig.json
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
1. `git reset --hard 5a2af96` (commit trước khi refactor)
2. Hoặc copy files từ backup folder: `D:\Coding\App Website BV_backup_20260717_075747`

**Backup folder:** `D:\Coding\App Website BV_backup_20260717_075747`