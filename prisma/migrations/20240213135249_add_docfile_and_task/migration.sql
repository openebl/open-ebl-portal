/*
  Warnings:

  - Added the required column `activePlatformId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocAiTaskStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "EBl" ADD COLUMN     "docFileId" BIGINT;

-- CreateTable
CREATE TABLE "DocFile" (
    "id" BIGSERIAL NOT NULL,
    "platformId" BIGINT NOT NULL,
    "uploaderId" BIGINT NOT NULL,
    "filename" TEXT,
    "storagekey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocImage" (
    "id" BIGSERIAL NOT NULL,
    "docFileId" BIGINT NOT NULL,
    "page" INTEGER NOT NULL,
    "storagekey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocAiTask" (
    "id" BIGSERIAL NOT NULL,
    "externalId" VARCHAR(160) NOT NULL,
    "docFileId" BIGINT NOT NULL,
    "status" "DocAiTaskStatus" NOT NULL DEFAULT 'UPLOADED',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocAiTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_doc_ai_task_status" ON "DocAiTask"("status");

-- AddForeignKey
ALTER TABLE "DocFile" ADD CONSTRAINT "DocFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
