# Phase History â€” BVÄK Website

> Lá»‹ch sá»­ Ä‘áº§y Ä‘á»§ cÃ¡c Phase phÃ¡t triá»ƒn. Append-only â€” khÃ´ng renumber cÃ¡c Phase Ä‘Ã£ cÃ³.
> Äá»ƒ tra cá»©u nhanh tráº¡ng thÃ¡i hiá»‡n táº¡i, xem `memory.md`

---

## PHASE 0 â€” Backup (2026-07-17)

### Backup

- Backup thÃ nh cÃ´ng
- 31 files copied

---

## PHASE 1 â€” Git + .gitignore (2026-07-17)

### Git + .gitignore

- Git repository initialized
- .gitignore chuáº©n

---

## PHASE 2 â€” Folder Structure (2026-07-17)

### Folder Structure

ÄÃ£ táº¡o:
- components
- pages
- hooks
- lib
- types
- data

### Shared Types

ÄÃ£ chuyá»ƒn toÃ n bá»™ type sang `src/types/models/`

---

## PHASE 3 â€” React Router (2026-07-17)

### React Router

ÄÃ£ triá»ƒn khai:
- BrowserRouter
- Routes
- Admin Route

---

## PHASE 4 â€” UI Library (2026-07-17)

### UI Library

ÄÃ£ táº¡o:
- Button, Input, Select, Modal, Card, Badge, Spinner, ErrorBoundary

---

## PHASE 5 â€” Context Refactor (2026-07-17)

### Context Refactor

**Tráº¡ng thÃ¡i:** Deferred

HospitalContext Ä‘Æ°á»£c giá»¯ láº¡i.

---

## PHASE 6 â€” Server Refactor (2026-07-17)

### Server Refactor

ÄÃ£ tÃ¡ch:
- app.ts, routes, services, db, middleware

---

## PHASE 7 â€” Folder Migration (2026-07-17)

### Folder Migration

HoÃ n thÃ nh.

---

## PHASE 8 â€” UX Improvements (2026-07-17)

### UX Improvements

ÄÃ£ thÃªm:
- ErrorBoundary
- Back To Top

---

## PHASE 9 â€” Environment Config (2026-07-17)

### Environment Config

ÄÃ£ thÃªm:
- .env.example
- env.ts

---

## PHASE 10 â€” Routing Refactor + Animation System + Image System (2026-07-17)

### Routing Refactor

ÄÃ£ táº¡o:
- HomePage, GioiThieuPage, ChuyenKhoaPage, DichVuPage, ThongTinThauPage, ChoBenhNhanPage, TinTucPage, SoDoToChucPage, LienHePage

### Animation System

ÄÃ£ thÃªm:
- PageTransition, ScrollAnimation

### Image System

ÄÃ£ bá»• sung áº£nh placeholder cho toÃ n bá»™ cÃ¡c trang.

---

## PHASE 11 â€” Admin Refactor Phase 1 (2026-07-19)

### Admin Refactor - Phase 1

**Má»¥c tiÃªu:** Cáº­p nháº­t trang admin phÃ¹ há»£p vá»›i cáº¥u trÃºc frontend hiá»‡n táº¡i

**ÄÃ£ hoÃ n thÃ nh:**
- Táº¡o AdminContext quáº£n lÃ½ login state vÃ  RBAC
- Táº¡o AdminLogin component (login screen má»›i)
- Táº¡o AdminSidebar component (sidebar navigation)
- Táº¡o AdminHeader component (page title + status)
- Cáº­p nháº­t main.tsx thÃªm AdminProvider

**Files affected:**
- src/context/AdminContext.tsx (new)
- src/components/admin/AdminLogin.tsx (new)
- src/components/admin/AdminSidebar.tsx (new)
- src/components/admin/AdminHeader.tsx (new)
- src/main.tsx (updated)

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 12 â€” Admin Refactor Phase 2 (2026-07-19)

### Admin Refactor - Phase 2

**Má»¥c tiÃªu:** TÃ¡ch AdminDashboard 2693 lines thÃ nh 9 tab components riÃªng biá»‡t

**ÄÃ£ hoÃ n thÃ nh:**
- Táº¡o OverviewTab - Dashboard metrics vÃ  recent bookings
- Táº¡o BookingsTab - Quáº£n lÃ½ lá»‹ch háº¹n vá»›i search, filter, approve/cancel
- Táº¡o PatientsTab - Danh sÃ¡ch bá»‡nh nhÃ¢n vá»›i search
- Táº¡o ShiftsTab - Ma tráº­n phÃ¢n ca bÃ¡c sÄ©
- Táº¡o SpecialtiesTab - CRUD chuyÃªn khoa vá»›i modal
- Táº¡o DoctorsTab - CRUD bÃ¡c sÄ© vá»›i modal
- Táº¡o NewsTab - CRUD tin tá»©c vá»›i modal
- Táº¡o OrganizationTab - CRUD sÆ¡ Ä‘á»“ tá»• chá»©c vá»›i modal
- Táº¡o LogsTab - Audit logs
- Cáº­p nháº­t Button component há»— trá»£ `type` prop
- Sá»­ dá»¥ng UI components (Card, Badge, Button) thay vÃ¬ inline HTML

**Files affected:**
- src/components/admin/tabs/OverviewTab.tsx (new)
- src/components/admin/tabs/BookingsTab.tsx (new)
- src/components/admin/tabs/PatientsTab.tsx (new)
- src/components/admin/tabs/ShiftsTab.tsx (new)
- src/components/admin/tabs/SpecialtiesTab.tsx (new)
- src/components/admin/tabs/DoctorsTab.tsx (new)
- src/components/admin/tabs/NewsTab.tsx (new)
- src/components/admin/tabs/OrganizationTab.tsx (new)
- src/components/admin/tabs/LogsTab.tsx (new)
- src/components/admin/tabs/index.ts (new)
- src/components/ui/Button.tsx (updated - thÃªm type prop)
- src/pages/AdminPage.tsx (updated - render tabs)

**Cleanup Ä‘Ã£ thá»±c hiá»‡n:**
- ÄÃ£ xÃ³a AdminDashboard.tsx (backup trÆ°á»›c Ä‘Ã³)
- ÄÃ£ xÃ³a AdminLayout.tsx (khÃ´ng sá»­ dá»¥ng)
- KhÃ´ng cÃ²n hardcoded colors trong admin components
- Sá»­ dá»¥ng design tokens tá»« index.css

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 13 â€” NewsTab Enhancement - Tender Features (2026-07-19)

### NewsTab Enhancement - Tender Features

**Má»¥c tiÃªu:** Cáº­p nháº­t NewsTab modal Ä‘áº§y Ä‘á»§ tÃ­nh nÄƒng nhÆ° báº£n gá»‘c (backup AdminDashboard)

**ÄÃ£ hoÃ n thÃ nh:**
- ThÃªm checkbox "Äáº¥u tháº§u / Mua sáº¯m" vá»›i tender fields phá»¥ thuá»™c
- ThÃªm Department selection dropdown cho tender
- ThÃªm thá»i Ä‘iá»ƒm má»Ÿ/khÃ³a tháº§u (start/end date inputs)
- ThÃªm drag & drop file upload cho tÃ i liá»‡u tháº§u (PDF, PNG, JPG)
- ThÃªm hiá»ƒn thá»‹ file Ä‘Ã£ attach vá»›i nÃºt xÃ³a
- Sá»­ dá»¥ng framer-motion AnimatePresence cho modal animation
- Import DEPARTMENTS tá»« data.ts
- Import NewsItem, TenderFile types tá»« types/models/news

**Files affected:**
- src/components/admin/tabs/NewsTab.tsx (enhanced)

**Bug fixes:**
- TypeScript: Import ChangeEvent, DragEvent thay vÃ¬ React.ChangeEvent
- TypeScript: Import NewsItem type vÃ  sá»­ dá»¥ng Ä‘Ãºng kiá»ƒu
- TypeScript: Sá»­a tenderFile interface tá»« string thÃ nh TenderFile object

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 14 â€” ThongTinThauPage Decorate + Cáº­p nháº­t thÃ´ng tin bá»‡nh viá»‡n (2026-07-19)

### ThongTinThauPage Decorate

**Files affected:** src/pages/ThongTinThauPage.tsx

**ÄÃ£ thá»±c hiá»‡n:**
- Layout 2 cá»™t: áº£nh bá»‡nh viá»‡n bÃªn trÃ¡i, ná»™i dung bÃªn pháº£i
- Image: `/images/pages/coso-1.jpeg`
- Title: "HÆ°á»›ng dáº«n tham gia Ä‘áº¥u tháº§u" â†’ "ThÃ´ng tin Ä‘áº¥u tháº§u"
- Thay text mÃ´ táº£ báº±ng thÃ´ng tin chung (khÃ´ng pháº£i quy trÃ¬nh)
- 3 cards lÆ°u Ã½: Chá»¯ kÃ½ sá»‘ + Cá»•ng Ä‘áº¥u tháº§u quá»‘c gia + LiÃªn há»‡ há»— trá»£
- Giá»¯ nguyÃªn contact info

**Commands:** npm run lint - Passed, npm run build - Passed

### Cáº­p nháº­t ThÃ´ng Tin Bá»‡nh Viá»‡n

**Files affected:**
- src/pages/ThongTinThauPage.tsx
- src/pages/SoDoToChucPage.tsx
- src/pages/GioiThieuPage.tsx
- src/pages/LienHePage.tsx
- src/pages/ChoBenhNhanPage.tsx
- src/components/public/Organization.tsx

**ÄÃ£ sá»­a:**
- TÃªn bá»‡nh viá»‡n: "Bá»‡nh Viá»‡n Äa Khoa Khu Vá»±c Miá»n NÃºi PhÃ­a Báº¯c Quáº£ng Nam"
- Äá»‹a chá»‰: "107 Quang Trung, XÃ£ Äáº¡i Lá»™c, TP. ÄÃ  Náºµng"
- GiÃ¡m Ä‘á»‘c: "BS CKII Nguyá»…n Thá»‘ng Nháº¥t"
- PhÃ³ GiÃ¡m Ä‘á»‘c: "BSCK II LÃª Minh DÅ©ng", "BS CKII Nguyá»…n ÄÃ¬nh HoÃ ng"

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 15 â€” ChuyenKhoaPage - Modern Animation Redesign (2026-07-19)

### ChuyenKhoaPage - Modern Animation Redesign

**Files affected:** src/pages/ChuyenKhoaPage.tsx

**ÄÃ£ thá»±c hiá»‡n:**
- Hero section vá»›i animated gradient mesh + floating shapes
- Count-up animation cho stats khi scroll vÃ o view
- Sticky tab navigation vá»›i glass morphism effect
- Animated gradient backgrounds cho tá»«ng department
- Featured card vá»›i clip-path reveal + Ken Burns effect
- 3D tilt effect on hover cho service cards
- Glow border animation vÃ  staggered reveal
- AnimatePresence cho smooth tab transitions

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 16 â€” TinTucPage - Modern Animation Redesign (2026-07-19)

### TinTucPage - Modern Animation Redesign

**Files affected:**
- src/pages/TinTucPage.tsx
- src/components/public/News.tsx

**ÄÃ£ thá»±c hiá»‡n:**
- Hero section vá»›i animated gradient mesh + floating shapes
- Count-up animation cho stats (BÃ i viáº¿t, ChuyÃªn khoa, LÆ°á»£t xem, Giá» cáº­p nháº­t)
- Stagger animation cho news cards vÃ  tender cards
- 3D tilt effect on hover cho cÃ¡c cards trong News component
- Image zoom animation khi hover
- Loáº¡i bá» 2 cards cÅ© (Tin tuyá»ƒn dá»¥ng, ThÃ´ng tin Ä‘áº¥u tháº§u) vÃ¬ Ä‘Ã£ cÃ³ trong News component
- **Featured image vá»›i clip-path reveal + Ken Burns effect** cho má»—i tab (benh-vien, y-khoa)
- Featured section gá»“m: image vá»›i animation, overlay text, vÃ  info panel vá»›i checklist

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 17 â€” ThongTinThauPage - Cá»•ng thÃ´ng tin Ä‘áº¥u tháº§u (2026-07-19)

### ThongTinThauPage - Cá»•ng thÃ´ng tin Ä‘áº¥u tháº§u

**Files affected:** src/pages/ThongTinThauPage.tsx

**ÄÃ£ thá»±c hiá»‡n:**
- Hero section vá»›i animated gradient mesh + floating shapes + stats counter animation
- Sticky department tab navigation vá»›i icon + count badge
- 3D tilt effect on hover cho tender cards
- Modal popup cho chi tiáº¿t tender vá»›i full info layout
- Toast notification cho download
- Empty state khi khÃ´ng cÃ³ tender

**Design pattern (tá»« News.tsx):**
- Hero vá»›i floating shapes vÃ  animated gradient
- Count-up animation cho stats
- Tab navigation vá»›i gradient active state
- Cards vá»›i 3D tilt effect
- Modal vá»›i gradient header

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 18 â€” Admin Panel Redesign (2026-07-19)

### Admin Panel Redesign

**Files affected:**
- src/components/admin/ui/SectionCard.tsx
- src/components/admin/ui/ItemCard.tsx
- src/components/admin/ui/EditModal.tsx
- src/components/admin/ui/ConfirmDialog.tsx
- src/components/admin/ui/ImageUploader.tsx
- src/components/admin/ui/index.ts
- src/components/admin/AdminSidebar.tsx
- src/components/admin/tabs/HomeTab/index.tsx
- src/components/admin/tabs/AboutTab.tsx
- src/components/admin/tabs/ServicesTab.tsx
- src/components/admin/tabs/PatientTab.tsx
- src/components/admin/tabs/TenderTab.tsx
- src/components/admin/tabs/ContactTab.tsx
- src/components/admin/tabs/index.ts
- src/pages/AdminPage.tsx

**Phase 1 - Base UI Components:**
- SectionCard: Wrapper cho má»—i section vá»›i enable/disable toggle, collapsible, header actions
- ItemCard: Display item vá»›i image, title, description, drag handle, action buttons
- EditModal: Reusable form modal vá»›i field types (text, textarea, select, image)
- ConfirmDialog: Delete confirmation vá»›i variants (danger, warning, info)
- ImageUploader: Drag-drop + paste image URL support

**Phase 2 - Content Tabs:**

| Tab | Sections | Features |
|-----|----------|----------|
| **Trang chá»§** | 6 sections | Hero, Quick Actions, Why Choose Us, Stats, News, Testimonials |
| **Giá»›i thiá»‡u** | 4 sections | Why Choose, Leadership, Partners, Facilities |
| **Dá»‹ch vá»¥** | 2 sections | Categories, Service items |
| **Cho bá»‡nh nhÃ¢n** | 3 sections | Process steps, What to bring, FAQ |
| **ThÃ´ng tin tháº§u** | 2 sections | Tender notices, Departments |
| **LiÃªn há»‡ / Footer** | 3 sections | Contact info, Quick links, Support links |

