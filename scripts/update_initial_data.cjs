const fs = require('fs');
let c = fs.readFileSync('src/data/initialData.js', 'utf8');
c = c.replace(
  "import { REAL_PROJECTS_2026 } from './realProjects2026.js';",
  "import { REAL_PROJECTS_2026 } from './realProjects2026.js';\r\nimport { MONITORING_PAKET_2026 } from './monitoringPaket2026.js';"
);
c = c.replace(
  "export const INITIAL_PROJECTS = REAL_PROJECTS_2026;",
  "export const INITIAL_PROJECTS = MONITORING_PAKET_2026;"
);
fs.writeFileSync('src/data/initialData.js', c, 'utf8');
console.log('initialData.js updated with MONITORING_PAKET_2026!');

