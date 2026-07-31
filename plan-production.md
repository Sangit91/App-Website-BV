# PLAN — Đưa hệ thống BVĐK đạt chuẩn Production

> **Ngày:** 2026-07-31 · **Phương pháp:** Production audit (4 agent song song: backend/security, Docker/nginx/ops, frontend, DB/tests) + verify thủ công các phát hiện nghiêm trọng.
> **Score hiện tại: 45/100 — BLOCKED.** Không vận hành khi còn lỗ hổng PHI + token minting + admin writes không auth.

---

## 1. Tóm tắt audit

### 🔴 Blocker vận hành (phải sửa trước khi go-live)

| # | Vấn đề | Bằng chứng | Mức |
|---|--------|-----------|-----|
| P1 | `POST /api/v1/auth/token/access` mint access+refresh token **chỉ từ patientCode đoán được** (`BN-<năm>-5 số`) — không OTP/auth | `auth.routes.ts:183-211`, `appointment.service.ts:21` | **Critical** |
| P2 | Endpoint PHI không auth: `patients/lookup` trả toàn bộ patient (cccd, địa chỉ, BHYT); `/:id/medical-records` + `/clinical-tests` + `/treatment-histories` chỉ có consentCheck **bị bypass** (đọc `req.patientId` nhưng route dùng path param → check bỏ qua) | `patient.routes.ts:7,32,55,79`, `consent.middleware.ts:46-49` | **Critical** |
| P3 | Admin CRUD tổ chức không auth: `organization.routes.ts:29,58,75` (POST/PUT/DELETE departments) — ai cũng sửa được | `organization.routes.ts` | **Critical** |
| P4 | Refresh token trả trong JSON body + nhận từ body — **không httpOnly cookie**, không rotation/revoke → XSS = mất session | `auth.routes.ts:238,267,245` | **Critical** |
| P5 | Frontend admin mutations (~16 chỗ) gọi fetch **không đính Authorization** — hoặc backend nhận write không auth, hoặc admin không bao giờ sync lên DB | `HospitalContext.tsx:440-718`, `FeedbackTab.tsx:58`, `OrganizationTab.tsx:44` | **Critical** |
| P6 | Không input validation (Zod/Joi) — hầu hết route ghi raw `req.body`; không `$transaction`; rate limit public form/PHI lookup không có (chỉ nginx 200r/m) | agent backend #2 | **Critical** |
| P7 | Backend bundle lộ qua static: `server.cjs` + `.map` nằm trong `dist/` được `express.static` serve → `GET /server.cjs` = toàn bộ source | `package.json:8`, `server.ts:22-23` | High |
| P8 | Migration drift: `tender_start_date/end_date` schema `Timestamp(3)` nhưng migration gốc là `DATE`; `patient_consents.policy_version` schema nullable nhưng migration `NOT NULL` — do dùng `db push` thay `migrate` | `schema.prisma:192,552`, `init/migration.sql:140,19` | High |
| P9 | Seed admin password hỏng (`'$2b$10$dummy'` không đúng format PBKDF2 → không login được); `reset-admin-password.ts:14` hardcode `"Admin@123"` + in ra log | `seed.ts:50-52`, `reset-admin-password.ts:14,25` | High |
| P10 | `CONSENT_SECRET` fallback hardcode `"bvdh-consent-secret-key-2026"` — forge được từ source | `consent.service.ts:22` | High |
| P11 | nginx `Access-Control-Allow-Origin: $http_origin` + `credentials: true` trên mọi `/api/` (reflect any origin); `add_header` trong `location /api/` **nuốt luôn** security headers server-level → API không có HSTS/X-Frame-Options | `nginx/nginx.conf:101-104` | High |
| P12 | CCCD lưu plaintext (cột `cccd_encrypted` chết, 0 grep), mask chỉ frontend; `patients.phone`/`appointments.phone` không index | `schema.prisma:45`, `PatientsTab.tsx:7` | High |
| P13 | `activity_logs`/`notification_logs` **không có code nào ghi** — audit trail chết, vi phạm compliance; không index | grep server → 0 hit | High |
| P14 | `npm run lint` **ĐỎ**: 23 lỗi TS (21× `Variants` ease type + `ChoBenhNhanPage` + `vite.config.ts:6 allowedHosts`) — Quality Gate hiện không pass | `npm run lint` | High |
| P15 | Không `trust proxy` → authLimiter (10/15ph) thành 1 bucket global cho mọi user | `server/app.ts:44-50` | High |

### 🟠 High-value còn lại

