# 01 — Bắt đầu session & Nguyên tắc vàng

> Thuộc: `AGENTS.md` (index). File này chứa những quy tắc **bắt buộc tại mỗi session** — agent phải đọc trước khi code.

---

## 🎯 MỤC TIÊU

Agent tham gia dự án phải hoạt động như một Senior Software Architect, Frontend Architect và UX Reviewer.

Mục tiêu:

* Duy trì chất lượng code lâu dài
* Giữ giao diện đồng nhất toàn hệ thống
* Tránh phát sinh technical debt
* Đảm bảo accessibility
* Đảm bảo trải nghiệm người dùng trong môi trường bệnh viện
* Không làm hỏng kiến trúc đã có

---

## 📖 Tài liệu đặc tả UI/UX (nguồn tham chiếu chính)

`Dac-ta-Master-v3.0-SRS-TRD.docx` là **single source of truth** cho toàn bộ hệ thống (SRS + TRD): hành vi UI/UX, design token, template trang, RBAC Admin, Cổng thông tin bệnh nhân (Patient Portal HIS), kiến trúc kỹ thuật, lược đồ CSDL, bảo mật & tuân thủ pháp lý. Tài liệu tổ chức theo **6 KHỐI** độc lập, áp dụng nguyên tắc **In-place Update**.

Lịch sử version:
- **v3.0 (27/07/2026)** — Master Production-Ready SRS/TRD, thay thế `dac-ta-uiux-tonghop-v2_13.docx` + patch `dac-ta-v2_14-supplement.md`. Refactor toàn diện theo 6 KHỐI, loại bỏ append-only dev log.
- v2.x (deprecated) — các bản đặc tả UI/UX tổng hợp trước đó, không còn là nguồn tham chiếu.

Bắt buộc:

* Khi một thay đổi làm lệch với đặc tả hiện có (đổi bố cục, đổi luồng, đổi trạng thái) → phải cập nhật docx tương ứng (đánh version mới, ghi vào mục "Changelog tóm tắt" KHỐI 1.5) trong cùng phiên làm việc, không để lệch giữa code và tài liệu.
* Khi một tính năng mới đã triển khai trên code nhưng chưa có trong docx → ghi nhận vào `memory.md` trước, đồng thời bổ sung vào `dactaupdate.md` (xem section bên dưới) để làm buffer nâng version kế tiếp.
* **Nguyên tắc In-place Update (mới từ v3.0):** cập nhật đè trực tiếp vào đúng KHỐI liên quan — không nối đuôi chương/mục mới ở cuối file. Số mục cũ có thể đổi nếu cấu trúc 6 KHỐI yêu cầu, nhưng phải giữ cross-reference nội bộ bằng emblem `KHỐI X.Y.Z`.

### `dactaupdate.md` — Buffer nâng version spec docx

`dactaupdate.md` là **bản nháp kế thừa** cho docx: nơi ghi các thay đổi lớn chưa có trong docx chính, làm cơ sở merge + đánh version mới ở lần cập nhật kế tiếp (single source of truth vẫn là docx). Không phải log phase — `memory/phase-history.md` đã lo việc đó.

**Chỉ ghi vào `dactaupdate.md` khi thay đổi thoả:**

* Thêm/sửa/xoá **cấu trúc dữ liệu** (bảng CSDL mới, ENUM mới, quan hệ ERD đổi, index retention).
* Thêm/sửa **API contract** đáng kể (endpoint mới có ảnh hưởng luồng client, schema response thay đổi, versioning `/api/v1/*` thêm nhóm).
* Thay đổi **kiến trúc deployment** (Docker topology, port policy, môi trường DMZ, security headers network-level).
* Thay đổi **RBAC matrix** (-role mới, -permission mới, -đổi ownership theo department).
* Đề xuất **bổ sung mục docx mới** cho lần version kế tiếp.

**KHÔNG ghi vào `dactaupdate.md` khi:**

* Bug fix thuần UI/UX (sửa class CSS thừa, sửa scrollbar, sửa layout).
* Refactor nội bộ component (không đổi API, không đổi schema).
* Tiên phong thay đổi nhỏ typography/spacing/animation tuân design system.
* Log phase đã hoặc thay đổi đã track sẵn trong `memory/phase-history.md`.

**Quy tắc dọn dẹp (bắt buộc mỗi kỳ version docx):**

* Khi cập nhật `dactaupdate.md`, rà các mục cũ đã merge vào docx hoặc đã lỗi thời vs code thực tế → **xoá** chứ không giữ làm audit trail (audit trail nằm trong `memory/phase-history.md`).
* Mỗi mục còn lại phải cross-check được với: (a) schema Prisma (`prisma/schema.prisma`), (b) code thực tế (`server/`, `src/`), (c) docx hiện tại. Mục nào lệch 1 trong 3 → sửa hoặc xoá.
* Header luôn tham chiếu tới version docx **mới nhất** hiện có, không giữ tham chiếu version cũ.
* "Nhật ký thay đổi" ở cuối file chỉ giữ entry từ kỳ version docx gần nhất trở đi, không tích luỹ entry cũ từ các version đã merge.

**Trường hợp lệch giữa dactaupdate và thực tế:**

* Code đã đổi nhưng `dactaupdate.md` chưa ghi → cập nhật `memory.md` + bổ sung entry dactaupdate trong cùng session.
* `dactaupdate.md` ghi nhưng code/schema không có → đánh dấu "chưa implement" rõ ràng trong entry, không để mơ hồ.

---

## 📋 BẮT ĐẦU MỖI SESSION

### Bắt buộc thực hiện

```bash
# 1. Đọc memory.md trước tiên (trạng thái hiện tại + pending tasks)
cat memory.md

# 2. Nếu cần đối chiếu lịch sử chi tiết trước khi sửa 1 khu vực cụ thể
grep -n "TênTrang\|TênComponent" memory/phase-history.md

# 3. Kiểm tra trạng thái git
git status
git log --oneline -5
```

Không được bỏ qua bước này. Không cần đọc toàn bộ `memory/phase-history.md` mỗi session — chỉ tra cứu phần liên quan khi cần.

---

## 🔑 NGUYÊN TẮC VÀNG

### Luôn trả lời bằng tiếng Việt

Mọi giải thích, commit suggestion, review, phản biện đều dùng tiếng Việt.

### Luôn đọc memory.md trước

Không được code trước khi hiểu:

* Kiến trúc hiện tại
* Các phase đã hoàn thành
* Các bug đã sửa
* Các quy tắc đã thống nhất

### Luôn cập nhật memory.md sau thay đổi

Bất kỳ thay đổi nào liên quan đến:

* Feature mới
* Refactor
* Bug fix
* Config
* Backup
* UI System

đều phải cập nhật memory.md.

### Không tạo technical debt

Không được:

* Copy paste code
* Duplicate component
* Hardcode dữ liệu
* Hardcode màu sắc
* Hardcode spacing
* Hardcode typography

### Không sử dụng any

TypeScript strict mode là bắt buộc.

Ví dụ:

```ts
const data: any
```

Không được phép.

---

## 🔄 QUY TRÌNH LÀM VIỆC

```text
Đọc memory.md
↓
Phân tích yêu cầu
↓
Đánh giá ảnh hưởng hệ thống
↓
Code
↓
Self Review
↓
UX Review
↓
Accessibility Review
↓
Performance Review
↓
npm run lint
↓
npm run build
↓
Update memory.md
↓
Commit
```
