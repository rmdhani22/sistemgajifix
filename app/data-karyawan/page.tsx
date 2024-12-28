"use client";

import React, { useState, useEffect } from "react";

interface Karyawan {
  id_karyawan: number;
  nama_karyawan: string;
  alamat_karyawan: string;
  pabrik_id_pabrik: number;
  Pabrik?: {
    id_pabrik: number;
    nama_pabrik: string;
  };
}

interface Pabrik {
  id_pabrik: number;
  nama_pabrik: string;
}

export default function DataKaryawan() {
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [pabrikList, setPabrikList] = useState<Pabrik[]>([]);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    nama_pabrik: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  useEffect(() => {
    const fetchKaryawan = async () => {
      const response = await fetch('/api/datakaryawan');
      const data = await response.json();
      setKaryawan(data);
    };

    const fetchPabrik = async () => {
      const response = await fetch('/api/pabrik');
      const data = await response.json();
      setPabrikList(data);
    };

    fetchKaryawan();
    fetchPabrik();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    if (!formData.nama || !formData.alamat || !formData.nama_pabrik) {
      alert("Semua field harus diisi!");
      return;
    }

    const selectedPabrik = pabrikList.find(pabrik => pabrik.nama_pabrik === formData.nama_pabrik);
    
    if (!selectedPabrik) {
      alert("Pabrik tidak ditemukan!");
      return;
    }

    const newKaryawan = {
      nama_karyawan: formData.nama,
      alamat_karyawan: formData.alamat,
      pabrik_id_pabrik: selectedPabrik.id_pabrik,
    };

    try {
      const response = await fetch('/api/datakaryawan', {
        method: editIndex !== null ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editIndex !== null ? { id_karyawan: karyawan[editIndex].id_karyawan, ...newKaryawan } : newKaryawan),
      });

      const savedKaryawan = await response.json();

      if (response.ok) {
        if (editIndex !== null) {
          const updatedKaryawan = [...karyawan];
          updatedKaryawan[editIndex] = savedKaryawan;
          setKaryawan(updatedKaryawan);
        } else {
          setKaryawan([...karyawan, savedKaryawan]);
        }

        setEditIndex(null);
        setFormData({ nama: "", alamat: "", nama_pabrik: "" });
        setIsModalOpen(false);
      } else {
        alert(savedKaryawan.error || "Gagal menyimpan data.");
      }
    } catch (error) {
      console.error("Error saving karyawan:", error);
    }
  };

  const handleEdit = (index: number) => {
    const itemToEdit = karyawan[index];
    setFormData({
      nama: itemToEdit.nama_karyawan,
      alamat: itemToEdit.alamat_karyawan,
      nama_pabrik: itemToEdit.Pabrik?.nama_pabrik || "",
    });
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    try {
      const response = await fetch('/api/datakaryawan', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_karyawan: karyawan[index].id_karyawan }),
      });

      if (response.ok) {
        const updatedKaryawan = karyawan.filter((_, i) => i !== index);
        setKaryawan(updatedKaryawan);
      } else {
        console.error('Error deleting karyawan');
      }
    } catch (error) {
      console.error('Error deleting karyawan:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>DATA KARYAWAN</h1>
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#543310', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        <i className="fas fa-plus"></i> Karyawan
        </button>

      {isModalOpen && (
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
            <h2>{editIndex !== null ? "Edit Karyawan" : "Tambah Karyawan"}</h2>
            <input
              type="text"
              name="nama"
              placeholder="Nama Karyawan"
              value={formData.nama}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name="alamat"
              placeholder="Alamat Karyawan"
              value={formData.alamat}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <select
              name="nama_pabrik"
              value={formData.nama_pabrik}
              onChange={handleInputChange}
              style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="">Pilih Pabrik</option>
              {pabrikList.map((pabrik) => (
                <option key={pabrik.id_pabrik} value={pabrik.nama_pabrik}>
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
            <button onClick={() => setIsModalOpen(false)} style={{ marginLeft: '10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px' }}>
              Batal
            </button>
          </div>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#543310', color: '#fff', textAlign: 'center'}}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nama Karyawan</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Alamat</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Pabrik</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {karyawan.map((item, index) => (
            <tr key={item.id_karyawan} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.id_karyawan}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.nama_karyawan}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.alamat_karyawan}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{item.Pabrik?.nama_pabrik}</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>
                <button 
                  onClick={() => handleEdit(index)}
                  
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(index)}
                  
                >
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
