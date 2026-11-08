const fs = require('fs');

let code = fs.readFileSync('src/components/ProjectModal.jsx', 'utf8');

const uploadCardsJsx = `
                {/* Modul Upload Dokumentasi Foto Lapangan (0%, 50%, 100%) */}
                <div
                  className="form-grid-full"
                  style={{
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: 14,
                    border: '1.5px solid #cbd5e1',
                    marginTop: 8
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Camera size={18} color="#0284c7" />
                        <span>Upload Dokumentasi Foto Lapangan (0%, 50%, 100%)</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>
                        Unggah berkas foto lapangan langsung dari perangkat Anda. Tersedia pratinjau instan untuk milestone 0%, 50%, dan 100%.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    {/* Card Foto 0% (Titik Nol) */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: 14, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, background: '#0f2c59', color: '#fff', padding: '2px 8px', borderRadius: 6 }}>
                          0% Titik Nol
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Kondisi Awal</span>
                      </div>
                      
                      {foto0 ? (
                        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                          <img src={foto0} alt="0% Titik Nol" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                          <div style={{ padding: '8px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: 11.5, color: '#0284c7', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Upload size={12} /> Ganti Foto
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('0%', e.target.files?.[0])} />
                            </label>
                            <button
                              type="button"
                              onClick={() => { setFoto0(''); setTanggal0(''); }}
                              style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          style={{
                            height: 140,
                            borderRadius: 8,
                            border: '2px dashed #cbd5e1',
                            background: '#f8fafc',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#64748b',
                            gap: 6,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Upload size={22} color="#0284c7" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f2c59' }}>Pilih Foto 0%</span>
                          <span style={{ fontSize: 10.5, color: '#94a3b8' }}>JPG, PNG atau WebP</span>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('0%', e.target.files?.[0])} />
                        </label>
                      )}
                      
                      <div style={{ marginTop: 10 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Tanggal Pengambilan:</label>
                        <input
                          type="date"
                          className="form-control"
                          style={{ fontSize: 12, padding: '4px 8px', marginTop: 2 }}
                          value={tanggal0}
                          onChange={(e) => setTanggal0(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Card Foto 50% (Pelaksanaan) */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: 14, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: 6 }}>
                          50% Progres
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Pelaksanaan</span>
                      </div>
                      
                      {foto50 ? (
                        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                          <img src={foto50} alt="50% Pelaksanaan" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                          <div style={{ padding: '8px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: 11.5, color: '#0284c7', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Upload size={12} /> Ganti Foto
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('50%', e.target.files?.[0])} />
                            </label>
                            <button
                              type="button"
                              onClick={() => { setFoto50(''); setTanggal50(''); }}
                              style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          style={{
                            height: 140,
                            borderRadius: 8,
                            border: '2px dashed #cbd5e1',
                            background: '#f8fafc',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#64748b',
                            gap: 6,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Upload size={22} color="#0284c7" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f2c59' }}>Pilih Foto 50%</span>
                          <span style={{ fontSize: 10.5, color: '#94a3b8' }}>JPG, PNG atau WebP</span>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('50%', e.target.files?.[0])} />
                        </label>
                      )}
                      
                      <div style={{ marginTop: 10 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Tanggal Pengambilan:</label>
                        <input
                          type="date"
                          className="form-control"
                          style={{ fontSize: 12, padding: '4px 8px', marginTop: 2 }}
                          value={tanggal50}
                          onChange={(e) => setTanggal50(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Card Foto 100% (Selesai Fisik) */}
                    <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: 14, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: 6 }}>
                          100% Selesai
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Hasil Akhir</span>
                      </div>
                      
                      {foto100 ? (
                        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                          <img src={foto100} alt="100% Selesai" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                          <div style={{ padding: '8px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: 11.5, color: '#0284c7', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Upload size={12} /> Ganti Foto
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('100%', e.target.files?.[0])} />
                            </label>
                            <button
                              type="button"
                              onClick={() => { setFoto100(''); setTanggal100(''); }}
                              style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          style={{
                            height: 140,
                            borderRadius: 8,
                            border: '2px dashed #cbd5e1',
                            background: '#f8fafc',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#64748b',
                            gap: 6,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Upload size={22} color="#059669" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f2c59' }}>Pilih Foto 100%</span>
                          <span style={{ fontSize: 10.5, color: '#94a3b8' }}>JPG, PNG atau WebP</span>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload('100%', e.target.files?.[0])} />
                        </label>
                      )}
                      
                      <div style={{ marginTop: 10 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Tanggal Pengambilan:</label>
                        <input
                          type="date"
                          className="form-control"
                          style={{ fontSize: 12, padding: '4px 8px', marginTop: 2 }}
                          value={tanggal100}
                          onChange={(e) => setTanggal100(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
`;

// Insert uploadCardsJsx before the closing </div>\n            )} of Tab Fisik
const targetSnippet = `                  <textarea\r\n                    className="form-control"\r\n                    placeholder="Contoh: Terjadi hujan deras di lokasi selama 3 hari berturut-turut, kontraktor menambah jam kerja / lembur..."\r\n                    value={formData.dataFisik.kendalaLapangan}\r\n                    onChange={(e) =>\r\n                      setFormData({\r\n                        ...formData,\r\n                        dataFisik: {\r\n                          ...formData.dataFisik,\r\n                          kendalaLapangan: e.target.value\r\n                        }\r\n                      })\r\n                    }\r\n                  />\r\n                </div>`;

const targetRegex = /(<textarea[\s\S]*?value=\{formData\.dataFisik\.kendalaLapangan\}[\s\S]*?<\/div>)/m;

if (targetRegex.test(code)) {
  code = code.replace(targetRegex, `$1\n${uploadCardsJsx}`);
  fs.writeFileSync('src/components/ProjectModal.jsx', code, 'utf8');
  console.log('Successfully inserted upload cards into Tab Fisik!');
} else {
  console.log('Target regex did not match');
}
