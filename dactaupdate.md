# Design Document - BVĐK Website

## 📌 THÔNG TIN BỆNH VIỆN

**Tên đầy đủ:** Bệnh Viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam

**Địa chỉ:** 107 Quang Trung, Xã Đại Lộc, Thành Phố Đà Nẵng

**Lãnh đạo:**

| Chức vụ | Họ tên |
|---------|--------|
| Giám đốc | Nhà Thuốc Ưu Tú. BS CKII Nguyễn Thống Nhất |
| Phó Giám đốc | BSCK II Lê Minh Dũng |
| Phó Giám đốc | BS CKII Nguyễn Đình Hoàng |

---

# 🎨 MODERN PAGE DESIGN PATTERN

## Áp dụng cho: ChuyenKhoaPage, DichVuPage, ChoBenhNhanPage

## 1. Hero Section

### Structure
```
┌──────────────────────────────────────────────────────────────────┐
│  FULL VIEWPORT HERO - Parallax effect                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Background: Animated gradient mesh + floating particles  │  │
│  │                                                              │  │
│  │  [Badge] "Chuyên khoa" / "Dịch vụ y tế" / "Dành cho BN"   │  │
│  │                                                              │  │
│  │  [Split Text Animation - 2 colors]                          │  │
│  │  CHUYÊN KHOA                                                 │  │
│  │                                                              │  │
│  │  Subtitle text...                                            │  │
│  │                                                              │  │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                        │  │
│  │  │ 12  │  │ 50+ │  │ 200 │  │  5  │  [Count-up animation] │  │
│  │  │CKhoa│  │ BS  │  │Giuong│ │PMo  │                        │  │
│  │  └─────┘  └─────┘  └─────┘  └─────┘                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Scroll indicator - bouncing chevron]                          │
└──────────────────────────────────────────────────────────────────┘
```

### Implementation Details

**Background Elements:**
- Gradient: `bg-gradient-to-br from-green-dark via-green-800 to-brand-green`
- Floating shapes: 4 circles với animation (y, x, scale oscillation)
- Grid pattern overlay: opacity 10%

**Badge:**
```tsx
<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium mb-8">
  <Activity className="w-4 h-4" />
  <span>Hệ thống y tế chuyên sâu</span>
</div>
```

**Title Animation:**
```tsx
<h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
  <motion.span className="inline-block" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
    Chuyên
  </motion.span>
  <motion.span className="inline-block ml-3 text-peach" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
    Khoa
  </motion.span>
</h1>
```

**Stats Cards:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
  {stats.map((stat, idx) => (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
      </div>
      <div className="text-white/70 text-sm font-medium">{stat.label}</div>
    </motion.div>
  ))}
</div>
```

**Scroll Indicator:**
```tsx
<motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
  <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
    <motion.div className="w-1.5 h-3 bg-white rounded-full" animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
  </div>
</motion.div>
```

**Parallax Effect:**
```tsx
const heroRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

<motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
  {/* Hero content */}
</motion.div>
```

**AnimatedCounter Component:**
```tsx
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <div ref={ref}>{count}{suffix}</div>;
}
```

---

## 2. Sticky Tab Navigation

### Structure
```
┌──────────────────────────────────────────────────────────────────┐
│  STICKY SECTION - Glass morphism effect                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [Tab 1] [Tab 2] [Tab 3] [Tab 4]                           │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Implementation

**Container:**
```tsx
<section className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-800/5 shadow-sm">
  <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
    <div className="flex overflow-x-auto scrollbar-hide py-4 gap-2">
      {/* Tabs */}
    </div>
  </div>
</section>
```

**Tab Button:**
```tsx
{DEPARTMENTS.map(dept => {
  const Icon = dept.icon;
  const isActive = activeTab === dept.key;
  return (
    <motion.button
      key={dept.key}
      onClick={() => setActiveTab(dept.key)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
        isActive
          ? `bg-gradient-to-r ${dept.color} text-white shadow-lg`
          : "bg-gray-100 text-ink/70 hover:bg-gray-200"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{dept.title}</span>
    </motion.button>
  );
})}
```

