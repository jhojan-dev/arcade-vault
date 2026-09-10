// lib/data.ts — datos mock de Arcade Vault
// Todos los juegos, categorías, jugadores y el generador determinista
// de leaderboards para el MVP visual.

/* ===== Tipos ===== */

export interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
  cover: string; // CSS class: "cover-bricks", "cover-tetro", etc.
  color: "cyan" | "magenta" | "yellow" | "green";
  best: number;
  plays: string;
}

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string; // "DD/MM/YYYY"
}

export interface User {
  name: string; // max 10 chars, uppercase
}

export interface SavedScore {
  game: string;
  score: number;
  name: string;
  at: number; // Date.now()
}

export type GameCat = Game["cat"];

/* ===== LocalStorage helpers (mock persist) ===== */
export const SAVE_KEY = "av_scores";

export function readScores(): SavedScore[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as SavedScore[]) : [];
  } catch {
    return [];
  }
}

/* ===== Categorías ===== */

export const CATS: { id: GameCat | "ALL"; label: string }[] = [
  { id: "ALL", label: "TODOS" },
  { id: "ARCADE", label: "ARCADE" },
  { id: "PUZZLE", label: "PUZZLE" },
  { id: "SHOOTER", label: "SHOOTER" },
  { id: "VERSUS", label: "VERSUS" },
] as const;

/* ===== Juegos ===== */

export const GAMES: Game[] = [
  {
    id: "breakout",
    title: "Breakout",
    short: "Rompe todos los bloques para avanzar de nivel.",
    long: "Lanza la pelota, rompe cada bloque y no dejes que caiga. " +
      "Cada color de bloque vale distinto y un nivel extra te espera " +
      "cuando limpies la pantalla entera.",
    cat: "ARCADE",
    cover: "cover-bricks",
    color: "cyan",
    best: 12480,
    plays: "214K",
  },
  {
    id: "tetromino",
    title: "Tetromino",
    short: "Encaja las piezas antes de que lleguen al tope.",
    long: "Las piezas caen más rápido cada nivel. Completa líneas, " +
      "encadena combos y mantén la pila bajo control hasta el final.",
    cat: "PUZZLE",
    cover: "cover-tetro",
    color: "yellow",
    best: 24150,
    plays: "182K",
  },
  {
    id: "snake",
    title: "Snake",
    short: "Crece sin chocar contigo mismo. Clásico arcade.",
    long: "Come, crece y esquiva tus propios pasos. El tablero se " +
      "estrecha según avanzas y tu récord se escribe con tu nombre.",
    cat: "ARCADE",
    cover: "cover-snake",
    color: "green",
    best: 8320,
    plays: "96K",
  },
  {
    id: "gloton",
    title: "Glotón",
    short: "Engulle puntos y esquiva a los fantasmas.",
    long: "Un apetito insaciable por puntos brillantes. Esquiva a los " +
      "guardias, activa el modo furia y vacía el laberinto sin perder " +
      "ni una vida.",
    cat: "ARCADE",
    cover: "cover-glot",
    color: "magenta",
    best: 51750,
    plays: "301K",
  },
  {
    id: "invaders",
    title: "Invasores",
    short: "Defiende la línea contra los invasores del espacio.",
    long: "Una flota alienígena desciende fila a fila. Muévete rápido, " +
      "dispara con precisión y derriba al jefe antes de que toque tierra.",
    cat: "SHOOTER",
    cover: "cover-invaders",
    color: "green",
    best: 48900,
    plays: "245K",
  },
  {
    id: "rocas",
    title: "Rocas",
    short: "Evita los asteroides y sobrevive al vacío.",
    long: "Tu nave a la deriva en un campo de rocas. Destruye los " +
      "asteroides grandes, vigila los fragmentos y no te quedes sin " +
      "combustible en mitad de la nada.",
    cat: "SHOOTER",
    cover: "cover-rocas",
    color: "cyan",
    best: 38220,
    plays: "128K",
  },
  {
    id: "rana",
    title: "Rana",
    short: "Cruza la carretera y el río sin perder vida.",
    long: "Lleva a la rana de vuelta a casa. Esquiva el tráfico, salta " +
      "sobre los troncos que se mueven y llega a la orilla antes de " +
      "que se agote el tiempo.",
    cat: "ARCADE",
    cover: "cover-rana",
    color: "yellow",
    best: 15230,
    plays: "64K",
  },
  {
    id: "duelo",
    title: "Duelo",
    short: "Dos jugadores, un campo, solo uno gana.",
    long: "Modo versus local. El campo se divide y ambos compiten por " +
      "el control de la zona central. El primero en dominar gana la ronda.",
    cat: "VERSUS",
    cover: "cover-duelo",
    color: "magenta",
    best: 7400,
    plays: "41K",
  },
];

/* ===== Jugadores ===== */

export const PLAYERS: string[] = [
  "NEO",
  "TETRA",
  "VIPER",
  "PIXEL",
  "ZEUS",
  "GLITCH",
  "R4VEN",
  "TOKIO",
  "KORO",
  "BLINK",
  "CRUX",
  "ONIX",
  "FENIX",
  "KABOOM",
  "NOVA",
  "VOLT",
  "MAKO",
  "RUNNER",
];

/* ===== Deterministic leaderboard ===== */

// PRNG determinista (mulberry32). Mismo seed → misma secuencia.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Genera un leaderboard determinista de `count` filas a partir de un seed numérico.
export function seededScores(seed: number, count: number): ScoreRow[] {
  const rand = mulberry32(seed);
  const rows: ScoreRow[] = [];
  for (let i = 0; i < count; i++) {
    const name = PLAYERS[Math.floor(rand() * PLAYERS.length)];
    const score = 5000 + Math.floor(rand() * 50000); // 5000..54999
    const day = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
    const month = String(1 + Math.floor(rand() * 12)).padStart(2, "0");
    rows.push({ rank: i + 1, name, score, date: `${day}/${month}/2026` });
  }
  rows.sort((a, b) => b.score - a.score);
  rows.forEach((r, i) => {
    r.rank = i + 1;
  });
  return rows;
}