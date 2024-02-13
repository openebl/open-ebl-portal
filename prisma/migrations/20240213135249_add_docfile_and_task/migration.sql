/*
  Warnings:

  - Added the required column `activePlatformId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocAiTaskStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "EBl" ADD COLUMN     "DocFileId" BIGINT;

-- CreateTable
CREATE TABLE "DocFile" (
    "id" BIGSERIAL NOT NULL,
    "platformId" BIGINT NOT NULL,
    "storagekey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocImage" (
    "id" BIGSERIAL NOT NULL,
    "DocFileId" BIGINT NOT NULL,
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
    "DocFileId" BIGINT NOT NULL,
    "status" "DocAiTaskStatus" NOT NULL DEFAULT 'UPLOADED',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocAiTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_doc_ai_task_status" ON "DocAiTask"("status");
