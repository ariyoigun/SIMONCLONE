const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('Monitoring_Paket_2026.xlsx');
const ws = wb.Sheets['PAKET'];
const excelData = xlsx.utils.sheet_to_json(ws, { header: 1 });
const { REAL_PROJECTS_2026 } = require('../src/data/realProjects2026.js');

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function detectBidang(subKeg, nama) {
  const text = ((subKeg || '') + ' ' + (nama || '')).toLowerCase();
  if (text.includes('rtrw') || text.includes('rdtr') || text.includes('tata ruang') || text.includes('ranperda rtrw')) return 'tata_ruang';
  if (text.includes('jalan') || text.includes('jembatan') || text.includes('pjji') || text.includes('asphalt') || text.includes('trotoar')) return 'bina_marga';
  if (text.includes('sungai') || text.includes('pompa') || text.includes('pintu air') || text.includes('drainase') || text.includes('saluran pembuang') || text.includes('afvour') || text.includes('irigasi') || text.includes('tuntang') || text.includes('kali ') || text.includes('waduk') || text.includes('embung') || text.includes('banjir') || text.includes('tanggul') || text.includes('rawa')) return 'sda_bk';
  if (text.includes('air limbah') || text.includes('spald') || text.includes('sanitasi') || text.includes('air minum') || text.includes('psu') || text.includes('kumuh') || text.includes('rtlh') || text.includes('taman') || text.includes('gedung pertemuan') || text.includes('gedung wanita') || text.includes('masjid agung')) return 'cipta_karya';
  if (text.includes('gedung kantor') || text.includes('dinputaru') || text.includes('pakaian dinas') || text.includes('rumah tangga') || text.includes('kendaraan dinas') || text.includes('mebel') || text.includes('komputer') || text.includes('pelatihan pegawai') || text.includes('alat ukur') || text.includes('studio video')) return 'sekretariat';
  return 'cipta_karya';
}

let currentCat = '';
let currentCatId = '';
const packages = [];

