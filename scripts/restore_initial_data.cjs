const fs = require('fs');
let c = fs.readFileSync('src/data/initialData.js', 'utf8');
c = c.replace(
  'export const INITIAL_PROJECTS = MONITORING_PAKET_2026;',
  'export const INITIAL_PROJECTS = REAL_PROJECTS_2026;\r\nexport const INITIAL_PAKET_PEKERJAAN = MONITORING_PAKET_2026;'
);
fs.writeFileSync('src/data/initialData.js', c, 'utf8');
console.log('Restored INITIAL_PROJECTS to REAL_PROJECTS_2026 in initialData.js');
