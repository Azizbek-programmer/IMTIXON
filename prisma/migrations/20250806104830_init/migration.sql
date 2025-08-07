-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('SUPERADMIN', 'ADMIN', 'CUSTOMER', 'SELLER', 'WORKER');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('INSTALLATION', 'REPAIR', 'CLEANING', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ServiceRequestStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ServiceRating" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('PAYMENT', 'ORDER_STATUS', 'WARNING', 'PROMO', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."ProductColor" AS ENUM ('RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK', 'WHITE', 'ORANGE');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'GET_ALL', 'GETID', 'LOGIN', 'LOGOUT');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."OrderType" AS ENUM ('PRODUCT', 'SERVICE', 'BOTH');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CARD', 'ONLINE', 'PAYME', 'CLICK');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('PRODUCT', 'SERVICE', 'DELIVERY', 'OTHER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "status" "public"."Status" NOT NULL,
    "role" "public"."Roles" NOT NULL,
    "hashedRefreshToken" TEXT,
    "activationLink" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "language_id" INTEGER,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Language" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reviews" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "service_id" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "price" INTEGER NOT NULL,
    "duration_minutes" VARCHAR(50),
    "type" "public"."ServiceType",
    "warranty_days" VARCHAR(50),
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "scheduled_at" VARCHAR(100),
    "address" VARCHAR(255),
    "technician_id" INTEGER,
    "status" "public"."ServiceRequestStatus",
    "real_duration_minutes" TEXT,
    "rating" "public"."ServiceRating",
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "message" VARCHAR(255),
    "notification_type" "public"."NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "price" INTEGER NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "dimensions" VARCHAR(100),
    "color" "public"."ProductColor" NOT NULL,
    "category_id" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Images" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "descriptions" VARCHAR(255),

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER,
    "type" "public"."ActivityType" NOT NULL,
    "target_table" TEXT,
    "old_value" TEXT,
    "new_value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "order_type" "public"."OrderType" NOT NULL,
    "delivery_address" VARCHAR(255),
    "payment_method" "public"."PaymentMethod" NOT NULL,
    "service_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "service_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "note" VARCHAR(255),

    CONSTRAINT "Order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payments" (
    "id" SERIAL NOT NULL,
    "receipt_number" INTEGER,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL,
    "paid_at" TIMESTAMP(3),
    "payment_type" "public"."PaymentType" NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "public"."Language"("name");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service_requests" ADD CONSTRAINT "Service_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service_requests" ADD CONSTRAINT "Service_requests_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service_requests" ADD CONSTRAINT "Service_requests_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notifications" ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Images" ADD CONSTRAINT "Images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity_logs" ADD CONSTRAINT "Activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order_items" ADD CONSTRAINT "Order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order_items" ADD CONSTRAINT "Order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order_items" ADD CONSTRAINT "Order_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