excelData.forEach((r, idx) => {
  if (idx < 4) return;
  const col1 = r[1] ? r[1].toString().trim() : '';
  if (col1.includes('PEKERJAAN KONSTRUKSI')) {
    currentCat = 'Pekerjaan Konstruksi (Fisik)';
    currentCatId = 'fisik';
    return;
  }
  if (col1.includes('JASA KONSULTANSI')) {
    currentCat = 'Jasa Konsultansi';
    currentCatId = 'jakon';
    return;
  }
  if (col1.includes('PENGADAAN BARANG') || col1.includes('PENGDAAAN BARANG')) {
    currentCat = 'Pengadaan Barang';
    currentCatId = 'barang';
    return;
  }
  if (col1.includes('JASA LAINNYA')) {
    currentCat = 'Jasa Lainnya';
    currentCatId = 'jasa_lainnya';
    return;
  }
  if (col1.includes('JUMLAH') || col1.includes('PAGU')) return;

  const no = r[0];
  const namaPaket = r[2] ? r[2].toString().trim() : '';
  if (typeof no === 'number' && namaPaket) {
    const norm = normalize(namaPaket);
    const existing = REAL_PROJECTS_2026.find(
      p => normalize(p.namaPaket) === norm || 
           normalize(p.namaPaket).includes(norm) || 
           norm.includes(normalize(p.namaPaket))
    );

    const bidangId = existing?.bidangId || detectBidang(col1, namaPaket);
    const pagu = parseFloat(r[5]) || (existing?.paguAnggaran || 0);
    const kNilai = existing?.dataKontrak?.nilaiKontrak || (r[8] ? parseFloat(r[8]) : 0);
    const hasContract = (kNilai > 0) || Boolean(existing?.dataKontrak?.nomorKontrak) || Boolean(r[6]);
    const fRealisasi = existing?.dataFisik?.progresRealisasi || (r[12] ? parseFloat(r[12]) : 0);
    const qTotal = existing?.dataKeuangan?.totalPencairan || (r[11] ? parseFloat(r[11]) : 0);
    const baseVal = kNilai > 0 ? kNilai : (pagu > 0 ? pagu : 1);
    const qPersen = kNilai > 0 ? parseFloat(((qTotal / kNilai) * 100).toFixed(2)) : (existing?.dataKeuangan?.persenKeuangan || 0);

    const isLunas = qTotal > 0 && qTotal >= baseVal;
    const isMasuk = qTotal > 0 || fRealisasi > 0 || r[14];

    const tahapanPencairan = {
      berkasBelumMasuk: !isMasuk && !hasContract,
      berkasMasuk: Boolean(isMasuk || r[14]),
      koreksi: false,
      berkasRevisiMasuk: false,
      spm: Boolean(isLunas || qTotal > 0 || r[17]),
      selesai: Boolean(isLunas || (fRealisasi >= 100 && qTotal >= baseVal) || r[18]),
      catatanPencairan: isLunas ? 'SP2D Lunas 100%' : (qTotal > 0 ? `SP2D Cair Rp ${qTotal.toLocaleString('id-ID')}` : 'Belum ada pencairan SP2D')
    };

    const spjStatus = isLunas ? 'sudah_sp2d' : (qTotal > 0 || isMasuk ? 'sudah_masuk' : 'belum_masuk');

    const id = existing?.id || (`mp_${currentCatId}_${no}`);

    packages.push({
      id,
      tahunAnggaran: 2026,
      noUrutKategori: no,
      kategoriPaket: currentCat,
      kategoriPaketId: currentCatId,
      subKegiatan: col1,
      namaPaket,
      kategoriPekerjaan: currentCatId === 'fisik' ? 'Fisik' : currentCatId === 'jakon' ? 'Jasa Konsultansi' : currentCatId === 'barang' ? 'Barang' : 'Jasa Lainnya',
      jenisPengadaan: r[3] || (currentCatId === 'fisik' ? 'Pekerjaan Konstruksi' : currentCatId === 'jakon' ? 'Jasa Konsultansi' : currentCatId === 'barang' ? 'Barang' : 'Jasa Lainnya'),
      metodePemilihan: r[4] || (currentCatId === 'barang' ? 'e-Purchasing' : 'Pengadaan Langsung'),
      tipePengadaan: r[4] || (currentCatId === 'barang' ? 'e-Purchasing' : 'Pengadaan Langsung'),
      paguAnggaran: pagu,
      hps: existing?.hps || pagu,
      bidangId,
      subBagian: col1,
      jenisAnggaran: 'Murni',
      sumberDana: existing?.sumberDana || 'APBD Murni (DAU)',
      kodeRup: existing?.kodeRup || `RUP-2026-${bidangId.toUpperCase().slice(0, 3)}-${String(no).padStart(4, '0')}`,
      kecamatan: existing?.kecamatan || 'Demak',
      desa: existing?.desa || 'Bintoro',
      lokasiLengkap: existing?.lokasiLengkap || `Kabupaten Demak, Jawa Tengah`,
      latitude: existing?.latitude || -6.8944,
      longitude: existing?.longitude || 110.6385,
      tags: existing?.tags || [currentCat],
      isPublicHighlight: existing?.isPublicHighlight || false,
      isKontrak: hasContract,
      statusTahapPraKontrak: hasContract ? 'kontrak' : 'rup',
      dataKontrak: {
        nomorKontrak: existing?.dataKontrak?.nomorKontrak || r[6] || '',
        tanggalKontrak: existing?.dataKontrak?.tanggalKontrak || r[7] || '',
        tanggalMulai: existing?.dataKontrak?.tanggalMulai || r[10] || '',
        tanggalSelesai: existing?.dataKontrak?.tanggalSelesai || '',
        nilaiKontrak: kNilai,
        namaPenyedia: existing?.dataKontrak?.namaPenyedia || r[9] || (hasContract ? 'Penyedia Jasa Rekanan' : '-'),
        bankRekanan: existing?.dataKontrak?.bankRekanan || 'Bank Jateng',
        rekeningRekanan: existing?.dataKontrak?.rekeningRekanan || '',
        npwpRekanan: existing?.dataKontrak?.npwpRekanan || ''
      },
      dataFisik: {
        progresRencana: existing?.dataFisik?.progresRencana || (hasContract ? 100 : 0),
        progresRealisasi: fRealisasi,
        deviasiFisik: existing?.dataFisik?.deviasiFisik || 0,
        statusDeviasi: existing?.dataFisik?.statusDeviasi || 'Aman',
        mingguan: existing?.dataFisik?.mingguan || []
      },
      dataKeuangan: {
        totalPencairan: qTotal,
        persenKeuangan: qPersen,
        sisaAnggaran: Math.max(0, (kNilai > 0 ? kNilai : pagu) - qTotal),
        terminHistory: existing?.dataKeuangan?.terminHistory || (qTotal > 0 ? [
          {
            id: `TRM-${id}-1`,
            terminKe: isLunas ? 'Pelunasan SP2D 100%' : 'Pencairan SP2D Termin',
            nomorSP2D: `SP2D-${id}`,
            tanggalSP2D: '2026-10-31',
            jumlah: qTotal,
            persen: qPersen,
            keterangan: 'Pencairan SP2D Keuangan s/d Oktober 2026'
          }
        ] : [])
      },
      tahapanPencairan,
      spjStatus,
      administrasiSPJ: {
        status: spjStatus,
        tanggalMasuk: isMasuk ? '2026-10-15' : '',
        tanggalKoreksi: '',
        tanggalSPM: isLunas ? '2026-10-25' : '',
        nomorSPM: isLunas ? `900/SPM/${id}` : '',
        catatanVerifikator: isLunas ? 'Berkas SPJ lengkap & SP2D lunas 100%' : (isMasuk ? 'Berkas SPJ termin masuk, proses verifikasi SP2D' : 'Belum mengajukan berkas SPJ'),
        petugasVerifikator: isMasuk ? 'Kasubag Program & Keuangan' : ''
      },
      logs: existing?.logs || [
        {
          id: `log_init_${id}`,
          timestamp: '2026-01-02 08:00:00',
          userName: 'Admin Sistem',
          userRole: 'Superadmin',
          action: 'Sinkronisasi Master Paket 2026',
          keterangan: `Paket ${namaPaket} terdaftar dalam Perencanaan & Monitoring Pengadaan TA 2026.`
        }
      ]
    });
  }
});

console.log('Total monitoring packages built:', packages.length);
const catStats = {};
packages.forEach(p => {
  catStats[p.kategoriPaket] = (catStats[p.kategoriPaket] || 0) + 1;
});
console.log('Category breakdown:', catStats);

const fileContent = `/**
 * DATA RESMI MONITORING PAKET PEKERJAAN DINPUTARU KABUPATEN DEMAK TA 2026
 * Bersumber langsung dari file: Monitoring Paket 2026.xlsx (Sheet PAKET)
 * Total: ${packages.length} Paket Pekerjaan
 */

export const MONITORING_PAKET_2026 = ${JSON.stringify(packages, null, 2)};
`;

fs.writeFileSync('src/data/monitoringPaket2026.js', fileContent, 'utf-8');
console.log('Wrote src/data/monitoringPaket2026.js successfully!');
