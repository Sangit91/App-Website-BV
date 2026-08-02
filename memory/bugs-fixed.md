# Bugs Fixed â€” BVÄK Website

> Danh sÃ¡ch bug Ä‘Ã£ sá»­a. Tra cá»©u theo triá»‡u chá»©ng hoáº·c ngÃ y.

---

## Bug: API Endpoint KhÃ´ng Tá»“n Táº¡i (2026-07-17)

**NgÃ y:** 2026-07-17

**Váº¥n Ä‘á»:**
API endpoint khÃ´ng hoáº¡t Ä‘á»™ng.

**NguyÃªn nhÃ¢n:**
Middleware ordering sai.

**Giáº£i phÃ¡p:**
- Chuyá»ƒn Error Handler xuá»‘ng sau vite.middlewares.

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a.

---

## Bug: Broken Images Trong ChoBenhNhanPage & DichVuPage (2026-07-19)

**NgÃ y:** 2026-07-19

**Váº¥n Ä‘á»:**
4 áº£nh Unsplash bá»‹ lá»—i 404 hoáº·c cÃ³ kÃ½ tá»± Chinese trong URL

**NguyÃªn nhÃ¢n:**
1. `photo-1587613865765-5e33e4bd57f9` - 404 Not Found
2. `photo-1530026405186-ed1f139313f3` - 404 Not Found
3. `photo-1587613865765-5e33e4é›¶ç‚¹bd58` - URL cÃ³ kÃ½ tá»± Chinese (encoding error)
4. `photo-1546823é›¶da49c4d-a3b3b3a9a4c1` - URL cÃ³ kÃ½ tá»± Chinese (encoding error)

**Files affected:**
- src/pages/ChoBenhNhanPage.tsx (2 áº£nh)
- src/pages/DichVuPage.tsx (2 áº£nh)
- src/pages/ChuyenKhoaPage.tsx (1 áº£nh - cÃ¹ng URL vá»›i DichVuPage)

**Giáº£i phÃ¡p:**
- Thay `photo-1587613865765-5e33e4bd57f9` â†’ `photo-1551601651-2a8555f1a136`
- Thay `photo-1530026405186-ed1f139313f3` â†’ `photo-1557804506-669a67965ba0`
- Thay `photo-1587613865765-5e33e4é›¶ç‚¹bd58` â†’ `photo-1559757175-5700dde675bc`
- Thay `photo-1546823é›¶da49c4d-a3b3b3a9a4c1` â†’ `photo-1519494026892-80bbd2d6fd0d`

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a. ÄÃ£ verify táº¥t cáº£ áº£nh thay tháº¿ hoáº¡t Ä‘á»™ng tá»‘t.

**Commands:** npm run lint - Passed, npm run build - Passed

---

## Bug: Encoding Trong Admin Tabs (2026-07-19)

**NgÃ y:** 2026-07-19

**Váº¥n Ä‘á»:**
Táº¥t cáº£ cÃ¡c tab files bá»‹ encoding corruption - tiáº¿ng Viá»‡t hiá»ƒn thá»‹ sai (VD: "Tá»•ng sá»‘" â†’ "TÃ¡Â»â€¢ng sÃ¡Â»â€˜")

**NguyÃªn nhÃ¢n:**
PowerShell file write khÃ´ng Ä‘Ãºng encoding UTF-8

**Giáº£i phÃ¡p:**
Viáº¿t láº¡i toÃ n bá»™ 9 tab files vá»›i encoding UTF-8 Ä‘Ãºng

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

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a.

---

## Bug: Local Images Migration (2026-07-19)

**NgÃ y:** 2026-07-19

**Váº¥n Ä‘á»:**
Phá»¥ thuá»™c vÃ o external image URLs (Unsplash, Pexels) - cÃ³ thá»ƒ bá»‹ lá»—i 404 hoáº·c khÃ´ng load Ä‘Æ°á»£c

**Giáº£i phÃ¡p:**
- Táº¡o folder structure trong `public/images/`
  - `public/images/pages/` - áº¢nh cho cÃ¡c trang
  - `public/images/components/` - áº¢nh cho components (Hero, WhyChooseUs, Organization)
  - `public/images/doctors/` - áº¢nh bÃ¡c sÄ© placeholder
  - `public/images/hero/` - áº¢nh hero section
- Download 54 images tá»« Unsplash/Pexels vá» local
- Thay tháº¿ táº¥t cáº£ external URLs báº±ng local paths

