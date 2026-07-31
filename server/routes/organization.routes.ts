import { Router } from "express";
import { organizationService } from "../db/organization";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", (req, res) => {
  const divisions = organizationService.getAll();
  res.json(divisions);
});

router.get("/:divisionId", (req, res) => {
  const { divisionId } = req.params;
  const division = organizationService.getByDivision(divisionId);
  if (!division) {
    return res.status(404).json({ error: "Không tìm thấy khối/bộ phận" });
  }
  res.json(division);
});

router.get("/:divisionId/departments/:deptId", (req, res) => {
  const { divisionId, deptId } = req.params;
  const dept = organizationService.getDepartment(divisionId, deptId);
  if (!dept) {
    return res.status(404).json({ error: "Không tìm thấy khoa/phòng" });
  }
  res.json(dept);
});

router.post("/:divisionId/departments", authenticate, requireAdmin, (req, res) => {
  try {
    const { divisionId } = req.params;
    const { name, leader, phone, staffCount, description, details } = req.body;

    if (!name || !leader) {
      return res.status(400).json({ error: "Tên và Trưởng khoa là bắt buộc" });
    }

    const newDept = organizationService.createDepartment(divisionId, {
      name,
      leader,
      phone: phone || "",
      staffCount: staffCount || 0,
      description: description || "",
      details: details || undefined
    });

    if (!newDept) {
      return res.status(404).json({ error: "Không tìm thấy khối/bộ phận" });
    }

    res.status(201).json(newDept);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.put("/:divisionId/departments/:deptId", authenticate, requireAdmin, (req, res) => {
  try {
    const { divisionId, deptId } = req.params;
    const updates = req.body;

    const updated = organizationService.updateDepartment(divisionId, deptId, updates);
    if (!updated) {
      return res.status(404).json({ error: "Không tìm thấy khoa/phòng" });
    }

    res.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.delete("/:divisionId/departments/:deptId", authenticate, requireAdmin, (req, res) => {
  try {
    const { divisionId, deptId } = req.params;
    const deleted = organizationService.deleteDepartment(divisionId, deptId);
    if (!deleted) {
      return res.status(404).json({ error: "Không tìm thấy khoa/phòng" });
    }
    res.json({ message: "Xóa khoa/phòng thành công" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

export default router;