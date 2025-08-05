/*
  Warnings:

  - You are about to alter the column `total_price` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `unit_price` on the `Order_items` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `amount` on the `Payments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `price` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "total_price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Order_items" ALTER COLUMN "unit_price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Payments" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Service" ALTER COLUMN "price" SET DATA TYPE INTEGER;
