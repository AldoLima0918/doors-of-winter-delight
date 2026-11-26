// ─────────────────────────────────────────────────────────────────────────────
//  CONTENIDO DEL CALENDARIO
//  Edita aquí cada día. Todo el texto es tuyo: cámbialo para que suene a ti.
//
//  FOTOS: lo mejor es usar tus propias fotos. Mete los archivos en la carpeta
//  `public/fotos/` (por ejemplo `public/fotos/dia-3.jpg`) y pon aquí
//  `src: "/fotos/dia-3.jpg"`. Si una foto no carga, se muestra un marco bonito
//  que dice "tu foto aquí".
// ─────────────────────────────────────────────────────────────────────────────

export type DaySize = "normal" | "ancha" | "alta" | "grande";

interface Base {
  day: number;
  title: string;
  /** Tamaño de la casilla en la cuadrícula. El día 24 siempre es el más grande. */
  size?: DaySize;
}

export interface Photo {
  src: string;
  caption?: string;
}

export type AdventDay = Base &
  (
    | { kind: "foto"; photos: Photo[]; text: string }
    | { kind: "carta"; text: string; firma?: string }
    | { kind: "vale"; text: string; detalle: string; condiciones?: string }
    | { kind: "recuerdo"; fecha: string; lugar: string; text: string; photo?: Photo }
    | { kind: "cancion"; cancion: string; artista: string; text: string; url?: string }
    | {
        kind: "trivia";
        intro: string;
        preguntas: { q: string; opciones: string[]; correcta: number; nota: string }[];
      }
    | { kind: "razones"; intro: string; razones: string[] }
    | { kind: "rasca"; text: string; premio: string; detalle: string }
    | { kind: "plan"; text: string; pasos: { hora: string; que: string; icon: string }[] }
    | { kind: "poema"; versos: string; autor?: string }
    | { kind: "especial"; text: string }
  );

export type DayKind = AdventDay["kind"];

// Fotos de ejemplo (cámbialas por las vuestras).
const img = (id: string) => `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`;
const F1 = img("photo-1518199266791-5375a83190b7");
const F2 = img("photo-1512389142860-9c449e58a543");
const F3 = img("photo-1543589077-47d81606c1bf");
const F4 = img("photo-1482517967863-00e15c9b44be");
const F5 = img("photo-1513151233558-d860c5398176");