**Files Ä‘Ã£ update:**
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

**Tráº¡ng thÃ¡i:** âœ… HoÃ n thÃ nh. KhÃ´ng cÃ²n external image URLs trong codebase.

**Commands:** npm run lint - Passed, npm run build - Passed

---

## Bug: ThongTinThauPage Toggle Animation (2026-07-19)

**NgÃ y:** 2026-07-19

**Váº¥n Ä‘á»:**
Sá»­a animation rotation cá»§a nÃºt thu gá»n/expand department

**Giáº£i phÃ¡p:**
- Thay `rotate: isExpanded ? 180 : 0` â†’ `rotate: isExpanded ? 360 : 0`
- 90 Ä‘á»™ khiáº¿n icon náº±m ngang, 360 giá»¯ nguyÃªn hÆ°á»›ng icon

**Files affected:** src/pages/ThongTinThauPage.tsx

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a.

**Commands:** npm run lint - Passed, npm run build - Passed

---

## Bug: TinTucPage Image Fixes (2026-07-19)

**NgÃ y:** 2026-07-19

**Váº¥n Ä‘á»:**
Sá»­a 2 Ä‘Æ°á»ng dáº«n áº£nh bá»‹ sai trong TinTucPage.tsx

**Giáº£i phÃ¡p:**
- `news-placeholder.jpeg`: `/images/pages/` â†’ `/images/components/` (áº£nh náº±m trong components folder)
- `chi-phi-1.jpeg` â†’ `chiphi-1.jpeg` (thiáº¿u dáº¥u gáº¡ch ngang trong filename)

**Files affected:** src/pages/TinTucPage.tsx

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a.

**Commands:** npm run lint - Passed, npm run build - Passed

---

## Bug: Additional Image Fixes (2026-07-19)

**NgÃ y:** 2026-07-19

**Váº¥n Ä‘á»:**
Sá»­a cÃ¡c filename áº£nh bá»‹ sai trong má»™t sá»‘ page

**Giáº£i phÃ¡p:**
- tiendung-1.jpeg â†’ tiemchung-1.jpeg (DichVuPage)
- thaisy-1.jpeg â†’ sanphukhoa-1.jpeg (DichVuPage)
- chi-phi-1.jpeg â†’ chiphi-1.jpeg (DichVuPage)
- photo-1586773860418-d37222d8f0a3 â†’ /images/pages/coso-2.jpeg (GioiThieuPage)

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a.

---

## Bug: TinTucPage - Click News Card KhÃ´ng Má»Ÿ Modal (2026-07-22)

**NgÃ y:** 2026-07-22

**Váº¥n Ä‘á»:**
Click vÃ o card tin tá»©c trÃªn TinTucPage (tab "Tin tá»©c bá»‡nh viá»‡n" vÃ  "Y khoa & Sá»©c khoáº»") khÃ´ng má»Ÿ modal xem chi tiáº¿t.

**NguyÃªn nhÃ¢n:**
- TinTucPage render news cards trá»±c tiáº¿p (khÃ´ng qua News.tsx component)
- CÃ¡c `motion.article` trong TinTucPage thiáº¿u `onClick` handler
- KhÃ´ng cÃ³ `selectedNews` state Ä‘á»ƒ control modal
- Featured article (hospitalNews[0]) cÅ©ng khÃ´ng cÃ³ onClick

**Giáº£i phÃ¡p:**
- ThÃªm `selectedNews: NewsItem | null` state
- ThÃªm `onClick={() => setSelectedNews(item)}` vÃ o táº¥t cáº£ news cards
- ThÃªm AnimatePresence modal hiá»ƒn thá»‹ chi tiáº¿t bÃ i viáº¿t

**Files affected:**
- src/pages/TinTucPage.tsx

**Phase:** 45

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a.

---

## Bug: Scroll Position Sai Khi Navigate (2026-07-22)

**NgÃ y:** 2026-07-22

**Váº¥n Ä‘á»:**
Khi click navigation tá»« HomePage sang cÃ¡c animated page, trang má»›i hiá»‡n á»Ÿ scroll position cá»§a trang cÅ©.

**NguyÃªn nhÃ¢n:**
Framer Motion `useScroll` hook Ä‘á»c scroll position tá»« trang trÆ°á»›c khi trang má»›i mount xong.

**Giáº£i phÃ¡p:**
ThÃªm `useEffect(() => { window.scrollTo(0, 0); }, []);` á»Ÿ Ä‘áº§u má»—i affected page.

