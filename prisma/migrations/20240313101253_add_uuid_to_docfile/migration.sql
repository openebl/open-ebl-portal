/*
  Warnings:

  - You are about to drop the column `docFileId` on the `EBl` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `DocFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `DocFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EBl" DROP CONSTRAINT "EBl_docFileId_fkey";

-- AlterTable
ALTER TABLE "DocFile" ADD COLUMN     "uuid" TEXT;

-- AlterTable
ALTER TABLE "EBl" DROP COLUMN "docFileId";

-- CreateIndex
CREATE UNIQUE INDEX "DocFile_uuid_key" ON "DocFile"("uuid");
