import { Router } from "express";
import * as specialtyService from "../services/specialty.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const specialties = await specialtyService.getSpecialties();
    res.json(specialties);
  } catch (err) {
    console.error("Error fetching specialties:", err);
    res.status(500).json({ error: "Failed to fetch specialties" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const specialty = await specialtyService.getSpecialtyById(req.params.id);
    if (!specialty) return res.status(404).json({ error: "Not found" });
    res.json(specialty);
  } catch (err) {
    console.error("Error fetching specialty:", err);
    res.status(500).json({ error: "Failed to fetch specialty" });
  }
});

router.post("/", async (req, res) => {
  try {
    const specialty = await specialtyService.createSpecialty(req.body);
    res.status(201).json(specialty);
  } catch (err) {
    console.error("Error creating specialty:", err);
    res.status(500).json({ error: "Failed to create specialty" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const specialty = await specialtyService.updateSpecialty(req.params.id, req.body);
    res.json(specialty);
  } catch (err) {
    console.error("Error updating specialty:", err);
    res.status(500).json({ error: "Failed to update specialty" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await specialtyService.deleteSpecialty(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting specialty:", err);
    res.status(500).json({ error: "Failed to delete specialty" });
  }
});

export default router;