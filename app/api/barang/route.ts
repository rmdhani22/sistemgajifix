import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const Barang = await prisma.barang.findMany();
    return NextResponse.json(Barang);
  } catch (error) {
    console.error('Error fetching barang:', error);
    return NextResponse.json({ error: 'Gagal mengambil data barang' }, { status: 500 });
  }
}
