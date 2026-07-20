# AGENTS.md - BVĐK Website

## 🎯 MỤC TIÊU

Agent tham gia dự án phải hoạt động như một Senior Software Architect, Frontend Architect và UX Reviewer.

Mục tiêu:

* Duy trì chất lượng code lâu dài
* Giữ giao diện đồng nhất toàn hệ thống
* Tránh phát sinh technical debt
* Đảm bảo accessibility
* Đảm bảo trải nghiệm người dùng trong môi trường bệnh viện
* Không làm hỏng kiến trúc đã có

---

# 📋 BẮT ĐẦU MỖI SESSION

## Bắt buộc thực hiện

```bash
# 1. Đọc memory.md trước tiên
cat memory.md

# 2. Kiểm tra trạng thái git
git status
git log --oneline -5
```

Không được bỏ qua bước này.

---

# 🔑 NGUYÊN TẮC VÀNG

## Luôn trả lời bằng tiếng Việt

Mọi giải thích, commit suggestion, review, phản biện đều dùng tiếng Việt.

---

## Luôn đọc memory.md trước

Không được code trước khi hiểu:

* Kiến trúc hiện tại
* Các phase đã hoàn thành
* Các bug đã sửa
* Các quy tắc đã thống nhất

---

## Luôn cập nhật memory.md sau thay đổi

Bất kỳ thay đổi nào liên quan đến:

* Feature mới
* Refactor
* Bug fix
* Config
* Backup
* UI System

đều phải cập nhật memory.md.

---

## Không tạo technical debt

Không được:

* Copy paste code
* Duplicate component
* Hardcode dữ liệu
* Hardcode màu sắc
* Hardcode spacing
* Hardcode typography

---

## Không sử dụng any

TypeScript strict mode là bắt buộc.

Ví dụ:

```ts
const data: any
```

Không được phép.

---

# 🔄 QUY TRÌNH LÀM VIỆC

```text
Đọc memory.md
↓
Phân tích yêu cầu
↓
Đánh giá ảnh hưởng hệ thống
↓
Code
↓
Self Review
↓
UX Review
↓
Accessibility Review
↓
Performance Review
↓
npm run lint
↓
npm run build
↓
Update memory.md
↓
Commit
```

---

# 🏗️ KIẾN TRÚC DỰ ÁN

## Frontend

```text
src/
├── components/
├── pages/
├── context/
├── hooks/
├── lib/
├── data/
├── types/
```

---

## Backend

```text
server/
├── routes/
├── services/
├── db/
├── middleware/
```

---

## Data Flow

```text
Database
↓
Services
↓
Routes
↓
Frontend
↓
Components
```

---

# 📦 STATE MANAGEMENT

## Single Source of Truth

HospitalContext là nguồn dữ liệu chính.

Không tạo context mới nếu HospitalContext có thể xử lý.

---

## Không được

```text
Context lồng Context
```

trừ khi có tài liệu kiến trúc giải thích.

---

# 🎨 UI GOVERNANCE

## Nguyên tắc

Mọi giao diện phải:

* Đồng nhất
* Dễ sử dụng
* Có khả năng tái sử dụng
* Responsive
* Accessibility

---

## InfoCard - Full Card Clickability

Mọi card có `cursor-pointer` phải có action khi click.

### Không được

```tsx
<div className="cursor-pointer">
  <img ... />
  <div>Content</div>
  <button onClick={handleAction}>Action</button>  // ❌ Chỉ button click được
</div>
```

### Đúng

```tsx
<div className="cursor-pointer" onClick={handleAction}>
  <img ... />
  <div>Content</div>
  <button onClick={(e) => { e.stopPropagation(); handleAction(); }}>Action</button>  // ✅ Cả card click được
</div>
```

---

## Modal Pattern cho Content-Heavy Sections

Khi card hiển thị thông tin chi tiết, ưu tiên **Modal** thay vì **inline sections**.

### Ưu tiên Modal khi

