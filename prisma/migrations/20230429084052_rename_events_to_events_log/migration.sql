/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Event";

-- CreateTable
CREATE TABLE "EventLog" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "modelName" VARCHAR(32) NOT NULL,
    "modelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);
