# Refactoring Memory - BVĐK Website

## 📌 THÔNG TIN BỆNH VIỆN

## Tên đầy đủ
**Bệnh Viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam**

## Địa chỉ
107 Quang Trung, Xã Đại Lộc, Thành Phố Đà Nẵng

## Lãnh đạo

| Chức vụ | Họ tên |
|---------|--------|
| Giám đốc | Nhà Thuốc Ưu Tú. BS CKII Nguyễn Thống Nhất |
| Phó Giám đốc | BSCK II Lê Minh Dũng |
| Phó Giám đốc | BS CKII Nguyễn Đình Hoàng |

---

# 📌 Tổng Quan Dự Án

Dự án Website BVĐK sử dụng:

* React
* TypeScript
* Vite
* Tailwind CSS
* Express

Mục tiêu:

* Website bệnh viện hiện đại
* Responsive
* Accessibility
* Dễ bảo trì
* Dễ mở rộng
* Đồng bộ UI/UX toàn hệ thống

---

# 🎯 TẦM NHÌN KIẾN TRÚC

## Nguyên tắc

* Reusable First
* Mobile First
* Accessibility First
* Maintainability First

---

## Chất lượng mục tiêu

### Technical

* TypeScript Strict
* Zero Any Policy
* Reusable Components
* Feature Based Structure

### UI

* Design System thống nhất
* Không hardcode màu sắc
* Không hardcode spacing
* Không hardcode typography

### UX

* Tối giản thao tác
* Dễ sử dụng với người lớn tuổi
* Thông báo rõ ràng

### Accessibility

* Keyboard Friendly
* Screen Reader Friendly
* WCAG cơ bản

---

# 🏥 HOSPITAL UX STANDARDS

## Booking

Bắt buộc có:

* Loading State
* Success State
* Error State
* Validation State

---

## Test Lookup

Bắt buộc có:

* Loading State
* Empty State
* Error State
* Result State

---

## AI Advisor

Bắt buộc có:

* Thinking State
* Response State
* Error State

---

## Contact

Thông tin liên hệ phải luôn hiển thị:

* Footer
* Contact Page

---

## Hotline

Hotline luôn hiển thị nổi bật.

---

# 🎨 UI GOVERNANCE

## Typography

Cho phép:

* H1
* H2
* H3
* Body
* Caption

---

## Spacing Scale

Cho phép:

* 4
* 8
* 12
* 16
* 24
* 32
* 48
* 64

---

## Radius

Cho phép:

* rounded-sm
* rounded-md
* rounded-lg
* rounded-xl

---

## Shadow

Cho phép:

* shadow-sm
* shadow-md
* shadow-lg

---

# ♿ ACCESSIBILITY RULES

## Form

Mọi Input phải có:

* Label
* ID
* Validation Message

---

## Buttons

Icon button phải có:

* aria-label

---

## Keyboard

Mọi chức năng phải hỗ trợ:

* Tab
* Shift + Tab
* Enter
* Esc

---

## Contrast

Không sử dụng text khó đọc trên nền sáng.

---

# 📦 STATE MANAGEMENT

## Single Source Of Truth

HospitalContext là nguồn dữ liệu chính.

Không tạo context mới nếu không thực sự cần thiết.

---

# 🚧 BACKUP LOCATION

## Latest Backup

Path:

D:\Coding\code backup\App Website BV_20260719_160404

Files:

* Full project backup (including public/images/)
* Backup sau Local Images Migration

Note:

Backup sau Phase 14 - Local Images Migration.

---

## All Backups

* D:\Coding\code backup\App Website BV_20260719_160404 (latest - after Local Images Migration)
* D:\Coding\code backup\App Website BV_20260719_150635

---

# 📚 PHASE HISTORY

## PHASE 0

### Backup

Ngày:

2026-07-17

Kết quả:

* Backup thành công
* 31 files copied

---

## PHASE 1

### Git + .gitignore

Hoàn thành:

* Git repository
* .gitignore chuẩn

---

## PHASE 2

### Folder Structure

Đã tạo:

* components
* pages
* hooks
* lib
* types
* data

---

### Shared Types

