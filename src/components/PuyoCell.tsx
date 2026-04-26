'use client';

import { CELL_SIZE, PUYO_STYLES } from '@/lib/constants';
import { PuyoColor } from '@/lib/types';

interface Props {
  color: PuyoColor | null;
  isClearing?: boolean;
  size?: number;
}

export default function PuyoCell({ color, isClearing = false, size = CELL_SIZE }: Props) {
  const pad = Math.round(size * 0.07);
  const inner = size - pad * 2;

  if (!color) {
    return (
      <div
        style={{ width: size, height: size, padding: pad }}
        className="flex items-center justify-center"
      >
        <div style={{ width: inner, height: inner }} className="rounded-full bg-white/[0.03]" />
      </div>
    );
  }

  const style = PUYO_STYLES[color];
  const eyeSize = Math.max(4, Math.round(inner * 0.16));
  const eyeTop  = `${Math.round(inner * 0.30)}px`;
  const eyeLeft = `${Math.round(inner * 0.24)}px`;
  const eyeRight = `${Math.round(inner * 0.24)}px`;

  return (
    <div
      style={{ width: size, height: size, padding: pad }}
      className="flex items-center justify-center"
    >
      <div
        className={`relative rounded-full select-none ${isClearing ? 'puyo-clearing' : ''}`}
        style={{ width: inner, height: inner, background: style.gradient, boxShadow: style.glow }}
      >
        {/* Shine highlight */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width:  `${Math.round(inner * 0.38)}px`,
            height: `${Math.round(inner * 0.28)}px`,
            top:    `${Math.round(inner * 0.10)}px`,
            left:   `${Math.round(inner * 0.14)}px`,
            background: `radial-gradient(ellipse, ${style.shine}, transparent 70%)`,
          }}
        />
        {/* Left eye */}
        <div className="absolute rounded-full bg-white pointer-events-none"
          style={{ width: eyeSize, height: eyeSize, top: eyeTop, left: eyeLeft }} />
        {/* Right eye */}
        <div className="absolute rounded-full bg-white pointer-events-none"
          style={{ width: eyeSize, height: eyeSize, top: eyeTop, right: eyeRight }} />
        {/* Pupils */}
        <div className="absolute rounded-full bg-gray-800 pointer-events-none"
          style={{ width: Math.max(2, eyeSize - 2), height: Math.max(2, eyeSize - 2), top: `calc(${eyeTop} + 1px)`, left: `calc(${eyeLeft} + 1px)` }} />
        <div className="absolute rounded-full bg-gray-800 pointer-events-none"
          style={{ width: Math.max(2, eyeSize - 2), height: Math.max(2, eyeSize - 2), top: `calc(${eyeTop} + 1px)`, right: `calc(${eyeRight} + 1px)` }} />
      </div>
    </div>
  );
}
