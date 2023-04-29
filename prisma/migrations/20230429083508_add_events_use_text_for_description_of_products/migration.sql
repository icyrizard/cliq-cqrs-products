/*
  Warnings:

  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `sku` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "name" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "sku" SET DATA TYPE VARCHAR(128);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "modelName" VARCHAR(32) NOT NULL,
    "modelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
