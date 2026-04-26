'use client';

interface Props {
  onLeft:     () => void;
  onRight:    () => void;
  onRotateCW: () => void;
  onRotateCCW:() => void;
  onDown:     () => void;
}

function Btn({ label, onPress, wide }: { label: string; onPress: () => void; wide?: boolean }) {
  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); onPress(); }}
      className={`select-none rounded-xl font-bold text-white text-sm active:scale-95 transition-transform ${wide ? 'px-6 py-3' : 'w-14 h-14'} flex items-center justify-center`}
      style={{
        background: 'rgba(255,255,255,0.10)',
        border:     '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
        touchAction: 'none',
      }}
    >
      {label}
    </button>
  );
}

export default function MobileControls({ onLeft, onRight, onRotateCW, onRotateCCW, onDown }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 md:hidden mt-4 w-full max-w-xs">
      {/* Rotate row */}
      <div className="flex gap-4 justify-center">
        <Btn label="↺" onPress={onRotateCCW} />
        <Btn label="↻" onPress={onRotateCW}  />
      </div>
      {/* Move + drop row */}
      <div className="flex gap-4 justify-center">
        <Btn label="←" onPress={onLeft}  />
        <Btn label="↓" onPress={onDown}  />
        <Btn label="→" onPress={onRight} />
      </div>
    </div>
  );
}
