const fs = require('fs');
let c = fs.readFileSync('src/components/SystemSettingsModal.jsx', 'utf8');

// 1. Destructure projects
if (!c.includes('projects = [],')) {
  c = c.replace(
    'const {\r\n    tags,',
    'const {\r\n    projects = [],\r\n    tags,'
  ).replace(
    'const {\n    tags,',
    'const {\n    projects = [],\n    tags,'
  );
}

// 2. Add slide unggulan menu in menuGroups
if (!c.includes("id: 'slideshow_unggulan'")) {
  c = c.replace(
    "id: 'galeri',",
    `id: 'slideshow_unggulan',
          label: 'Slideshow Pekerjaan Unggulan',
          sub: 'Hero Slide & Detil Pekerjaan',
          desc: 'Pengaturan slideshow pekerjaan strategis unggulan yang tampil di hero landing page beranda publik serta link detil pekerjaan.',
          icon: Sparkles,
          badge: (systemSettings?.slideshowUnggulan || []).length || 1
        },
        {
          id: 'galeri',`
  );
}

// 3. Add state for slide unggulan
if (!c.includes('newSlideUnggulanInput')) {
  c = c.replace(
    "const [newGalleryInput, setNewGalleryInput] = useState({",
    `const [newSlideUnggulanInput, setNewSlideUnggulanInput] = useState({
    projectId: '',
    judul: '',
    subKegiatan: '',
    bidangId: 'sda_bk',
    kategori: 'Pekerjaan Konstruksi (Fisik)',
    paguAnggaran: 0,
    nilaiKontrak: 0,
    pelaksana: '',
    nomorKontrak: '',
    progresFisik: 0,
    progresKeuangan: 0,
    sp2d: 0,
    lokasi: '',
    deskripsi: '',
    url: ''
  });

  const handleSelectProjectForSlide = (projectId) => {
    const p = projects.find((x) => x.id === projectId);
    if (p) {
      setNewSlideUnggulanInput({
        projectId: p.id,
        judul: p.namaPaket,
        subKegiatan: p.subKegiatan || p.subBagian || '',
        bidangId: p.bidangId || 'sda_bk',
        kategori: p.kategoriPaket || p.kategoriPekerjaan || 'Pekerjaan Konstruksi (Fisik)',
        paguAnggaran: parseFloat(p.paguAnggaran) || 0,
        nilaiKontrak: p.dataKontrak?.nilaiKontrak || 0,
        pelaksana: p.dataKontrak?.namaPenyedia || '',
        nomorKontrak: p.dataKontrak?.nomorKontrak || '',
        progresFisik: parseFloat(p.dataFisik?.progresRealisasi) || 0,
        progresKeuangan: parseFloat(p.dataKeuangan?.persenKeuangan) || 0,
        sp2d: parseFloat(p.dataKeuangan?.totalPencairan) || 0,
        lokasi: p.lokasiLengkap || p.lokasi || \`\${p.desa || ''}, Kec. \${p.kecamatan || ''}\`,
        deskripsi: \`Pekerjaan strategis \${p.subKegiatan || p.namaPaket} di Kabupaten Demak.\`,
        url: newSlideUnggulanInput.url || 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&auto=format&fit=crop&q=80'
      });
    }
  };

  const handleAddSlideUnggulanSubmit = (e) => {
    e.preventDefault();
    if (!newSlideUnggulanInput.judul.trim()) return;
    const newSlide = {
      ...newSlideUnggulanInput,
      id: \`slide-\${Date.now()}\`
    };
    const currentList = systemSettings?.slideshowUnggulan || [];
    const updated = [...currentList, newSlide];
    updateSystemSettings({ slideshowUnggulan: updated });
    setNewSlideUnggulanInput({
      projectId: '',
      judul: '',
      subKegiatan: '',
      bidangId: 'sda_bk',
      kategori: 'Pekerjaan Konstruksi (Fisik)',
      paguAnggaran: 0,
      nilaiKontrak: 0,
      pelaksana: '',
      nomorKontrak: '',
      progresFisik: 0,
      progresKeuangan: 0,
      sp2d: 0,
      lokasi: '',
      deskripsi: '',
      url: ''
    });
    alert('Slide pekerjaan unggulan berhasil ditambahkan ke beranda publik!');
  };

  const handleDeleteSlideUnggulan = (slideId) => {
    if (window.confirm('Hapus slide pekerjaan unggulan ini dari beranda publik?')) {
      const currentList = systemSettings?.slideshowUnggulan || [];
      const updated = currentList.filter((s) => s.id !== slideId);
      updateSystemSettings({ slideshowUnggulan: updated });
    }
  };

  const [newGalleryInput, setNewGalleryInput] = useState({`
  );
}

