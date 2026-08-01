-- Phase 90: site_content — CMS JSON store cho nội dung tĩnh (Services/Contact/About/Patient/Home)

CREATE TABLE "site_content" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "site_content_pkey" PRIMARY KEY ("key")
);
