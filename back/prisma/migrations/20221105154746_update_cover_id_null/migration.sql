/*
  Warnings:

  - You are about to drop the column `filename` on the `covers` table. All the data in the column will be lost.
  - You are about to drop the column `mimetype` on the `covers` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `covers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `covers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_coverId_fkey";

-- AlterTable
ALTER TABLE "books" ALTER COLUMN "coverId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "covers" DROP COLUMN "filename",
DROP COLUMN "mimetype",
ADD COLUMN     "fileName" VARCHAR(70) NOT NULL,
ADD COLUMN     "mimeType" VARCHAR(20) NOT NULL;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "covers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
