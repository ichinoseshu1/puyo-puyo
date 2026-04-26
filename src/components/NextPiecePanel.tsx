'use client';

import { CELL_SIZE } from '@/lib/constants';
import { PieceTemplate } from '@/lib/types';
import PuyoCell from './PuyoCell';

interface Props {
  nextTemplate: PieceTemplate;
}

export default function NextPiecePanel({ nextTemplate }: Props) {
  const size = Math.round(CELL_SIZE * 0.85);

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border:     '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        minWidth: size * 2 + 32,
      }}
    >
      <p className="text-xs font-semibold tracking-widest text-center text-blue-300/70 uppercase">
        Next
      </p>
      <div className="flex flex-col items-center gap-0">
        <PuyoCell color={nextTemplate.satelliteColor} size={size} />
        <PuyoCell color={nextTemplate.pivotColor}     size={size} />
      </div>
    </div>
  );
}