Đã chuyển toàn bộ type sang:

src/types/models/

---

## PHASE 3

### React Router

Đã triển khai:

* BrowserRouter
* Routes
* Admin Route

---

## PHASE 4

### UI Library

Đã tạo:

* Button
* Input
* Select
* Modal
* Card
* Badge
* Spinner
* ErrorBoundary

---

## PHASE 5

### Context Refactor

Trạng thái:

Deferred

HospitalContext được giữ lại.

---

## PHASE 6

### Server Refactor

Đã tách:

* app.ts
* routes
* services
* db
* middleware

---

## PHASE 7

### Folder Migration

Hoàn thành.

---

## PHASE 8

### UX Improvements

Đã thêm:

* ErrorBoundary
* Back To Top

---

## PHASE 9

### Environment Config

Đã thêm:

* .env.example
* env.ts

---

## PHASE 10

### Routing Refactor

Đã tạo:

* HomePage
* GioiThieuPage
* ChuyenKhoaPage
* DichVuPage
* ThongTinThauPage
* ChoBenhNhanPage
* TinTucPage
* SoDoToChucPage
* LienHePage

---

### Animation System

Đã thêm:

* PageTransition
* ScrollAnimation

---

### Image System

Đã bổ sung ảnh placeholder cho toàn bộ các trang.

---

## PHASE 11

### Admin Refactor - Phase 1 (Hoàn thành)

Ngày:

2026-07-19

Mục tiêu:

Cập nhật trang admin phù hợp với cấu trúc frontend hiện tại

Đã hoàn thành:

* Tạo AdminContext quản lý login state và RBAC
* Tạo AdminLogin component (login screen mới)
* Tạo AdminSidebar component (sidebar navigation)
* Tạo AdminHeader component (page title + status)
* Cập nhật main.tsx thêm AdminProvider

Files affected:

* src/context/AdminContext.tsx (new)
* src/components/admin/AdminLogin.tsx (new)
* src/components/admin/AdminSidebar.tsx (new)
* src/components/admin/AdminHeader.tsx (new)
* src/main.tsx (updated)

---

## PHASE 12

### Admin Refactor - Phase 2 (Hoàn thành)

Ngày:

2026-07-19

Mục tiêu:

Tách AdminDashboard 2693 lines thành 9 tab components riêng biệt

Đã hoàn thành:

* Tạo OverviewTab - Dashboard metrics và recent bookings
* Tạo BookingsTab - Quản lý lịch hẹn với search, filter, approve/cancel
* Tạo PatientsTab - Danh sách bệnh nhân với search
* Tạo ShiftsTab - Ma trận phân ca bác sĩ
* Tạo SpecialtiesTab - CRUD chuyên khoa với modal
* Tạo DoctorsTab - CRUD bác sĩ với modal
* Tạo NewsTab - CRUD tin tức với modal
* Tạo OrganizationTab - CRUD sơ đồ tổ chức với modal
* Tạo LogsTab - Audit logs
* Cập nhật Button component hỗ trợ `type` prop
* Sử dụng UI components (Card, Badge, Button) thay vì inline HTML

Files affected:

* src/components/admin/tabs/OverviewTab.tsx (new)
* src/components/admin/tabs/BookingsTab.tsx (new)
* src/components/admin/tabs/PatientsTab.tsx (new)
* src/components/admin/tabs/ShiftsTab.tsx (new)
* src/components/admin/tabs/SpecialtiesTab.tsx (new)
* src/components/admin/tabs/DoctorsTab.tsx (new)
* src/components/admin/tabs/NewsTab.tsx (new)
* src/components/admin/tabs/OrganizationTab.tsx (new)
* src/components/admin/tabs/LogsTab.tsx (new)
* src/components/admin/tabs/index.ts (new)
* src/components/ui/Button.tsx (updated - thêm type prop)
* src/pages/AdminPage.tsx (updated - render tabs)

Cleanup đã thực hiện:

* Đã xóa AdminDashboard.tsx (backup trước đó)
* Đã xóa AdminLayout.tsx (không sử dụng)
* Không còn hardcoded colors trong admin components
* Sử dụng design tokens từ index.css

---

