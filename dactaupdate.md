# Design Document - BVĐK Website

> **Nguồn tham chiếu chính:** `dac-ta-uiux-tong-hop-v2.9.md` (single source of truth)
> File này chỉ ghi nhận các bổ sung/changes không có trong spec chính.

---

## Thông tin bệnh viện

**Tên đầy đủ:** Bệnh Viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam

**Địa chỉ:** 107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng

**Lãnh đạo:**

| Chức vụ | Họ tên |
|---------|--------|
| Giám đốc | BS CKII Nguyễn Thống Nhất |
| Phó Giám đốc | BSCK II Lê Minh Dũng |
| Phó Giám đốc | BS CKII Nguyễn Đình Hoàng |

---

## Database Gap Review — v2.9 (2026-07-22)

> Sau khi review toàn bộ spec v2.9 (3935 dòng), ghi nhận trạng thái các bảng CSDL.

### Nhóm A: Đã có đầy đủ trong spec v2.9 ✅

| Bảng | Mục spec | Chi tiết |
|------|----------|----------|
| patients | 15.3, 14.5 | 9 fields + encryption + soft-delete ✅ |
| appointments | 15.4 | Đầy đủ, có cancel workflow |
| admin_users | 15.5 | 10 fields + MFA + department_id |
| activity_logs | 15.5 | Read-only, 6 fields |
| doctors | 15.10 | 7 fields + relationship |
| doctor_schedules | 15.10 | weekday + shift ENUM |
| specialties | 15.10 | 7 fields + slug |
| news | 15.10, 15.9 | Full + 9 tender fields (v2.5) |
| organization_units | 15.9 | Tree structure + type ENUM |
| feedback_requests | 21.2 | 11 fields (chính thức hoá từ Phase 48) ✅ |
| record_requests | 21.3 | 11 fields + request_code UNIQUE ✅ |
| record_request_files | 21.3 | 7 fields ✅ |
| notification_logs | 21.5 | Polymorphic ✅ |

### Nhóm B: Có trong spec nhưng field-level còn sơ lược ⚠️

| Bảng | Mục spec | Hiện tại | Cần bổ sung |
|------|----------|----------|-------------|
| **service_groups** | 15.10 | name, description | Thiếu: id (PK), slug, sort_order, is_active |
| **services** | 15.10 | name, group_id, icon_key, description | Thiếu: id (PK), slug, sort_order, is_active, price |
| **news_categories** | 15.10 | (chỉ liệt kê tên 6 chuyên mục) | Thiếu: id (PK), slug, description, sort_order |
| **price_list** | 15.10 | item_name, price, unit, insurance_note | Thiếu: id (PK), service_id FK, group_id FK, is_active |
| **tender_files** | 15.9 | file_name, file_size, storage_path, uploaded_by | Thiếu: id (PK) rõ ràng, mime_type |
| **testimonials** | 7.10, 12, 15.2 | (chỉ ghi "cần duyệt nội dung") | Thiếu: id (PK), patient_name, service_id FK, content, rating, is_approved, created_at |
| **contact_messages** | 8.6, 15.2 | (chỉ ghi FK patient_id) | Thiếu: id (PK), name, email, phone, subject, content, status, created_at |
| **lab_test_requests** | 8.5, 15.2 | (chỉ ghi trong 15.2) | Thiếu: id (PK), patient_id, patient_name, service_type, address, scheduled_date, status |
| **teleconsult_requests** | 8.5, 15.2 | (chỉ ghi trong 15.2) | Thiếu: id (PK), patient_id, patient_name, specialty_id, reason, requested_time, status |

### Nhóm C: Bảng roadmap — chưa cần triển khai ngay (mục 21.5) 📋

| Bảng | Mục spec | Ghi chú |
|------|----------|---------|
| prescription_refill_requests | 21.5 | Cấp lại đơn thuốc online |
| insurance_verifications | 21.5 | Kiểm tra quyền lợi BHYT |
| appointment_reminders | 21.5 | Nhắc lịch khám |
| queue_tickets | 21.5 | Hàng đợi số thứ tự khám |

