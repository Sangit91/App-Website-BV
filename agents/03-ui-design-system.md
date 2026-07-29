# 03 — UI Governance & Design System

> Thuộc: `AGENTS.md` (index). UI Governance + Design System + Animation Pattern.

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
