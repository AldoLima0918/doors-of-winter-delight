import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DAYS, type AdventDay, type DayKind } from "@/data/days";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calendario de Adviento para Mi Amor" },
      { name: "description", content: "24 días de sorpresas navideñas: fotos, cartas, vales y recuerdos para mi amor." },
      { property: "og:title", content: "Calendario de Adviento para Mi Amor" },
      { property: "og:description", content: "24 días de sorpresas navideñas hechas con amor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const KIND: Record<DayKind, { icon: string; label: string }> = {
  foto: { icon: "📸", label: "Foto" },
  carta: { icon: "💌", label: "Carta" },
  vale: { icon: "🎟️", label: "Vale" },
  recuerdo: { icon: "✨", label: "Recuerdo" },
};

const STORAGE = "advent-opened";

function unlockedDay(preview: boolean) {
  if (preview) return 24;
  const now = new Date();
  if (now.getMonth() !== 11) return now.getMonth() > 11 ? 24 : 0;
  return now.getDate();
}

function Snow() {
  const flakes = useMemo(
    () => Array.from({ length: 45 }, (_, i) => ({ i, left: Math.random() * 100, size: 4 + Math.random() * 8, dur: 8 + Math.random() * 12, delay: -Math.random() * 20, op: 0.4 + Math.random() * 0.6 })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {flakes.map((f) => (
        <span key={f.i} className="animate-snow absolute top-0 rounded-full bg-paper" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.op, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} />
      ))}
    </div>
  );
}

function Burst() {
  const parts = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return { i, dx: Math.cos(a) * 90, dy: Math.sin(a) * 90, c: i % 3 === 0 ? "bg-secondary" : i % 3 === 1 ? "bg-accent" : "bg-gold" };
  });
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {parts.map((p) => (
        <span key={p.i} className={`animate-burst absolute h-2.5 w-2.5 rounded-full ${p.c}`} style={{ ["--dx" as string]: `${p.dx}px`, ["--dy" as string]: `${p.dy}px` }} />
      ))}
    </div>
  );
}

function Door({ d, locked, opened, onOpen, index }: { d: AdventDay; locked: boolean; opened: boolean; onOpen: () => void; index: number }) {
  const [shake, setShake] = useState(false);
  const [burst, setBurst] = useState(false);
  const big = d.day === 24;
  return (
    <button
      onClick={() => {
        if (locked) { setShake(true); setTimeout(() => setShake(false), 400); return; }
        setBurst(true); setTimeout(() => setBurst(false), 900);
        setTimeout(onOpen, opened ? 0 : 650);
      }}
      className={`animate-fade-up group relative aspect-square [perspective:900px] ${big ? "col-span-2 row-span-2 aspect-auto" : ""} ${shake ? "animate-shake" : ""}`}
      style={{ animationDelay: `${index * 40}ms` }}
      aria-label={`Día ${d.day}${locked ? " (bloqueado)" : ""}`}
    >
      {/* interior */}
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-secondary/60 bg-paper text-paper-foreground shadow-glow">
        <span className="text-4xl">{KIND[d.kind].icon}</span>
        <span className="font-hand text-xl">{KIND[d.kind].label}</span>
      </div>
      {/* puerta */}
      <div
        className={`absolute inset-0 origin-left rounded-2xl border-2 bg-door transition-transform duration-700 [backface-visibility:hidden] [transform-style:preserve-3d] ${opened || burst ? "[transform:rotateY(-110deg)]" : "group-hover:[transform:rotateY(-14deg)]"} ${locked ? "border-border" : "border-secondary shadow-glow"}`}
      >
        <div className="absolute inset-2 rounded-xl border border-dashed border-gold/50" />
        <span className={`absolute inset-0 flex items-center justify-center font-display font-extrabold ${big ? "text-7xl md:text-8xl" : "text-3xl md:text-4xl"} ${locked ? "text-foreground/60" : "text-magic"}`}>{d.day}</span>
        <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gold" />
        {locked && <span className="absolute bottom-2 right-2 text-sm opacity-70">🔒</span>}
        {big && <span className="absolute left-0 right-0 top-4 text-center font-hand text-2xl text-accent">Nochebuena</span>}
      </div>
      {burst && <Burst />}
    </button>
  );
}

