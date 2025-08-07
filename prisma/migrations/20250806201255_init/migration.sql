-- CreateEnum
CREATE TYPE "public"."ActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'GET', 'LOGIN', 'LOGOUT');

-- CreateTable
CREATE TABLE "public"."RequestLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "userEmail" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "tableName" TEXT,
    "recordId" INTEGER,
    "oldValue" JSONB,
    "newValue" JSONB,
    "actionType" "public"."ActionType" NOT NULL,
    "endpoint" TEXT,
    "httpMethod" TEXT,
    "queryParams" JSONB,
    "bodyParams" JSONB,
    "durationMs" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);
