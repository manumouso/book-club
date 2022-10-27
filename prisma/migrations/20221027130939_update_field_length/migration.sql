/*
  Warnings:

  - You are about to alter the column `firstName` on the `authors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `lastName` on the `authors` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to drop the column `publicationYear` on the `books` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `imageName` on the `covers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `imageType` on the `covers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `name` on the `genres` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Added the required column `publisher` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authors" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(60);

-- AlterTable
ALTER TABLE "books" DROP COLUMN "publicationYear",
ADD COLUMN     "publisher" VARCHAR(50) NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "isbn" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "covers" ALTER COLUMN "imageName" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "imageType" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "genres" ALTER COLUMN "name" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(50);
