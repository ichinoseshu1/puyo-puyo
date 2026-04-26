'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CLEAR_ANIM_MS, COLORS, LEVELS_PER_SPEED } from '@/lib/constants';
import {
  applyGravity,
  calculateScore,
  createEmptyBoard,
  createPieceFromTemplate,
  findMatches,
  isSpawnBlocked,
  isValidPosition,
  lockPiece,
  movePiece,
  removeMatches,
  tryRotate,
} from '@/lib/gameLogic';
import { Board, GamePhase, Piece, PieceTemplate, PuyoColor } from '@/lib/types';

function randColor(): PuyoColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function randTemplate(): PieceTemplate {
  return { pivotColor: randColor(), satelliteColor: randColor() };
}

function tickMs(level: number): number {
  return Math.max(80, 800 * Math.pow(0.82, level - 1));
}

export function usePuyoGame() {
  const [board, setBoard]               = useState<Board>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextTemplate, setNextTemplate] = useState<PieceTemplate>(randTemplate);
  const [score, setScore]               = useState(0);
  const [level, setLevel]               = useState(1);
  const [chain, setChain]               = useState(0);
  const [maxChain, setMaxChain]         = useState(0);
  const [phase, setPhase]               = useState<GamePhase>('idle');
  const [clearingCells, setClearingCells] = useState<Set<string>>(new Set());

  // Refs — always current, safe to read inside callbacks
  const boardRef        = useRef<Board>(board);
  const pieceRef        = useRef<Piece | null>(null);
  const nextRef         = useRef<PieceTemplate>(nextTemplate);
  const phaseRef        = useRef<GamePhase>('idle');
  const scoreRef        = useRef(0);
  const levelRef        = useRef(1);
  const chainRef        = useRef(0);
  const maxChainRef     = useRef(0);
  const totalClearedRef = useRef(0);

  // Self-reference so setTimeout always calls the latest version
  const processBoardRef = useRef<(b: Board, c: number) => void>(null!);

  const processBoard = useCallback((b: Board, chainCount: number) => {
    const matches = findMatches(b);

    if (matches.length === 0) {
      chainRef.current = 0;
      setChain(0);

      const tmpl = nextRef.current;
      const newNext = randTemplate();
      nextRef.current = newNext;
      setNextTemplate(newNext);

      if (isSpawnBlocked(b)) {
        phaseRef.current = 'gameover';
        setPhase('gameover');
        return;
      }

      const piece = createPieceFromTemplate(tmpl);
      if (!isValidPosition(b, piece)) {
        phaseRef.current = 'gameover';
        setPhase('gameover');
        return;
      }

      pieceRef.current = piece;
      setCurrentPiece(piece);
      phaseRef.current = 'playing';
      setPhase('playing');
      return;
    }

    const newChain = chainCount + 1;
    chainRef.current = newChain;
    setChain(newChain);
    if (newChain > maxChainRef.current) {
      maxChainRef.current = newChain;
      setMaxChain(newChain);
    }

    const cleared = matches.flat().length;
    const add = calculateScore(newChain, cleared);
    scoreRef.current += add;
    setScore(scoreRef.current);

    totalClearedRef.current += cleared;
    const newLevel = Math.floor(totalClearedRef.current / LEVELS_PER_SPEED) + 1;
    levelRef.current = newLevel;
    setLevel(newLevel);

    const cells = new Set(matches.flat().map(({ row, col }) => `${row},${col}`));
    setClearingCells(cells);
    phaseRef.current = 'clearing';
    setPhase('clearing');

    setTimeout(() => {
      const afterRemove  = removeMatches(b, matches);
      const afterGravity = applyGravity(afterRemove);
      boardRef.current   = afterGravity;
      setBoard(afterGravity);
      setClearingCells(new Set());
      processBoardRef.current(afterGravity, newChain);
    }, CLEAR_ANIM_MS);
  }, []);

  useEffect(() => { processBoardRef.current = processBoard; }, [processBoard]);

  const lockCurrentPiece = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece) return;
    const locked       = lockPiece(boardRef.current, piece);
    boardRef.current   = locked;
    pieceRef.current   = null;
    setBoard(locked);
    setCurrentPiece(null);
    processBoardRef.current(locked, 0);
  }, []);

  const tick = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    const piece = pieceRef.current;
    if (!piece) return;
    const moved = movePiece(piece, 1, 0);
    if (isValidPosition(boardRef.current, moved)) {
      pieceRef.current = moved;
      setCurrentPiece(moved);
    } else {
      lockCurrentPiece();
    }
  }, [lockCurrentPiece]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(tick, tickMs(level));
    return () => clearInterval(id);
  }, [phase, level, tick]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (phaseRef.current !== 'playing') return;
    const piece = pieceRef.current;
    if (!piece) return;
    const board = boardRef.current;

    switch (e.key) {
      case 'ArrowLeft': {
        const m = movePiece(piece, 0, -1);
        if (isValidPosition(board, m)) { pieceRef.current = m; setCurrentPiece(m); }
        e.preventDefault(); break;
      }
      case 'ArrowRight': {
        const m = movePiece(piece, 0, 1);
        if (isValidPosition(board, m)) { pieceRef.current = m; setCurrentPiece(m); }
        e.preventDefault(); break;
      }
      case 'ArrowDown': {
        const m = movePiece(piece, 1, 0);
        if (isValidPosition(board, m)) { pieceRef.current = m; setCurrentPiece(m); }
        else lockCurrentPiece();
        e.preventDefault(); break;
      }
      case 'ArrowUp':
      case 'z': case 'Z': {
        const r = tryRotate(piece, board, 1);
        pieceRef.current = r; setCurrentPiece(r);
        e.preventDefault(); break;
      }
      case 'x': case 'X': {
        const r = tryRotate(piece, board, -1);
        pieceRef.current = r; setCurrentPiece(r);
        e.preventDefault(); break;
      }
      case ' ': {
        let p = piece;
        while (isValidPosition(board, movePiece(p, 1, 0))) p = movePiece(p, 1, 0);
        pieceRef.current = p;
        setCurrentPiece(p);
        lockCurrentPiece();
        e.preventDefault(); break;
      }
    }
  }, [lockCurrentPiece]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const startGame = useCallback(() => {
    const empty = createEmptyBoard();
    boardRef.current      = empty;
    scoreRef.current      = 0;
    levelRef.current      = 1;
    chainRef.current      = 0;
    maxChainRef.current   = 0;
    totalClearedRef.current = 0;

    setBoard(empty);
    setScore(0);
    setLevel(1);
    setChain(0);
    setMaxChain(0);
    setClearingCells(new Set());

    // Use what was already shown in NEXT as the first piece, so colors match
    const tmpl    = nextRef.current;
    const newNext = randTemplate();
    nextRef.current = newNext;
    setNextTemplate(newNext);

    const piece = createPieceFromTemplate(tmpl);
    pieceRef.current  = piece;
    phaseRef.current  = 'playing';
    setCurrentPiece(piece);
    setPhase('playing');
  }, []);

  // Mobile control helpers
  const moveLeft  = useCallback(() => {
    if (phaseRef.current !== 'playing' || !pieceRef.current) return;
    const m = movePiece(pieceRef.current, 0, -1);
    if (isValidPosition(boardRef.current, m)) { pieceRef.current = m; setCurrentPiece(m); }
  }, []);

  const moveRight = useCallback(() => {
    if (phaseRef.current !== 'playing' || !pieceRef.current) return;
    const m = movePiece(pieceRef.current, 0, 1);
    if (isValidPosition(boardRef.current, m)) { pieceRef.current = m; setCurrentPiece(m); }
  }, []);

  const rotateCW  = useCallback(() => {
    if (phaseRef.current !== 'playing' || !pieceRef.current) return;
    const r = tryRotate(pieceRef.current, boardRef.current, 1);
    pieceRef.current = r; setCurrentPiece(r);
  }, []);

  const rotateCCW = useCallback(() => {
    if (phaseRef.current !== 'playing' || !pieceRef.current) return;
    const r = tryRotate(pieceRef.current, boardRef.current, -1);
    pieceRef.current = r; setCurrentPiece(r);
  }, []);

  const softDrop  = useCallback(() => {
    if (phaseRef.current !== 'playing' || !pieceRef.current) return;
    const m = movePiece(pieceRef.current, 1, 0);
    if (isValidPosition(boardRef.current, m)) { pieceRef.current = m; setCurrentPiece(m); }
    else lockCurrentPiece();
  }, [lockCurrentPiece]);

  return {
    board, currentPiece, ghostPiece: null,
    nextTemplate, score, level, chain, maxChain,
    phase, clearingCells,
    startGame,
    moveLeft, moveRight, rotateCW, rotateCCW, softDrop,
  };
}
