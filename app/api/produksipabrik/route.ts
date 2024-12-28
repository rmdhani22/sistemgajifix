import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET method to fetch all ProduksiPabrik
export async function GET(request: Request) {
  try {
    const produksipabrik = await prisma.produksiPabrik.findMany({
      include: {
        Pabrik: true, // Include related Pabrik data
        Barang: true, // Include related Barang data
      },
    });

    // Format the response to include nama_pabrik and jenis_bar
    const formattedProduksiPabrik = produksipabrik.map(item => ({
      id_pp: item.id_pp,
      target_pab: item.target_pab,
      tanggal: item.tanggal,
      ukuran_bar_pab: item.ukuran_bar_pab,
      nama_pabrik: item.Pabrik.nama_pabrik, // Ambil nama_pabrik
      jenis_bar: item.Barang.jenis_bar, // Ambil jenis_bar
    }));

    return NextResponse.json(formattedProduksiPabrik);
  } catch (error) {
    console.error('Error fetching produksi pabrik:', error);
    return NextResponse.json({ error: 'Gagal mengambil data produksi pabrik' }, { status: 500 });
  }
}

// POST method to create a new ProduksiPabrik
export async function POST(request: Request) {
  try {
    const { target_pab, tanggal, ukuran_bar_pab, pabrik_id_pabrik, barang_id_bar } = await request.json();
    
    // Validasi input
    if (!target_pab || !tanggal || !ukuran_bar_pab || !pabrik_id_pabrik || !barang_id_bar) {
      return NextResponse.json({ error: 'Field yang diperlukan tidak boleh kosong' }, { status: 400 });
    }

    const newProduksiPabrik = await prisma.produksiPabrik.create({
      data: {
        target_pab,
        tanggal: new Date(tanggal), // Pastikan tanggal dalam format Date
        ukuran_bar_pab,
        pabrik_id_pabrik,
        barang_id_bar,
      },
    });

    // Ambil data terkait untuk mengembalikan nama_pabrik dan jenis_bar
    const createdProduksiPabrik = await prisma.produksiPabrik.findUnique({
      where: { id_pp: newProduksiPabrik.id_pp },
      include: {
        Pabrik: true,
        Barang: true,
      },
    });

    // Pastikan createdProduksiPabrik tidak null sebelum mengakses propertinya
    if (!createdProduksiPabrik) {
      return NextResponse.json({ error: 'Produksi pabrik tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      id_pp: createdProduksiPabrik.id_pp,
      target_pab: createdProduksiPabrik.target_pab,
      tanggal: createdProduksiPabrik.tanggal,
      ukuran_bar_pab: createdProduksiPabrik.ukuran_bar_pab,
      nama_pabrik: createdProduksiPabrik.Pabrik.nama_pabrik,
      jenis_bar: createdProduksiPabrik.Barang.jenis_bar,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating produksi pabrik:', error);
    return NextResponse.json({ error: 'Gagal menambahkan data produksi pabrik' }, { status: 500 });
  }
}

// PUT method to update an existing ProduksiPabrik
export async function PUT(request: Request) {
  try {
    const { id_pp, target_pab, tanggal, ukuran_bar_pab, pabrik_id_pabrik, barang_id_bar } = await request.json();
    
    const updatedProduksiPabrik = await prisma.produksiPabrik.update({
      where: { id_pp },
      data: {
        target_pab,
        tanggal: new Date(tanggal), // Pastikan tanggal dalam format Date
        ukuran_bar_pab,
        pabrik_id_pabrik,
        barang_id_bar,
      },
    });

    // Ambil data terkait untuk mengembalikan nama_pabrik dan jenis_bar
    const updatedData = await prisma.produksiPabrik.findUnique({
      where: { id_pp },
      include: {
        Pabrik: true,
        Barang: true,
      },
    });

    // Pastikan updatedData tidak null sebelum mengakses propertinya
    if (!updatedData) {
      return NextResponse.json({ error: 'Produksi pabrik tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({
      id_pp: updatedData.id_pp,
      target_pab: updatedData.target_pab,
      tanggal: updatedData.tanggal,
      ukuran_bar_pab: updatedData.ukuran_bar_pab,
      nama_pabrik: updatedData.Pabrik.nama_pabrik,
      jenis_bar: updatedData.Barang.jenis_bar,
    });
  } catch (error) {
    console.error('Error updating produksi pabrik:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data produksi pabrik' }, { status: 500 });
  }
}

// DELETE method to delete a ProduksiPabrik
export async function DELETE(request: Request) {
  try {
    const { id_pp } = await request.json();
    await prisma.produksiPabrik.delete({
      where: { id_pp },
    });
    return NextResponse.json({ message: 'Produksi pabrik deleted successfully' });
  } catch (error) {
    console.error('Error deleting produksi pabrik:', error);
    return NextResponse.json({ error: 'Gagal menghapus data produksi pabrik' }, { status: 500 });
  }
}