**Files affected:**
- src/pages/ChuyenKhoaPage.tsx
- src/pages/DichVuPage.tsx
- src/pages/ChoBenhNhanPage.tsx
- src/pages/TinTucPage.tsx
- src/pages/ThongTinThauPage.tsx
- src/pages/GioiThieuPage.tsx
- src/pages/SoDoToChucPage.tsx

**Phase:** 44

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a.

---

## Bug: featuredItem undefined crash â€” Cannot read properties of undefined (reading 'img') (2026-07-24)

**NgÃ y:** 2026-07-24

**Váº¥n Ä‘á»:**
- DichVuPage, ChuyenKhoaPage, ChoBenhNhanPage crash vá»›i lá»—i `Cannot read properties of undefined (reading 'img')`
- Crash xáº£y ra khi API tráº£ vá» data nhÆ°ng `items` array rá»—ng

**NguyÃªn nhÃ¢n:**
```typescript
// DÃ²ng 256 ChuyenKhoaPage:
const featuredItem = currentData?.items.find(item => item.highlight) || currentData?.items[0];
// Khi items = []: find() â†’ undefined, items[0] â†’ undefined â†’ fallback khÃ´ng hoáº¡t Ä‘á»™ng
// vÃ¬ || khÃ´ng distinguish Ä‘Æ°á»£c giá»¯a "falsy value" vÃ  "undefined"

const featuredItem = currentData?.items.find(item => item.highlight) || currentData?.items[0];
// Khi items = undefined/null: currentData?.items â†’ undefined â†’ crash ngay khi gá»i .find()
```

**Giáº£i phÃ¡p:**
```typescript
// Fix 1: featuredItem â€” dÃ¹ng ?? thay vÃ¬ || Ä‘á»ƒ distinguish undefined vÃ  falsy
const rawFeatured = currentData?.items?.find(item => item.highlight) ?? currentData?.items?.[0];
const featuredItem = rawFeatured ?? { name: "", desc: "", price: "", img: "/images/pages/bacsi-1.jpeg" };

// Fix 2: items.filter/map â€” thÃªm ?? [] guard
{(currentData?.items ?? []).filter(item => !item.highlight).map(...)}

// Fix 3: featuredItem cho currentData khÃ´ng cÃ³ ?.
const featuredItem = (currentData?.items ?? []).find(item => item.highlight) 
  ?? (currentData?.items ?? [])[0] 
  ?? { name: "", desc: "", img: "/images/pages/bacsi-1.jpeg" };
```

**Files affected:**
- src/pages/DichVuPage.tsx (lines 307, 463)
- src/pages/ChuyenKhoaPage.tsx (lines 256, 521)
- src/pages/ChoBenhNhanPage.tsx (lines 276, 487)

**Phase:** 62

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a.

---

## Bug: RecordRequestModal - 2 Thanh Scrollbar Chá»“ng Nhau (2026-07-27)

**NgÃ y:** 2026-07-27

**Váº¥n Ä‘á»:**
Modal "YÃªu cáº§u trÃ­ch sao há»“ sÆ¡" hiá»ƒn thá»‹ 2 thanh scrollbar chá»“ng nhau â€” 1 cá»§a `Modal` wrapper, 1 cá»§a div body bÃªn trong `RecordRequestModal`.

**NguyÃªn nhÃ¢n:**
`RecordRequestModal` (dÃ²ng 225-247 báº£n cÅ©) tá»± bá»c `<div className="flex flex-col max-h-[90vh]">` + `<div className="p-6 overflow-y-auto">` bÃªn trong children, trong khi `Modal` (`src/components/ui/Modal.tsx:66-93`) Ä‘Ã£ tá»± lo `max-h-[92vh] flex flex-col overflow-hidden` + body `p-6 overflow-y-auto`. Káº¿t quáº£: 2 lá»›p scrollbar lá»“ng nhau.

**Giáº£i phÃ¡p:**
- Bá» wrapper `<div className="flex flex-col max-h-[90vh]">` trong `RecordRequestModal`, thay báº±ng fragment `<>`.
- Bá» class `overflow-y-auto` á»Ÿ div `p-6` body â€” Modal Ä‘Ã£ lo rá»“i.
- Header gradient custom váº«n dÃ¹ng `shrink-0` Ä‘á»ƒ khÃ´ng bá»‹ cuá»™n máº¥t khi body cuá»™n.

