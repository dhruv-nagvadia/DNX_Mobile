import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export const BRAND_BLUE = '#2563EB';

interface BrandMarkProps {
  size?: number;
  color?: string;
}

/** DNX logo mark: an "X" person — round head over two crossing strokes. */
export function BrandMark({ size = 56, color = BRAND_BLUE }: BrandMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={19} r={12} fill={color} />
      <Line
        x1={22}
        y1={40}
        x2={76}
        y2={86}
        stroke={color}
        strokeWidth={17}
        strokeLinecap="round"
      />
      <Line
        x1={78}
        y1={40}
        x2={24}
        y2={86}
        stroke={color}
        strokeWidth={17}
        strokeLinecap="round"
      />
    </Svg>
  );
}
