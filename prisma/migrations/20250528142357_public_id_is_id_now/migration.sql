/*
  Warnings:

  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Video` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Video_publicId_key";

-- AlterTable
ALTER TABLE "Video" DROP CONSTRAINT "Video_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("publicId");