**Department Color Configuration:**
```tsx
const DEPARTMENTS = [
  { key: "ngoai-cap-cuu", title: "Ngoại & Cấp cứu", icon: Scissors, color: "from-red-500 to-rose-600", bgLight: "bg-red-50", textColor: "text-red-600" },
  { key: "noi-tong-quat", title: "Nội tổng quát", icon: Stethoscope, color: "from-blue-500 to-cyan-600", bgLight: "bg-blue-50", textColor: "text-blue-600" },
  { key: "san-nhi", title: "Sản & Nhi", icon: Baby, color: "from-pink-500 to-rose-600", bgLight: "bg-pink-50", textColor: "text-pink-600" },
  { key: "can-lam-sang", title: "Cận lâm sàng", icon: Microscope, color: "from-purple-500 to-violet-600", bgLight: "bg-purple-50", textColor: "text-purple-600" }
];
```

---

## 3. Featured Card Section

### Structure
```
┌──────────────────────────────────────────────────────────────────┐
│  FEATURED - Grid 2 columns                                       │
│  ┌─────────────────────────┐  ┌────────────────────────────────┐ │
│  │                         │  │ Dịch vụ nổi bật                │ │
│  │   FEATURED IMAGE        │  │                                │ │
│  │   [Clip-path reveal]    │  │ Description text...            │ │
│  │   [Ken Burns effect]    │  │                                │ │
│  │                         │  │ ✓ Item 1 [slide-in]            │ │
│  │   [Gradient overlay]    │  │ ✓ Item 2 [slide-in]            │ │
│  │   [Title on image]      │  │ ✓ Item 3 [slide-in]            │ │
│  │                         │  │ ✓ Item 4 [slide-in]            │ │
│  └─────────────────────────┘  └────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Implementation

**Featured Image Container:**
```tsx
<motion.div
  className="relative h-80 lg:h-96 overflow-hidden rounded-3xl"
  initial={{ clipPath: "inset(100% 0 0 0)" }}
  animate={{ clipPath: "inset(0% 0 0 0)" }}
  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
>
  <motion.img
    src={featuredItem.img}
    alt={featuredItem.name}
    className="w-full h-full object-cover"
    initial={{ scale: 1.2 }}
    animate={{ scale: 1 }}
    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
  {/* Badge, title, description overlay */}
</motion.div>
```

**Content Side:**
```tsx
<div className="flex flex-col justify-center p-8">
  <motion.h3 initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-display font-bold text-green-dark mb-4">
    Dịch vụ nổi bật
  </motion.h3>
  <motion.p initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-ink/70 leading-relaxed mb-6">
    {currentData.description}
  </motion.p>
  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
    {checklistItems.map((item, idx) => (
      <motion.div
        key={item}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 + idx * 0.1 }}
        className="flex items-center gap-3"
      >
        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentDept.color} flex items-center justify-center`}>
          <Check className="w-3 h-3 text-white" />
        </div>
        <span className="text-ink/80 font-medium">{item}</span>
      </motion.div>
    ))}
  </motion.div>
</div>
```

---

## 4. Service Cards Grid

### Structure
```
┌──────────────────────────────────────────────────────────────────┐
│  GRID - Staggered reveal on scroll                              │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐ ┌────────────┐ │
│  │ 3D TILT CARD       │  │ 3D TILT CARD       │ │ 3D TILT    │ │
│  │                    │  │                    │ │ CARD       │ │
│  │ [Image + Scale]    │  │ [Image + Scale]    │ │            │ │
│  │                    │  │                    │ │            │ │
│  │ Title              │  │ Title              │ │ Title      │ │
│  │ Description        │  │ Description        │ │ Description│ │
│  │                    │  │                    │ │            │ │
│  │ Price   [Book]     │  │ Price   [Book]     │ │ Price [Book│ │
│  └────────────────────┘  └────────────────────┘ └────────────┘ │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐                  │
│  │ ...                │  │ ...                │                  │
│  └────────────────────┘  └────────────────────┘                  │
└──────────────────────────────────────────────────────────────────┘
```

### Card Component Implementation

**Interface:**
```tsx
interface ServiceCardProps {
  key?: string;
  item: { name: string; desc: string; price: string; img: string };
  dept: { key: string; title: string; icon: ElementType; color: string; bgLight: string; textColor: string };
  index: number;
  onBook?: () => void;
}
```

