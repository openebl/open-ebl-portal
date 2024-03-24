/*
  Warnings:

  - A unique constraint covering the columns `[userId,platformId,role]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Platform" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "businessInfo" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_platformId_role_key" ON "UserRole"("userId", "platformId", "role");