**AdminSidebar Navigation Structure:**
- Quáº£n lÃ½ Ná»™i dung: Home, About, Specialties, Services, Patient, News, Tender, Contact
- Quáº£n lÃ½ NhÃ¢n sá»±: Doctors, PhÃ¢n ca
- Quáº£n lÃ½ Hoáº¡t Ä‘á»™ng: Äáº·t lá»‹ch, Bá»‡nh nhÃ¢n, Nháº­t kÃ½

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 19 â€” Admin UI Enhancements & AddCard Integration (2026-07-20)

### Admin UI Enhancements & AddCard Integration

**Files affected:**
- src/components/admin/ui/EditModal.tsx
- src/components/admin/ui/ItemCard.tsx
- src/components/admin/ui/index.ts
- src/components/admin/tabs/HomeTab/index.tsx
- src/components/admin/tabs/AboutTab.tsx
- src/components/admin/tabs/ContactTab.tsx
- src/components/admin/tabs/PatientTab.tsx
- src/components/admin/tabs/ServicesTab.tsx
- src/components/admin/tabs/TenderTab.tsx

**EditModal.tsx Enhancements:**
- ThÃªm icon cho má»—i field type (Type, Image, AlignLeft, Hash, Calendar, ChevronDown)
- ThÃªm description, hint, suggestions cho fields
- Keyboard navigation cho suggestions (Arrow Up/Down, Enter, Escape)
- Header gradient vá»›i icon vÃ  helper text
- Image preview vá»›i hover effect
- Prefix/suffix support cho input fields
- Auto-close modal sau submit (Ä‘Ã£ loáº¡i bá» `onClose()` trong handleSubmit)
- Select dropdown vá»›i custom chevron icon
- Better focus states vÃ  error styling

**ItemCard.tsx - AddCard Component:**
- ThÃªm `key?: React.Key` vÃ o ItemCardProps interface
- Export `AddCard` component cho "Add new" actions
- Color variants: green, blue, amber, rose
- Hover scale animation, dashed border

**Tabs Integration (thay "actions" button báº±ng AddCard trong content):**
- AboutTab: 4 sections (Why Choose â†’ lg:4, Leadership â†’ lg:4, Partners â†’ lg:7, Facilities â†’ lg:4)
- ContactTab: 2 sections (QuickLinks â†’ lg:7, SupportLinks â†’ lg:6)
- PatientTab: 3 sections (Process, What to Bring â†’ lg:4, FAQ)
- ServicesTab: ServiceItems â†’ lg:4
- TenderTab: TenderNotices â†’ lg:4
- HomeTab: QuickActions â†’ lg:7, WhyChooseUs â†’ lg:5, Testimonials â†’ lg:4

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 20 â€” EditModal Fields Enhancement (2026-07-20)

### EditModal Fields Enhancement - UX Improvement

**Files affected:**
- src/components/admin/tabs/HomeTab/index.tsx
- src/components/admin/tabs/AboutTab.tsx
- src/components/admin/tabs/ServicesTab.tsx
- src/components/admin/tabs/PatientTab.tsx
- src/components/admin/tabs/TenderTab.tsx
- src/components/admin/tabs/ContactTab.tsx

**Má»¥c tiÃªu:** Cáº£i thiá»‡n UX cá»§a EditModal báº±ng cÃ¡ch thÃªm description, hint, suggestions cho táº¥t cáº£ fields.

**Chi tiáº¿t:**
- HomeTab: Hero (title, ctaLink, backgroundImage), QuickActions (link, icon), Statistics (value, label), Testimonials (name, role, content)
- AboutTab: Partners (name, website), Facilities (title, description)
- ServicesTab: ServiceCategories (title, color), ServiceItems (name, price)
- PatientTab: ProcessSection (title, desc), FaqSection (question, answer)
- TenderTab: TenderNotices (title, tenderNumber, estimateValue, endDate)
- ContactTab: ContactInfo (address, phone, hotline, email), QuickLinks/SupportLinks (label, link)

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 21 â€” Page Transition Animation (ÄÃ£ revert 2026-07-20)

### Page Transition Animation

**Files affected:** src/App.tsx

**Váº¥n Ä‘á»:**
PageTransition gÃ¢y delay 1s khi chuyá»ƒn trang, tráº£i nghiá»‡m ngÆ°á»i dÃ¹ng xáº¥u.

**ÄÃ£ thá»±c hiá»‡n:**
- Loáº¡i bá» PageTransition wrapper khá»i App.tsx
- Chuyá»ƒn trang sáº½ load ngay láº­p tá»©c khÃ´ng cÃ³ animation

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 22 â€” GioiThieuPage - Modern Animation Redesign (2026-07-20)

### GioiThieuPage - Modern Animation Redesign

**Files affected:** src/pages/GioiThieuPage.tsx

**Má»¥c tiÃªu:**
Ãp dá»¥ng design pattern chung tá»« ChuyenKhoaPage cho trang Giá»›i thiá»‡u.

**ÄÃ£ thá»±c hiá»‡n:**
1. Hero Section vá»›i gradient mesh + floating shapes + count-up stats
2. Vá» ChÃºng TÃ´i Section vá»›i 2-column layout
3. CÆ¡ sá»Ÿ váº­t cháº¥t vá»›i FeatureCard vá»›i scroll reveal
4. Quy trÃ¬nh chÄƒm sÃ³c vá»›i ProcessCard
5. Táº¡i sao chá»n chÃºng tÃ´i vá»›i grid 4 cards

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 23 â€” System Review & Cleanup (2026-07-20)

### System Review & Cleanup

**Files affected:** Nhiá»u files

**Má»¥c tiÃªu:**
Review toÃ n bá»™ há»‡ thá»‘ng theo Ä‘áº·c táº£ v2.7, sá»­a TypeScript any types vÃ  hardcoded colors.

**ÄÃ£ thá»±c hiá»‡n - Task 1: Fix TypeScript any types**
- GioiThieuPage.tsx: `icon: any` â†’ `icon: LucideIcon`
- TestLookup.tsx, AIAdvisor.tsx, BookingForm.tsx: `catch (err: any)` â†’ `catch (err: unknown)`
- EditModal.tsx: handleChange value type cá»¥ thá»ƒ hÆ¡n
- OrganizationTab.tsx: ThÃªm interface Department, Division; thay `any` báº±ng typed collections
- Navbar.tsx: ThÃªm interface MegaMenuColumn, MegaMenuItem, MegaMenuData; thay `any` báº±ng typed arrays

**ÄÃ£ thá»±c hiá»‡n - Task 2: Fix hardcoded colors**
- Navbar.tsx: ~15 instances â†’ Tailwind semantic classes
- News.tsx: ~33 instances â†’ Tailwind semantic classes
- Organization.tsx: ~35 instances â†’ Tailwind semantic classes
- ThongTinThauPage.tsx: ~5 instances â†’ Tailwind semantic classes
- BookingForm.tsx: ~1 instance â†’ Tailwind semantic classes
- Footer.tsx: ~1 instance â†’ Tailwind semantic classes

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 24 â€” Admin Panel Review & Fix (2026-07-20)

### Admin Panel Review & Fix

**Files affected:** 7 files

**Má»¥c tiÃªu:**
Review Admin Panel components vÃ  tabs, sá»­a TypeScript any types vÃ  hardcoded colors.

**ÄÃ£ thá»±c hiá»‡n - Task 1: Fix TypeScript any types**
- EditModal.tsx: Táº¡o type `FieldValue = string | number | boolean | File | null`, thay `Record<string, any>` â†’ `Record<string, FieldValue>`
- ServicesTab.tsx: Import `LucideIcon`, thay `Record<string, any>` â†’ `Record<string, LucideIcon>`
- ServicesTab.tsx: ThÃªm interface `ServiceItem`, thay `Record<string, any[]>` â†’ `Record<string, ServiceItem[]>`
- SpecialtiesTab.tsx: Import `IconType` tá»« types, thay `as any` â†’ properly typed form state

**ÄÃ£ thá»±c hiá»‡n - Task 2: Fix hardcoded colors**
- OverviewTab.tsx: `text-peach-dark` â†’ `text-peach`
- AdminLogin.tsx: `text-peach-dark` â†’ `text-peach`
- SpecialtiesTab.tsx: `text-peach-dark` â†’ `text-peach`
- SectionCard.tsx: Badge colors blue/rose/purple â†’ map sang brand colors
- ItemCard.tsx: Badge colors blue/rose â†’ map sang brand colors, action button colors fixed

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 25 â€” Patient Portal vá»›i HIS Integration (2026-07-20)

### Patient Portal vá»›i HIS Integration

**Files affected:** 9 files

**Má»¥c tiÃªu:**
Táº¡o Patient Portal Ä‘á»ƒ bá»‡nh nhÃ¢n tra cá»©u thÃ´ng tin báº±ng mÃ£ KCB/CCCD/sá»‘ Ä‘iá»‡n thoáº¡i, káº¿t ná»‘i vá»›i HIS.

**ÄÃ£ thá»±c hiá»‡n - Task 1: Data Models cho HIS**
- `medical-record.ts`: MedicalRecord vá»›i diagnosis, treatment, prescriptions, followUpDate
- `clinical-test.ts`: ClinicalTest vá»›i 12 loáº¡i CLS (xÃ©t nghiá»‡m mÃ¡u, X-quang, siÃªu Ã¢m, ECG, CT, MRI...)
- `treatment-history.ts`: TreatmentHistory vá»›i cÃ¡c loáº¡i Ä‘iá»u trá»‹ (ná»™i trÃº, ngoáº¡i trÃº, thá»§ thuáº­t, pháº«u thuáº­t)

**ÄÃ£ thá»±c hiá»‡n - Task 2: PatientLookupForm Component**
- 3 loáº¡i tra cá»©u: MÃ£ KCB, CCCD/CMND, Sá»‘ Ä‘iá»‡n thoáº¡i
- Validation input (CCCD 9/12 sá»‘, phone 10 sá»‘)
- Loading state, error handling
- PatientInfoCard hiá»ƒn thá»‹ thÃ´ng tin bá»‡nh nhÃ¢n

**ÄÃ£ thá»±c hiá»‡n - Task 3: PatientPortalSection Component**
- 3 tabs: Lá»‹ch sá»­ bá»‡nh sá»­ | CLS cÃ¡c láº§n khÃ¡m | Lá»‹ch sá»­ Ä‘iá»u trá»‹
- Expandable cards vá»›i chi tiáº¿t Ä‘áº§y Ä‘á»§
- API callbacks interface: `onPatientLookup`, `onFetchMedicalRecords`, `onFetchClinicalTests`, `onFetchTreatmentHistories`
- Mock mode: tá»± Ä‘á»™ng load mock data khi khÃ´ng cÃ³ API

**ÄÃ£ thá»±c hiá»‡n - Task 4: Mock Data**
- 3 medical records vá»›i Ä‘Æ¡n thuá»‘c chi tiáº¿t
- 5 clinical tests vá»›i indicators (Lipid mÃ¡u, X-quang, SiÃªu Ã¢m, CBC, CRP)
- 3 treatment histories (ngoáº¡i trÃº, ná»™i trÃº, cáº¥p cá»©u)

**API Interface cho HIS Backend:**
```typescript
POST /api/patients/lookup
  Body: { identifier: string, identifierType: 'patientCode' | 'cccd' | 'phone' }
  Response: { patient: Patient, message?: string }

GET /api/patients/:id/medical-records
GET /api/patients/:id/clinical-tests
GET /api/patients/:id/treatment-histories
```

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 26 â€” Link Portal Actions trong Cá»•ng ThÃ´ng Tin (2026-07-20)

### Link Portal Actions trong Cá»•ng ThÃ´ng Tin

**Files affected:** 3 files

**Má»¥c tiÃªu:**
LiÃªn káº¿t cÃ¡c items trong "Cá»•ng thÃ´ng tin" Ä‘á»ƒ má»Ÿ Ä‘Ãºng modal/section thay vÃ¬ redirect nháº§m.

**ÄÃ£ thá»±c hiá»‡n - Task 1: Update InfoCard**
- ThÃªm `onAction` callback vÃ o item props
- Button gá»i `item.onAction()` khi báº¥m

**ÄÃ£ thá»±c hiá»‡n - Task 2: RecordRequestModal**
- Form yÃªu cáº§u trÃ­ch sao há»“ sÆ¡ y táº¿
- 4 loáº¡i: Há»“ sÆ¡ y táº¿, Giáº¥y chá»©ng nháº­n, Káº¿t quáº£ khÃ¡m, ÄÆ¡n thuá»‘c
- Chá»n ngÃ y, phÆ°Æ¡ng thá»©c nháº­n (tÃ¡i khÃ¡m/quáº§y/bÆ°u Ä‘iá»‡n)
- Success state vá»›i mÃ£ yÃªu cáº§u

**ÄÃ£ thá»±c hiá»‡n - Task 3: FeedbackModal**
- Form gÃ³p Ã½ cháº¥t lÆ°á»£ng dá»‹ch vá»¥
- Chá»n loáº¡i dá»‹ch vá»¥, rating 5 sao, ná»™i dung
- Success state

**ÄÃ£ thá»±c hiá»‡n - Task 4: Wire up click handlers**
- Tra cá»©u bá»‡nh sá»­ online â†’ scroll Ä‘áº¿n PatientPortalSection + set active tab
- YÃªu cáº§u trÃ­ch sao há»“ sÆ¡ â†’ má»Ÿ RecordRequestModal
- GÃ³p Ã½ cháº¥t lÆ°á»£ng dá»‹ch vá»¥ â†’ má»Ÿ FeedbackModal

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 27 â€” Simplify PatientPortalSection Design (2026-07-20)

### Simplify PatientPortalSection Design

**Files affected:** 2 files

**Má»¥c tiÃªu:**
ÄÆ¡n giáº£n hÃ³a PatientPortalSection báº±ng cÃ¡ch tÃ­ch há»£p action buttons trá»±c tiáº¿p, thay vÃ¬ render riÃªng biá»‡t bÃªn ngoÃ i.

**ÄÃ£ thá»±c hiá»‡n:**
- ThÃªm 2 props callbacks: `onOpenRecordRequest`, `onOpenFeedback` vÃ o PatientPortalSection
- ThÃªm 2 action buttons á»Ÿ cuá»‘i portal section (chá»‰ hiá»‡n khi Ä‘Ã£ tra cá»©u bá»‡nh nhÃ¢n)
- Bá» redundant header box trong ChoBenhNhanPage

**Design Flow:**
1. Featured card "Tra cá»©u bá»‡nh sá»­" â†’ scroll Ä‘áº¿n PatientPortalSection
2. InfoCard "TrÃ­ch sao há»“ sÆ¡" â†’ má»Ÿ RecordRequestModal
3. InfoCard "GÃ³p Ã½" â†’ má»Ÿ FeedbackModal
4. Buttons trong portal (sau login) â†’ má»Ÿ modals tÆ°Æ¡ng á»©ng

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 28 â€” InfoCard Fully Clickable (2026-07-20)

