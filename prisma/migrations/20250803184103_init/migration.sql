/*
  Warnings:

  - The `type` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Service_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rating` column on the `Service_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `notification_type` on the `Notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('INSTALLATION', 'REPAIR', 'CLEANING', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ServiceRequestStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ServiceRating" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('PAYMENT', 'ORDER_STATUS', 'WARNING', 'PROMO', 'GENERAL');

-- AlterTable
ALTER TABLE "public"."Notifications" DROP COLUMN "notification_type",
ADD COLUMN     "notification_type" "public"."NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "type",
ADD COLUMN     "type" "public"."ServiceType";

-- AlterTable
ALTER TABLE "public"."Service_requests" DROP COLUMN "status",
ADD COLUMN     "status" "public"."ServiceRequestStatus",
DROP COLUMN "rating",
ADD COLUMN     "rating" "public"."ServiceRating";
