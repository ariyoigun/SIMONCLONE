import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Plus, X, Check, Lock } from 'lucide-react';

const YearManagementModal = ({ isOpen, onClose }) => {
  const { years, activeYear, setActiveYear, addYear, canManageYears, currentUser } = useApp();
  const [newYearInput, setNewYearInput] = useState('');

  if (!isOpen) return null;

  const handleAddYear = (e) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;
    const success = addYear(newYearInput.trim());
    if (success) {
      setNewYearInput('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div>
            <h3>Kelola Tahun Anggaran</h3>
            <p>Pilih atau tambahkan tahun anggaran untuk memonitor pekerjaan multi-tahun</p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Active Years Grid */}
          <div style={{ marginBottom: 24 }}>
            <label className="form-label" style={{ marginBottom: 10, display: 'block' }}>
              Daftar Tahun Anggaran Tersedia:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {years.map((year) => {
                const isActive = activeYear === year;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setActiveYear(year);
                      onClose();
                    }}
                    style={{
                      padding: '14px',
                      borderRadius: 10,
                      border: isActive ? '2px solid #0f2c59' : '1px solid #e2e8f0',
                      background: isActive ? '#0f2c59' : '#ffffff',
                      color: isActive ? '#ffffff' : '#0f172a',
                      fontWeight: 800,
                      fontSize: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 4px 12px rgba(15, 44, 89, 0.25)' : 'none'
                    }}
                  >
                    <span>{year}</span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: isActive ? '#f59e0b' : '#64748b'
                      }}
                    >
                      {isActive ? 'Sedang Aktif' : 'Pilih Tahun'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Year Form (Superadmin only) */}
          {canManageYears ? (
            <div
              style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: 12,
                border: '1px solid #e2e8f0'
              }}
            >
              <form onSubmit={handleAddYear}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={16} color="#059669" />
                  Tambah Tahun Anggaran Baru (Superadmin)
                </label>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Contoh: 2028"
                    value={newYearInput}
                    onChange={(e) => setNewYearInput(e.target.value)}
                    min="2020"
                    max="2035"
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    Tambah Tahun
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div
              style={{
                padding: '12px 14px',
                background: '#f1f5f9',
                borderRadius: 8,
                fontSize: 12,
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Lock size={16} />
              <span>Hanya Super Admin yang dapat menambahkan tahun anggaran baru.</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearManagementModal;