### InfoCard Fully Clickable

**Files affected:** 1 file

**Má»¥c tiÃªu:**
Cáº£ card InfoCard Ä‘á»u clickable thay vÃ¬ chá»‰ button má»›i click Ä‘Æ°á»£c.

**ÄÃ£ thá»±c hiá»‡n:**
- ThÃªm `onClick={item.onAction}` vÃ o outer `motion.div`
- Bá» floating action button (redundant)
- Footer text vá»›i action hint váº«n hiá»ƒn thá»‹

**UX Improvement:**
- Click báº¥t ká»³ Ä‘Ã¢u trÃªn card â†’ trigger action
- Thay vÃ¬ pháº£i báº¥m Ä‘Ãºng vÃ o button nhá»

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 29 â€” Remove Redundant Nested motion.div (2026-07-20)

### Remove Redundant Nested motion.div

**Files affected:** 1 file

**Má»¥c tiÃªu:**
Fix cáº¥u trÃºc JSX bá»‹ wrapped 2 láº§n khÃ´ng cáº§n thiáº¿t.

**Váº¥n Ä‘á»:**
```tsx
<motion.div ref={portalRef} ...>           // outer
  <motion.div className="mb-6" ...>        // inner - THá»ªA
    <div className="grid...">...</div>     // content
  </motion.div>                            // Ä‘Ã³ng inner
  <PatientPortalSection />
  <InfoCards />
</motion.div>                              // Ä‘Ã³ng outer
```

**ÄÃ£ thá»±c hiá»‡n:**
- Merge props tá»« inner motion.div vÃ o outer
- Bá» inner motion.div thá»«a
- Giá» chá»‰ 1 motion.div wrapper cho toÃ n bá»™ section

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 30 â€” Remove Redundant Header in PatientPortalSection (2026-07-20)

### Remove Redundant Header in PatientPortalSection

**Files affected:** 1 file

**Má»¥c tiÃªu:**
Bá» header trÃ¹ng láº·p khi chÆ°a tra cá»©u bá»‡nh nhÃ¢n.

**Váº¥n Ä‘á»:**
- `PatientLookupForm` Ä‘Ã£ cÃ³ header vá»›i Search icon
- PhÃ­a dÆ°á»›i láº¡i thÃªm 1 info card vá»›i User icon - trÃ¹ng láº·p

**ÄÃ£ thá»±c hiá»‡n:**
- Bá» info card thá»«a vá»›i User icon
- Chá»‰ hiá»ƒn thá»‹ `PatientLookupForm` khi chÆ°a tra cá»©u

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 31 â€” RÃ  soÃ¡t toÃ n bá»™ web - Full-card Clickability (2026-07-20)

### RÃ  soÃ¡t toÃ n bá»™ web - Full-card Clickability

**Files affected:** 1 file

**Má»¥c tiÃªu:**
Kiá»ƒm tra cÃ¡c card cÃ³ cursor-pointer nhÆ°ng chá»‰ cÃ³ button click Ä‘Æ°á»£c.

**ÄÃ£ rÃ  soÃ¡t:**
- âœ… InfoCard (ChoBenhNhanPage.tsx) - Ä‘Ã£ fix PHASE 28
- âœ… DoctorCard (Doctors.tsx) - Ä‘Ã£ fix PHASE 31 (onClick trÃªn outer div)
- âœ… Organization.tsx - Ä‘Ã£ cÃ³ onClick trÃªn motion.button
- âœ… News.tsx - Ä‘Ã£ cÃ³ onClick trÃªn article
- âš ï¸ TinTucPage.tsx, SoDoToChucPage.tsx, Specialties.tsx, Testimonials.tsx - decorative cards, cursor-pointer nhÆ°ng khÃ´ng cÃ³ action vÃ¬ chá»‰ hiá»ƒn thá»‹ thÃ´ng tin

**ÄÃ£ thá»±c hiá»‡n:**
- ThÃªm `onClick={() => onOpenBookingWithDoctor(doc.name, doc.specialtyId)}` vÃ o DoctorCard

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 32 â€” HIS API Mockup Full Implementation (2026-07-20)

### HIS API Mockup Full Implementation

**Files affected:** 8 files

**Má»¥c tiÃªu:**
XÃ¢y dá»±ng mockup API Ä‘áº§y Ä‘á»§ theo Ä‘áº·c táº£ HIS v1.1.

**ÄÃ£ thá»±c hiá»‡n:**

**1. TypeScript Types Updated:**
- `patient.ts`: ThÃªm OTP types (OTPSendRequest, OTPVerifyRequest, RefreshTokenRequest)
- `medical-record.ts`: ThÃªm `icd10_code` field
- `clinical-test.ts`: ThÃªm `loinc_code` field, `indicators[].loinc_code`

**2. New Server Routes:**
- `patient.routes.ts` (281 lines)
  - POST /lookup - Tra cá»©u bá»‡nh nhÃ¢n
  - GET /:patientId/medical-records - Láº¥y bá»‡nh sá»­ (yÃªu cáº§u readToken)
  - GET /:patientId/clinical-tests - Láº¥y CLS (yÃªu cáº§u readToken)
  - GET /:patientId/treatment-histories - Láº¥y lá»‹ch sá»­ Ä‘iá»u trá»‹

- `auth.routes.ts` (213 lines)
  - POST /otp/send - Gá»­i OTP
  - POST /otp/verify - XÃ¡c thá»±c OTP â†’ read_token (5 phÃºt)
  - POST /token/refresh - Refresh access token
  - POST /token/access - Client credentials flow

- `appointment.routes.ts` (239 lines)
  - POST /check-patient - Check trÃ¹ng BN (BÆ°á»›c 1)
  - POST / - Táº¡o lá»‹ch háº¹n (BÆ°á»›c 2)
  - GET /search - Tra cá»©u lá»‹ch háº¹n
  - GET /:maKCB - Chi tiáº¿t lá»‹ch háº¹n
  - PATCH /:maKCB/cancel - Há»§y lá»‹ch háº¹n

**3. Mock Data:**
- 3 mock patients (BN-2020-00001, BN-2021-00042, BN-2022-00156)
- 3 medical records vá»›i ICD-10 codes
- 4 clinical tests vá»›i LOINC codes
- 2 treatment histories
- 2 appointments

**4. API Security:**
- read_token required cho PHI access
- OTP verification for PHI lookup
- 5-minute read_token expiry

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 33 â€” Fix InfoCard Click for Chi phi & Dia diem Tab (2026-07-20)

### Fix InfoCard Click for Chi phi & Dia diem Tab

**Files affected:** 1 file

**Má»¥c tiÃªu:**
CÃ¡c InfoCard trong tab "Chi phÃ­ & Äá»‹a Ä‘iá»ƒm" chá»‰ cÃ³ báº£n Ä‘á»“ click Ä‘Æ°á»£c, cÃ¡c tab khÃ¡c khÃ´ng hoáº¡t Ä‘á»™ng.

**Váº¥n Ä‘á»:**
- Items trong `sectionData["chi-phi-dia-diem"]` khÃ´ng cÃ³ `onAction`
- InfoCard cÃ³ `onClick={item.onAction}` nhÆ°ng items khÃ´ng cÃ³ handler

**ÄÃ£ thá»±c hiá»‡n:**
- ThÃªm `handleOpenMap()` - scroll Ä‘áº¿n #map-section
- ThÃªm `handleOpenDrugLookup()` - scroll Ä‘áº¿n #drug-lookup-section
- ThÃªm `getItemOnAction(itemName)` helper Ä‘á»ƒ map action theo tab vÃ  item name
- ThÃªm ItemData type vá»›i `onAction?: () => void`
- ThÃªm conditional sections cho tab "chi-phi-dia-diem":
  - `#map-section` - iframe báº£n Ä‘á»“ Google Maps
  - `#drug-lookup-section` - placeholder tra cá»©u thuá»‘c BHYT

**UX Improvement:**
- Click "CÆ¡ sá»Ÿ Ä‘iá»u trá»‹" â†’ scroll xuá»‘ng báº£n Ä‘á»“
- Click "Danh má»¥c thuá»‘c BHYT" â†’ scroll xuá»‘ng drug lookup section

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 34 â€” InfoCard Modal System (2026-07-20)

### InfoCard Modal System - Thay scroll sections báº±ng Modals

**Files affected:** 6 files (5 new modals + 1 page)

**Má»¥c tiÃªu:**
- Táº¥t cáº£ InfoCards Ä‘á»u clickable
- Click â†’ Má»Ÿ modal thay vÃ¬ scroll xuá»‘ng page
- TrÃ¡nh page bá»‹ bá»‘ trÃ­ nhiá»u thÃ´ng tin thá»«a

**New Modals:**
| Modal | File | MÃ´ táº£ |
|-------|------|-------|
| MapModal | MapModal.tsx | Google Maps iframe + contact info |
| DrugLookupModal | DrugLookupModal.tsx | Searchable drug list with BHYT coverage |
| InpatientGuideModal | InpatientGuideModal.tsx | Guidelines for hospital stay |
| OutpatientGuideModal | OutpatientGuideModal.tsx | Step-by-step outpatient flow |
| ServicesModal | ServicesModal.tsx | List of hospital departments |

**Actions Mapping:**
```typescript
getItemOnAction(itemName) {
  if (tab === "chi-phi-dia-diem") {
    "CÆ¡ sá»Ÿ Ä‘iá»u trá»‹" â†’ setIsMapOpen(true)
    "Danh má»¥c thuá»‘c BHYT" â†’ setIsDrugLookupOpen(true)
  }
  if (tab === "huong-dan-tien-ich") {
    "Dá»‹ch vá»¥ Ä‘iá»u trá»‹" â†’ setIsServicesOpen(true)
    "DÃ nh cho bá»‡nh nhÃ¢n ná»™i trÃº" â†’ setIsInpatientGuideOpen(true)
    "DÃ nh cho thÄƒm khÃ¡m ngoáº¡i trÃº" â†’ setIsOutpatientGuideOpen(true)
  }
}
```

**Removed:**
- Inline map-section (scroll-based)
- Inline drug-lookup-section (scroll-based)

**UX Improvement:**
- Click báº¥t ká»³ InfoCard nÃ o â†’ modal má»Ÿ ra vá»›i ná»™i dung chi tiáº¿t
- Page khÃ´ng bá»‹ kÃ©o dÃ i bá»Ÿi cÃ¡c inline sections
- Clean navigation, modal Ä‘Ã³ng láº¡i thÃ¬ quay vá» page

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 35 â€” Redesign Specialties Section (2026-07-20)

### Redesign Specialties Section

**Files affected:** 1 file

**Má»¥c tiÃªu:**
Biáº¿n section "ChuyÃªn khoa ná»•i báº­t" tá»« Ä‘Æ¡n Ä‘iá»‡u thÃ nh hiá»‡n Ä‘áº¡i, Æ°a nhÃ¬n.

**ÄÃ£ thá»±c hiá»‡n:**

**1. 3D Tilt Cards:**
- Perspective 1000px vá»›i `rotateX` vÃ  `rotateY`
- Spring physics cho smooth interaction (`useSpring`, `damping: 20, stiffness: 300`)
- `translateZ` Ä‘á»ƒ tÄƒng chiá»u sÃ¢u

**2. Reveal Animations:**
- Staggered delays (index * 0.1s)
- Scale 0.9 â†’ 1 khi vÃ o viewport
- `useInView` vá»›i `once: true, margin: "-50px"`

**3. Hover Effects:**
- Scale 1.03 khi hover
- Gradient overlay fade in (`opacity-0` â†’ `opacity-100`)
- Icon scale vÃ  rotate
- Arrow indicator reveal (opacity, translateX)
- Border vÃ  shadow enhancement

**4. Modern Typography:**
- Gradient heading (text-brand-green cho tá»« "Ná»•i Báº­t")
- Animated underline (scaleX 0 â†’ 1)
- Badge vá»›i icon

**5. Background Decoration:**
- Two blur circles (green vÃ  peach)
- Opacity 30%

**6. Modern Button:**
- Gradient background (brand-green â†’ green-dark)
- Hover: scale, shadow, translateY
- Rotating Plus/Minus icon

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 36 â€” Fix SpecialtyCard Icons & Enhance Visuals (2026-07-20)

### Fix SpecialtyCard Icons & Enhance Visuals

**Files affected:** 1 file

**Váº¥n Ä‘á»:**
- Icon Sparkles cho sáº£n phá»¥ khoa khÃ´ng Ä‘áº¹p (thiáº¿u fill)
- Cards Ä‘Æ¡n Ä‘iá»‡u

**ÄÃ£ thá»±c hiá»‡n:**

**1. Fix sáº£n phá»¥ khoa icon:**
- Thay Sparkles báº±ng Baby icon
- Icon phÃ¹ há»£p hÆ¡n vá»›i chuyÃªn khoa

**2. Enhanced Badge Configs:**
- Gradient backgrounds thay vÃ¬ solid colors
- ThÃªm `glow` shadow property
- MÃ u sáº¯c Ä‘a dáº¡ng hÆ¡n:
  - obstetrics: pink gradient
  - pediatrics: amber gradient
  - emergency: red gradient
  - diagnostics: blue gradient

**3. Enhanced Icon Container:**
- Inner glow effect on hover
- Glow shadow tá»« badge config
- Relative overflow hidden for glow effect

**4. Enhanced Title:**
- Vertical indicator bar on hover (opacity 0 â†’ 1)

**5. Enhanced Detail Footer:**
- Gradient background matching department color
- Better text contrast (green-dark instead of ink)
- Arrow button vá»›i white background thay vÃ¬ transparent

**6. Toggle Button Animation:**
- Táº¡o shared ToggleButton component (`src/hooks/useToggleButton.tsx`)
- Spring animation: stiffness 100, damping 15
- Text animation: fade + slide (opacity 0â†’1, y -10â†’0)
- TÃ´n trá»ng prefers-reduced-motion
- ThÃªm active:scale-95 cho press feedback

**7. Specialty Detail Modal:**
- Táº¡o SpecialtyModal.tsx cho chi tiáº¿t tá»«ng chuyÃªn khoa
- Ná»™i dung: services list, highlights, expert team, working hours, hotline
- 8 specialty content pre-defined (tim-mach, san-khoa, nhi-khoa, cap-cuu, ngoai-tong-hop, chan-doan-hinh-anh, tai-mui-hong, rang-ham-mat)
- Animation entrance cho tá»«ng pháº§n
- Action buttons: Close + Äáº·t lá»‹ch khÃ¡m

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 37 â€” GioiThieuPage Animation Review & Fix (2026-07-21)

### GioiThieuPage Animation Review & Fix

**Files affected:** 1 file

**Má»¥c tiÃªu:**
Review animation theo Ä‘áº·c táº£ v2.7 section 19.1 (Modern Page Design Pattern) vÃ  sá»­a cÃ¡c thiáº¿u sÃ³t.