export const DAYS: AdventDay[] = [
  {
    day: 1,
    kind: "carta",
    size: "alta",
    title: "Empieza la cuenta atrás",
    text: `Mi amor:

Hoy empieza diciembre y con él, este calendario que hice pensando en ti. Detrás de cada puertita hay un pedacito de lo mucho que te quiero: fotos, recuerdos, cartas, vales y alguna que otra sorpresa.

Ábrelos despacito, uno cada día, y que cada mañana empiece con una sonrisa. TE AMO`,
    firma: "Tuyo, siempre",
  },
  {
    day: 2,
    kind: "vale",
    size: "ancha",
    title: "Desayuno donte tu quieras",
    text: "Vale por un desayuno donte tu quieras",
    detalle: "Café (o chocolate), tostadas, fruta y besos de postre. Cero prisas.",
    condiciones: "Canjeable cualquier mañana, incluso entre semana.",
  },
  {
    day: 3,
    kind: "foto",
    size: "ancha",
    title: "Nuestra foto favorita",
    text: "Todavía me acuerdo de lo que nos reímos ese día. Esta foto vive en mi cabeza.",
    photos: [{ src: "/imagenes/fotofav.jpg", caption: "nosotros ♡" }],
  },
  {
    day: 4,
    kind: "recuerdo",
    title: "La primera cita",
    fecha: "El día que cambió todo",
    lugar: "Donde empezó lo nuestro",
    text: "Me acuerdo ese dia, te invite a la plaza de unifranz para abrir un sobre del mundial y tomar un freeze, me dormi y fui volando en taxi jajaja y aun asi llegaste tardeee jajaja, estaba nervioso pero cuando llegaste todo fue tan natural y fluido, ahi supe que eras diferente al resto y que te queria a mi lado para toda la vida",
  },
  {
    day: 5,
    kind: "cancion",
    title: "Nuestra canción",
    cancion: "Gone, Gone, Gone",
    artista: "Phillip Phillips",
    text: "Cada vez que suena me acuerdo de ti. Ponla, cierra los ojos y piensa que estoy bailándola contigo.",
  },
  {
    day: 6,
    kind: "razones",
    size: "alta",
    title: "10 razones por las que te quiero",
    intro: "Toca cada corazón para descubrir una razón.",
    razones: [
      "Tu risa, que lo arregla todo.",
      "Cómo achinas los ojos cuando algo te hace gracia.",
      "Que me cuidas incluso cuando no te lo pido.",
      "Tus abrazos largos y fuertes, de los que no se acaban.",
      "Lo bonita que te ves cuando estás concentrada.",
      "Tus mensajes de buenos días.",
      "Que conmigo puedes ser tú, sin filtros.",
      "Lo valiente que eres, aunque no te lo creas.",
      "Que haces que los días normales se sientan especiales.",
      "Que eres tú. Con eso ya bastaba.",
    ],
  },
  {
    day: 7,
    kind: "foto",
    size: "grande",
    title: "Un lugar nuestro",
    text: "Hay sitios que ya no son solo sitios: son nuestros. Tenemos que volver pronto.",
    photos: [
      { src: "/imagenes/lugar1.jpg", caption: "aquí fuimos felices" },
      { src: "/imagenes/lugar2.jpg", caption: "y aquí también" },
      { src: "/imagenes/lugar3.jpeg", caption: "volveremos" },
    ],
  },
  {
    day: 8,
    kind: "vale",
    title: "Un masaje",
    text: "Vale por un masaje",
    detalle: "30 minutos, con música relajante. Sin quejas y sin mirar el reloj.",
    condiciones: "Ampliable a 45 minutos si me das un beso. (y si desea con final feliz jejeje)",
  },
  {
    day: 9,
    kind: "trivia",
    size: "ancha",
    title: "¿Cuánto me conoces?",
    intro:
      "Un mini juego. Elige una respuesta en cada pregunta (no hay presión… bueno, un poquito).",
    preguntas: [
      {
        q: "¿Cuánto te quiero?",
        opciones: ["Mucho", "Muchísimo", "Más que a Messi", "Infinito y un poquito más"],
        correcta: 3,
        nota: "Y me quedo corto.",
      },
      {
        q: "¿Quién se enamoró primero?",
        opciones: ["Tú", "Yo", "Los dos a la vez"],
        correcta: 1,
        nota: "Yo, sin ninguna duda. Y no me arrepiento.",
      },
      {
        q: "¿Cuál es mi momento favorito del día?",
        opciones: [
          "Cuando me escribes",
          "Cuando te veo sonreír",
          "Cuando me abrazas",
          "Todos los que paso contigo",
        ],
        correcta: 3,
        nota: "Era una pregunta trampa: todos.",
      },
    ],
  },
  {
    day: 10,
    kind: "carta",
    title: "Gracias",
    text: `Gracias por estar, por escucharme, por aguantar mis días malos, por nunca soltarme la mano y sostenerme aun cuando ni yo puedo hacerlo y celebrar los buenos como si fueran tuyos.

Gracias por hacer todo más bonito solo con estar cerca.`,
  },
  {
    day: 11,
    kind: "rasca",
    size: "alta",
    title: "Rasca y gana",
    text: "Rasca la tarjeta con el dedo para descubrir tu premio.",
    premio: "¡Una cita sorpresa!",
    detalle: "el dia 20 :3 Yo lo organizo todo, tú solo tienes que dejarte llevar.",
  },
  {
    day: 12,
    kind: "foto",
    title: "Tú, siendo tú",
    text: "Mi foto favorita del mundo. No necesita filtro: ya eres tú.",
    photos: [{ src: "/imagenes/tu.jpg", caption: "mi persona favorita" }],
  },
  {
    day: 13,
    kind: "recuerdo",
    size: "ancha",
    title: "Primera vez en Matilda",
    fecha: "Un dia que no olvido",
    lugar: "Lejos de todo, cerca de ti",
    text: "Ese dia ninguno sabia donde ibamos, ni donde estabamos jajaja pero solo sabiamos algo que mientras estemos juntos nada malo podia pasar",
    photo: { src: "/imagenes/recuerdo.jpg", caption: "Te amo" },
  },
  {
    day: 14,
    kind: "poema",
    title: "Un poema para ti",
    versos: `Si diciembre tiene frío,
yo tengo tu abrazo;
si la noche se hace larga,
me sobra tu regazo.

No necesito más luces
que las de tu mirada,
ni otro regalo este año
que tenerte a mi lado.`,
    autor: "Escrito por mí, para ti",
  },
  {
    day: 15,
    kind: "vale",
    size: "ancha",
    title: "Noche de pelis",
    text: "Vale por una noche de pelis",
    detalle:
      "Tú eliges la peli (incluso esa que ya vimos tres veces). Yo pongo pipocas, manta y chocolate.",
  },
  {
    day: 16,
    kind: "plan",
    size: "alta",
    title: "Una cita navideña",
    text: "Te propongo un plan. Solo tienes que decir que sí y elegir el día.",
    pasos: [
      { hora: "18:00", que: "Paseo para ver las luces de Navidad", icon: "✨" },
      { hora: "19:00", que: "Coffee milk mientras caminamos", icon: "☕" },
      { hora: "20:30", que: "Cena en un sitio bonito", icon: "🍝" },
      { hora: "22:00", que: "pijamada real y peli navideña", icon: "🎬" },
    ],
  },
  {
    day: 17,
    kind: "foto",
    size: "ancha",
    title: "Luces de Navidad",
    text: "Este año las veremos juntos. Y el que viene, y el siguiente…",
    photos: [
      { src: "/imagenes/luces1.jpeg", caption: "luces" },
      { src: "/imagenes/luces2.jpeg", caption: "y tú" },
    ],
  },
  {
    day: 18,
    kind: "recuerdo",
    title: "Cuando supe que te quería",
    fecha: "Ese momento exacto",
    lugar: "Lo tengo grabado",
    text: "No fue nada espectacular: estabas siendo tú, sin más. Fue la noche de Matilda. Todo lo que podía salir mal, salió mal, pero ninguno se estresó, ninguno se enojó: todo fueron risas. Y ahí, en medio del desastre, te miré y pensé: «es ella». Desde entonces no he dejado de pensarlo.",
  },
  {
  day: 19,
  kind: "carta",
  size: "grande",
  title: "Lo que quiero contigo",
  text: `Quiero más viajes, más risas y más días lentos.

Quiero cocinar contigo aunque nos salga mal, bailar en la cocina, discutir por qué peli ver y acabar viendo las dos.

Quiero crecer a tu lado, construir algo que dure, y que nuestros hijos crezcan viendo cuánto se aman sus papás.

Y dentro de muchos años, cuando seamos viejitos, mirarte y decirte bajito: «¿Lo ves? Te dije que te amaría toda mi vida».

Todo, pero contigo.`,
  firma: "Con todo mi corazón",
},
  {
    day: 20,
    kind: "cancion",
    size: "ancha",
    title: "Primera cancion que te dedique",
    cancion: "Say You Won't Let Go",
    artista: "James Arthur",
    text: "Esta fue la primera canción que te dediqué. No sabía lo que venía, pero sí sabía que quería que te quedaras",
  },
  {
    day: 21,
    kind: "razones",
    size: "alta",
    title: "Cosas pequeñas que amo de ti",
    intro: "Las cosas pequeñas también son enormes.",
    razones: [
      "Cómo me miras cuando crees que no me doy cuenta.",
      "Tu forma de cantar las canciones aunque no te sepas la letra.",
      "Que me hagas cosquillas (aunque te diga que no lo hagas).",
      "Tu cara recién despertada.",
      "Que siempre guardes el último bocado para mí.",
      "Cómo me dices perrito.",
    ],
  },
  {
    day: 22,
    kind: "foto",
    title: "Nosotros",
    text: "El mejor equipo. Contigo hasta las fotos movidas salen bonitas.",
    photos: [
      { src: "/imagenes/nosotros.jpg", caption: "equipo" },
      { src: "/imagenes/nosotros1.jpg", caption: "para siempre" },
      { src: "/imagenes/nosotros2.jpg", caption: "♡" },
    ],
  },
  {
    day: 23,
    kind: "vale",
    size: "ancha",
    title: "Un almuerzo navideño",
    text: "Vale por un almuerzo navideño",
    detalle:
      "Mesa bonita, comida rica y brindis, solo para los dos. Yo invito y yo me encargo de todo.",
    condiciones: "Válido durante las fiestas. Incluye postre jejeje.",
  },
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
