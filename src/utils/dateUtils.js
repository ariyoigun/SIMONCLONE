export const INDONESIAN_DAYS = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu'
];

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

/**
 * Format a Date object or date string into Indonesian standard format
 * e.g. "18 November 2026" or "18 November 2026, 08:30 WIB"
 */
export const formatIndonesianDate = (dateInput, withTime = false) => {
  if (!dateInput) return '18 November 2026';

  let d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    // If it's formatted like "18/11/2026" or "2026-11-18 08:30"
    const match = String(dateInput).match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (match) {
      d = new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
    }
  }

  if (isNaN(d.getTime())) {
    return '18 November 2026';
  }

  const day = d.getDate();
  const month = INDONESIAN_MONTHS[d.getMonth()] || 'November';
  const year = d.getFullYear() || 2026;

  if (withTime) {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
  }

  return `${day} ${month} ${year}`;
};

/**
 * Get the latest update timestamp from a list of projects.
 * Default fallback is "18 November [activeYear]".
 */
export const getLatestProjectUpdateFormatted = (projects = [], activeYear = 2026, withTime = false) => {
  if (!projects || projects.length === 0) {
    return getActiveMondayFormatted();
  }

  let latestDate = null;

  for (const p of projects) {
    // 1. check p.updatedAt
    if (p.updatedAt) {
      const d = new Date(p.updatedAt);
      if (!isNaN(d.getTime())) {
        if (!latestDate || d.getTime() > latestDate.getTime()) {
          latestDate = d;
        }
      }
    }
    // 2. check p.dataFisik?.tanggalUpdate
    if (p.dataFisik?.tanggalUpdate) {
      const d = new Date(p.dataFisik.tanggalUpdate);
      if (!isNaN(d.getTime())) {
        if (!latestDate || d.getTime() > latestDate.getTime()) {
          latestDate = d;
        }
      }
    }
    // 3. check p.dataKeuangan?.terminHistory latest
    if (Array.isArray(p.dataKeuangan?.terminHistory)) {
      for (const t of p.dataKeuangan.terminHistory) {
        if (t.tanggal) {
          const d = new Date(t.tanggal);
          if (!isNaN(d.getTime())) {
            if (!latestDate || d.getTime() > latestDate.getTime()) {
              latestDate = d;
            }
          }
        }
      }
    }
  }

  if (!latestDate) {
    return getActiveMondayFormatted();
  }

  return formatIndonesianDate(latestDate, withTime);
};

/**
 * Menghitung dan memformat tanggal Hari Senin pada minggu aktif berjalan.
 * Format: "Senin, [Tanggal] [Nama Bulan] [Tahun]"
 * Contoh: Jika sekarang hari Selasa, 17 November 2026,
 * maka akan menghasilkan: "Senin, 16 November 2026".
 * Keterangan update selalu berubah mengikuti hari Senin pada minggu yang aktif.
 */
export const getActiveMondayFormatted = (referenceDate = new Date()) => {
  const d = referenceDate instanceof Date && !isNaN(referenceDate.getTime())
    ? new Date(referenceDate)
    : new Date();

  // 0 = Minggu, 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat, 6 = Sabtu
  const day = d.getDay();
  // Di Indonesia awal pekan kerja aktif adalah Senin.
  // Jika hari Minggu (0), pekan yang berjalan ditutup dan Senin aktif berjarak 6 hari lalu.
  // Jika Senin (1), jarak 0 hari. Selasa (2), jarak 1 hari, dst.
  const diff = day === 0 ? 6 : day - 1;

  const monday = new Date(d);
  monday.setDate(d.getDate() - diff);

  const dateNum = monday.getDate();
  const monthName = INDONESIAN_MONTHS[monday.getMonth()] || 'November';
  const yearNum = monday.getFullYear();

  return `Senin, ${dateNum} ${monthName} ${yearNum}`;
};
