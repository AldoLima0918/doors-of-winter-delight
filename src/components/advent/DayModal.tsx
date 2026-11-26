import { useEffect, useState } from "react";
import type { AdventDay } from "@/data/days";
import { KIND } from "./kinds";
import {
  CancionContent,
  CartaContent,
  FotoContent,
  PlanContent,
  PoemaContent,
  RascaContent,
  RazonesContent,
  RecuerdoContent,
  TriviaContent,
  ValeContent,
  WaxSeal,
} from "./content";

function Body({ d }: { d: AdventDay }) {
  switch (d.kind) {
    case "foto":
      return <FotoContent d={d} />;
    case "carta":
      return <CartaContent d={d} />;
    case "vale":
      return <ValeContent d={d} />;
    case "recuerdo":
      return <RecuerdoContent d={d} />;
    case "cancion":
      return <CancionContent d={d} />;
    case "trivia":
      return <TriviaContent d={d} />;
    case "razones":
      return <RazonesContent d={d} />;
    case "rasca":
      return <RascaContent d={d} />;
    case "plan":
      return <PlanContent d={d} />;
    case "poema":
      return <PoemaContent d={d} />;
    case "especial":
      return null;
  }
}

function useEscape(onClose: () => void) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
}

const CloseBtn = ({ onClose }: { onClose: () => void }) => (
  <button
    onClick={onClose}
    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper-foreground/8 text-xl text-paper-foreground/70 transition-colors hover:bg-paper-foreground/15"
    aria-label="Cerrar"
  >
    ×
  </button>
);

export function DayModal({
  d,
  onClose,
  onNav,
}: {
  d: AdventDay;
  onClose: () => void;
  onNav: (day: number) => void;
}) {
  useEscape(onClose);
  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-[oklch(0.12_0.03_200/80%)] p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        key={d.day}
        onClick={(e) => e.stopPropagation()}
        className="animate-pop-in bg-paper-grain relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-6 pb-5 text-paper-foreground shadow-glow-accent sm:rounded-3xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-title"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[repeating-linear-gradient(90deg,var(--primary)_0_14px,var(--paper)_14px_20px,var(--pine)_20px_34px,var(--paper)_34px_40px)]" />
        <CloseBtn onClose={onClose} />
        <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] tracking-normal text-primary-foreground">
            {d.day}
          </span>
          {KIND[d.kind].icon} {KIND[d.kind].label}
        </p>
        <h2 id="day-title" className="mt-2 pr-8 font-display text-3xl font-extrabold leading-tight">
          {d.title}
        </h2>

        <Body d={d} />

        <nav className="mt-8 flex items-center justify-between border-t border-paper-foreground/10 pt-4 text-sm font-semibold">
          <button
            disabled={d.day <= 1}
            onClick={() => onNav(d.day - 1)}
            className="rounded-full px-3 py-1.5 text-primary transition-colors hover:bg-primary/10 disabled:invisible"
          >
            ← Día {d.day - 1}
          </button>
          <span className="font-hand text-xl text-paper-foreground/60">con amor 💕</span>
          <button
            disabled={d.day >= 24}
            onClick={() => onNav(d.day + 1)}
            className="rounded-full px-3 py-1.5 text-primary transition-colors hover:bg-primary/10 disabled:invisible"
          >
            Día {d.day + 1} →
          </button>
        </nav>
      </div>
    </div>
  );
}