// 4. Render activeTab === 'slideshow_unggulan' and toggles in galeri
const slideshowUnggulanJSX = `
          {activeTab === 'slideshow_unggulan' && (
            <div>
              {/* Toggle On/Off Slideshow Unggulan */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0f2c59', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={16} color="#f59e0b" />
                    <span>Tampilkan Slideshow Pekerjaan Unggulan di Beranda Publik</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                    Hero banner interaktif yang menampilkan pekerjaan prioritas dinas lengkap dengan spesifikasi dan foto.
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={systemSettings?.showSlideshowUnggulan !== false}
                    onChange={(e) => updateSystemSettings({ showSlideshowUnggulan: e.target.checked })}
                    style={{ width: 20, height: 20, cursor: 'pointer', accentColor: '#0284c7' }}
                  />
                  <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: (systemSettings?.showSlideshowUnggulan !== false) ? '#0284c7' : '#94a3b8' }}>
                    {(systemSettings?.showSlideshowUnggulan !== false) ? 'Aktif (ON)' : 'Nonaktif (OFF)'}
                  </span>
                </label>
              </div>

              {/* Form Tambah Slide dari Data Monitoring Paket */}
              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: 12,
                  padding: '18px 20px',
                  marginBottom: 24
                }}
              >
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0369a1', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={16} />
                  Tambah Slide Pekerjaan Unggulan dari Data Monitoring
                </h4>

                <form onSubmit={handleAddSlideUnggulanSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Pilih Paket Pekerjaan dari Monitoring Paket TA 2026</label>
                      <select
                        className="form-control"
                        value={newSlideUnggulanInput.projectId}
                        onChange={(e) => handleSelectProjectForSlide(e.target.value)}
                        style={{ fontWeight: 600 }}
                      >
                        <option value="">-- Pilih Paket Pekerjaan ({projects.length} Paket Tersedia) --</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.bidangId?.toUpperCase() || 'DINAS'}] {p.namaPaket} - Rp {(p.dataKontrak?.nilaiKontrak || p.paguAnggaran || 0).toLocaleString('id-ID')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Judul Slide Pekerjaan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newSlideUnggulanInput.judul}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, judul: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">Sub Kegiatan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newSlideUnggulanInput.subKegiatan}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, subKegiatan: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Bidang</label>
                      <select
                        className="form-control"
                        value={newSlideUnggulanInput.bidangId}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, bidangId: e.target.value })}
                      >
                        {BIDANG_LIST.filter((b) => b.id !== 'sekretariat').map((b) => (
                          <option key={b.id} value={b.id}>{b.nama}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Pagu Anggaran (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newSlideUnggulanInput.paguAnggaran}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, paguAnggaran: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Nilai Kontrak (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newSlideUnggulanInput.nilaiKontrak}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, nilaiKontrak: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Pelaksana / Rekanan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newSlideUnggulanInput.pelaksana}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, pelaksana: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Nomor Kontrak</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newSlideUnggulanInput.nomorKontrak}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, nomorKontrak: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Progres Fisik (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={newSlideUnggulanInput.progresFisik}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, progresFisik: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Realisasi SP2D (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newSlideUnggulanInput.sp2d}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, sp2d: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">URL Foto Dokumentasi Slide (Format JPG/PNG)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://images.unsplash.com/... atau URL foto dinas"
                        value={newSlideUnggulanInput.url}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, url: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Deskripsi / Keterangan Singkat Slide</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={newSlideUnggulanInput.deskripsi}
                        onChange={(e) => setNewSlideUnggulanInput({ ...newSlideUnggulanInput, deskripsi: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <Plus size={15} />
                      Simpan & Tambahkan ke Slideshow
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Slide Unggulan Aktif */}
              <div style={{ marginBottom: 12 }}>
                <span className="form-label" style={{ fontWeight: 800 }}>
                  Daftar Slide Pekerjaan Unggulan Aktif ({(systemSettings?.slideshowUnggulan || []).length} Slide)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(systemSettings?.slideshowUnggulan || []).map((slide, sIdx) => {
                  const b = BIDANG_LIST.find((x) => x.id === slide.bidangId);
                  return (
                    <div
                      key={slide.id || sIdx}
                      style={{
                        display: 'flex',
                        gap: 16,
                        border: '1px solid #e2e8f0',
                        borderRadius: 12,
                        padding: '14px',
                        background: '#ffffff',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src={slide.url}
                        alt={slide.judul}
                        style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: b?.bgLight || '#e0f2fe', color: b?.warna || '#0284c7' }}>
                            {b?.nama || slide.kategori}
                          </span>
                          <span style={{ fontSize: 11, color: '#64748b' }}>{slide.subKegiatan}</span>
                        </div>
                        <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f2c59', margin: '0 0 4px' }}>
                          {slide.judul}
                        </h4>
                        <div style={{ fontSize: 12, color: '#475569' }}>
                          Pagu: <strong>Rp {(slide.paguAnggaran || 0).toLocaleString('id-ID')}</strong> • Kontrak: <strong>Rp {(slide.nilaiKontrak || 0).toLocaleString('id-ID')}</strong> • Pelaksana: {slide.pelaksana || '-'}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#0284c7', marginTop: 2 }}>
                          Fisik: {slide.progresFisik || 0}% • SP2D: Rp {(slide.sp2d || 0).toLocaleString('id-ID')}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleDeleteSlideUnggulan(slide.id)}
                        style={{ color: '#ef4444', background: '#fee2e2', borderRadius: 8, padding: 8 }}
                        title="Hapus Slide Ini"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
`;

