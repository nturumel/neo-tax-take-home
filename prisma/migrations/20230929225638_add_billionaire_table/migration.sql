/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `billionaires` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "billionaires_name_key" ON "billionaires"("name");