**Nguyên tắc (mục 21.1):** 4 bảng Nhóm C chỉ dùng khi tính năng tương ứng được phê duyệt triển khai — tránh bảng rỗng không dùng đến.

---

## Enum Values — Cần xác nhận đầy đủ

| Field | Giá trị đã thấy trong spec | Trạng thái |
|-------|---------------------------|------------|
| `appointments.status` | confirmed, pending, cancelled | ⚠️ Chưa thấy ENUM đầy đủ trong extract |
| `appointments.service_type` | kham-benh, noi-tru, cap-cuu, ban-si, other | ⚠️ Có trong feedback_requests nhưng cần xác nhận trong appointments |
| `organization_units.type` | phong_ban_hanh_chinh, khoa_lam_sang | ⚠️ Có đề cập nhưng chưa rõ full list |
| `doctor_schedules.shift` | sang, chieu, nghi | ✅ Rõ trong 15.10 |
| `testimonials.is_approved` | true/false | ⚠️ Có ghi nhắc trong mục 15.11 nhưng thiếu spec đầy đủ |

---

## Còn thiếu — Cần bổ sung trước khi code

### 1. TTL / Retention policy cho bảng log

```
notification_logs, activity_logs:
- Không có thông tin retention period
- Không có index trên created_at cho cleanup theo ngày
→ Cần bổ sung: retention_days (VD 90 ngày), auto-cleanup job
```

### 2. appointments — thiếu cancel fields

```
appointments (bổ sung):
├── cancelled_at          TIMESTAMP (nullable)   -- thời điểm hủy
├── cancel_reason         TEXT (nullable)         -- lý do hủy (spec 14.2)
└── cancelled_by          UUID FK → admin_users.id (nullable)
```

### 3. patients — thiếu contact fields cho feedback ẩn danh

```
feedback_requests (bổ sung):
- Nếu patient_id = null (gửi ẩn danh) → admin phản hồi bằng cách nào?
→ Đề xuất: thêm email hoặc phone (nullable) vào feedback_requests
```

### 4. activity_logs — thiếu details field

```
activity_logs (bổ sung):
├── details               JSONB (nullable)   -- lưu payload thay đổi
VD: { "old": { "status": "moi" }, "new": { "status": "dang_xu_ly" } }
```

### 5. File storage naming inconsistency

```
record_request_files: dùng file_path
tender_files: dùng storage_path
→ Nên thống nhất: dùng storage_path cho cả 2 bảng
```

---

## API Endpoints — Tổng hợp (đầy đủ theo v2.9 mục 21.4)

```
Public:
POST   /api/v1/feedback-requests              -- Tạo góp ý mới (rate limit: 5/IP/15ph)
POST   /api/v1/record-requests                -- Tạo yêu cầu trích sao

Admin (cần auth):
GET    /api/v1/feedback-requests              -- List + filter status/date
GET    /api/v1/feedback-requests/:id          -- Chi tiết
PATCH  /api/v1/feedback-requests/:id           -- Cập nhật status + admin_response
GET    /api/v1/record-requests                -- List + filter status/date
GET    /api/v1/record-requests/:id            -- Chi tiết + file đính kèm
PATCH  /api/v1/record-requests/:id           -- Cập nhật status + admin_notes
POST   /api/v1/record-requests/:id/files     -- Upload file (multipart → S3/MinIO)
```

**Lưu ý bảo mật (v2.9 mục 21.1, 21.4):**
- Endpoint public không cần auth nhưng bắt buộc rate limit
- Endpoint admin bắt buộc auth theo mục 9.1
- Không log nội dung góp ý/hồ sơ ra console (PHI-adjacent data)
- File: lưu vào object storage (S3/MinIO), không lưu trong DB

---

## Admin Tabs — Tổng hợp theo v2.9

