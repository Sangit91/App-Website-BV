# 05 — Hospital UX Standards

> Thuộc: `AGENTS.md` (index). Booking / Test Lookup / Patient Portal / AI Advisor / Hotline / Liên hệ.

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
