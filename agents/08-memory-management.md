# 08 — Memory Management

> Thuộc: `AGENTS.md` (index). Cấu trúc file memory + Memory Safety Rules + Phase numbering.

---

# 📝 MEMORY MANAGEMENT

## Cấu trúc file memory

```text
memory.md                    → Trạng thái hiện tại: kiến trúc, design token, quy tắc đã chốt,
                                pending tasks, backup gần nhất, con trỏ tới các file dưới.
memory/phase-history.md      → Toàn bộ lịch sử Phase theo thứ tự thời gian tăng dần (append-only).
memory/bugs-fixed.md         → Danh sách bug đã sửa.
```

`memory.md` chỉ giữ những gì cần tra cứu thường xuyên (trạng thái, quy tắc, việc đang dang dở). Lịch sử chi tiết từng Phase nằm ở `memory/phase-history.md`, không lặp lại trong `memory.md`.

---

## ⚠️ Memory Safety Rules (Ngăn rủi ro Outdated Memory / PHI Leakage / State Conflict)

### Memory Invalidation — Ngăn Outdated Memory Pollution

* Khi spec version tăng (VD: v2.9 → v2.10), **BẮT BUỘC** cập nhật memory.md TRONG CÙNG SESSION
* Luôn verify memory vs file gốc (spec docx, source code) trước khi hành động — không trust memory khi nghi ngờ lệch
* Nếu phát hiện memory lệch → cập nhật NGAY, không chờ

### PHI Zero-Tolerance — Ngăn Security Compliance Leakage

* **KHÔNG** lưu bất kỳ PHI nào vào memory (dù là sample/test data) — cấm tuyệt đối
* Chỉ dùng **synthetic data** trong mọi test, không dùng dữ liệu thật của bệnh nhân
* Nếu vô tình lưu PHI vào memory → phải invalidate NGAY lập tức

### Single Source Alignment — Ngăn State Conflict

* Khi dùng memory.md để hành động → luôn cross-check với file thực (spec, source code)
* Không "nhảy cóc" bước dù memory có vẻ "đầy đủ"
* Luôn đọc lại file trước khi confirm bất kỳ quyết định nào

---

## Bắt buộc cập nhật khi

* Thêm feature
* Sửa bug
* Refactor
* Backup
* Config
* Design System

→ Ghi entry mới vào `memory/phase-history.md` (hoặc `bugs-fixed.md` nếu là bug), sau đó cập nhật phần "Trạng thái hiện tại" trong `memory.md` nếu thay đổi ảnh hưởng đến kiến trúc/quy tắc đang áp dụng.

---

## Đánh số Phase — bắt buộc kiểm tra trước khi ghi

Trước khi tạo entry Phase mới:

```bash
grep -oE "^## PHASE [0-9]+" memory/phase-history.md | grep -oE "[0-9]+" | sort -n | tail -1
```

Số Phase mới = số lớn nhất hiện có + 1. **Không được** dùng lại số Phase đã tồn tại, kể cả khi phiên làm việc trước đó không nhìn thấy do file dài. Nếu phát hiện 2 Phase trùng số trong lịch sử cũ, không tự renumber (vì có thể đã bị tham chiếu ở dactaupdate.md hoặc tài liệu UI/UX) — disambiguate bằng hậu tố chữ cái (VD: `15-A`, `15-B`) và ghi chú lý do.

---

## Format

```markdown
### [Tên thay đổi] ([YYYY-MM-DD])

- Mô tả
- Files affected
- Commands
```
