"use client";

import React, { useState, useEffect } from "react";

interface ProduksiPabrik {
  id_pp: number;
  target_pab: number;
  tanggal: Date;
  ukuran_bar_pab: string;
  nama_pabrik: string;
  jenis_bar: string;
}

interface Pabrik {
  id_pabrik: number;
  nama_pabrik: string;
}

interface Barang {
  id_bar: number;
  jenis_bar: string;
}

export default function ProduksiPabrikPage() {
  const [produksiPabrik, setProduksiPabrik] = useState<ProduksiPabrik[]>([]);
  const [pabrikList, setPabrikList] = useState<Pabrik[]>([]);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [formData, setFormData] = useState({
    target_pab: "",
    tanggal: "",
    ukuran_bar_pab: "",
    pabrik_id_pabrik: "",
    barang_id_bar: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchProduksiPabrik = async () => {
      const response = await fetch("/api/produksipabrik");
      const data = await response.json();
      setProduksiPabrik(data);
    };

    const fetchPabrik = async () => {
      const response = await fetch("/api/pabrik");
      const data = await response.json();
      setPabrikList(data);
    };

    const fetchBarang = async () => {
      const response = await fetch("/api/barang");
      const data = await response.json();
      setBarangList(data);
    };

    fetchProduksiPabrik();
    fetchPabrik();
    fetchBarang();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    if (
      !formData.target_pab ||
      !formData.tanggal ||
      !formData.ukuran_bar_pab ||
      !formData.pabrik_id_pabrik ||
      !formData.barang_id_bar
    ) {
      alert("Semua field harus diisi!");
      return;
    }

    const newProduksi = {
      target_pab: parseFloat(formData.target_pab),
      tanggal: formData.tanggal,
      ukuran_bar_pab: formData.ukuran_bar_pab,
      pabrik_id_pabrik: parseInt(formData.pabrik_id_pabrik),
      barang_id_bar: parseInt(formData.barang_id_bar),
    };

    try {
      const response = await fetch("/api/produksipabrik", {
        method: editIndex !== null ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editIndex !== null
            ? { id_pp: produksiPabrik[editIndex].id_pp, ...newProduksi }
            : newProduksi
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const savedProduksi = await response.json();
      if (editIndex !== null) {
        const updatedProduksi = [...produksiPabrik];
        updatedProduksi[editIndex] = savedProduksi;
        setProduksiPabrik(updatedProduksi);
      } else {
        setProduksiPabrik([...produksiPabrik, savedProduksi]);
      }

      setEditIndex(null);
      setFormData({
        target_pab: "",
        tanggal: "",
        ukuran_bar_pab: "",
        pabrik_id_pabrik: "",
        barang_id_bar: "",
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error saving produksi pabrik:", error);
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setFormData({
      target_pab: produksiPabrik[index].target_pab.toString(),
      tanggal: new Date(produksiPabrik[index].tanggal).toISOString().split("T")[0],
      ukuran_bar_pab: produksiPabrik[index].ukuran_bar_pab,
      pabrik_id_pabrik: pabrikList.find(
        (pabrik) => pabrik.nama_pabrik === produksiPabrik[index].nama_pabrik
      )?.id_pabrik.toString() || "",
      barang_id_bar: barangList.find(
        (barang) => barang.jenis_bar === produksiPabrik[index].jenis_bar
      )?.id_bar.toString() || "",
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (index: number) => {
    const response = await fetch("/api/produksipabrik", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_pp: produksiPabrik[index].id_pp }),
    });

    if (response.ok) {
      setProduksiPabrik(produksiPabrik.filter((_, i) => i !== index));
    } else {
      console.error("Error deleting produksi pabrik");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Data Produksi Pabrik</h1>
      <button
        onClick={() => setIsFormVisible(true)}
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#543310', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        <i className="fas fa-plus"></i> Produksi Pabrik
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
              name="target_pab"
              placeholder="Target Pabrik"
              value={formData.target_pab}
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
              name="ukuran_bar_pab"
              placeholder="Ukuran Barang"
              value={formData.ukuran_bar_pab}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <select
              name="pabrik_id_pabrik"
              value={formData.pabrik_id_pabrik}
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
            <button
              onClick={handleAddOrUpdate}
              style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}
            >
              {editIndex !== null ? "Update" : "Simpan"}
            </button>
            <button onClick={() => setIsFormVisible(false)} style={{ marginLeft: '10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px' }}>
              Batal
            </button>
          </div>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#543310', color: '#fff' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Target Pabrik</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Tanggal</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Ukuran Barang</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Pabrik</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Barang</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {produksiPabrik.map((item, index) => (
            <tr key={item.id_pp} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.id_pp}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.target_pab}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                {new Date(item.tanggal).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.ukuran_bar_pab}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.nama_pabrik}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.jenis_bar}</td>
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
