import React, { useState } from 'react';

/**
 * DonutPieChart - Interactive SVG Donut & Pie Chart Component
 * Ringan, responsif, tajam, dan mendukung interaksi hover & klik filter.
 */
const DonutPieChart = ({
  data = [],
  title = '',
  subtitle = '',
  size = 200,
  thickness = 32,
  centerValue = null,
  centerLabel = '',
  isCurrency = false,
  currencyUnit = 'Rp',
  onSegmentClick = null,
  activeFilter = null,
  showLegend = true,
  legendPosition = 'right' // 'right' | 'bottom'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Filter out zero or negative values for drawing arcs, but keep for total
  const validData = data.filter((d) => d && (parseFloat(d.value) || 0) > 0);
  const total = data.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

  const radius = size / 2;
  const innerRadius = radius - thickness;
  const center = radius;

  // Format value helper
  const formatVal = (val) => {
    if (isCurrency) {
      if (val >= 1000000000) {
        return `Rp ${(val / 1000000000).toFixed(2)} M`;
      } else if (val >= 1000000) {
        return `Rp ${(val / 1000000).toFixed(1)} Jt`;
      }
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return val.toLocaleString('id-ID');
  };

  // Calculate SVG arc paths
  let currentAngle = -90; // Start at top (12 o'clock)
  const segments = validData.map((item, index) => {
    const value = parseFloat(item.value) || 0;
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const angle = total > 0 ? (value / total) * 360 : 0;

    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Arc points
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    // SVG path definition
    // M x1 y1 A r r 0 largeArc 1 x2 y2 L x3 y3 A innerR innerR 0 largeArc 0 x4 y4 Z
    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');

    return {
      ...item,
      index,
      value,
      percentage,
      path,
      startAngle,
      endAngle
    };
  });

  const displayCenterValue =
    centerValue !== null
      ? centerValue
      : isCurrency
      ? total >= 1000000000
        ? `Rp ${(total / 1000000000).toFixed(1)}M`
        : `Rp ${(total / 1000000).toFixed(0)}Jt`
      : total;

  const displayCenterLabel = centerLabel || (isCurrency ? 'Total' : 'Paket');

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 14,
        padding: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Chart Header */}
      {(title || subtitle) && (
        <div style={{ marginBottom: 14 }}>
          {title && (
            <h4
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#0f2c59',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#0284c7'
                }}
              />
              {title}
            </h4>
          )}
          {subtitle && (
            <p style={{ fontSize: 11.5, color: '#64748b', margin: '3px 0 0 14px' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Chart Body: SVG + Legend */}
      <div
        style={{
          display: 'flex',
          flexDirection: legendPosition === 'bottom' ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          flex: 1
        }}
      >
        {/* SVG Circle */}
        <div
          style={{
            position: 'relative',
            width: size,
            height: size,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {total === 0 ? (
            <div
              style={{
                width: size - 20,
                height: size - 20,
                borderRadius: '50%',
                border: '3px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: 12,
                fontWeight: 600,
                textAlign: 'center',
                padding: 10
              }}
            >
              Tidak ada data
            </div>
          ) : (
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              style={{ overflow: 'visible', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
            >
              {segments.map((seg, idx) => {
                const isHovered = hoveredIndex === idx;
                const isSelected = activeFilter && activeFilter === seg.filterKey;

                return (
                  <path
                    key={idx}
                    d={seg.path}
                    fill={seg.color || '#0284c7'}
                    stroke="#ffffff"
                    strokeWidth={2}
                    style={{
                      cursor: onSegmentClick ? 'pointer' : 'default',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: `${center}px ${center}px`,
                      transform: isHovered || isSelected ? 'scale(1.05)' : 'scale(1)',
                      opacity: hoveredIndex !== null && !isHovered ? 0.65 : 1,
                      filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none'
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      if (onSegmentClick) {
                        onSegmentClick(seg);
                      }
                    }}
                  >
                    <title>
                      {seg.label}: {formatVal(seg.value)} ({seg.percentage.toFixed(1)}%)
                    </title>
                  </path>
                );
              })}
            </svg>
          )}

          {/* Center Info Overlay */}
          {total > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                textAlign: 'center'
              }}
            >
              {hoveredIndex !== null && segments[hoveredIndex] ? (
                <>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: segments[hoveredIndex].color || '#0f2c59',
                      lineHeight: 1.1
                    }}
                  >
                    {segments[hoveredIndex].percentage.toFixed(1)}%
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#475569',
                      maxWidth: size - thickness * 2 - 10,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginTop: 2
                    }}
                  >
                    {formatVal(segments[hoveredIndex].value)}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: typeof displayCenterValue === 'string' && displayCenterValue.length > 7 ? 15 : 18,
                      fontWeight: 900,
                      color: '#0f2c59',
                      lineHeight: 1.1
                    }}
                  >
                    {displayCenterValue}
                  </div>
                  {displayCenterLabel && (
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        marginTop: 2
                      }}
                    >
                      {displayCenterLabel}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && data.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              flex: 1,
              width: legendPosition === 'bottom' ? '100%' : 'auto',
              minWidth: 140
            }}
          >
            {data.map((item, idx) => {
              const val = parseFloat(item.value) || 0;
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
              const isHovered = hoveredIndex === idx;
              const isSelected = activeFilter && activeFilter === item.filterKey;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 8px',
                    borderRadius: 6,
                    background: isSelected
                      ? '#eff6ff'
                      : isHovered
                      ? '#f8fafc'
                      : 'transparent',
                    border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                    cursor: onSegmentClick ? 'pointer' : 'default',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    if (onSegmentClick) {
                      onSegmentClick(item);
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: item.color || '#0284c7',
                        flexShrink: 0
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: isSelected ? 800 : 600,
                        color: '#334155',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.label}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0f2c59' }}>
                      {formatVal(val)}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: '#64748b',
                        marginLeft: 6
                      }}
                    >
                      ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutPieChart;