Cáº¥u trÃºc sau fix:
```
<Modal size="lg" showCloseButton={false}>
  â”œâ”€â”€ <div header gradient shrink-0>   â† header custom
  â””â”€â”€ <div p-6>                         â† body bÃ¬nh thÆ°á»ng
        â””â”€â”€ <form>...</form>
</Modal>
```

**Files affected:**
- src/components/public/RecordRequestModal.tsx (dÃ²ng 225-247)

**Phase:** 74

**Tráº¡ng thÃ¡i:** ÄÃ£ sá»­a.

**Commands:** tsc --noEmit - Passed (zero lá»—i má»›i; pre-existing errors á»Ÿ vite.config.ts, ChoBenhNhanPage.tsx, auth.routes.ts khÃ´ng liÃªn quan).

---

## Bug Re-encounter: Vite khÃ´ng pick up source fix trong container (2026-07-27)

**NgÃ y:** 2026-07-27 (gáº·p láº¡i sau Phase 74)

**Váº¥n Ä‘á»:**
Sau khi sá»­a `RecordRequestModal.tsx` trÃªn host, browser váº«n hiá»ƒn thá»‹ 2 scrollbar cÅ© â€” code khÃ´ng Ä‘Æ°á»£c pick up.

**NguyÃªn nhÃ¢n:**
- `docker-compose.yml:16` set `DISABLE_HMR=true` trong container frontend â†’ Vite khÃ´ng watch file.
- `vite.config.ts:18-19` theo Ä‘Ã³ set `hmr: false` + `watch: null` â†’ Vite khÃ´ng auto-transform khi file thay Ä‘á»•i, dÃ¹ mount `. â†’ /app` Ä‘Ã£ sync file tá»« host ngay láº­p tá»©c.
- ÄÃ£ ghi nháº­n quy táº¯c nÃ y tá»« **Phase 72** (`memory/phase-history.md:1804`, `memory/phase-history.md:1792`) nhÆ°ng khÃ´ng náº±m trong `AGENTS.md` â†’ dá»… quÃªn.

**Giáº£i phÃ¡p:**
```bash
docker restart bvdh-frontend
```
- Container restart trong ~3s, healthcheck `healthy` sau ~39s (láº§n Ä‘áº§u pháº£i npm install + Vite warmup).
- Verify: `docker exec bvdh-frontend grep <pattern> src/...` xÃ¡c nháº­n file Ä‘Ã£ sync.
- Verify: `docker exec bvdh-frontend wget -qO- http://127.0.0.1:8000/src/...` xÃ¡c nháº­n Vite Ä‘Ã£ transform láº¡i.
- Browser: **Ctrl+Shift+R** (hard reload) Ä‘á»ƒ bypass cache trÃ¬nh duyá»‡t.

**Äá» xuáº¥t cáº£i tiáº¿n AGENTS.md:**
ThÃªm 1 dÃ²ng ngáº¯n vÃ o má»¥c "Port Policy" hoáº·c táº¡o section má»›i "Docker Dev Workflow" nháº¯c rule "má»—i láº§n sá»­a file â†’ restart bvdh-frontend (HMR Ä‘ang táº¯t)". Hiá»‡n táº¡i rule nÃ y chá»‰ náº±m trong `phase-history.md` â†’ dá»… miss khi Ä‘á»c memory.md má»—i session Ä‘áº§u.

**ÄÃ£ apply (2026-07-27):** Section má»›i "ðŸ“Œ Docker Dev Workflow â€” Báº®T BUá»˜C NHá»š" Ä‘Ã£ Ä‘Æ°á»£c thÃªm vÃ o `AGENTS.md:170` ngay sau Port Policy, vá»›i Ä‘áº§y Ä‘á»§: nguyÃªn nhÃ¢n, quy táº¯c báº¯t buá»™c, triá»‡u chá»©ng Ä‘iá»ƒn hÃ¬nh, trÆ°á»ng há»£p KHÃ”NG cáº§n restart (backend tsx watch / Docker config rebuild / Prisma regenerate), vÃ  ghi chÃº vá» viá»‡c báº­t láº¡i HMR.

**Files affected:** (chá»‰ lÃ  sá»± cá»‘ khi sá»­a, khÃ´ng cÃ³ diff má»›i)
- `src/components/public/RecordRequestModal.tsx` (fix Phase 74)
- `docker-compose.yml:16` (config Ä‘Ã£ cÃ³ sáºµn, khÃ´ng Ä‘á»•i)
- `vite.config.ts:18-19` (config Ä‘Ã£ cÃ³ sáºµn, khÃ´ng Ä‘á»•i)

