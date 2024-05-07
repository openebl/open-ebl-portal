-- Create EBlStatus
CREATE TYPE "EBlStatus" AS ENUM ('DRAFT', 'PROCESSING', 'COMPLETED', 'PRINTED');

-- CreateTable
CREATE TABLE "EBl" (
    "id" VARCHAR(48) NOT NULL,
    "blNumber" VARCHAR(160) NOT NULL,
    "status" "EBlStatus" NOT NULL DEFAULT 'DRAFT',
    "blType" VARCHAR(32),
    "pol" VARCHAR(16),
    "pod" VARCHAR(16),
    "issuerId" BIGINT,
    "shipperId" BIGINT,
    "consigneeId" BIGINT,
    "releaseAgentId" BIGINT,
    "ownerPlatformId" BIGINT,
    "nextPlatformId" BIGINT,
    "eta" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EBl_pkey" PRIMARY KEY ("id")
);

CREATE INDEX idx_ebl_updated_at ON "EBl" ("updatedAt" DESC);

-- AddForeignKey
ALTER TABLE "EBl" ADD CONSTRAINT "EBl_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Platform"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EBl" ADD CONSTRAINT "EBl_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "Platform"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EBl" ADD CONSTRAINT "EBl_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Platform"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EBl" ADD CONSTRAINT "EBl_releaseAgentId_fkey" FOREIGN KEY ("releaseAgentId") REFERENCES "Platform"("id") ON DELETE SET NULL ON UPDATE CASCADE;
