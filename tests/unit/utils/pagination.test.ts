import { getPagination } from "../../../server/utils/pagination";

describe("utils/pagination", () => {
  it("mặc định page=1, limit=50", () => {
    const p = getPagination({});
    expect(p).toEqual({ page: 1, limit: 50, skip: 0 });
  });

  it("parse page và limit từ query", () => {
    const p = getPagination({ page: "3", limit: "20" });
    expect(p).toEqual({ page: 3, limit: 20, skip: 40 });
  });

  it("limit bị clamp xuống maxLimit", () => {
    const p = getPagination({ limit: "500" }, 50, 100);
    expect(p.limit).toBe(100);
  });

  it("page < 1 → ép về 1", () => {
    const p = getPagination({ page: "0" });
    expect(p.page).toBe(1);
  });

  it("giá trị không hợp lệ → fallback mặc định", () => {
    const p = getPagination({ page: "abc", limit: "xyz" });
    expect(p).toEqual({ page: 1, limit: 50, skip: 0 });
  });
});