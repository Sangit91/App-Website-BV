# Changelog Legacy — BVĐK Website

> **[DEPRECATED]** Từ nay dùng `phase-history.md` cho các thay đổi có đánh số Phase.
> File này giữ lại các entry cũ không đánh số Phase để không mất dữ liệu.

---

## Font & Encoding Fixes (2026-07-19)

- Fix Google Fonts link in index.html (Baloo 2 + Be Vietnam Pro)
- Fix --font-display CSS variable to use Baloo 2
- Restore encoding in 13 files from git commit 8f2a512
- Files: Hero.tsx, WhyChooseUs.tsx, Organization.tsx, News.tsx, TinTucPage, SoDoToChucPage, LienHePage, GioiThieuPage, DichVuPage, ChoBenhNhanPage, ChuyenKhoaPage, ThongTinThauPage, TestLookup.tsx

**Commands:** npm run lint - Passed, npm run build - Passed

---

## HomePage Button Handlers (2026-07-19)

- Add event handlers in HomePage for booking, AI, test lookup, scroll
- Layout listens for bvdk:open-* custom events to trigger modals
- Fix non-functional buttons in Hero, QuickActions, CTABanner, Doctors

**Files affected:** HomePage.tsx, Layout.tsx

---

## LienHePage Contact Form (2026-07-19)

- Add form state management with useState
- Add handleChange and handleSubmit functions
- Add loading state during submission
- Add success message after submission

**Files affected:** LienHePage.tsx

---

## Card Style Standardization (2026-07-19)

Apply consistent card styling across all pages and components:
- rounded-2xl (was rounded-[20px])
- border-green-800/5 (was border-green-800/[0.04])
- hover:border-brand-green/30 on hover
- cursor-pointer and group class for interactive cards
- Duration 300ms for smooth transitions

**Files affected (13):**
- Card.tsx - Base component
- ChuyenKhoaPage.tsx, DichVuPage.tsx, GioiThieuPage.tsx
- SoDoToChucPage.tsx, TinTucPage.tsx, ThongTinThauPage.tsx
- ChoBenhNhanPage.tsx, News.tsx, Doctors.tsx
- Specialties.tsx, Testimonials.tsx, LienHePage.tsx

---

## Full Local Images Migration (2026-07-19)

Replaced 82 external URLs (Unsplash/Pexels) with local images:

**Files migrated (11):**
- Hero.tsx: Pexels → /images/hero/hero.jpeg
- Organization.tsx: 3 Pexels → /images/components/org-*.jpeg
- WhyChooseUs.tsx: 2 Pexels → /images/components/why-choose-*.jpeg
- GioiThieuPage.tsx: 9 Unsplash → local
- DichVuPage.tsx: 24 Unsplash → local
- ChuyenKhoaPage.tsx: 25 Unsplash → local
- ChoBenhNhanPage.tsx: 10 Unsplash → local
- LienHePage.tsx: 3 Unsplash → local
- SoDoToChucPage.tsx: 6 Unsplash → local
- TinTucPage.tsx: 2 Unsplash → local
- ThongTinThauPage.tsx: 1 Unsplash fallback → local

---

## Additional Image Fixes (2026-07-19)

Fixed broken local image references:
- tiendung-1.jpeg → tiemchung-1.jpeg (DichVuPage)
- thaisy-1.jpeg → sanphukhoa-1.jpeg (DichVuPage)
- chi-phi-1.jpeg → chiphi-1.jpeg (DichVuPage)
- photo-1586773860418-d37222d8f0a3 → /images/pages/coso-2.jpeg (GioiThieuPage)

---

## ThongTinThauPage Toggle Animation Fix (2026-07-19)

- Sửa animation rotation của nút thu gọn/expand department
- Thay `rotate: isExpanded ? 180 : 0` → `rotate: isExpanded ? 360 : 0`
- 90 độ khiến icon nằm ngang, 360 giữ nguyên hướng icon

**Files affected:** src/pages/ThongTinThauPage.tsx

**Commands:** npm run lint - Passed, npm run build - Passed

---

## TinTucPage Image Fixes (2026-07-19)

- Sửa 2 đường dẫn ảnh bị sai trong TinTucPage.tsx
- `news-placeholder.jpeg`: `/images/pages/` → `/images/components/` (ảnh nằm trong components folder)
- `chi-phi-1.jpeg` → `chiphi-1.jpeg` (thiếu dấu gạch ngang trong filename)

**Files affected:** src/pages/TinTucPage.tsx

**Commands:** npm run lint - Passed, npm run build - Passed