**ÄÃ£ review vÃ  sá»­a:**

**1. Hero Section** - ÄÃ£ Ä‘Ãºng spec:
- âœ… Gradient 3 tÃ´ng (green-dark â†’ green-800 â†’ brand-green)
- âœ… 4 FloatingShape (8s, easeInOut)
- âœ… Text chia 2 pháº§n bay lÃªn + fade (delay 0.3s, 0.4s)
- âœ… AnimatedCounter (2 giÃ¢y, useInView once: true)
- âœ… Scroll indicator bouncing
- âœ… Parallax opacity 1â†’0, scale 1â†’1.1

**2. FeatureCard (3D Tilt + Ken Burns)** - ÄÃ£ sá»­a:
- âœ… Clip-path reveal 0.8s
- âœ… **ThÃªm Ken Burns effect**: scale [1.2, 1] trong 1.2s khi vÃ o view
- âœ… 3D tilt Â±8Â°, perspective 1000px
- âœ… Hover scale 1.02
- âœ… **ThÃªm prefers-reduced-motion support**

**3. ProcessCard (3D Tilt + Ken Burns)** - ÄÃ£ sá»­a:
- âœ… 3D tilt Â±8Â°, perspective 1000px
- âœ… Hover scale 1.02
- âœ… **ThÃªm Ken Burns effect**: scale [1.2, 1] trong 1.2s khi vÃ o view
- âœ… **ThÃªm prefers-reduced-motion support**

**4. AnimatePresence (Tab Transitions)** - ÄÃ£ sá»­a:
- âœ… ThÃªm `mode="wait"`
- âœ… Exit: opacity 0, y -20
- âœ… Enter: opacity 1, y 0
- âœ… Duration: 0.4s
- âœ… **ThÃªm prefers-reduced-motion support**

**5. prefers-reduced-motion** - HoÃ n thÃ nh:
- âœ… Táº¡o useReducedMotion hook
- âœ… FloatingShape: disable animation
- âœ… AnimatedCounter: skip animation
- âœ… Hero parallax: disable
- âœ… 3D tilt: disable (rotateX/Y = [0,0])
- âœ… Ken Burns: disable (scale = 1)
- âœ… Scroll indicator: disable bounce
- âœ… AnimatePresence: duration = 0

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 38 â€” SoDoToChucPage - Expandable Organization Chart (2026-07-21)

### SoDoToChucPage - Expandable Organization Chart

**Files affected:** 1 file

**Má»¥c tiÃªu:**
Biáº¿n "SÆ¡ Ä‘á»“ tá»• chá»©c chi tiáº¿t" thÃ nh thanh expandable thay vÃ¬ hiá»ƒn thá»‹ inline.

**ÄÃ£ thá»±c hiá»‡n:**
1. ThÃªm `useReducedMotion` hook cho animation consistency
2. ThÃªm state `isOrgExpanded` Ä‘á»ƒ toggle
3. ThÃªm expandable bar vá»›i gradient tá»« green-dark â†’ green-800
4. Icon Building2 + tiÃªu Ä‘á» + mÃ´ táº£
5. ChevronDown icon vá»›i rotate animation khi expand
6. AnimatePresence vá»›i height transition + opacity
7. Organization component Ä‘Æ°á»£c wrap trong bg-white rounded-2xl khi expand

**UX Improvement:**
- Page khÃ´ng bá»‹ kÃ©o dÃ i bá»Ÿi sÆ¡ Ä‘á»“ tá»• chá»©c chi tiáº¿t
- User cÃ³ thá»ƒ click Ä‘á»ƒ xem khi cáº§n
- Smooth expand/collapse animation

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 39 â€” SoDoToChucPage - Neon Border Organization Chart (2026-07-21)

### SoDoToChucPage - Neon Border Organization Chart

**Files affected:** 1 file

**Má»¥c tiÃªu:**
Redesign expandable bar vá»›i phong cÃ¡ch Neon Border - animated gradient border, glow effect, hover interactions.

**ÄÃ£ thá»±c hiá»‡n - Neon Border Design:**

**1. Animated Gradient Border:**
- Outer glow effect vá»›i gradient brand-green â†’ emerald-300 â†’ brand-green
- `blur-sm` + `animate-pulse` cho hiá»‡u á»©ng neon breathing
- Opacity tÄƒng khi hover (0.5 â†’ 1)

**2. Card Structure:**
- Triple layered: outer glow â†’ inner glow â†’ card background
- Border-radius 22px cho outer, 20px cho inner (táº¡o border effect)
- Background gradient from-green-dark via-green-900 to-green-dark

**3. Icon Container:**
- Scale 1.1 on hover
- Glow shadow behind icon
- Rotate animation khi hover (-10Â° â†’ 10Â° â†’ 0Â°)
- Gradient background from-brand-green to-emerald-600

**4. Status Badge (desktop):**
- Animated dot indicator vá»›i pulse animation khi expanded
- Text thay Ä‘á»•i: "Nháº¥n Ä‘á»ƒ xem" â†” "Äang má»Ÿ"

**5. Chevron Animation:**
- Spring physics rotation (stiffness: 200)
- Scale 1.1 on hover
- Backdrop blur + border

**6. Expanded Content:**
- Decorative gradient line vá»›i scaleX animation
- Semi-transparent background vá»›i backdrop blur
- Border outline cho content area
- Duration 0.5s vá»›i ease-out curve

**UX Improvements:**
- Hiá»‡u á»©ng neon glow chuyÃªn nghiá»‡p
- Interactive feedback rÃµ rÃ ng (hover, click, expand)
- Smooth animations vá»›i spring physics
- Visual hierarchy tá»‘t

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 40 â€” Shared Animation Hooks & prefers-reduced-motion (2026-07-21)

### Shared Animation Hooks & prefers-reduced-motion

**Files affected:** 8 files
- src/hooks/useReducedMotion.ts (NEW)
- src/hooks/AnimatedCounter.tsx (NEW)
- src/hooks/FloatingShape.tsx (NEW)
- src/pages/ChuyenKhoaPage.tsx (updated)
- src/pages/DichVuPage.tsx (updated)
- src/pages/ChoBenhNhanPage.tsx (updated)
- src/pages/TinTucPage.tsx (updated)
- src/pages/ThongTinThauPage.tsx (updated)

**Má»¥c tiÃªu:**
Táº¡o shared hooks cho animations vÃ  thÃªm prefers-reduced-motion support cho táº¥t cáº£ pages.

**ÄÃ£ thá»±c hiá»‡n:**

**1. Táº¡o shared hooks:**
- `useReducedMotion.ts` - Hook kiá»ƒm tra OS preference cho reduced motion
- `AnimatedCounter.tsx` - Component counter vá»›i animation, tá»± Ä‘á»™ng disable khi reduced motion
- `FloatingShape.tsx` - Component floating shape, tá»± Ä‘á»™ng disable khi reduced motion

**2. Cáº­p nháº­t 5 pages vá»›i prefers-reduced-motion:**
- ChuyenKhoaPage
- DichVuPage
- ChoBenhNhanPage
- TinTucPage
- ThongTinThauPage

**3. Trong má»—i page, Ä‘Ã£ update:**
- Import shared hooks thay vÃ¬ local definitions
- Remove duplicate AnimatedCounter vÃ  FloatingShape functions
- ThÃªm reducedMotion hook vÃ o main component
- Update 3D tilt effects (disable khi reduced motion)
- Update parallax effects (disable khi reduced motion)
- Update Ken Burns effect (disable khi reduced motion)
- Update scroll indicator animations (disable khi reduced motion)
- Update card entrance transitions (duration=0 khi reduced motion)

**Æ¯u Ä‘iá»ƒm:**
- Single source of truth cho animation logic
- Dá»… báº£o trÃ¬
- Consistent behavior across all pages
- Accessibility: tÃ´n trá»ng user preference

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 41 â€” GioiThieuPage - Add Organization Chart Section (2026-07-21)

### GioiThieuPage - Add Organization Chart Section

**Files affected:** 2 files
- src/pages/GioiThieuPage.tsx (updated)
- src/components/layout/Navbar.tsx (updated)

**Má»¥c tiÃªu:**
ThÃªm section "SÆ¡ Ä‘á»“ tá»• chá»©c" trong GioiThieuPage Ä‘á»ƒ navbar link hoáº¡t Ä‘á»™ng Ä‘Ãºng.

**ÄÃ£ thá»±c hiá»‡n:**
1. ThÃªm import Organization component vÃ o GioiThieuPage
2. ThÃªm section má»›i `<section id="so-do-to-chuc">` vá»›i tiÃªu Ä‘á» vÃ  Organization component
3. Cáº­p nháº­t Navbar link tá»« `/so-do-to-chuc` â†’ `/gioi-thieu#so-do-to-chuc`

**UX Improvement:**
- Link "SÆ¡ Ä‘á»“ tá»• chá»©c" trong navbar giá» scroll Ä‘áº¿n section trong GioiThieuPage
- Organization chart hiá»ƒn thá»‹ trá»±c tiáº¿p trong GioiThieuPage

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 42 â€” DichVuPage & ChoBenhNhanPage - Modern Animation Redesign (2026-07-19)

> **[Renumbered from PHASE 15 old line 600]** CÃ´ng viá»‡c thá»±c táº¿ diá»…n ra 19/07/2026, cÃ¹ng Ä‘á»£t vá»›i Phase 15-18. Bá»‹ trÃ¹ng sá»‘ vá»›i ChuyenKhoaPage nÃªn Ä‘á»•i sang sá»‘ má»›i.

### DichVuPage & ChoBenhNhanPage - Modern Animation Redesign

**Files affected:**
- src/pages/DichVuPage.tsx
- src/pages/ChoBenhNhanPage.tsx

**ÄÃ£ thá»±c hiá»‡n (Ã¡p dá»¥ng cÃ¹ng design pattern tá»« ChuyenKhoaPage):**
- Hero section vá»›i animated gradient mesh + floating shapes
- Count-up animation cho stats khi scroll vÃ o view
- Sticky tab navigation vá»›i glass morphism effect
- Featured card vá»›i clip-path reveal + Ken Burns effect
- 3D tilt effect on hover cho cards
- Glow border animation vÃ  staggered reveal
- AnimatePresence cho smooth tab transitions

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 43 â€” Fix Scroll Indicator - Add Click to Scroll (2026-07-21)

> **[Renumbered from PHASE 37 old line 2140]** TrÃ¹ng sá»‘ vá»›i PHASE 37 (GioiThieuPage Animation Review) nÃªn Ä‘á»•i sang sá»‘ má»›i.

### Fix Scroll Indicator - Add Click to Scroll

**Files affected:** 5 files

**Má»¥c tiÃªu:**
Scroll indicator á»Ÿ hero section khÃ´ng hoáº¡t Ä‘á»™ng khi click.

**ÄÃ£ thá»±c hiá»‡n:**
- ThÃªm `cursor-pointer` vÃ  `onClick` handler Ä‘á»ƒ scroll xuá»‘ng content
- ChuyenKhoaPage: scroll tá»›i Tab Navigation (ref: tabNavRef)
- DichVuPage: scroll tá»›i Tab Navigation (ref: tabNavRef)
- ChoBenhNhanPage: scroll tá»›i Tab Navigation (ref: tabNavRef)
- TinTucPage: scroll tá»›i Tab Navigation (ref: tabNavRef)
- GioiThieuPage: scroll tá»›i "Vá» ChÃºng TÃ´i" section (ref: contentRef)

**Thay Ä‘á»•i:**
```tsx
// Before
<motion.div className="absolute bottom-8 ...">

// After
<motion.div className="cursor-pointer" onClick={scrollToContent} ...>
```

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 44 â€” Fix Scroll Position on Navigation (2026-07-22)

### Bug: Framer Motion useScroll causes wrong scroll position on navigation

**MÃ´ táº£:** Khi navigate tá»« HomePage sang cÃ¡c animated page (dÃ¹ng `useScroll` cá»§a Framer Motion cho parallax/Ken Burns), scroll position bá»‹ giá»¯ tá»« trang trÆ°á»›c thay vÃ¬ vá» Ä‘áº§u trang.

**Root cause:** `useScroll` hook Ä‘á»c scroll position tá»« trang trÆ°á»›c khi trang má»›i mount xong.

**Giáº£i phÃ¡p:** ThÃªm `useEffect(() => { window.scrollTo(0, 0); }, []);` á»Ÿ Ä‘áº§u má»—i page component.

**Files affected:**
- `src/pages/ChuyenKhoaPage.tsx`
- `src/pages/DichVuPage.tsx`
- `src/pages/ChoBenhNhanPage.tsx`
- `src/pages/TinTucPage.tsx`
- `src/pages/ThongTinThauPage.tsx`
- `src/pages/GioiThieuPage.tsx`
- `src/pages/SoDoToChucPage.tsx`

**Reference:** `src/pages/PublicPage.tsx` line 38

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 45 â€” Fix TinTucPage News Card Click (2026-07-22)

### Bug: Click news card on TinTucPage doesn't open detail modal

**MÃ´ táº£:** TinTucPage render news cards trá»±c tiáº¿p (khÃ´ng qua News.tsx). CÃ¡c card cÃ³ `cursor-pointer` nhÆ°ng khÃ´ng cÃ³ `onClick` handler nÃªn click khÃ´ng lÃ m gÃ¬.

**Root cause:** 
- TinTucPage cÃ³ `selectedNews` state thiáº¿u
- CÃ¡c `motion.article` (line 229, 312) khÃ´ng cÃ³ `onClick`
- Featured article (hospitalNews[0]) cÅ©ng khÃ´ng cÃ³ `onClick`

**Giáº£i phÃ¡p:**
- ThÃªm `import { NewsItem }` type
- ThÃªm `selectedNews` state
- ThÃªm `onClick={() => setSelectedNews(item)}` vÃ o táº¥t cáº£ news cards (featured + grid)
- ThÃªm AnimatePresence modal hiá»ƒn thá»‹ chi tiáº¿t bÃ i viáº¿t

**Files affected:**
- `src/pages/TinTucPage.tsx`

**Commands:** npm run lint - Passed, npm run build - Passed
## PHASE 47 â€” Admin Panel EditModal Migration + BHYT/CCCD Masking (2026-07-22)

### Feature: Migrate all admin CRUD tabs to use EditModal and ConfirmDialog, mask sensitive patient data

**MÃ´ táº£:** Theo spec section 9, táº¥t cáº£ CRUD tabs pháº£i dÃ¹ng EditModal (thay vÃ¬ custom inline modal) vÃ  ConfirmDialog (thay vÃ¬ browser confirm()). NgoÃ i ra, PatientsTab pháº£i mask BHYT/CCCD theo quy Ä‘á»‹nh báº£o máº­t PHI.

