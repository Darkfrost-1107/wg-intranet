/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('SUPERADMIN', 'MONITOR', 'USER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "userType" "UserRoles"[] DEFAULT ARRAY['USER']::"UserRoles"[],
ADD COLUMN     "username" TEXT;
