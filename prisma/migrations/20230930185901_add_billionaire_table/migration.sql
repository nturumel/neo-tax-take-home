-- CreateTable
CREATE TABLE "billionaires" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "billionaires_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "billionaires_name_key" ON "billionaires"("name");
