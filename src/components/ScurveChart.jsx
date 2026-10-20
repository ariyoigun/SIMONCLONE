import React, { useState } from 'react';

const ScurveChart = ({ data = [], height = 280, showLegend = true }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic', background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
        Belum ada data Kurva S mingguan untuk paket ini.
      </div>
    );
  }

  // Dimensions
  const padding = { top: 25, right: 35, bottom: 40, left: 45 };
  const width = 680;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxWeeks = Math.max(data.length, 1);
  const getX = (index) => padding.left + (index / (maxWeeks - 1 || 1)) * innerWidth;
  const getY = (val) => padding.top + innerHeight - ((val || 0) / 100) * innerHeight;

  // Build SVG path strings
  // Rencana line (dashed orange/blue)
  const rencanaPoints = data.map((d, i) => `${getX(i)},${getY(d.rencana)}`).join(' ');

  // Realisasi line (solid emerald/red based on deviation)
  const realisasiData = data.filter((d) => d.realisasi !== null && d.realisasi !== undefined);
  const realisasiPoints = realisasiData.map((d, i) => `${getX(i)},${getY(d.realisasi)}`).join(' ');

  // Area under realisasi
  const lastRealIndex = realisasiData.length - 1;
  const realisasiArea = realisasiData.length > 0
    ? `${padding.left},${padding.top + innerHeight} ` +
      realisasiData.map((d, i) => `${getX(i)},${getY(d.realisasi)}`).join(' ') +
      ` ${getX(lastRealIndex)},${padding.top + innerHeight}`
    : '';

  // Current latest deviation
  const latestItem = realisasiData.length > 0 ? realisasiData[realisasiData.length - 1] : null;
  const currentDev = latestItem ? (latestItem.realisasi - latestItem.rencana).toFixed(1) : 0;
  const isLagging = currentDev < 0;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="realisasiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLagging ? '#ef4444' : '#10b981'} stopOpacity="0.25" />
            <stop offset="100%" stopColor={isLagging ? '#ef4444' : '#10b981'} stopOpacity="0.0" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Y-Axis Grid Lines & Labels */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray={val === 0 || val === 100 ? '0' : '3 3'}
                strokeWidth={val === 0 ? 1.5 : 1}
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
                fontWeight="600"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* X-Axis labels (Minggu) */}
        {data.map((d, i) => {
          const x = getX(i);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={padding.top + innerHeight}
                x2={x}
                y2={padding.top + innerHeight + 5}
                stroke="#94a3b8"
                strokeWidth="1"
              />
              <text
                x={x}
                y={padding.top + innerHeight + 18}
                textAnchor="middle"
                fontSize="10.5"
                fill="#64748b"
                fontWeight="600"
              >
                M{d.minggu}
              </text>
            </g>
          );
        })}

        {/* Realisasi Fill Area */}
        {realisasiArea && (
          <polygon points={realisasiArea} fill="url(#realisasiGrad)" />
        )}

        {/* Rencana Line (Target) */}
        <polyline
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.5"
          strokeDasharray="5 4"
          points={rencanaPoints}
        />

        {/* Realisasi Line (Actual) */}
        {realisasiPoints && (
          <polyline
            fill="none"
            stroke={isLagging ? '#dc2626' : '#059669'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={realisasiPoints}
            filter="url(#shadow)"
          />
        )}

        {/* Points on Rencana */}
        {data.map((d, i) => (
          <circle
            key={`ren-${i}`}
            cx={getX(i)}
            cy={getY(d.rencana)}
            r="3.5"
            fill="#ffffff"
            stroke="#0284c7"
            strokeWidth="2"
          />
        ))}

        {/* Points on Realisasi */}
        {realisasiData.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.realisasi);
          const isHovered = hoveredPoint && hoveredPoint.index === i;
          return (
            <g key={`real-${i}`}>
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 7 : 4.5}
                fill={isLagging ? '#dc2626' : '#059669'}
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={() => setHoveredPoint({ ...d, index: i, cx, cy })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${(hoveredPoint.cx / width) * 100}%`,
            top: `${(hoveredPoint.cy / height) * 100}%`,
            transform: 'translate(-50%, -120%)',
            background: '#0f172a',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 12,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            zIndex: 10
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 2 }}>Minggu ke-{hoveredPoint.minggu}</div>
          <div style={{ color: '#38bdf8' }}>Rencana: {hoveredPoint.rencana}%</div>
          <div style={{ color: hoveredPoint.realisasi >= hoveredPoint.rencana ? '#4ade80' : '#f87171' }}>
            Realisasi: {hoveredPoint.realisasi}% ({hoveredPoint.realisasi >= hoveredPoint.rencana ? '+' : ''}
            {(hoveredPoint.realisasi - hoveredPoint.rencana).toFixed(1)}%)
          </div>
        </div>
      )}

      {/* Legend & Summary */}
      {showLegend && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
            padding: '8px 12px',
            background: '#f8fafc',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 14, height: 3, borderTop: '2px dashed #0284c7' }} />
              <span style={{ color: '#475569', fontWeight: 600 }}>Target Rencana</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 14, height: 3, background: isLagging ? '#dc2626' : '#059669', borderRadius: 2 }} />
              <span style={{ color: '#475569', fontWeight: 600 }}>Realisasi Fisik</span>
            </div>
          </div>
          {latestItem && (
            <div style={{ fontWeight: 700 }}>
              Deviasi Terkini:{' '}
              <span style={{ color: isLagging ? '#dc2626' : '#059669' }}>
                {parseFloat(currentDev) >= 0 ? `+${currentDev}% (Aman)` : `${currentDev}% (Kritis)`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScurveChart;