/** Carta especial del 24: sobre que se abre y carta que sube. */
export function SpecialLetter({
  d,
  onClose,
}: {
  d: Extract<AdventDay, { kind: "especial" }>;
  onClose: () => void;
}) {
  useEscape(onClose);
  const [stage, setStage] = useState<"sobre" | "abriendo" | "carta">("sobre");
  const [hearts, setHearts] = useState<
    { i: number; left: number; dur: number; delay: number; size: number }[]
  >([]);
  useEffect(() => {
    setHearts(
      Array.from({ length: 20 }, (_, i) => ({
        i,
        left: Math.random() * 100,
        dur: 7 + Math.random() * 6,
        delay: -Math.random() * 12,
        size: 14 + Math.random() * 18,
      })),
    );
  }, []);
  const openEnvelope = () => {
    if (stage !== "sobre") return;
    setStage("abriendo");
    setTimeout(() => setStage("carta"), 1100);
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[oklch(0.12_0.03_200/88%)] p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {hearts.map((h) => (
          <span
            key={h.i}
            className="animate-rise absolute bottom-0"
            style={{
              left: `${h.left}%`,
              fontSize: h.size,
              animationDuration: `${h.dur}s`,
              animationDelay: `${h.delay}s`,
            }}
          >
            {["❤️", "✨", "💛", "❄️"][h.i % 4]}
          </span>
        ))}
      </div>

      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg">
        {stage !== "carta" ? (
          <button
            onClick={openEnvelope}
            className="animate-pop-in group mx-auto block w-full max-w-sm [perspective:800px]"
            aria-label="Abrir la carta"
          >
            <div className="relative aspect-[3/2] w-full rounded-xl bg-[oklch(0.9_0.04_80)] shadow-[0_30px_60px_-15px_oklch(0_0_0/70%)]">
              {/* carta asomando */}
              <div
                className={`bg-lined absolute inset-x-5 top-3 h-[85%] rounded-md shadow transition-transform delay-500 duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${stage === "abriendo" ? "-translate-y-1/2" : ""}`}
              />
              {/* cuerpo del sobre */}
              <div className="absolute inset-0 rounded-xl bg-[linear-gradient(to_top_right,oklch(0.86_0.05_78)_50%,transparent_50%),linear-gradient(to_top_left,oklch(0.88_0.05_78)_50%,transparent_50%)] [background-position:left_bottom,right_bottom] [background-repeat:no-repeat] [background-size:51%_100%]" />
              {/* solapa */}
              <div
                className={`absolute inset-x-0 top-0 h-[58%] origin-top bg-[oklch(0.83_0.06_75)] transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)] [clip-path:polygon(0_0,100%_0,50%_100%)] ${stage === "abriendo" ? "[transform:rotateX(180deg)]" : ""}`}
              />
              <WaxSeal
                className={`absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${stage === "abriendo" ? "opacity-0" : ""}`}
              />
            </div>
            <p className="mt-6 text-center font-hand text-3xl text-gold transition-transform group-hover:scale-105">
              Toca para abrir tu carta
            </p>
          </button>
        ) : (
          <div className="animate-letter bg-lined relative max-h-[88vh] overflow-y-auto rounded-2xl px-6 pb-8 pl-12 pt-8 text-ink shadow-glow-accent sm:px-10 sm:pl-14">
            <CloseBtn onClose={onClose} />
            <p className="font-hand text-2xl leading-[2.25rem] text-primary">
              24 de diciembre · Nochebuena
            </p>
            <h2 className="font-display text-3xl font-extrabold italic leading-[2.25rem] text-paper-foreground sm:text-4xl">
              {d.title}
            </h2>
            <div className="mt-[2.25rem]">
              {d.text.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="animate-fade-up mb-[2.25rem] font-hand text-[1.6rem] leading-[2.25rem]"
                  style={{ animationDelay: `${0.4 + i * 0.45}s` }}
                >
                  {para}
                </p>
              ))}
            </div>
            <p
              className="animate-fade-up text-right font-hand text-3xl leading-[2.25rem] text-primary"
              style={{ animationDelay: `${0.4 + d.text.split("\n\n").length * 0.45}s` }}
            >
              Para siempre tuyo ❤
            </p>
            <p className="mt-6 text-center text-2xl">🎄 ✨ 🎁</p>
          </div>
        )}
      </div>
    </div>
  );
}
