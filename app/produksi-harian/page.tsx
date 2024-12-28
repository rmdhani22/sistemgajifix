"use client";

import React, { useState, useEffect } from "react";
import { Karyawan, Pabrik, Barang, ProduksiHarian } from "@prisma/client";

export default function ProduksiHarianPage() {
  const [produksiHarian, setProduksiHarian] = useState<ProduksiHarian[]>([]);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [pabrikList, setPabrikList] = useState<Pabrik[]>([]);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [formData, setFormData] = useState({
    hasil_prod: "",
    tanggal: "",
    ukuran_bar_har: "",
    karyawan_id_kar: "",
    barang_id_bar: "",
    pabrik_id: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchProduksiHarian = async () => {
      const response = await fetch('/api/produksiharian');
      const data = await response.json();
      setProduksiHarian(data);
    };

    const fetchKaryawan = async () => {
      const response = await fetch('/api/datakaryawan');
      const data = await response.json();
      setKaryawanList(data);
    };

    const fetchPabrik = async () => {
      const response = await fetch('/api/pabrik');
      const data = await response.json();
      setPabrikList(data);
    };

    const fetchBarang = async () => {
      const response = await fetch('/api/barang');
      const data = await response.json();
      setBarangList(data);
    };

    fetchProduksiHarian();
    fetchKaryawan();
    fetchPabrik();
    fetchBarang();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    if (!formData.hasil_prod || !formData.tanggal || !formData.ukuran_bar_har || !formData.karyawan_id_kar || !formData.barang_id_bar || !formData.pabrik_id) {
      alert("Semua field harus diisi!");
      return;
    }

    const newProduksi = {
      hasil_prod: parseFloat(formData.hasil_prod),
      tanggal: new Date(formData.tanggal),
      ukuran_bar_har: formData.ukuran_bar_har,
      karyawan_id_kar: parseInt(formData.karyawan_id_kar),
      barang_id_bar: parseInt(formData.barang_id_bar),
      pabrik_id: parseInt(formData.pabrik_id),
    };

    try {
      const response = await fetch('/api/produksiharian', {
        method: editIndex !== null ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_ph: editIndex !== null ? produksiHarian[editIndex].id_ph : undefined,
          ...newProduksi,
        }),
      });

      const savedProduksi = await response.json();
      if (editIndex !== null) {
        const updatedProduksiHarian = [...produksiHarian];
        updatedProduksiHarian[editIndex] = savedProduksi;
        setProduksiHarian(updatedProduksiHarian);
      } else {
        setProduksiHarian([...produksiHarian, savedProduksi]);
      }

      setIsFormVisible(false);
      setFormData({
        hasil_prod: "",
        tanggal: "",
        ukuran_bar_har: "",
        karyawan_id_kar: "",
        barang_id_bar: "",
        pabrik_id: "",
      });
      setEditIndex(null);
    } catch (error) {
      console.error("Error saving produksi harian:", error);
    }
  };

  const handleEdit = (index: number) => {
    const item = produksiHarian[index];
    setFormData({
      hasil_prod: item.hasil_prod.toString(),
      tanggal: new Date(item.tanggal).toISOString().split('T')[0],
      ukuran_bar_har: item.ukuran_bar_har.toString(),
      karyawan_id_kar: item.karyawan_id_kar.toString(),
      barang_id_bar: item.barang_id_bar.toString(),
      pabrik_id: item.pabrik_id.toString(),
    });
    setEditIndex(index);
    setIsFormVisible(true);
  };

  const handleDelete = async (index: number) => {
    const response = await fetch('/api/produksiharian', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_ph: produksiHarian[index].id_ph }),
    });

    if (response.ok) {
      setProduksiHarian(produksiHarian.filter((_, i) => i !== index));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>DATA PRODUKSI HARIAN</h1>
      <button
        onClick={() => setIsFormVisible(true)}
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#543310', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        <i className="fas fa-plus"></i> Produksi Harian
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
            <h2>{editIndex !== null ? "Edit Produksi" : "Tambah Produksi"}</h2>
            <input
              type="number"
              name="hasil_prod"
              placeholder="Hasil Produksi"
              value={formData.hasil_prod}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name="ukuran_bar_har"
              placeholder="Ukuran Barang"
              value={formData.ukuran_bar_har}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <select
              name="karyawan_id_kar"
              value={formData.karyawan_id_kar}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Pilih Karyawan</option>
              {karyawanList.map((karyawan) => (
                <option key={karyawan.id_karyawan} value={karyawan.id_karyawan}>
                  {karyawan.nama_karyawan}
                </option>
              ))}
            </select>
            <select
              name="barang_id_bar"
              value={formData.barang_id_bar}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Pilih Barang</option>
              {barangList.map((barang) => (
                <option key={barang.id_bar} value={barang.id_bar}>
                  {barang.jenis_bar}
                </option>
              ))}
            </select>
            <select
              name="pabrik_id"
              value={formData.pabrik_id}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Pilih Pabrik</option>
              {pabrikList.map((pabrik) => (
                <option key={pabrik.id_pabrik} value={pabrik.id_pabrik}>
                  {pabrik.nama_pabrik}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddOrUpdate}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}
            >
              {editIndex !== null ? "Update" : "Simpan"}
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
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Hasil Produksi</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Tanggal</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Ukuran Barang</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nama Karyawan</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nama Pabrik</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Jenis Barang</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {produksiHarian.map((item, index) => (
            <tr key={item.id_ph} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.id_ph}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.hasil_prod}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{new Date(item.tanggal).toLocaleDateString()}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.ukuran_bar_har}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{karyawanList.find(k => k.id_karyawan === item.karyawan_id_kar)?.nama_karyawan}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{pabrikList.find(p => p.id_pabrik === item.pabrik_id)?.nama_pabrik}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{barangList.find(b => b.id_bar === item.barang_id_bar)?.jenis_bar}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <button onClick={() => handleEdit(index)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
                  ✏️
                </button>
                <button onClick={() => handleDelete(index)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
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