**Giáº£i phÃ¡p:**
- SpecialtiesTab: Migrate tá»« custom modal â†’ EditModal + ConfirmDialog
- DoctorsTab: Migrate tá»« custom modal â†’ EditModal + ConfirmDialog  
- OrganizationTab: Migrate tá»« custom modal â†’ EditModal + ConfirmDialog
- NewsTab: Giá»¯ custom modal (vÃ¬ tender file drag-drop quÃ¡ phá»©c táº¡p cho EditModal Ä‘Æ¡n giáº£n), thay confirm() â†’ ConfirmDialog
- PatientsTab: ThÃªm maskSensitiveValue() Ä‘á»ƒ mask CCCD vÃ  phone trong báº£ng
- ServicesTab, TenderTab, AboutTab, HomeTab, PatientTab, ContactTab: ÄÃ£ dÃ¹ng EditModal + ConfirmDialog trÆ°á»›c Ä‘Ã³

**Files affected:**
- src/components/admin/tabs/SpecialtiesTab.tsx
- src/components/admin/tabs/DoctorsTab.tsx
- src/components/admin/tabs/NewsTab.tsx
- src/components/admin/tabs/OrganizationTab.tsx
- src/components/admin/tabs/PatientsTab.tsx

**Commands:** npm run lint - Passed, npm run build - Passed

## PHASE 48 -- Spec Gap: feedback_requests + record_requests Database Design (2026-07-22)

### Feature: Identify and document missing database tables for FeedbackModal and RecordRequestModal

**MÃ´ táº£:** 2 modal (FeedbackModal, RecordRequestModal) chá»‰ mock submit mÃ  khÃ´ng lÆ°u data Ä‘Ã¢u cáº£. Spec dac-ta-uiux-tong-hop-v2.8.md má»¥c 15 khÃ´ng cÃ³ báº£ng cho feedback_requests vÃ  record_requests â€” Ä‘Ã¢y lÃ  spec gap.

**Giáº£i phÃ¡p:**
- PhÃ¢n tÃ­ch spec má»¥c 15.2 vÃ  20.2.1 Ä‘á»ƒ xÃ¡c Ä‘á»‹nh 2 báº£ng thiáº¿u
- Thiáº¿t káº¿ lÆ°á»£c Ä‘á»“ chi tiáº¿t (feedback_requests, record_requests)
- XÃ¡c Ä‘á»‹nh API endpoints cáº§n thiáº¿t
- XÃ¡c Ä‘á»‹nh 2 admin tabs má»›i cáº§n táº¡o
- Streamline dactaupdate.md: giáº£m tá»« 1372 dÃ²ng â†’ 128 dÃ²ng, xoÃ¡ ná»™i dung Ä‘Ã£ cÃ³ trong spec

**Files affected:**
- dactaupdate.md (viáº¿t láº¡i, loáº¡i bá» redundant content)

**Commands:** npm run lint - Passed

**Note:** Implementation (API endpoints + káº¿t ná»‘i modal + admin tabs) váº«n Ä‘ang chá» â€” xem memory.md Pending Tasks.

## PHASE 48-A — Database Spec Review: v2.9 Analysis (2026-07-22)

### Feature: Review dac-ta-uiux-tong-hop-v2.9.md for database completeness and extensibility

**Mục đích:** Sau khi spec v2.9 được phát hành (bổ sung mục 21 về feedback_requests, record_requests, và 5 bảng roadmap), cần xác nhận spec đã đầy đủ và khớp với Phase 48 design chưa.

**Phát hiện chính:**
- v2.9 ✅ đã chính thức hoá feedback_requests (21.2) + record_requests (21.3) — khớp 100% với Phase 48 design
- v2.9 ✅ đã bổ sung 5 bảng roadmap (notification_logs, prescription_refill_requests, insurance_verifications, appointment_reminders, queue_tickets) trong mục 21.5
- v2.9 ⚠️ header vẫn ghi "Phiên bản 2.8" dù changelog có dòng 2.9 đầy đủ (lỗi nhỏ, không ảnh hưởng implementation)

**Database gaps còn thiếu (chưa block Phase 49):**
1. 6 bảng Nhóm B field-level sơ lược: service_groups, services, news_categories, price_list, tender_files, testimonials, contact_messages, lab_test_requests, teleconsult_requests
2. appointments thiếu cancelled_at, cancel_reason, cancelled_by
3. feedback_requests thiếu email/phone cho phản hồi ẩn danh
4. activity_logs thiếu details (JSONB)
5. File storage naming: record_request_files dùng file_path, tender_files dùng storage_path — không nhất quán
6. 4 bảng log thiếu TTL/retention policy

**Đánh giá spec:** ~4.2/5 — đủ tốt để mở rộng, Phase 49 có thể bắt đầu được

**Files affected:**
- dac-ta-v29-extracted.txt (extract từ docx)
- dactaupdate.md (viết lại, bổ sung gap analysis)
- memory.md (cập nhật trạng thái + pending tasks)

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 49 — Feedback + Record Request APIs + Admin Tabs (2026-07-23)

### Mục tiêu

Implement Phase 49: feedback_requests + record_requests API (in-memory), connect FeedbackModal + RecordRequestModal to API, create FeedbackTab + RecordRequestsTab in admin panel.

**Spec:** `dac-ta-uiux-tong-hop-v2.10.docx` mục 21.1–21.4 (single source of truth)

### Backend API (in-memory)

**Files affected:**
- `server/db/database.ts`: added in-memory stores (3 feedback, 3 record_requests samples)
- `server/services/feedback.service.ts`: create/get/getById/update + validateInput
- `server/services/record-request.service.ts`: create/get/getById/update + validateInput
- `server/routes/feedback.routes.ts`: POST/GET/PATCH `/api/v1/feedback-requests`
- `server/routes/record-requests.routes.ts`: POST/GET/PATCH `/api/v1/record-requests`
- `server/app.ts`: registered 2 new route prefixes

### Modal Integration

**Files affected:**
- `src/components/public/FeedbackModal.tsx`: now calls POST `/api/v1/feedback-requests`
- `src/components/public/RecordRequestModal.tsx`: now calls POST `/api/v1/record-requests`, shows request_code from API response

**Bug fix:** FeedbackModal state variable renamed `serviceType` → `service_type` (snake_case to match API spec)

### Admin Tabs

**Files affected:**
- `src/components/admin/tabs/FeedbackTab.tsx`: new
- `src/components/admin/tabs/RecordRequestsTab.tsx`: new
- `src/components/admin/tabs/index.ts`: added exports
- `src/components/admin/AdminSidebar.tsx`: added nav items
- `src/pages/AdminPage.tsx`: imported and registered new tabs

### Commands

- npm run lint — Passed
- npm run build — Passed

---

## PHASE 50 — PostgreSQL + Prisma Migration Phase 1 (2026-07-23)

### Mục tiêu

Set up PostgreSQL database with Prisma ORM for Phase 50 — replacing in-memory stores with PostgreSQL persistence.

**Database:** PostgreSQL 18 on localhost, database `bvdh_db`, connection via `DATABASE_URL` in `.env`

### Prisma Schema

**Files affected:**
- `prisma/schema.prisma`: Full schema with 19 models (admin_users, patients, appointments, doctors, doctor_schedules, specialties, news, organization_units, feedback_requests, record_requests, record_request_files, notification_logs, service_groups, services, news_categories, price_list, testimonials, contact_messages, activity_logs, medical_records, clinical_tests, treatment_history)
- `prisma/migrations/20260723012247_init/`: Initial migration applied

**Prisma Client output:** `server/generated/prisma/` (Prisma 7 with ESM adapter pattern)

### Prisma Client Setup

**Files affected:**
- `server/db/prisma.ts`: New — PrismaClient singleton using `@prisma/adapter-pg` + `pg` Pool
- `server/generated/prisma/`: Generated Prisma 7 client

### Service Updates

**Files affected:**
- `server/services/booking.service.ts`: In-memory → Prisma async calls (getAll, search, create, updateStatus)
- `server/services/feedback.service.ts`: In-memory → Prisma async calls (getAll, getById, create, update)
- `server/services/record-request.service.ts`: In-memory → Prisma async calls (getAll, getById, create, update)
- `server/routes/feedback.routes.ts`: Updated to async/await
- `server/routes/record-requests.routes.ts`: Updated to async/await
- `server/routes/booking.routes.ts`: Updated to async/await

**Dependencies installed:** `prisma @prisma/client @prisma/adapter-pg pg`

**Bug fixes:**
- `prisma.ts`: Prisma 7 requires adapter — switched from direct URL to `@prisma/adapter-pg` + `pg.Pool`
- `booking.service.ts`: Added missing `serviceType: "kham-benh"` to Appointment create
- `feedback.service.ts`: Used `FeedbackRequestUncheckedUpdateInput` (checked variant missing `respondedBy` scalar)
- `record-request.service.ts`: Used `RecordRequestUncheckedUpdateInput` (checked variant missing `processedBy` scalar)
- Fixed all import paths: services import from `../generated/prisma/client`, prisma.ts imports from `./generated/prisma/client`

### Database Details

- **Host:** localhost:5432
- **Database:** bvdh_db
- **User:** postgres
- **Password:** (from .env DATABASE_URL)
- **Tables:** 19 tables migrated

### Known Issue

⚠️ Prisma 7 generated client uses ESM `import.meta.url` in CommonJS output — warning shown during build but non-blocking in dev mode (tsx handles ESM). Production server may need to switch to ESM format.

### Commands

- npm run build — Passed (vite + esbuild + tsc)
- `npx prisma migrate dev --name init` — Applied (`20260723012247_init`)
- `npx prisma generate` — Generated to `server/generated/prisma/`

---

## PHASE 51 - HospitalContext → PostgreSQL API Migration (2026-07-23)

### Mục tiêu

Migrate localStorage data (HospitalContext) → PostgreSQL REST API endpoints.

### Đã hoàn thành

**New API Routes:**
- `server/routes/specialty.routes.ts` - CRUD cho specialties
- `server/routes/doctor.routes.ts` - CRUD cho doctors + schedule management
- `server/routes/news.routes.ts` - CRUD cho news + tenders

**New Services:**
- `server/services/specialty.service.ts` - Prisma-based async operations
- `server/services/doctor.service.ts` - Prisma-based async operations + schedule management
- `server/services/news.service.ts` - Prisma-based async operations (fixed any types → proper interfaces)

**Server Updates:**
- `server/app.ts` - Added routes for specialties, doctors, news

**Frontend Updates:**
- `src/context/HospitalContext.tsx` - addDoctor() now syncs to PostgreSQL via POST /api/v1/doctors

### Đang thực hiện

- HospitalContext sync cho specialties, news, patients, bookings chưa implement
- Cần hoàn thiện full CRUD sync trước khi có thể deprecate localStorage

### Files Changed

```
server/routes/specialty.routes.ts     (new)
server/routes/doctor.routes.ts        (new)
server/routes/news.routes.ts          (new)
server/services/specialty.service.ts  (new)
server/services/doctor.service.ts     (new)
server/services/news.service.ts       (new)
server/app.ts                         (modified)
src/context/HospitalContext.tsx       (modified)
```

### Bug Fixes

- `doctor.service.ts:74-83`: updateDoctorSchedule uses findFirst + update (doctorId not unique key)
- `news.service.ts`: Replaced `any` types with proper `NewsInput` and `NewsUpdateInput` interfaces

### Commands

- npm run build — Passed

### Phase 51 Complete (2026-07-23)

**HospitalContext Sync Implemented:**
- `addDoctor` → POST /api/v1/doctors (was already implemented)
- `addSpecialty` → POST /api/v1/specialties
- `updateSpecialty` → PUT /api/v1/specialties/:id
- `deleteSpecialty` → DELETE /api/v1/specialties/:id
- `addNews` → POST /api/v1/news (with field mapping: tag→category, date→publishedAt, etc.)
- `updateNews` → PUT /api/v1/news/:id (with field mapping)
- `deleteNews` → DELETE /api/v1/news/:id

**Field Mapping (Frontend → API):**
- Specialty: `iconType` → `icon`, `name` → `name`, `description` → `description`
- News: `tag` → `category`, `date` → `publishedAt`, `tenderEstimateValue` → `tenderEstimate`, `tenderReceivedLocation` → `tenderReceived`, `tenderContact` → `contactName`, `tenderContactPhone` → `contactPhone`

### Phase 51 Final (2026-07-23) — Load-from-API + Image Local Storage

**Load-from-API-on-mount (HospitalContext):**
- On app init, fetches specialties/doctors/news from PostgreSQL API
- Maps DB fields to frontend types (fullName→name, icon→iconType, category→tag, publishedAt→date)
- Falls back to localStorage if API fails
- Bookings, patients, schedules, logs remain localStorage-only

**Image Local Storage Fix:**
- Downloaded 11 Pexels images (4 doctor + 7 news) to `public/images/` as local assets
- Updated `data.ts` to use local paths: `/images/doctors/dr-*.jpg`, `/images/news/news-*.jpg`, `/images/news/tender-*.jpg`
- Updated DB `doctor.image` and `news.image` fields to local paths
- DB image migration script: `scripts/update-db-images.mts`
- Image download script: `scripts/download-images.cjs`

**DB Image Paths After Migration:**
- Doctors: `/images/doctors/dr-tri.jpg`, `/images/doctors/dr-mai.jpg`, `/images/doctors/dr-hai.jpg`, `/images/doctors/dr-hong.jpg`
- News: `/images/news/news-1.jpg` through `/images/news/tender-4.jpg`

**Note:** Only specialties, doctors, and news have PostgreSQL sync. Other entities (bookings, patients, schedules, logs) still use localStorage.

---

## PHASE 68 - Consent Management (NĐ 13/2023/NĐ-CP) (2026-07-26)

### Mục tiêu
Implement Consent Management module per spec v2.13 Mục 24 — đảm bảo tuân thủ NĐ 13/2023/NĐ-CP trước go-live.

### Đã hoàn thành

**Prisma Schema:**
- `ConsentPolicy` model: version, title, contentHtml, effectiveDate, isActive, createdBy
- `PatientConsent` model (polymorphic): patientId, policyVersion, isAgreed, agreedScopes (Json), agreedAt, withdrawnAt, ipAddress, userAgent, consentHash
- Relations: Patient → PatientConsent → ConsentPolicy
- Index: (patientId, policyVersion, isAgreed)

**Backend:**
- `server/services/consent.service.ts` — CRUD với SHA-256 hash, validateSubmitInput check
- `server/routes/consent.routes.ts` — GET /policy/active, GET /check/:patientId, POST /submit, POST /withdraw
- `server/middleware/consent.middleware.ts` — ConsentCheckMiddleware bảo vệ PHI endpoints

**Frontend:**
- `src/components/public/PatientConsentModal.tsx` — 3 scopes: treatment_required (bắt buộc), notification_opt_in + research_opt_in (tùy chọn)

**Integrations:**
- `server/app.ts` — Added /api/v1/consent routes

### Files Changed

