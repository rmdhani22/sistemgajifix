-- CreateTable
CREATE TABLE `Barang` (
    `id_bar` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_bar` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id_bar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gaji` (
    `id_gaji` INTEGER NOT NULL AUTO_INCREMENT,
    `total_upah` DOUBLE NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `upah_id_upah` INTEGER NOT NULL,
    `produksi_harian_id_ph` INTEGER NOT NULL,

    PRIMARY KEY (`id_gaji`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Karyawan` (
    `id_karyawan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_karyawan` VARCHAR(50) NOT NULL,
    `alamat_karyawan` VARCHAR(15) NOT NULL,
    `pabrik_id_pabrik` INTEGER NOT NULL,

    PRIMARY KEY (`id_karyawan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Laporan` (
    `id_laporan` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_laporan` VARCHAR(15) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `produksi_pabrik_id_pp` INTEGER NOT NULL,
    `produksi_harian_id_ph` INTEGER NOT NULL,

    PRIMARY KEY (`id_laporan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pabrik` (
    `id_pabrik` INTEGER NOT NULL AUTO_INCREMENT,
    `nama-pabrik` VARCHAR(10) NOT NULL,
    `alamat_pabrik` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id_pabrik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProduksiHarian` (
    `id_ph` INTEGER NOT NULL AUTO_INCREMENT,
    `hasil_prod` DOUBLE NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `ukuran_bar-har` DOUBLE NOT NULL,
    `karyawan_id_kar` INTEGER NOT NULL,
    `barang_id_bar` INTEGER NOT NULL,
    `pabrik_id` INTEGER NOT NULL,

    PRIMARY KEY (`id_ph`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProduksiPabrik` (
    `id_pp` INTEGER NOT NULL AUTO_INCREMENT,
    `target_pab` DOUBLE NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `ukuran_bar-pab` VARCHAR(10) NOT NULL,
    `pabrik_id_pabrik` INTEGER NOT NULL,
    `barang_id_bar` INTEGER NOT NULL,

    PRIMARY KEY (`id_pp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Upah` (
    `id_upah` INTEGER NOT NULL AUTO_INCREMENT,
    `harga_upah` DOUBLE NOT NULL,

    PRIMARY KEY (`id_upah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Gaji` ADD CONSTRAINT `Gaji_produksi_harian_id_ph_fkey` FOREIGN KEY (`produksi_harian_id_ph`) REFERENCES `ProduksiHarian`(`id_ph`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gaji` ADD CONSTRAINT `Gaji_upah_id_upah_fkey` FOREIGN KEY (`upah_id_upah`) REFERENCES `Upah`(`id_upah`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Karyawan` ADD CONSTRAINT `Karyawan_pabrik_id_pabrik_fkey` FOREIGN KEY (`pabrik_id_pabrik`) REFERENCES `Pabrik`(`id_pabrik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_produksi_pabrik_id_pp_fkey` FOREIGN KEY (`produksi_pabrik_id_pp`) REFERENCES `ProduksiPabrik`(`id_pp`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_produksi_harian_id_ph_fkey` FOREIGN KEY (`produksi_harian_id_ph`) REFERENCES `ProduksiHarian`(`id_ph`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProduksiHarian` ADD CONSTRAINT `ProduksiHarian_karyawan_id_kar_fkey` FOREIGN KEY (`karyawan_id_kar`) REFERENCES `Karyawan`(`id_karyawan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProduksiHarian` ADD CONSTRAINT `ProduksiHarian_barang_id_bar_fkey` FOREIGN KEY (`barang_id_bar`) REFERENCES `Barang`(`id_bar`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProduksiHarian` ADD CONSTRAINT `ProduksiHarian_pabrik_id_fkey` FOREIGN KEY (`pabrik_id`) REFERENCES `Pabrik`(`id_pabrik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProduksiPabrik` ADD CONSTRAINT `ProduksiPabrik_pabrik_id_pabrik_fkey` FOREIGN KEY (`pabrik_id_pabrik`) REFERENCES `Pabrik`(`id_pabrik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProduksiPabrik` ADD CONSTRAINT `ProduksiPabrik_barang_id_bar_fkey` FOREIGN KEY (`barang_id_bar`) REFERENCES `Barang`(`id_bar`) ON DELETE RESTRICT ON UPDATE CASCADE;
