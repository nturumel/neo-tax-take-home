/*
  Warnings:

  - Made the column `isOwnedBy` on table `merchants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "merchants" ALTER COLUMN "isOwnedBy" SET NOT NULL,
ALTER COLUMN "isOwnedBy" SET DEFAULT '';
