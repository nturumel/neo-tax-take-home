-- CreateTable
CREATE TABLE "merchants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isOwnedByBezos" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchants_name_key" ON "merchants"("name");
