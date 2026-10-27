import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIDANG_LIST } from '../data/constants';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Layers,
  FolderTree,
  FileText,
  Search,
  Check,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const SipdMasterModal = ({ isOpen, onClose, initialTab = 'sub_kegiatan' }) => {
  const {
    sipdPrograms = [],
    sipdKegiatans = [],
    sipdSubKegiatans = [],
    addSipdProgram,
    updateSipdProgram,
    deleteSipdProgram,
    addSipdKegiatan,
    updateSipdKegiatan,
    deleteSipdKegiatan,
    addSipdSubKegiatan,
    updateSipdSubKegiatan,
    deleteSipdSubKegiatan,
    resetSipdToDefault,
    currentUser,
    canManageSipd
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab); // 'program' | 'kegiatan' | 'sub_kegiatan'
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form Edit / Add State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form Fields
  const [formProgram, setFormProgram] = useState({
    kodeProgram: '',
    namaProgram: '',
    bidangId: 'bina_marga',
    deskripsi: ''
  });

  const [formKegiatan, setFormKegiatan] = useState({
    programId: '',
    kodeKegiatan: '',
    namaKegiatan: '',
    bidangId: 'bina_marga'
  });

  const [formSubKegiatan, setFormSubKegiatan] = useState({
    programId: '',
    kegiatanId: '',
    kodeSubKegiatan: '',
    namaSubKegiatan: '',
    kinerjaIndikator: '',
    satuanTarget: '',
    bidangId: 'bina_marga'
  });

  if (!isOpen) return null;

  // Open Add Form
  const handleOpenAdd = () => {
    setEditingItem(null);
    const defaultBidang = currentUser.bidangId && currentUser.bidangId !== 'sekretariat'
      ? currentUser.bidangId
      : 'bina_marga';

    if (activeTab === 'program') {
      setFormProgram({
        kodeProgram: '1.03.',
        namaProgram: '',
        bidangId: defaultBidang,
        deskripsi: ''
      });
    } else if (activeTab === 'kegiatan') {
      const prog = sipdPrograms.find((p) => p.bidangId === defaultBidang) || sipdPrograms[0];
      setFormKegiatan({
        programId: prog ? prog.id : '',
        kodeKegiatan: prog ? `${prog.kodeProgram}.2.` : '1.03.02.2.',
        namaKegiatan: '',
        bidangId: defaultBidang
      });
    } else {
      const prog = sipdPrograms.find((p) => p.bidangId === defaultBidang) || sipdPrograms[0];
      const keg = sipdKegiatans.find((k) => k.programId === (prog ? prog.id : '')) || sipdKegiatans[0];
      setFormSubKegiatan({
        programId: prog ? prog.id : '',
        kegiatanId: keg ? keg.id : '',
        kodeSubKegiatan: keg ? `${keg.kodeKegiatan}.` : '1.03.02.2.01.',
        namaSubKegiatan: '',
        kinerjaIndikator: '',
        satuanTarget: 'Unit / Km',
        bidangId: defaultBidang
      });
    }
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'program') {
      setFormProgram({
        kodeProgram: item.kodeProgram || '',
        namaProgram: item.namaProgram || '',
        bidangId: item.bidangId || 'bina_marga',
        deskripsi: item.deskripsi || ''
      });
    } else if (activeTab === 'kegiatan') {
      setFormKegiatan({
        programId: item.programId || '',
        kodeKegiatan: item.kodeKegiatan || '',
        namaKegiatan: item.namaKegiatan || '',
        bidangId: item.bidangId || 'bina_marga'
      });
    } else {
      const keg = sipdKegiatans.find((k) => k.id === item.kegiatanId);
      setFormSubKegiatan({
        programId: keg ? keg.programId : item.programId || '',
        kegiatanId: item.kegiatanId || '',
        kodeSubKegiatan: item.kodeSubKegiatan || '',
        namaSubKegiatan: item.namaSubKegiatan || '',
        kinerjaIndikator: item.kinerjaIndikator || '',
        satuanTarget: item.satuanTarget || '',
        bidangId: item.bidangId || 'bina_marga'
      });
    }
    setIsFormOpen(true);
  };

  // Save Form
  const handleSave = (e) => {
    e.preventDefault();
    if (activeTab === 'program') {
      if (!formProgram.namaProgram.trim()) {
        alert('Nama Program wajib diisi!');
        return;
      }
      if (editingItem) {
        updateSipdProgram(editingItem.id, formProgram);
      } else {
        addSipdProgram(formProgram);
      }
    } else if (activeTab === 'kegiatan') {
      if (!formKegiatan.namaKegiatan.trim() || !formKegiatan.programId) {
        alert('Program Induk dan Nama Kegiatan wajib diisi!');
        return;
      }
      const parentProg = sipdPrograms.find((p) => p.id === formKegiatan.programId);
      const dataToSave = {
        ...formKegiatan,
        bidangId: parentProg ? parentProg.bidangId : formKegiatan.bidangId
      };
      if (editingItem) {
        updateSipdKegiatan(editingItem.id, dataToSave);
      } else {
        addSipdKegiatan(dataToSave);
      }
    } else {
      if (!formSubKegiatan.namaSubKegiatan.trim() || !formSubKegiatan.kegiatanId) {
        alert('Kegiatan Induk dan Nama Sub Kegiatan wajib diisi!');
        return;
      }
      const parentKeg = sipdKegiatans.find((k) => k.id === formSubKegiatan.kegiatanId);
      const parentProg = sipdPrograms.find((p) => p.id === (parentKeg ? parentKeg.programId : formSubKegiatan.programId));
      const dataToSave = {
        ...formSubKegiatan,
        programId: parentProg ? parentProg.id : formSubKegiatan.programId,
        bidangId: parentProg ? parentProg.bidangId : formSubKegiatan.bidangId
      };
      if (editingItem) {
        updateSipdSubKegiatan(editingItem.id, dataToSave);
      } else {
        addSipdSubKegiatan(dataToSave);
      }
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  // Delete Item
  const handleDelete = (item) => {
    const label = item.namaSubKegiatan || item.namaKegiatan || item.namaProgram;
    if (window.confirm(`Yakin ingin menghapus nomenklatur SIPD: "${label}"?`)) {
      if (activeTab === 'program') {
        deleteSipdProgram(item.id);
      } else if (activeTab === 'kegiatan') {
        deleteSipdKegiatan(item.id);
      } else {
        deleteSipdSubKegiatan(item.id);
      }
    }
  };

  // Filtered lists
  const filteredPrograms = sipdPrograms.filter((p) => {
    if (selectedBidang !== 'ALL' && p.bidangId !== selectedBidang) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.namaProgram.toLowerCase().includes(q) || p.kodeProgram.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredKegiatans = sipdKegiatans.filter((k) => {
    if (selectedBidang !== 'ALL' && k.bidangId !== selectedBidang) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return k.namaKegiatan.toLowerCase().includes(q) || k.kodeKegiatan.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredSubKegiatans = sipdSubKegiatans.filter((s) => {
    if (selectedBidang !== 'ALL' && s.bidangId !== selectedBidang) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.namaSubKegiatan.toLowerCase().includes(q) ||
        s.kodeSubKegiatan.toLowerCase().includes(q) ||
        (s.kinerjaIndikator && s.kinerjaIndikator.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 960,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 16
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            background: 'linear-gradient(135deg, #0f2c59 0%, #0369a1 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            borderBottom: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)'
              }}
            >
              <FolderTree size={24} color="#f8fafc" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#ffffff' }}>
                Master Nomenklatur SIPD Kemendagri
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#bae6fd' }}>
                Kelola master Program, Kegiatan, dan Sub Kegiatan DINPUTARU Kabupaten Demak
              </p>
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              borderRadius: 8
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 24px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex' }}>
            <button
              type="button"
              onClick={() => {
                setActiveTab('sub_kegiatan');
                setIsFormOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 18px',
                fontSize: 13.5,
                fontWeight: 700,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === 'sub_kegiatan' ? '#0f2c59' : '#64748b',
                borderBottom: activeTab === 'sub_kegiatan' ? '3px solid #0f2c59' : '3px solid transparent'
              }}
            >
              <FileText size={16} color={activeTab === 'sub_kegiatan' ? '#0284c7' : '#94a3b8'} />
              <span>3. Sub Kegiatan ({sipdSubKegiatans.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('kegiatan');
                setIsFormOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 18px',
                fontSize: 13.5,
                fontWeight: 700,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === 'kegiatan' ? '#0f2c59' : '#64748b',
                borderBottom: activeTab === 'kegiatan' ? '3px solid #0f2c59' : '3px solid transparent'
              }}
            >
              <Layers size={16} color={activeTab === 'kegiatan' ? '#0284c7' : '#94a3b8'} />
              <span>2. Kegiatan ({sipdKegiatans.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('program');
                setIsFormOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 18px',
                fontSize: 13.5,
                fontWeight: 700,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === 'program' ? '#0f2c59' : '#64748b',
                borderBottom: activeTab === 'program' ? '3px solid #0f2c59' : '3px solid transparent'
              }}
            >
              <FolderTree size={16} color={activeTab === 'program' ? '#0284c7' : '#94a3b8'} />
              <span>1. Program ({sipdPrograms.length})</span>
            </button>
          </div>

          {canManageSipd && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="btn btn-primary"
              style={{
                padding: '7px 14px',
                fontSize: 12.5,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Plus size={14} />
              <span>Tambah {activeTab === 'program' ? 'Program' : activeTab === 'kegiatan' ? 'Kegiatan' : 'Sub Kegiatan'}</span>
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {/* Form Modal (Add / Edit) */}
          {isFormOpen && (
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: 12,
                padding: 20,
                marginBottom: 20,
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f2c59' }}>
                  {editingItem ? 'Edit Nomenklatur' : 'Tambah Nomenklatur Baru'}:{' '}
                  {activeTab === 'program' ? 'Program' : activeTab === 'kegiatan' ? 'Kegiatan' : 'Sub Kegiatan'}
                </h4>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setIsFormOpen(false)}
                  style={{ width: 28, height: 28 }}
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleSave}>
                {/* FORM PROGRAM */}
                {activeTab === 'program' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
                    <div>
                      <label className="form-label">Kode Program (SIPD):</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: 1.03.02"
                        value={formProgram.kodeProgram}
                        onChange={(e) => setFormProgram({ ...formProgram, kodeProgram: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Bidang Dinas Pengampu:</label>
                      <select
                        className="form-control"
                        value={formProgram.bidangId}
                        onChange={(e) => setFormProgram({ ...formProgram, bidangId: e.target.value })}
                      >
                        {BIDANG_LIST.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.singkatan} - {b.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Nama Program:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: PROGRAM PENYELENGGARAAN JALAN"
                        value={formProgram.namaProgram}
                        onChange={(e) => setFormProgram({ ...formProgram, namaProgram: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Deskripsi / Sasaran Program (Opsional):</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Penjelasan ringkas sasaran program"
                        value={formProgram.deskripsi}
                        onChange={(e) => setFormProgram({ ...formProgram, deskripsi: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* FORM KEGIATAN */}
                {activeTab === 'kegiatan' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Pilih Program Induk:</label>
                      <select
                        className="form-control"
                        value={formKegiatan.programId}
                        onChange={(e) => {
                          const pId = e.target.value;
                          const p = sipdPrograms.find((item) => item.id === pId);
                          setFormKegiatan({
                            ...formKegiatan,
                            programId: pId,
                            kodeKegiatan: p ? `${p.kodeProgram}.2.` : formKegiatan.kodeKegiatan
                          });
                        }}
                        required
                      >
                        <option value="">-- Pilih Program Induk --</option>
                        {sipdPrograms.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.kodeProgram}] {p.namaProgram}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Kode Kegiatan:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: 1.03.02.2.01"
                        value={formKegiatan.kodeKegiatan}
                        onChange={(e) => setFormKegiatan({ ...formKegiatan, kodeKegiatan: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Bidang Pengampu:</label>
                      <select
                        className="form-control"
                        value={formKegiatan.bidangId}
                        onChange={(e) => setFormKegiatan({ ...formKegiatan, bidangId: e.target.value })}
                      >
                        {BIDANG_LIST.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.singkatan} - {b.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Nama Kegiatan:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Penyelenggaraan Jalan Kabupaten/Kota"
                        value={formKegiatan.namaKegiatan}
                        onChange={(e) => setFormKegiatan({ ...formKegiatan, namaKegiatan: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* FORM SUB KEGIATAN */}
                {activeTab === 'sub_kegiatan' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Pilih Kegiatan Induk:</label>
                      <select
                        className="form-control"
                        value={formSubKegiatan.kegiatanId}
                        onChange={(e) => {
                          const kId = e.target.value;
                          const k = sipdKegiatans.find((item) => item.id === kId);
                          setFormSubKegiatan({
                            ...formSubKegiatan,
                            kegiatanId: kId,
                            programId: k ? k.programId : formSubKegiatan.programId,
                            kodeSubKegiatan: k ? `${k.kodeKegiatan}.` : formSubKegiatan.kodeSubKegiatan
                          });
                        }}
                        required
                      >
                        <option value="">-- Pilih Kegiatan Induk --</option>
                        {sipdKegiatans.map((k) => (
                          <option key={k.id} value={k.id}>
                            [{k.kodeKegiatan}] {k.namaKegiatan}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Kode Sub Kegiatan (SIPD):</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: 1.03.02.2.01.0003"
                        value={formSubKegiatan.kodeSubKegiatan}
                        onChange={(e) => setFormSubKegiatan({ ...formSubKegiatan, kodeSubKegiatan: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Satuan Target Output:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Km, Unit, M2, Paket"
                        value={formSubKegiatan.satuanTarget}
                        onChange={(e) => setFormSubKegiatan({ ...formSubKegiatan, satuanTarget: e.target.value })}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Nama Sub Kegiatan:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Rekonstruksi Jalan (Peningkatan / Rigid Pavement)"
                        value={formSubKegiatan.namaSubKegiatan}
                        onChange={(e) => setFormSubKegiatan({ ...formSubKegiatan, namaSubKegiatan: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Tolok Ukur / Indikator Kinerja Output (Opsional):</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Panjang jalan kabupaten yang direkonstruksi"
                        value={formSubKegiatan.kinerjaIndikator}
                        onChange={(e) => setFormSubKegiatan({ ...formSubKegiatan, kinerjaIndikator: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 18, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Check size={16} />
                    <span>Simpan Nomenklatur</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Controls: Search & Filter Bidang */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              marginBottom: 16,
              flexWrap: 'wrap'
            }}
          >
            <div className="search-box" style={{ flex: 1, minWidth: 240 }}>
              <Search className="search-icon" size={15} />
              <input
                type="text"
                className="search-input"
                placeholder={`Cari kode atau nama ${activeTab.replace('_', ' ')}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="select-filter"
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              style={{ width: 220 }}
            >
              <option value="ALL">Semua Bidang Dinas</option>
              {BIDANG_LIST.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.singkatan} - {b.nama}
                </option>
              ))}
            </select>

            {canManageSipd && (
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: 11.5, padding: '7px 12px' }}
                onClick={() => {
                  if (window.confirm('Reset daftar master nomenklatur SIPD ke standar Kepmendagri DINPUTARU Demak?')) {
                    resetSipdToDefault();
                  }
                }}
                title="Reset daftar nomenklatur jika ingin kembali ke data standar"
              >
                Reset Default
              </button>
            )}
          </div>

          {/* TAB 1: LIST SUB KEGIATAN */}
          {activeTab === 'sub_kegiatan' && (
            <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: 10 }}>
              <table className="data-table" style={{ fontSize: 12.5 }}>
                <thead>
                  <tr>
                    <th style={{ width: 140 }}>Kode Sub Kegiatan</th>
                    <th>Nama Sub Kegiatan & Indikator</th>
                    <th>Kegiatan Induk</th>
                    <th>Bidang</th>
                    {canManageSipd && <th style={{ textAlign: 'center', width: 90 }}>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredSubKegiatans.length === 0 ? (
                    <tr>
                      <td colSpan={canManageSipd ? 5 : 4} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                        Tidak ada Sub Kegiatan yang sesuai pencarian / filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubKegiatans.map((sub) => {
                      const keg = sipdKegiatans.find((k) => k.id === sub.kegiatanId);
                      const b = BIDANG_LIST.find((item) => item.id === sub.bidangId);
                      return (
                        <tr key={sub.id}>
                          <td>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                color: '#0369a1',
                                background: '#e0f2fe',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 11.5
                              }}
                            >
                              {sub.kodeSubKegiatan}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#0f2c59' }}>{sub.namaSubKegiatan}</div>
                            {sub.kinerjaIndikator && (
                              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
                                🎯 {sub.kinerjaIndikator} {sub.satuanTarget ? `(${sub.satuanTarget})` : ''}
                              </div>
                            )}
                          </td>
                          <td>
                            <div style={{ fontSize: 12, color: '#334155' }}>
                              {keg ? keg.namaKegiatan : '-'}
                            </div>
                            <div style={{ fontSize: 10.5, color: '#94a3b8' }}>
                              {keg ? keg.kodeKegiatan : ''}
                            </div>
                          </td>
                          <td>
                            <span
                              style={{
                                background: b?.bgLight || '#f1f5f9',
                                color: b?.warna || '#475569',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontWeight: 700,
                                fontSize: 11
                              }}
                            >
                              {b?.singkatan || sub.bidangId}
                            </span>
                          </td>
                          {canManageSipd && (
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  className="btn-icon"
                                  onClick={() => handleOpenEdit(sub)}
                                  style={{ color: '#0284c7' }}
                                  title="Edit Sub Kegiatan"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="btn-icon"
                                  onClick={() => handleDelete(sub)}
                                  style={{ color: '#dc2626' }}
                                  title="Hapus Sub Kegiatan"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: LIST KEGIATAN */}
          {activeTab === 'kegiatan' && (
            <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: 10 }}>
              <table className="data-table" style={{ fontSize: 12.5 }}>
                <thead>
                  <tr>
                    <th style={{ width: 140 }}>Kode Kegiatan</th>
                    <th>Nama Kegiatan</th>
                    <th>Program Induk</th>
                    <th>Bidang</th>
                    {canManageSipd && <th style={{ textAlign: 'center', width: 90 }}>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredKegiatans.length === 0 ? (
                    <tr>
                      <td colSpan={canManageSipd ? 5 : 4} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                        Tidak ada Kegiatan yang sesuai pencarian / filter.
                      </td>
                    </tr>
                  ) : (
                    filteredKegiatans.map((keg) => {
                      const prog = sipdPrograms.find((p) => p.id === keg.programId);
                      const b = BIDANG_LIST.find((item) => item.id === keg.bidangId);
                      return (
                        <tr key={keg.id}>
                          <td>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                color: '#166534',
                                background: '#dcfce7',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 11.5
                              }}
                            >
                              {keg.kodeKegiatan}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: '#0f2c59' }}>{keg.namaKegiatan}</td>
                          <td>
                            <div style={{ fontSize: 12, color: '#334155' }}>
                              {prog ? prog.namaProgram : '-'}
                            </div>
                            <div style={{ fontSize: 10.5, color: '#94a3b8' }}>
                              {prog ? prog.kodeProgram : ''}
                            </div>
                          </td>
                          <td>
                            <span
                              style={{
                                background: b?.bgLight || '#f1f5f9',
                                color: b?.warna || '#475569',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontWeight: 700,
                                fontSize: 11
                              }}
                            >
                              {b?.singkatan || keg.bidangId}
                            </span>
                          </td>
                          {canManageSipd && (
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  className="btn-icon"
                                  onClick={() => handleOpenEdit(keg)}
                                  style={{ color: '#0284c7' }}
                                  title="Edit Kegiatan"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="btn-icon"
                                  onClick={() => handleDelete(keg)}
                                  style={{ color: '#dc2626' }}
                                  title="Hapus Kegiatan"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: LIST PROGRAM */}
          {activeTab === 'program' && (
            <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: 10 }}>
              <table className="data-table" style={{ fontSize: 12.5 }}>
                <thead>
                  <tr>
                    <th style={{ width: 130 }}>Kode Program</th>
                    <th>Nama Program</th>
                    <th>Deskripsi / Sasaran</th>
                    <th>Bidang</th>
                    {canManageSipd && <th style={{ textAlign: 'center', width: 90 }}>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredPrograms.length === 0 ? (
                    <tr>
                      <td colSpan={canManageSipd ? 5 : 4} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                        Tidak ada Program yang sesuai pencarian / filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPrograms.map((prog) => {
                      const b = BIDANG_LIST.find((item) => item.id === prog.bidangId);
                      return (
                        <tr key={prog.id}>
                          <td>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                color: '#6b21a8',
                                background: '#f3e8ff',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 11.5
                              }}
                            >
                              {prog.kodeProgram}
                            </span>
                          </td>
                          <td style={{ fontWeight: 800, color: '#0f2c59' }}>{prog.namaProgram}</td>
                          <td style={{ fontSize: 12, color: '#64748b' }}>{prog.deskripsi || '-'}</td>
                          <td>
                            <span
                              style={{
                                background: b?.bgLight || '#f1f5f9',
                                color: b?.warna || '#475569',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontWeight: 700,
                                fontSize: 11
                              }}
                            >
                              {b?.singkatan || prog.bidangId}
                            </span>
                          </td>
                          {canManageSipd && (
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  className="btn-icon"
                                  onClick={() => handleOpenEdit(prog)}
                                  style={{ color: '#0284c7' }}
                                  title="Edit Program"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="btn-icon"
                                  onClick={() => handleDelete(prog)}
                                  style={{ color: '#dc2626' }}
                                  title="Hapus Program"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SipdMasterModal;
