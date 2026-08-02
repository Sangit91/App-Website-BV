# Bugs Fixed — BVĐK Website

> Danh sách bug đã sửa. Tra cứu theo triệu chứng hoặc ngày.

---

## Bug: API Endpoint Không Tồn Tại (2026-07-17)

**Ngày:** 2026-07-17

**Vấn đề:**
API endpoint không hoạt động.

**Nguyên nhân:**
Middleware ordering sai.

**Giải pháp:**
- Chuyển Error Handler xuống sau vite.middlewares.

**Trạng thái:** Đã sửa.

---

## Bug: Broken Images Trong ChoBenhNhanPage & DichVuPage (2026-07-19)

**Ngày:** 2026-07-19

**Vấn đề:**
4 ảnh Unsplash bị lỗi 404 hoặc có ký tự Chinese trong URL

**Nguyên nhân:**
1. `photo-1587613865765-5e33e4bd57f9` - 404 Not Found
2. `photo-1530026405186-ed1f139313f3` - 404 Not Found
3. `photo-1587613865765-5e33e4零点bd58` - URL có ký tự Chinese (encoding error)
4. `photo-1546823零da49c4d-a3b3b3a9a4c1` - URL có ký tự Chinese (encoding error)

**Files affected:**
- src/pages/ChoBenhNhanPage.tsx (2 ảnh)
- src/pages/DichVuPage.tsx (2 ảnh)
- src/pages/ChuyenKhoaPage.tsx (1 ảnh - cùng URL với DichVuPage)

**Giải pháp:**
- Thay `photo-1587613865765-5e33e4bd57f9` → `photo-1551601651-2a8555f1a136`
- Thay `photo-1530026405186-ed1f139313f3` → `photo-1557804506-669a67965ba0`
- Thay `photo-1587613865765-5e33e4零点bd58` → `photo-1559757175-5700dde675bc`
- Thay `photo-1546823零da49c4d-a3b3b3a9a4c1` → `photo-1519494026892-80bbd2d6fd0d`

**Trạng thái:** Đã sửa. Đã verify tất cả ảnh thay thế hoạt động tốt.

**Commands:** npm run lint - Passed, npm run build - Passed

---

## Bug: Encoding Trong Admin Tabs (2026-07-19)

**Ngày:** 2026-07-19

**Vấn đề:**
Tất cả các tab files bị encoding corruption - tiếng Việt hiển thị sai (VD: "Tổng số" → "Tá»•ng sá»‘")

**Nguyên nhân:**
PowerShell file write không đúng encoding UTF-8

**Giải pháp:**
Viết lại toàn bộ 9 tab files với encoding UTF-8 đúng

**Files affected:**
- src/components/admin/tabs/OverviewTab.tsx
- src/components/admin/tabs/BookingsTab.tsx
- src/components/admin/tabs/PatientsTab.tsx
- src/components/admin/tabs/ShiftsTab.tsx
- src/components/admin/tabs/SpecialtiesTab.tsx
- src/components/admin/tabs/DoctorsTab.tsx
- src/components/admin/tabs/NewsTab.tsx
- src/components/admin/tabs/OrganizationTab.tsx
- src/components/admin/tabs/LogsTab.tsx

**Trạng thái:** Đã sửa.

---

## Bug: Local Images Migration (2026-07-19)

**Ngày:** 2026-07-19

**Vấn đề:**
Phụ thuộc vào external image URLs (Unsplash, Pexels) - có thể bị lỗi 404 hoặc không load được

**Giải pháp:**
- Tạo folder structure trong `public/images/`
  - `public/images/pages/` - Ảnh cho các trang
  - `public/images/components/` - Ảnh cho components (Hero, WhyChooseUs, Organization)
  - `public/images/doctors/` - Ảnh bác sĩ placeholder
  - `public/images/hero/` - Ảnh hero section
- Download 54 images từ Unsplash/Pexels về local
- Thay thế tất cả external URLs bằng local paths

**Files đã update:**
- public/images/ (54 images)
- src/pages/ChoBenhNhanPage.tsx (12 replacements)
- src/pages/DichVuPage.tsx (19 replacements)
- src/pages/ChuyenKhoaPage.tsx (20 replacements)
- src/pages/GioiThieuPage.tsx (9 replacements)
- src/pages/LienHePage.tsx (2 replacements)
- src/pages/TinTucPage.tsx (2 replacements)
- src/pages/SoDoToChucPage.tsx (6 replacements)
- src/pages/ThongTinThauPage.tsx (1 replacement)
- src/components/public/Hero.tsx (1 replacement)
- src/components/public/WhyChooseUs.tsx (2 replacements)
- src/components/public/Organization.tsx (3 replacements)
- src/components/admin/tabs/NewsTab.tsx (1 replacement)
- src/components/admin/tabs/DoctorsTab.tsx (1 replacement)

