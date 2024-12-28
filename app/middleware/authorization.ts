import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../lib/jwt'; // Sesuaikan path sesuai struktur proyek Anda

const SECRET_KEY = process.env.SECRET_KEY || 'your_default_secret_key'; // Gunakan env variable untuk secret key

export function middleware(request: NextRequest) {
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Ambil token dari header
    let userRole: string | null = null;

    // Verifikasi token
    if (token) {
        try {
            const decoded = verifyToken(token, SECRET_KEY); // Pastikan verifyToken menerima secret key
            userRole = decoded?.role; // Ambil role dari payload token
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
        }
    } else {
        return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 });
    }

    const { pathname } = request.nextUrl;

    // Aturan akses berdasarkan role
    const accessRules: Record<string, string[]> = {
        '/produksi-pabrik': ['ADMIN', 'OWNER'],
        '/produksi-harian': ['ADMIN', 'KEPALA_GUDANG'],
        '/data-karyawan': ['ADMIN', 'KEPALA_GUDANG'],
        '/gaji-karyawan': ['ADMIN', 'KEPALA_GUDANG'],
    };

    // Cek aturan akses
    for (const [route, roles] of Object.entries(accessRules)) {
        if (pathname.startsWith(route)) {
            if (!userRole || !roles.includes(userRole.toUpperCase())) {
                console.warn(`Akses ditolak untuk ${userRole} ke ${route}`);
                return NextResponse.json({ error: 'Access denied' }, { status: 403 });
            }
        }
    }

    return NextResponse.next(); // Izinkan akses jika sesuai aturan
}
