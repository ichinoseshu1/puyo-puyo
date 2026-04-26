'use client';

interface Props {
  score:    number;
  level:    number;
  chain:    number;
  maxChain: number;
}

function Row({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-300/60">{label}</span>
      <span
        className={`font-mono font-bold tabular-nums transition-all ${
          highlight ? 'text-yellow-300 text-2xl drop-shadow-[0_0_8px_rgba(255,220,0,0.8)]' : 'text-white text-xl'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ScorePanel({ score, level, chain, maxChain }: Props) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-5 items-center"
      style={{
        background:     'rgba(255,255,255,0.05)',
        border:         '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        minWidth: 100,
      }}
    >
      <Row label="Score"     value={score.toLocaleString()} />
      <div className="w-full h-px bg-white/10" />
      <Row label="Level"     value={level} />
      <Row label="Chain"     value={chain}    highlight={chain >= 2} />
      <Row label="Best Chain" value={maxChain} />
    </div>
  );
}
