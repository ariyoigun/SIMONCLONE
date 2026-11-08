const fs = require('fs');
let c = fs.readFileSync('src/data/constants.js', 'utf8');

// 1. Update SYSTEM_MENUS
if (!c.includes("'monitoring_paket'")) {
  c = c.replace(
    "{ id: 'master_pekerjaan', label: 'Master Data Pekerjaan', section: 'Data Pokok & Master' },",
    "{ id: 'master_pekerjaan', label: 'Master Data Pekerjaan', section: 'Data Pokok & Master' },\r\n  { id: 'monitoring_paket', label: 'Monitoring Paket Pekerjaan', section: 'Modul Monitoring Progres' },"
  );
}

// 2. Update DEFAULT_SYSTEM_SETTINGS
const defaultSlideUnggulan = [
  {
    id: 'slide-1',
    projectId: 'prj_sda_bk_54',
    judul: 'Rehabilitasi Saluran Pembuang Stasiun - Tembiring - Tuntang Lama',
    subKegiatan: 'Normalisasi/Restorasi Sungai',
    bidangId: 'sda_bk',
    kategori: 'Pekerjaan Konstruksi (Fisik)',
    paguAnggaran: 1950036600,
    nilaiKontrak: 1911946000,
    pelaksana: 'CV. ANUGRAH MEKAR JAYA',
    nomorKontrak: '000.3.3/008/SP/TENDER/SDABK/VIII/2026',
    progresFisik: 30,
    progresKeuangan: 30,
    sp2d: 573583800,
    lokasi: 'Kecamatan Demak (Pusat Kota)',
    deskripsi: 'Pekerjaan strategis normalisasi dan rehabilitasi saluran pembuang air pengendali banjir perkotaan kawasan Stasiun, Tembiring hingga Tuntang Lama.',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&auto=format&fit=crop&q=80'
  }
];

if (!c.includes('showGaleriSlideshow:')) {
  c = c.replace(
    'maxPublicHighlights: 10,',
    'maxPublicHighlights: 10,\r\n  showGaleriSlideshow: false,\r\n  showSlideshowUnggulan: true,\r\n  showPetaKoordinat: false,\r\n  slideshowUnggulan: ' + JSON.stringify(defaultSlideUnggulan, null, 4).replace(/\n/g, '\r\n  ') + ','
  );
}

fs.writeFileSync('src/data/constants.js', c, 'utf8');
console.log('constants.js updated successfully!');

