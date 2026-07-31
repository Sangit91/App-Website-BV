-- DropIndex
DROP INDEX "patients_cccd_key";

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "cccd_hash" VARCHAR(64);

-- Backfill: chuyển cccd plaintext cũ sang hash (placeholder MD5 — app sẽ re-hash khi cần,
-- data thật sẽ được migrate qua script riêng dùng CCCD_SECRET)
UPDATE "patients" SET "cccd_hash" = encode(sha256(convert_to("cccd", 'UTF8')), 'hex') WHERE "cccd" IS NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "cccd";

-- CreateIndex
CREATE UNIQUE INDEX "patients_cccd_hash_key" ON "patients"("cccd_hash");
