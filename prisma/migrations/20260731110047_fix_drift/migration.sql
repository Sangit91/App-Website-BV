-- DropForeignKey
ALTER TABLE "patient_consents" DROP CONSTRAINT "patient_consents_policy_version_fkey";

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "tender_dept" VARCHAR(50),
ALTER COLUMN "tender_start_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "tender_end_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "patient_consents" ALTER COLUMN "policy_version" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "patient_consents" ADD CONSTRAINT "patient_consents_policy_version_fkey" FOREIGN KEY ("policy_version") REFERENCES "consent_policies"("version") ON DELETE SET NULL ON UPDATE CASCADE;
