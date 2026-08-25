/*
  Warnings:

  - You are about to drop the column `otpHash` on the `Verification` table. All the data in the column will be lost.
  - Added the required column `hashedOtp` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "otpHash",
ADD COLUMN     "hashedOtp" TEXT NOT NULL;