> Spec mục 9.2 + 21.4 bổ sung 2 tabs mới:

| Tab | File | Super Admin | Dept Admin | Doctor |
|-----|------|-------------|------------|--------|
| Tổng quan | OverviewTab.tsx | Read | Read | Read |
| Lịch hẹn | BookingsTab.tsx | CRUD | CRUD khoa mình | Read |
| Bệnh nhân | PatientsTab.tsx | Read | Read | Read |
| Lịch trực | ShiftsTab.tsx | CRUD | CRUD khoa mình | Read |
| Chuyên khoa | SpecialtiesTab.tsx | CRUD | — | — |
| Bác sĩ | DoctorsTab.tsx | CRUD | — | Read |
| Tin tức | NewsTab.tsx | CRUD | CRUD khoa mình | CRUD (bài của mình) |
| Tổ chức | OrganizationTab.tsx | CRUD | — | — |
| Nhật ký | LogsTab.tsx | Read | Read | Read |
| Services | ServicesTab.tsx | CRUD | — | — |
| Patient Guide | PatientTab.tsx | CRUD | — | — |
| Tender | TenderTab.tsx | CRUD | CRUD khoa mình | — |
| Contact | ContactTab.tsx | CRUD | — | — |
| **Phản hồi** | FeedbackTab.tsx | CRUD đầy đủ | Xem + phản hồi khoa mình | Không |
| **Yêu cầu trích sao** | RecordRequestsTab.tsx | CRUD đầy đủ | Xem + xử lý khoa mình | Không |

---

## Deployment Architecture Options — DMZ Server (2026-07-23)

> Phân tích 3 phương án triển khai trên DMZ server cho bệnh viện.

### PHƯƠNG ÁN A: Docker Containers trên Single VM ✅ ĐÃ IMPLEMENT (2026-07-23)

```
┌─────────────────────────────────────────────────────────────┐
│                     DMZ SERVER (Single VM)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Docker Engine                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ Container 1 │  │ Container 2 │  │ Container 3 │   │  │
│  │  │ Public Web  │  │ Admin API   │  │ PostgreSQL  │   │  │
│  │  │ :3000       │  │ :3001       │  │ :5432       │   │  │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────┘   │  │
│  │         │                │                            │  │
│  │  ┌──────┴────────────────┴──────┐                    │  │
│  │  │       Nginx Reverse Proxy     │                    │  │
│  │  │  :80 → bvdh.vn (public)       │                    │  │
│  │  │  :443 → admin.bvdh.vn        │                    │  │
│  │  └──────────────────────────────┘                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Ưu điểm:**
- ✅ Container isolation (no container escape)
- ✅ Network segmentation (Docker network)
- ✅ TLS termination at nginx
- ✅ Resource limits per container
- ✅ Easy backup/restore với Docker volumes

**Nhược điểm:**
- ❌ Cần Docker knowledge
- ❌ More complex deployment

**Thời gian implement:** 8-12 tuần
**Chi phí:** 1 VM + Docker

---

### PHƯƠNG ÁN B: Same App, Subdirectory Routing ✅ CHỌN (TẠM THỜI)

**Ghi chú:** Chọn phương án này để triển khai trước, có thể chuyển sang phương án A (Docker) khi có resource đầy đủ.

**Trạng thái:** Đã quyết định (2026-07-23)

---

### PHƯƠNG ÁN C: 2 VMs (Nếu có resource)

```
┌─────────────────────────────────────────────────────────────┐
│                    VM 1: Public Site                         │
│  - bvdh.vn                                                   │
│  - Public API                                                │
│  - React App (public pages only)                            │
│  - Security: Standard firewall                              │
└─────────────────────────────────────────────────────────────┘
                          │
                    Internal Network
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    VM 2: Admin Portal                        │
│  - admin.bvdh.vn (hoặc internal IP)                         │
│  - Admin API (JWT + 2FA)                                    │
│  - PostgreSQL                                               │
│  - React Admin App                                          │
│  - Security: Strict firewall, IP whitelisting, 2FA         │
└─────────────────────────────────────────────────────────────┘
```

**Ưu điểm:**
- ✅ Complete isolation
- ✅ Independent scaling
- ✅ Maximum security

**Nhược điểm:**
- ❌ 2 VMs required
- ❌ More expensive
- ❌ More complex infrastructure

**Thời gian implement:** 10-14 tuần
**Chi phí:** 2 VMs

---

### Security Requirements bắt buộc (cho mọi phương án)

```typescript
// 1. JWT Tokens
// Access Token: 15-30 min expiry
// Refresh Token: 7 days, httpOnly cookie

