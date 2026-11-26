import type { DayKind } from "@/data/days";

export const KIND: Record<DayKind, { icon: string; label: string }> = {
  foto: { icon: "📸", label: "Foto" },
  carta: { icon: "💌", label: "Carta" },
  vale: { icon: "🎟️", label: "Vale" },
  recuerdo: { icon: "✨", label: "Recuerdo" },
  cancion: { icon: "🎶", label: "Canción" },
  trivia: { icon: "🧩", label: "Juego" },
  razones: { icon: "💗", label: "Razones" },
  rasca: { icon: "🍀", label: "Rasca y gana" },
  plan: { icon: "🗓️", label: "Plan" },
  poema: { icon: "📜", label: "Poema" },
  especial: { icon: "💝", label: "Carta especial" },
};

/** Envoltorio de cada puertita: [clase de fondo, color del número, color del lazo] */
export const WRAPS = [
  { bg: "wrap-berry", num: "text-paper", ribbon: "bg-gold" },
  { bg: "wrap-pine", num: "text-paper", ribbon: "bg-primary" },
  { bg: "wrap-cream", num: "text-berry", ribbon: "bg-pine" },
  { bg: "wrap-red", num: "text-paper", ribbon: "bg-paper" },
  { bg: "wrap-night", num: "text-gold", ribbon: "bg-gold" },
] as const;
