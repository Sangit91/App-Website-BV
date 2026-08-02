-- AlterTable
ALTER TABLE "news" ADD COLUMN     "tender_file" JSONB;

-- AlterTable
ALTER TABLE "site_content" ALTER COLUMN "updated_at" DROP DEFAULT;
