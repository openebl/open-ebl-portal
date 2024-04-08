-- DropForeignKey
ALTER TABLE "DocFile" DROP CONSTRAINT "DocFile_uploaderId_fkey";

-- AlterTable
ALTER TABLE "DocFile" ALTER COLUMN "uploaderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DocFile" ADD CONSTRAINT "DocFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