**Phase:** 74 (re-encounter â€” cÃ¹ng phase, khÃ´ng táº¡o phase má»›i vÃ¬ khÃ´ng cÃ³ code change má»›i)

**Tráº¡ng thÃ¡i:** ÄÃ£ verify workaround. Container `bvdh-frontend` healthy sau restart, Vite serve Ä‘Ãºng code fix.

**Commands:** docker restart bvdh-frontend â†’ healthy sau 39s. docker exec bvdh-frontend grep verify fix cÃ³ trong container.

---

## Feature: Enable Vite HMR cho Docker dev (2026-07-28)

### MÃ´ táº£

Báº­t láº¡i Vite HMR trong Docker dev environment Ä‘á»ƒ frontend auto-reload khi sá»­a code, thay vÃ¬ pháº£i `docker restart bvdh-frontend` má»—i láº§n.

### Thay Ä‘á»•i config

**docker-compose.yml:16**
```diff
- DISABLE_HMR=true
+ DISABLE_HMR=false
```

**vite.config.ts:18-19** tá»± Ä‘á»™ng báº­t HMR khi `DISABLE_HMR !== 'true'`:
```ts
hmr: process.env.DISABLE_HMR !== 'true' ? { clientPort: 3000 } : false,
watch: process.env.DISABLE_HMR === 'true' ? null : {},
```

Nginx config (`nginx/nginx.conf:133`) Ä‘Ã£ sáºµn proxy WebSocket cho HMR.

### Workflow má»›i

| Action | TrÆ°á»›c (HMR OFF) | Sau (HMR ON) |
|--------|-----------------|--------------|
| Sá»­a file frontend | `docker restart bvdh-frontend` + Ctrl+Shift+R | Chá»‰ save file â†’ browser auto-reload |
| Sá»­a file backend | `tsx watch` tá»± reload | Giá»¯ nguyÃªn |
| Sá»­a config Docker | `docker compose up -d --build` | Giá»¯ nguyÃªn |

### Verify

- Container `bvdh-frontend` healthy sau rebuild
- `wget -qO- http://127.0.0.1:8000/@vite/client` tráº£ vá» HMR client code
- Sá»­a file `RecordRequestModal.tsx` â†’ Vite inject `__vite__createHotContext` vÃ o module transform

### Files Changed

- `docker-compose.yml:16` (DISABLE_HMR=false)
- `AGENTS.md` section "Docker Dev Workflow" â€” cáº­p nháº­t rule HMR ON
- `memory.md` section "Docker Dev Workflow" â€” cáº­p nháº­t quy táº¯c má»›i
- `memory/phase-history.md` +Phase 76 entry

### Ghi chÃº

- Rule "restart container khi sá»­a frontend" váº«n giá»¯ trong AGENTS.md/memory.md nhÆ°ng ghi chÃº rÃµ: **chá»‰ Ã¡p dá»¥ng khi HMR OFF**. Khi HMR ON â†’ khÃ´ng cáº§n restart.
- Khi cáº§n táº¯t HMR Ä‘á»ƒ giá»‘ng production: Ä‘á»•i `false â†’ true` + `docker compose up -d --build public-web`.
## Bug: ?nh m?i thêm vào public/ không serve (tr? text/html SPA fallback) (2026-08-02)

- Trieu chung: 4 anh tender moi (software-it, computer-office, medicine-vial, ppe) them vao public/images/tenders/ khong hien thi tren web; GET /images/tenders/xxx.jpg tra status 200 nhung content-type text/html (943 bytes = index.html SPA fallback), khong phai image/jpeg.
- Root cause: server dang serve tu dist/ (production build). Anh chi trong public/ không tự động copy vào dist/ cho đến khi build. Đến đó dist/ build trước chỉ có 11 ảnh cũ.
- Fix: chay l\u1EA1i \
pm run build\ (Vite copy toan bo public/ -> dist/), roi \docker restart bvdh-frontend\. Verify GET trả image/jpeg đúng length.
- Lesson: Khi th\u00EAn anh moi vao public/images/tenders/ phai \n\nlat lai npm run build + restart frontend tr\u01B0\u1EDBc khi import-tender-images.ts (ke ca khico xem file trong dist/ chua.
