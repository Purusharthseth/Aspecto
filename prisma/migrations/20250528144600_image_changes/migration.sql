/*
  Warnings:

  - You are about to drop the column `publicId` on the `Image` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Image_publicId_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "publicId";