**Card with 3D Tilt:**
```tsx
function ServiceCard({ item, dept, index, onBook }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-green-800/5 transition-all duration-300 h-full flex flex-col"
      >
        {/* Glow effect background */}
        <motion.div
          className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getDeptGlowColor(dept.textColor)} 0%, transparent 70%)`
          }}
        />

        {/* Animated border */}
        <motion.div
          className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`}
          style={{
            padding: "2px",
            background: `linear-gradient(${dept.color}, transparent)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude"
          }}
        />

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className={`absolute top-4 left-4 ${dept.bgLight} ${dept.textColor} text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}
          >
            {dept.title}
          </motion.div>
          <motion.div
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 transition-all duration-300"
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
          >
            <ArrowRight className="w-4 h-4 text-green-dark" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col relative" style={{ transform: "translateZ(30px)" }}>
          <motion.h3
            className="font-display font-bold text-lg text-green-dark mb-2 group-hover:text-brand-green transition-colors duration-300"
            style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0)" }}
          >
            {item.name}
          </motion.h3>
          <motion.p
            className="text-sm text-ink/70 leading-relaxed flex-grow"
            style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)" }}
          >
            {item.desc}
          </motion.p>
          <motion.div
            className="flex items-center justify-between pt-4 mt-4 border-t border-green-800/5"
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 8, opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-brand-green font-bold">{item.price}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onBook?.(); }}
              className={`px-4 py-2 bg-gradient-to-r ${dept.color} text-white text-sm font-semibold rounded-full hover:shadow-lg transition-all cursor-pointer`}
            >
              Đặt lịch
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

---

## 5. AnimatePresence for Tab Transitions

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    {/* Tab content */}
  </motion.div>
</AnimatePresence>
```

---

## 6. Helper Components

### FloatingShape
```tsx
function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 ${className}`}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
```

---

## 7. Imports Required

```tsx
import { useState, useEffect, useRef, MouseEvent, ElementType } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from "framer-motion";
import { Activity, Scissors, Stethoscope, Baby, Microscope, ArrowRight, Check } from "lucide-react";
```

---

## 8. Color System per Department

| Department | Gradient | bgLight | textColor |
|------------|----------|---------|-----------|
| Ngoại & Cấp cứu | `from-red-500 to-rose-600` | `bg-red-50` | `text-red-600` |
| Nội tổng quát | `from-blue-500 to-cyan-600` | `bg-blue-50` | `text-blue-600` |
| Sản & Nhi | `from-pink-500 to-rose-600` | `bg-pink-50` | `text-pink-600` |
| Cận lâm sàng | `from-purple-500 to-violet-600` | `bg-purple-50` | `text-purple-600` |
| Dịch vụ trọn gói | `from-orange-500 to-amber-600` | `bg-orange-50` | `text-orange-600` |
| Tại nhà & Vận chuyển | `from-blue-500 to-cyan-600` | `bg-blue-50` | `text-blue-600` |
| Tiêm chủng | `from-green-500 to-emerald-600` | `bg-green-50` | `text-green-600` |
| Bảo hiểm & VIP | `from-purple-500 to-violet-600` | `bg-purple-50` | `text-purple-600` |
| Chi phí & Địa điểm | `from-blue-500 to-indigo-600` | `bg-blue-50` | `text-blue-600` |
| Hướng dẫn tiện ích | `from-emerald-500 to-teal-600` | `bg-emerald-50` | `text-emerald-600` |
| Cổng thông tin | `from-purple-500 to-pink-600` | `bg-purple-50` | `text-purple-600` |

---

## 9. Stats Configuration Example

```tsx
const stats = [
  { value: 12, label: "Chuyên khoa", icon: Activity },
  { value: 50, label: "Bác sĩ", suffix: "+" },
  { value: 200, label: "Giường bệnh" },
  { value: 5, label: "Phòng mổ" }
];

// For DichVuPage
const stats = [
  { value: 50, label: "Dịch vụ", suffix: "+" },
  { value: 5000, label: "Bệnh nhân", suffix: "+" },
  { value: 98, label: "Hài lòng", suffix: "%" },
  { value: 24, label: "Giờ hỗ trợ" }
];

// For ChoBenhNhanPage
const stats = [
  { value: 24, label: "Giờ cấp cứu" },
  { value: 100, label: "Bệnh nhân", suffix: "+" },
  { value: 15, label: "Năm kinh nghiệm" },
  { value: 50, label: "Bác sĩ", suffix: "+" }
];
```

---

## 10. Checklist Items per Section

```tsx
// ChuyenKhoaPage
const checklist = ["Đội ngũ bác sĩ giàu kinh nghiệm", "Trang thiết bị hiện đại", "Quy trình chuẩn quốc tế", "Chăm sóc tận tâm 24/7"];

