/*
  Warnings:

  - A unique constraint covering the columns `[platformId]` on the table `Platform` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Platform" ADD COLUMN     "platformId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Platform_platformId_key" ON "Platform"("platformId");
