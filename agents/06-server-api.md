# 06 — Server/API Governance

> Thuộc: `AGENTS.md` (index). Routes/Services/Database Layer + Data Retention + HIS API Standards + Public Form API Standards.

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
