-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('SUPERADMIN', 'ADMIN', 'CUSTOMER', 'SELLER', 'WORKER');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
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
    "language_id" INTEGER,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
