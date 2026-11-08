const fs = require('fs');
const path = require('path');

const ctxPath = path.resolve('./src/context/AppContext.jsx');
let content = fs.readFileSync(ctxPath, 'utf8');

// 1. Add setPaketPekerjaanList to remote load using regex
content = content.replace(/(setProjects\(json\.data\.projects\.map\(mapProjectClean\)\);[\r\n\s]*})/, (match) => {
  return match + `\n            if (Array.isArray(json.data.paketPekerjaanList) && json.data.paketPekerjaanList.length > 0) {\n              setPaketPekerjaanList(json.data.paketPekerjaanList);\n            }`;
});

// 2. Add syncPaketToRemote and deletePaketFromRemote
const syncFns = `
  const syncPaketToRemote = async (paket) => {
    try {
      await fetch('/api/api.php?action=save_paket_pekerjaan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paket)
      });
    } catch (e) {
      // offline fallback
    }
  };

  const deletePaketFromRemote = async (paketId) => {
    try {
      await fetch('/api/api.php?action=delete_paket_pekerjaan&id=' + encodeURIComponent(paketId));
    } catch (e) {
      // offline fallback
    }
  };
`;

content = content.replace(/(const deleteProjectFromRemote = async \(projectId\) => {[\s\S]*?};\r?\n)/, (match) => {
  return match + syncFns;
});

fs.writeFileSync(ctxPath, content, 'utf8');
console.log('Successfully patched AppContext.jsx with remote paket functions');
