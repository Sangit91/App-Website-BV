# Đặc tả Hệ thống AI Agents — BVĐK Website

> **Mục đích:** Mô tả kiến trúc và workflow của hệ thống AI Agents (OpenCode) được dùng để phát triển dự án BVĐK Website. Là tài liệu tham chiếu để tái tạo/triển khai hệ thống tương tự trên dự án khác.
> **Nguồn:** Mô tả từ hệ thống đang chạy thực tế (2026-08-03), đối chiếu với `opencode.json`, `AGENTS.md`, `agents/`, `memory/`, plugin OpenBrain.

---

## 1. Tổng quan kiến trúc

Hệ thống AI Agents gồm **4 lớp** phối hợp với nhau:

```text
┌─────────────────────────────────────────────────────────────┐
│  LỚP 1 — Công cụ chạy agent (OpenCode CLI)                  │
│  • Chạy từ thư mục dự án → tự đọc AGENTS.md (index)          │
│  • Đọc config opencode.json (plugin, provider, model)        │
├─────────────────────────────────────────────────────────────┤
│  LỚP 2 — Quy tắc & đặc tả (hướng dẫn hành vi agent)          │
│  • AGENTS.md (index + quick start)                          │
│  • agents/01-09*.md (9 nhóm quy tắc chi tiết, đọc theo nhu cầu)│
│  • Dac-ta-Master-v3.x.docx + dactaupdate.md (spec product)   │
├─────────────────────────────────────────────────────────────┤
│  LỚP 3 — Memory (trạng thái & lịch sử dự án)                │
│  • memory.md (state hiện tại, trong git)                    │
│  • memory/phase-history.md, bugs-fixed.md (lịch sử)          │
│  • OpenBrain DB (~/.opencode/openbrain/openbrain.db)         │
├─────────────────────────────────────────────────────────────┤
│  LỚP 4 — Hạ tầng & công cụ (Docker, Prisma, Playwright…)     │
│  • Docker Compose (nginx 8443, frontend, backend, db)        │
│  • Scripts, tests, backup                                    │
└─────────────────────────────────────────────────────────────┘
```

**Vai trò tóm tắt:**

| Lớp | Chịu trách nhiệm | Ghi ở đâu |
|-----|------------------|-----------|
| OpenCode | Đọc & thực thi | — |
| AGENTS.md + agents/ | **Chỉ đạo** agent làm gì, theo quy tắc nào | quy tắc bất biến |
| memory.md + memory/ | **Nhớ** trạng thái & lịch sử | state + audit trail |
| OpenBrain | **Tra cứu** pattern/bug/decision xuyên session | semantic search |
| Spec docx + dactaupdate | Single source of truth cho UI/UX | thiết kế sản phẩm |

---

## 2. Thành phần 1 — OpenCode & cấu hình