// DichVuPage
const checklist = ["Đội ngũ bác sĩ chuyên môn cao", "Trang thiết bị hiện đại", "Quy trình chuẩn quốc tế", "Hỗ trợ 24/7"];

// ChoBenhNhanPage
const checklist = ["Hỗ trợ 24/7 qua hotline", "Quy trình đơn giản", "Thông tin minh bạch", "Chăm sóc tận tâm"];
```

---

## 11. Performance Notes

- Use `once: true` in `useInView` to only trigger animations once
- Use `will-change: transform` sparingly on animated elements
- Consider using `transform: translateZ(0)` to enable GPU acceleration
- Use `useCallback` for event handlers in lists if needed
- Lazy load images below the fold

---

## 12. Accessibility Notes

- All images have descriptive `alt` text
- Focus states are preserved on interactive elements
- Color contrast meets WCAG guidelines
- Motion respects `prefers-reduced-motion`
- Tab navigation works correctly

---

## 13. File Structure

```
src/pages/
├── ChuyenKhoaPage.tsx    # 527 lines
├── DichVuPage.tsx        # 396 lines
├── ChoBenhNhanPage.tsx   # 439 lines (with Patient Portal)

src/components/public/
├── PatientLookupForm.tsx    # Patient lookup form
├── PatientPortalSection.tsx # Patient portal with 3 tabs
├── RecordRequestModal.tsx   # Request medical records
├── FeedbackModal.tsx        # Service feedback

src/data/
├── patient-portal-data.ts   # Mock data for patient portal

