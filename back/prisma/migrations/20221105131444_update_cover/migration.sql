/*
  Warnings:

  - You are about to drop the column `imageData` on the `covers` table. All the data in the column will be lost.
  - You are about to drop the column `imageName` on the `covers` table. All the data in the column will be lost.
  - You are about to drop the column `imageType` on the `covers` table. All the data in the column will be lost.
  - Added the required column `filename` to the `covers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `covers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `covers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "covers" DROP COLUMN "imageData",
DROP COLUMN "imageName",
DROP COLUMN "imageType",
ADD COLUMN     "filename" VARCHAR(70) NOT NULL,
ADD COLUMN     "mimetype" VARCHAR(20) NOT NULL,
ADD COLUMN     "originalName" VARCHAR(30) NOT NULL;
