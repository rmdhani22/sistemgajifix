'use client';

import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [totalKaryawan, setTotalKaryawan] = useState<number>(0);
    const [totalProduksiPabrik, setTotalProduksiPabrik] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwt.decode(token);
                setUsername(decoded.username);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        const fetchData = async () => {
            const response = await fetch('/api/dashboard');
            const data = await response.json();
            setTotalKaryawan(data.totalKaryawan);
            setTotalProduksiPabrik(data.totalProduksiPabrik);
        };

        fetchData();
    }, []);

    // Prepare data for the chart
    const chartData = {
        labels: totalProduksiPabrik.map(p => p.nama_pabrik),
        datasets: [
            {
                label: 'Produksi per Pabrik',
                data: totalProduksiPabrik.map(p => p.total_produksi),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="dashboard" style={{ padding: '20px'}}>
            <h1>Dashboard</h1>
            {username ? (
                <h2 style={{ color: '#543310', textAlign: 'center', backgroundColor: '#f8f4e1', borderRadius: '8px', marginBottom: '20px' }}>Selamat Datang, {username}!, Semoga Anda Memiliki Hari Yang Baik</h2>
            ) : (
                <p>Please log in to see your dashboard.</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ flex: 1, marginRight: '10px', padding: '20px', backgroundColor: '#f8f4e1', borderRadius: '8px' , color: '#543310'}}>
                    <h3>Total Karyawan</h3>
                    <p>{totalKaryawan}</p> {/* Display total karyawan */}
                </div>
                {totalProduksiPabrik.map((pabrik) => (
                    <div key={pabrik.id_pabrik} style={{ flex: 1, marginRight: '10px', padding: '20px', backgroundColor: '#f8f4e1', borderRadius: '8px' }}>
                        <h3>Produksi {pabrik.nama_pabrik}</h3>
                        <p>{pabrik.total_produksi}</p> {/* Display total production */}
                    </div>
                ))}
            </div>

            
            <Bar data={chartData} options={{ responsive: true }} />
        </div>
    );
};

export default DashboardPage;
