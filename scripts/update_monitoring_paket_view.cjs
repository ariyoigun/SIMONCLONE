const fs = require('fs');
let c = fs.readFileSync('src/views/MonitoringPaketView.jsx', 'utf8');

c = c.replace(
  "const { projects = [], canEditProject, currentUser, updateProject } = useApp();",
  `const {
    paketPekerjaanList = [],
    accessiblePaketPekerjaan = [],
    canEditProject,
    currentUser,
    updatePaketPekerjaan
  } = useApp();
  const activeList = accessiblePaketPekerjaan.length > 0 ? accessiblePaketPekerjaan : paketPekerjaanList;`
);

c = c.replace(
  "return projects.filter((p) => {",
  "return activeList.filter((p) => {"
);

c = c.replace(
  "updateProject(projectId, {",
  "updatePaketPekerjaan(projectId, {"
);

fs.writeFileSync('src/views/MonitoringPaketView.jsx', c, 'utf8');
console.log('MonitoringPaketView.jsx updated to use paketPekerjaanList!');