**Total:** 79 replacements across 13 files

**Trạng thái:** ✅ Hoàn thành. Không còn external image URLs trong codebase.

**Commands:** npm run lint - Passed, npm run build - Passed

---

## Bug: ThongTinThauPage Toggle Animation (2026-07-19)

**Ngày:** 2026-07-19

**Vấn đề:**
Sửa animation rotation của nút thu gọn/expand department

**Giải pháp:**
- Thay `rotate: isExpanded ? 180 : 0` → `rotate: isExpanded ? 360 : 0`
- 90 độ khiến icon nằm ngang, 360 giữ nguyên hướng icon

**Files affected:** src/pages/ThongTinThauPage.tsx

**Trạng thái:** Đã sửa.

**Commands:** npm run lint - Passed, npm run build - Passed

---

## Bug: TinTucPage Image Fixes (2026-07-19)

**Ngày:** 2026-07-19

**Vấn đề:**
Sửa 2 đường dẫn ảnh bị sai trong TinTucPage.tsx

**Giải pháp:**
- `news-placeholder.jpeg`: `/images/pages/` → `/images/components/` (ảnh nằm trong components folder)
- `chi-phi-1.jpeg` → `chiphi-1.jpeg` (thiếu dấu gạch ngang trong filename)

**Files affected:** src/pages/TinTucPage.tsx

**Trạng thái:** Đã sửa.

**Commands:** npm run lint - Passed, npm run build - Passed

---

## Bug: Additional Image Fixes (2026-07-19)

**Ngày:** 2026-07-19

**Vấn đề:**
Sửa các filename ảnh bị sai trong một số page

**Giải pháp:**
- tiendung-1.jpeg → tiemchung-1.jpeg (DichVuPage)
- thaisy-1.jpeg → sanphukhoa-1.jpeg (DichVuPage)
- chi-phi-1.jpeg → chiphi-1.jpeg (DichVuPage)
- photo-1586773860418-d37222d8f0a3 → /images/pages/coso-2.jpeg (GioiThieuPage)

**Trạng thái:** Đã sửa.

---

## Bug: TinTucPage - Click News Card Không Mở Modal (2026-07-22)

**Ngày:** 2026-07-22

**Vấn đề:**
Click vào card tin tức trên TinTucPage (tab "Tin tức bệnh viện" và "Y khoa & Sức khoẻ") không mở modal xem chi tiết.

**Nguyên nhân:**
- TinTucPage render news cards trực tiếp (không qua News.tsx component)
- Các `motion.article` trong TinTucPage thiếu `onClick` handler
- Không có `selectedNews` state để control modal
- Featured article (hospitalNews[0]) cũng không có onClick

**Giải pháp:**
- Thêm `selectedNews: NewsItem | null` state
- Thêm `onClick={() => setSelectedNews(item)}` vào tất cả news cards
- Thêm AnimatePresence modal hiển thị chi tiết bài viết

**Files affected:**
- src/pages/TinTucPage.tsx

**Phase:** 45

**Trạng thái:** Đã sửa.

---

## Bug: Scroll Position Sai Khi Navigate (2026-07-22)

**Ngày:** 2026-07-22

**Vấn đề:**
Khi click navigation từ HomePage sang các animated page, trang mới hiện ở scroll position của trang cũ.

**Nguyên nhân:**
Framer Motion `useScroll` hook đọc scroll position từ trang trước khi trang mới mount xong.

**Giải pháp:**
Thêm `useEffect(() => { window.scrollTo(0, 0); }, []);` ở đầu mỗi affected page.

**Files affected:**
- src/pages/ChuyenKhoaPage.tsx
- src/pages/DichVuPage.tsx
- src/pages/ChoBenhNhanPage.tsx
- src/pages/TinTucPage.tsx
- src/pages/ThongTinThauPage.tsx
- src/pages/GioiThieuPage.tsx
- src/pages/SoDoToChucPage.tsx

**Phase:** 44

**Trạng thái:** Đã sửa.

---

## Bug: featuredItem undefined crash — Cannot read properties of undefined (reading 'img') (2026-07-24)

**Ngày:** 2026-07-24

**Vấn đề:**
- DichVuPage, ChuyenKhoaPage, ChoBenhNhanPage crash với lỗi `Cannot read properties of undefined (reading 'img')`
- Crash xảy ra khi API trả về data nhưng `items` array rỗng