if (!c.includes("activeTab === 'slideshow_unggulan'")) {
  c = c.replace(
    "{activeTab === 'galeri' && (",
    `${slideshowUnggulanJSX}\n\n          {activeTab === 'galeri' && (`
  );
}

// 5. In activeTab === 'galeri', add toggles for showGaleriSlideshow and showPetaKoordinat
const galeriTogglesJSX = `
              {/* Toggle Tampilkan Galeri & Peta Koordinat di Beranda Publik */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 14,
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f2c59' }}>
                      Slideshow Galeri Foto di Beranda
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b' }}>
                      Tampilkan carousel foto infrastruktur
                    </div>
                  </div>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={systemSettings?.showGaleriSlideshow === true}
                      onChange={(e) => updateSystemSettings({ showGaleriSlideshow: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: '#0284c7' }}
                    />
                  </label>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f2c59' }}>
                      Peta Titik Koordinat di Beranda
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b' }}>
                      Tampilkan sebaran koordinat peta lapangan
                    </div>
                  </div>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={systemSettings?.showPetaKoordinat === true}
                      onChange={(e) => updateSystemSettings({ showPetaKoordinat: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: '#0284c7' }}
                    />
                  </label>
                </div>
              </div>
`;

if (!c.includes('Slideshow Galeri Foto di Beranda')) {
  c = c.replace(
    "{/* Form Tambah Foto Galeri */}",
    `${galeriTogglesJSX}\n              {/* Form Tambah Foto Galeri */}`
  );
}

fs.writeFileSync('src/components/SystemSettingsModal.jsx', c, 'utf8');
console.log('SystemSettingsModal.jsx updated successfully!');