## PHASE 16

### DichVuPage & ChoBenhNhanPage - Modern Animation Redesign (Hoàn thành 2026-07-19)

**Files affected:**
- src/pages/DichVuPage.tsx
- src/pages/ChoBenhNhanPage.tsx

**Đã thực hiện (áp dụng cùng design pattern từ ChuyenKhoaPage):**
- Hero section với animated gradient mesh + floating shapes
- Count-up animation cho stats khi scroll vào view
- Sticky tab navigation với glass morphism effect
- Featured card với clip-path reveal + Ken Burns effect
- 3D tilt effect on hover cho cards
- Glow border animation và staggered reveal
- AnimatePresence cho smooth tab transitions

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 15

### ChuyenKhoaPage - Modern Redesign với Animation Ấn Tượng (2026-07-19) - ĐANG THIẾT KẾ

#### Design Concept: "Surgical Precision meets Digital Innovation"

**Triết lý:**
- Medical precision + Modern tech feel
- Smooth, purposeful animations thể hiện sự chính xác y khoa
- Dark mode-ready color palette với accents nổi bật
- Parallax và depth effects tạo cảm giác 3D

---

#### Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  HERO SECTION - Full viewport với Parallax                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Background: Animated gradient mesh + floating particles  │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │  [Staggered Text Animation]                           │ │   │
│  │  │  CHUYÊN KHOA                                          │ │   │
│  │  │  [Split text reveal on scroll]                        │ │   │
│  │  │  Hệ thống chuyên khoa đa dạng...                    │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                              │   │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                        │   │
│  │  │ 12  │  │ 50+ │  │ 200 │  │  5  │  [Count-up animation] │   │
│  │  │CKhoa│  │ BS  │  │Giuong│ │PMo  │                        │   │
│  │  └─────┘  └─────┘  └─────┘  └─────┘                        │   │
│  └────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  HORIZONTAL SCROLL SECTION - Draggable Cards                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ [← Drag/Scroll →]                                          │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │   │
│  │  │  Tab 1  │ │  Tab 2  │ │  Tab 3  │ │  Tab 4  │          │   │
│  │  │ Icon    │ │ Icon    │ │ Icon    │ │ Icon    │          │   │
│  │  │ Title   │ │ Title   │ │ Title   │ │ Title   │          │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │   │
│  └────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  FEATURED DEPARTMENT - Large reveal animation                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  [Clip-path reveal on scroll]                             │    │
│  │  ┌─────────────────────┐ ┌────────────────────────────┐  │    │
│  │  │                     │ │  [Staggered content reveal]│  │    │
│  │  │   FEATURED IMAGE    │ │  Department Title           │  │    │
│  │  │   with Ken Burns    │ │  Description paragraphs    │  │    │
│  │  │   effect            │ │  with line-by-line reveal  │  │    │
│  │  │                     │ │                             │  │    │
│  │  │                     │ │  [Animated list items]      │  │    │
│  │  │                     │ │  ○ Item 1 [slide-in]        │  │    │
│  │  │                     │ │  ○ Item 2 [slide-in]        │  │    │
│  │  │                     │ │  ○ Item 3 [slide-in]        │  │    │
│  │  └─────────────────────┘ └────────────────────────────┘  │    │
│  └───────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  SERVICES GRID - Staggered card reveal                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                 │
│  │ Card 1  │ │ Card 2  │ │ Card 3  │ │ Card 4  │                 │
│  │ [3D     │ │ [3D     │ │ [3D     │ │ [3D     │                 │
│  │ tilt on │ │ tilt on │ │ tilt on │ │ tilt on │                 │
│  │ hover]  │ │ hover]  │ │ hover]  │ │ hover]  │                 │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                 │
│  ┌─────────┐ ┌─────────┐                                        │
│  │ Card 5  │ │ Card 6  │                                        │
│  │ ...     │ │ ...     │                                        │
│  └─────────┘ └─────────┘                                        │
└──────────────────────────────────────────────────────────────────┘
```

---

#### Animation Details

**1. Hero Section**
- Background: Animated gradient mesh (CSS keyframes)
- Floating shapes: 4-6 floating circles với parallax
- Text: Split text animation (mỗi chữ reveal riêng)
- Stats: Count-up animation khi scroll vào view
- Scroll indicator: Bouncing chevron

**2. Horizontal Tab Navigation**
- Draggable horizontal scroll (scroll-snap)
- Active tab: Scale up + glow effect
- Tab icon: Animated morphing giữa icons
- Background: Glass morphism (backdrop-blur)

**3. Featured Department**
- Image: Clip-path reveal (polygon animation)
- Image: Ken Burns effect (subtle zoom/pan)
- Content: Line-by-line staggered reveal
- List items: Slide in từ alternating sides
- Decorative: Animated connecting lines

**4. Service Cards Grid**
- Layout: Masonry-style hoặc staggered grid
- Scroll: Staggered reveal (cascade effect)
- Hover: 
  - 3D tilt effect (perspective transform)
  - Glow border animation
  - Image zoom-in
  - Content slide-up
- Active card: Expand to show more details

---

#### Color Palette

- Primary: `bg-brand-green (#2FA968)`
- Dark bg: `bg-green-dark (#164B36)`
- Accent: `bg-peach (#FFB27D)`
- Glow: `shadow-brand-green/50`
- Glass: `bg-white/80 backdrop-blur-lg`

---

#### Technical Implementation

**Dependencies:**
- Framer Motion: animations
- react-intersection-observer: scroll triggers  
- CSS custom properties: dynamic values

**Key CSS Animations:**
```css
/* Gradient mesh background */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Tilt effect */
.card-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* Glow pulse */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(47, 169, 104, 0.3); }
  50% { box-shadow: 0 0 40px rgba(47, 169, 104, 0.6); }
}
```

---

#### UX Considerations

- Smooth scroll với inertia
- Reduced motion support (@media prefers-reduced-motion)
- Touch-friendly drag interactions
- Clear visual hierarchy
- Performance-conscious (will-change, GPU acceleration)

---

## PHASE 15

### ChuyenKhoaPage - Modern Animation Redesign (Hoàn thành 2026-07-19)

**Files affected:** src/pages/ChuyenKhoaPage.tsx

**Đã thực hiện:**
- Hero section với animated gradient mesh + floating shapes
- Count-up animation cho stats khi scroll vào view
- Sticky tab navigation với glass morphism effect
- Animated gradient backgrounds cho từng department
- Featured card với clip-path reveal + Ken Burns effect
- 3D tilt effect on hover cho service cards
- Glow border animation và staggered reveal
- AnimatePresence cho smooth tab transitions

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 14

### ThongTinThauPage Decorate (Hoàn thành 2026-07-19)

**Files affected:** src/pages/ThongTinThauPage.tsx

**Đã thực hiện:**
- Layout 2 cột: ảnh bệnh viện bên trái, nội dung bên phải
- Image: `/images/pages/coso-1.jpeg`
- Title: "Hướng dẫn tham gia đấu thầu" → "Thông tin đấu thầu"
- Thay text mô tả bằng thông tin chung (không phải quy trình)
- 3 cards lưu ý: Chữ ký số + Cổng đấu thầu quốc gia + Liên hệ hỗ trợ
- Giữ nguyên contact info

**Commands:** npm run lint - Passed, npm run build - Passed

---

### Cập nhật Thông Tin Bệnh Viện (2026-07-19)

**Files affected:**
- src/pages/ThongTinThauPage.tsx
- src/pages/SoDoToChucPage.tsx
- src/pages/GioiThieuPage.tsx
- src/pages/LienHePage.tsx
- src/pages/ChoBenhNhanPage.tsx
- src/components/public/Organization.tsx

**Đã sửa:**
- Tên bệnh viện: "Bệnh Viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam"
- Địa chỉ: "107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng"
- Giám đốc: "BS CKII Nguyễn Thống Nhất"
- Phó Giám đốc: "BSCK II Lê Minh Dũng", "BS CKII Nguyễn Đình Hoàng"

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 13

### NewsTab Enhancement - Tender Features (Hoàn thành)

Ngày:

2026-07-19

Mục tiêu:

Cập nhật NewsTab modal đầy đủ tính năng như bản gốc (backup AdminDashboard)

Đã hoàn thành:

* Thêm checkbox "Đấu thầu / Mua sắm" với tender fields phụ thuộc
* Thêm Department selection dropdown cho tender
* Thêm thời điểm mở/khóa thầu (start/end date inputs)
* Thêm drag & drop file upload cho tài liệu thầu (PDF, PNG, JPG)
* Thêm hiển thị file đã attach với nút xóa
* Sử dụng framer-motion AnimatePresence cho modal animation
* Import DEPARTMENTS từ data.ts
* Import NewsItem, TenderFile types từ types/models/news

Files affected:

* src/components/admin/tabs/NewsTab.tsx (enhanced)

Bug fixes:

* TypeScript: Import ChangeEvent, DragEvent thay vì React.ChangeEvent
* TypeScript: Import NewsItem type và sử dụng đúng kiểu
* TypeScript: Sửa tenderFile interface từ string thành TenderFile object

Commands executed:

* npm run lint - Passed
* npm run build - Passed

---

## Bug Encoding Trong Admin Tabs

Ngày:

2026-07-19

Vấn đề:

Tất cả các tab files bị encoding corruption - tiếng Việt hiển thị sai (VD: "Tổng số" → "Tá»•ng sá»‘")

Nguyên nhân:

PowerShell file write không đúng encoding UTF-8

Giải pháp:

Viết lại toàn bộ 9 tab files với encoding UTF-8 đúng

Files affected:

* src/components/admin/tabs/OverviewTab.tsx
* src/components/admin/tabs/BookingsTab.tsx
* src/components/admin/tabs/PatientsTab.tsx
* src/components/admin/tabs/ShiftsTab.tsx
* src/components/admin/tabs/SpecialtiesTab.tsx
* src/components/admin/tabs/DoctorsTab.tsx
* src/components/admin/tabs/NewsTab.tsx
* src/components/admin/tabs/OrganizationTab.tsx
* src/components/admin/tabs/LogsTab.tsx

Trạng thái:

Đã sửa.

---

# 🐞 BUGS ĐÃ SỬA

## API Endpoint Không Tồn Tại

Ngày:

2026-07-17

Nguyên nhân:

Middleware ordering sai.

Giải pháp:

* Chuyển Error Handler xuống sau vite.middlewares.

Trạng thái:

Đã sửa.

---

## Broken Images Trong ChoBenhNhanPage & DichVuPage

Ngày:

2026-07-19

Vấn đề:

4 ảnh Unsplash bị lỗi 404 hoặc có ký tự Chinese trong URL

Nguyên nhân:

1. `photo-1587613865765-5e33e4bd57f9` - 404 Not Found
2. `photo-1530026405186-ed1f139313f3` - 404 Not Found
3. `photo-1587613865765-5e33e4零点bd58` - URL có ký tự Chinese (encoding error)
4. `photo-1546823零da49c4d-a3b3b3a9a4c1` - URL có ký tự Chinese (encoding error)

Files affected:

* src/pages/ChoBenhNhanPage.tsx (2 ảnh)
* src/pages/DichVuPage.tsx (2 ảnh)
* src/pages/ChuyenKhoaPage.tsx (1 ảnh - cùng URL với DichVuPage)

Giải pháp:

* Thay `photo-1587613865765-5e33e4bd57f9` → `photo-1551601651-2a8555f1a136`
* Thay `photo-1530026405186-ed1f139313f3` → `photo-1557804506-669a67965ba0`
* Thay `photo-1587613865765-5e33e4零点bd58` → `photo-1559757175-5700dde675bc`
* Thay `photo-1546823零da49c4d-a3b3b3a9a4c1` → `photo-1519494026892-80bbd2d6fd0d`

Trạng thái:

Đã sửa. Đã verify tất cả ảnh thay thế hoạt động tốt.

Commands executed:

* npm run lint - Passed
* npm run build - Passed

---

## Local Images Migration

Ngày:

2026-07-19

Vấn đề:

Phụ thuộc vào external image URLs (Unsplash, Pexels) - có thể bị lỗi 404 hoặc không load được

Giải pháp:

* Tạo folder structure trong `public/images/`
  - `public/images/pages/` - Ảnh cho các trang
  - `public/images/components/` - Ảnh cho components (Hero, WhyChooseUs, Organization)
  - `public/images/doctors/` - Ảnh bác sĩ placeholder
  - `public/images/hero/` - Ảnh hero section
* Download 54 images từ Unsplash/Pexels về local
* Thay thế tất cả external URLs bằng local paths

Files đã update:

* public/images/ (54 images)
* src/pages/ChoBenhNhanPage.tsx (12 replacements)
* src/pages/DichVuPage.tsx (19 replacements)
* src/pages/ChuyenKhoaPage.tsx (20 replacements)
* src/pages/GioiThieuPage.tsx (9 replacements)
* src/pages/LienHePage.tsx (2 replacements)
* src/pages/TinTucPage.tsx (2 replacements)
* src/pages/SoDoToChucPage.tsx (6 replacements)
* src/pages/ThongTinThauPage.tsx (1 replacement)
* src/components/public/Hero.tsx (1 replacement)
* src/components/public/WhyChooseUs.tsx (2 replacements)
* src/components/public/Organization.tsx (3 replacements)
* src/components/admin/tabs/NewsTab.tsx (1 replacement)
* src/components/admin/tabs/DoctorsTab.tsx (1 replacement)

Total: 79 replacements across 13 files

Trạng thái:

✅ Hoàn thành. Không còn external image URLs trong codebase.

Commands executed:

* npm run lint - Passed
* npm run build - Passed

---

# 🔍 QUALITY GATE

Trước khi commit phải đạt:

* npm run lint
* npm run build

---

Checklist:

* UI Consistency
* Responsive
* Accessibility
* No Hardcode
* Memory Updated

---

# 🔀 GIT HISTORY

Xem chi tiết bằng:

```bash
git log --oneline
```

---

# 📁 CURRENT PROJECT STRUCTURE

```text
src/
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── tabs/
│   │       ├── OverviewTab.tsx
│   │       ├── BookingsTab.tsx
│   │       ├── PatientsTab.tsx
│   │       ├── ShiftsTab.tsx
│   │       ├── SpecialtiesTab.tsx
│   │       ├── DoctorsTab.tsx
│   │       ├── NewsTab.tsx
│   │       ├── OrganizationTab.tsx
│   │       ├── LogsTab.tsx
│   │       └── index.ts
│   ├── booking/
│   ├── layout/
│   ├── public/
│   ├── test-lookup/
│   └── ui/
├── context/
│   ├── AdminContext.tsx  # Admin auth & RBAC
│   └── HospitalContext.tsx
├── pages/
├── hooks/
├── lib/
├── types/
├── data/
├── App.tsx
└── main.tsx

server/
├── app.ts
├── routes/
├── services/
├── db/
└── middleware/
```

---

# 📊 PROJECT STATUS

## Trạng thái hiện tại

* Admin Tab Components: ✅ Hoàn thành (9 tabs)
* NewsTab Tender Features: ✅ Hoàn thành
* RBAC System: ✅ Hoàn thành
* UI Components: ✅ Hoàn thành
* Encoding Fix: ✅ Hoàn thành

## Pending Tasks

* Commit các thay đổi từ Phase 11-13
* Testing các tab components

---

# 📝 CHANGE LOG

## Font & Encoding Fixes (2026-07-19)

* Fix Google Fonts link in index.html (Baloo 2 + Be Vietnam Pro)
* Fix --font-display CSS variable to use Baloo 2
* Restore encoding in 13 files from git commit 8f2a512
* Files: Hero.tsx, WhyChooseUs.tsx, Organization.tsx, News.tsx, TinTucPage, SoDoToChucPage, LienHePage, GioiThieuPage, DichVuPage, ChoBenhNhanPage, ChuyenKhoaPage, ThongTinThauPage, TestLookup.tsx

Commands: npm run lint - Passed, npm run build - Passed

---

## HomePage Button Handlers (2026-07-19)

* Add event handlers in HomePage for booking, AI, test lookup, scroll
* Layout listens for bvdk:open-* custom events to trigger modals
* Fix non-functional buttons in Hero, QuickActions, CTABanner, Doctors

Files affected: HomePage.tsx, Layout.tsx

---

## LienHePage Contact Form (2026-07-19)

* Add form state management with useState
* Add handleChange and handleSubmit functions
* Add loading state during submission
* Add success message after submission

Files affected: LienHePage.tsx

---

## Card Style Standardization (2026-07-19)

Apply consistent card styling across all pages and components:
* rounded-2xl (was rounded-[20px])
* border-green-800/5 (was border-green-800/[0.04])
* hover:border-brand-green/30 on hover
* cursor-pointer and group class for interactive cards
* Duration 300ms for smooth transitions

Files affected (13):
* Card.tsx - Base component
* ChuyenKhoaPage.tsx, DichVuPage.tsx, GioiThieuPage.tsx
* SoDoToChucPage.tsx, TinTucPage.tsx, ThongTinThauPage.tsx
* ChoBenhNhanPage.tsx, News.tsx, Doctors.tsx
* Specialties.tsx, Testimonials.tsx, LienHePage.tsx

---

## Full Local Images Migration (2026-07-19)

Replaced 82 external URLs (Unsplash/Pexels) with local images:

Files migrated (11):
* Hero.tsx: Pexels → /images/hero/hero.jpeg
* Organization.tsx: 3 Pexels → /images/components/org-*.jpeg
* WhyChooseUs.tsx: 2 Pexels → /images/components/why-choose-*.jpeg
* GioiThieuPage.tsx: 9 Unsplash → local
* DichVuPage.tsx: 24 Unsplash → local
* ChuyenKhoaPage.tsx: 25 Unsplash → local
* ChoBenhNhanPage.tsx: 10 Unsplash → local
* LienHePage.tsx: 3 Unsplash → local
* SoDoToChucPage.tsx: 6 Unsplash → local
* TinTucPage.tsx: 2 Unsplash → local
* ThongTinThauPage.tsx: 1 Unsplash fallback → local

---

## Additional Image Fixes (2026-07-19)

Fixed broken local image references:
* tiendung-1.jpeg → tiemchung-1.jpeg (DichVuPage)
* thaisy-1.jpeg → sanphukhoa-1.jpeg (DichVuPage)  
* chi-phi-1.jpeg → chiphi-1.jpeg (DichVuPage)
* photo-1586773860418-d37222d8f0a3 → /images/pages/coso-2.jpeg (GioiThieuPage)

---

### ThongTinThauPage Toggle Animation Fix (2026-07-19)

- Sửa animation rotation của nút thu gọn/b-expand department
- Thay `rotate: isExpanded ? 180 : 0` → `rotate: isExpanded ? 360 : 0`
- 90 độ khiến icon nằm ngang, 360 giữ nguyên hướng icon

Files affected: src/pages/ThongTinThauPage.tsx

Commands: npm run lint - Passed, npm run build - Passed

---

### TinTucPage Image Fixes (2026-07-19)

- Sửa 2 đường dẫn ảnh bị sai trong TinTucPage.tsx
- `news-placeholder.jpeg`: `/images/pages/` → `/images/components/` (ảnh nằm trong components folder)
- `chi-phi-1.jpeg` → `chiphi-1.jpeg` (thiếu dấu gạch ngang trong filename)

Files affected: src/pages/TinTucPage.tsx

Commands: npm run lint - Passed, npm run build - Passed

---

### Template

### [Tên thay đổi] ([YYYY-MM-DD])

* Mô tả
* Files affected
* Commands executed

---

# 🚀 COMMANDS

```bash
npm run dev

npm run build

npm run start

npm run lint

npm run clean
```

---

# 🔄 ROLLBACK

```bash
git reset --hard <commit-hash>
```

Hoặc restore từ thư mục backup gần nhất.

---

# 📌 GHI CHÚ QUAN TRỌNG

Mọi thay đổi mới phải:

1. Đọc AGENTS.md
2. Đọc memory.md
3. Thực hiện Self Review
4. Chạy lint
5. Chạy build
6. Cập nhật memory.md
7. Commit

Không bỏ qua bất kỳ bước nào.
