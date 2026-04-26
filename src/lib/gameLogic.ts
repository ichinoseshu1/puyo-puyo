import { BOARD_COLS, BOARD_ROWS, MIN_MATCH } from './constants';
import { Board, Cell, Piece, PieceTemplate, Position, PuyoColor } from './types';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array<Cell>(BOARD_COLS).fill(null));
}

export function createPiece(pivotColor: PuyoColor, satelliteColor: PuyoColor): Piece {
  return {
    pivot:     { row: 1, col: 2 },
    satellite: { row: 0, col: 2 },
    pivotColor,
    satelliteColor,
  };
}

export function createPieceFromTemplate(t: PieceTemplate): Piece {
  return createPiece(t.pivotColor, t.satelliteColor);
}

export function isValidPosition(board: Board, piece: Piece): boolean {
  for (const pos of [piece.pivot, piece.satellite]) {
    if (pos.col < 0 || pos.col >= BOARD_COLS) return false;
    if (pos.row >= BOARD_ROWS) return false;
    if (pos.row < 0) continue; // satellite may start above board
    if (board[pos.row][pos.col] !== null) return false;
  }
  return true;
}

export function movePiece(piece: Piece, dr: number, dc: number): Piece {
  return {
    ...piece,
    pivot:     { row: piece.pivot.row + dr,     col: piece.pivot.col + dc },
    satellite: { row: piece.satellite.row + dr, col: piece.satellite.col + dc },
  };
}

export function rotatePiece(piece: Piece, dir: 1 | -1): Piece {
  const dr = piece.satellite.row - piece.pivot.row;
  const dc = piece.satellite.col - piece.pivot.col;
  // CW: (dr,dc) → (dc,−dr)   CCW: (dr,dc) → (−dc,dr)
  const newDr = dir === 1 ? dc  : -dc;
  const newDc = dir === 1 ? -dr :  dr;
  return {
    ...piece,
    satellite: { row: piece.pivot.row + newDr, col: piece.pivot.col + newDc },
  };
}

export function tryRotate(piece: Piece, board: Board, dir: 1 | -1): Piece {
  const rotated = rotatePiece(piece, dir);
  if (isValidPosition(board, rotated)) return rotated;
  // Wall kicks
  for (const [kdr, kdc] of [[0,-1],[0,1],[0,-2],[0,2],[-1,0]]) {
    const kicked = movePiece(rotated, kdr, kdc);
    if (isValidPosition(board, kicked)) return kicked;
  }
  return piece;
}

export function lockPiece(board: Board, piece: Piece): Board {
  const next = board.map(r => [...r]);
  for (const { pos, color } of [
    { pos: piece.pivot,     color: piece.pivotColor },
    { pos: piece.satellite, color: piece.satelliteColor },
  ]) {
    if (pos.row >= 0 && pos.row < BOARD_ROWS && pos.col >= 0 && pos.col < BOARD_COLS) {
      next[pos.row][pos.col] = color;
    }
  }
  return next;
}

export function ghostPiece(piece: Piece, board: Board): Piece {
  let ghost = piece;
  while (isValidPosition(board, movePiece(ghost, 1, 0))) {
    ghost = movePiece(ghost, 1, 0);
  }
  return ghost;
}

export function findMatches(board: Board): Position[][] {
  const visited: boolean[][] = Array.from({ length: BOARD_ROWS }, () =>
    Array(BOARD_COLS).fill(false),
  );
  const groups: Position[][] = [];

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const color = board[r][c];
      if (!color || color === 'nuisance' || visited[r][c]) continue;

      const group: Position[] = [];
      const queue: Position[] = [{ row: r, col: c }];
      visited[r][c] = true;

      while (queue.length) {
        const pos = queue.shift()!;
        group.push(pos);
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr = pos.row + dr, nc = pos.col + dc;
          if (nr >= 0 && nr < BOARD_ROWS && nc >= 0 && nc < BOARD_COLS &&
              !visited[nr][nc] && board[nr][nc] === color) {
            visited[nr][nc] = true;
            queue.push({ row: nr, col: nc });
          }
        }
      }

      if (group.length >= MIN_MATCH) groups.push(group);
    }
  }
  return groups;
}

export function removeMatches(board: Board, groups: Position[][]): Board {
  const toRemove = new Set<string>();
  for (const group of groups) {
    for (const { row, col } of group) {
      toRemove.add(`${row},${col}`);
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < BOARD_ROWS && nc >= 0 && nc < BOARD_COLS &&
            board[nr][nc] === 'nuisance') {
          toRemove.add(`${nr},${nc}`);
        }
      }
    }
  }
  return board.map((row, r) => row.map((cell, c) => toRemove.has(`${r},${c}`) ? null : cell));
}

export function applyGravity(board: Board): Board {
  const next = createEmptyBoard();
  for (let c = 0; c < BOARD_COLS; c++) {
    const stack: Cell[] = [];
    for (let r = BOARD_ROWS - 1; r >= 0; r--) {
      if (board[r][c] !== null) stack.push(board[r][c]);
    }
    for (let i = 0; i < stack.length; i++) {
      next[BOARD_ROWS - 1 - i][c] = stack[i];
    }
  }
  return next;
}

export function calculateScore(chain: number, cleared: number): number {
  return cleared * 10 * Math.max(1, chain * chain);
}

export function isSpawnBlocked(board: Board): boolean {
  return board[0][2] !== null || board[1][2] !== null;
}
