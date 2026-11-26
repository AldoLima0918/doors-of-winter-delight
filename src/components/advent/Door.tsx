import { useState } from "react";
import type { AdventDay } from "@/data/days";
import { Burst } from "./decor";
import { KIND, WRAPS } from "./kinds";

const SIZE: Record<string, string> = {
  normal: "",
  ancha: "col-span-2",
  alta: "row-span-2",
  grande: "col-span-2 row-span-2",
};

export function Door({
  d,
  opened,
  isToday,
  onOpen,
  index,
}: {
  d: AdventDay;
  opened: boolean;
  isToday: boolean;
  onOpen: () => void;
  index: number;
}) {
  const [burst, setBurst] = useState(false);
  const big = d.day === 24;
  const wrap = big
    ? { bg: "wrap-gold", num: "text-berry", ribbon: "bg-primary" }
    : WRAPS[(d.day * 7) % WRAPS.length]!;
  const size = big ? "col-span-3 row-span-3 md:col-span-6 md:row-span-2" : SIZE[d.size ?? "normal"];
  const swung = opened || burst;

  return (
    <button
      onClick={() => {
        if (opened) return onOpen();
        setBurst(true);
        setTimeout(() => setBurst(false), 900);
        setTimeout(onOpen, 600);
      }}
      className={`animate-fade-up group relative h-full w-full rounded-2xl text-left outline-none transition-transform duration-200 ease-out [perspective:1000px] focus-visible:ring-2 focus-visible:ring-gold active:scale-[0.97] ${size}`}
      style={{ animationDelay: `${index * 35}ms` }}
      aria-label={`Día ${d.day}: ${KIND[d.kind].label}${opened ? ` · ${d.title}` : ""}`}
    >
      {/* Interior: lo que se ve con la puerta abierta */}
      <div className="bg-paper-grain absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border border-gold/40 p-3 text-center text-paper-foreground shadow-[inset_0_2px_12px_oklch(0_0_0/15%)]">
        <span
          className={`${big ? "text-6xl md:text-7xl" : "text-3xl md:text-4xl"} drop-shadow-sm transition-transform duration-300 group-hover:scale-110`}
        >
          {KIND[d.kind].icon}
        </span>
        <span className={`font-hand leading-none text-primary ${big ? "text-3xl" : "text-lg"}`}>
          {KIND[d.kind].label}
        </span>
        {opened && (
          <span
            className={`line-clamp-2 font-display font-semibold leading-tight ${big ? "mt-1 text-xl" : "hidden text-xs sm:block"}`}
          >
            {d.title}
          </span>
        )}
        <span className="absolute left-2 top-1.5 font-display text-xs font-extrabold text-paper-foreground/40">
          {d.day}
        </span>
      </div>

      {/* Puerta (papel de regalo) */}
      <div
        className={`${wrap.bg} shadow-door absolute inset-0 origin-left overflow-hidden rounded-2xl transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] [backface-visibility:hidden] [transform-style:preserve-3d] ${
          swung ? "[transform:rotateY(-108deg)]" : "group-hover:[transform:rotateY(-16deg)]"
        }`}
      >
        {/* Lazo */}
        <span className={`absolute inset-y-0 left-[30%] w-2.5 ${wrap.ribbon} opacity-90 md:w-3`} />
        <span className={`absolute inset-x-0 top-[32%] h-2.5 ${wrap.ribbon} opacity-90 md:h-3`} />
        <span className="absolute left-[30%] top-[32%] -translate-x-[35%] -translate-y-[60%]">
          <span
            className={`absolute -left-4 top-0 h-3.5 w-5 -rotate-[25deg] rounded-full ${wrap.ribbon} shadow-sm`}
          />
          <span
            className={`absolute left-1 top-0 h-3.5 w-5 rotate-[25deg] rounded-full ${wrap.ribbon} shadow-sm`}
          />
          <span
            className={`absolute -left-0.5 top-0.5 h-3 w-3 rounded-full ${wrap.ribbon} ring-2 ring-black/15`}
          />
        </span>

        {/* Número */}
        <span
          className={`absolute bottom-2 right-3 font-display font-extrabold leading-none ${wrap.num} ${big ? "text-8xl md:text-9xl" : "text-4xl md:text-5xl"} [text-shadow:0_2px_0_oklch(0_0_0/18%)]`}
        >
          {d.day}
        </span>

        {big && (
          <>
            <span className="absolute inset-x-0 top-[48%] text-center font-hand text-4xl text-berry md:text-5xl">
              Nochebuena
            </span>
            <span className="absolute inset-x-0 top-[64%] text-center text-[10px] font-bold uppercase tracking-[0.35em] text-berry/70 md:text-xs">
              Abre tu carta
            </span>
            <span className="animate-floaty absolute right-6 top-6 text-3xl">⭐</span>
          </>
        )}

        {/* Pomo */}
        <span className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gold shadow" />
      </div>

      {/* Marca de "hoy" */}
      {isToday && !opened && (
        <>
          <span className="animate-pulse-ring pointer-events-none absolute inset-0 rounded-2xl" />
          <span className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-berry shadow">
            Hoy
          </span>
        </>
      )}
      {burst && <Burst />}
    </button>
  );
}