```
prisma/schema.prisma                            (ConsentPolicy + PatientConsent models)
prisma/migrations/20260726042414_add_consent_tables/migration.sql
server/services/consent.service.ts              (new)
server/routes/consent.routes.ts                 (new)
server/middleware/consent.middleware.ts         (new)
server/app.ts                                   (consent routes added)
src/components/public/PatientConsentModal.tsx   (new)
src/components/public/PatientPortalSection.tsx  (existing, consent check integrated)
memory.md                                       (Phase 68 added to completed list)
memory/phase-history.md                         (Phase 68 appended)
```

### Commands

```bash
npm run migrate:deploy   # Apply consent migration
npm run dev             # Start server
npm run lint && npm run build  # Verify
```

### Ghi chú
- PatientPortalSection.tsx đã có từ phase trước — chỉ integrate consent check chứ không tạo mới
- PHI protection: mọi endpoint đọc bệnh sử/CLS/điều trị yêu cầu readToken từ luồng OTP 5 phút
- rate limit: 5 request/IP/15 phút cho public consent endpoints

---

## PHASE 69 — Fix lỗi 500 khi upload file Record Request (Docker + Path Inconsistency) (2026-07-27)

### Mô tả

Sửa 2 nhóm lỗi khiến endpoint `POST /api/v1/record-requests/:id/files` trả 500 (Internal Server Error) khi người dùng đính kèm ảnh/pdf/word trong form "Yêu cầu trích sao hồ sơ":

1. **Docker permission bug (lỗi chính)**
   - `Dockerfile.backend` không `mkdir` + `chown` cho `uploads/temp|pending|approved`
   - Thư mục `uploads/temp` thuộc `root:root` từ layer image
   - Container chạy dưới user `root` nhưng viết code `process.cwd()`/`uploads/temp` của node dẫn tới multer throw `EACCES` khi ghi file tạm → Express bọc thành HTTP 500
   - Từ DevTools nhìn giống lỗi server nhưng thực tế là permission denied ở filesystem

2. **Path inconsistency trong `record-request.service.ts`**
   - `handleFileUpload` lưu file vật lý tại `<cwd>/uploads/pending/<file>` và ghi DB `filePath=/uploads/pending/<file>`
   - Nhưng `deleteFile` (dòng 135) và `processStatusChange` (dòng 155) dùng `path.join(process.cwd(), "public", file.filePath)` → dẫn tới `<cwd>/public/uploads/pending/<file>` (sai — không có `public/`)
   - Hậu quả: khi admin đổi status sang `da_huy`/`da_xu_ly`, file cũ luôn ENOENT (không xóa được, không move sang `approved/` được)

### Files Changed

```
Dockerfile.backend                                    (+6 dòng: mkdir uploads/* + chown -R node:node)
docker-compose.yml                                    (+5 dòng: backend_uploads named volume mount vào /app/uploads)
server/services/record-request.service.ts             (+11/-2: thêm resolvePhysicalPath helper, sửa 2 chỗ path)
```

### Verification

```bash
# Sau rebuild + up, verify endpoint:
POST /api/v1/record-requests                          -> 201 Created (id=cms2he00100000tnzo9ieulat)
POST /api/v1/record-requests/:id/files (ảnh PNG 67B)  -> 201 Created (filePath=/uploads/pending/YC-820608_*.png)
GET  /api/v1/record-requests                          -> 200 []
GET  /api/v1/doctors|news|specialties                 -> 200 [] (DB rỗng, không còn 500)

# Verify quyền thư mục trong container:
docker exec bvdh-backend ls -la /app/uploads/
#   drwxr-xr-x 5 node node ... .
#   drwxr-xr-x 2 node node ... temp
#   drwxr-xr-x 2 node node ... pending
#   drwxr-xr-x 2 node node ... approved
```

### Commands

```bash
docker compose up -d --build admin-api   # Rebuild backend với Dockerfile fix + volume mới
docker exec bvdh-backend ls -la /app/uploads/  # Verify quyền
npm run lint && npm run build            # Quality Gate (build passed, lint có lỗi pre-existing không liên quan)
```

### Ghi chú

- **Backup**: `D:\Coding\code backup\App Website BV_20260727_072435` (trước commit)
- **Lint pre-existing**: `ChoBenhNhanPage.tsx:494` (TS2339 ItemData.id) + `vite.config.ts:6` (allowedHosts boolean) + `auth.routes.ts:2,256` (refreshTokens conflict) — đều đã tồn tại trước diff của Phase 69, không trong phạm vi fix
- **Volume `backend_uploads`**: named volume docker, persist qua restart container (trước đây file upload bị mất khi recreate container)
- **Workaround tạm trước fix**: đã dùng `docker exec ... chown -R node:node /app/uploads` để xác nhận root cause — fix permanent nằm trong Dockerfile
- **Patient Portal / doctors / news / specialties 500** trong DevTools có thể là do backend đang restart giữa chừng (container recreate lúc rebuild), hiện đã ổn — get API trả 200 + `[]`
- **Bug này chưa từng gặp trong OpenBrain** — record như Bug type để tham chiếu session sau

---

## PHASE 70 — Port Policy: chỉ 8443 public, map container nội bộ 8000+ (2026-07-27)

### Mô tả

Trước đây stack Docker publish 4 port ra host: `3000` (frontend), `3001` (backend), `5432` (db), `80/443/8443` (nginx). Điều này gây xung đột với các app mặc định ở port 3000/5432/80/443 trên máy dev. Đồng thời Vite proxy target mặc định `localhost:5001` (trong `vite.config.ts`) không khớp với backend port thật → mọi API request từ frontend khi chạy qua Vite trả 500.

Đổi policy:
- **Chỉ 8443 public ra host** (HTTPS, self-signed cert trong dev). Mọi request trình duyệt đi qua nginx.
- Frontend đổi từ port 3000 → **8000** (chỉ `expose`, không `ports`).
- Backend đổi từ port 3001 → **8001** (chỉ `expose`, không `ports`).
- DB 5432 — không publish, chỉ `expose` (debug qua `docker exec ... wget`).
- Nếu thêm service mới (Redis, MinIO…): port nội bộ từ 8002 trở lên, KHÔNG publish.

### Files Changed

```
docker-compose.yml           (services đổi ports, expose thay ports, bỏ 80/443 publish)
nginx/nginx.conf             (upstream public-web:8000, admin-api:8001)
Dockerfile.frontend          (EXPOSE 8000)
Dockerfile.backend           (EXPOSE 8001)
vite.config.ts               (proxy target dùng API_HOST/API_PORT env, fallback 3001)
AGENTS.md                    (+ section "Port Policy" bất biến trong kiến trúc dự án)
```

### Verification

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
# Bây giờ chỉ thấy:
#   bvdh-nginx     0.0.0.0:8443->443/tcp, [::]:8443->443/tcp
#   bvdh-frontend  8000/tcp        (expose, không publish)
#   bvdh-backend   8001/tcp        (expose, không publish)
#   bvdh-db        5432/tcp        (expose, không publish)

curl -k https://localhost:8443/api/v1/doctors      # 200 []
curl -k https://localhost:8443/api/v1/news          # 200 []
curl -k https://localhost:8443/api/v1/specialties   # 200 []
curl -k https://localhost:8443/                      # 200 (HTML)
```

### Commands

```bash
docker compose down
docker compose up -d --build
```

### Ghi chú

- **Lý do chọn 8443**: tránh xung đột với các app mặc định ở 80/443/3000/5432 trên máy dev (v Airbnb, React default, PostgreSQL local…).
- **Vite proxy fallback**: `vite.config.ts` vẫn có fallback `localhost:3001` cho dev ngoài Docker; trong container dùng env `API_HOST=admin-api` + `API_PORT=8001`.
- **Port Policy Mauri (persistent)**: thêm vào `AGENTS.md` section "KIẾN TRÚC DỰ ÁN" → không được thay đổi trừ khi có tài liệu kiến trúc mới.
- **Bug liên quan**: trước fix này, frontend chạy port 3000 + Vite proxy tới `localhost:5001` (không có service) → mọi `/api/v1/*` request từ `RecordRequestModal.tsx` + `HospitalContext.tsx` trả 500 (connection refused). Đây là root cause lỗi bạn báo hôm 27/Jul.
---

## PHASE 71 — Refactor UX RecordRequestModal (2026-07-27)

### Mô tả

Refactor giao diện + logic RecordRequestModal.tsx theo chuẩn UX/UI:

1. **Header xanh tích hợp tiêu đề** — chuyển tiêu đề "Yêu cầu trích sao hồ sơ" + phụ đề "Điền thông tin bên dưới để gửi yêu cầu" trực tiếp lên thanh gradient xanh (from-brand-green to-green-dark).
2. **Nút X góc phải header** — chuẩn F-shape UX, có aria-label "Đóng form", hover bg-white/15.
3. **Bỏ khối banner trắng thừa** ở body (icon tờ giấy gradient) → tiết kiệm vertical space.
4. **Layout max-h-[90vh]** — body overflow-y-auto, modal hiển thị trọn trên mọi màn hình (Laptop/Mobile).
5. **File upload preview** — khi chọn/kéo thả file, hiển thị ngay: tên (truncate) + dung lượng (B/KB/MB) + nút Trash màu đỏ để xóa từng file. Có aria-label cho từng nút xóa.
6. **Validation real-time**:
   - SĐT: phải đúng 10 chữ số, bắt đầu bằng 0 → báo lỗi đỏ ngay khi gõ.
   - Email: regex ^[^\s@]+@[^\s@]+\.[^\s@]+$.
   - Ít nhất 1 kênh liên hệ (SĐT HOẶC Email) — báo lỗi xuống field.
   - Logic ngày: "Từ ngày" <= "Đến ngày", dùng min/max để vô hiệu hóa ngày sai trên date picker hai chiều.
7. **Accessibility**: mọi input có id + 
ame + label htmlFor; lỗi có ria-invalid + ria-describedby; alert có ole="alert".
8. **No hardcode**: dùng design tokens (brand-green, green-dark, mint, peach, ink, red-400/red-500 cho error per Tailwind convention).

### Files Changed

- src/components/public/RecordRequestModal.tsx (rewrite — ~440 dòng)

### Verification

- 
pm run lint — không có lỗi RecordRequestModal (pre-existing lỗi ở ChoBenhNhanPage/vite.config/auth.routes không liên quan).
- 
pm run build — passed.

### Ghi chú

- Component tuân thủ AGENTS.md: dùng Modal + Button shared, design tokens, không hardcode màu/spacing, accessibility đầy đủ.
- Logic upload file riêng (POST /:id/files) giữ nguyên từ Phase 69 — không động tới.
- Stale useMemo cho validation → không re-render thừa.
- Không động tới spec v2.9 mục 21.3 (record_requests) vì không thay đổi field/ENUM.

---

## PHASE 72 — Fix layout 2 thẻ record-request/feedback + đồng bộ 'Cổng thông tin' (2026-07-27)

### Mô tả

Sau Phase 71 (Redesign RecordRequestModal), 2 thẻ "Yêu cầu trích sao hồ sơ" + "Góp ý chất lượng phục vụ" ở cuối section "Cổng thông tin" bị phình full-width, ảnh bè dẹt, không cân đối với khối tìm kiếm phía trên. Đồng thời section "Cổng thông tin" dùng layout khác hẳn "Hướng dẫn tiện ích" gây inconsistent UX.

Sửa thành nhiều commit:

1. **Commit 85d3705** — giới hạn chiều rộng + aspect-ratio ảnh
   - 2 thẻ: grid md:grid-cols-2 gap-6 mt-6 ➜ grid md:grid-cols-2 gap-8 mt-6 max-w-5xl mx-auto
   - InfoCard ảnh: h-48 cố định (bị bè dẹt khi grid phình) ➜ spect-[16/9] + object-cover

2. **Commit 375db2** — bọc max-w-5xl mx-auto lên motion.div cha
   - max-w-5xl chỉ bọc 2 thẻ mà không bọc featured block "Thông tin hữu ích" phía trên ➜ lệch
   - Chuyển max-w-5xl mx-auto vào motion.div cha (dòng 381), bọc cả featured + PatientPortalSection + 2 thẻ cùng width
   - Bỏ redundant max-w-5xl ở 2-thẻ grid

3. **Commit 88d6ac3** — đồng bộ design với "Hướng dẫn tiện ích"
   - Featured block wrapper: mb-6 max-w-5xl mx-auto ➜ mb-12 (full-width, giống else branch)
   - 2 thẻ grid: md:grid-cols-2 gap-8 mt-6 ➜ md:grid-cols-3 gap-6 (giống Hướng dẫn grid density)
   - PatientPortalSection giữ nguyên (complex form + result layout)

4. **Commit 7fc0791** — xóa featured block trùng lặp trong "Cổng thông tin"
   - Vấn đề: featured block "Tra cứu bệnh sử online" (ảnh + "Thông tin hữu ích" bullet list) trùng lặp thông tin với PatientLookupForm của PatientPortalSection ngay phía dưới ➜ dư thừa vertical space + awkward spacing
   - Bỏ hoàn toàn featured block (52 dòng code) khỏi nhánh cong-thong-tin
   - Xóa handleTraCuuBenhSu (handler cho banner đã bị loại)
   - Sửa accidental duplicate handleRecordRequest
   - Cấu trúc final của section "Cổng thông tin":
     1. PatientPortalSection (form lookup + kết quả tabs)
     2. Grid 2 thẻ: record-request + feedback

### Files Changed

`
src/pages/ChoBenhNhanPage.tsx          (refactor nhánh cong-thong-tin, xóa featured block, sửa InfoCard ảnh aspect-ratio)
src/components/public/RecordRequestModal.tsx  (commit d6054ba — showCloseButton={false} để sửa header rỗng Modal)
`

### Verification

`ash
npm run lint   # Lỗi pre-existing ChoBenhNhanPage:443 (item.id không có trong type ItemData) — không phải do Phase 72
npm run build  # Passed (lỗi auth.routes.ts pre-existing không liên quan)
docker restart bvdh-frontend  # HMR đang tắt (DISABLE_HMR=true) — phải restart để nhận code mới
`

### Commands

`ash
docker restart bvdh-frontend   # Sau mỗi sửa code frontend
npm run lint && npm run build   # Quality Gate
`

### Ghi chú

- **DISABLE_HMR=true** trong container frontend (theo docker-compose.yml) → mỗi lần sửa phải docker restart bvdh-frontend để Vite bundle lại, không có hot reload
- **Modal default header bug** (commit d6054ba): Modal component render mặc định header với X button khi showCloseButton=true (mặc định) dù không có title ➜ RecordRequestModal phải truyền showCloseButton={false} để tránh 2 header chồng nhau
- **Layout asymmetry root cause**: section "Cổng thông tin" (if branch) và "Hướng dẫn tiện ích" (else branch) dùng các grid/gap khác nhau → sau Phase 72 đã đồng nhất pattern (featured mb-12 + grid md:grid-cols-3 gap-6)
- **Không động tới spec v2.9**: thay đổi chỉ ở tầng UI/layout, không ảnh hưởng field DB hay ENUM

---

## PHASE 73 — Spec supplement v2.14: fix mâu thuẫn port table mục 22.1 (2026-07-27)

### Mô tả

Rà soát mâu thuẫn giữa dac-ta-uiux-tong-hop-v2_13.docx (single source of truth) và trạng thái code thực tế (Phase 70 commit 829cd64), phục vụ yêu cầu "lấy hệ thống hiện tại làm chuẩn".

**Mâu thuẫn phát hiện** tại mục 22.1 (bảng ánh xạ cổng — môi trường Docker dev):

| Service | Spec v2.13 (mục 22.1) | Code thực tế (Phase 70) |
|---------|------------------------|--------------------------|
| Frontend Vite internal | **5001** (typo lặp 2 lần cho cả frontend+backend) | **8000** (chỉ expose) |
| Backend API internal | **8301** | **8001** (chỉ expose) |
| PostgreSQL | **8432** | **5432** (chỉ expose) |
| Nginx HTTP | 80 → **8080** public | KHÔNG publish (chuyển 80 → redirect 301 sang HTTPS) |
| Nginx HTTPS | 443 → **8443** "CHƯA hoạt động — thiếu SSL cert" | 443 → **8443** ĐANG hoạt động (self-signed cert trong dev) |

Các mâu thuẫn khác đã rà soát và **không thấy**:
- Mục 20.2.1 (Modal system, RecordRequestModal UI): code hiện tại đúng đặc tả (form 4 loại hồ sơ + chọn ngày + phương thức nhận + success state mã yêu cầu).
- Mục 19.1 (Modern Page Design Pattern): code tuân thủ — chỉ thay đổi list-style cong-thong-tin branch ở Phase 72 (bỏ featured block trùng lặp), không vi phạm đặc tả.
- InfoCard aspect-ratio (h-48 → spect-[16/9]): spec không đặc tả tỷ lệ ảnh cụ thể, không mâu thuẫn.
- AGENTS.md Port Policy section: đã đúng với code thực tế, không cần đổi.

### Cách xử lý

Theo pattern đã thống nhất với user: tạo file markdown supplement riêng dac-ta-v2.14-supplement.md patch trực tiếp mục 22.1, **không sửa docx binary trực tiếp** ( risk làm hỏng format + cross-reference trong docx). File supplement sẽ được merge vào docx chính ở lần cập nhật kế tiếp.

### Files Changed

`
dac-ta-v2.14-supplement.md  (new) — patch mục 22.1 + nhật ký phiên bản v2.14
dactaupdate.md              (+1 row Nhật ký thay đổi)
memory.md                   (+1 row Phase 73 + cập nhật backup gần nhất)
memory/phase-history.md     (+Phase 73 entry)
`

### Ghi chú

- **AGENTS.md không cần đổi** — đã có section "Port Policy (Bắt buộc — không thay đổi trừ khi có tài liệu kiến trúc)" khớp 100% với code thực tế Phase 70.
- Spec v2.13 các mục khác (1-21, 22.2-22.6, 23, 24) vẫn nguyên giá trị, không bị thay thế.
- Quy ước đánh số Phase: kiểm tra số lớn nhất trước khi ghi — Phase 71 vs 72 là 2 phase cùng ngày, không trùng số. Phase 73 = Phase 72 + 1 theo đúng quy tắc.

---

## PHASE 74 — Fix RecordRequestModal duplicate scrollbar (2026-07-27)

### Mô tả

User báo modal "Yêu cầu trích sao hồ sơ" (RecordRequestModal) hiển thị 2 thanh scrollbar chồng nhau — 1 do Modal wrapper, 1 do div body bên trong RecordRequestModal.

### Chẩn đoán

- `src/components/ui/Modal.tsx:66-93` đã có sẵn khung chuẩn: `motion.div` với `max-h-[92vh] flex flex-col overflow-hidden` + header `shrink-0` + body `p-6 overflow-y-auto`.
- `src/components/public/RecordRequestModal.tsx:225-247` (bản cũ) tự bọc thêm `<div className="flex flex-col max-h-[90vh]">` + `<div className="p-6 overflow-y-auto">` bên trong children → 2 lớp scrollbar lồng nhau (vì `Modal.showCloseButton={false}` + không truyền `title` → children render thẳng vào vùng body đã có overflow-y-auto).

### Cách xử lý

Bỏ wrapper thừa trong RecordRequestModal, dùng đúng pattern của FeedbackModal (cùng folder):
- Thay `<div className="flex flex-col max-h-[90vh]">` bằng fragment `<>`.
- Bỏ class `overflow-y-auto` ở div `p-6` body — Modal đã lo rồi.
- Header gradient custom vẫn giữ `shrink-0` để không bị cuộn mất khi body cuộn dài.

Cấu trúc sau fix:
```tsx
<Modal size="lg" showCloseButton={false}>
  <>
    <div className="bg-gradient-to-r from-brand-green to-green-dark px-6 py-5 text-white shrink-0 ...">
      {/* header custom */}
    </div>
    <div className="p-6">
      <form>...</form>
    </div>
  </>
