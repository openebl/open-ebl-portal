-- CreateTable
CREATE TABLE "EBlStash" (
    "id" BIGSERIAL NOT NULL,
    "platformId" BIGINT NOT NULL,
    "eBlId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentOwner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL,

    CONSTRAINT "EBlStash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EBlNotification" (
    "id" BIGSERIAL NOT NULL,
    "eBlStashId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "EBlNotification_pkey" PRIMARY KEY ("id")
);
