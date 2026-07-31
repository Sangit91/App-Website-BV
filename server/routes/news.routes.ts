import { Router } from "express";
import * as newsService from "../services/news.service";
import { authenticate, requireAdmin, authorizeDepartmentAccess } from "../middleware/auth.middleware";
import { activityLogger } from "../middleware/activity-log.middleware";
import { validate } from "../validators/middleware";
import { newsCreateSchema, newsUpdateSchema } from "../validators/schemas";
import { getPagination } from "../utils/pagination";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query, 200, 200);
    const { data, total } = await newsService.getNews(page, limit);
    res.setHeader("X-Total-Count", String(total));
    res.json(data);
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

router.get("/tenders", async (req, res) => {
  try {
    const tenders = await newsService.getTenderNews();
    res.json(tenders);
  } catch (err) {
    console.error("Error fetching tenders:", err);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await newsService.getNewsById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("Error fetching news item:", err);
    res.status(500).json({ error: "Failed to fetch news item" });
  }
});

router.post("/", authenticate, requireAdmin, authorizeDepartmentAccess, validate(newsCreateSchema), activityLogger({ action: "NEWS_CREATE" }), async (req, res) => {
  try {
    const item = await newsService.createNews(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating news:", err);
    res.status(500).json({ error: "Failed to create news" });
  }
});

router.put("/:id", authenticate, requireAdmin, authorizeDepartmentAccess, validate(newsUpdateSchema), activityLogger({ action: "NEWS_UPDATE" }), async (req, res) => {
  try {
    const item = await newsService.updateNews(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    console.error("Error updating news:", err);
    res.status(500).json({ error: "Failed to update news" });
  }
});

router.delete("/:id", authenticate, requireAdmin, authorizeDepartmentAccess, activityLogger({ action: "NEWS_DELETE" }), async (req, res) => {
  try {
    await newsService.deleteNews(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting news:", err);
    res.status(500).json({ error: "Failed to delete news" });
  }
});

export default router;
