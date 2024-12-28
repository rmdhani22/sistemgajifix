import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    console.log('Received:', { username, password });

    if (!username || !password) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { username },
      data: { password },
    });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ message: 'Failed to update password' }, { status: 500 });
  }
}