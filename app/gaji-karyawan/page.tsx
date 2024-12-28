"use client";

import React, { useState, useEffect } from "react";

interface GajiKaryawan {
  id_gaji?: number;
  tanggal: string;
  total_upah: number;
  produksi_harian_id_ph: number;
  karyawan: string;
  barang: string;
  ukuran_barang: number;
  harga_upah: number;
  hasil_prod: number;
  upah_id_upah: number;
}

interface ProduksiHarian {
  id_ph: number;
  Karyawan: { nama_karyawan: string };
  Barang: { jenis_bar: string };
  Pabrik: { nama_pabrik: string } | null;
  ukuran_bar_har: number;
  hasil_prod: number;
}

interface Upah {
  id_upah: number;
  harga_upah: number;
}

export default function GajiKaryawan() {
  const [gajiKaryawan, setGajiKaryawan] = useState<GajiKaryawan[]>([]);
  const [produksiHarianList, setProduksiHarianList] = useState<ProduksiHarian[]>([]);
  const [upahList, setUpahList] = useState<Upah[]>([]);
  const [formData, setFormData] = useState<GajiKaryawan>({
    tanggal: "",
    total_upah: 0,
    produksi_harian_id_ph: 0,
    karyawan: "",
    barang: "",
    ukuran_barang: 0,
    harga_upah: 0,
    hasil_prod: 0,
    upah_id_upah: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchGajiKaryawan = async () => {
    const response = await fetch('/api/gajikaryawan');
    const data = await response.json();
    setGajiKaryawan(data);
  };

  const fetchProduksiHarian = async () => {
    const response = await fetch('/api/produksiharian');
    const data = await response.json();
    setProduksiHarianList(data);
  };

  const fetchUpah = async () => {
    const response = await fetch('/api/upah');
    const data = await response.json();
    setUpahList(data);
  };

  useEffect(() => {
    fetchGajiKaryawan();
    fetchProduksiHarian();
    fetchUpah();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "harga_upah") {
      const selectedUpah = upahList.find(u => u.harga_upah === parseFloat(value));
      if (selectedUpah) {
        setFormData(prev => ({
          ...prev,
          harga_upah: selectedUpah.harga_upah,
          upah_id_upah: selectedUpah.id_upah,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Jika memilih produksi harian, ambil hasil produksi
    if (name === "produksi_harian_id_ph") {
      const selectedProduksi = produksiHarianList.find(p => p.id_ph === parseInt(value));
      if (selectedProduksi) {
        setFormData(prev => ({
          ...prev,
          hasil_prod: selectedProduksi.hasil_prod,
          karyawan: selectedProduksi.Karyawan.nama_karyawan,
          barang: selectedProduksi.Barang.jenis_bar,
          ukuran_barang: selectedProduksi.ukuran_bar_har,
        }));
      }
    }
  };

  const handleAddGaji = async () => {
    const hasilProd = parseInt(formData.hasil_prod.toString(), 10);
    const hargaUpah = parseFloat(formData.harga_upah.toString());

    if (hasilProd <= 0 || hargaUpah <= 0) {
      console.error('Hasil produksi dan harga upah harus lebih dari 0');
      return;
    }

    const totalUpah = hasilProd * hargaUpah;

    const response = await fetch('/api/gajikaryawan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tanggal: formData.tanggal,
        produksi_harian_id_ph: parseInt(formData.produksi_harian_id_ph.toString(), 10),
        upah_id_upah: formData.upah_id_upah,
        total_upah: totalUpah,
        hasil_prod: hasilProd,
      }),
    });

    if (response.ok) {
      await fetchGajiKaryawan();
      setFormData({
        tanggal: "",
        total_upah: 0,
        produksi_harian_id_ph: 0,
        karyawan: "",
        barang: "",
        ukuran_barang: 0,
        harga_upah: 0,
        hasil_prod: 0,
        upah_id_upah: 0,
      });
    } else {
      console.error('Gagal menambahkan gaji');
    }
  };

  const handleEditGaji = (gaji: GajiKaryawan) => {
    setFormData({
      ...gaji,
      tanggal: new Date(gaji.tanggal).toISOString().split('T')[0],
    });
    setIsEditing(true);
  };

  const handleDeleteGaji = async (id_gaji: number) => {
    const response = await fetch('/api/gajikaryawan', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_gaji }),
    });

    if (response.ok) {
      await fetchGajiKaryawan();
    } else {
      console.error('Gagal menghapus gaji');
    }
  };

  const handleUpdateGaji = async () => {
    const response = await fetch(`/api/gajikaryawan`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_gaji: formData.id_gaji,
        tanggal: formData.tanggal,
        total_upah: formData.total_upah,
      }),
    });

    if (response.ok) {
      await fetchGajiKaryawan();
      setFormData({
        tanggal: "",
        total_upah: 0,
        produksi_harian_id_ph: 0,
        karyawan: "",
        barang: "",
        ukuran_barang: 0,
        harga_upah: 0,
        hasil_prod: 0,
        upah_id_upah: 0,
      });
      setIsEditing(false);
    } else {
      console.error('Gagal memperbarui gaji');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Data Gaji Karyawan</h1>
      <button
        onClick={() => setIsFormVisible(true)}
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#543310', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          <i className="fas fa-plus"></i> Gaji Karyawan
          </button>

      {isFormVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            width: '400px',
          }}>
            <h2>{isEditing ? "Edit Gaji" : "Tambah Gaji"}</h2>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              required
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <select
              name="produksi_harian_id_ph"
              value={formData.produksi_harian_id_ph}
              onChange={handleInputChange}
              required
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Pilih Produksi Harian</option>
              {produksiHarianList.map((produksi) => (
                <option key={produksi.id_ph} value={produksi.id_ph}>
                  {produksi.Pabrik ? `${produksi.Pabrik.nama_pabrik} - ${produksi.Karyawan.nama_karyawan} - ${produksi.Barang.jenis_bar} - ${produksi.ukuran_bar_har} - ${produksi.hasil_prod}` : 'Data tidak tersedia'}
                </option>
              ))}
            </select>
            <select
              name="harga_upah"
              value={formData.harga_upah}
              onChange={handleInputChange}
              required
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Pilih Harga Upah</option>
              {upahList.map((upah) => (
                <option key={upah.id_upah} value={upah.harga_upah}>
                  {upah.harga_upah}
                </option>
              ))}
            </select>
            <button
              onClick={isEditing ? handleUpdateGaji : handleAddGaji}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}
            >
              {isEditing ? "Update Gaji" : "Tambah Gaji"}
            </button>
            <button
              onClick={() => setIsFormVisible(false)}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px' }}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#543310', color: '#fff' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Tanggal Gajian</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Total Upah</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Harga Upah</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Hasil Produksi</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID Produksi Harian</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nama Karyawan</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nama Barang</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Ukuran Barang</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {gajiKaryawan.map((gaji, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
              <td style={{ padding: '10px', textAlign: 'left' }}>{new Date(gaji.tanggal).toLocaleDateString()}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{gaji.total_upah}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{gaji.harga_upah}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{gaji.hasil_prod}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{gaji.produksi_harian_id_ph}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{gaji.karyawan}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{gaji.barang}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{gaji.ukuran_barang}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <button onClick={() => handleEditGaji(gaji)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
                  ✏️
                </button>
                <button onClick={() => handleDeleteGaji(gaji.id_gaji!)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
