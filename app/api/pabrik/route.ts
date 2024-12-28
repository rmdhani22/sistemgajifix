import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const Pabrik = await prisma.pabrik.findMany();
    return NextResponse.json(Pabrik);
  } catch (error) {
    console.error('Error fetching pabrik:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pabrik' }, { status: 500 });
  }
}
