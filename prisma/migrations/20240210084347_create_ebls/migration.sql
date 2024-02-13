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
    "shipper" VARCHAR(160),
    "consignee" VARCHAR(160),
    "releaseAgent" VARCHAR(160),
    "eta" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EBl_pkey" PRIMARY KEY ("id")
);

CREATE INDEX idx_ebl_updated_at ON "EBl" ("updatedAt" DESC);
