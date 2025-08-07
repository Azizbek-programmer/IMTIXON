/*
  Warnings:

  - You are about to drop the `RequestLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."RequestLog";

-- DropEnum
DROP TYPE "public"."ActionType";

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
