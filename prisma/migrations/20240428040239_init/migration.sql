/*
  Warnings:

  - The primary key for the `user_with_group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupId` on the `user_with_group` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `group_id` to the `user_with_group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_with_group" DROP CONSTRAINT "user_with_group_groupId_fkey";

-- AlterTable
ALTER TABLE "user_with_group" DROP CONSTRAINT "user_with_group_pkey",
DROP COLUMN "groupId",
ADD COLUMN     "group_id" INTEGER NOT NULL,
ADD CONSTRAINT "user_with_group_pkey" PRIMARY KEY ("user_id", "group_id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "user_with_group" ADD CONSTRAINT "user_with_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
