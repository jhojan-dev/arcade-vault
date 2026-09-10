"use client";

import Link from "next/link";
import { GAMES, seededScores } from "@/lib/data";
import Reveal from "@/components/reveal";

/* ===== datos mock locales de la landing ===== */

const FEATURES = [
  {
    icon: "trophy",
    title: "Competencia real",
    text: "Cada marca te acerca al Salón de la Fama. El top 3 brilla en el podio.",
  },
  {
    icon: "browser",
    title: "Sin instalación",
    text: "Todo corre en el navegador. Entras, elegís juego y presionás JUGAR.",
  },
  {
    icon: "pulse",
    title: "Stats en vivo",
    text: "Partidas, récords y tablas se actualizan mientras jugás.",
  },
  {
    icon: "coin",
    title: "Créditos diarios",
    text: "Recargás créditos cada día para no cortar nunca la partida.",
  },
];

const STATS = [
  { v: "1.2M", l: "Partidas jugadas" },
  { v: "8", l: "Juegos arcade" },
  { v: "452K", l: "Puntos ganados" },
];

const LIVE_GAMES = [
  { title: "Invasores", players: 128 },
  { title: "Tetromino", players: 96 },
  { title: "Duelo", players: 42 },
];

const PLAN_FEATURES = [
  "Todos los juegos sin límite",
  "Guardado de marcas en el Salón",
  "Insignia exclusiva de campeón",
  "Sin anuncios entre partidas",
];

const FAQ = [
  {
    q: "¿Cómo consigo créditos?",
    a: "Cada día recibís créditos gratis al entrar. También podés ganar más compitiendo en el Salón de la Fama.",
  },
  {
    q: "¿Se guardan mis puntuaciones?",
    a: "Sí. Tu mejor marca y tus partidas se guardan en tu dispositivo y aparecen en tu perfil y en el Salón.",
  },
  {
    q: "¿Puedo jugar sin crear una cuenta?",
    a: "Claro. Entrá como invitado. Si después creás tu cuenta, tus marcas te acompañan.",
  },
  {
    q: "¿Cuándo llegan juegos nuevos?",
    a: "Cada mes se suma un juego al catálogo. Las novedades aparecen primero en la Biblioteca.",
  },
];

const NUM = (n: number) => n.toLocaleString("es-AR");

/* ===== ticker y top 5 deterministas ===== */
const TICKER = seededScores(9, 14).map((r, i) => ({
  name: r.name,
  score: r.score,
  game: GAMES[i % GAMES.length].title,
}));
const TOP5 = seededScores(11, 5);

/* ===== iconos pixel-art 8x8 ===== */
const GLYPHS: Record<string, string[]> = {
  trophy: [
    "..XXXX..",
    ".X....X.",
    "X..XX..X",
    "X..XX..X",
    "X..XX..X",
    ".X....X.",
    "..XXXX..",
    "...XX...",
  ],
  browser: [
    ".XXXXXX.",
    "XX....XX",
    "X......X",
    "X..XX..X",
    "X..XX..X",
    "X......X",
    "XX....XX",
    ".XXXXXX.",
  ],
  pulse: [
    "........",
    "........",
    "....X...",
    "...XX...",
    "..XXXXX.",
    "....XX..",
    "....X...",
    "........",
  ],
  coin: [
    "...XX...",
    "..XXXX..",
    ".XXXXXX.",
    "XX..XX.X",
    "X..XX.XX",
    ".XXXXXX.",
    "..XXXX..",
    "...XX...",
  ],
};

function PixelIcon({ glyph, color = "var(--cyan)" }: { glyph: string[]; color?: string }) {
  const size = glyph[0].length;
  return (
    <svg
      className="icon"
      width="40"
      height="40"
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ color }}
    >
      {glyph.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "x" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
          ) : null
        )
      )}
    </svg>
  );
}

/* ===== siluetas flotantes del hero ===== */
function Silhouettes() {
  const items = [
    { cls: "s1", left: "5%", top: "10%", color: "var(--cyan)", dur: "8s", svg: "ship" },
    { cls: "s2", left: "86%", top: "14%", color: "var(--magenta)", dur: "10s", svg: "blob" },
    { cls: "s3", left: "8%", top: "70%", color: "var(--yellow)", dur: "9s", svg: "brick" },
    { cls: "s4", left: "82%", top: "72%", color: "var(--green)", dur: "11s", svg: "alien" },
    { cls: "s5", left: "72%", top: "4%", color: "var(--cyan)", dur: "7s", svg: "duel" },
  ];
  return (
    <div className="av-silos" aria-hidden="true">
      {items.map((it, i) => (
        <svg
          key={i}
          className="av-silo"
          style={{ left: it.left, top: it.top, color: it.color, animationDuration: it.dur }}
          width="56"
          height="56"
          viewBox="0 0 40 40"
        >
          {it.svg === "ship" && (
            <>
              <path d="M20 3 L31 33 L20 25 L9 33 Z" fill="currentColor" />
              <rect x="17" y="3" width="6" height="9" fill="currentColor" />
            </>
          )}
          {it.svg === "blob" && (
            <>
              <circle cx="20" cy="20" r="15" fill="currentColor" />
              <polygon points="20,20 36,8 36,32" fill="var(--bg)" />
            </>
          )}
          {it.svg === "brick" && (
            <>
              <rect x="5" y="6" width="13" height="12" fill="currentColor" />
              <rect x="18" y="6" width="15" height="12" fill="currentColor" />
              <rect x="18" y="18" width="13" height="16" fill="currentColor" />
            </>
          )}
          {it.svg === "alien" && (
            <path
              d="M8 10 h6 v5 h5 v-5 h6 v12 h-5 v6 h-4 v-6 h-4 v6 h-4 v-6 h-4 Z"
              fill="currentColor"
            />
          )}
          {it.svg === "duel" && (
            <>
              <rect x="5" y="5" width="6" height="18" fill="currentColor" />
              <rect x="29" y="17" width="6" height="18" fill="currentColor" />
              <rect x="17" y="18" width="6" height="6" fill="currentColor" />
            </>
          )}
        </svg>
      ))}
    </div>
  );
}

