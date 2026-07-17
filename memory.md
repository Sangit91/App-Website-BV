# Refactoring Memory - BVĐK Website

## Tổng Quan
Dự án bệnh viện React với TypeScript + Vite + Tailwind CSS, được refactor để cải thiện maintainability và structure.

## Backup Location
- **Path:** `D:\Coding\App Website BV_backup_20260717_075747`
- **Files backed up:** 31 files (src/, server.ts, config files, .gitignore)
- **Note:** Không backup node_modules (có thể recreate bằng `npm install`)

---

## Các Phase Đã Hoàn Thành

### PHASE 0: Backup ✅
- **Date:** 2026-07-17 07:57:47
- **Action:** Sao chép toàn bộ project (trừ node_modules) vào folder backup
- **Verification:** 31 files copied thành công
- **Git:** Initialized với `git init`, commit đầu tiên

### PHASE 1: Git + .gitignore ✅
- **Date:** 2026-07-17
- **Action:** Tạo `.gitignore` với các rules cho node_modules, dist, .env, logs, OS files, backup folders
- **Git:** Created backup branch `refactor-backup`
- **Commits:**
  - `5a2af96` - chore: add .gitignore and initial project files
  - `42e8db8` - chore: add new folder structure for refactoring
  - `b7123d8` - refactor: create shared types module in src/types/
  - `4a208a6` - feat: setup React Router for proper routing
  - `310dd4b` - refactor: reorganize components into feature-based folder structure

### PHASE 2a: Folder Structure ✅
- **Date:** 2026-07-17
- **Created directories:**
  ```
  src/components/ui/         - Reusable UI primitives
  src/components/layout/     - Layout components (Header, Footer)
  src/components/public/     - Public page sections
  src/components/booking/    - Booking-related components
  src/components/ai/         - AI Advisor components
  src/components/test-lookup/ - Test lookup components
  src/components/admin/      - Admin dashboard components
  src/pages/                 - Page components
  src/hooks/                 - Custom React hooks
  src/lib/api/               - API client
  src/lib/utils/             - Utilities
  src/types/models/          - TypeScript model types
  src/data/                  - Static data
  ```

### PHASE 2b: Shared Types Module ✅
- **Date:** 2026-07-17
- **Action:** Thay thế `src/types.ts` bằng structured types module
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
- **Deleted:** `src/types.ts` (replaced by src/types/)
- **Breaking changes:** Import paths changed from `../types` to `../types` (same but resolves to folder)

### PHASE 3: React Router ✅
- **Date:** 2026-07-17
- **Dependencies added:** `react-router-dom`
- **Changes:**
  - Created `src/pages/PublicPage.tsx` - Main public website
  - Created `src/pages/AdminPage.tsx` - Admin dashboard page
  - Refactored `src/App.tsx` to use `<BrowserRouter>` + `<Routes>`
  - Removed manual hash-based routing in App.tsx
  - Admin routing now uses proper URL path `/admin`
- **New App.tsx:**
  ```tsx
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </BrowserRouter>
  ```

### PHASE 7: Folder Structure Migration ✅
- **Date:** 2026-07-17
- **Action:** Di chuyển tất cả components vào đúng folders theo feature

**Layout components** (→ `src/components/layout/`):
- HospitalLogo.tsx
- Topbar.tsx
- Navbar.tsx
- Footer.tsx

**Public components** (→ `src/components/public/`):
- Hero.tsx
- QuickActions.tsx
- Specialties.tsx
- WhyChooseUs.tsx
- Organization.tsx
- Doctors.tsx
- Testimonials.tsx
- News.tsx
- CTABanner.tsx

**Feature components**:
- `src/components/booking/BookingForm.tsx`
- `src/components/ai/AIAdvisor.tsx`
- `src/components/test-lookup/TestLookup.tsx`
- `src/components/admin/AdminDashboard.tsx`

**Updated imports:**
- All components updated to use correct relative paths
- Example: `import { Doctor } from "../types"` → `import { Doctor } from "../../types"`

---

## Git History

```
5a2af96 - chore: add .gitignore and initial project files (HEAD)
42e8db8 - chore: add new folder structure for refactoring  
b7123d8 - refactor: create shared types module in src/types/
4a208a6 - feat: setup React Router for proper routing
310dd4b - refactor: reorganize components into feature-based folder structure
```

## Current Project Structure

```
src/
├── components/
│   ├── ui/                 # [empty - for UI primitives]
│   ├── layout/             # Topbar, Navbar, Footer, HospitalLogo
│   ├── public/             # Hero, Specialties, Doctors, News, etc.
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
│   └── models/             # specialty.ts, doctor.ts, booking.ts, etc.
├── data/                   # [.gitkeep]
├── hooks/                  # [.gitkeep]
├── lib/
│   ├── api/                # [.gitkeep]
│   └── utils/              # [.gitkeep]
├── App.tsx
├── main.tsx
└── index.css
```

---

## Còn Lại (Chưa Làm)

### PHASE 4: UI Component Library
- Tạo reusable Button, Input, Select, Modal, Card, Badge, Spinner
- **Status:** Pending

### PHASE 5: Context Splitting
- Tách HospitalContext thành AuthContext + DataContext
- **Status:** Pending

### PHASE 6: Server Refactor
- Tách server.ts thành modules riêng (routes/, services/, db/)
- **Status:** Pending

### PHASE 8: Error Boundaries + UX
- Thêm ErrorBoundary component
- Loading states, skeleton loaders
- **Status:** Pending

### PHASE 9: Environment Config
- Tạo `.env.example`
- Validation cho required env vars
- JSDoc types cho Tailwind colors
- **Status:** Pending

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# TypeScript check
npm run lint

# Backup restore (if needed)
# Copy all files from D:\Coding\App Website BV_backup_20260717_075747
# Run npm install

# Rollback to specific commit
git reset --hard <commit-hash>
```

---

## Rollback Procedure

Nếu cần rollback toàn bộ:
1. `git reset --hard 5a2af96` (commit trước khi refactor)
2. Hoặc copy files từ backup folder

**Backup folder:** `D:\Coding\App Website BV_backup_20260717_075747`