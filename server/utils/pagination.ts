export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export function getPagination(
  query: Record<string, unknown>,
  defaultLimit = 50,
  maxLimit = 100
): PaginationResult {
  const rawPage = typeof query.page === "string" ? query.page : undefined;
  const rawLimit = typeof query.limit === "string" ? query.limit : undefined;

  const page = Math.max(1, parseInt(rawPage || "1", 10) || 1);
  let limit = Math.max(1, parseInt(rawLimit || String(defaultLimit), 10) || defaultLimit);
  limit = Math.min(limit, maxLimit);

  return { page, limit, skip: (page - 1) * limit };
}
