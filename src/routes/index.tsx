import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DAYS, type AdventDay } from "@/data/days";
import { Door } from "@/components/advent/Door";
import { DayModal, SpecialLetter } from "@/components/advent/DayModal";
import { Lights, Snow } from "@/components/advent/decor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calendario de Adviento para Mi Amor" },
      {
        name: "description",
        content:
          "24 días de sorpresas navideñas: fotos, cartas, vales, recuerdos y juegos para mi amor.",
      },
      { property: "og:title", content: "Calendario de Adviento para Mi Amor" },
      { property: "og:description", content: "24 días de sorpresas navideñas hechas con amor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STORAGE = "advent-opened";

function useToday() {
  const [t, setT] = useState<{ day: number | null; untilXmas: number | null }>({
    day: null,
    untilXmas: null,
  });
  useEffect(() => {
    const now = new Date();
    const day = now.getMonth() === 11 && now.getDate() <= 24 ? now.getDate() : null;
    const xmas = new Date(now.getFullYear(), 11, 25);
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.round((xmas.getTime() - start.getTime()) / 86_400_000);
    setT({ day, untilXmas: diff });
  }, []);
  return t;
}

function Index() {
  const [opened, setOpened] = useState<number[]>([]);
  const [active, setActive] = useState<AdventDay | null>(null);
  const { day: today, untilXmas } = useToday();

  useEffect(() => {
    try {
      setOpened(JSON.parse(localStorage.getItem(STORAGE) || "[]"));
    } catch {
      /* vacío */
    }
  }, []);

  const open = (d: AdventDay) => {
    setOpened((prev) => {
      if (prev.includes(d.day)) return prev;
      const next = [...prev, d.day];
      try {
        localStorage.setItem(STORAGE, JSON.stringify(next));
      } catch {
        /* sin almacenamiento */
      }
      return next;
    });
    setActive(d);
  };

  return (
    <main className="bg-night relative min-h-screen overflow-hidden px-4 pb-16 pt-16 md:pt-20">
      <Lights />
      <Snow />

      <header className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="animate-fade-up font-hand text-3xl text-gold md:text-4xl">Para mi amor</p>
        <h1
          className="animate-fade-up mt-1 font-display text-5xl font-extrabold leading-[1.05] text-paper md:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Calendario de <span className="text-magic italic">Adviento</span>
        </h1>
        <p
          className="animate-fade-up mx-auto mt-4 max-w-md text-base text-muted-foreground"
          style={{ animationDelay: "160ms" }}
        >
          24 regalitos envueltos con cariño. Abre uno cada día hasta Navidad… o todos de golpe, no
          te juzgo 🎄
        </p>

        <div
          className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-gold/30 bg-black/20 px-5 py-2 text-sm backdrop-blur">
            <span>🎁</span>
            <span>
              <b className="text-gold">{opened.length}</b> de 24 abiertas
            </span>
            <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
              <span
                className="bg-magic block h-full transition-[width] duration-700 ease-out"
                style={{ width: `${(opened.length / 24) * 100}%` }}
              />
            </span>
          </div>
          {untilXmas !== null && (
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/20 px-5 py-2 text-sm backdrop-blur">
              <span>🎄</span>
              {untilXmas > 1 ? (
                <span>
                  Faltan <b className="text-gold">{untilXmas}</b> días para Navidad
                </span>
              ) : untilXmas === 1 ? (
                <span>¡Mañana es Navidad!</span>
              ) : (
                <span>¡Feliz Navidad!</span>
              )}
            </div>
          )}
        </div>
      </header>

      <section className="relative z-10 mx-auto mt-12 grid max-w-5xl auto-rows-[104px] grid-cols-3 gap-3 [grid-auto-flow:dense] sm:auto-rows-[124px] md:grid-cols-6 md:gap-4">
        {DAYS.map((d, i) => (
          <Door
            key={d.day}
            d={d}
            index={i}
            isToday={today === d.day}
            opened={opened.includes(d.day)}
            onOpen={() => open(d)}
          />
        ))}
      </section>

      <footer className="relative z-10 mx-auto mt-12 max-w-3xl text-center">
        <p className="font-hand text-2xl text-gold/80">Hecho a mano, con todo mi amor ❤</p>
      </footer>

      {active &&
        (active.kind === "especial" ? (
          <SpecialLetter d={active} onClose={() => setActive(null)} />
        ) : (
          <DayModal
            d={active}
            onClose={() => setActive(null)}
            onNav={(n) => {
              const next = DAYS[n - 1];
              if (next) open(next);
            }}
          />
        ))}
    </main>
  );
}
