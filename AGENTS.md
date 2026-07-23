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

## 📖 Tài liệu đặc tả UI/UX (nguồn tham chiếu chính)

`dac-ta-uiux-tong-hop-vX.X.docx` là **single source of truth** cho hành vi UI/UX, design token, template trang, RBAC Admin và lược đồ CSDL. AGENTS.md không lặp lại nội dung đặc tả — chỉ nêu quy tắc vận hành khi code.

Bắt buộc:

* Khi một thay đổi làm lệch với đặc tả hiện có (đổi bố cục, đổi luồng, đổi trạng thái) → phải cập nhật docx tương ứng (đánh version mới, ghi vào mục "Nhật ký phiên bản") trong cùng phiên làm việc, không để lệch giữa code và tài liệu.
* Khi một tính năng mới đã triển khai trên code nhưng chưa có trong docx (ví dụ: tính năng dựng nhanh theo yêu cầu gấp) → ghi nhận vào `memory.md` trước, và nêu rõ trong ghi chú "chưa đồng bộ vào đặc tả UI/UX — cần bổ sung ở lần cập nhật docx kế tiếp".
* Không tự ý đổi số mục trong docx khi chỉ thêm nội dung — bổ sung mục mới nối tiếp (mục lớn nhất hiện có + 1), giữ nguyên số mục cũ để không phá cross-reference.

---

# 📋 BẮT ĐẦU MỖI SESSION

## Bắt buộc thực hiện

```bash
# 1. Đọc memory.md trước tiên (trạng thái hiện tại + pending tasks)
cat memory.md

# 2. Nếu cần đối chiếu lịch sử chi tiết trước khi sửa 1 khu vực cụ thể
grep -n "TênTrang\|TênComponent" memory/phase-history.md

# 3. Kiểm tra trạng thái git
git status
git log --oneline -5
```

Không được bỏ qua bước này. Không cần đọc toàn bộ `memory/phase-history.md` mỗi session — chỉ tra cứu phần liên quan khi cần.

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

## Đồng bộ ENUM trạng thái ↔ Badge component

Khi thêm/sửa giá trị ENUM status của bất kỳ bảng nào, bắt buộc trong cùng session:

1. Cập nhật Badge component — không được có giá trị enum nào thiếu màu badge tương ứng.
2. Nếu thay đổi liên quan đến đặc tả UI/UX → cập nhật docx tương ứng (đánh version mới, ghi Nhật ký phiên bản).

Không merge nếu ENUM trong DB nhiều hơn số trạng thái UI có thể hiển thị.

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

### Shared Animation Hooks — Single Source of Truth

Mọi logic animation dùng lặp lại ở nhiều trang **bắt buộc** tái sử dụng từ:

```text
src/hooks/useReducedMotion.ts
src/components/shared/AnimatedCounter.tsx
src/components/shared/FloatingShape.tsx
```

### Không được

```text
Tạo bản sao useReducedMotion/AnimatedCounter/FloatingShape riêng cho từng trang mới
```

