# 09 — Ops: Backup/Git/Quality Gate/OpenBrain

> Thuộc: `AGENTS.md` (index). Backup Policy + Git Policy + Quality Gate + Cấm + OpenBrain + Định nghĩa thành công.

---

# 🚧 BACKUP POLICY

Trước refactor lớn:

```powershell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

New-Item -ItemType Directory `
-Path "D:\Coding\code backup\App Website BV_$timestamp" `
-Force

Copy-Item `
-Path ".\*" `
-Destination "D:\Coding\code backup\App Website BV_$timestamp" `
-Recurse `
-Exclude node_modules,.git,dist
```

---

# 🔀 GIT POLICY

## Commit Message

```text
feat:
fix:
refactor:
chore:
docs:
```

---

## Ví dụ

```text
feat: add appointment booking workflow

fix: resolve navbar overflow issue

refactor: migrate booking components

docs: update memory after phase 11
```

---

# ✅ QUALITY GATE

Trước khi commit phải đạt toàn bộ:

```bash
npm run lint
npm run build
```

---

## Checklist

```text
✓ Lint Passed

✓ Build Passed

✓ UI Consistency

✓ Responsive

✓ Accessibility

✓ No Hardcode

✓ Memory Updated

✓ Self Review Completed
```

Nếu bất kỳ mục nào thất bại:

Không được commit.

---

# 🚫 NHỮNG VIỆC KHÔNG ĐƯỢC PHÉP

❌ Bỏ qua memory.md

❌ Commit khi lint lỗi

❌ Commit khi build lỗi

❌ Hardcode màu sắc

❌ Hardcode spacing

❌ Dùng any

❌ Duplicate component

❌ Tạo context không cần thiết

❌ Viết business logic trong routes

❌ Bỏ qua accessibility

❌ Bỏ qua responsive

❌ Bỏ qua loading/error states

---

# 🤖 OPENBRAIN — PERSISTENT MEMORY

OpenBrain là plugin memory cho OpenCode, lưu trữ persistent memory ở `~/.opencode/openbrain/openbrain.db`.

## Các loại Memory

| Type | Metadata | Purpose |
|------|----------|---------|
| `Episodic` | `tool`, `args`, `timestamp` | Tool executions |
| `Semantic` | `concepts`, `facts` | Knowledge, concepts |
| `Procedural` | `steps`, `workflow` | Skills, workflows |
| `Decision` | `options`, `rationale` | Architecture decisions |
| `Bug` | `error`, `fix` | Errors, fixes |
| `Workspace` | `project`, `config` | Project structure |
| `Project` | `name`, `description` | Project-level knowledge |
| `Reflection` | `sessionId` | Session analysis |
| `Skill` | `usageCount`, `successRate` | Learned capabilities |

## Plugin Tools

### search_memories
```bash
search_memories --query "keyword" --type semantic --limit 5
search_memories --type decision --query "architecture" --limit 3
search_memories --type bug --query "fix bug" --limit 5
```

### create_skill
```bash
create_skill --name "tên-skill" --description "mô tả" --prompt "prompt..." --steps "bước 1" "bước 2"
```

### list_skills
```bash
list_skills
```

## Khi nào dùng OpenBrain vs memory.md

| OpenBrain | memory.md |
|-----------|-----------|
| Tìm kiếm patterns/bugs/decision đã ghi | Trạng thái kiến trúc hiện tại |
| Tra cứu xuyên session | Pending tasks |
| Bug đã fix | Backup gần nhất |
| Architecture decision đã chốt | Phase history |

**Khi fix bug mới**: search_memories --type bug --query "mô tả bug" để xem đã từng fix chưa.

**Khi thay đổi kiến trúc**: search_memories --type decision --query "từ khóa" để hiểu lý do đằng sau.

**Khi tạo skill mới**: Dùng create_skill cho workflow lặp lại >= 3 lần.

## Mỗi phiên làm việc

1. **Đầu phiên**: Tra cứu OpenBrain trước khi hỏi memory.md
   ```bash
   search_memories --query "TênTrang|TênComponent" --limit 10
   ```
2. **Sau thay đổi lớn**: Ghi vào cả memory.md (phase-history) VÀ OpenBrain (semantic/decision)
3. **Khi fix bug**: Ghi vào OpenBrain với type=bug

---

# 🎯 ĐỊNH NGHĨA THÀNH CÔNG

Một thay đổi được xem là hoàn thành khi:

* Code chạy đúng
* Lint pass
* Build pass
* Responsive
* Accessibility đạt yêu cầu
* Đồng bộ UI toàn hệ thống
* Không phát sinh technical debt
* memory.md được cập nhật
* Có thể bảo trì lâu dài
