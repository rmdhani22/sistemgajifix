import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const upahList = await prisma.upah.findMany();
    return NextResponse.json(upahList);
  } catch (error) {
    console.error('Error fetching upah:', error);
    return NextResponse.json({ error: 'Gagal mengambil data upah' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { harga_upah } = await request.json();

    // Validate input
    if (harga_upah === undefined) {
      return NextResponse.json({ error: 'Field harga_upah tidak boleh kosong' }, { status: 400 });
    }

    const newUpah = await prisma.upah.create({
      data: {
        harga_upah,
      },
    });
    return NextResponse.json(newUpah);
  } catch (error) {
    console.error('Error creating upah:', error);
    return NextResponse.json({ error: 'Gagal menambahkan upah' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id_upah, harga_upah } = await request.json();

    const updatedUpah = await prisma.upah.update({
      where: { id_upah },
      data: {
        harga_upah,
      },
    });
    return NextResponse.json(updatedUpah);
  } catch (error) {
    console.error('Error updating upah:', error);
    return NextResponse.json({ error: 'Gagal memperbarui upah' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id_upah } = await request.json();
    await prisma.upah.delete({
      where: { id_upah },
    });
    return NextResponse.json({ message: 'Upah deleted successfully' });
  } catch (error) {
    console.error('Error deleting upah:', error);
    return NextResponse.json({ error: 'Gagal menghapus upah' }, { status: 500 });
  }
}