- **Security:** helmet CSP tắt trong production (`app.ts:22`); không `unhandledRejection`/graceful shutdown; upload MIME trust client (không sniff magic byte); `deleteFile` dùng `resolvePhysicalPath` không whitelist; orphan temp file khi DB fail.
- **Data:** `findUnique`/`update` không filter `deletedAt`; không pagination thật (`take:200` cứng, patient trả fake page); booking search `contains` (index vô dụng).
- **Frontend:** Booking thành công giả khi server không nhận (fire-and-forget fetch); **fabricate CCCD** `04909...` cho patient mới (`HospitalContext.tsx:643`); ErrorBoundary là function component (không bắt render error); framer-motion **không khai báo** trong package.json (dựa vào hoisting); `text-xs` input → iOS auto-zoom; QuickActions clickable `<div>` không keyboard; Modal không focus trap/aria; `prefers-reduced-motion` chỉ 4 file; mock data trong bundle (`DrugLookup`, patient portal, OverviewTab "+12.4% tuần này", LienHe fake submit).
- **Ops:** không CI/CD; không DB backup (chỉ backup code thủ công); TLS cert mkcert (không được trust, hết hạn 2026-10-26); không `client_max_body_size` nginx → upload >1MB bị 413; Dockerfile không multi-stage, cài cả devDeps, chạy `tsx watch`; `.env.example` thiếu 8 biến.
- **Tests:** Playwright có nhưng `@playwright/test` **không cài**, không có `test` script, không unit/integration test, critical flows (admin login, feedback, record-request, consent) không cover.

### ✅ Đã OK

- Port policy đúng (chỉ 8443 public, DB internal-only); healthcheck 4 services; `.env`/certs không bao giờ commit; password PBKDF2 100k + salt + timingSafeEqual; path traversal read-path chặn tốt; error handler không leak stack trong prod; C1-C9, H1-H10, M1-M13, L1-L6 audit cũ đã fix.

---

## 2. Plan đề xuất (theo Phase — quy ước numbering)

> Mỗi Phase xong: cập nhật `memory.md` + `memory/phase-history.md` + commit. Phù hợp quy trình AGENTS.md.

### 🔴 Wave A — Bảo mật (Phase 81-83) *không được deploy thiếu*

**Phase 81 — Đóng lỗ hổng token & PHI**
1. Gỡ/bảo vệ `/token/access`: patient portal phải qua OTP (verify code gửi SMS/email) — không mint token từ patientCode trần.
2. Fix consent middleware: đọc `req.params.patientId`, không bỏ qua khi thiếu patientId.
3. Thêm `authenticate` cho mọi route PHI + thêm `authorizeDepartmentAccess` vào route cần department ownership.
4. Org routes: gắn `authenticate + requireAdmin`.

**Phase 82 — Session & Auth hardening**
1. Refresh token → httpOnly cookie (`SameSite=Strict`/`Lax`, `Secure`), rotation + revoke cũ + reuse detection.
2. Xoá fallback `CONSENT_SECRET` — crash fail-fast trong production.
3. Fix seed: sinh hash PBKDF2 đúng chuẩn; bỏ hardcode `Admin@123`, dùng `ADMIN_DEFAULT_PASSWORD` từ env; xoá `reset-admin-password.ts` khỏi prod path.
4. Gắn `app.set("trust proxy", ...)` + `trust proxy` cho rate limiter.

**Phase 83 — Edge & bundle security**
1. Không serve `dist/server.cjs*`: build server bundle ra `dist-server/` (sửa `package.json` + `server.ts`).
2. nginx: bỏ CORS reflect-any (chỉ cho phép origin whitelist); chuyển security headers vào location hoặc bỏ `add_header` phá inheritance; thêm CSP + Permissions-Policy; `client_max_body_size 25m`.
3. bật helmet CSP trong production (config hợp lý cho SPA).

### 🟠 Wave B — Toàn vẹn dữ liệu (Phase 84-85)

**Phase 84 — Migrations & transactions**
1. Sinh migration thật cho drift (`tender_*` Timestamp(3), `policy_version` nullable) — chuyển hẳn workflow sang `prisma migrate deploy`, cấm `db push` ở prod.
2. Tạo `prisma/seed.ts` chuẩn + `seed` config trong `prisma.config.ts`.
3. Bọc `$transaction` cho multi-step: processStatusChange (copy+delete+update), createPolicy (deactivate+create), appointment create (patient + booking).
4. Filter `deletedAt` trong `findUnique`/`update`/`delete` (extend Prisma client).
5. CCCD: lưu `cccd_encrypted` + mask server-side; bỏ patient code predictable (dùng crypto random).

**Phase 85 — Audit & RBAC**
1. Ghi `activity_logs` cho mọi admin action (`userId`, `action`, `IP`, `duration`) + PHI access log riêng; thêm index `activity_logs`.
2. Enforce RBAC matrix đầy đủ + department ownership qua `authorizeDepartmentAccess`.
3. Index `patients.phone`, `appointments.phone`.

### 🟡 Wave C — API hardening (Phase 86)

