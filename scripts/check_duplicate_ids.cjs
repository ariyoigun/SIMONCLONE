const fs = require('fs');

const file = fs.readFileSync('src/data/monitoringPaket2026.js', 'utf8');

// Match all "id": "..."
const idMatches = [...file.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total IDs found in monitoringPaket2026:', idMatches.length);

const counts = {};
idMatches.forEach(id => {
  counts[id] = (counts[id] || 0) + 1;
});

const duplicates = Object.entries(counts).filter(([id, c]) => c > 1 && !id.startsWith('TRM-') && !id.startsWith('log_'));
console.log('Duplicate project IDs in monitoringPaket2026:', duplicates);
