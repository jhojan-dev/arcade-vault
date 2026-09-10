"use client";

import { useMemo, useState } from "react";
import { GAMES, seededScores, readScores, type SavedScore } from "@/lib/data";
import { useUser } from "@/lib/user-context";
import Reveal from "@/components/reveal";

const NUM = (n: number) => n.toLocaleString("es-AR");

export default function Salon() {
  const [gameId, setGameId] = useState<string>(GAMES[0].id);
  const { user } = useUser();

  const scores = useMemo(() => seededScores(1000 + (gameId.charCodeAt(0) * 13) % 9000, 12), [gameId]);

  // "Tu mejor marca" para este juego desde localStorage
  const yourBest = useMemo(() => {
    if (!user) return null;
    const saved = readScores();
    const mine = saved.filter((s) => s.game === gameId && s.name === user);
    if (!mine.length) return null;
    return Math.max(...mine.map((m) => m.score));
  }, [gameId, user]);

  return (
    <main className="av-hall">
      <Reveal>
        <header className="hall-head">
          <h1>Salón de la Fama</h1>
          <p>Los mejores récords por juego · Top 12 determinista · Tu marca destaca</p>
        </header>
      </Reveal>

      <Reveal delay={60}>
        <div className="hall-tabs" role="tablist" aria-label="Filtrar por juego">
          {GAMES.map((g) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={gameId === g.id}
              onClick={() => setGameId(g.id)}
              className="chip"
              style={gameId === g.id ? { color: "var(--magenta)", borderColor: "var(--magenta)", boxShadow: "0 0 10px rgba(255,0,110,0.35)" } : undefined}
            >
              {g.title}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={100}>
        {/* PODIO */}
        <div className="podium">
          <div className="podium-slot silver">
            <div className="rank-num">02</div>
            <div className="name">{scores[1]?.name ?? "—"}</div>
            <div className="score">{NUM(scores[1]?.score ?? 0)}</div>
            <div className="date">2º</div>
          </div>
          <div className="podium-slot gold">
            <div className="rank-num">01</div>
            <div className="name">{scores[0]?.name ?? "—"}</div>
            <div className="score">{NUM(scores[0]?.score ?? 0)}</div>
            <div className="date">CAMPEÓN</div>
          </div>
          <div className="podium-slot bronze">
            <div className="rank-num">03</div>
            <div className="name">{scores[2]?.name ?? "—"}</div>
            <div className="score">{NUM(scores[2]?.score ?? 0)}</div>
            <div className="date">3º</div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140}>
        {/* TABLA TOP 12 */}
        <div className="hall-table">
          <div className="th">
            <span>RANK</span>
            <span>JUGADOR</span>
            <span>PUNTOS</span>
            <span>FECHA</span>
          </div>
          {scores.map((r, i) => (
            <div
              key={r.rank}
              className={`tr${r.rank <= 3 ? ` top${r.rank}` : ""}`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="rk">{String(r.rank).padStart(2, "0")}</span>
              <span className="pl">{r.name}</span>
              <span className="sc">{NUM(r.score)}</span>
              <span className="dt">{r.date}</span>
            </div>
          ))}

          {/* Tu mejor marca */}
          {yourBest && (
            <div className="tr you you-label">
              TU MEJOR MARCA EN {GAMES.find((g) => g.id === gameId)?.title.toUpperCase() ?? gameId}: {NUM(yourBest)}
            </div>
          )}
          {user && !yourBest && (
            <div className="tr you you-label">
              SIN MARCAS EN {GAMES.find((g) => g.id === gameId)?.title.toUpperCase() ?? gameId} — JUGÁ Y SUBÍ AL SALÓN
            </div>
          )}
        </div>
      </Reveal>
    </main>
  );
}