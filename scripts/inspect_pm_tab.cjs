const fs = require('fs');
const content = fs.readFileSync('src/components/ProjectModal.jsx', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes("activeTab === 'fisik'"));
console.log(lines.slice(idx, idx + 80).join('\n'));
