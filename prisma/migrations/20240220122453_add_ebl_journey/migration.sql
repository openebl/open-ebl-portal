-- CreateEnum
CREATE TYPE "EblJourneyAction" AS ENUM ('ISSUE', 'GRANT_SHIPPER', 'GRANT_CONSIGNEE', 'GRANT_RELEASE_AGENT', 'ENDORSE', 'AMEND', 'SURRENDER');

-- CreateTable
CREATE TABLE "EblJourney" (
    "id" BIGSERIAL NOT NULL,
    "eBlId" BIGINT NOT NULL,
    "action" "EblJourneyAction" NOT NULL,
    "lastStatus" "EBlStatus" NOT NULL,
    "targetPlatformId" BIGINT,
    "sourcePlatformId" BIGINT,
    "userId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EblJourney_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ebl_journey_ebl_id" ON "EblJourney"("eBlId");

-- CreateIndex
CREATE INDEX "idx_ebl_journey_target_platform_id_ebl_id" ON "EblJourney"("targetPlatformId", "eBlId");
