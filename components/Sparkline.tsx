import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({
  data,
  width = 60,
  height = 20,
  color = '#4A4A4A',
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <View style={{ width, height }} />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / (range || 1)) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const path = `M ${points}`;

  return (
    <View>
      <Svg width={width} height={height}>
        <Path d={path} fill="none" stroke={color} strokeWidth="1.5" />
      </Svg>
    </View>
  );
} 