import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Fetch total karyawan
    const totalKaryawan = await prisma.karyawan.count();

    // Fetch produksi pabrik
    const produksiPabrik = await prisma.pabrik.findMany({
      include: {
        ProduksiPabrik: true, // Include daily production data
      },
    });

    // Calculate total production for each factory
    const totalProduksiPabrik = produksiPabrik.map(pabrik => ({
      id_pabrik: pabrik.id_pabrik,
      nama_pabrik: pabrik.nama_pabrik,
      total_produksi: pabrik.ProduksiPabrik.reduce((total, produksi) => total + produksi.target_pab, 0), // Sum up daily production
    }));

    return NextResponse.json({ totalKaryawan, totalProduksiPabrik });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Gagal mengambil data dashboard' }, { status: 500 });
  }
}
