import { useEffect, useState } from "react";

/** Copos de nieve. Se generan al montar para no romper la hidratación del SSR. */
export function Snow({ count = 50 }: { count?: number }) {
  const [flakes, setFlakes] = useState<
    {
      i: number;
      left: number;
      size: number;
      dur: number;
      delay: number;
      op: number;
      blur: boolean;
    }[]
  >([]);
  useEffect(() => {
    setFlakes(
      Array.from({ length: count }, (_, i) => ({
        i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 7,
        dur: 10 + Math.random() * 14,
        delay: -Math.random() * 24,
        op: 0.35 + Math.random() * 0.55,
        blur: Math.random() > 0.7,
      })),
    );
  }, [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {flakes.map((f) => (
        <span
          key={f.i}
          className={`animate-snow absolute top-0 rounded-full bg-white ${f.blur ? "blur-[1.5px]" : ""}`}
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.op,
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const BULB_COLORS = [
  "oklch(0.72 0.2 25)",
  "oklch(0.86 0.15 90)",
  "oklch(0.72 0.15 160)",
  "oklch(0.78 0.12 250)",
  "oklch(0.8 0.13 350)",
];

/** Guirnalda de luces que cuelga arriba de la página. */
export function Lights() {
  // Dos curvas: y = 8 + 70·t·(1-t) en cada mitad
  const bulbs: { x: number; y: number; c: string; d: number }[] = [];
  const per = 9;
  for (let half = 0; half < 2; half++) {
    for (let k = 1; k <= per; k++) {
      const t = k / (per + 1);
      bulbs.push({
        x: half * 500 + 500 * t,
        y: 8 + 70 * t * (1 - t),
        c: BULB_COLORS[(half * per + k) % BULB_COLORS.length]!,
        d: ((half * per + k) % 5) * 0.35,
      });
    }
  }
  return (
    <svg
      viewBox="0 0 1000 52"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-auto w-full"
      aria-hidden
    >
      <defs>
        <filter id="bulb-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      <path
        d="M0,8 Q250,43 500,8 T1000,8"
        fill="none"
        stroke="oklch(0.3 0.04 160)"
        strokeWidth="2"
      />
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y})`}>
          <rect x="-2.5" y="-1" width="5" height="5" rx="1" fill="oklch(0.45 0.03 150)" />
          <g className="animate-bulb" style={{ animationDelay: `${b.d}s` }}>
            <ellipse
              cx="0"
              cy="11"
              rx="9"
              ry="11"
              fill={b.c}
              opacity="0.55"
              filter="url(#bulb-glow)"
            />
            <ellipse cx="0" cy="10" rx="4" ry="6.5" fill={b.c} />
            <ellipse cx="-1.3" cy="8" rx="1.1" ry="2" fill="white" opacity="0.6" />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** Explosión de confeti al abrir una puertita. */
export function Burst() {
  const parts = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const r = 70 + (i % 3) * 18;
    return {
      i,
      dx: Math.cos(a) * r,
      dy: Math.sin(a) * r,
      c: ["bg-gold", "bg-rose", "bg-white", "bg-primary"][i % 4],
    };
  });
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      {parts.map((p) => (
        <span
          key={p.i}
          className={`animate-burst absolute h-2 w-2 ${p.i % 2 ? "rounded-full" : "rotate-45 rounded-[2px]"} ${p.c}`}
          style={{ ["--dx" as string]: `${p.dx}px`, ["--dy" as string]: `${p.dy}px` }}
        />
      ))}
    </div>
  );
}
