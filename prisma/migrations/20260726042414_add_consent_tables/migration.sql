-- CreateTable
CREATE TABLE "consent_policies" (
    "id" TEXT NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content_html" TEXT NOT NULL,
    "effective_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_consents" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "policy_version" VARCHAR(20) NOT NULL,
    "is_agreed" BOOLEAN NOT NULL DEFAULT false,
    "agreed_scopes" JSONB NOT NULL DEFAULT '[]',
    "agreed_at" TIMESTAMP(3),
    "withdrawn_at" TIMESTAMP(3),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "consent_hash" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_consents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consent_policies_version_key" ON "consent_policies"("version");

-- CreateIndex
CREATE INDEX "patient_consents_patient_id_policy_version_is_agreed_idx" ON "patient_consents"("patient_id", "policy_version", "is_agreed");

-- AddForeignKey
ALTER TABLE "patient_consents" ADD CONSTRAINT "patient_consents_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_consents" ADD CONSTRAINT "patient_consents_policy_version_fkey" FOREIGN KEY ("policy_version") REFERENCES "consent_policies"("version") ON DELETE RESTRICT ON UPDATE CASCADE;