/* ===== página ===== */
export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="av-hero">
        <Silhouettes />
        <div className="hero-body">
          <h1>Arcade Vault</h1>
          <p className="sub">
            Jugá online &bull; competí por puntos
            <span className="blink"> _</span>
          </p>
          <div className="hero-ctas">
            <Link href="/biblioteca" className="btn lg pulse">
              EXPLORAR JUEGOS
            </Link>
            <Link href="/salon" className="btn ghost lg">
              SALÓN DE LA FAMA
            </Link>
          </div>
          <p className="hero-note">8 juegos · 18 jugadores · 1.2M de marcas</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="av-sec" id="features">
        <div className="head">
          <span className="kicker">// POR QUÉ ARCADE VAULT</span>
          <h2>Una sala de juegos sin fin</h2>
          <p>
            Créditos, récords y un Salón de la Fama que no perdona. Todo lo que
            hace grande a un arcade, en tu navegador.
          </p>
        </div>
        <div className="av-features">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <article className="feature">
                <PixelIcon glyph={GLYPHS[f.icon]} />
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MINI-RAIL */}
      <section className="av-sec">
        <div className="head">
          <span className="kicker">// LOS MÁS JUGADOS</span>
          <h2>Juegos destacados</h2>
        </div>
        <Reveal>
          <div className="av-rail">
            {GAMES.slice(0, 6).map((g) => (
              <Link key={g.id} href={`/detalle/${g.id}`} className="card">
                <div className="cover">
                  <div className={`cover-bg ${g.cover}`} />
                  <span className="label">{g.cat}</span>
                </div>
                <div className="meta">
                  <span className="title">{g.title}</span>
                  <span className="desc">{g.short}</span>
                </div>
                <div className="row">
                  <div className="score-badge">
                    <span>Marca</span>
                    <b>{NUM(g.best)}</b>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="av-sec">
        <Reveal>
          <div className="av-stats">
            {STATS.map((s) => (
              <div key={s.l}>
                <div className="v">{s.v}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ACTIVIDAD EN VIVO */}
      <section className="av-sec">
        <div className="head">
          <span className="kicker">// EN VIVO</span>
          <h2>Actividad del arcade</h2>
          <p>Lo que está pasando ahora mismo en la sala, minuto a minuto.</p>
        </div>
        <Reveal>
          <div className="av-ticker" aria-label="Actividad reciente">
            <div className="ticker-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="ticker-grp" aria-hidden={copy === 1}>
                  {TICKER.map((t, i) => (
                    <span key={i} className="ticker-item">
                      <b>{t.name}</b> sumó {NUM(t.score)} pts en {t.game}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="av-live">
          <Reveal>
            <div className="leaderboard">
              <h3>TOP 5 JUGADORES</h3>
              {TOP5.map((r) => (
                <div key={r.rank} className={`lb-row top${r.rank <= 3 ? r.rank : ""}`}>
                  <span className="rk">{String(r.rank).padStart(2, "0")}</span>
                  <span className="pl">{r.name}</span>
                  <span className="sc">{NUM(r.score)}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="live-panel">
              <h3>EN DIRECTO</h3>
              {LIVE_GAMES.map((g) => (
                <div key={g.title} className="live-game">
                  <span className="nm">{g.title}</span>
                  <span className="ct">
                    <b>{g.players}</b> jugando
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRICING + FAQ */}
      <section className="av-sec">
        <div className="head">
          <span className="kicker">// PLANES</span>
          <h2>Un solo pase, toda la sala</h2>
        </div>
        <div className="av-plans">
          <Reveal>
            <div className="plan-card">
              <span className="tag">EL MÁS ELEGIDO</span>
              <h3>PASE INFINITO</h3>
              <div className="price">
                199 <small>CRD / mes</small>
              </div>
              <ul>
                {PLAN_FEATURES.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button type="button" className="btn">
                OBTENER PASE
              </button>
            </div>
          </Reveal>
          <div className="faq">
            <Reveal delay={80}>
              <h2 className="pixel" style={{ fontSize: 14, letterSpacing: "0.06em" }}>
                PREGUNTAS FRECUENTES
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <div className="faq">
                {FAQ.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="av-end">
        <Reveal>
          <h2>¿Listo para jugar?</h2>
          <p>
            Elegí tu juego: la marca más alta ya tiene tu nombre escrito y un
            lugar en el Salón de la Fama.
          </p>
          <div className="ctas">
            <Link href="/biblioteca" className="btn xl pulse">
              JUGAR AHORA
            </Link>
            <Link href="/salon" className="btn xl ghost">
              VER EL SALÓN
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}