1. **Zod schema validation** cho mọi body (booking, feedback, record-request, admin CRUD, ai/consult limit history/message).
2. **Rate limit** Express: public forms (5/IP/15ph), `patients/lookup`, `ai/consult`, OTP verify (per-session cap).
3. **Pagination** thật: page/limit cho booking, feedback, record-request, news, doctors, patients.
4. Health check có query DB; sửa thứ tự prod catch-all (`notFoundHandler` trước SPA fallback hoặc chỉ fallback cho GET non-/api).
5. `unhandledRejection`/`uncaughtException` handler + graceful shutdown SIGTERM; dọn orphan temp files khi khởi động.

### 🟢 Wave D — Frontend (Phase 87-88)

**Phase 87 — Auth & data truth**
1. Admin mutations: dùng `useAuthedFetch` cho ~16 fetch write trong HospitalContext + tabs (đính Bearer).
2. Booking submit: await server + error rõ ràng; bỏ fabricate CCCD.
3. ErrorBoundary → class component (`getDerivedStateFromError`) + route 404 catch-all.
4. Xoá mock trong production path: DrugLookup (nối backend hoặc gỡ), LienHe form gọi API thật, OverviewTab fake metric, patient portal mock.

**Phase 88 — A11y & quality**
1. Fix 23 lỗi lint (`ease: "easeOut" as const`/bỏ `: Variants`, ChoBenhNhanPage, vite allowedHosts) → `npm run lint` green.
2. QuickActions → button thật; Modal focus trap + `role="dialog"` + `aria-modal` + Escape cho custom modals; aria-label icon buttons.
3. Input ≥16px cho form (chống iOS zoom); `prefers-reduced-motion` block trong `index.css` + ScrollAnimation/PageTransition.
4. Khai báo `framer-motion` (hoặc migrate 44 import → `motion/react`); code-splitting React.lazy cho pages + admin.

### 🔵 Wave E — Ops & deploy (Phase 89-90)

1. `Dockerfile.prod` multi-stage (npm ci --omit=dev, frontend build static serve qua nginx, backend node dist) + `docker-compose.prod.yml`.
2. TLS cert thật (Let's Encrypt/certbot) + auto-renew; nginx HTTP/2; gzip+brotli.
3. **DB backup**: script `pg_dump` + cron/systemd timer vào volume/backup dir; thêm backup/restore vào `docker-helpers.sh`.
4. `.env.example` đầy đủ (DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, CONSENT_SECRET, CORS_ORIGIN, NODE_ENV, PORT, VITE_*); validate env fail-fast khi start.
5. `.gitignore` thêm `uploads/`, `.env.docker`; `.dockerignore` thêm `.env.production`.
6. CI/CD: GitHub Actions `lint → build → test → migrate deploy` + docs runbook deploy/rollback trong README/DOCKER.md.

### 🟣 Wave F — Tests (Phase 91)

1. Cài `@playwright/test` + thêm `test` script; viết API integration tests (auth/OTP, PHI access control, booking, feedback, record-request upload, consent).
2. E2E critical flows: admin login, admin CRUD news/tender, booking flow, patient lookup.
3. Chạy full suite trong CI; Quality Gate = `lint && build && test`.

---

## 3. Thứ tự ưu tiên & phụ thuộc

```
Phase 81 → 82 → 83 (bảo mật, deploy gate)
   └─ chạy song song bất kỳ lúc nào: Phase 84 (migration drift)
Phase 84 → 85 → 86 (dữ liệu + API)
Phase 87 → 88 (frontend)
Phase 89 → 90 → 91 (ops + tests, có thể xen kẽ)
```

**Điều kiện để vận hành:** hết Wave A (81-83) + migration drift fix (84) + lint green (88). Đủ 3 cái đó → có thể deploy nội bộ beta. Waves C-F nâng độ sẵn sàng lên Strong.

---

## 4. Evidence

- Backend/security: `server/app.ts`, `server.ts`, `server/routes/*.routes.ts`, `server/services/*.ts`, `server/middleware/*.ts`
- Ops: `docker-compose.yml`, `Dockerfile.*`, `nginx/nginx.conf`, `.env.example`, `.env.production`, `.gitignore`, `.dockerignore`, `DOCKER.md`
- Frontend: `src/context/HospitalContext.tsx`, `src/lib/*`, `src/components/**`, `src/pages/**`
- DB/tests: `prisma/schema.prisma`, `prisma/migrations/`, `tests/`, `playwright.config.ts`, `scripts/`
- Verify thủ công: `npm run lint` (đỏ), `server.ts:22-26` (bundle leak), `auth.routes.ts:183-211` (token minting)

## 5. Next action

Bắt đầu **Phase 81** — đóng `/token/access` + fix consent bypass + bảo vệ PHI routes (3 task đầu tiên).
