import { Router } from "express";
import { patientService, toPublicPatient } from "../services/patient.service";
import { consentCheckMiddleware } from "../middleware/consent.middleware";
import { requirePatientReadAccess } from "../middleware/patient-access.middleware";
import { phiAccessLogger } from "../middleware/activity-log.middleware";

const router = Router();

router.post("/lookup", async (req, res) => {
  try {
    const { identifier, identifierType } = req.body;

    if (!identifier || !identifierType) {
      return res.status(400).json({ error: "Thiếu thông tin tra cứu" });
    }

    if (!["patientCode", "cccd", "phone"].includes(identifierType)) {
      return res.status(400).json({ error: "Loại định danh không hợp lệ" });
    }

    const patient = await patientService.lookup(identifier, identifierType);

    if (!patient) {
      return res.status(404).json({ error: "Không tìm thấy bệnh nhân" });
    }

    res.json({ patient: toPublicPatient(patient), message: "Tìm thấy bệnh nhân" });
  } catch (error) {
    console.error("[patient] lookup error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

router.get("/:patientId/medical-records", requirePatientReadAccess, consentCheckMiddleware, phiAccessLogger({ action: "PHI_READ_MEDICAL_RECORDS", dataAccessed: "PHI" }), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate, clinicId } = req.query;

    const records = await patientService.getMedicalRecords(patientId, {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      clinicId: clinicId as string | undefined,
    });

    res.json({
      records,
      total: records.length,
      page: 1,
      pageSize: records.length,
    });
  } catch (error) {
    console.error("[patient] medical-records error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

router.get("/:patientId/clinical-tests", requirePatientReadAccess, consentCheckMiddleware, phiAccessLogger({ action: "PHI_READ_CLINICAL_TESTS", dataAccessed: "PHI" }), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate, testType, status } = req.query;

    const tests = await patientService.getClinicalTests(patientId, {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      testType: testType as string | undefined,
      status: status as string | undefined,
    });

    res.json({
      tests,
      total: tests.length,
      page: 1,
      pageSize: tests.length,
    });
  } catch (error) {
    console.error("[patient] clinical-tests error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

router.get("/:patientId/treatment-histories", requirePatientReadAccess, consentCheckMiddleware, phiAccessLogger({ action: "PHI_READ_TREATMENT_HISTORIES", dataAccessed: "PHI" }), async (req, res) => {
  try {
    const { patientId } = req.params;

    const histories = await patientService.getTreatmentHistories(patientId);

    res.json({
      histories,
      total: histories.length,
      page: 1,
      pageSize: histories.length,
    });
  } catch (error) {
    console.error("[patient] treatment-histories error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

export default router;
