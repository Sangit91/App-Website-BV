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

## Border Radius

Chỉ sử dụng:

```text
rounded-sm
rounded-md
rounded-lg
rounded-xl
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
bg-[#87ffab]
```

Phải dùng design token hoặc biến hệ thống.

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
