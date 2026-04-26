import { PuyoColor } from './types';

export const BOARD_ROWS = 12;
export const BOARD_COLS = 6;
export const CELL_SIZE = 44;
export const MIN_MATCH = 4;
export const CLEAR_ANIM_MS = 500;
export const LEVELS_PER_SPEED = 40;

export const COLORS: PuyoColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export const PUYO_STYLES: Record<PuyoColor, { gradient: string; glow: string; shine: string }> = {
  red:      { gradient: 'radial-gradient(circle at 35% 30%, #ff9999, #ff2222, #990000)', glow: '0 0 14px rgba(255,50,50,0.9), 0 0 28px rgba(255,50,50,0.4)',  shine: 'rgba(255,180,180,0.6)' },
  blue:     { gradient: 'radial-gradient(circle at 35% 30%, #88bbff, #2266ff, #001299)', glow: '0 0 14px rgba(50,100,255,0.9), 0 0 28px rgba(50,100,255,0.4)',  shine: 'rgba(150,200,255,0.6)' },
  green:    { gradient: 'radial-gradient(circle at 35% 30%, #88ffbb, #22cc55, #005522)', glow: '0 0 14px rgba(50,200,100,0.9), 0 0 28px rgba(50,200,100,0.4)',  shine: 'rgba(150,255,200,0.6)' },
  yellow:   { gradient: 'radial-gradient(circle at 35% 30%, #ffff99, #ffcc00, #887700)', glow: '0 0 14px rgba(255,200,0,0.9),  0 0 28px rgba(255,200,0,0.4)',   shine: 'rgba(255,255,150,0.6)' },
  purple:   { gradient: 'radial-gradient(circle at 35% 30%, #dd99ff, #aa00ff, #550099)', glow: '0 0 14px rgba(180,0,255,0.9),  0 0 28px rgba(180,0,255,0.4)',   shine: 'rgba(220,150,255,0.6)' },
  nuisance: { gradient: 'radial-gradient(circle at 35% 30%, #cccccc, #888888, #444444)', glow: '0 0 8px rgba(136,136,136,0.6)',                                  shine: 'rgba(220,220,220,0.5)' },
};
