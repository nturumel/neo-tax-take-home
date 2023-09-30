/*
  Warnings:

  - You are about to drop the column `isOwnedByBezos` on the `merchants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "merchants" DROP COLUMN "isOwnedByBezos",
ADD COLUMN     "billionaireId" INTEGER;

-- CreateTable
CREATE TABLE "billionaires" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "billionaires_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_id_fkey" FOREIGN KEY ("id") REFERENCES "billionaires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
