'use client';

import { BOARD_COLS, BOARD_ROWS, CELL_SIZE } from '@/lib/constants';
import { Board, Cell, Piece } from '@/lib/types';
import PuyoCell from './PuyoCell';

interface Props {
  board: Board;
  currentPiece: Piece | null;
  clearingCells: Set<string>;
}

export default function GameBoard({ board, currentPiece, clearingCells }: Props) {
  const display: { cell: Cell; isClearing: boolean }[][] =
    board.map((row, r) =>
      row.map((cell, c) => ({
        cell,
        isClearing: clearingCells.has(`${r},${c}`),
      })),
    );

  if (currentPiece) {
    for (const { pos, color } of [
      { pos: currentPiece.pivot,     color: currentPiece.pivotColor },
      { pos: currentPiece.satellite, color: currentPiece.satelliteColor },
    ]) {
      if (pos.row >= 0 && pos.row < BOARD_ROWS) {
        display[pos.row][pos.col] = { cell: color, isClearing: false };
      }
    }
  }

  const width  = BOARD_COLS * CELL_SIZE;
  const height = BOARD_ROWS * CELL_SIZE;

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        width,
        height,
        background: 'rgba(10, 12, 40, 0.85)',
        border:     '1px solid rgba(100, 120, 255, 0.35)',
        boxShadow:  '0 0 40px rgba(80, 100, 255, 0.15), inset 0 0 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.07 }}>
        {Array.from({ length: BOARD_ROWS + 1 }, (_, i) => (
          <div key={`h${i}`} className="absolute w-full border-t border-blue-300"
            style={{ top: i * CELL_SIZE }} />
        ))}
        {Array.from({ length: BOARD_COLS + 1 }, (_, i) => (
          <div key={`v${i}`} className="absolute h-full border-l border-blue-300"
            style={{ left: i * CELL_SIZE }} />
        ))}
      </div>

      {/* Cells */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows:    `repeat(${BOARD_ROWS}, ${CELL_SIZE}px)`,
        }}
      >
        {display.map((row, r) =>
          row.map(({ cell, isClearing }, c) => (
            <PuyoCell
              key={`${r}-${c}`}
              color={cell}
              isClearing={isClearing}
            />
          )),
        )}
      </div>
    </div>
  );
}
