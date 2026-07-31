import { NextFunction, Request, Response } from "express";
import { z } from "zod";

function getPathValue(body: unknown, path: Array<string | number>): unknown {
  let cur: unknown = body;
  for (const key of path) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key as string];
  }
  return cur;
}

export function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issue = result.error.issues[0];
      const field = issue?.path && issue.path.length > 0 ? issue.path.join(".") : "";
      let message = issue?.message || "Dữ liệu không hợp lệ";
      let label = field ? `${field}: ` : "";

      // Lỗi thiếu trường — message tiếng Việt thay vì "Invalid input..." mặc định.
      if (issue && issue.code === "invalid_type" && getPathValue(req.body, issue.path as Array<string | number>) === undefined) {
        message = `Thiếu thông tin bắt buộc${field ? `: ${field}` : ""}`;
        label = "";
      }

      return res.status(400).json({ error: `${label}${message}` });
    }
    req.body = result.data;
    next();
  };
}
