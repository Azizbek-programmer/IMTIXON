/*
  Warnings:

  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `stock_quantity` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "stock_quantity" SET DATA TYPE INTEGER;