* Content dài (scroll nhiều)
* Cần search/filter
* Cần nhiều interaction (form, search)
* Tránh page bị kéo dài

### Inline Sections (Scroll) khi

* Content ngắn gọn (< 10 lines)
* Không cần interaction
* Thông tin bổ sung không quan trọng

### Modal Components đã có

| Modal | File | Khi click vào |
|-------|------|---------------|
| RecordRequestModal | RecordRequestModal.tsx | "Yêu cầu trích sao hồ sơ" |
| FeedbackModal | FeedbackModal.tsx | "Góp ý chất lượng phục vụ" |
| MapModal | MapModal.tsx | "Cơ sở điều trị" |
| DrugLookupModal | DrugLookupModal.tsx | "Danh mục thuốc BHYT" |
| InpatientGuideModal | InpatientGuideModal.tsx | "Bệnh nhân nội trú" |
| OutpatientGuideModal | OutpatientGuideModal.tsx | "Thăm khám ngoại trú" |
| ServicesModal | ServicesModal.tsx | "Dịch vụ điều trị" |

---

# 🎨 DESIGN SYSTEM

## Typography

Chỉ sử dụng:

```text
H1
H2
H3
Body
Caption
```

Không tạo font-size tùy ý.

---

## Spacing Scale

Chỉ sử dụng:

```text
4
8
12
16
24
32
48
64
```

Không dùng:

```text
p-[13px]
mt-[17px]
gap-[19px]
```

---

## Shadow

Chỉ sử dụng:

```text
shadow-sm
shadow-md
shadow-lg
```

---

## Color System

Không hardcode màu.

Không dùng:

```tsx
text-[#123456]
bg-[#123456]
```

Phải dùng design token hoặc biến hệ thống.

### Design Tokens (CSS Variables)

Định nghĩa trong `src/index.css`:

```css
--color-brand-green: #2FA968;   /* text-brand-green, bg-brand-green */
--color-green-dark: #164B36;     /* text-green-dark, bg-green-dark */
--color-mint: #EAF7EE;           /* bg-mint, text-mint */
--color-cream-white: #FCFBF7;   /* bg-cream-white */
--color-peach: #FFA265;          /* text-peach, bg-peach */
--color-ink: #22302A;            /* text-ink */

--radius-pill: 999px;            /* rounded-full */
--radius-lg: 28px;               /* rounded-3xl */
--radius-md: 20px;              /* rounded-2xl */
--radius-sm: 14px;              /* rounded-lg */
```

### Border Radius

Chỉ sử dụng:

```text
rounded-sm      (7px)
rounded-md      (14px)
rounded-lg      (14px - theo radius-sm)
rounded-xl      (16px)
rounded-2xl     (20px - theo radius-md)
rounded-3xl     (28px - theo radius-lg)
rounded-full    (999px - theo radius-pill)
```

---

## 🎬 ANIMATION PATTERN

### Modern Page Design Pattern (Section 19.1 v2.7)

Áp dụng cho các trang: ChuyenKhoaPage, DichVuPage, ChoBenhNhanPage, GioiThieuPage, TinTucPage, ThongTinThauPage.

**Cấu trúc 5 khối:**

1. **Hero Section** - Full viewport với parallax
   - Nền: gradient chéo 3 tông (green-dark → green-800 → brand-green)
   - 4 FloatingShape tự trôi nổi (chu kỳ 8s, easeInOut)
   - Text chia 2 phần bay lên + fade (so le 100ms)
   - Stats cards với AnimatedCounter (2 giây, useInView once: true)
   - Scroll indicator bouncing ở đáy
   - Parallax: opacity 1→0, scale 1→1.1 khi scroll

2. **Sticky Tab Navigation** - Glassmorphism
   - Sticky top-0, z-50
   - Nền trắng 80% + backdrop-blur
   - Hover: scale 1.02, bấm: scale 0.98
   - Tab đang chọn: gradient theo màu nhóm

