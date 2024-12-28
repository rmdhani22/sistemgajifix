import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mendapatkan semua data gaji karyawan
export async function GET() {
  try {
    const gajiList = await prisma.gaji.findMany({
      include: {
        ProduksiHarian: {
          include: {
            Karyawan: true,
            Barang: true,
          },
        },
        Upah: true,
      },
    });

    const gajiKaryawan = gajiList.map((gaji) => {
      const produksi = gaji.ProduksiHarian;
      return {
        id_gaji: gaji.id_gaji,
        tanggal: gaji.tanggal.toISOString(),
        total_upah: gaji.total_upah,
        produksi_harian_id_ph: produksi.id_ph,
        karyawan: produksi.Karyawan.nama_karyawan,
        barang: produksi.Barang.jenis_bar,
        ukuran_barang: produksi.ukuran_bar_har,
        upah_id_upah: gaji.upah_id_upah,
        hasil_prod: produksi.hasil_prod,
        harga_upah: gaji.Upah.harga_upah,
      };
    });

    return NextResponse.json(gajiKaryawan);
  } catch (error) {
    console.error('Error fetching gaji karyawan:', error);
    return NextResponse.json({ error: 'Gagal mengambil data gaji karyawan' }, { status: 500 });
  }
}

// Menambahkan data gaji karyawan baru
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Data yang diterima:', data);

    // Validasi data yang diterima
    if (!data.tanggal || !data.produksi_harian_id_ph || !data.upah_id_upah) {
      throw new Error('Missing required fields');
    }

    const produksiHarian = await prisma.produksiHarian.findUnique({
      where: { id_ph: parseInt(data.produksi_harian_id_ph, 10) },
    });

    const upah = await prisma.upah.findUnique({
      where: { id_upah: parseInt(data.upah_id_upah, 10) },
    });

    if (!produksiHarian || !upah) {
      throw new Error('Produksi Harian atau Upah tidak ditemukan');
    }

    const hasilProd = produksiHarian.hasil_prod;
    const hargaUpah = upah.harga_upah;

    const total_upah = hasilProd * hargaUpah;

    const newGaji = await prisma.gaji.create({
      data: {
        total_upah: total_upah,
        tanggal: new Date(data.tanggal),
        produksi_harian_id_ph: parseInt(data.produksi_harian_id_ph, 10),
        upah_id_upah: parseInt(data.upah_id_upah), // Ensure this is correct
        hargaupah: hargaUpah, // This should now be recognized
      },
    });

    return NextResponse.json(newGaji, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message || 'Unknown error occurred';
    console.error('Error adding gaji:', errorMessage);
    return NextResponse.json({ error: 'Gagal menambahkan gaji', details: errorMessage }, { status: 500 });
  }
}

// Memperbarui data gaji karyawan
export async function PUT(request: Request) {
  const { id_gaji, tanggal, total_upah } = await request.json();
  try {
    const updatedGaji = await prisma.gaji.update({
      where: { id_gaji },
      data: {
        tanggal: new Date(tanggal), 
        total_upah,
      },
    });
    return NextResponse.json(updatedGaji);
  } catch (error) {
    console.error('Error updating gaji:', error);
    return NextResponse.json({ error: 'Gagal mengupdate gaji' }, { status: 500 });
  }
}

// Menghapus data gaji karyawan
export async function DELETE(request: Request) {
  const { id_gaji } = await request.json();
  try {
    await prisma.gaji.delete({
      where: { id_gaji },
    });
    return NextResponse.json({ message: 'Gaji deleted successfully' });
  } catch (error) {
    console.error('Error deleting gaji:', error);
    return NextResponse.json({ error: 'Gagal menghapus gaji' }, { status: 500 });
  }
}
