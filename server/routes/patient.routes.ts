import { Router } from "express";
import { patientService, toPublicPatient } from "../services/patient.service";
import { consentCheckMiddleware } from "../middleware/consent.middleware";
import { requirePatientReadAccess } from "../middleware/patient-access.middleware";
import { phiAccessLogger } from "../middleware/activity-log.middleware";
import { lookupLimiter } from "../middleware/rate-limit.middleware";
import { validate } from "../validators/middleware";
import { patientLookupSchema } from "../validators/schemas";
import { getPagination } from "../utils/pagination";

const router = Router();

router.post("/lookup", lookupLimiter, validate(patientLookupSchema), async (req, res) => {
  try {
    const { identifier, identifierType } = req.body;

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
    const { page, limit, skip } = getPagination(req.query, 50, 100);

    const result = await patientService.getMedicalRecords(patientId, {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      clinicId: clinicId as string | undefined,
    }, { skip, take: limit });

    res.json({
      records: result.data,
      total: result.total,
      page,
      pageSize: limit,
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
    const { page, limit, skip } = getPagination(req.query, 50, 100);

    const result = await patientService.getClinicalTests(patientId, {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      testType: testType as string | undefined,
      status: status as string | undefined,
    }, { skip, take: limit });

    res.json({
      tests: result.data,
      total: result.total,
      page,
      pageSize: limit,
    });
  } catch (error) {
    console.error("[patient] clinical-tests error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

router.get("/:patientId/treatment-histories", requirePatientReadAccess, consentCheckMiddleware, phiAccessLogger({ action: "PHI_READ_TREATMENT_HISTORIES", dataAccessed: "PHI" }), async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page, limit, skip } = getPagination(req.query, 50, 100);

    const result = await patientService.getTreatmentHistories(patientId, { skip, take: limit });

    res.json({
      histories: result.data,
      total: result.total,
      page,
      pageSize: limit,
    });
  } catch (error) {
    console.error("[patient] treatment-histories error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

export default router;
