const fs = require('fs');
let c = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// 1. Bump version to 2026_real_v5
c = c.replace(/2026_real_v4/g, '2026_real_v5');

// 2. Add simon_paket_pekerjaan_2026 to version wipe
if (!c.includes("localStorage.removeItem('simon_paket_pekerjaan_2026');")) {
  c = c.replace(
    "localStorage.removeItem('simon_projects_v2');",
    "localStorage.removeItem('simon_projects_v2');\r\n      localStorage.removeItem('simon_paket_pekerjaan_2026');"
  );
}

// 3. Import MONITORING_PAKET_2026 if not imported
if (!c.includes('MONITORING_PAKET_2026')) {
  c = c.replace(
    "import { INITIAL_USERS, INITIAL_PROJECTS } from '../data/initialData';",
    "import { INITIAL_USERS, INITIAL_PROJECTS } from '../data/initialData';\r\nimport { MONITORING_PAKET_2026 } from '../data/monitoringPaket2026';"
  );
}

// 4. Add paketPekerjaanList state and functions
if (!c.includes('const [paketPekerjaanList, setPaketPekerjaanList]')) {
  const paketStateCode = `
  // Master Data Paket Pekerjaan TA 2026 (478 Paket dari Monitoring Paket 2026.xlsx)
  const [paketPekerjaanList, setPaketPekerjaanList] = useState(() => {
    const saved = localStorage.getItem('simon_paket_pekerjaan_2026');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return MONITORING_PAKET_2026;
  });

  useEffect(() => {
    localStorage.setItem('simon_paket_pekerjaan_2026', JSON.stringify(paketPekerjaanList));
  }, [paketPekerjaanList]);

  const updatePaketPekerjaan = (id, updatedFields) => {
    setPaketPekerjaanList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const addPaketPekerjaan = (newPaket) => {
    setPaketPekerjaanList((prev) => [newPaket, ...prev]);
  };

  const deletePaketPekerjaan = (id) => {
    setPaketPekerjaanList((prev) => prev.filter((item) => item.id !== id));
  };

  const accessiblePaketPekerjaan = React.useMemo(() => {
    if (!currentUser) return paketPekerjaanList;
    const roleDef = ROLE_DEFINITIONS[currentUser.role] || {};
    if (roleDef.canSeeAllBidang || currentUser.role === 'superadmin') {
      return paketPekerjaanList;
    }
    if (currentUser.bidangId) {
      return paketPekerjaanList.filter((p) => p.bidangId === currentUser.bidangId);
    }
    return paketPekerjaanList;
  }, [paketPekerjaanList, currentUser]);
`;

  c = c.replace(
    "// Active Navigation Tab",
    `${paketStateCode}\n  // Active Navigation Tab`
  );
}

// 5. Expose in value
if (!c.includes('paketPekerjaanList,')) {
  c = c.replace(
    "accessibleProjects,",
    "accessibleProjects,\r\n    paketPekerjaanList,\r\n    accessiblePaketPekerjaan,\r\n    updatePaketPekerjaan,\r\n    addPaketPekerjaan,\r\n    deletePaketPekerjaan,"
  );
}

fs.writeFileSync('src/context/AppContext.jsx', c, 'utf8');
console.log('AppContext.jsx updated with separate paketPekerjaanList state!');
