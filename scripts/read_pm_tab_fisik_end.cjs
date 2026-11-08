const fs = require('fs');
const content = fs.readFileSync('src/components/ProjectModal.jsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1910, 1960).join('\n'));