function Modal({ d, onClose }: { d: AdventDay; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-pop-in relative max-h-[90vh] w-full max-w-md overflow-auto rounded-3xl border-4 border-secondary bg-paper p-6 text-paper-foreground shadow-glow-accent">
        <button onClick={onClose} className="absolute right-4 top-3 text-2xl text-primary hover:scale-110" aria-label="Cerrar">×</button>
        <p className="font-hand text-2xl text-primary">Día {d.day} · {KIND[d.kind].icon} {KIND[d.kind].label}</p>
        <h2 className="mt-1 font-display text-3xl font-extrabold">{d.title}</h2>
        {d.kind === "foto" && d.image && (
          <div className="mx-auto mt-5 w-fit rotate-[-2deg] bg-card-foreground p-3 pb-10 shadow-xl">
            <img src={d.image} alt={d.title} className="max-h-72 w-full object-cover" />
          </div>
        )}
        {d.kind === "vale" ? (
          <div className="mt-5 rounded-2xl border-2 border-dashed border-primary bg-magic p-5 text-center text-accent-foreground">
            <p className="text-xs font-bold uppercase tracking-[0.3em]">Vale canjeable</p>
            <p className="mt-2 font-hand text-2xl">{d.text}</p>
            <p className="mt-3 text-xs">Válido para siempre · Firmado con amor ❤</p>
          </div>
        ) : (
          <p className={`mt-5 leading-relaxed ${d.kind === "carta" ? "font-hand text-2xl" : "text-lg"}`}>{d.text}</p>
        )}
        <p className="mt-6 text-right font-hand text-xl text-primary">— con amor, para mi amor 💕</p>
      </div>
    </div>
  );
}

function Index() {
  const [opened, setOpened] = useState<number[]>([]);
  const [active, setActive] = useState<AdventDay | null>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setPreview(new URLSearchParams(window.location.search).has("preview"));
    try { setOpened(JSON.parse(localStorage.getItem(STORAGE) || "[]")); } catch { /* vacío */ }
  }, []);

  const max = unlockedDay(preview);
  const open = (d: AdventDay) => {
    const next = opened.includes(d.day) ? opened : [...opened, d.day];
    setOpened(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
    setActive(d);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-night px-4 pb-16 pt-10">
      <Snow />
      <header className="relative mx-auto max-w-3xl text-center">
        <div className="flex justify-center gap-6 text-2xl">
          {["⭐", "❄️", "⭐"].map((s, i) => <span key={i} className="animate-twinkle" style={{ animationDelay: `${i * 0.6}s` }}>{s}</span>)}
        </div>
        <p className="mt-3 font-hand text-3xl text-secondary">Para mi amor</p>
        <h1 className="animate-fade-up font-display text-5xl font-extrabold leading-tight md:text-7xl">
          Calendario de <span className="italic text-magic">Adviento</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          24 puertitas con fotos, cartas, vales y recuerdos. Abre una cada día hasta Navidad 🎄
        </p>
        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-border bg-muted/60 px-5 py-2 text-sm">
          <span className="animate-floaty">🎁</span>
          <span>{opened.length} de 24 sorpresas abiertas</span>
          <span className="h-2 w-24 overflow-hidden rounded-full bg-background/50">
            <span className="block h-full bg-magic transition-all duration-700" style={{ width: `${(opened.length / 24) * 100}%` }} />
          </span>
        </div>
      </header>

      <section className="relative mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4">
        {DAYS.map((d, i) => (
          <Door key={d.day} d={d} index={i} locked={d.day > max} opened={opened.includes(d.day)} onOpen={() => open(d)} />
        ))}
      </section>

      {max === 0 && (
        <p className="relative mt-8 text-center font-hand text-2xl text-accent">Las puertitas se abren a partir del 1 de diciembre ✨</p>
      )}
      {active && <Modal d={active} onClose={() => setActive(null)} />}
    </main>
  );
}
