const fs = require('fs');
const content = fs.readFileSync('src/components/ProjectModal.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes("activeTab === 'fisik'")) {
    console.log(`Line ${i+1}: ${l}`);
  }
});
