import { Router } from "express";
import * as testimonialService from "../services/testimonial.service";
import { authenticate, requireAdmin, requireSuperAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const includeUnapproved = req.query.includeUnapproved === "true";
    if (includeUnapproved) {
      return res.status(403).json({ error: "Chỉ quản trị viên mới xem được cảm nhận chưa duyệt" });
    }
    const testimonials = await testimonialService.getTestimonials(false);
    res.json(testimonials);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const testimonial = await testimonialService.getTestimonialById(req.params.id);
    if (!testimonial) return res.status(404).json({ error: "Not found" });
    res.json(testimonial);
  } catch (err) {
    console.error("Error fetching testimonial:", err);
    res.status(500).json({ error: "Failed to fetch testimonial" });
  }
});

router.post("/", async (req, res) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    res.status(201).json(testimonial);
  } catch (err) {
    console.error("Error creating testimonial:", err);
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

router.put("/:id", authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
    res.json(testimonial);
  } catch (err) {
    console.error("Error updating testimonial:", err);
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

router.delete("/:id", authenticate, requireSuperAdmin, async (req, res) => {
  try {
    await testimonialService.deleteTestimonial(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

router.patch("/:id/approve", authenticate, requireSuperAdmin, async (req, res) => {
  try {
    const testimonial = await testimonialService.approveTestimonial(req.params.id);
    res.json(testimonial);
  } catch (err) {
    console.error("Error approving testimonial:", err);
    res.status(500).json({ error: "Failed to approve testimonial" });
  }
});

export default router;