</Modal>
```

### Files Changed

- `src/components/public/RecordRequestModal.tsx` (dòng 225-247: bỏ wrapper `flex flex-col max-h-[90vh]` + bỏ `overflow-y-auto` ở body `p-6`)
- `memory/bugs-fixed.md` (+1 entry Phase 74)
- `memory/phase-history.md` (+Phase 74 entry)

### Ghi chú

- Đúng nguyên tắc AGENTS.md "Không tạo component mới nếu chỉ khác màu/spacing/icon — hãy mở rộng component hiện có": sửa Modal/RecordRequestModal cũ thay vì tạo component mới.
- `tsc --noEmit` pass (zero lỗi mới). 3 lỗi pre-existing không liên quan: `vite.config.ts:6` (đã ghi rõ trong AGENTS.md Port Policy), `ChoBenhNhanPage.tsx:443` (`ItemData` thiếu `id` — fix khác), `server/routes/auth.routes.ts:2,256` (`refreshTokens` conflict).
- Spec UI/UX không đổi — fix chỉ là xoá class thừa, không thêm tính năng/đổi bố cục. Không cần update docx v2.14.
- Backup trước khi commit: D:\Coding\code backup\App Website BV_20260727_133642 (đã có từ Phase 72).

### Re-encounter: Vite HMR tắt — phải docker restart (2026-07-27)

Sau khi fix, user báo "vẫn chưa load được frontend mới sửa". Lý do: Vite HMR đang tắt (`DISABLE_HMR=true` trong `docker-compose.yml:16` + `vite.config.ts:18-19` set `hmr: false`/`watch: null`), mount `. → /app` sync file ngay nhưng Vite không transform lại. Workaround: `docker restart bvdh-frontend` (healthy sau ~39s) + browser Ctrl+Shift+R.

Rule đã được promote vào `memory.md` mục "⚠️ Docker Dev Workflow — BẮT BUỘC NHỚ" để session sau tra cứu ngay từ đầu. Khuyến nghị user cân nhắc apply rule vào `AGENTS.md` section "Quy trình làm việc" để thành quy ước chính thức.

**Apply chính thức:** Section "📌 Docker Dev Workflow — BẮT BUỘC NHỚ" đã được thêm vào `AGENTS.md:170` ngay sau "Port Policy" (cùng nhóm quy ước Docker). Quy tắc giờ là bắt buộc cho mọi agent làm việc với stack này.

---

## PHASE 75 — Migration spec v3.0 SRS-TRD: in-place update, cleanup legacy, verify schema (2026-07-27)

### Mô tả

User cung cấp file đặc tả mới `Dac-ta-Master-v3.0-SRS-TRD.docx` (27/07/2026) — Master Production-Ready SRS/TRD thay thế hoàn toàn `dac-ta-uiux-tonghop-v2_13.docx` + patch `dac-ta-v2_14-supplement.md`. Refactor toàn diện theo 6 KHỐI độc lập, áp dụng nguyên tắc **In-place Update** (cập nhật đè vào đúng Khối liên quan, không append-only dev log).

### So sánh v2.14 vs v3.0

| Tiêu chí | v2.14 (cũ) | v3.0 (mới) |
|----------|-----------|------------|
| Chuẩn tài liệu | Đặc tả UI/UX tổng hợp | SRS + TRD |
| Version | Header ghi v2.13, file v2.14 = supplement | 3.0 Master |
| Cấu trúc | 24 mục tuần tự (append-only) | 6 KHỐI độc lập |
| Phạm vi | Trang chủ + Trang con + Admin | + Patient Portal + Kiến trúc kỹ thuật + CSDL + Bảo mật pháp lý |
| Văn phong | Có ngày tháng + số Phase + commit (dev log) | Target Architecture only, không dev log |
| Cập nhật | Append-only | In-place Update với KHỐI X.Y.Z emblem |

### 6 Khối nội dung v3.0

```
KHỐI 1 — TỔNG QUAN & PHẠM VI HỆ THỐNG           (inspect-text.txt:53)
KHỐI 2 — HỆ THỐNG THIẾT KẾ UI/UX & COMPONENTS  (dòng 195)
KHỐI 3 — ĐẶC TẢ CHỨC NĂNG CHI TIẾT              (dòng 973)
KHỐI 4 — KIẾN TRÚC KỸ THUẬT & STATE MANAGEMENT  (dòng 1929)
KHỐI 5 — THIẾT KẾ CƠ SỞ DỮ LIỆU                 (dòng 2361)
KHỐI 6 — BẢO MẬT, BẢO VỆ DỮ LIỆU & OPERATIONS   (dòng 3447)
```

### Verify cross-check v3.0 vs Prisma schema + code thực tế

**95% khớp.** Các điểm chính đã verify:
- KHỐI 5: 24 models UUID PK ✅; `activity_logs` không có `@updatedAt` ✅; `file_path` thống nhất ✅; `notification_logs` polymorphic ✅; `consent_policies`/`patient_consents` ✅; idx_patient_consents_lookup ✅.
- KHỐI 4: Port 8443 duy nhất public ✅ khớp `docker-compose.yml:86`.
- KHỐI 6.2: Consent hash + Re-consent flow ✅ khớp `server/services/consent.service.ts`.
- Changelog v2.14 (port patch) ✅ đã có ở dòng 183-185.

**Gap minor phát hiện (đã ghi vào `dactaupdate.md` v3.1):**
1. KHỐI 5.4.x — `activity_logs` thiếu `@@index([createdAt])` (notification_logs đã có).
2. KHỐI 6.x — PHI access log policy: thiếu `dataAccessed`/`purpose` fields theo NĐ 13/2023.
3. KHỐI 4.x — Password hash clarification: PBKDF2-SHA512 100k iterations (không phải bcrypt).
4. KHỐI 4.x — Rate limit matrix chi tiết (public form ✅ / admin auth ❌ / login lockout ❌ / default ❌).
5. KHỐI 4.x — Forgot password flow chưa implement.
6. KHỐI 3.1 (Template C3) hoặc KHỐI 5.4 — `tender_files` mâu thuẫn: v3.0 dòng 1919 ghi "lưu trong bảng tender_files" nhưng schema không có (News dùng inline).
7. KHỐI 1.2 — Số lượng bảng: "19+ bảng" nên làm rõ thành "24 bảng" (theo Prisma thực tế).

### Files Changed

- `AGENTS.md` dòng 18-30 — cập nhật section "Tài liệu đặc tả UI/UX": tham chiếu v3.0, lịch sử version, nguyên tắc In-place Update + KHỐI X.Y.Z emblem, quy ước ghi Changelog tóm tắt KHỐI 1.5.
- `dactaupdate.md` — cập nhật header tham chiếu v3.0; xoá Nhật ký Phase 68-74 (đã dọn dẹp theo rule); đổi "Cập nhật version kế tiếp (v2.15)" → "(v3.1)" với 7 gap cần bổ sung.
- `dac-ta-uiux-tong-hop-v2.14.docx` — **xoá** (đã thay thế bởi v3.0, user chốt "Xoá luôn").
- `scripts/inspect-docx.mjs` — đổi source file sang `Dac-ta-Master-v3.0-SRS-TRD.docx` để extract nội dung.
- `inspect-text.txt` — regenerate từ v3.0 docx (4064 dòng, lớn hơn v2.14 ~1541 dòng).
- `memory/phase-history.md` (+Phase 75 entry).
- `memory.md` (+row Phase 75 "Hoàn thành gần đây").

### Out-of-scope mới trong v3.0 (chưa triển khai)

v3.0 ghi rõ 3 mục ngoài phạm vi — chưa đủ căn cứ đầu tư:
- Module Chữ ký số PKI/HSM cho PDF.
- Module Thông báo Hybrid/Telegram Bot.
- Phương án kiến trúc Subdirectory Routing (giải pháp tình thế, không thuộc Target Architecture).

### Ghi chú

- **AGENTS.md rule dactaupdate.md** không cần đổi nội dung — chỉ đổi tham chiếu version ở header section, section rule giữ nguyên (cũ vẫn đúng cho v3.0).
- **Không cần update docx** trong Phase 75: v3.0 vừa mới phát hành (chính là phase này ghi nhận việc user migrate lên v3.0). Mọi gap phát hiện sẽ đưa vào `dactaupdate.md` v3.1 (KHỐI 4-6).
- **Single source of truth đã chuyển:** mọi tham chiếu `dac-ta-uiux-tonghop-vX.X.docx` trong code/docs → đổi sang `Dac-ta-Master-v3.0-SRS-TRD.docx`.
- **Backup:** không tạo vì Phase 75 chỉ thay đổi tài liệu + reference, không sửa code logic.
- **Spec v2.x deprecated chính thức:** v2.13 docx + v2.14 supplement đã merge vào v3.0, audit trail lịch sử giữ trong `memory/phase-history.md` (Phase 73 spec supplement) và `memory/bugs-fixed.md`.

---

## PHASE 76 — Enable Vite HMR cho Docker dev (2026-07-28)

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

Nginx config (`nginx/nginx.conf:133`) đã sẵn proxy WebSocket cho HMR (`proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";`).

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

## PHASE 77 — Record Request File Preview trong Admin (2026-07-28)

### Mô tả

Trang admin → Yêu cầu trích sao hồ sơ → bấm icon xem chi tiết hiển thị thông tin nhưng **không xem được ảnh preview** của file đính kèm. Chỉ hiển thị tên file dạng text thuần, không có cách mở/tải file.

### Nguyên nhân (gap tích hợp)

| Tầng | Vấn đề |
|------|--------|
| Backend route | `record-requests.routes.ts` không có endpoint `GET /:id/files/:fileId` để serve file binary |
| Backend service | `recordRequestService` không export `getFileById` và `resolvePhysicalPath` chưa có path-traversal guard |
| Frontend UI | `RecordRequestsTab.tsx:371-383` chỉ render `<FileText>` icon + tên file, không có `<img>`/`<a>`/`<button>` mở file |

### Thay đổi