3. **Featured Card** - Clip-path reveal + Ken Burns
   - Ảnh: clip-path inset(100% 0 0 0) → inset(0% 0 0 0) trong 0.8s
   - Ken Burns: scale 1.2× → 1.0× trong 1.2s
   - Content trượt vào từ phải, so le từng dòng

4. **Services Grid** - 3D Tilt Cards
   - 3D tilt: ±8°, perspective 1000px
   - Hover: scale 1.02, glow effect, border gradient
   - Image zoom 1.1× khi hover
   - translateZ khi hover để tăng chiều sâu

5. **Tab Transitions** - AnimatePresence
   - Exit: opacity 0, y -20
   - Enter: opacity 1, y 0
   - Duration: 0.4s, mode "wait"

### prefers-reduced-motion

Theo section 19.1.6 v2.7, mọi animation phải tôn trọng `prefers-reduced-motion`:

```tsx
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
```

Khi bật:
- Tắt parallax, floating, tilt effects
- Chỉ giữ fade transitions tối thiểu
- Giữ nguyên nội dung và chức năng

---

# 🧩 COMPONENT GOVERNANCE

## Reusable Components

Bắt buộc sử dụng:

```text
Button
Input
Select
Modal
Card
Badge
Spinner
ErrorBoundary
```

---

## Không tạo component mới nếu

* Chỉ khác màu
* Chỉ khác spacing
* Chỉ khác icon

Hãy mở rộng component hiện có.

---

## Component phải có

* Props interface riêng
* TypeScript typing đầy đủ
* Responsive
* Loading state nếu cần
* Error state nếu cần

---

# 📱 RESPONSIVE GOVERNANCE

## Mobile First

Mọi giao diện phải hoạt động trên:

```text
375px
768px
1024px
1440px
```

---

## Không được

```tsx
w-[1200px]
```

Ưu tiên:

```tsx
w-full
max-w-7xl
```

---

# ♿ ACCESSIBILITY

Website bệnh viện phải tuân thủ WCAG cơ bản.

---

## Form

Mọi input phải có:

```tsx
<label>
id
name
```

---

## Icon Button

Bắt buộc:

```tsx
aria-label
```

---

## Keyboard Navigation

Mọi chức năng phải hoạt động bằng:

```text
Tab
Shift+Tab
Enter
Esc
```

---

## Focus State

Không được xoá:

```css
outline
focus
focus-visible
```

nếu không có giải pháp thay thế.

---

## Contrast

Không sử dụng màu chữ có độ tương phản thấp.

Người lớn tuổi phải đọc được.

---

# 🏥 HOSPITAL UX STANDARDS

## Booking Form

Bắt buộc có:

### Loading State

```text
Đang gửi yêu cầu...
```

---

### Success State

```text
Đặt lịch thành công
```

---

### Error State

```text
Không thể gửi yêu cầu
```

---

### Validation

Hiển thị lỗi dưới field.

Không sử dụng alert().

---

## Test Lookup

Bắt buộc có:

```text
Loading State
Empty State
Error State
Result State
```

---

## AI Advisor

Bắt buộc có:

```text
Thinking State
Response State
Error State
```

---

## Hotline

Hotline phải luôn dễ nhìn thấy.

---

## Liên hệ

Thông tin liên hệ phải luôn xuất hiện ở:

* Footer
* Trang Liên hệ

---

# 🔧 SERVER/API GOVERNANCE

## Routes

Chỉ xử lý:

* Request
* Validation
* Response

Không chứa business logic.

---

## Services

Chỉ xử lý:

* Business Logic

---

## Database Layer

Chỉ xử lý:

* Data Access

---

## Không được

```text
Route → Database
```

bỏ qua Service Layer.

---

## HIS API Standards

### API Versioning

Tất cả HIS endpoints phải có prefix `/api/v1/*`:

```text
/api/v1/patients/*
/api/v1/auth/*
/api/v1/appointments/*
```

### Authentication Flow

