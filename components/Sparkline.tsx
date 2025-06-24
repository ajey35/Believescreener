import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Line, G, Text as SvgText, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

function getSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midX = (p0.x + p1.x) / 2;
    d += ` Q ${midX},${p0.y} ${p1.x},${p1.y}`;
  }
  return d;
}

export function Sparkline({
  data,
  width = 260,
  height = 80,
  color = '#4A4A4A',
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <View style={{ width, height }} />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 24;
  const chartWidth = width - padding * 1.2;
  const chartHeight = height - padding * 1.2;

  // Calculate points
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d - min) / range) * chartHeight;
    return { x, y };
  });

  // Smooth path for the line
  const path = getSmoothPath(points);

  // Area under the curve for gradient fill
  const areaPoints = [
    { x: points[0].x, y: height - padding * 0.2 },
    ...points,
    { x: points[points.length - 1].x, y: height - padding * 0.2 },
  ];
  const areaPath =
    `M ${areaPoints[0].x},${areaPoints[0].y} ` +
    points
      .map((p, i) => {
        if (i === 0) return '';
        const p0 = points[i - 1];
        const midX = (p0.x + p.x) / 2;
        return `Q ${midX},${p0.y} ${p.x},${p.y}`;
      })
      .join(' ') +
    ` L ${areaPoints[areaPoints.length - 1].x},${areaPoints[areaPoints.length - 1].y} Z`;

  // Y axis ticks (min, mid, max)
  const yTicks = [min, min + range / 2, max];
  // X axis ticks (first, mid, last)
  const xTicks = [0, Math.floor((data.length - 1) / 2), data.length - 1];
  const xLabels = ['-24h', '-12h', 'Now'];

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2={height}>
            <Stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </LinearGradient>
        </Defs>
        {/* Grid lines and axes */}
        {/* Y axis */}
        <Line x1={padding} y1={padding} x2={padding} y2={height - padding * 0.2} stroke="#D1D5DB" strokeWidth={1} />
        {/* X axis */}
        <Line x1={padding} y1={height - padding * 0.2} x2={width - padding * 0.2} y2={height - padding * 0.2} stroke="#D1D5DB" strokeWidth={1} />
        {/* Y axis ticks and labels */}
        {yTicks.map((tick, i) => {
          const y = padding + chartHeight - ((tick - min) / range) * chartHeight;
          return (
            <G key={i}>
              <Line x1={padding - 4} y1={y} x2={width - padding * 0.2} y2={y} stroke="#F3F4F6" strokeWidth={1} />
              <SvgText
                x={padding - 8}
                y={y + 4}
                fontSize="10"
                fill="#6B7280"
                textAnchor="end"
              >
                {tick.toFixed(2)}
              </SvgText>
            </G>
          );
        })}
        {/* X axis ticks and labels */}
        {xTicks.map((tick, i) => {
          const x = padding + (tick / (data.length - 1)) * chartWidth;
          return (
            <G key={i}>
              <Line x1={x} y1={height - padding * 0.2} x2={x} y2={padding} stroke="#F3F4F6" strokeWidth={1} />
              <SvgText
                x={x}
                y={height - padding * 0.2 + 16}
                fontSize="10"
                fill="#6B7280"
                textAnchor="middle"
              >
                {xLabels[i]}
              </SvgText>
            </G>
          );
        })}
        {/* Area under the curve */}
        <Path d={areaPath} fill="url(#sparklineGradient)" />
        {/* Sparkline path (smooth) */}
        <Path d={path} fill="none" stroke={color} strokeWidth="2.5" />
        {/* End point dot */}
        <G>
          <Circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={4}
            fill={color}
            stroke="#fff"
            strokeWidth={1.5}
          />
        </G>
      </Svg>
    </View>
  );
}