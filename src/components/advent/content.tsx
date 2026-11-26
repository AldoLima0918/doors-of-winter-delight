import { useEffect, useState } from "react";
import type { AdventDay, Photo as PhotoT } from "@/data/days";
import { ScratchCard } from "./ScratchCard";

type Of<K extends AdventDay["kind"]> = Extract<AdventDay, { kind: K }>;

/* ───────────── Foto ───────────── */

export function Polaroid({
  p,
  rotate = 0,
  className = "",
}: {
  p: PhotoT;
  rotate?: number;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  return (
    <figure
      className={`relative bg-white p-2.5 pb-9 shadow-[0_12px_30px_-10px_oklch(0_0_0/45%)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-3deg] bg-gold/45 backdrop-blur-[1px]" />
      {broken ? (
        <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-rose/40 to-gold/40 text-paper-foreground/70">
          <span className="text-3xl">📷</span>
          <span className="font-hand text-xl">tu foto aquí</span>
        </div>
      ) : (
        <img
          src={p.src}
          alt={p.caption ?? "Foto"}
          onError={() => setBroken(true)}
          className="aspect-[4/5] w-full object-cover"
          loading="lazy"
        />
      )}
      {p.caption && (
        <figcaption className="absolute inset-x-0 bottom-1.5 text-center font-hand text-xl text-paper-foreground/80">
          {p.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function FotoContent({ d }: { d: Of<"foto"> }) {
  const n = d.photos.length;
  return (
    <div>
      {n === 1 ? (
        <Polaroid p={d.photos[0]!} rotate={-2} className="mx-auto mt-2 w-[min(100%,300px)]" />
      ) : (
        <div className={`mt-4 grid gap-3 ${n === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {d.photos.map((p, i) => (
            <Polaroid
              key={i}
              p={p}
              rotate={[-4, 3, -2][i % 3] ?? 0}
              className={i === 1 && n === 3 ? "translate-y-4" : ""}
            />
          ))}
        </div>
      )}
      <p className="mt-8 text-center font-hand text-2xl leading-snug">{d.text}</p>
    </div>
  );
}

/* ───────────── Carta ───────────── */

export function CartaContent({ d }: { d: Of<"carta"> }) {
  return (
    <div className="relative mt-4">
      <div className="bg-lined relative rounded-lg px-5 pb-6 pl-12 pt-4 shadow-inner ring-1 ring-paper-foreground/10">
        {d.text.split("\n\n").map((para, i) => (
          <p
            key={i}
            className="animate-fade-up font-hand text-[1.55rem] leading-[2.25rem] text-ink"
            style={{ animationDelay: `${0.15 + i * 0.2}s` }}
          >
            {para}
          </p>
        ))}
        <p className="mt-2 text-right font-hand text-2xl leading-[2.25rem] text-primary">
          {d.firma ?? "Con amor, para mi amor"} ❤
        </p>
      </div>
      <WaxSeal className="absolute -bottom-5 left-1/2 -translate-x-1/2" />
    </div>
  );
}

export function WaxSeal({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg text-paper shadow-[0_4px_10px_oklch(0_0_0/35%),inset_0_-3px_6px_oklch(0_0_0/30%),inset_0_2px_4px_oklch(1_0_0/25%)] ring-4 ring-primary/40 ${className}`}
    >
      ♥
    </span>
  );
}

/* ───────────── Vale ───────────── */

const REDEEMED = "advent-redeemed";
function readRedeemed(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(REDEEMED) || "{}");
  } catch {
    return {};
  }
}

export function ValeContent({ d }: { d: Of<"vale"> }) {
  const [when, setWhen] = useState<string | null>(null);
  useEffect(() => setWhen(readRedeemed()[d.day] ?? null), [d.day]);
  const redeem = () => {
    const date = new Date().toLocaleDateString("es", { day: "numeric", month: "long" });
    const all = { ...readRedeemed(), [d.day]: date };
    try {
      localStorage.setItem(REDEEMED, JSON.stringify(all));
    } catch {
      /* sin almacenamiento */
    }
    setWhen(date);
  };
  return (
    <div className="mt-4">
      <div className="relative flex overflow-hidden rounded-2xl bg-gold text-secondary-foreground shadow-lg">
        {/* talón */}
        <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-1 border-r-2 border-dashed border-secondary-foreground/30 bg-berry py-5 text-paper sm:w-24">
          <span className="text-3xl">🎟️</span>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
            Nº {String(d.day).padStart(3, "0")}
          </span>
        </div>
        {/* muescas */}
        <span className="absolute left-[4.6rem] top-0 h-4 w-4 -translate-y-1/2 rounded-full bg-paper sm:left-[5.6rem]" />
        <span className="absolute bottom-0 left-[4.6rem] h-4 w-4 translate-y-1/2 rounded-full bg-paper sm:left-[5.6rem]" />
        <div className="relative flex-1 p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.35em] opacity-70">
            Vale canjeable
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold leading-tight">{d.text}</p>
          <p className="mt-2 text-sm leading-relaxed">{d.detalle}</p>
          {d.condiciones && (
            <p className="mt-3 border-t border-secondary-foreground/20 pt-2 text-xs italic opacity-80">
              {d.condiciones}
            </p>
          )}
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
            Válido para siempre · Firmado con amor
          </p>
          {when && (
            <span className="animate-stamp absolute right-3 top-3 rounded-md border-[3px] border-primary px-2 py-1 text-center font-display text-sm font-extrabold uppercase leading-tight text-primary opacity-90">
              Canjeado
              <span className="block text-[10px] font-bold normal-case tracking-normal">
                {when}
              </span>
            </span>
          )}
        </div>
      </div>
      <div className="mt-5 text-center">
        {when ? (
          <p className="font-hand text-2xl text-primary">
            ¡Vale canjeado! Ahora me toca cumplirlo 😌
          </p>
        ) : (
          <button
            onClick={redeem}
            className="rounded-full bg-primary px-6 py-2.5 font-bold text-primary-foreground shadow-md transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.97]"
          >
            Canjear este vale
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────────── Recuerdo ───────────── */

export function RecuerdoContent({ d }: { d: Of<"recuerdo"> }) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 text-sm font-semibold">
        <span className="rounded-full bg-pine/15 px-3 py-1 text-pine-deep">🗓️ {d.fecha}</span>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">📍 {d.lugar}</span>
      </div>
      <div className={`mt-5 ${d.photo ? "grid items-start gap-5 sm:grid-cols-[1fr_150px]" : ""}`}>
        <blockquote className="relative rounded-xl bg-paper-2/70 p-5 pt-7 font-hand text-2xl leading-snug">
          <span className="absolute -top-2 left-3 font-display text-6xl leading-none text-gold-deep/60">
            “
          </span>
          {d.text}
        </blockquote>
        {d.photo && <Polaroid p={d.photo} rotate={4} className="mx-auto w-40 sm:w-full" />}
      </div>
    </div>
  );
}

/* ───────────── Canción ───────────── */

export function CancionContent({ d }: { d: Of<"cancion"> }) {
  const q = encodeURIComponent(`${d.cancion} ${d.artista}`);
  return (
    <div className="mt-4">
      <div className="flex items-center gap-5 rounded-2xl bg-pine-deep p-5 text-paper shadow-lg">
        <div className="animate-spin-slow relative h-24 w-24 shrink-0 rounded-full bg-[repeating-radial-gradient(circle,oklch(0.18_0_0)_0_2px,oklch(0.24_0_0)_2px_4px)] shadow-[0_6px_16px_oklch(0_0_0/50%)]">
          <span className="absolute inset-[34%] flex items-center justify-center rounded-full bg-primary text-xs">
            ♥
          </span>
          <span className="absolute inset-[47%] rounded-full bg-paper" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            Sonando ahora
          </p>
          <p className="mt-1 truncate font-display text-2xl font-extrabold">{d.cancion}</p>
          <p className="truncate text-sm opacity-80">{d.artista}</p>
          <div className="mt-3 flex h-5 items-end gap-1" aria-hidden>
            {[0, 0.2, 0.4, 0.1, 0.3].map((delay, i) => (
              <span
                key={i}
                className="animate-eq w-1.5 origin-bottom rounded-sm bg-gold"
                style={{ height: "100%", animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-5 text-center font-hand text-2xl leading-snug">{d.text}</p>
      <div className="mt-4 flex justify-center gap-3">
        <a
          href={d.url ?? `https://open.spotify.com/search/${q}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[oklch(0.62_0.17_150)] px-5 py-2 text-sm font-bold text-white shadow transition-transform hover:scale-[1.03] active:scale-[0.97]"
        >
          ▶ Escuchar
        </a>
        <a
          href={`https://www.youtube.com/results?search_query=${q}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border-2 border-primary/40 px-5 py-2 text-sm font-bold text-primary transition-transform hover:scale-[1.03] active:scale-[0.97]"
        >
          Ver en YouTube
        </a>
      </div>
    </div>
  );
}

/* ───────────── Trivia ───────────── */

export function TriviaContent({ d }: { d: Of<"trivia"> }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = step >= d.preguntas.length;
  const p = d.preguntas[Math.min(step, d.preguntas.length - 1)]!;

  if (done) {
    return (
      <div className="animate-pop-in mt-6 text-center">
        <p className="text-6xl">🏆</p>
        <p className="mt-3 font-display text-2xl font-extrabold">
          {score} de {d.preguntas.length}
        </p>
        <p className="mt-2 font-hand text-2xl">
          {score === d.preguntas.length
            ? "¡Me conoces de memoria! Premio: un beso largo."
            : "Casi… pero te quiero igual. Premio de consolación: un beso largo."}
        </p>
        <button
          onClick={() => {
            setStep(0);
            setScore(0);
            setPicked(null);
          }}
          className="mt-4 text-sm font-semibold text-primary underline underline-offset-4"
        >
          Jugar otra vez
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <p className="text-sm text-paper-foreground/75">{d.intro}</p>
      <div className="mt-4 flex gap-1.5">
        {d.preguntas.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-primary" : i === step ? "bg-gold" : "bg-paper-foreground/15"}`}
          />
        ))}
      </div>
      <p key={step} className="animate-fade-up mt-4 font-display text-xl font-extrabold">
        {p.q}
      </p>
      <div className="mt-3 grid gap-2">
        {p.opciones.map((o, i) => {
          const state =
            picked === null
              ? ""
              : i === p.correcta
                ? "border-pine bg-pine/15"
                : i === picked
                  ? "border-primary bg-primary/10 opacity-80"
                  : "opacity-50";
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => {
                setPicked(i);
                if (i === p.correcta) setScore((s) => s + 1);
              }}
              className={`rounded-xl border-2 border-paper-foreground/15 bg-white/60 px-4 py-2.5 text-left font-semibold transition-all duration-150 ease-out enabled:hover:border-gold enabled:hover:bg-white enabled:active:scale-[0.98] ${state}`}
            >
              {o} {picked !== null && i === p.correcta && "✓"}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="animate-fade-up mt-4 flex items-center justify-between gap-3">
          <p className="font-hand text-2xl text-primary">
            {picked === p.correcta ? "¡Correcto! " : "¡Ups! "}
            {p.nota}
          </p>
          <button
            onClick={() => {
              setStep((s) => s + 1);
              setPicked(null);
            }}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground active:scale-[0.97]"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────────── Razones ───────────── */

export function RazonesContent({ d }: { d: Of<"razones"> }) {
  const [shown, setShown] = useState<number[]>([]);
  const all = shown.length === d.razones.length;
  return (
    <div className="mt-3">
      <p className="text-sm text-paper-foreground/75">{d.intro}</p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {d.razones.map((r, i) => {
          const open = shown.includes(i);
          return (
            <button
              key={i}
              onClick={() => !open && setShown((s) => [...s, i])}
              className={`min-h-20 rounded-xl px-3 py-2.5 text-left transition-all duration-300 ease-out active:scale-[0.97] ${open ? "bg-white/80 shadow-sm ring-1 ring-rose/50" : "bg-rose/25 hover:bg-rose/40"}`}
            >
              {open ? (
                <span className="animate-fade-in block font-hand text-xl leading-tight">
                  <b className="font-display text-sm text-primary">{i + 1}.</b> {r}
                </span>
              ) : (
                <span className="flex h-full items-center justify-center gap-2 text-2xl">
                  ❤
                  <span className="font-display text-sm font-extrabold text-primary/70">
                    {i + 1}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        {all ? (
          <p className="font-hand text-2xl text-primary">
            Y podría seguir escribiendo para siempre.
          </p>
        ) : (
          <button
            onClick={() => setShown(d.razones.map((_, i) => i))}
            className="text-sm font-semibold text-primary underline underline-offset-4"
          >
            Ver todas ({shown.length}/{d.razones.length})
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────────── Rasca y gana ───────────── */

export function RascaContent({ d }: { d: Of<"rasca"> }) {
  const [won, setWon] = useState(false);
  return (
    <div className="mt-3">
      <p className="text-center text-sm text-paper-foreground/75">{d.text}</p>
      <div className="mx-auto mt-4 max-w-sm">
        <ScratchCard onReveal={() => setWon(true)}>
          <div className="flex h-44 flex-col items-center justify-center bg-gradient-to-br from-rose/40 via-paper to-gold/40 p-4 text-center">
            <span className="text-4xl">🎉</span>
            <p className="mt-1 font-display text-2xl font-extrabold text-primary">{d.premio}</p>
          </div>
        </ScratchCard>
      </div>
      <p
        className={`mt-4 text-center font-hand text-2xl leading-snug transition-opacity duration-500 ${won ? "opacity-100" : "opacity-0"}`}
      >
        {d.detalle}
      </p>
    </div>
  );
}

/* ───────────── Plan ───────────── */

export function PlanContent({ d }: { d: Of<"plan"> }) {
  const [yes, setYes] = useState(false);
  return (
    <div className="mt-3">
      <p className="font-hand text-2xl leading-snug">{d.text}</p>
      <ol className="relative mt-5 space-y-4 border-l-2 border-dashed border-gold-deep/50 pl-6">
        {d.pasos.map((s, i) => (
          <li
            key={i}
            className="animate-fade-up relative"
            style={{ animationDelay: `${0.1 + i * 0.12}s` }}
          >
            <span className="absolute -left-[2.2rem] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-base shadow ring-2 ring-gold">
              {s.icon}
            </span>
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
              {s.hora}
            </p>
            <p className="font-semibold">{s.que}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 text-center">
        {yes ? (
          <p className="animate-pop-in font-hand text-3xl text-primary">
            ¡Trato hecho! 🥰 Elige el día.
          </p>
        ) : (
          <>
            <p className="font-display text-lg font-extrabold">¿Aceptas?</p>
            <div className="mt-2 flex justify-center gap-3">
              <button
                onClick={() => setYes(true)}
                className="rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground shadow active:scale-[0.97]"
              >
                Sí
              </button>
              <button
                onClick={() => setYes(true)}
                className="rounded-full bg-pine px-5 py-2 font-bold text-paper shadow active:scale-[0.97]"
              >
                Claro que sí
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────────── Poema ───────────── */

export function PoemaContent({ d }: { d: Of<"poema"> }) {
  return (
    <div className="mt-4 rounded-2xl border border-gold-deep/30 bg-paper-2/60 px-6 py-7 text-center">
      <p className="text-gold-deep">❦</p>
      {d.versos.split("\n\n").map((stanza, i) => (
        <p
          key={i}
          className="animate-fade-up mt-4 whitespace-pre-line font-display text-lg italic leading-relaxed"
          style={{ animationDelay: `${0.15 + i * 0.3}s` }}
        >
          {stanza}
        </p>
      ))}
      <p className="mt-5 text-gold-deep">❦</p>
      {d.autor && <p className="mt-2 font-hand text-xl text-primary">{d.autor}</p>}
    </div>
  );
}