### Đúng

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { FloatingShape } from '@/components/shared/FloatingShape';
```

Khi thêm trang catalog mới theo Modern Page Design Pattern (mục 19.1 đặc tả UI/UX), chỉ cấu hình lại data source + bảng màu nhóm (mục 19.1.2) — không viết lại hook/component nền.

Sau khi thêm animation mới ở bất kỳ trang nào: xác nhận lại `prefers-reduced-motion` vẫn tắt/rút gọn đúng hiệu ứng trên **toàn bộ** các trang đang dùng chung hook đó, không chỉ trang vừa sửa.

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
AddCard      (item "thêm mới" trong danh sách Admin — đổi màu qua prop, không tạo bản sao)
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

## EditModal — Chuẩn field bắt buộc (mọi tab CRUD Admin)

Mỗi field trong EditModal phải có:

* `description` — field dùng để làm gì (VD: "Ảnh hero section")
* `hint` — ví dụ thực tế theo đúng ngữ cảnh bệnh viện (VD: "VD: Đặt lịch khám, Chuyên khoa")
* Field dạng link nội bộ: hint luôn nhắc "Bắt đầu bằng /"
* Field có nhiều lựa chọn nội dung mẫu: `suggestions` điều hướng được bằng bàn phím (↑/↓/Enter/Esc)
* Ảnh: có preview + hiệu ứng hover
* Modal tự đóng sau submit thành công

Không tạo EditModal riêng cho từng tab — dùng chung 1 component, khác nhau ở cấu hình field.

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

## Cổng thông tin bệnh nhân (Patient Portal — tích hợp HIS)

Xem đặc tả chi tiết tại mục 20.1 tài liệu UI/UX. Bắt buộc có đủ 5 trạng thái:

```text
Loading                  — đang gọi API tra cứu, khoá input, chặn submit lặp
Empty (chưa tra cứu)     — chỉ hiện PatientLookupForm
Empty (không tìm thấy)   — thông báo thân thiện, không dùng mã lỗi kỹ thuật (VD "404")
Error (API/mạng lỗi)     — banner trung tính + nút "Thử lại"
Result                   — PatientInfoCard + 3 tab (Bệnh sử / CLS / Điều trị)
```

### Bảo mật dữ liệu PHI (Protected Health Information)

* Mọi endpoint đọc dữ liệu bệnh sử/CLS/điều trị bắt buộc yêu cầu `readToken` (hiệu lực 5 phút) lấy từ luồng OTP — không bỏ qua bước xác thực này dù ở môi trường dev/mock.
* Không log nội dung PHI ra console, kể cả khi debug.
* Không lưu `readToken`/OTP trong `localStorage` — chỉ giữ trong state hoặc sessionStorage có thời hạn ngắn tương ứng hiệu lực token.
* Tuân thủ nguyên tắc data minimization: kết quả tra cứu chỉ hiển thị thông tin cần thiết để xác nhận đúng bệnh nhân (họ tên, năm sinh, mã bệnh nhân), không hiển thị thừa.

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

### File Storage Naming Convention

Mọi bảng file đính kèm dùng thống nhất tên cột `file_path` (không dùng `storage_path`/`file_url`/`path`...) — theo mục 15.11 + 21.8.5 spec.

### Notification Logs — Polymorphic Pattern

Không tạo bảng log riêng cho từng tính năng gửi thông báo (SMS/email/push). Dùng chung `notification_logs` với khoá polymorphic (`related_type`, `related_id`) — theo mục 21.5 spec. Vi phạm nguyên tắc này bị coi là Duplicate Component ở tầng dữ liệu.

---

## Không được

```text
Route → Database
```

bỏ qua Service Layer.

---

## 🗄️ DATA RETENTION GOVERNANCE

* **activity_logs** = log tuân thủ (compliance) → **KHÔNG được** viết job xoá/cleanup dưới bất kỳ hình thức nào. Giữ theo quy định pháp luật (mục 14.2).
* **notification_logs** = log vận hành → được phép cleanup job, retention khuyến nghị **180 ngày**, phải có index `(created_at)` trước khi bật job.
* Trước khi thêm bảng log mới, xác định rõ nó thuộc nhóm nào trong 2 nhóm trên và ghi vào memory.md.

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

## Public Form API Standards (feedback / record-request / contact / lab-test / teleconsult)

* Mọi endpoint POST public (không auth) bắt buộc rate limit 5 request/IP/15 phút — không tự ý nới lỏng dù môi trường dev.
* Toàn bộ bảng dạng "request-tracking" dùng chung ENUM status: `moi` / `dang_xu_ly` / `da_xu_ly`. Bảng `record_requests` thêm `da_huy`. Không đặt tên trạng thái mới khác cho tính năng tương tự.
* Nếu form cho phép gửi ẩn danh (không patient_id) → bắt buộc validate có ít nhất 1 kênh liên hệ (`contact_phone` hoặc `contact_email`) trước khi cho submit — theo mục 21.11 spec.
* Không log nội dung góp ý/hồ sơ trích sao ra console — cùng mức thận trọng như PHI dù không phải dữ liệu y tế.

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

## Cấu trúc file memory

```text
memory.md                    → Trạng thái hiện tại: kiến trúc, design token, quy tắc đã chốt,
                                pending tasks, backup gần nhất, con trỏ tới các file dưới.
memory/phase-history.md      → Toàn bộ lịch sử Phase theo thứ tự thời gian tăng dần (append-only).
memory/bugs-fixed.md         → Danh sách bug đã sửa.
```

`memory.md` chỉ giữ những gì cần tra cứu thường xuyên (trạng thái, quy tắc, việc đang dang dở). Lịch sử chi tiết từng Phase nằm ở `memory/phase-history.md`, không lặp lại trong `memory.md`.

---

## ⚠️ Memory Safety Rules (Ngăn rủi ro Outdated Memory / PHI Leakage / State Conflict)

### Memory Invalidation — Ngăn Outdated Memory Pollution

* Khi spec version tăng (VD: v2.9 → v2.10), **BẮT BUỘC** cập nhật memory.md TRONG CÙNG SESSION
* Luôn verify memory vs file gốc (spec docx, source code) trước khi hành động — không trust memory khi nghi ngờ lệch
* Nếu phát hiện memory lệch → cập nhật NGAY, không chờ

### PHI Zero-Tolerance — Ngăn Security Compliance Leakage

* **KHÔNG** lưu bất kỳ PHI nào vào memory (dù là sample/test data) — cấm tuyệt đối
* Chỉ dùng **synthetic data** trong mọi test, không dùng dữ liệu thật của bệnh nhân
* Nếu vô tình lưu PHI vào memory → phải invalidate NGAY lập tức

### Single Source Alignment — Ngăn State Conflict

* Khi dùng memory.md để hành động → luôn cross-check với file thực (spec, source code)
* Không "nhảy cóc" bước dù memory có vẻ "đầy đủ"
* Luôn đọc lại file trước khi confirm bất kỳ quyết định nào

---

## Bắt buộc cập nhật khi

* Thêm feature
* Sửa bug
* Refactor
* Backup
* Config
* Design System

→ Ghi entry mới vào `memory/phase-history.md` (hoặc `bugs-fixed.md` nếu là bug), sau đó cập nhật phần "Trạng thái hiện tại" trong `memory.md` nếu thay đổi ảnh hưởng đến kiến trúc/quy tắc đang áp dụng.

---

## Đánh số Phase — bắt buộc kiểm tra trước khi ghi

Trước khi tạo entry Phase mới:

```bash
grep -oE "^## PHASE [0-9]+" memory/phase-history.md | grep -oE "[0-9]+" | sort -n | tail -1
```

Số Phase mới = số lớn nhất hiện có + 1. **Không được** dùng lại số Phase đã tồn tại, kể cả khi phiên làm việc trước đó không nhìn thấy do file dài. Nếu phát hiện 2 Phase trùng số trong lịch sử cũ, không tự renumber (vì có thể đã bị tham chiếu ở dactaupdate.md hoặc tài liệu UI/UX) — disambiguate bằng hậu tố chữ cái (VD: `15-A`, `15-B`) và ghi chú lý do.

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
