import Link from "next/link";
import { notFound } from "next/navigation";
import { GAMES, seededScores } from "@/lib/data";
import Reveal from "@/components/reveal";

const NUM = (n: number) => n.toLocaleString("es-AR");

/** Hash determinista simple para semillas y elecciones por id. */
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Dificultad determinista 1..3 (estrellas). */
const difficulty = (id: string) => (hashCode(id) % 3) + 1;

/** Semilla para el leaderboard por juego (varía por id). */
const seedFor = (id: string) => 1000 + (hashCode(id) % 9000);

export default async function Detalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();

  const stars = difficulty(game.id);
  const scores = seededScores(seedFor(game.id), 10);
  const tags = [game.cat, "1 JUGADOR", "CÓDIGO 2026"];

  return (
    <div className="av-detail">
      <div className="detail-col">
        <Reveal>
          <div className="detail-cover">
            <div className={`cover-bg ${game.cover}`} />
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="detail-info">
            <h2>{game.title}</h2>
            <div className="detail-tags">
              {tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <p>{game.long}</p>
            <div className="stat-strip">
              <div>
                <div className="l">Partidas</div>
                <div className="v">{game.plays}</div>
              </div>
              <div>
                <div className="l">Mejor marca</div>
                <div className="v">{NUM(game.best)}</div>
              </div>
              <div>
                <div className="l">Dificultad</div>
                <div className="v stars">
                  {Array.from({ length: 3 }, (_, i) => (
                    <span key={i} className={i < stars ? "on" : "off"}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="detail-actions">
              <Link href={`/player/${game.id}`} className="btn lg pulse">
                JUGAR AHORA
              </Link>
              <Link href="/biblioteca" className="btn ghost lg">
                VOLVER
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <aside className="leaderboard">
          <h3>TOP 10 · {game.title.toUpperCase()}</h3>
          {scores.map((r) => (
            <div
              key={r.rank}
              className={`lb-row${r.rank <= 3 ? ` top${r.rank}` : ""}`}
            >
              <span className="rk">{String(r.rank).padStart(2, "0")}</span>
              <span className="pl">{r.name}</span>
              <span className="sc">{NUM(r.score)}</span>
            </div>
          ))}
        </aside>
      </Reveal>
    </div>
  );
}