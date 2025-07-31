-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('SUPERADMIN', 'ADMIN', 'CUSTOMER', 'SELLER', 'WORKER');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" BIGSERIAL NOT NULL,
    "full_name" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "status" "public"."Status" NOT NULL,
    "birth_date" TIMESTAMP(3),
    "role" "public"."Roles" NOT NULL,
    "hashedRefreshToken" TEXT,
    "activationLink" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "language_id" BIGINT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(15),
    "hashedPassword" TEXT NOT NULL,
    "isActivated" BOOLEAN,
    "is_approved" BOOLEAN NOT NULL,
    "role" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "public"."users"("phone");