**Nguyên nhân:**
```typescript
// Dòng 256 ChuyenKhoaPage:
const featuredItem = currentData?.items.find(item => item.highlight) || currentData?.items[0];
// Khi items = []: find() → undefined, items[0] → undefined → fallback không hoạt động
// vì || không distinguish được giữa "falsy value" và "undefined"

const featuredItem = currentData?.items.find(item => item.highlight) || currentData?.items[0];
// Khi items = undefined/null: currentData?.items → undefined → crash ngay khi gọi .find()
```

**Giải pháp:**
```typescript
// Fix 1: featuredItem — dùng ?? thay vì || để distinguish undefined và falsy
const rawFeatured = currentData?.items?.find(item => item.highlight) ?? currentData?.items?.[0];
const featuredItem = rawFeatured ?? { name: "", desc: "", price: "", img: "/images/pages/bacsi-1.jpeg" };

// Fix 2: items.filter/map — thêm ?? [] guard
{(currentData?.items ?? []).filter(item => !item.highlight).map(...)}

// Fix 3: featuredItem cho currentData không có ?.
const featuredItem = (currentData?.items ?? []).find(item => item.highlight) 
  ?? (currentData?.items ?? [])[0] 
  ?? { name: "", desc: "", img: "/images/pages/bacsi-1.jpeg" };
```

**Files affected:**
- src/pages/DichVuPage.tsx (lines 307, 463)
- src/pages/ChuyenKhoaPage.tsx (lines 256, 521)
- src/pages/ChoBenhNhanPage.tsx (lines 276, 487)

**Phase:** 62

**Trạng thái:** Đã sửa.

---

## Bug: RecordRequestModal - 2 Thanh Scrollbar Chồng Nhau (2026-07-27)

**Ngày:** 2026-07-27

**Vấn đề:**
Modal "Yêu cầu trích sao hồ sơ" hiển thị 2 thanh scrollbar chồng nhau — 1 của `Modal` wrapper, 1 của div body bên trong `RecordRequestModal`.

**Nguyên nhân:**
`RecordRequestModal` (dòng 225-247 bản cũ) tự bọc `<div className="flex flex-col max-h-[90vh]">` + `<div className="p-6 overflow-y-auto">` bên trong children, trong khi `Modal` (`src/components/ui/Modal.tsx:66-93`) đã tự lo `max-h-[92vh] flex flex-col overflow-hidden` + body `p-6 overflow-y-auto`. Kết quả: 2 lớp scrollbar lồng nhau.

**Giải pháp:**
- Bỏ wrapper `<div className="flex flex-col max-h-[90vh]">` trong `RecordRequestModal`, thay bằng fragment `<>`.
- Bỏ class `overflow-y-auto` ở div `p-6` body — Modal đã lo rồi.
- Header gradient custom vẫn dùng `shrink-0` để không bị cuộn mất khi body cuộn.

Cấu trúc sau fix:
```
<Modal size="lg" showCloseButton={false}>
  ├── <div header gradient shrink-0>   ← header custom
  └── <div p-6>                         ← body bình thường
        └── <form>...</form>
</Modal>
```

**Files affected:**
- src/components/public/RecordRequestModal.tsx (dòng 225-247)

**Phase:** 74

**Trạng thái:** Đã sửa.

**Commands:** tsc --noEmit - Passed (zero lỗi mới; pre-existing errors ở vite.config.ts, ChoBenhNhanPage.tsx, auth.routes.ts không liên quan).

---

## Bug Re-encounter: Vite không pick up source fix trong container (2026-07-27)

**Ngày:** 2026-07-27 (gặp lại sau Phase 74)

**Vấn đề:**
Sau khi sửa `RecordRequestModal.tsx` trên host, browser vẫn hiển thị 2 scrollbar cũ — code không được pick up.

**Nguyên nhân:**
- `docker-compose.yml:16` set `DISABLE_HMR=true` trong container frontend → Vite không watch file.
- `vite.config.ts:18-19` theo đó set `hmr: false` + `watch: null` → Vite không auto-transform khi file thay đổi, dù mount `. → /app` đã sync file từ host ngay lập tức.
- Đã ghi nhận quy tắc này từ **Phase 72** (`memory/phase-history.md:1804`, `memory/phase-history.md:1792`) nhưng không nằm trong `AGENTS.md` → dễ quên.

**Giải pháp:**
```bash
docker restart bvdh-frontend
```
- Container restart trong ~3s, healthcheck `healthy` sau ~39s (lần đầu phải npm install + Vite warmup).
- Verify: `docker exec bvdh-frontend grep <pattern> src/...` xác nhận file đã sync.
- Verify: `docker exec bvdh-frontend wget -qO- http://127.0.0.1:8000/src/...` xác nhận Vite đã transform lại.
- Browser: **Ctrl+Shift+R** (hard reload) để bypass cache trình duyệt.

