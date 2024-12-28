import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const produksiHarian = await prisma.produksiHarian.findMany({
      include: {
        Karyawan: true,
        Barang: true,
        Pabrik: true,
      },
    });
    return NextResponse.json(produksiHarian);
  } catch (error) {
    console.error('Error fetching produksi harian:', error);
    return NextResponse.json({ error: 'Gagal mengambil data produksi harian' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validasi data
    if (!data || !data.hasil_prod || !data.tanggal || !data.ukuran_bar_har || !data.karyawan_id_kar || !data.barang_id_bar || !data.pabrik_id) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 });
    }

    const newProduksi = await prisma.produksiHarian.create({
      data: {
        hasil_prod: parseFloat(data.hasil_prod), // Pastikan ini adalah float
        tanggal: new Date(data.tanggal), // Pastikan ini adalah Date
        ukuran_bar_har: data.ukuran_bar_har, // Pastikan ini adalah string
        karyawan_id_kar: parseInt(data.karyawan_id_kar), // Pastikan ini adalah integer
        barang_id_bar: parseInt(data.barang_id_bar), // Pastikan ini adalah integer
        pabrik_id: parseInt(data.pabrik_id), // Pastikan ini adalah integer
      },
    });

    return NextResponse.json(newProduksi, { status: 201 }); // Mengembalikan status 201 untuk data baru
  } catch (error) {
    console.error('Error creating produksi harian:', error);
    return NextResponse.json({ error: 'Gagal memproses data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id_ph, hasil_prod, tanggal, ukuran_bar_har, karyawan_id_kar, barang_id_bar, pabrik_id } = await request.json();
  
  try {
    // Validasi data
    if (!id_ph || !hasil_prod || !tanggal || !ukuran_bar_har || !karyawan_id_kar || !barang_id_bar || !pabrik_id) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 });
    }

    const updatedProduksi = await prisma.produksiHarian.update({
      where: { id_ph },
      data: {
        hasil_prod: parseFloat(hasil_prod), // Pastikan ini adalah float
        tanggal: new Date(tanggal), // Pastikan ini adalah Date
        ukuran_bar_har, // Pastikan ini adalah string
        karyawan_id_kar: parseInt(karyawan_id_kar), // Pastikan ini adalah integer
        barang_id_bar: parseInt(barang_id_bar), // Pastikan ini adalah integer
        pabrik_id: parseInt(pabrik_id), // Pastikan ini adalah integer
      },
    });
    
    return NextResponse.json(updatedProduksi);
  } catch (error) {
    console.error('Error updating produksi harian:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data produksi harian' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const data = await request.json();
  try {
    await prisma.produksiHarian.delete({
      where: { id_ph: data.id_ph },
    });
    return NextResponse.json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting produksi harian:', error);
    return NextResponse.json({ error: 'Gagal menghapus data produksi harian' }, { status: 500 });
  }
}
