import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined; // Mendeklarasikan variabel global prisma
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

// Pengujian Koneksi
prisma.$connect()
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });

export default prisma;