### 2.1 `opencode.json` (root dự án)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["./openbrain"],
  "provider": {
    "9router": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "9Router (local)",
      "options": { "baseURL": "http://localhost:20128/v1" },
      "models": {
        "gpt-4o": {},
        "claude-sonnet-4-20250514": {},
        "gemini-2.5-flash": {}
      }
    }
  }
}
```

**Điểm cần lưu ý:**
- `plugin: ["./openbrain"]` → nạp plugin OpenBrain (lớp memory AI). Đường dẫn tương đối tới thư mục con của dự án.
- `provider.9router` → model chạy qua gateway local (baseURL `localhost:20128`), không gọi API cloud trực tiếp.
- File `openbrain/opencode.json` (trong plugin) tự khai `"plugin": ["./"]` — plugin tự quản config riêng.

### 2.2 Plugin OpenBrain (thư mục `openbrain/`)

- Là 1 plugin OpenCode độc lập (npm package `opencode-plugin-openbrain`, v0.1.0), được **clone từ GitHub** `github.com/CodebyKDvn/openbrain.git` vào thư mục con của dự án.
- **Không track trong git** của dự án (`.gitignore:51` — `openbrain/`).
- Cấu trúc source (TypeScript, ESM):

```text
openbrain/src/
├── index.ts                     → Plugin entry: wire engines + hooks + tools
├── core/
│   ├── Memory.ts                → MemoryType enum (9 loại) + interfaces
│   ├── MemoryStorage.ts
│   ├── Reflection.ts
│   └── Skill.ts
├── data/
│   ├── database/SQLiteDatabase.ts
│   └── storage/SQLiteMemoryStorage.ts
├── domain/
│   ├── engines/
│   │   ├── MemoryEngine.ts      → create/get/search memories
│   │   ├── ReflectionEngine.ts  → Session ended → reflection memory
│   │   ├── LearningEngine.ts    → Skills
│   │   ├── ContextEngine.ts     → format context cho system prompt
│   │   └── DreamEngine.ts       → Background consolidation (start())
│   └── services/PluginTools.ts  → 3 tools: search_memories, list_skills, create_skill
└── tests/
```

**Cơ chế hoạt động (từ `index.ts`):**

| Hook | Hành động |
|------|-----------|
| `tool` | Đăng ký 3 tool cho agent dùng |
| `tool.execute.after` | Tự ghi **Episodic** memory mỗi lần agent gọi tool (`confidence 0.9`, tag `tool-execution`) |
| `experimental.chat.system.transform` | Chèn memory context vào system prompt của agent (`contextEngine.formatContextForSystemPrompt()`) |
| `event: session.idle` | `reflectionEngine.reflect('Session ended', ...)` → ghi **Reflection** memory |

**DB:** SQLite tại `~/.opencode/openbrain/openbrain.db` (+ `-wal`/`-shm`). Không nằm trong dự án — dùng chung toàn user.

### 2.3 3 Tools do OpenBrain cung cấp

| Tool | Công dụng | Ví dụ |
|------|-----------|-------|
| `search_memories` | Tra cứu memory theo query/type/tags | `search_memories --query "TênTrang" --type semantic --limit 10` |
| `list_skills` | Liệt kê skill đã học | `list_skills` |
| `create_skill` | Tạo skill tái sử dụng (workflow lặp ≥3 lần) | `create_skill --name ... --prompt ... --steps ...` |

---

## 3. Thành phần 2 — AGENTS.md & agents/ (quy tắc)

### 3.1 Nguyên tắc tách file (Phase 79, 2026-07-29)

- **Vấn đề cũ:** AGENTS.md 1243 dòng / 33KB → quá lớn để load mỗi session.
- **Giải pháp:** tách thành **1 file index + 9 file quy tắc** trong `agents/`, AGENTS.md giảm còn 3.4KB (giảm ~90%).
- **Lợi ích:** agent chỉ đọc file cần thiết theo task, tiết kiệm token context.

### 3.2 Cấu trúc 9 file `agents/`

| # | File | Nhóm quy tắc | Đọc khi nào |
|---|------|---------------|-------------|
| 01 | `01-getting-started.md` | Mục tiêu, spec docx, bắt đầu session, nguyên tắc vàng, quy trình làm việc | **Mỗi session bắt buộc** |
| 02 | `02-architecture.md` | Port Policy, Docker Dev Workflow, State Management | Sửa cấu trúc/Docker/Vite/Context |
| 03 | `03-ui-design-system.md` | UI Governance, Design System tokens | Tạo/sửa component UI |
| 04 | `04-components.md` | Component Governance, Responsive, Accessibility | Tạo component mới/form |
| 05 | `05-hospital-ux.md` | Booking, Test Lookup, Patient Portal, PHI, AI Advisor | Sửa tính năng bệnh viện |
| 06 | `06-server-api.md` | Server/API Governance, Data Retention, HIS Standards | Thêm endpoint/bảng/API contract |
| 07 | `07-self-review.md` | Self Review bắt buộc | Sau khi code xong, trước commit |
| 08 | `08-memory-management.md` | Cấu trúc memory, Memory Safety, Phase numbering | Cập nhật memory / tạo Phase |
| 09 | `09-ops.md` | Backup, Git, Quality Gate, Cấm, OpenBrain | Commit/backup/dùng OpenBrain |

### 3.3 Quy tắc đọc file (tra cứu theo nhu cầu — "lazy loading")

```text
Bắt buộc mỗi session:  01-getting-started.md + memory.md
Theo task:
  - sửa UI        → đọc 03, 04
  - sửa API/DB    → đọc 06, 02
  - sửa tính năng BV → đọc 05
  - trước commit  → đọc 07, 09
  - cập nhật memory → đọc 08
