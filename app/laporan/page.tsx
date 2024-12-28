"use client";

import React, { useState, useEffect } from "react";

interface ProduksiPabrik {
  id_pp: number;
  tanggal: string; // or Date, depending on your data structure
  nama_pabrik: string;
  jenis_bar: string;
  ukuran_bar_pab: string;
  target_pab: number;
  // Add other properties as needed
}

interface Gaji {
  id_gaji: number;
  tanggal: string; // or Date, depending on your data structure
  total_upah: number; // Add other properties as needed
  harga_upah: number; // Add other properties as needed
  hasil_prod: number; // Add other properties as needed
  produksi_harian_id_ph: number; // Add other properties as needed
  karyawan: string; // Add other properties as needed
  barang: string; // Add other properties as needed
  ukuran_barang: string; // Add other properties as needed
}

export default function LaporanPage() {
  const [jenisLaporan, setJenisLaporan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [showLaporan, setShowLaporan] = useState(false);
  const [produksiData, setProduksiData] = useState<ProduksiPabrik[]>([]);
  const [gajiData, setGajiData] = useState<Gaji[]>([]);

  useEffect(() => {
    const fetchProduksi = async () => {
      const response = await fetch('/api/produksipabrik');
      const data = await response.json();
      console.log(data);
      setProduksiData(data);
    };

    const fetchGaji = async () => {
      const response = await fetch('/api/gajikaryawan'); // Ganti dengan endpoint yang sesuai
      const data = await response.json();
      setGajiData(data);
    };

    fetchProduksi();
    fetchGaji();
  }, []);

  const handleTampilkan = () => {
    setShowLaporan(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const produksiFilter = produksiData.filter(item => {
    return new Date(item.tanggal).toLocaleDateString() === new Date(tanggal).toLocaleDateString();
  });

  return (
    <div className="data-karyawan-container">
      <h1>Laporan Produksi & Gaji</h1>

      {/* Jenis Laporan Dropdown */}
      <div className="menu">
        <label htmlFor="jenisLaporan">Jenis Laporan:</label>
        <select
          id="jenisLaporan"
          value={jenisLaporan}
          onChange={(e) => setJenisLaporan(e.target.value)}
          className="dropdown"
        >
          <option value="">Pilih Jenis Laporan</option>
          <option value="produksi">Laporan Produksi</option>
          <option value="gaji">Laporan Gaji</option>
        </select>
      </div>

      {/* Tanggal Picker */}
      <div className="menu">
        <label htmlFor="tanggal">Tanggal:</label>
        <input
          type="date"
          id="tanggal"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Tampilkan Button */}
      <div className="menu">
        <button onClick={handleTampilkan} className="tampilkan-button">
          Tampilkan
        </button>
      </div>

      {/* Displaying the selected report based on dropdown and date */}
      {showLaporan && jenisLaporan && tanggal && (
        <div className="laporan-content">
          <h1 style={{textAlign: "center", fontSize: "20px"}}>PT ALAM RIAU BERTUAH</h1>
          <h2  style={{ fontSize: "15px"}}>LAPORAN {jenisLaporan === "produksi" ? "PRODUKSI" : "GAJI"}</h2>
          <p  style={{ fontSize: "15px"}}>Tanggal dibuat: {new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' } )}</p>
          
          {/* Tabel */}
          <table className="data-table" style={{marginTop: "100px", textAlign: "center", fontSize: "15px"}}>
            <thead>
              <tr>
                {jenisLaporan === "produksi" ? (
                  <>
                    <th>No</th>
                    <th>Tanggal</th>
                    <th>Nama Pabrik</th>
                    <th>Jenis Barang</th>
                    <th>Ukuran Barang</th>
                    <th>Target Produksi</th>
                    
                  </>
                ) : (
                  <>
                    <th>No</th>
                    <th>Tanggal Gajian</th>
                    <th>Total Upah</th>
                    <th>Harga Upah</th>
                    <th>Hasil Produksi</th>
                    <th>ID Produksi Harian</th>
                    <th>Nama Karyawan</th>
                    <th>Nama Barang</th>
                    <th>Ukuran Barang</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {jenisLaporan === "produksi" ? (
                
                produksiData.map((item:ProduksiPabrik) => (
                  <tr key={item.id_pp}>
                    <td>{item.id_pp}</td>
                    <td>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' } )}</td>
                    <td>{item.nama_pabrik}</td>
                    <td>{item.jenis_bar}</td>
                    <td>{item.ukuran_bar_pab}</td>
                    <td>{item.target_pab}</td>
                  </tr>
                ))
              ): (
                gajiData.map((gaji, index) => (
                  <tr key={gaji.id_gaji}>
                    <td>{index + 1}</td>
                    <td>{new Date(gaji.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' } )}</td>
                    <td>{gaji.total_upah}</td>
                    <td>{gaji.harga_upah}</td>
                    <td>{gaji.hasil_prod}</td>
                    <td>{gaji.produksi_harian_id_ph}</td>
                    <td>{gaji.karyawan}</td>
                    <td>{gaji.barang}</td>
                    <td>{gaji.ukuran_barang}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Print Button */}
          <div className="print-button-container">
            <button onClick={handlePrint} className="print-button">
              Cetak
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
