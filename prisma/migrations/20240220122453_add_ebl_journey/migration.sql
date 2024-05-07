-- CreateEnum
CREATE TYPE "EBlJourneyAction" AS ENUM ('DRAFT', 'ISSUE', 'GRANT_SHIPPER', 'GRANT_CONSIGNEE', 'GRANT_RELEASE_AGENT', 'TRANSFER', 'AMEND', 'SURRENDER', 'COMPLETE', 'PRINT');

-- CreateTable
CREATE TABLE "EBlJourney" (
    "id" BIGSERIAL NOT NULL,
    "eBlId" VARCHAR(48) NOT NULL,
    "action" "EBlJourneyAction" NOT NULL,
    "note" TEXT,
    "lastStatus" "EBlStatus" NOT NULL,
    "targetPlatformId" BIGINT,
    "sourcePlatformId" BIGINT,
    "userId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EBlJourney_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ebl_journey_ebl_id" ON "EBlJourney"("eBlId");

-- CreateIndex
CREATE INDEX "idx_ebl_journey_target_platform_id_ebl_id" ON "EBlJourney"("targetPlatformId", "eBlId");

-- AlterEnum
ALTER TYPE "EBlStatus" ADD VALUE 'UPLOADED';
