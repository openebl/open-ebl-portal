-- CreateTable
CREATE TABLE "TradeRole" (
    "id" BIGSERIAL NOT NULL,
    "tradeRole" VARCHAR(32) NOT NULL,

    CONSTRAINT "TradeRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlatformToTradeRole" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlatformToTradeRole_AB_unique" ON "_PlatformToTradeRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PlatformToTradeRole_B_index" ON "_PlatformToTradeRole"("B");

-- AddForeignKey
ALTER TABLE "_PlatformToTradeRole" ADD CONSTRAINT "_PlatformToTradeRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlatformToTradeRole" ADD CONSTRAINT "_PlatformToTradeRole_B_fkey" FOREIGN KEY ("B") REFERENCES "TradeRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