```
1. POST /api/v1/auth/token/access → accessToken + refreshToken
2. Use accessToken in Authorization header
3. POST /api/v1/auth/token/refresh → new accessToken (when expired)
```

### OTP Flow cho PHI (Protected Health Information)

```
1. POST /api/v1/auth/otp/send → sessionId (OTP sent to phone)
2. POST /api/v1/auth/otp/verify → readToken (5 min expiry)
3. Use readToken to access PHI endpoints
```

### Check-Patient Flow (2 bước)

```
Bước 1: POST /api/v1/appointments/check-patient
  → Trả về patientCode (existing or newly created)

Bước 2: POST /api/v1/appointments
  → Dùng patientCode từ bước 1 để tạo lịch hẹn
```

### Data Standards

* **ICD-10** cho mã bệnh danh (`icd10_code`)
* **LOINC** cho mã cận lâm sàng (`loinc_code`)

---

# 🔍 SELF REVIEW BẮT BUỘC

Sau khi code xong phải tự đánh giá.

## Code Review

* Có duplicate code không?
* Có reusable component không?
* Có hardcode không?
* Có vi phạm SRP không?

---

## UI Review

* Có đồng nhất giao diện không?
* Có đúng design system không?
* Có responsive không?

---

## UX Review

* Người dùng mới có hiểu không?
* Có quá nhiều thao tác không?
* Có thông báo lỗi rõ ràng không?

---

## Accessibility Review

* Keyboard hoạt động?
* Screen reader đọc được?
* Contrast đạt yêu cầu?

---

## Performance Review

* Có render thừa không?
* Có state thừa không?
* Có API gọi lặp không?

---

# 📝 MEMORY MANAGEMENT

## Bắt buộc cập nhật memory.md khi

* Thêm feature
* Sửa bug
* Refactor
* Backup
* Config
* Design System

---

## Format

```markdown
### [Tên thay đổi] ([YYYY-MM-DD])

- Mô tả
- Files affected
- Commands
```

---

# 🚧 BACKUP POLICY

Trước refactor lớn:

```powershell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

New-Item -ItemType Directory `
-Path "D:\Coding\code backup\App Website BV_$timestamp" `
-Force

Copy-Item `
-Path ".\*" `
-Destination "D:\Coding\code backup\App Website BV_$timestamp" `
-Recurse `
-Exclude node_modules,.git,dist
```

---

# 🔀 GIT POLICY

## Commit Message

```text
feat:
fix:
refactor:
chore:
docs:
```

---

## Ví dụ

```text
feat: add appointment booking workflow

fix: resolve navbar overflow issue

refactor: migrate booking components

docs: update memory after phase 11
```

---

# ✅ QUALITY GATE

Trước khi commit phải đạt toàn bộ:

```bash
npm run lint
npm run build
```

---

## Checklist

```text
✓ Lint Passed

✓ Build Passed

✓ UI Consistency

✓ Responsive

✓ Accessibility

✓ No Hardcode

✓ Memory Updated

✓ Self Review Completed
```

Nếu bất kỳ mục nào thất bại:

Không được commit.

---

# 🚫 NHỮNG VIỆC KHÔNG ĐƯỢC PHÉP

❌ Bỏ qua memory.md

❌ Commit khi lint lỗi

❌ Commit khi build lỗi

❌ Hardcode màu sắc

❌ Hardcode spacing

❌ Dùng any

❌ Duplicate component

❌ Tạo context không cần thiết

❌ Viết business logic trong routes

❌ Bỏ qua accessibility

❌ Bỏ qua responsive

❌ Bỏ qua loading/error states

---

# 🎯 ĐỊNH NGHĨA THÀNH CÔNG

Một thay đổi được xem là hoàn thành khi:

* Code chạy đúng
* Lint pass
* Build pass
* Responsive
* Accessibility đạt yêu cầu
* Đồng bộ UI toàn hệ thống
* Không phát sinh technical debt
* memory.md được cập nhật
* Có thể bảo trì lâu dài

```
```
