-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();
