const fs = require('fs');

const { MONITORING_PAKET_2026 } = require('../src/data/monitoringPaket2026.js');

const seen = new Set();
let duplicatesFixed = 0;

const updatedList = MONITORING_PAKET_2026.map((item, idx) => {
  const originalId = item.id || `pkt_${item.no || idx + 1}`;
  let uniqueId = originalId;
  
  if (seen.has(uniqueId)) {
    uniqueId = `pkt_${item.no || idx + 1}_${originalId}`;
    duplicatesFixed++;
  }
  
  // If still duplicate
  while (seen.has(uniqueId)) {
    uniqueId = `pkt_${item.no || idx + 1}_${Math.random().toString(36).slice(2, 7)}`;
    duplicatesFixed++;
  }
  
  seen.add(uniqueId);
  return {
    ...item,
    id: uniqueId
  };
});

console.log(`Deduplicated IDs: ${duplicatesFixed} duplicate IDs fixed out of ${updatedList.length} items.`);

const content = `/**
 * Basis Data Resmi 478 Paket Monitoring Pekerjaan TA 2026
 * Sumber: Monitoring Paket 2026.xlsx
 * Kategori: 1. Konstruksi (Fisik) [284], 2. Jasa Konsultansi [135], 3. Pengadaan Barang [53], 4. Jasa Lainnya [6]
 */

export const MONITORING_PAKET_2026 = ${JSON.stringify(updatedList, null, 2)};
`;

fs.writeFileSync('src/data/monitoringPaket2026.js', content, 'utf8');
console.log('Successfully updated src/data/monitoringPaket2026.js');
