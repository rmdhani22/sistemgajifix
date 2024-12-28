import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = 'afabc81c193dd5136dc0b1d09a71b2773ba738948ec8da5137db72534c551dc1c085ffd0ca3b17ba6ee7d97ff2ffcc662b8ca830ff5bdfb8567e8f0349872009'; // Ganti dengan secret key yang lebih aman

// Fungsi untuk memverifikasi token
const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verifikasi token
    return decoded;
  } catch (error) {
    return null;
  }
};

// Route untuk login
export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Temukan user di database
  const user = await prisma.user.findUnique({
    where: { username },
  });

  // Cek apakah user ada dan password cocok
  if (user && user.password === password) {
    const token = jwt.sign(
      { username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    return NextResponse.json({ token }, { status: 200 });
  }

  // Kembalikan error jika kredensial salah
  return NextResponse.json({ message: 'Username atau password salah' }, { status: 401 });
}

// Route yang dilindungi dengan token
export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Mengambil token dari header Authorization

  if (!token) {
    return NextResponse.json({ message: 'Token tidak ditemukan' }, { status: 401 });
  }

  const decoded = verifyToken(token); // Verifikasi token

  if (!decoded) {
    return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 });
  }

  // Jika token valid, lanjutkan ke route berikutnya
  return NextResponse.json({ message: 'Access granted', user: decoded }, { status: 200 });
}
