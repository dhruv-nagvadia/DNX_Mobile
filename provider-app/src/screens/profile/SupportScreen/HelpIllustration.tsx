import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

const SPARK = '#FACC15';

/** Blue speech bubble with a "?" (plus a paler bubble behind it and a few
 * sparkle strokes), drawn with SVG shapes so it needs no image asset. */
export function HelpIllustration({ size = 84 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 84 84">
      <Defs>
        <LinearGradient id="helpBubbleFront" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7DB8FF" />
          <Stop offset="1" stopColor="#2563EB" />
        </LinearGradient>
        <LinearGradient id="helpBubbleBack" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#BFDBFE" />
          <Stop offset="1" stopColor="#60A5FA" />
        </LinearGradient>
      </Defs>

      {/* Back bubble */}
      <G opacity={0.85}>
        <Rect x={4} y={36} width={38} height={30} rx={10} fill="url(#helpBubbleBack)" />
        <Path d="M14 64 L12 76 L24 65 Z" fill="#60A5FA" />
      </G>

      {/* Front bubble */}
      <Rect x={18} y={18} width={52} height={42} rx={13} fill="url(#helpBubbleFront)" stroke="#DBEAFE" strokeWidth={1.5} />
      <Path d="M30 58 L26 72 L42 59 Z" fill="#2F6FE8" />
      <SvgText x={44} y={50} fontSize={30} fontWeight="800" fill="#FFFFFF" textAnchor="middle">
        ?
      </SvgText>

      {/* Sparkles */}
      <Path d="M62 12 L65 4" stroke={SPARK} strokeWidth={3} strokeLinecap="round" />
      <Path d="M69 16 L76 10" stroke={SPARK} strokeWidth={3} strokeLinecap="round" />
      <Path d="M72 23 L80 22" stroke={SPARK} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}
