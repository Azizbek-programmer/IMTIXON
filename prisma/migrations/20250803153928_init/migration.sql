-- CreateTable
CREATE TABLE "public"."Language" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "public"."Language"("name");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;
