import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const karyawan = await prisma.karyawan.findMany({
      include: {
        Pabrik: true,
      },
    });
    return NextResponse.json(karyawan);
  } catch (error) {
    console.error('Error fetching karyawan:', error);
    return NextResponse.json({ error: 'Gagal mengambil data karyawan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nama_karyawan, alamat_karyawan, pabrik_id_pabrik } = await request.json();
    
    // Validasi input
    if (!nama_karyawan || !alamat_karyawan || !pabrik_id_pabrik) {
      return NextResponse.json({ error: 'Field yang diperlukan tidak boleh kosong' }, { status: 400 });
    }
    
    const newKaryawan = await prisma.karyawan.create({
      data: {
        nama_karyawan,
        alamat_karyawan,
        Pabrik: {
          connect: { id_pabrik: Number(pabrik_id_pabrik) },
        },
      },
    });
    return NextResponse.json(newKaryawan);
  } catch (error) {
    console.error('Error creating karyawan:', error);
    return NextResponse.json({ error: 'Gagal menambahkan karyawan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id_karyawan, nama_karyawan, alamat_karyawan, pabrik_id_pabrik } = await request.json();
    
    const updatedKaryawan = await prisma.karyawan.update({
      where: { id_karyawan },
      data: {
        nama_karyawan,
        alamat_karyawan,
        Pabrik: {
          connect: { id_pabrik: Number(pabrik_id_pabrik) },
        },
      },
    });
    return NextResponse.json(updatedKaryawan);
  } catch (error) {
    console.error('Error updating karyawan:', error);
    return NextResponse.json({ error: 'Gagal memperbarui karyawan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id_karyawan } = await request.json();
    await prisma.karyawan.delete({
      where: { id_karyawan },
    });
    return NextResponse.json({ message: 'Karyawan deleted successfully' });
  } catch (error) {
    console.error('Error deleting karyawan:', error);
    return NextResponse.json({ error: 'Gagal menghapus karyawan' }, { status: 500 });
  }
}