src/types/models/
├── medical-record.ts       # Medical record type
├── clinical-test.ts        # Clinical test (CLS) type
├── treatment-history.ts    # Treatment history type
├── patient.ts              # Extended patient type with HIS fields
```

Each page follows the same pattern but uses different data sources.

---

## 14. Future Improvements

- [ ] Add skeleton loading states
- [ ] Add skeleton for cards during tab switch
- [ ] Implement virtualized list for large card grids
- [ ] Add keyboard navigation for tabs
- [ ] Add swipe gestures for tab navigation on mobile
- [ ] Implement lazy loading for images
- [ ] Add service worker for offline support

---

# 📝 CHANGE LOG

## PHASE 20 - EditModal Fields Enhancement (2026-07-20)

**Mục tiêu:** Cải thiện UX của EditModal bằng cách thêm description, hint, suggestions cho tất cả fields, giúp người dùng admin hiểu rõ cần nhập gì.

**Files affected:**
- src/components/admin/tabs/HomeTab/index.tsx
- src/components/admin/tabs/AboutTab.tsx
- src/components/admin/tabs/ServicesTab.tsx
- src/components/admin/tabs/PatientTab.tsx
- src/components/admin/tabs/TenderTab.tsx
- src/components/admin/tabs/ContactTab.tsx

### Chi tiết từng Tab

**HomeTab (5 sections):**
| Section | Field | Enhancement |
|---------|-------|-------------|
| HeroSection | title | hint: "VD: Chăm sóc sức khỏe toàn diện" |
| HeroSection | ctaLink | hint: "VD: /dat-lich, /chuyen-khoa, /lien-he" |
| HeroSection | backgroundImage | description: "Ảnh hero section" |
| QuickActions | title | hint: "VD: Đặt lịch khám, Chuyên khoa" |
| QuickActions | link | hint: "Bắt đầu bằng /" |
| QuickActions | icon | description: "Icon hiển thị trên nút" |
| QuickActions | color | description: "Màu gradient của nút" |
| WhyChooseUs | title | hint: "VD: Đội ngũ bác sĩ giỏi" |
| WhyChooseUs | description | hint: "Mô tả ngắn 1-2 câu" |
| Statistics | value | hint: "VD: 100+, 50+, 1M+" |
| Statistics | label | hint: "VD: Năm kinh nghiệm, Bác sĩ chuyên khoa" |
| Testimonials | name | hint: "VD: Nguyễn Văn A" |
| Testimonials | role | hint: "VD: Bệnh nhân, Người nhà bệnh nhân" |
| Testimonials | content | hint: "Viết cảm nhận thực tế, ngắn gọn 2-3 câu" |

**AboutTab:**
| Section | Field | Enhancement |
|---------|-------|-------------|
| WhyChooseSection | text | suggestions: [5 mẫu có sẵn] |
| LeadershipSection | name | hint: "VD: BS CKII Nguyễn Văn A" |
| LeadershipSection | role | description: "Chức vụ hiện tại" |
| LeadershipSection | bio | hint: "VD: Bác sĩ chuyên khoa II với hơn 20 năm kinh nghiệm" |
| PartnersSection | name | hint: "VD: BHYT Quảng Nam, Bảo Việt, Prudential" |
| PartnersSection | website | hint: "VD: https://bhytquangnam.vn" |
| FacilitiesSection | title | hint: "VD: Cơ sở vật chất, Hình ảnh bệnh viện" |
| FacilitiesSection | description | hint: "Mô tả 1-2 câu về cơ sở vật chất" |

**ServicesTab:**
| Section | Field | Enhancement |
|---------|-------|-------------|
| ServiceCategories | title | hint: "VD: Dịch vụ trọn gói, Tiêm chủng, Gói khám" |
| ServiceCategories | color | description: "Màu gradient hiển thị" |
| ServiceItems | name | hint: "VD: Dịch vụ trọn gói, Kiến thức thai sản" |
| ServiceItems | price | hint: "VD: Từ 500.000đ, Miễn phí" |

**PatientTab:**
| Section | Field | Enhancement |
|---------|-------|-------------|
| ProcessSection | title | hint: "VD: Đăng ký lịch hẹn, Đến bệnh viện" |
| ProcessSection | desc | hint: "Mô tả ngắn gọn action cần thực hiện" |
| FaqSection | question | hint: "VD: Giờ làm việc?, Làm sao đặt lịch khám?" |
| FaqSection | answer | hint: "Trả lời ngắn gọn, dễ hiểu (1-3 câu)" |

**TenderTab:**
| Section | Field | Enhancement |
|---------|-------|-------------|
| TenderNotices | title | hint: "VD: Mua sắm vật tư y tế năm 2026" |
| TenderNotices | tenderNumber | hint: "VD: BHYT-2026-001" |
| TenderNotices | estimateValue | hint: "VD: 500.000.000đ" |
| TenderNotices | endDate | hint: "VD: 30/08/2026" |

**ContactTab:**
| Section | Field | Enhancement |
|---------|-------|-------------|
| ContactInfo | address | hint: "VD: 107 Quang Trung, ..." |
| ContactInfo | phone | hint: "VD: 0236 1234 567" |
| ContactInfo | hotline | hint: "VD: 1900 1234" |
| ContactInfo | email | hint: "VD: bvdk@quangnam.gov.vn" |
| QuickLinks | label | hint: "VD: Trang chủ, Giới thiệu" |
| QuickLinks | link | hint: "Bắt đầu bằng /" |
| SupportLinks | label | hint: "VD: Đặt lịch khám, Bảng giá dịch vụ" |
| SupportLinks | link | hint: "Bắt đầu bằng /" |

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 19 - Admin UI Enhancements (2026-07-20)

### EditModal.tsx Improvements
- Header gradient với icon và helper text
- Image preview với hover effect  
- Prefix/suffix support cho input fields
- Auto-close modal sau submit
- Select dropdown với custom chevron icon
- Better focus states và error styling
- Keyboard navigation cho suggestions (Arrow Up/Down, Enter, Escape)

### ItemCard.tsx - AddCard Component
- Export `AddCard` component cho "Add new" actions
- Color variants: green, blue, amber, rose
- Hover scale animation, dashed border
- Animation delay theo index

### Tabs Integration
Thay "actions" button bằng AddCard trong content area:

| Tab | Section | Grid Change |
|-----|---------|-------------|
| HomeTab | QuickActions | lg:6 → lg:7 |
| HomeTab | WhyChooseUs | lg:4 → lg:5 |
| HomeTab | Testimonials | lg:3 → lg:4 |
| AboutTab | Leadership | lg:3 → lg:4 |
| AboutTab | Partners | lg:6 → lg:7 |
| AboutTab | Facilities | lg:3 → lg:4 |
| ContactTab | QuickLinks | lg:6 → lg:7 |
| ContactTab | SupportLinks | lg:5 → lg:6 |
| PatientTab | WhatToBring | lg:3 → lg:4 |
| ServicesTab | ServiceItems | lg:3 → lg:4 |
| TenderTab | TenderNotices | lg:3 → lg:4 |

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 18 - Admin Panel Redesign (2026-07-19)

### Base UI Components
- **SectionCard:** Wrapper cho mỗi section với enable/disable toggle, collapsible, header actions
- **ItemCard:** Display item với image, title, description, drag handle, action buttons  
- **EditModal:** Reusable form modal với field types (text, textarea, select, image)
- **ConfirmDialog:** Delete confirmation với variants (danger, warning, info)
- **ImageUploader:** Drag-drop + paste image URL support

### Content Tabs (9 tabs)
- OverviewTab, BookingsTab, PatientsTab, ShiftsTab
- SpecialtiesTab, DoctorsTab, NewsTab, OrganizationTab, LogsTab

### Navigation Structure
- Quản lý Nội dung: Home, About, Specialties, Services, Patient, News, Tender, Contact
- Quản lý Nhân sự: Doctors, Phân ca
- Quản lý Hoạt động: Đặt lịch, Bệnh nhân, Nhật ký

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 25 - Patient Portal HIS Integration (2026-07-20)

### Patient Portal Components

**PatientLookupForm:**
- 3 loại tra cứu: Mã KCB, CCCD/CMND, Số điện thoại
- Validation input (CCCD 9/12 số, phone 10 số)
- Loading state, error handling
- PatientInfoCard hiển thị thông tin bệnh nhân

**PatientPortalSection:**
- 3 tabs: Lịch sử bệnh sử | CLS các lần khám | Lịch sử điều trị
- Expandable cards với chi tiết đầy đủ
- API callbacks interface: `onPatientLookup`, `onFetchMedicalRecords`, `onFetchClinicalTests`, `onFetchTreatmentHistories`
- Mock mode: tự động load mock data khi không có API

### Data Models cho HIS

**MedicalRecord** (`src/types/models/medical-record.ts`):
```typescript
interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  clinic: string;
  doctorName: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescriptions?: Prescription[];
  followUpDate?: string;
}
```

**ClinicalTest** (`src/types/models/clinical-test.ts`):
```typescript
type ClinicalTestType = 'xet-nghiem-mau' | 'x-quang' | 'sieu-am' | 'ecg' | 'ct-scan' | 'mri' | ...
type ClinicalTestStatus = 'normal' | 'abnormal' | 'critical';