// 2. Password Security
// Bcrypt salt rounds = 12 (OWASP recommended)

// 3. Rate Limiting
// Public API: 100 requests/minute
// Admin Auth: 5 requests/minute
// Login attempts: max 5 → lockout 30 minutes

// 4. RBAC Roles
type Role = 'Super Admin' | 'Receptionist' | 'Doctor' | 'Department Admin';

// 5. Audit Logging
// Mọi action của admin đều log: userId, action, IP, timestamp, duration
// PHI access: log riêng với dataAccessed: 'PHI'

// 6. Security Headers
- Strict-Transport-Security: max-age=31536000
- X-Frame-Options: DENY (admin), SAMEORIGIN (public)
- Content-Security-Policy: default-src 'self'
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation=(), microphone=(), camera=()

// 7. Network Security (DMZ)
// - PostgreSQL: internal-only (port 5432 không expose)
// - Redis: internal-only
// - UFW: whitelist only necessary ports
// - Fail2ban: chống brute force
```

### RBAC Permissions Matrix

| Permission | Super Admin | Receptionist | Doctor | Dept Admin |
|------------|-------------|--------------|--------|------------|
| users:read | ✅ | ✅ | ❌ | ❌ |
| users:write | ✅ | ❌ | ❌ | ❌ |
| users:delete | ✅ | ❌ | ❌ | ❌ |
| appointments:read | ✅ | ✅ | ✅ (own) | ✅ |
| appointments:write | ✅ | ✅ | ❌ | ✅ |
| appointments:cancel | ✅ | ✅ | ❌ | ✅ |
| medical-records:read | ✅ | ❌ | ✅ (own) | ❌ |
| medical-records:write | ✅ | ❌ | ❌ | ❌ |
| reports:read | ✅ | ❌ | ❌ | ✅ |
| reports:export | ✅ | ❌ | ❌ | ❌ |
| settings:read | ✅ | ❌ | ❌ | ✅ |
| settings:write | ✅ | ❌ | ❌ | ❌ |

### Khuyến nghị

**Cho DMZ server:** Phương án A (Docker) nếu có đủ resource (4GB+ RAM). Phương án B nếu server yếu.

---

## Nhật ký thay đổi

| Ngày | Mô tả |
|------|--------|
| 2026-07-22 | Bổ sung feedback_requests, record_requests (spec gap từ mục 20.2.1) |
| 2026-07-22 | Review toàn bộ spec v2.9 — ghi nhận 6 bảng Nhóm B còn thiếu field-level, 5 bảng roadmap, các enum gaps, và 5 điểm cần bổ sung trước khi code |
| 2026-07-23 | Phase 49 hoàn thành: feedback_requests + record_requests API (in-memory), FeedbackModal + RecordRequestModal connected to API, FeedbackTab + RecordRequestsTab admin |
| 2026-07-23 | Phase 50 hoàn thành: PostgreSQL + Prisma migration — database bvdh_db đã tạo, schema 19 tables đã migrate, booking/feedback/record-request services đã chuyển sang Prisma |
| 2026-07-23 | Bổ sung Deployment Architecture Options: 3 phương án triển khai trên DMZ server (Docker containers, Same app subdirectory, 2 VMs), security requirements, RBAC permissions matrix |