**Đề xuất cải tiến AGENTS.md:**
Thêm 1 dòng ngắn vào mục "Port Policy" hoặc tạo section mới "Docker Dev Workflow" nhắc rule "mỗi lần sửa file → restart bvdh-frontend (HMR đang tắt)". Hiện tại rule này chỉ nằm trong `phase-history.md` → dễ miss khi đọc memory.md mỗi session đầu.

**Đã apply (2026-07-27):** Section mới "📌 Docker Dev Workflow — BẮT BUỘC NHỚ" đã được thêm vào `AGENTS.md:170` ngay sau Port Policy, với đầy đủ: nguyên nhân, quy tắc bắt buộc, triệu chứng điển hình, trường hợp KHÔNG cần restart (backend tsx watch / Docker config rebuild / Prisma regenerate), và ghi chú về việc bật lại HMR.

**Files affected:** (chỉ là sự cố khi sửa, không có diff mới)
- `src/components/public/RecordRequestModal.tsx` (fix Phase 74)
- `docker-compose.yml:16` (config đã có sẵn, không đổi)
- `vite.config.ts:18-19` (config đã có sẵn, không đổi)

**Phase:** 74 (re-encounter — cùng phase, không tạo phase mới vì không có code change mới)

**Trạng thái:** Đã verify workaround. Container `bvdh-frontend` healthy sau restart, Vite serve đúng code fix.

**Commands:** docker restart bvdh-frontend → healthy sau 39s. docker exec bvdh-frontend grep verify fix có trong container.

---

## Feature: Enable Vite HMR cho Docker dev (2026-07-28)

### Mô tả

Bật lại Vite HMR trong Docker dev environment để frontend auto-reload khi sửa code, thay vì phải `docker restart bvdh-frontend` mỗi lần.

### Thay đổi config

**docker-compose.yml:16**
```diff
- DISABLE_HMR=true
+ DISABLE_HMR=false
```

**vite.config.ts:18-19** tự động bật HMR khi `DISABLE_HMR !== 'true'`:
```ts
hmr: process.env.DISABLE_HMR !== 'true' ? { clientPort: 3000 } : false,
watch: process.env.DISABLE_HMR === 'true' ? null : {},
```

Nginx config (`nginx/nginx.conf:133`) đã sẵn proxy WebSocket cho HMR.

### Workflow mới

| Action | Trước (HMR OFF) | Sau (HMR ON) |
|--------|-----------------|--------------|
| Sửa file frontend | `docker restart bvdh-frontend` + Ctrl+Shift+R | Chỉ save file → browser auto-reload |
| Sửa file backend | `tsx watch` tự reload | Giữ nguyên |
| Sửa config Docker | `docker compose up -d --build` | Giữ nguyên |

### Verify

- Container `bvdh-frontend` healthy sau rebuild
- `wget -qO- http://127.0.0.1:8000/@vite/client` trả về HMR client code
- Sửa file `RecordRequestModal.tsx` → Vite inject `__vite__createHotContext` vào module transform

### Files Changed

- `docker-compose.yml:16` (DISABLE_HMR=false)
- `AGENTS.md` section "Docker Dev Workflow" — cập nhật rule HMR ON
- `memory.md` section "Docker Dev Workflow" — cập nhật quy tắc mới
- `memory/phase-history.md` +Phase 76 entry

### Ghi chú

- Rule "restart container khi sửa frontend" vẫn giữ trong AGENTS.md/memory.md nhưng ghi chú rõ: **chỉ áp dụng khi HMR OFF**. Khi HMR ON → không cần restart.
- Khi cần tắt HMR để giống production: đổi `false → true` + `docker compose up -d --build public-web`.

## Bug: Anh moi them vao public/ khong serve (tra text/html SPA fallback) (2026-08-02)

- Trieu chung: 4 anh tender moi (software-it, computer-office, medicine-vial, ppe) them vao public/images/tenders/ khong hien thi; GET tra status 200 nhung content-type text/html (index.html fallback).
- Root cause: server serve tu dist/ (production build), anh moi chi trong public/ khong tu dong copy vao dist/ den khi build.
- Fix: chay lại npm run build (copy public->dist) + docker restart bvdh-frontend; verify GET tra image/jpeg.
- Lesson: them anh moi vao public/images/ phai npm run build + restart frontend truoc. Xem memory.md ghi chu Phase 94.
