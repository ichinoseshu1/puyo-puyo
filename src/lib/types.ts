export type PuyoColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'nuisance';
export type Cell = PuyoColor | null;
export type Board = Cell[][];

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  pivot: Position;
  satellite: Position;
  pivotColor: PuyoColor;
  satelliteColor: PuyoColor;
}

export interface PieceTemplate {
  pivotColor: PuyoColor;
  satelliteColor: PuyoColor;
}

export type GamePhase = 'idle' | 'playing' | 'clearing' | 'gameover';
