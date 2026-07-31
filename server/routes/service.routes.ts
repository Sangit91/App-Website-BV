import { Router } from "express";
import * as serviceService from "../services/service.service";
import { authenticate, requireSuperAdmin } from "../middleware/auth.middleware.js";
import { activityLogger } from "../middleware/activity-log.middleware";

const router = Router();

router.get("/groups", async (req, res) => {
  try {
    const groups = await serviceService.getServiceGroups();
    res.json(groups);
  } catch (err) {
    console.error("Error fetching service groups:", err);
    res.status(500).json({ error: "Failed to fetch service groups" });
  }
});

router.get("/groups/:id", async (req, res) => {
  try {
    const group = await serviceService.getServiceGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: "Not found" });
    res.json(group);
  } catch (err) {
    console.error("Error fetching service group:", err);
    res.status(500).json({ error: "Failed to fetch service group" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { groupId } = req.query;
    if (groupId && typeof groupId === "string") {
      const services = await serviceService.getServicesByGroup(groupId);
      return res.json(services);
    }
    const services = await serviceService.getServices();
    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ error: "Not found" });
    res.json(service);
  } catch (err) {
    console.error("Error fetching service:", err);
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

router.post("/groups", authenticate, requireSuperAdmin, activityLogger({ action: "SERVICE_GROUP_CREATE" }), async (req, res) => {
  try {
    const group = await serviceService.createServiceGroup(req.body);
    res.status(201).json(group);
  } catch (err) {
    console.error("Error creating service group:", err);
    res.status(500).json({ error: "Failed to create service group" });
  }
});

router.post("/", authenticate, requireSuperAdmin, activityLogger({ action: "SERVICE_CREATE" }), async (req, res) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(201).json(service);
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ error: "Failed to create service" });
  }
});

router.put("/groups/:id", authenticate, requireSuperAdmin, activityLogger({ action: "SERVICE_GROUP_UPDATE" }), async (req, res) => {
  try {
    const group = await serviceService.updateServiceGroup(req.params.id, req.body);
    res.json(group);
  } catch (err) {
    console.error("Error updating service group:", err);
    res.status(500).json({ error: "Failed to update service group" });
  }
});

router.put("/:id", authenticate, requireSuperAdmin, activityLogger({ action: "SERVICE_UPDATE" }), async (req, res) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    res.json(service);
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ error: "Failed to update service" });
  }
});

router.delete("/groups/:id", authenticate, requireSuperAdmin, activityLogger({ action: "SERVICE_GROUP_DELETE" }), async (req, res) => {
  try {
    await serviceService.deleteServiceGroup(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting service group:", err);
    res.status(500).json({ error: "Failed to delete service group" });
  }
});

router.delete("/:id", authenticate, requireSuperAdmin, activityLogger({ action: "SERVICE_DELETE" }), async (req, res) => {
  try {
    await serviceService.deleteService(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;