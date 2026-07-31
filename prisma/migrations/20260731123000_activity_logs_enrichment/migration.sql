-- Phase 85: activity_logs enrichment + lookup indexes

-- 1) activity_logs: add durationMs, dataAccessed (PHI access marker), patientId
ALTER TABLE "activity_logs" ADD COLUMN "duration_ms" INTEGER;
ALTER TABLE "activity_logs" ADD COLUMN "data_accessed" VARCHAR(50);
ALTER TABLE "activity_logs" ADD COLUMN "patient_id" TEXT;

CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at");
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs"("user_id");
CREATE INDEX "activity_logs_patient_id_idx" ON "activity_logs"("patient_id");

-- 2) lookup indexes: patients.phone + appointments.phone
CREATE INDEX "patients_phone_idx" ON "patients"("phone");
CREATE INDEX "appointments_phone_idx" ON "appointments"("phone");
