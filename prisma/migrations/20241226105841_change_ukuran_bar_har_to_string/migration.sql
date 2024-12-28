/*
  Warnings:

  - You are about to alter the column `ukuran_bar-har` on the `produksiharian` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `produksiharian` MODIFY `ukuran_bar-har` VARCHAR(191) NOT NULL;
