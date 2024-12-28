-- DropForeignKey
ALTER TABLE `gaji` DROP FOREIGN KEY `Gaji_upah_id_upah_fkey`;

-- DropIndex
DROP INDEX `Gaji_upah_id_upah_fkey` ON `gaji`;

-- AlterTable
ALTER TABLE `gaji` MODIFY `upah_id_upah` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Gaji` ADD CONSTRAINT `Gaji_upah_id_upah_fkey` FOREIGN KEY (`upah_id_upah`) REFERENCES `Upah`(`id_upah`) ON DELETE SET NULL ON UPDATE CASCADE;