**Backend** (`server/services/record-request.service.ts`):
- Export `resolvePhysicalPath` (từ private → public) để route dùng.
- Thêm `resolveSafePhysicalPath(filePath)` — whitelist thư mục `uploads/pending` và `uploads/approved`, trả về `null` nếu path vượt ra ngoài (chống path traversal).
- Thêm `getFileById(fileId)` — lookup file theo id.

**Backend** (`server/routes/record-requests.routes.ts`):
- Thêm route `GET /:id/files/:fileId` với middleware `authenticate` + `requireAdmin`.
- Validate `file.recordRequestId === req.params.id` (chống file của request khác).
- Set header `Content-Type` từ `file.mimeType`, `Content-Disposition: inline` để preview trong tab mới, `Cache-Control: private, max-age=300`.
- Dùng `fs.createReadStream().pipe(res)` để stream file binary (không buffer toàn bộ vào memory).

**Frontend** (`src/components/admin/tabs/RecordRequestsTab.tsx`):
- Import `authService` từ `lib/auth` và thêm helper `authedFetch()` đính `Authorization: Bearer <accessToken>` cho mọi request file.
- Thêm state `previewUrls: Record<string, string>` lưu blob URL cho ảnh.
- Effect fetch ảnh thành blob URL khi `detailModalOpen === true` và `selectedRequest` đổi; cleanup `URL.revokeObjectURL` khi đóng modal hoặc đổi request.
- Block render file (line 371-383 cũ) thay bằng grid `grid-cols-2 md:grid-cols-3`:
  - File ảnh (`image/*`): thumbnail `<img>` trỏ tới blob URL + hover overlay hiển thị icon Eye + button "Xem" (mở tab mới) và "Tải" (download).
  - File PDF: icon placeholder + button "Mở PDF" + "Tải".
  - File khác (Word…): icon placeholder + button "Tải".
- Dùng `window.open(blobUrl, "_blank", "noopener,noreferrer")` cho view (PDF/ảnh) — không navigate trang hiện tại.

### Files affected

- `server/services/record-request.service.ts`
- `server/routes/record-requests.routes.ts`
- `src/components/admin/tabs/RecordRequestsTab.tsx`
- `memory/phase-history.md` (entry mới)

### Verify

- `npm run lint` — không thêm lỗi mới (2 pre-existing ở vite.config.ts và ChoBenhNhanPage.tsx vẫn tồn tại, không liên quan).
- `npm run build` — pass.
- `docker restart bvdh-backend` + `docker restart bvdh-frontend` để pick up code mới.
- Test qua container bằng `fetch`:
  - Login admin → token hợp lệ.
  - GET file với token: HTTP 200, `Content-Type: image/jpeg`, 132629 bytes ✓
  - GET file không có token: HTTP 401 ✓
  - GET file_id không tồn tại: HTTP 404 ✓
  - GET với request_id lệch file_id: HTTP 404 ✓

### Ghi chú

- Endpoint `GET /:id/files/:fileId` chỉ dành cho admin đã auth. Public form (POST yêu cầu trích sao + POST upload file) vẫn không cần token theo design hiện tại.
- Auth pattern: client dùng `authService.getAuthHeader()` để đính Bearer token vào fetch — tận dụng token đã lưu trong memory sau login, không cần thay đổi `AuthService`.
- Lưu ý: tất cả GET/PATCH/DELETE khác trong `record-requests.routes.ts` (line 26-119 cũ) hiện **không có middleware auth** — ngoài scope task này, có thể cân nhắc audit riêng trong phase sau.
- Không cần update spec docx (file preview không thuộc đặc tả UI/UX hiện hành — chỉ là bug fix gap tích hợp).

---

## PHASE 78 — Redesign UX Modal chi tiết Yêu cầu trích sao (2026-07-28)

### Mô tả

Modal chi tiết yêu cầu trích sao (Admin → Yêu cầu trích sao hồ sơ → bấm icon Eye) đang ở layout 1 cột dọc thẳng, thông tin trải dài, thiếu điểm nhấn thị giác, thiếu trạng thái bằng badge lớn, thiếu animation nâng/hover trên file thumbnail, chưa có modal preview riêng cho ảnh/PDF — user mất ngữ cảnh khi cần mở file lớn.

### Nguyên nhân (gap UX)

| Tầng | Vấn đề |
|------|--------|
| Layout | 1 cột dọc nhiều section → cuộn dài, không có hierarchy rõ giữa thông tin / tiến trình / xử lý |
| Header | Header trắng đơn điệu, status badge nhỏ, không nổi bật so với tiêu đề |
| File grid | Thumbnail ảnh chỉ render `<FileText>` icon + tên — không có hover lift, không có icon ZoomIn |
| Preview | Click thumbnail chỉ mở tab mới qua `window.open(blobUrl)` — không có modal preview in-app cho ảnh/PDF |

### Thay đổi

**Modal layout** (`RecordRequestsTab.tsx:432-774`):
- Header đổi sang gradient `from-green-dark via-green-900 to-brand-green` với ambient white blur orb góc phải, badge status nổi bật cùng mã yêu cầu ở chip `bg-white/20 backdrop-blur-md`.
- Body đổi từ 1 cột → grid 2 cột `lg:grid-cols-12` (trái 5 cols / phải 7 cols):
  - **Trái**: 2 glass card trắng — "Thông tin đối tượng" (bệnh nhân + liên hệ) + "Đặc tả hồ sơ đề nghị" (loại/khoảng thời gian/phương thức nhận/lý do).
  - **Phải**: 3 card — Visual Progress Timeline (3 bước: Tiếp nhận → Xử lý → Hoàn thành/Hủy) với icon đổi màu theo status, Tài liệu đính kèm grid, Phản hồi & Xử lý (note + buttons).

**File preview grid** (`RecordRequestsTab.tsx:614-692`):
- Thumbnail card có `hover:-translate-y-1 hover:shadow-md transition-all duration-200`, hover overlay `bg-black/30 backdrop-blur-xs` + `ZoomIn` icon cho ảnh.
- PDF placeholder riêng: gradient red `from-gray-50 to-gray-100 hover:bg-red-50/50`, icon `FileText text-red-500/70` + badge "PDF".
- Button "Xem" (xanh) + "Tải về" (xám) ngay dưới thumbnail.

**Modal preview riêng** (`RecordRequestsTab.tsx:777-855`):
- Thêm `previewModalFile` state + `handleOpenPreviewModal(f)` (block nếu không phải ảnh/PDF).
- Modal `bg-zinc-900` với header `bg-zinc-900/90 border-b border-white/10`, button "Tải về" + nút đóng.
- Body hiển thị `<img>` cho ảnh (max-w-full, max-h-[75vh], contain), `<iframe>` cho PDF (h-[75vh], bg-white), fallback "không hỗ trợ trực tiếp" cho file khác.
- Loader spinner `border-2 border-brand-green border-t-transparent` khi đang fetch.

### Files affected

- `src/components/admin/tabs/RecordRequestsTab.tsx`
- `memory/phase-history.md` (entry mới)
- `memory.md` (Trạng thái hiện tại)

### Verify

- `npx tsc --noEmit` — không lỗi mới trong `RecordRequestsTab.tsx` (2 pre-existing ở `vite.config.ts` + `ChoBenhNhanPage.tsx` không liên quan).
- `npx vite build` — pass (986 KB JS, 154 KB CSS).
- `docker restart bvdh-frontend` để Vite serve code mới (HMR đang BẬT — Phase 76).
- Test thủ công: mở admin → tab Yêu cầu trích sao → bấm Eye một yêu cầu → kiểm tra header gradient + 2 cột + timeline 3 bước + hover thumbnail + modal preview ảnh/PDF.

### Ghi chú

- Modal preview file mới chỉ render ảnh/PDF (image/* + application/pdf) — các file khác (Word, Excel…) vẫn chỉ cho phép tải về, hiển thị fallback message.
- Tận dụng `previewUrls` cache có sẵn từ Phase 77 — modal preview dùng lại blob URL đã fetch, không gọi API lại.
- Layout 2 cột responsive: stack về 1 cột dưới `lg` (1024px) theo `lg:col-span-5 / lg:col-span-7`.
- Không thay đổi API backend, không thay đổi schema DB — chỉ refactor UI/UX in-place.
---

## PHASE 79 — AGENTS.md split + RBAC scaffold + service/testimonial routes (2026-07-29)

### AGENTS.md module split (tách core + extended reference)

AGENTS.md trước đây 1243 dòng / 33KB — quá lớn để load mỗi session. Tách thành **9 file theo nhóm** trong gents/ + AGENTS.md làm **index** (3437 bytes, giảm 90%):

| # | File | Nhóm quy tắc |
|---|------|---------------|
| 01 | gents/01-getting-started.md | Mục tiêu + Tài liệu đặc tả UI/UX (v3.0) + dactaupdate.md + Bắt đầu session + Nguyên tắc vàng + Quy trình làm việc |
| 02 | gents/02-architecture.md | Port Policy + Docker Dev Workflow (HMR BẬT) + State Management + Cấu trúc Frontend/Backend |
| 03 | gents/03-ui-design-system.md | UI Governance + Design System (Typography, Spacing, Shadow, Color, Radius) + Animation Pattern (Modern Page Design + prefers-reduced-motion) |
| 04 | gents/04-components.md | Component Governance (Reusable, EditModal chuẩn) + Responsive Governance + Accessibility (WCAG) |
| 05 | gents/05-hospital-ux.md | Booking / Test Lookup / Patient Portal (5 trạng thái) / PHI protection / AI Advisor / Hotline / Liên hệ |
| 06 | gents/06-server-api.md | Server/API Governance (Routes/Services/DB Layer) + Data Retention + HIS API Standards + Public Form API Standards |
| 07 | gents/07-self-review.md | Self Review bắt buộc (Code/UI/UX/Accessibility/Performance) |
| 08 | gents/08-memory-management.md | Cấu trúc memory + Memory Safety Rules + Phase numbering |
| 09 | gents/09-ops.md | Backup Policy + Git Policy + Quality Gate + Cấm + OpenBrain + Định nghĩa thành công |

AGENTS.md index giữ: mục lục quick-ref + Quick Start (agent mới) + ghi chú tách file + quy tắc đồng bộ khi sửa file con.

### Fix lệch Docker Dev Workflow (cùng Phase 79)

Phát hiện AGENTS.md (dòng 205-240, trước tách) **lệch nghiêm trọng** vs memory.md:

- AGENTS.md cũ nói: "Vite HMR đang **TẮT**" (DISABLE_HMR=true, yêu cầu docker restart bvdh-frontend mỗi lần sửa file).
- memory.md (Phase 75, 2026-07-28) nói: "Vite HMR đang **BẬT**" (DISABLE_HMR=false, auto-reload qua WebSocket).

→ Đã fix nội dung "Docker Dev Workflow" cho khớp memory.md **trước khi tách** (nội dung đúng nằm trong gents/02-architecture.md). Rule "HMR TẮT → phải restart" cũ (Phase 72-74) đã lỗi thời, chỉ giữ làm ghi chú lịch sử.

### RBAC scaffold + service/testimonial routes (verify vs memory.md)

Verify 6 file service/routes mới đã có trong working tree (untracked, chưa commit) vs memory.md:

| File | Vai trò | Verify vs memory.md |
|------|---------|---------------------|
| server/middleware/auth.middleware.ts | uthenticate, uthorize, uthorizeExact, uthorizeDepartmentAccess + helper equireSuperAdmin/equireAdmin/equireDoctor/equireReceptionist | ✅ Khớp — Role type Super Admin/Receptionist/Doctor/Department Admin đúng memory.md:161 |
| server/services/auth.service.ts | dminLogin, efreshTokens, erifyAccessToken, erifyRefreshToken, PBKDF2-SHA512 hash, login lockout (5 lần → 30 phút) | ✅ Khớp — pbkdf2Sync(password, salt, 100000, 64, "sha512") đúng memory.md:144 (PBKDF2-SHA512 100k iterations). Access token 30 phút, refresh 7 ngày đúng memory.md:138-140. Login lockout 5/30p đúng memory.md:155 |
| server/services/service.service.ts | CRUD ServiceGroup + Service (Prisma), slug auto-generate, isActive default true | ✅ Khớp AGENTS.md Server/API Governance (service layer = business logic, không trực tiếp DB) |
| server/services/testimonial.service.ts | CRUD Testimonial + pproveTestimonial, getTestimonials có includeUnapproved flag | ✅ Khớp — service layer pattern |
| server/routes/service.routes.ts | GET public, POST/PUT/DELETE equireSuperAdmin | ✅ Khớp RBAC matrix memory.md:202 (settings:write = Super Admin only) |
| server/routes/testimonial.routes.ts | GET/POST public, PUT/DELETE/PATCH /approve equireSuperAdmin | ✅ Khớp — testimonial approve = admin only |

**Ghi chú enforce RBAC hiện tại:** RBAC scaffold (middleware + 4 role helper) đã sẵn sàng, nhưng các route admin hiện có (specialties, doctors, news, organization, services admin, tender, contact, record-requests) chưa tất cả gắn middleware equireAdmin/equireDoctor/uthorizeDepartmentAccess. Phase tiếp theo cần audit toàn bộ route admin và gắn đúng middleware theo matrix memory.md:193-205.

### Files affected

- AGENTS.md — rewrite thành index (33758 → 3437 bytes)
- gents/01-getting-started.md — tạo mới
- gents/02-architecture.md — tạo mới (đã fix lệch HMR)
- gents/03-ui-design-system.md — tạo mới
- gents/04-components.md — tạo mới
- gents/05-hospital-ux.md — tạo mới
- gents/06-server-api.md — tạo mới
- gents/07-self-review.md — tạo mới
- gents/08-memory-management.md — tạo mới
- gents/09-ops.md — tạo mới
- memory.md — cập nhật mục cấu trúc + trạng thái Phase 79
- memory/phase-history.md — append Phase 79

### Verify

- Kiểm tra 9 file con đều tạo thành công (Get-ChildItem agents).
- AGENTS.md index 3437 bytes, tham chiếu đúng 9 file con.
- Nội dung file con khớp AGENTS.md cũ (đã fix lệch HMR trước khi tách) — không mất quy tắc.
- RBAC scaffold khớp memory.md Security & RBAC Standards.

### Ghi chú

- **Không tạo file mới thêm** trừ khi có task tách lại — nếu cần thêm nhóm quy tắc, mở rộng file gents/0X-*.md hiện có tương ứng trước.
- **Đồng bộ chéo:** khi sửa 1 file gents/0X-*.md, kiểm tra các file khác không bị lệch (đặc biệt Port Policy ở 02, Memory Safety ở 08, Design Token ở 03).
- Working tree trước Phase 79 đã commit tại 43ec915 (chore: snapshot working tree before AGENTS.md split). Các file service/routes/middleware mới vẫn untracked — sẽ commit cùng Phase 79 hoặc Phase kế tiếp theo quyết định user.