```

### 3.4 Nguyên tắc vàng (rút từ 01)

1. **Trả lời bằng tiếng Việt** — mọi giải thích/review/commit đều tiếng Việt.
2. **Đọc memory.md trước khi code** — không code khi chưa hiểu trạng thái.
3. **Cập nhật memory.md sau mọi thay đổi** — feature/refactor/bug/config/backup/UI.
4. **Không tạo technical debt** — không copy-paste, không duplicate, không hardcode.
5. **TypeScript Strict, Zero Any** — cấm `any`.
6. **Quality Gate:** `npm run lint && npm run build` — bắt buộc trước commit.
7. **Restart container sau khi sửa frontend** — `docker restart bvdh-frontend` + đợi healthy (HMR có thể silent-fail).

---

## 4. Thành phần 3 — Memory (3 tầng)

### 4.1 Sơ đồ tổng thể

```text
┌────────────────────────────────────────────────────────────┐
│ memory.md  (root, TRONG git)                               │
│   = Trạng thái HIỆN TẠI: kiến trúc, quy tắc chốt,           │
│     pending tasks, backup gần nhất, lưu ý quan trọng        │
├────────────────────────────────────────────────────────────┤
│ memory/  (thư mục, TRONG git)                              │
│   ├── phase-history.md   → lịch sử Phase (append-only)      │
│   └── bugs-fixed.md      → danh sách bug đã sửa             │
├────────────────────────────────────────────────────────────┤
│ ~/.opencode/openbrain/openbrain.db (NGOÀI git)             │
│   = Memory AI: episodic/semantic/decision/bug/skill...      │
│     tự ghi + tra cứu semantic                               │
└────────────────────────────────────────────────────────────┘
```

### 4.2 Vai trò từng tầng

| Tầng | Trạng thái | Loại dữ liệu | Khôi phục được? |
|------|-----------|--------------|-----------------|
| `memory.md` | Trạng thái hiện tại | Kiến trúc, quy tắc, pending, lưu ý | ✅ Git |
| `memory/phase-history.md` | Lịch sử | Từng Phase theo thời gian | ✅ Git |
| `memory/bugs-fixed.md` | Lịch sử bug | Bug + fix | ✅ Git |
| OpenBrain DB | Tra cứu AI | Episodic, semantic, decision, skill | ❌ Ngoài git (backup riêng) |

### 4.3 Quy ước ghi memory

- **Feature/refactor mới** → entry `memory/phase-history.md` (đúng số Phase kế tiếp) → cập nhật "Trạng thái hiện tại" trong `memory.md`.
- **Bug fix** → `memory/bugs-fixed.md` (+ có thể OpenBrain type=bug).
- **Lưu ý không thuộc phase** → mục "📌 Ghi chú quan trọng" trong `memory.md` (đánh số).
- **Số Phase:** `grep -oE "^## PHASE [0-9]+" memory/phase-history.md | ... | tail -1` + 1. Không dùng lại số cũ; trùng thì thêm hậu tố chữ cái (`15-A`).

### 4.4 Khi nào dùng OpenBrain vs memory.md

| Tình huống | Dùng |
|-----------|------|
| Tìm pattern/bug/decision đã ghi xuyên session | OpenBrain (`search_memories`) |
| Trạng thái kiến trúc hiện tại / pending tasks | memory.md |
| Backup gần nhất / Phase history | memory/ |
| Bug đã fix từng gặp | OpenBrain type=bug |
| Workflow lặp lại ≥3 lần | OpenBrain `create_skill` |

### 4.5 Memory Safety Rules (08-memory-management.md)

1. **Memory Invalidation** — spec tăng version → cập nhật memory.md cùng session; verify memory vs file gốc trước khi hành động.
2. **PHI Zero-Tolerance** — CẤM lưu PHI vào memory dù là test data; chỉ dùng synthetic data.
3. **Single Source Alignment** — cross-check memory vs file thực trước khi confirm quyết định.

---

## 5. Thành phần 4 — Spec sản phẩm (docx + dactaupdate)

- **`Dac-ta-Master-v3.x.docx`** = single source of truth cho UI/UX (SRS + TRD, 6 KHỐI độc lập, nguyên tắc In-place Update).
- **`dactaupdate.md`** = buffer thay đổi chưa kịp merge vào docx (cấu trúc dữ liệu, API contract, kiến trúc deploy, RBAC matrix).
  - **Ghi khi:** thêm bảng/ENUM, đổi API contract, đổi deployment, đổi RBAC.
  - **Không ghi khi:** bug fix UI thuần, refactor nội bộ, thay đổi nhỏ typography/spacing.
  - Quy tắc dọn dẹp: mỗi kỳ nâng version docx → rà & xoá entry đã merge/lỗi thời.
- **`memory/phase-history.md`** giữ log phase — không trùng vai trò với dactaupdate.

---

## 6. Workflow chuẩn của agent (một session)

```text
1. Đọc memory.md                                → nắm trạng thái
2. Đọc agents/01-getting-started.md             → quy tắc bắt buộc
3. Tra cứu OpenBrain:                            → pattern/bug/decision cũ
   search_memories --query "TênTrang|TênComponent" --limit 10
