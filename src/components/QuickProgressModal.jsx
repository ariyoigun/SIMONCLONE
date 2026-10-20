import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, TrendingUp, DollarSign, Save } from 'lucide-react';

const QuickProgressModal = ({ project, isOpen, onClose }) => {
  const { updateProject, addTermin } = useApp();

  const [rencana, setRencana] = useState(project?.dataFisik?.progresRencana || 0);
  const [realisasi, setRealisasi] = useState(project?.dataFisik?.progresRealisasi || 0);
  const [kendala, setKendala] = useState(project?.dataFisik?.kendalaLapangan || '');

  // Add Termin quickly
  const [addTerminNow, setAddTerminNow] = useState(false);
  const [terminNama, setTerminNama] = useState('');
  const [nomorSP2D, setNomorSP2D] = useState('');
  const [jumlahCair, setJumlahCair] = useState('');

  if (!isOpen || !project) return null;

  const handleSave = (e) => {
    e.preventDefault();

    // Update physical progress
    updateProject(project.id, {
      dataFisik: {
        ...project.dataFisik,
        progresRencana: parseFloat(rencana) || 0,
        progresRealisasi: parseFloat(realisasi) || 0,
        kendalaLapangan: kendala
      }
    });

    // If adding a termin
    if (addTerminNow && jumlahCair > 0) {
      addTermin(project.id, {
        terminKe: terminNama || 'Pencairan Baru',
        nomorSP2D: nomorSP2D || '-',
        tanggalSP2D: new Date().toISOString().slice(0, 10),
        jumlah: parseFloat(jumlahCair) || 0,
        catatan: 'Dicatat via Update Cepat'
      });
    }

    onClose();
  };

  const deviasi = (parseFloat(realisasi || 0) - parseFloat(rencana || 0)).toFixed(2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div className="modal-header">
          <div>
            <h3>Update Cepat Progres Pekerjaan</h3>
            <p style={{ color: '#64748b', fontSize: 12.5 }}>
              {project.namaPaket}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 14,
                marginBottom: 16
              }}
            >
              <div className="form-group">
                <label className="form-label">Target Rencana Kumulatif (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="form-control"
                  value={rencana}
                  onChange={(e) => setRencana(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Realisasi Fisik Terkini (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="form-control"
                  value={realisasi}
                  onChange={(e) => setRealisasi(e.target.value)}
                  required
                />
              </div>
            </div>

            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: deviasi < -5 ? '#fee2e2' : deviasi < 0 ? '#fef3c7' : '#dcfce7',
                color: deviasi < -5 ? '#991b1b' : deviasi < 0 ? '#92400e' : '#166534',
                fontSize: 12.5,
                fontWeight: 700,
                marginBottom: 16
              }}
            >
              Deviasi Terhitung: {deviasi >= 0 ? `+${deviasi}%` : `${deviasi}%`} (
              {realisasi >= 100
                ? 'Selesai 100%'
                : deviasi < -5
                ? 'Kritis / Kontrak Kritis'
                : deviasi < 0
                ? 'Perhatian / Terlambat'
                : 'Aman Sesuai Jadwal'}
              )
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Catatan Kendala Lapangan Terkini</label>
              <textarea
                className="form-control"
                placeholder="Tulis kondisi cuaca, kendala material, atau progres mingguan..."
                value={kendala}
                onChange={(e) => setKendala(e.target.value)}
              />
            </div>

            {/* Quick Termin Checkbox */}
            <div
              style={{
                padding: '14px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                background: '#f8fafc'
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={addTerminNow}
                  onChange={(e) => setAddTerminNow(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#0f2c59' }}
                />
                Sekaligus Catat Pencairan SP2D Baru (Keuangan)
              </label>

              {addTerminNow && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Termin (mis. Termin II)"
                      value={terminNama}
                      onChange={(e) => setTerminNama(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nomor SP2D"
                      value={nomorSP2D}
                      onChange={(e) => setNomorSP2D(e.target.value)}
                    />
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Jumlah Pencairan (Rp)"
                    value={jumlahCair}
                    onChange={(e) => setJumlahCair(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              Simpan Progres
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickProgressModal;
