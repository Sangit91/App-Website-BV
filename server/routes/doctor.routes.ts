import { Router } from "express";
import * as doctorService from "../services/doctor.service";
import { authenticate, requireSuperAdmin } from "../middleware/auth.middleware";
import { activityLogger } from "../middleware/activity-log.middleware";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const doctors = await doctorService.getDoctors();
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

router.get("/schedules", async (req, res) => {
  try {
    const schedules = await doctorService.getDoctorSchedules();
    res.json(schedules);
  } catch (err) {
    console.error("Error fetching schedules:", err);
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Not found" });
    res.json(doctor);
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
});

router.post("/", authenticate, requireSuperAdmin, activityLogger({ action: "DOCTOR_CREATE" }), async (req, res) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    console.error("Error creating doctor:", err);
    res.status(500).json({ error: "Failed to create doctor" });
  }
});

router.put("/:id", authenticate, requireSuperAdmin, activityLogger({ action: "DOCTOR_UPDATE" }), async (req, res) => {
  try {
    const doctor = await doctorService.updateDoctor(req.params.id, req.body);
    res.json(doctor);
  } catch (err) {
    console.error("Error updating doctor:", err);
    res.status(500).json({ error: "Failed to update doctor" });
  }
});

router.delete("/:id", authenticate, requireSuperAdmin, activityLogger({ action: "DOCTOR_DELETE" }), async (req, res) => {
  try {
    await doctorService.deleteDoctor(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ error: "Failed to delete doctor" });
  }
});

router.patch("/:id/schedule", authenticate, requireSuperAdmin, activityLogger({ action: "DOCTOR_SCHEDULE_UPDATE" }), async (req, res) => {
  try {
    const schedule = await doctorService.updateDoctorSchedule(req.params.id, req.body);
    res.json(schedule);
  } catch (err) {
    console.error("Error updating schedule:", err);
    res.status(500).json({ error: "Failed to update schedule" });
  }
});

export default router;