4. git status + git log --oneline -5             → nắm thay đổi gần nhất
5. Đọc file agents/0X tương ứng task              → quy tắc chuyên biệt
6. Code (tuân design system, zero any)
7. Self Review → UX Review → Accessibility Review → Performance Review
8. npm run lint && npm run build                 → Quality Gate
9. docker restart bvdh-frontend + đợi healthy    → BẮT BUỘC sau sửa frontend
10. Update memory.md (+ phase-history/bugs-fixed nếu cần)
11. Commit (kèm description tiếng Việt)
```

---

## 7. Điểm cần lưu ý (pitfalls & quy tắc cứng)

### 7.1 Liên quan OpenBrain

| # | Lưu ý | Chi tiết |
|---|-------|----------|
| O1 | DB ngoài git | `openbrain.db` ở `~/.opencode/openbrain/` — nếu mất DB thì memory AI mất (không khôi phục từ git). Cần backup riêng nếu quan trọng. |
| O2 | Plugin trong `openbrain/` không track | Dự án clone từ GitHub — khi deploy dự án khác phải clone lại plugin. |
| O3 | `.env` của plugin | `openbrain/.env` chứa `GEMINI_API_KEY` — KHÔNG commit. |
| O4 | Memory tự ghi | Mỗi tool call đều ghi episodic → DB lớn dần, cần DreamEngine/cleanup tự động. |

### 7.2 Liên quan memory.md

| # | Lưu ý | Chi tiết |
|---|-------|----------|
| M1 | memory.md không thay thế được bằng OpenBrain | memory.md là state bắt buộc đọc, OpenBrain là tra cứu — 2 vai trò khác nhau (xem 4.4). |
| M2 | Cập nhật cùng session | Không để lệch memory vs code; nghi ngờ lệch → verify file gốc. |
| M3 | PHI cấm tuyệt đối | Không ghi PHI vào memory dù là demo/sample. |

### 7.3 Liên quan AGENTS.md / agents/

| # | Lưu ý | Chi tiết |
|---|-------|----------|
| A1 | Không tạo file agents mới tùy tiện | Chỉ mở rộng file `0X` có sẵn; tạo file mới chỉ khi task tách lại. |
| A2 | Đồng bộ chéo | Sửa 1 file `0X` phải kiểm tra file khác không lệch (đặc biệt Port Policy 02, Memory Safety 08, Design Token 03). |
| A3 | Spec docx = nguồn | Mọi thay đổi lệch spec → phải cập nhật docx/dactaupdate cùng session. |

### 7.4 Liên quan môi trường chạy

| # | Lưu ý | Chi tiết |
|---|-------|----------|
| E1 | Docker HMR | Sau mỗi lần sửa `src/` → restart bvdh-frontend (HMR silent-fail). |
| E2 | Port policy | Chỉ 8443 public; frontend 8000, backend 8001, db 5432 chỉ expose nội bộ. |
| E3 | Quality Gate | `npm run lint && npm run build` bắt buộc trước commit. |
| E4 | Backup policy | Backup trước refactor lớn → `D:\Coding\code backup\...`; sau backup cập nhật memory.md "Backup gần nhất". |

---

## 8. Cách tái tạo hệ thống này trên dự án mới (checklist)

```text
1. Copy cấu trúc:
   - AGENTS.md (index ngắn, ~3KB)
   - agents/01-09*.md (tùy chỉnh tên dự án, port, quy tắc)
   - memory.md + memory/phase-history.md + memory/bugs-fixed.md
2. Cài OpenBrain plugin:
   - git clone https://github.com/CodebyKDvn/openbrain.git ./openbrain
   - npm install (trong openbrain/) nếu cần
   - opencode.json: { "plugin": ["./openbrain"] }
   - tạo openbrain/.env với GEMINI_API_KEY (không commit)
3. Chuẩn bị spec sản phẩm: docx + dactaupdate.md (buffer)
4. Thiết lập môi trường: Docker (port policy), lint, build
5. Kiểm thử: chạy 1 session, xác nhận OpenBrain ghi episodic memory
   + search_memories trả kết quả
```

---

## 9. Định nghĩa thành công

Một thay đổi hoàn thành khi:
1. Code chạy đúng + không phá vỡ kiến trúc.
2. `npm run lint && npm run build` pass.
3. Container healthy (sau khi restart nếu sửa frontend).
4. memory.md (+ phase-history/bugs-fixed nếu cần) đã cập nhật.
5. Spec docx/dactaupdate đã đồng bộ nếu thay đổi ảnh hưởng.
6. Đã commit (agent chỉ commit khi user yêu cầu).

---

*Tài liệu tham chiếu: `AGENTS.md`, `agents/01-09*.md`, `memory.md`, `memory/`, `opencode.json`, `openbrain/` (plugin), `dactaupdate.md`, `Dac-ta-Master-v3.x.docx`.*
