import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmModal from './ConfirmModal';
import NotificationModal from './NotificationModal';
import { X, TrendingUp, DollarSign, Save } from 'lucide-react';

const QuickProgressModal = ({ project, isOpen, onClose }) => {
  const { updateProject, addTermin, addProjectLog, currentUser } = useApp();

  const [rencana, setRencana] = useState(project?.dataFisik?.progresRencana || 0);
  const [realisasi, setRealisasi] = useState(project?.dataFisik?.progresRealisasi || 0);
  const [kendala, setKendala] = useState(project?.dataFisik?.kendalaLapangan || '');

  // Add Termin quickly
  const [addTerminNow, setAddTerminNow] = useState(false);
  const [terminNama, setTerminNama] = useState('');
  const [nomorSP2D, setNomorSP2D] = useState('');
  const [jumlahCair, setJumlahCair] = useState('');

  // Confirmation & Notification modals
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Ya, Simpan',
    type: 'primary',
    onConfirm: () => {}
  });

  const [notifModal, setNotifModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    btnText: 'OK, Selesai'
  });

  if (!isOpen || !project) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Pembaruan Progres',
      message: (
        <div>
          <div>Apakah Anda yakin ingin memperbarui data progres pekerjaan ini?</div>
          <div style={{ marginTop: 10, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: 13, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>• Realisasi Fisik: <strong>{realisasi}%</strong> (Target: {rencana}%)</div>
            {addTerminNow && jumlahCair > 0 && (
              <div>• Pencairan SP2D Baru: <strong>Rp {Math.round(parseFloat(jumlahCair) || 0).toLocaleString('id-ID')}</strong> ({terminNama || 'Termin Baru'})</div>
            )}
            {kendala && <div>• Kendala Lapangan: <em>{kendala}</em></div>}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 6, fontSize: 12, color: '#64748b' }}>
              Diperbarui oleh: <strong>{currentUser?.nama || 'Petugas'}</strong>
            </div>
          </div>
        </div>
      ),
      confirmText: 'Ya, Simpan Progres',
      type: 'primary',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        const fRencana = parseFloat(rencana) || 0;
        const fRealisasi = parseFloat(realisasi) || 0;
        const cairNum = parseFloat(jumlahCair) || 0;

        // Auto audit logging
        let logDesc = `Koordinator ${currentUser?.nama || 'Petugas'} memperbarui progres fisik (Realisasi: ${fRealisasi}%, Rencana: ${fRencana}%)`;
        if (addTerminNow && cairNum > 0) {
          logDesc += ` serta mencatat pencairan SP2D ${terminNama || 'Baru'} sebesar Rp ${Math.round(cairNum).toLocaleString('id-ID')}`;
        }
        if (kendala) {
          logDesc += `. Catatan kendala: ${kendala}`;
        }

        addProjectLog(project.id, {
          aksi: 'Update Cepat Progres',
          keterangan: logDesc,
          dataChanged: {
            progresFisik: fRealisasi,
            sp2d: addTerminNow && cairNum > 0 ? cairNum : undefined,
            catatan: kendala
          }
        });

        // Update physical progress & notes
        updateProject(project.id, {
          dataFisik: {
            ...project.dataFisik,
            progresRencana: fRencana,
            progresRealisasi: fRealisasi,
            kendalaLapangan: kendala
          }
        });

        // If adding a termin
        if (addTerminNow && cairNum > 0) {
          addTermin(project.id, {
            terminKe: terminNama || 'Pencairan Baru',
            nomorSP2D: nomorSP2D || '-',
            tanggalSP2D: new Date().toISOString().slice(0, 10),
            jumlah: cairNum,
            catatan: 'Dicatat via Update Cepat'
          });
        }

        setNotifModal({
          isOpen: true,
          title: 'Progres Berhasil Disimpan!',
          message: 'Data progres pekerjaan dan catatan riwayat log telah berhasil diperbarui ke sistem.',
          type: 'success',
          btnText: 'OK, Selesai'
        });
      }
    });
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

        <form onSubmit={handleFormSubmit}>
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
                  <div>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Jumlah Pencairan (Rp satuan lengkap)"
                      value={jumlahCair}
                      onChange={(e) => setJumlahCair(e.target.value)}
                    />
                    {jumlahCair > 0 && (
                      <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginTop: 4 }}>
                        = Rp {Math.round(parseFloat(jumlahCair) || 0).toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
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

        {/* Pop Up Konfirmasi */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          type={confirmModal.type}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        />

        {/* Pop Up Notifikasi */}
        <NotificationModal
          isOpen={notifModal.isOpen}
          title={notifModal.title}
          message={notifModal.message}
          type={notifModal.type}
          btnText={notifModal.btnText}
          onClose={() => {
            setNotifModal((prev) => ({ ...prev, isOpen: false }));
            onClose();
          }}
        />
      </div>
    </div>
  );
};

export default QuickProgressModal;