interface ClinicalTest {
  id: string;
  testType: ClinicalTestType;
  testName: string;
  result: string;
  status: ClinicalTestStatus;
  indicators?: ClinicalTestIndicator[];
}
```

**TreatmentHistory** (`src/types/models/treatment-history.ts`):
```typescript
type TreatmentType = 'noi-tru' | 'ngoai-tru' | 'thu-thuat' | 'phau-thuat' | 'cap-cuu';
type TreatmentOutcome = 'khoi' | 'do' | 'chuyen-vien' | 'tai-kham';
```

### API Interface cho HIS Backend
```typescript
POST /api/patients/lookup
  Body: { identifier: string, identifierType: 'patientCode' | 'cccd' | 'phone' }
  Response: { patient: Patient }

GET /api/patients/:id/medical-records
GET /api/patients/:id/clinical-tests
GET /api/patients/:id/treatment-histories
```

**Commands:** npm run lint - Passed, npm run build - Passed

---

## PHASE 26 - Link Portal Actions (2026-07-20)

### Cổng thông tin Items Link

**InfoCard Enhancement:**
- Thêm `onAction` callback vào item props
- Button gọi `item.onAction()` khi bấm

**RecordRequestModal:**
- Form yêu cầu trích sao hồ sơ y tế
- 4 loại: Hồ sơ y tế, Giấy chứng nhận, Kết quả khám, Đơn thuốc
- Chọn ngày, phương thức nhận (tái khám/quầy/bưu điện)
- Success state với mã yêu cầu

**FeedbackModal:**
- Form góp ý chất lượng dịch vụ
- Chọn loại dịch vụ, rating 5 sao, nội dung
- Success state

### Click Flow
1. **Tra cứu bệnh sử online** → scroll đến PatientPortalSection → nhập mã KCB/CCCD/phone → xem dữ liệu
2. **Yêu cầu trích sao hồ sơ** → mở RecordRequestModal → điền form → submit → nhận mã yêu cầu
3. **Góp ý chất lượng dịch vụ** → mở FeedbackModal → đánh giá → submit

**Commands:** npm run lint - Passed, npm run build - Passed

---

## Earlier Phases

See `memory.md` for detailed history of Phase 0 - Phase 17.