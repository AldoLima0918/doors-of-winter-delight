import { useEffect, useRef, useState, type ReactNode } from "react";

/** Tarjeta de "rasca y gana": se rasca con el dedo o el ratón. */
export function ScratchCard({
  children,
  onReveal,
}: {
  children: ReactNode;
  onReveal?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const moves = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = wrap.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#f3dc9a");
    g.addColorStop(0.45, "#d9b45a");
    g.addColorStop(0.55, "#f6e3a8");
    g.addColorStop(1, "#b88a35");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    // brillitos
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    for (let i = 0; i < 70; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(90,55,10,0.75)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.round(Math.min(width / 9, 30))}px Caveat, cursive`;
    ctx.fillText("✨ Rasca aquí ✨", width / 2, height / 2);
  }, []);

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || done) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const from = last.current ?? { x, y };
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 44;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };
    if (++moves.current % 12 === 0) {
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clear = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 4 * 40) {
        total++;
        if (data[i] === 0) clear++;
      }
      if (clear / total > 0.45) reveal();
    }
  };

  const reveal = () => {
    setDone(true);
    onReveal?.();
  };

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-2xl">
      {children}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full cursor-grab touch-none transition-opacity duration-700 ${done ? "pointer-events-none opacity-0" : ""}`}
        onPointerDown={(e) => {
          drawing.current = true;
          last.current = null;
          e.currentTarget.setPointerCapture(e.pointerId);
          scratch(e);
        }}
        onPointerMove={(e) => drawing.current && scratch(e)}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
        aria-label="Zona para rascar"
      />
      {!done && (
        <button
          onClick={reveal}
          className="absolute bottom-2 right-3 text-[11px] font-semibold text-black/45 underline-offset-2 hover:underline"
        >
          revelar
        </button>
      )}
    </div>
  );
}
