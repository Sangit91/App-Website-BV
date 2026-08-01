import { Router } from "express";
import { getAllContent, getContent, upsertContent } from "../services/site-content.service";
import { authenticate, requireSuperAdmin } from "../middleware/auth.middleware";
import { activityLogger } from "../middleware/activity-log.middleware";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const content = await getAllContent();
    res.json({ data: content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.get("/:key", async (req, res) => {
  try {
    const row = await getContent(req.params.key);
    if (!row) {
      return res.status(404).json({ error: "Không tìm thấy nội dung" });
    }
    res.json({ data: row.value });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.put("/:key", authenticate, requireSuperAdmin, activityLogger({ action: "SITE_CONTENT_UPDATE" }), async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ error: "Thiếu trường value" });
    }
    await upsertContent(key, value);
    res.json({ data: value });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

export default router;
