'use client';

import { usePuyoGame } from '@/hooks/usePuyoGame';
import GameBoard      from './GameBoard';
import MobileControls from './MobileControls';
import NextPiecePanel from './NextPiecePanel';
import ScorePanel     from './ScorePanel';

export default function PuyoGame() {
  const {
    board, currentPiece,
    nextTemplate, score, level, chain, maxChain,
    phase, clearingCells,
    startGame,
    moveLeft, moveRight, rotateCW, rotateCCW, softDrop,
  } = usePuyoGame();

  const isIdle     = phase === 'idle';
  const isGameOver = phase === 'gameover';
  const showChain  = phase === 'clearing' && chain >= 2;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full py-8 px-4 game-bg">
      {/* Title */}
      <h1 className="text-3xl font-black tracking-tight mb-6 select-none"
        style={{
          background: 'linear-gradient(135deg, #ff6b9d, #c44dff, #4da6ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 12px rgba(180, 80, 255, 0.6))',
        }}
      >
        PUYO PUYO
      </h1>

      {/* Game area */}
      <div className="flex items-start gap-4">
        {/* Left panel */}
        <ScorePanel score={score} level={level} chain={chain} maxChain={maxChain} />

        {/* Board */}
        <div className="relative">
          <GameBoard
            board={board}
            currentPiece={currentPiece}
            clearingCells={clearingCells}
          />

          {/* Chain label */}
          {showChain && (
            <div
              key={chain}
              className="absolute inset-0 flex items-center justify-center pointer-events-none chain-pop"
            >
              <div
                className="rounded-2xl px-6 py-3 font-black text-4xl select-none"
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  border:     '2px solid rgba(255,220,50,0.8)',
                  color:      '#ffdd44',
                  textShadow: '0 0 20px rgba(255,220,50,1)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {chain} Chain!
              </div>
            </div>
          )}

          {/* Start / Game Over overlay */}
          {(isIdle || isGameOver) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-xl"
              style={{ background: 'rgba(5,7,25,0.82)', backdropFilter: 'blur(6px)' }}
            >
              {isGameOver && (
                <p className="text-2xl font-black text-red-400"
                  style={{ textShadow: '0 0 16px rgba(255,80,80,0.9)' }}>
                  GAME OVER
                </p>
              )}
              {isGameOver && (
                <p className="text-sm text-white/60">Score: {score.toLocaleString()}</p>
              )}
              <button
                onClick={startGame}
                className="rounded-full px-8 py-3 font-bold text-white text-lg transition-transform active:scale-95 hover:scale-105"
                style={{
                  background:  'linear-gradient(135deg, #c44dff, #4da6ff)',
                  boxShadow:   '0 0 24px rgba(180,80,255,0.6)',
                  border:      '1px solid rgba(255,255,255,0.25)',
                }}
              >
                {isGameOver ? 'Play Again' : 'Start Game'}
              </button>

              {isIdle && (
                <div className="text-xs text-white/40 text-center leading-relaxed mt-2">
                  <p>← → Move &nbsp;|&nbsp; ↓ Soft Drop</p>
                  <p>Z/↑ Rotate CW &nbsp;|&nbsp; X Rotate CCW</p>
                  <p>Space Hard Drop</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right panel */}
        <NextPiecePanel nextTemplate={nextTemplate} />
      </div>

      {/* Mobile controls */}
      <MobileControls
        onLeft={moveLeft}
        onRight={moveRight}
        onRotateCW={rotateCW}
        onRotateCCW={rotateCCW}
        onDown={softDrop}
      />
    </div>
  );
}
