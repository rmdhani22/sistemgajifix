/*
  Warnings:

  - Added the required column `hargaupah` to the `Gaji` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gaji` ADD COLUMN `hargaupah` DOUBLE NOT NULL;
