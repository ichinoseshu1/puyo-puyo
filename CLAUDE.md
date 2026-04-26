# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start development server at http://localhost:3000
- `npm run build` — Production build (outputs to `.next/`)
- `npm run lint` — Run ESLint across the project

## Architecture

Next.js 16 with React 19, TypeScript (strict), Tailwind CSS v4, App Router. All interactive components require `'use client'`.

This project is a Puyo Puyo puzzle game. The source lives entirely under `src/`:

- `src/app/` — App Router: `layout.tsx` (root layout + metadata), `page.tsx` (mounts `<PuyoGame>`), `globals.css` (Tailwind import + keyframe animations)
- `src/components/` — React UI components (all client components)
- `src/hooks/usePuyoGame.ts` — Central game hook: owns all game state, the tick loop, keyboard handling, and the chain-clearing pipeline
- `src/lib/` — Pure, side-effect-free game logic split into `types.ts`, `constants.ts`, and `gameLogic.ts`

## Game Engine Pattern

**The stale-closure problem** is solved by keeping every value that changes and is needed inside a `useCallback` in a parallel ref (e.g., `board` + `boardRef`, `phase` + `phaseRef`). Setters from `useState` are stable across renders, so wrapper functions that only write to refs and call setters are safe to capture once inside `useCallback([])`.

**Chain-clearing pipeline** (`processBoard` in `usePuyoGame.ts`): after a piece locks, `processBoard` runs a recursive loop — find matches → animate clear (CSS class + `setTimeout(CLEAR_ANIM_MS)`) → apply gravity → repeat. Between iterations it passes the updated board as an argument rather than reading from a ref, so the board is always fresh. The function stores itself in `processBoardRef` so the `setTimeout` callback always reaches the latest version.

**Tick loop**: `setInterval` in a `useEffect` that depends on `[phase, level]`. Re-created whenever the speed changes with level progression.

## Key Constants (`src/lib/constants.ts`)

`BOARD_ROWS=12`, `BOARD_COLS=6`, `MIN_MATCH=4`, `CLEAR_ANIM_MS=500`, `CELL_SIZE=44` (px).

---

## ぷよぷよ 要件定義

### ゲームルール
- **フィールド**: 6列 × 12行
- **ぷよ色**: 赤・青・緑・黄・紫の5色
- **操作ぷよ**: 2つ1組（ピボット＋サテライト）が上から落下
- **消去条件**: 同色4つ以上が縦横に連結されたら消える
- **連鎖**: 消去後に落下して再び4つ以上繋がれば連鎖ボーナス
- **ゲームオーバー**: スポーン地点（3列目・1〜2行目）が埋まったとき
- **スコア**: `消去数 × 10 × 連鎖数²`（連鎖が増えるほど指数的に増加）
- **レベルアップ**: 40ぷよ消去ごとにレベル上昇、落下速度が加速

### 操作
| キー | 動作 |
|------|------|
| ← → | 左右移動 |
| ↓ | 高速落下（ソフトドロップ） |
| Z / ↑ | 時計回り回転 |
| X | 反時計回り回転 |
| Space | ハードドロップ |

ウォールキック: 回転後に壁や他のぷよと重なる場合、1〜2マスずらして回転を試みる。

### UI/UX 要件
- ダークな宇宙テーマ背景（グラデーション＋星）
- グラスモーフィズムパネル（スコア・次のぷよ表示）
- ネオン発光するぷよ（色別グラデーション＋グロー＋目）
- 消去時のバーストアニメーション（0.5s CSS）
- 2連鎖以上で中央にチェーン数表示
- スコア・レベル・現在連鎖・最大連鎖数の表示
- モバイル向けオンスクリーンボタン
