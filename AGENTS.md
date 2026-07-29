# AGENTS.md - BVĐK Website

> **Đã tách module Phase 79 (2026-07-29):** Nội dung chi tiết nằm trong `agents/01-09*.md`. File này là **index** — agent đọc theo nhu cầu tra cứu, không cần load toàn bộ cùng lúc.
>
> **Bắt buộc mỗi session:** đọc `agents/01-getting-started.md` + `memory.md` trước khi code.

---

## 📚 Mục lục quick-ref

| # | File | Nhóm quy tắc | Khi nào đọc |
|---|------|---------------|-------------|
| 01 | `agents/01-getting-started.md` | Mục tiêu + Tài liệu đặc tả UI/UX (v3.0) + `dactaupdate.md` + Bắt đầu session + Nguyên tắc vàng + Quy trình làm việc | **Mỗi session bắt buộc** |
| 02 | `agents/02-architecture.md` | Port Policy + Docker Dev Workflow (HMR BẬT) + State Management + Cấu trúc Frontend/Backend | Trước khi sửa cấu trúc / Docker / Vite / Context |
| 03 | `agents/03-ui-design-system.md` | UI Governance + Design System (Typography, Spacing, Shadow, Color, Radius) + Animation Pattern (Modern Page Design + prefers-reduced-motion) | Trước khi tạo/sửa component giao diện |
| 04 | `agents/04-components.md` | Component Governance (Reusable, EditModal chuẩn) + Responsive Governance + Accessibility (WCAG) | Trước khi tạo component mới / form |
| 05 | `agents/05-hospital-ux.md` | Booking / Test Lookup / Patient Portal (5 trạng thái) / PHI protection / AI Advisor / Hotline / Liên hệ | Trước khi sửa tính năng bệnh viện |
| 06 | `agents/06-server-api.md` | Server/API Governance (Routes/Services/DB Layer) + Data Retention + HIS API Standards + Public Form API Standards | Trước khi thêm endpoint / bảng DB / API contract |
| 07 | `agents/07-self-review.md` | Self Review bắt buộc (Code/UI/UX/Accessibility/Performance) | Sau khi code xong, trước commit |
| 08 | `agents/08-memory-management.md` | Cấu trúc memory + Memory Safety Rules + Phase numbering | Trước khi cập nhật memory.md / tạo Phase |
| 09 | `agents/09-ops.md` | Backup Policy + Git Policy + Quality Gate + Cấm + OpenBrain + Định nghĩa thành công | Trước khi commit / backup / dùng OpenBrain |

---

## 🚦 Quick Start — Agent mới vào dự án

1. Đọc `memory.md` → trạng thái kiến trúc hiện tại + pending tasks.
2. Đọc `agents/01-getting-started.md` → quy tắc bắt buộc mỗi session.
3. Tra cứu OpenBrain: `search_memories --query "TênTrang|TênComponent" --limit 10`.
4. Kiểm tra `git status` + `git log --oneline -5`.
5. Tùy task, tra cứu file `agents/0X-*.md` liên quan (xem bảng mục lục trên).

---

## 📌 Ghi chú tách file (Phase 79)

- **Mục đích:** AGENTS.md trước đây 1243 dòng / 33KB — quá lớn để load mỗi session. Tách thành 9 file theo nhóm để agent tra cứu theo nhu cầu, giảm token context.
- **Đồng bộ:** Khi sửa 1 file `agents/0X-*.md`, kiểm tra các file khác không bị lệch chéo (đặc biệt Port Policy ở 02, Memory Safety ở 08, Design Token ở 03).
- **Fix lệch cùng Phase 79:** `agents/02-architecture.md` Docker Dev Workflow đã được update cho khớp memory.md (HMR đang BẬT từ Phase 75, 2026-07-28) — nội dung cũ "HMR TẮT" đã được loại bỏ.
- **Không tạo file mới trừ khi có task tách lại** — nếu cần thêm nhóm quy tắc, mở rộng file `agents/0X-*.md` hiện có tương ứng trước.
