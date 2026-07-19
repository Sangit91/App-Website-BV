# PHỤ LỤC CẬP NHẬT - PHASE 11-13
## Dac-ta-uiux-tong-hop.docx - Updates so với phiên bản gốc

**Ngày cập nhật:** 2026-07-19
**Tác giả:** Agent (OpenCode)
**Commit:** 8f2a512

---

## MỤC LỤC

1. [Tổng quan thay đổi](#1-tổng-quan-thay-đổi)
2. [Admin Dashboard - RBAC (Section 9.1)](#2-admin-dashboard---rbac-section-91)
3. [Admin Dashboard - 9 Tabs (Section 9.2-9.7)](#3-admin-dashboard---9-tabs-section-92-97)
4. [NewsTab Enhancement - Tender Features (Section 9.6)](#4-newstab-enhancement---tender-features-section-96)
5. [Type Updates](#5-type-updates)
6. [Technical Implementation Notes](#6-technical-implementation-notes)
7. [Quality Gate Status](#7-quality-gate-status)
8. [Backup Information](#8-backup-information)

---

## 1. Tổng quan thay đổi

| Phase | Ngày | Mô tả |
|-------|------|-------|
| Phase 11 | 2026-07-19 | Tạo AdminContext, AdminLogin, AdminSidebar, AdminHeader |
| Phase 12 | 2026-07-19 | Tách AdminDashboard thành 9 tab components |
| Phase 13 | 2026-07-19 | Nâng cấp NewsTab với Tender Features |

**Files changed:** 19 files | **Insertions:** 2,633 | **Deletions:** 3,005

---

## 2. Admin Dashboard - RBAC (Section 9.1)

### 2.1 Theo đặc tả gốc
```
Section 9.1: Xác thực & Phân quyền (RBAC)
- Super Admin: Toàn quyền
- Lễ tân (Receptionist): Chỉ truy cập Lịch hẹn, Bệnh nhân, Tổng quan
- Bác sĩ (Doctor): Chỉ truy cập lịch trực và bệnh nhân của mình
```

### 2.2 Đã implement
- ✅ **AdminContext.tsx** - Quản lý login state và RBAC
- ✅ **AdminLogin.tsx** - Màn hình đăng nhập với role selection
- ✅ **AdminSidebar.tsx** - Sidebar navigation động theo role
- ✅ **AdminHeader.tsx** - Header với page title và user info

### 2.3 Ghi chú
- Giữ nguyên 3 roles: Super Admin, Department Admin (thay vì Receptionist), Doctor
- Department Admin = Lễ tân theo đặc tả
- Lưu state ở client (AdminContext) cho demo/prototype

---

## 3. Admin Dashboard - 9 Tabs (Section 9.2-9.7)

### 3.1 Theo đặc tả gốc
```
Section 9.2: Bố cục & Điều hướng
- Sidebar trái cố định 260px
- 9 mục điều hướng: Tổng quan, Lịch hẹn, Bệnh nhân, Lịch trực, Chuyên khoa, Bác sĩ, Tin tức, Nhật ký

Section 9.3: Màn hình Tổng quan
- 4 thẻ chỉ số + Bảng lịch hẹn gần đây

Section 9.4: Quản lý Lịch hẹn & Bệnh nhân
- Danh sách bệnh nhân + Quản lý lịch hẹn

Section 9.5: Lịch trực Bác sĩ
- Lưới ca trực 7 ngày × bác sĩ

Section 9.6: CRUD chuẩn (Chuyên khoa, Bác sĩ, Tin tức)
- Modal overlay với hiệu ứng phóng to
- Validate, Xóa xác nhận

Section 9.7: Nhật ký hoạt động
- Bảng chỉ đọc, format: [Thời gian] | [Người dùng] | [Hành động]
```

### 3.2 Đã implement

| Tab | File | Mô tả | Status |
|-----|------|-------|--------|
| Tổng quan | `OverviewTab.tsx` | 4 metric cards + 5 lịch hẹn gần nhất | ✅ |
| Lịch hẹn | `BookingsTab.tsx` | Search, filter, approve/cancel, xuất Excel, in PDF | ✅ |
| Bệnh nhân | `PatientsTab.tsx` | Danh sách bệnh nhân với search | ✅ |
| Lịch trực | `ShiftsTab.tsx` | Ma trận phân ca 7 ngày × ca (Sáng/Chiều/Nghỉ) | ✅ |
| Chuyên khoa | `SpecialtiesTab.tsx` | CRUD với modal | ✅ |
| Bác sĩ | `DoctorsTab.tsx` | CRUD với modal | ✅ |
| Tin tức | `NewsTab.tsx` | CRUD + Tender Features (xem mục 4) | ✅ |
| Tổ chức | `OrganizationTab.tsx` | CRUD sơ đồ tổ chức với modal | ✅ |
| Nhật ký | `LogsTab.tsx` | Audit logs read-only | ✅ |

### 3.3 Ghi chú
- Đã thêm **OrganizationTab** (quản lý khoa/phòng) - không có trong spec gốc nhưng cần thiết
- Đã thêm file `tabs/index.ts` để export tất cả tabs

---

## 4. NewsTab Enhancement - Tender Features (Section 9.6)

### 4.1 Theo đặc tả gốc
```
Section 9.6: CRUD Tin tức
- Header: Tiêu đề trang + nút "Thêm mới +"
- Bảng: Ảnh/Avatar, Tên/Tiêu đề, Phòng ban/Danh mục, Trạng thái, Hành động
- Form: Modal overlay, validate, tự động điền ảnh placeholder
```

### 4.2 Nâng cấp đã thêm

#### 4.2.1 Checkbox "Đấu thầu" (MỚI)
```
Trong spec gốc: Không có
Đã thêm:
- Checkbox "Đây là thông tin Đấu thầu / Mua sắm trang thiết bị y khoa"
- Khi check: tự động set tag = "Thông báo"
- Khi check: điền default dates "08:00:00 ngày 15/07/2026" và "17:00:00 ngày 25/07/2026"
- Hiển thị conditional fields phụ thuộc bên dưới
```

#### 4.2.2 Department Selection (MỚI)
```
Trong spec gốc: Không có
Đã thêm:
- Dropdown chọn "Khối / Phòng ban quản lý thầu"
- Super Admin: chọn từ danh sách DEPARTMENTS (data.ts)
- Department Admin: hiển thị department của tài khoản (readonly)
```

#### 4.2.3 Tender Date Inputs (MỚI)
```
Trong spec gốc: Không có
Đã thêm:
- Input "Thời điểm mở thầu" (tenderStartDate)
- Input "Thời điểm khóa thầu" (tenderEndDate)
- Placeholder: "Ví dụ: 08:00:00 ngày 15/07/2026"
```

#### 4.2.4 Drag & Drop File Upload (MỚI)
```
Trong spec gốc: Không có
Đã thêm:
- Drag & drop zone với visual feedback
- Hỗ trợ định dạng: .pdf, .png, .jpg, .jpeg
- Kích thước tối đa: 10MB
- Click to browse file
- Input ẩn type="file"
```

#### 4.2.5 File Preview (MỚI)
```
Trong spec gốc: Không có
Đã thêm:
- Hiển thị tên file + kích thước (KB)
- Icon Paperclip màu green
- Nút X để remove file
- Border dashed khi chưa có file, border solid khi đã attach
```

#### 4.2.6 Modal Animation (MỚI)
```
Trong spec gốc: Có mô tả "hiệu ứng phóng to"
Đã implement cụ thể:
- framer-motion AnimatePresence
- Scale animation: 0.95 → 1.0 khi mở
- Opacity animation: 0 → 1 khi mở
- Reverse khi đóng
```

### 4.3 So sánh Modal News

| Tính năng | Spec gốc | Đã implement |
|-----------|----------|-------------|
| Tiêu đề | ✅ | ✅ |
| Tag selector | ✅ | ✅ |
| Tóm tắt | ✅ | ✅ |
| Ảnh minh họa | ✅ | ✅ |
| Nội dung chi tiết | ✅ | ✅ |
| Checkbox Đấu thầu | ❌ | ✅ MỚI |
| Department selection | ❌ | ✅ MỚI |
| Tender start date | ❌ | ✅ MỚI |
| Tender end date | ❌ | ✅ MỚI |
| File upload | ❌ | ✅ MỚI |
| File preview | ❌ | ✅ MỚI |
| Animation | Mô tả chung | framer-motion |

---

## 5. Type Updates

### 5.1 File: `src/types/models/news.ts`

#### Theo đặc tả gốc (Section 15.2)
```typescript
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  tag: NewsTag;
  date: string;
  image: string;
  content?: string;
}
```

#### Đã thêm (cho Tender Features)
```typescript
export interface TenderFile {
  name: string;
  size: string;
  url?: string;
  fileType?: string;
}

export interface NewsItem {
  // ... fields cũ ...
  isTender?: boolean;
  tenderNumber?: string;
  tenderStartDate?: string;
  tenderEndDate?: string;
  tenderFile?: TenderFile;        // Đổi từ string thành object
  tenderDept?: string;
  tenderMethod?: TenderMethod;    // enum mới
  tenderEstimateValue?: string;
  tenderReceivedLocation?: string;
  tenderContact?: string;
  tenderContactPhone?: string;
  tenderDownloadCount?: number;
}
```

### 5.2 Import trong NewsTab.tsx
```typescript
import { NewsItem, TenderFile } from "../../../types/models/news";
```

---

## 6. Technical Implementation Notes

### 6.1 Design System Compliance
- ✅ Sử dụng design tokens từ `index.css` (không hardcode colors)
- ✅ Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64
- ✅ Border radius: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`
- ✅ Shadow: `shadow-sm`, `shadow-md`, `shadow-lg`
- ✅ Typography: Baloo 2 (heading), Be Vietnam Pro (body)

### 6.2 UI Components sử dụng
- ✅ `Button` (với type prop: submit/button/reset)
- ✅ `Card` (variant: default, padding: lg)
- ✅ `Badge`
- ✅ `Spinner` (nếu cần)

### 6.3 Accessibility
- ✅ Keyboard navigation: Tab, Shift+Tab, Enter, Esc
- ✅ Focus states visible (focus-visible ring)
- ✅ `aria-label` cho icon buttons
- ✅ Form labels với proper associations

### 6.4 Framer Motion
- ✅ AnimatePresence cho modal
- ✅ Motion div với initial/animate/exit states
- ✅ Scale transition cho News modal

---

## 7. Quality Gate Status

| Check | Status |
|-------|--------|
| npm run lint | ✅ Passed |
| npm run build | ✅ Passed |
| UI Consistency | ✅ Passed |
| Responsive | ✅ Passed |
| Accessibility | ✅ Passed |
| No Hardcode | ✅ Passed |
| Memory Updated | ✅ Passed |

---

## 8. Backup Information

**Backup location:** `D:\Coding\code backup\App Website BV_20260719_150635`
**Files backed up:** 141 files (full project)
**Ngày backup:** 2026-07-19 15:06:35

---

## 9. Git History

```
Commit: 8f2a512
Message: feat: implement admin dashboard with 9 tabs and RBAC
Branch: master
Date: 2026-07-19

Files changed (19):
- src/context/AdminContext.tsx (new)
- src/components/admin/AdminHeader.tsx (new)
- src/components/admin/AdminLogin.tsx (new)
- src/components/admin/AdminSidebar.tsx (new)
- src/components/admin/tabs/ (9 files new)
- src/components/admin/AdminDashboard.tsx (deleted)
- src/components/ui/Button.tsx (updated)
- src/pages/AdminPage.tsx (updated)
- src/main.tsx (updated)
- memory.md (updated)
```

---

## 10. Hướng dẫn cập nhật vào dac-ta-uiux-tong-hop.docx

### 10.1 Vị trí thêm nội dung
Thêm vào cuối document, trước phần `17.4 Danh sách tài liệu tham chiếu kèm theo`

### 10.2 Section mới cần thêm

#### Section 18: Admin Dashboard - Implementation Phase 11-13

**18.1 RBAC Implementation (Extension of Section 9.1)**
- Mô tả 3 roles đã implement
- Files: AdminContext.tsx, AdminLogin.tsx, AdminSidebar.tsx, AdminHeader.tsx

**18.2 9 Tabs Architecture (Extension of Section 9.2-9.7)**
- Bảng 9 tabs với file names
- Ghi chú OrganizationTab (bổ sung)

**18.3 NewsTab Enhancement - Tender Features (Extension of Section 9.6)**
- Mô tả chi tiết 6 tính năng mới:
  1. Checkbox Đấu thầu
  2. Department Selection
  3. Tender Date Inputs
  4. Drag & Drop File Upload
  5. File Preview
  6. Modal Animation (framer-motion)

**18.4 Type Updates (Extension of Section 15)**
- Interface TenderFile
- Extended NewsItem interface với tender fields

**18.5 Technical Implementation Notes**
- Design System compliance
- UI Components
- Accessibility

**18.6 Quality Gate Status**
- Bảng 7 checks đã pass

### 10.3 Cập nhật Section 17.3 (Nhật ký phiên bản)
Thêm row mới:
```
2.5 | 2026-07-19 | Thêm Section 18: Admin Dashboard Implementation Phase 11-13
```

---

## 11. Liên kết related

- **memory.md** - Project memory với Phase history
- **src/components/admin/tabs/NewsTab.tsx** - Implement source code
- **src/types/models/news.ts** - Type definitions

---

**Document created:** 2026-07-19
**Last updated:** 2026-07-19
**Status:** ✅ Complete - Ready for manual merge into dac-ta-uiux-tong-hop.docx