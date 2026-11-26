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
const CONTENT = "advent-content";

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const im = new Image();
      im.onload = () => {
        const scale = Math.min(1, 900 / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = im.width * scale; c.height = im.height * scale;
        c.getContext("2d")?.drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.8));
      };
      im.onerror = reject;
      im.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Editor({ d, onSave, onClose }: { d: AdventDay; onSave: (d: AdventDay) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<AdventDay>(d);
  const field = "mt-1 w-full rounded-xl border-2 border-secondary/60 bg-card-foreground px-3 py-2 text-paper-foreground outline-none focus:border-accent";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-pop-in relative max-h-[90vh] w-full max-w-md overflow-auto rounded-3xl border-4 border-accent bg-paper p-6 text-paper-foreground shadow-glow-accent">
        <button onClick={onClose} className="absolute right-4 top-3 text-2xl text-primary" aria-label="Cerrar">×</button>
        <h2 className="font-display text-2xl font-extrabold">Editar día {d.day}</h2>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {(Object.keys(KIND) as DayKind[]).map((k) => (
            <button key={k} onClick={() => setDraft({ ...draft, kind: k })} className={`rounded-xl border-2 p-2 text-center text-sm transition ${draft.kind === k ? "border-primary bg-magic scale-105" : "border-secondary/40"}`}>
              <div className="text-2xl">{KIND[k].icon}</div>{KIND[k].label}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-bold">Título
          <input className={field} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </label>
        <label className="mt-3 block text-sm font-bold">Mensaje
          <textarea rows={5} className={field} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
        </label>
        <label className="mt-3 block text-sm font-bold">Foto {draft.kind !== "foto" && <span className="font-normal opacity-70">(se muestra en días tipo Foto)</span>}
          <input type="file" accept="image/*" className={field} onChange={async (e) => { const f = e.target.files?.[0]; if (f) setDraft({ ...draft, image: await resizeImage(f) }); }} />
        </label>
        {draft.image && <img src={draft.image} alt="Vista previa" className="mt-3 max-h-40 rounded-xl object-cover" />}
        <div className="mt-5 flex gap-2">
          <button onClick={() => onSave(draft)} className="flex-1 rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground hover:scale-[1.02]">Guardar</button>
          <button onClick={onClose} className="rounded-full border-2 border-primary px-4 py-2 font-bold text-primary">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

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
  const [editing, setEditing] = useState(false);
  const [editDay, setEditDay] = useState<AdventDay | null>(null);
  const [custom, setCustom] = useState<Record<number, AdventDay>>({});
  const days = DAYS.map((d) => custom[d.day] ?? d);

  useEffect(() => {
    setPreview(new URLSearchParams(window.location.search).has("preview"));
    try { setOpened(JSON.parse(localStorage.getItem(STORAGE) || "[]")); } catch { /* vacío */ }
    try { setCustom(JSON.parse(localStorage.getItem(CONTENT) || "{}")); } catch { /* vacío */ }
  }, []);

  const max = unlockedDay(preview || editing);
  const save = (d: AdventDay) => {
    const next = { ...custom, [d.day]: d };
    try { localStorage.setItem(CONTENT, JSON.stringify(next)); } catch { alert("No hay espacio para más fotos. Prueba con una imagen más pequeña."); return; }
    setCustom(next);
    setEditDay(null);
  };
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
        {days.map((d, i) => (
          <Door key={d.day} d={d} index={i} locked={d.day > max} opened={!editing && opened.includes(d.day)} onOpen={() => (editing ? setEditDay(d) : open(d))} />
        ))}
      </section>

      {max === 0 && (
        <p className="relative mt-8 text-center font-hand text-2xl text-accent">Las puertitas se abren a partir del 1 de diciembre ✨</p>
      )}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {editing && (
          <button onClick={() => { setOpened([]); localStorage.removeItem(STORAGE); }} className="rounded-full border-2 border-secondary bg-muted px-4 py-2 text-sm font-bold">↺ Cerrar todas las puertas</button>
        )}
        <button onClick={() => setEditing(!editing)} className={`rounded-full px-5 py-3 font-bold shadow-glow-accent transition hover:scale-105 ${editing ? "bg-magic text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
          {editing ? "✓ Terminar edición" : "✏️ Editar casillas"}
        </button>
      </div>
      {editing && <p className="relative mt-6 text-center font-hand text-2xl text-secondary">Modo edición: toca cualquier casilla para cambiarla</p>}
      {editDay && <Editor key={editDay.day} d={editDay} onSave={save} onClose={() => setEditDay(null)} />}
      {active && <Modal d={active} onClose={() => setActive(null)} />}
    </main>
  );
}
