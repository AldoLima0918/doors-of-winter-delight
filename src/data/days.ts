export type DayKind = "foto" | "carta" | "vale" | "recuerdo" | "especial";
// Tamaño de la casilla: normal (1x1), ancha (2x1), alta (1x2), grande (2x2). El día 24 siempre es el más grande.
export type DaySize = "normal" | "ancha" | "alta" | "grande";
export interface AdventDay {
  day: number;
  kind: DayKind;
  title: string;
  text: string;
  image?: string;
  size?: DaySize;
}

// Edita aquí el contenido de cada día. Para fotos, pon la URL de la imagen.
const img = (id: string) => `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`;

export const DAYS: AdventDay[] = [
  { day: 1, kind: "carta", size: "alta", title: "Empieza la cuenta atrás", text: "Cada día de este mes tiene un pedacito de lo mucho que te quiero. Ábrelos despacito." },
  { day: 2, kind: "vale", size: "ancha", title: "Vale por un desayuno en la cama", text: "Canjeable cualquier mañana. Incluye café, besos y cero prisas." },
  { day: 3, kind: "foto", size: "ancha", title: "Nuestra foto favorita", text: "Todavía me acuerdo de lo que me reí ese día.", image: img("photo-1518199266791-5375a83190b7") },
  { day: 4, kind: "recuerdo", title: "La primera vez que te vi", text: "Escribe aquí ese recuerdo especial que siempre te hace sonreír." },
  { day: 5, kind: "vale", size: "alta", title: "Vale por una noche de pelis", text: "Tú eliges la peli, yo pongo las palomitas y la manta." },
  { day: 6, kind: "carta", title: "Cosas que amo de ti (I)", text: "Tu risa, cómo arrugas la nariz y lo bonita que te ves cuando estás concentrada." },
  { day: 7, kind: "foto", size: "grande", title: "Un lugar nuestro", text: "Tenemos que volver pronto.", image: img("photo-1512389142860-9c449e58a543") },
  { day: 8, kind: "vale", title: "Vale por un masaje", text: "30 minutos, sin quejas, sin mirar el reloj." },
  { day: 9, kind: "recuerdo", size: "ancha", title: "Nuestra primera cita", text: "Cuéntale aquí cómo fue esa primera cita." },
  { day: 10, kind: "carta", title: "Gracias", text: "Por estar, por aguantarme y por hacer todo más bonito." },
  { day: 11, kind: "vale", size: "ancha", title: "Vale por una cena sorpresa", text: "Yo organizo todo. Tú solo ponte guapa (aunque ya lo eres)." },
  { day: 12, kind: "foto", title: "Tú, siendo tú", text: "Mi foto favorita del mundo.", image: img("photo-1543589077-47d81606c1bf") },
  { day: 13, kind: "recuerdo", size: "alta", title: "Aquel viaje", text: "Ese viaje que siempre recordamos juntos." },
  { day: 14, kind: "vale", title: "Vale por un 'tienes razón'", text: "Úsalo con sabiduría. Solo hay uno." },
  { day: 15, kind: "carta", size: "grande", title: "Cosas que amo de ti (II)", text: "Cómo cuidas a los demás, tus abrazos largos y tus mensajes de buenos días." },
  { day: 16, kind: "foto", title: "Luces de Navidad", text: "Este año las vemos juntos.", image: img("photo-1482517967863-00e15c9b44be") },
  { day: 17, kind: "vale", size: "alta", title: "Vale por un día sin planes", text: "Pijama, sofá y nosotros dos." },
  { day: 18, kind: "recuerdo", title: "Nuestra canción", text: "Esa canción que siempre será nuestra." },
  { day: 19, kind: "carta", size: "ancha", title: "Lo que quiero contigo", text: "Más viajes, más risas, más domingos lentos. Todo, pero contigo." },
  { day: 20, kind: "vale", title: "Vale por un helado", text: "Aunque haga frío. Sobre todo si hace frío." },
  { day: 21, kind: "foto", size: "ancha", title: "Nosotros", text: "El mejor equipo.", image: img("photo-1513151233558-d860c5398176") },
  { day: 22, kind: "recuerdo", title: "Cuando supe que te quería", text: "Ese momento exacto en que lo supe." },
  { day: 23, kind: "vale", title: "Vale por un deseo", text: "Pide lo que quieras. Haré lo posible por cumplirlo." },
   {
    day: 24,
    kind: "especial",
    title: "Feliz Navidad, mi amor",
    text: `Hoy se acaba la cuenta atrás, pero lo nuestro no se acaba nunca.

Durante 24 días intenté recordarte, con fotos, cartas y pequeños vales, lo mucho que significas para mí. La verdad es que no cabría en mil calendarios.

Gracias por cada risa, cada abrazo y cada día a tu lado. Eres mi persona favorita, mi casa y mi mejor regalo, esta Navidad y todas las que vengan.

Te quiero con todo mi corazón.`,
  },
];
