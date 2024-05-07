/*
  Warnings:

  - You are about to drop the `DocAiTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EBl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EBlJourney` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TradeRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PlatformToTradeRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EBl" DROP CONSTRAINT "EBl_consigneeId_fkey";

-- DropForeignKey
ALTER TABLE "EBl" DROP CONSTRAINT "EBl_issuerId_fkey";

-- DropForeignKey
ALTER TABLE "EBl" DROP CONSTRAINT "EBl_releaseAgentId_fkey";

-- DropForeignKey
ALTER TABLE "EBl" DROP CONSTRAINT "EBl_shipperId_fkey";

-- DropForeignKey
ALTER TABLE "EBlJourney" DROP CONSTRAINT "EBlJourney_eBlId_fkey";

-- DropForeignKey
ALTER TABLE "_PlatformToTradeRole" DROP CONSTRAINT "_PlatformToTradeRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlatformToTradeRole" DROP CONSTRAINT "_PlatformToTradeRole_B_fkey";

-- DropTable
DROP TABLE "DocAiTask";

-- DropTable
DROP TABLE "EBl";

-- DropTable
DROP TABLE "EBlJourney";

-- DropTable
DROP TABLE "TradeRole";

-- DropTable
DROP TABLE "_PlatformToTradeRole";

-- DropEnum
DROP TYPE "DocAiTaskStatus";

-- DropEnum
DROP TYPE "EBlJourneyAction";

-- DropEnum
DROP TYPE "EBlStatus";
