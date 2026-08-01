# 02 — Kiến trúc dự án

> Thuộc: `AGENTS.md` (index). Port Policy + Docker Dev Workflow + State Management.

---

## 🏗️ KIẾN TRÚC DỰ ÁN

### 📌 Port Policy (Bắt buộc — không thay đổi trừ khi có tài liệu kiến trúc)

Quy ước port **bất biến** để tránh xung đột với các app khác trên cùng host dev:

| Vai trò | Container | Port nội bộ | Port publish ra host |
|---------|-----------|-------------|----------------------|
| Public entrypoint (HTTPS) | `bvdh-nginx` | 443 | **8443** ← cổng duy nhất public |
| Frontend (Vite dev) | `bvdh-frontend` | 8000 | KHÔNG publish (chỉ `expose`) |
| Backend (Express API) | `bvdh-backend` | 8001 | KHÔNG publish (chỉ `expose`) |
| Database (PostgreSQL) | `bvdh-db` | 5432 | KHÔNG publish (chỉ `expose`) |

### Nguyên tắc bắt buộc

- **Chỉ port 8443 public ra host** — mọi request từ trình duyệt đi qua nginx (HTTPS, self-signed cert trong dev).
- KHÔNG `ports:` cho `public-web`, `admin-api`, `db` trong `docker-compose.yml` — chỉ dùng `expose:` cho network nội bộ.
- Trình duyệt luôn truy cập `https://localhost:8443` — không trực tiếp `localhost:3000/3001/5001/8000/8001`.
- Nginx upstream nội bộ: `public-web:8000`, `admin-api:8001`.
- Khi cần debug backend trực tiếp (không qua nginx), dùng `docker exec bvdh-backend wget -qO- http://127.0.0.1:8001/api/health` thay vì expose thêm port.
- Nếu thêm service mới (Redis, MinIO...), dùng port nội bộ từ 8002 trở lên, KHÔNG publish.
- Lý do chọn 8443: tránh xung đột với các app mặc định ở 80/443/3000/5432 trên máy dev.

### Lint/build

Nếu lint báo lỗi `server.allowedHosts` ở `vite.config.ts`, đó là pre-existing issue không liên quan port policy — không fix trừ khi yêu cầu riêng.

---

### 📌 Docker Dev Workflow — BẮT BUỘC NHỚ

**Vite HMR đang BẬT trong container** (`docker-compose.yml:16` set `DISABLE_HMR=false`, `vite.config.ts:18-19` theo đó set `hmr: { clientPort: 8443 }` + `watch: {}`).

#### Lịch sử

- Trước Phase 74: HMR từng bị tắt (`DISABLE_HMR=true`) → phải `docker restart bvdh-frontend` mỗi lần sửa code.
- **Phase 75 (2026-07-28)**: Bật lại HMR để dev auto-reload nhanh hơn. Nginx config (`nginx/nginx.conf:133`) đã proxy WebSocket đúng cho HMR.
- **Phase 89 (2026-08-01)**: Fix HMR thật sự hoạt động qua nginx — root cause `clientPort: 3000` (cổng không public từ Phase 70). Fix: `clientPort: 8443` (nginx public) + `server.ts` truyền `hmr: { server: httpServer }` (Vite WS gắn vào Express 8000, không mở port riêng 24678). Verify bằng `scripts/check_ws.ps1` → `{"type":"connected"}`.

#### ⚠️ LUẬT CỨNG: Restart container sau mỗi lần sửa frontend

> **Bất kể HMR đang BẬT hay TẮT**, sau mỗi lần sửa file `.tsx` / `.ts` / `.css` trong `src/`, agent **bắt buộc** phải chạy `docker restart bvdh-frontend` và đợi container healthy trước khi xác nhận hoàn tất cho user.

**Lý do:** HMR có thể silent-fail (Vite không pick up source fix trong container dù `docker exec` thấy file mới). Restart container là cách duy nhất đảm bảo chắc chắn code mới được serve. Xem `memory.md:101-106` và `memory/bugs-fixed.md` entry "Bug Re-encounter: Vite không pick up source fix trong container".

**Không bỏ qua bước này dù browser đã tự reload thành công.**

```yaml
# docker-compose.yml:16
- DISABLE_HMR=true
```

Rồi `docker compose up -d --build public-web`.

#### Triệu chứng nếu HMR bị tắt mà quên rule

- User báo "code mới không có hiệu lực" / "sửa rồi mà vẫn vậy".
- `docker exec bvdh-frontend grep <pattern> src/...` thấy fix **CÓ** trong container, nhưng `wget -qO- http://127.0.0.1:8000/src/...` trả về module transform cũ.
- → Đề xuất `docker restart bvdh-frontend` trước khi debug sâu.

#### Ghi chú

- Rule "HMR TẮT → phải restart" cũ (Phase 72-74) nay đã lỗi thời. Xem `memory/bugs-fixed.md` entry "Bug Re-encounter: Vite không pick up source fix trong container" và `memory.md` mục Docker Dev Workflow để đối chiếu.

---

### Frontend

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

### Backend

```text
server/
├── routes/
├── services/
├── db/
├── middleware/
```

### Data Flow

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

## 📦 STATE MANAGEMENT

### Single Source of Truth

HospitalContext là nguồn dữ liệu chính.

Không tạo context mới nếu HospitalContext có thể xử lý.

### Không được

```text
Context lồng Context
```

trừ khi có tài liệu kiến trúc giải thích.
