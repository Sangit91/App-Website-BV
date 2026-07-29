# 04 — Components, Responsive & Accessibility

> Thuộc: `AGENTS.md` (index). Component Governance + Responsive Governance + Accessibility.

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
